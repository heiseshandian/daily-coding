const TextModes = {
    DATA: 'DATA',
    // 浏览器遇到title和textarea时会切换到RCDATA模式，此模式下也不会把<当做标签开始，所以我们可以在textarea中直接写<符号而不用转义
    RCDATA: 'RCDATA',
    //进入此模式后所有内容被当成普通文本
    // style|xmp|iframe|noembed|noframes|noscript
    RAWTEXT: 'RAWTEXT',
    /*  
    浏览器遇到<![CDATA[时会切换到模式，在xhtml中写脚本的时候为了避免转义script中的<>，浏览器进入
    CDATA模式后会把<当做小于符号，而不是标签开始
    */
    CDATA: 'CDATA',
};

function parse(str) {
    const context = {
        // 待解析的字符串
        source: str,
        // 解析器初始处于DATA状态，支持解析html标签
        mode: TextModes.DATA,
        // 用于消费指定长度的字符
        advanceBy(num) {
            context.source = context.source.slice(num);
        },
        // 用于消费无用的空白字符
        advanceSpaces() {
            const match = /^\s+/.exec(context.source);
            if (match) {
                context.advanceBy(match[0].length);
            }
        },
    };

    const nodes = parseChildren(context, []);

    return {
        type: 'Root',
        children: nodes,
    };
}

/* 
本质上是一个状态机，有多少种子状态取决于子节点的类型数量，元素子节点可以是如下几种
1) 标签节点，比如说<div>
2) 文本插值节点，比如说{{val}}
3) 普通文本节点 例如text
4）注释节点，例如 <!---->
5）CDATA节点，比如说<![CDATA[xxx]]>
*/
function parseChildren(context, parentStack) {
    const nodes = [];
    const { mode, source } = context;

    while (!isEnd(context, parentStack)) {
        let node;

        // 只有data和rcdata模式下才支持插值节点的解析
        if (mode === TextModes.DATA || mode === TextModes.RCDATA) {
            if (mode === TextModes.DATA && source[0] === '<') {
                if (source[1] === '!') {
                    if (source.startsWith('<!--')) {
                        node = parseComment(context);
                    } else if (source.startsWith('<![CDATA[')) {
                        node = parseCDATA(context, parentStack);
                    }
                } else if (source[1] === '/') {
                } else if (/a-z/i.test(source[1])) {
                    node = parseElement(context, parentStack);
                }
            } else if (source.startsWith('{{')) {
                node = parseInterpolation(context);
            }
        }

        if (!node) {
            node = parseText(context);
        }

        nodes.push(node);
    }

    return nodes;
}

function isEnd(context, parentStack) {
    // 字符串消费完停止
    if (!context.source) {
        return true;
    }

    for (let i = parentStack.length - 1; i >= 0; i--) {
        if (context.source.startsWith(`</${parentStack[i].tag}`)) {
            return true;
        }
    }
    return false;
}

function parseElement(context, parentStack) {
    const element = parseTag(context);
    if (element.isSelfClosing) {
        return element;
    }

    // 根据当前解析到的标签切换状态机状态
    if (element.tag === 'textarea' || element.tag === 'title') {
        context.mode = TextModes.RCDATA;
    } else if (/style|xmp|iframe|noembed|noframes|noscript/.test(element)) {
        context.mode = TextModes.RAWTEXT;
    } else {
        context.mode = TextModes.DATA;
    }

    // 如果标签不是自闭合的我们就要开启新的状态机去解析子节点
    parentStack.push(element);
    element.children = parseChildren(context, parentStack);
    parentStack.pop();

    // 处理完子节点之后再来处理当前节点的闭合节点
    if (context.source.startsWith(`</${element.tag}`)) {
        parseTag(context, 'end');
    } else {
        console.error(`${element.tag} 缺少闭合标签`);
    }

    return element;
}

function parseTag(context, type = 'start') {
    const { advanceBy, advanceSpaces } = context;

    const match =
        type === 'start' ? /^<([a-z][^\s/>]*)/i.exec(context.source) : /^<\/([a-z][^\s/>]*)/i.exec(context.source);
    const tag = match[1];
    // 消费match匹配的所有内容比如说 <div
    advanceBy(match[0].length);
    // 消费标签中无用的空白字符
    advanceSpaces();

    const props = parseAttributes(context);

    const isSelfClosing = context.source.startsWith('/>');
    advanceBy(isSelfClosing ? 2 : 1);

    return {
        type: 'Element',
        tag: tag.toLowerCase(),
        props,
        children: [],
        isSelfClosing,
    };
}

function parseAttributes(context) {
    const { advanceBy, advanceSpaces } = context;

    const props = [];
    while (!context.source.startsWith('>') && !context.source.startsWith('/>')) {
        const match = /^[^\s/>][^\s/>=]*/.exec(context.source);
        const name = match[0];

        advanceBy(name.length);
        advanceSpaces();
        // 消费等于号(暂时不考虑没有等于号的场景)
        advanceBy(1);
        advanceSpaces();

        let value = '';
        const quote = context.source[0];
        const isQuoted = quote === '"' || quote === "'";

        if (isQuoted) {
            // 消费引号
            advanceBy(1);
            const endQuoteIndex = context.source.indexOf(quote);
            if (endQuoteIndex > -1) {
                value = context.source.slice(0, endQuoteIndex);
                // 消费属性值
                advanceBy(value.length);
                // 消费结尾引号
                advanceBy(1);
            } else {
                console.error('缺少引号');
            }
        } else {
            const match = /^[^\s>]+/.exec(context.source);
            value = match[0];
            advanceBy(value.length);
        }

        props.push({
            type: 'Attribute',
            name,
            value,
        });
    }

    return props;
}

function parseText(context) {
    const endIndex = Math.min(0, context.source.length, context.source.indexOf('>'), context.source.indexOf('}}'));
    const content = context.source.slice(0, endIndex);

    advanceBy(content.length);

    return {
        type: 'Text',
        content,
    };
}
