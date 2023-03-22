import { decodeHtml } from './decodeHtml';

enum TextMode {
    // 初始模式
    Data,
    // 解析器遇到<title>和<textarea>标签时会进入RCData mode
    // 支持html实体解析
    RCData,
    // 解析器遇到<![CDATA时会进入CData mode
    CData,
    // 解析器遇到<style>,<xmp>,<iframe>,<noframes>,<noscript>等标签会进入RawText模式
    RawText,
}

enum AstNodeType {
    Root,
    Element,
    Attribute,
    Text,
    Interpolation,
    Expression,
    Comment,
    CData,
}

interface AstNode {
    type: AstNodeType;
    children?: AstNode[];

    // Element
    tag?: string;
    isSelfClosing?: boolean;
    props?: AstNode[];

    // Attribute
    name?: string;
    value?: string;

    // Text
    content?: string | AstNode;
}

interface ParseContext {
    // 待消费的字符
    source: string;
    /* 
    解析器当前处于何种工作模式，不同工作模式下解析器对于字符的解析会有不同的结果
    比如说在RCData模式下解析器遇到 < 字符时不再进入标签开始状态，而是进入 
    RCData less than sign state，也就是说在RCData模式下是不支持解析标签的
    如下标签会直接展示为 <div>hello</div>
    <textarea>
        <div>hello</div>
    </textarea>

    https://html.spec.whatwg.org/multipage/parsing.html#rcdata-state
    */
    mode: TextMode;
    // 消费指定数量的字符
    advanceBy: (num: number) => void;
    // 消费空白字符
    advanceSpaces: () => void;
}

/* 
使用递归下降算法构造模版AST
*/
export function parse(str: string): AstNode {
    const context: ParseContext = {
        source: str,
        mode: TextMode.Data,
        advanceBy(num) {
            context.source = context.source.slice(num);
        },
        advanceSpaces() {
            const match = /^\s+/.exec(context.source);
            if (match) {
                context.advanceBy(match[0].length);
            }
        },
    };

    const nodes = parseChildren(context, []);

    return {
        type: AstNodeType.Root,
        children: nodes,
    };
}

/* 
本质上也是个状态机

子节点类型
1）标签节点 <div>
2）文本插值 {{val}}
3）普通文本 text
4）注释节点<!---->
5) CDATA节点 <![CDATA[xxx]]>
*/
function parseChildren(context: ParseContext, parentStack: AstNode[]): AstNode[] {
    const { mode, source } = context;
    const nodes: AstNode[] = [];

    while (!isEnd(context, parentStack)) {
        let node: AstNode | null = null;

        // Data模式下才支持解析标签节点,注释节点和CDATA节点
        if (mode === TextMode.Data && source[0] === '<') {
            if (source[1] === '!') {
                if (source.startsWith('<!--')) {
                    node = parseComment(context);
                } else if (source.startsWith('<![CDATA[')) {
                    node = parseCData(context);
                }
            } else if (source[1] === '/') {
                /* 
                parseElement中会完整解析一个标签，正常来说不可能出现子状态机以</开头
                的情况，如果遇到说明是</没有与之匹配的开始标签，此时我们应该抛出错误
                */
                console.error('无效的结束标签');
                continue;
            } else if (/[a-z]/i.test(source[1])) {
                node = parseElement(context, parentStack);
            }
        }

        // Data和RCData模式下支持解析文本插值节点
        if ((mode === TextMode.Data || mode === TextMode.RCData) && source.startsWith('{{')) {
            node = parseInterpolation(context);
        }

        // 其他情况都当成普通文本来解析
        if (!node) {
            node = parseText(context);
        }

        nodes.push(node);
    }

    return nodes;
}

function isEnd(context: ParseContext, parentStack: AstNode[]): boolean {
    // 模版内容消费完毕，状态机停止
    if (!context.source) {
        return true;
    }

    /*
    支持解析诸如 <div><span></div></span> 形式的标签
     */
    for (let i = 0; i < parentStack.length; i++) {
        if (context.source.startsWith(`</${parentStack[i].tag}`)) {
            return true;
        }
    }

    // const parent = parentStack[parentStack.length - 1];
    // // 若遇到结束标签，且该标签与同级节点同名则停止子状态机
    // // 每次遇到开始节点会把该标签加入parentStack中
    // if (parent && context.source.startsWith(`</$${parent.tag}`)) {
    //     return true;
    // }
    return false;
}

function parseElement(context: ParseContext, parentStack: AstNode[]): AstNode {
    const element = parseTag(context);
    if (element.isSelfClosing) {
        return element;
    }

    // 根据解析到的标签切换不同的文本模式
    if (element.tag === 'textarea' || element.tag === 'title') {
        context.mode = TextMode.RCData;
    } else if (/style|xmp|noembed|noframes|noscript/.test(element.tag!)) {
        context.mode = TextMode.RawText;
    } else {
        context.mode = TextMode.Data;
    }

    parentStack.push(element);
    element.children = parseChildren(context, parentStack);
    parentStack.pop();

    if (context.source.startsWith(`</${element.tag}>`)) {
        parseTag(context, true);
    } else {
        // 比如说 <div><span></div>
        console.error(`${element.tag} 缺少闭合标签`);
    }

    return element;
}

