enum State {
    Init,
    TagOpen,
    TagStartName,
    Text,
    TagClose,
    TagEndName,
}

enum TokenType {
    StartTagName,
    EndTagName,
    Text,
}

interface Token {
    type: TokenType;
    name?: string;
    content?: string;
}

export function tokenize(str: string): Token[] {
    const tokens: Token[] = [];

    const chars: string[] = [];
    let i = 0;
    let state: State = State.Init;
    while (i < str.length) {
        const char = str[i++];

        switch (state) {
            case State.Init:
                if (char === '<') {
                    state = State.TagOpen;
                } else if (isAlpha(char)) {
                    chars.push(char);
                    state = State.Text;
                }
                break;
            case State.TagOpen:
                if (isAlpha(char)) {
                    chars.push(char);
                    state = State.TagStartName;
                } else if (char === '/') {
                    state = State.TagClose;
                }
                break;
            case State.TagStartName:
                if (isAlpha(char)) {
                    chars.push(char);
                } else if (char === '>') {
                    state = State.Init;
                    tokens.push({
                        type: TokenType.StartTagName,
                        name: chars.join(''),
                    });

                    chars.length = 0;
                }
                break;
            case State.TagClose:
                if (isAlpha(char)) {
                    chars.push(char);
                    state = State.TagEndName;
                }
                break;
            case State.TagEndName:
                if (isAlpha(char)) {
                    chars.push(char);
                } else if (char === '>') {
                    tokens.push({
                        type: TokenType.EndTagName,
                        name: chars.join(''),
                    });
                    chars.length = 0;

                    state = State.Init;
                }
                break;
            case State.Text:
                if (isAlpha(char)) {
                    chars.push(char);
                } else if (char === '<') {
                    tokens.push({
                        type: TokenType.Text,
                        content: chars.join(''),
                    });
                    chars.length = 0;

                    state = State.TagOpen;
                }
                break;
        }
    }

    return tokens;
}

function isAlpha(char: string) {
    return /[a-z]/i.test(char);
}

enum AstNodeType {
    Root = 'Root',
    Element = 'Element',
    Text = 'Text',
}

interface AstNode {
    type: AstNodeType;
    tag?: string;
    content?: string;
    children?: AstNode[];
    jsNode?: JsAstNode;
}

export function parse(str: string): AstNode {
    const tokens = tokenize(str);

    const ast: AstNode = {
        type: AstNodeType.Root,
        children: [],
    };

    const elementStack: AstNode[] = [ast];

    let i = 0;
    while (i < tokens.length) {
        const parent = elementStack[elementStack.length - 1];
        const token = tokens[i++];

        if (token.type === TokenType.StartTagName) {
            const node: AstNode = {
                type: AstNodeType.Element,
                tag: token.name,
                children: [],
            };
            parent.children?.push(node);
            elementStack.push(node);
        } else if (token.type === TokenType.EndTagName) {
            elementStack.pop();
        } else {
            const node: AstNode = {
                type: AstNodeType.Text,
                content: token.content,
            };

            parent.children?.push(node);
        }
    }

    return ast;
}

export function printAst(astNode: AstNode, indent = 1): void {
    console.log('--'.repeat(indent), astNode.type, ' ', getContent(astNode));

    astNode.children?.forEach((c) => {
        printAst(c, indent + 2);
    });
}

function getContent(astNode: AstNode): string {
    if (astNode.type === AstNodeType.Root) {
        return '';
    }
    if (astNode.type === AstNodeType.Element) {
        return astNode.tag!;
    }
    return astNode.content!;
}

type ExitFn = () => void;

type NodeTransformer = (node: AstNode, context: TraverseNodeContext) => ExitFn | void;

interface TraverseNodeContext {
    nodeTransforms: NodeTransformer[];
    currentNode: AstNode | null;
    // 当前访问的节点在父节点的children中位置索引
    childIndex: number;
    parent: AstNode | null;

    // 访问到某个节点的时候将某个节点替换为另外的节点
    replaceNode: (newNode: AstNode) => void;
    // 删除正在访问的节点
    removeNode: () => void;
}

/* 
通过传入context的形式将节点的遍历访问和节点的操作分开
*/
function traverseNode(ast: AstNode, context: TraverseNodeContext) {
    context.currentNode = ast;
    const exitFns: ExitFn[] = [];

    for (let i = 0; i < context.nodeTransforms.length; i++) {
        const exitFn = context.nodeTransforms[i](context.currentNode, context);
        if (exitFn) {
            exitFns.push(exitFn);
        }

        // 如果在某个transformer中当前节点被删除则直接return，不用继续执行后续的transformers
        if (!context.currentNode) {
            return;
        }
    }

    const children = ast.children;
    if (children) {
        /* 
        FIXME:从前到后访问如果在后续traverseNode删除子节点会有问题
        */
        for (let i = 0; i < children.length; i++) {
            // 递归调用traverseNode之前将当前节点设置为父节点
            context.parent = context.currentNode;
            context.childIndex = i;

            traverseNode(children[i], context);
        }
    }

    /**
     逆序执行

     transformA 进入节点
        transformB 进入节点
        transformB 退出节点
     transformA 退出节点
     */
    for (let i = exitFns.length - 1; i >= 0; i--) {
        exitFns[i]();
    }
}

