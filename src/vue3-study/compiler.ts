enum State {
    Initial,
    TagOpen,
    TagName,
    Text,
    TagEnd,
    TagEndName,
}

enum TokenType {
    Tag,
    Text,
    TagEnd,
}

function isAlpha(char: string): boolean {
    return /[a-zA-Z]/.test(char);
}

interface Token {
    type: TokenType;
    name?: string;
    content?: string;
}

function tokenize(str: string) {
    let currentState = State.Initial;

    const chars: string[] = [];
    const tokens: Token[] = [];

    while (str) {
        const char = str[0];
        switch (currentState) {
            case State.Initial:
                if (char === '<') {
                    currentState = State.TagOpen;
                    str = str.slice(1);
                } else if (isAlpha(char)) {
                    currentState = State.Text;
                    chars.push(char);
                    str = str.slice(1);
                }
                break;
            case State.TagOpen:
                if (isAlpha(char)) {
                    currentState = State.TagName;
                    chars.push(char);
                    str = str.slice(1);
                } else if (char === '/') {
                    currentState = State.TagEnd;
                    str = str.slice(1);
                }
                break;
            case State.TagName:
                if (isAlpha(char)) {
                    chars.push(char);
                    str = str.slice(1);
                } else if (char === '>') {
                    currentState = State.Initial;

                    tokens.push({
                        type: TokenType.Tag,
                        name: chars.join(''),
                    });
                    chars.length = 0;
                    str = str.slice(1);
                }
                break;
            case State.Text:
                if (isAlpha(char)) {
                    chars.push(char);
                    str = str.slice(1);
                } else if (char === '<') {
                    currentState = State.TagOpen;

                    tokens.push({
                        type: TokenType.Text,
                        content: chars.join(''),
                    });
                    chars.length = 0;
                    str = str.slice(1);
                }
                break;
            case State.TagEnd:
                if (isAlpha(char)) {
                    currentState = State.TagEndName;
                    chars.push(char);
                    str = str.slice(1);
                }
                break;
            case State.TagEndName:
                if (isAlpha(char)) {
                    chars.push(char);
                    str = str.slice(1);
                } else if (char === '>') {
                    currentState = State.Initial;

                    tokens.push({
                        type: TokenType.TagEnd,
                        name: chars.join(''),
                    });
                    chars.length = 0;

                    str = str.slice(1);
                }
                break;
        }
    }

    return tokens;
}

enum NodeType {
    // 为了方便看节点类型
    Element = 'Element',
    Text = 'Text',
    Root = 'Root',
}

interface ASTNode {
    type: NodeType;
    name?: string;
    content?: string;
    children: any[];
}

function parse(str: string) {
    const tokens = tokenize(str);
    const root: ASTNode = {
        type: NodeType.Root,
        children: [],
    };

    const elementStack = [root];

    while (tokens.length > 0) {
        // 一次消费一个token
        const token = tokens.shift();
        const parent = elementStack[elementStack.length - 1];

        switch (token?.type) {
            case TokenType.Tag:
                const tagNode = {
                    type: NodeType.Element,
                    name: token.name,
                    children: [],
                };

                parent.children.push(tagNode);
                elementStack.push(tagNode);
                break;
            case TokenType.Text:
                const textNode = {
                    type: NodeType.Text,
                    content: token.content,
                };

                parent.children.push(textNode);
                break;
            case TokenType.TagEnd:
                elementStack.pop();
                break;
        }
    }

    return root;
}

function dump(node: ASTNode, indent = 0) {
    const { type } = node;
    const desc = type === NodeType.Root ? '' : type === NodeType.Element ? node.name : node.content;

    console.log(`${'-'.repeat(indent)}${type}:${desc}`);

    if (node.children) {
        node.children.forEach((child) => dump(child, indent + 2));
    }
}

interface TraverseNodeContext {
    // 当前正在处理的节点
    currentNode?: ASTNode;
    // 当前节点的父节点
    parent?: ASTNode;
    // 当前节点在父节点的children中的位置索引信息
    childIndex?: number;

    replaceNode?: (node: ASTNode, context: TraverseNodeContext) => void;
    removeNode?: (node: ASTNode, context: TraverseNodeContext) => void;

    nodeTransforms: Array<(currentNode: ASTNode, context: TraverseNodeContext) => void>;
}

function traverseNode(ast: ASTNode, context: TraverseNodeContext) {
    context.currentNode = ast;

    for (let i = 0; i < context.nodeTransforms.length; i++) {
        context.nodeTransforms[i](ast, context);

        // 任何转换函数都可能直接移除当前节点，如果当前节点已经被移除，后续就不用递归处理了，直接返回即可
        if (!context.currentNode) {
            return;
        }
    }

    const { children } = ast;
    if (children) {
        for (let i = 0; i < children.length; i++) {
            context.parent = ast;
            context.childIndex = i;

            traverseNode(children[i], context);
        }
    }
}

function transform(ast: ASTNode) {
    const context: TraverseNodeContext = {
        nodeTransforms: [transformElement, transformText],
        replaceNode(node, context) {
            if (context.parent) {
                context.parent.children[context.childIndex!] = node;

                // 旧节点已经被我们替换成node，当前处理的节点也要变过来
                context.currentNode = node;
            }
        },
        removeNode(node, context) {
            if (context.parent) {
                context.parent.children.splice(context.childIndex!, 1);

                // 删除之后将当前处理节点置空
                context.currentNode = undefined;
            }
        },
    };

    traverseNode(ast, context);
}

function transformElement(node: ASTNode, context: TraverseNodeContext) {
    if (node.type === NodeType.Element && node.name === 'p') {
        node.name = 'h1';
    }
}

function transformText(node: ASTNode, context: TraverseNodeContext) {
    if (node.type === NodeType.Text) {
        node.content = node.content?.repeat(2);
    }
}

const ast = parse('<div><p>Vue</p></div>');
transform(ast);

dump(ast);