const START_TAG_REG = /^<([a-z][^\s/>]*)/i;
const END_TAG_REG = /^<\/([a-z][^\s/>]*)/i;

function parseTag(context: ParseContext, isEnd = false): AstNode {
    const { advanceBy, advanceSpaces } = context;
    const match = isEnd ? END_TAG_REG.exec(context.source)! : START_TAG_REG.exec(context.source)!;
    const tag = match[1];

    advanceBy(match[0].length);
    advanceSpaces();
    const props = parseAttributes(context);

    const isSelfClosing = context.source.startsWith('/>');
    // 如果是自闭合标签消费 /> 否则消费 >
    advanceBy(isSelfClosing ? 2 : 1);

    return {
        type: AstNodeType.Element,
        tag,
        isSelfClosing,
        children: [],
        props,
    };
}

const ATTR_NAME_REG = /^[^\s/>][^\s=/>]*/;

function parseAttributes(context: ParseContext): AstNode[] {
    const props: AstNode[] = [];
    const { advanceBy, advanceSpaces } = context;

    while (!context.source.startsWith('>') && !context.source.startsWith('/>')) {
        const match = ATTR_NAME_REG.exec(context.source)!;
        const name = match[0];

        advanceBy(name.length);
        advanceSpaces();
        // 消费等于号 仅考虑 propName="value" propName='value' propName=value 三种情况
        // 暂时不考虑 只有propName的情况
        advanceBy(1);
        advanceSpaces();

        let value = '';
        const quote = context.source[0];
        const isQuoted = quote === "'" || quote === '"';
        if (isQuoted) {
            // 消费开始引号
            advanceBy(1);
            const endQuoteIndex = context.source.indexOf(quote);
            if (endQuoteIndex > -1) {
                // 如果存在引号，则两个引号之间的内容就是属性值
                value = context.source.slice(0, endQuoteIndex);
                advanceBy(value.length);
                // 消费结尾引号
                advanceBy(1);
            } else {
                console.error('缺少结尾引号');
            }
        } else {
            // 属性值没有被引号扩住，直到下一个空白字符前都是属性值
            const match = /^[^\s]+/.exec(context.source)!;
            value = match[0];
            advanceBy(value.length);
        }

        // 消费属性值后面的空白字符
        advanceSpaces();

        props.push({
            type: AstNodeType.Attribute,
            name,
            value,
        });
    }

    return props;
}

function parseText(context: ParseContext): AstNode {
    const { advanceBy } = context;

    let endIndex = context.source.length;
    const lessThanIndex = context.source.indexOf('<');
    const delimiterIndex = context.source.indexOf('{{');
    if (lessThanIndex !== -1) {
        endIndex = Math.min(endIndex, lessThanIndex);
    }
    if (delimiterIndex !== -1) {
        endIndex = Math.min(endIndex, delimiterIndex);
    }

    const content = context.source.slice(0, endIndex);
    advanceBy(content.length);

    return {
        type: AstNodeType.Text,
        content: decodeHtml(content),
    };
}

function parseInterpolation(context: ParseContext): AstNode {
    const { advanceBy } = context;

    advanceBy('{{'.length);
    const endIndex = context.source.indexOf('}}');
    if (endIndex === -1) {
        console.error('缺少结束定界符 }}');
    }

    const content = context.source.slice(0, endIndex);
    advanceBy(content.length);
    advanceBy('}}'.length);

    return {
        type: AstNodeType.Interpolation,
        content: {
            type: AstNodeType.Expression,
            content: decodeHtml(content),
        },
    };
}

function parseComment(context: ParseContext): AstNode {
    const { advanceBy } = context;

    advanceBy('<!--'.length);
    const endIndex = context.source.indexOf('-->');
    if (endIndex === -1) {
        console.error('缺少结束定界符 -->');
    }

    const content = context.source.slice(0, endIndex);
    advanceBy(content.length);
    advanceBy('-->'.length);

    return {
        type: AstNodeType.Comment,
        content,
    };
}

function parseCData(context: ParseContext): AstNode {
    const { advanceBy } = context;

    advanceBy('<![CDATA['.length);
    const endIndex = context.source.indexOf(']]>');
    if (endIndex === -1) {
        console.error('缺少结束定界符 ]]>');
    }

    const content = context.source.slice(0, endIndex);
    advanceBy(content.length);
    advanceBy(']]>'.length);

    return {
        type: AstNodeType.CData,
        content,
    };
}