export function transform(ast: AstNode) {
    const context: TraverseNodeContext = {
        currentNode: null,
        childIndex: 0,
        parent: null,
        nodeTransforms: [transformRoot, transformElement, transformText],

        replaceNode(newNode) {
            const children = context.parent?.children;
            if (children) {
                children[context.childIndex] = newNode;
                context.currentNode = newNode;
            }
        },
        removeNode() {
            const children = context.parent?.children;
            if (children) {
                children.splice(context.childIndex, 1);
                context.currentNode = null;
            }
        },
    };

    traverseNode(ast, context);

    return ast.jsNode;
}

enum JsAstNodeType {
    StringLiteral = 'StringLiteral',
    Identifier = 'Identifier',
    CallExpression = 'CallExpression',
    ArrayExpression = 'ArrayExpression',
    FunctionDecl = 'FunctionDecl',
    ReturnStatement = 'ReturnStatement',
}

interface JsAstNode {
    type: JsAstNodeType;
    id?: JsAstNode;
    params?: JsAstNode[];
    body?: JsAstNode[];
    return?: JsAstNode;
    value?: string;
    name?: string;
    elements?: JsAstNode[];
    callee?: JsAstNode;
    arguments?: JsAstNode[];
}

function createStringLiteral(value: string): JsAstNode {
    return {
        type: JsAstNodeType.StringLiteral,
        value,
    };
}

function createIdentifier(name: string): JsAstNode {
    return {
        type: JsAstNodeType.Identifier,
        name,
    };
}

function createArrayExpression(elements: JsAstNode[]): JsAstNode {
    return {
        type: JsAstNodeType.ArrayExpression,
        elements,
    };
}

function createCallExpression(callee: string, args: JsAstNode[]): JsAstNode {
    return {
        type: JsAstNodeType.CallExpression,
        callee: createIdentifier(callee),
        arguments: args,
    };
}

function transformText(node: AstNode) {
    if (node.type !== AstNodeType.Text) {
        return;
    }

    node.jsNode = createStringLiteral(node.content!);
}

function transformElement(node: AstNode): ExitFn {
    return () => {
        if (node.type !== AstNodeType.Element) {
            return;
        }

        const callExp = createCallExpression('h', [createStringLiteral(node.tag!)]);
        if (node.children!.length === 1) {
            callExp.arguments?.push(node.children![0].jsNode!);
        } else {
            callExp.arguments?.push(createArrayExpression(node.children!.map((c) => c.jsNode!)));
        }

        node.jsNode = callExp;
    };
}

function transformRoot(node: AstNode): ExitFn {
    return () => {
        if (node.type !== AstNodeType.Root) {
            return;
        }

        const jsNode = node.children?.[0].jsNode;

        node.jsNode = {
            type: JsAstNodeType.FunctionDecl,
            id: createIdentifier('render'),
            params: [],
            body: [
                {
                    type: JsAstNodeType.ReturnStatement,
                    return: jsNode,
                },
            ],
        };
    };
}

interface GenerateContext {
    code: string;
    push: (code: string) => void;

    currentIndent: number;
    // 缩进
    indent: () => void;
    deIndent: () => void;

    // 换行
    newLine: () => void;
}

export function generate(node: JsAstNode): string {
    const context: GenerateContext = {
        code: '',
        push(code) {
            context.code += code;
        },
        currentIndent: 0,
        newLine() {
            context.code += '\n' + '  '.repeat(context.currentIndent);
        },
        indent() {
            context.currentIndent++;
            context.newLine();
        },
        deIndent() {
            context.currentIndent--;
            context.newLine();
        },
    };

    genNode(node, context);

    return context.code;
}

function genNode(node: JsAstNode, context: GenerateContext) {
    switch (node.type) {
        case JsAstNodeType.FunctionDecl:
            genFunctionDecl(node, context);
            break;
        case JsAstNodeType.ReturnStatement:
            genReturnStatement(node, context);
            break;
        case JsAstNodeType.CallExpression:
            genCallExpression(node, context);
            break;
        case JsAstNodeType.StringLiteral:
            genStringLiteral(node, context);
            break;
        case JsAstNodeType.ArrayExpression:
            genArrayExpression(node, context);
            break;
    }
}

function genFunctionDecl(node: JsAstNode, context: GenerateContext) {
    const { push, indent, deIndent } = context;
    push(`function ${node.id?.name}`);
    push('(');
    genNodeList(node.params!, context);
    push(')');
    push('{');
    indent();
    node.body?.forEach((n) => genNode(n, context));
    deIndent();
    push('}');
}

function genReturnStatement(node: JsAstNode, context: GenerateContext) {
    const { push } = context;
    push('return ');
    genNode(node.return!, context);
}

function genCallExpression(node: JsAstNode, context: GenerateContext) {
    const { push } = context;
    const { callee, arguments: args } = node;

    push(`${callee?.name}(`);
    // 生成参数列表
    genNodeList(args!, context);
    push(')');
}

function genStringLiteral(node: JsAstNode, context: GenerateContext) {
    const { push } = context;
    push(`'${node.value}'`);
}

function genArrayExpression(node: JsAstNode, context: GenerateContext) {
    const { push } = context;

    push('[');
    genNodeList(node.elements!, context);
    push(']');
}

function genNodeList(nodes: JsAstNode[], context: GenerateContext) {
    const { push } = context;
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        genNode(node, context);
        if (i < nodes.length - 1) {
            push(', ');
        }
    }
}
