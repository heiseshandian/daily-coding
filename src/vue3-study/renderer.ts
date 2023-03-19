type EventHandler = (e: Event) => any;

interface Invoker {
    (e: Event): any;
    /* 
    实际的事件回调函数，包裹一层是为了做性能优化，不用频繁地调用dom接口来删除添加事件
    */
    value?: EventHandler | EventHandler[];
    /**
     事件绑定时间，用于处理事件冒泡与副作用执行时机冲突问题

     举个例子，有child和parent两个元素，初始时刻只有child身上有click事件，parent上无事件
     在child上触发click事件之后会触发副作用进而为parent绑定事件，绑定之后事件才冒泡到parent上
     我们需要屏蔽这种行为，因为事件发生的时间比事件绑定的时间还早，有点类似于发布订阅模型中的
     先发布后订阅
     */
    attached?: number;
}

interface RenderElement extends HTMLElement {
    _vei?: Partial<Record<string, Invoker>>;
    _vnode?: VNode;
    [key: string]: any;
}

const TextNode = Symbol();
const Fragment = Symbol();

export interface VNode {
    type: string | object | symbol;
    props: Record<PropertyKey, any>;
    children: VNode[] | string;
    el?: RenderElement;
}

interface RendererOptions {
    createElement: (tag: string) => HTMLElement;
    setElementText: (el: RenderElement, text: string) => void;

    createText: (text: string) => any;
    setText: (el: RenderElement, text: string) => void;

    patchProps: (el: RenderElement, key: string, prevValue: any, newValue: any) => void;
    removeChild: (parent: ParentNode, child: HTMLElement) => void;

    insert: (el: RenderElement, parent: HTMLElement, anchor?: HTMLElement | null) => void;
}

export function createRenderer(options: RendererOptions) {
    const { createElement, setElementText, insert, patchProps, removeChild, createText, setText } = options;

    function render(vnode: VNode, container: RenderElement) {
        if (vnode) {
            patch(container._vnode, vnode, container);
        } else {
            // 如果vnode不存在且_vnode存在则说明是卸载操作
            if (container._vnode) {
                unmount(container._vnode);
            }
        }

        // 将新的vnode挂在container上，方便下次render的时候取出前一次渲染的vnode
        container._vnode = vnode;
    }

    function patch(n1: VNode | null | undefined, n2: VNode, container: RenderElement) {
        // 如果旧节点和新节点的类型不同则没有必要patch（比如说老的n1是input，而新的n2是p，那这时候patch是没有意义的）
        // 正确的步骤是卸载旧节点然后挂载新节点
        if (n1 && n1.type !== n2.type) {
            unmount(n1);
            n1 = null;
        }

        const { type } = n2;

        if (typeof type === 'string') {
            if (!n1) {
                mountElement(n2, container);
            } else {
                patchElement(n1, n2);
            }
        } else if (type === TextNode) {
            // 处理文本节点
            if (!n1) {
                const el = (n2.el = createText(n2.children as string));
                insert(el, container);
            } else {
                const el = (n2.el = n1.el);
                if (n1.children !== n2.children) {
                    setText(el!, n2.children as string);
                }
            }
        } else if (type === Fragment) {
            // Fragment本身不渲染任何内容，只用于渲染一组子节点
            // 如果n1不存在，说明是第一次挂载，直接渲染所有子节点即可
            if (!n1) {
                (n2.children as VNode[]).forEach((c) => patch(null, c, container));
            } else {
                patchChildren(n1, n2, container);
            }
        } else {
            // 处理其他类型
        }
    }

    function mountElement(vnode: VNode, container: RenderElement) {
        const el = (vnode.el = createElement(vnode.type as string));
        if (vnode.props) {
            for (const key in vnode.props) {
                patchProps(el, key, null, vnode.props[key]);
            }
        }

        if (typeof vnode.children === 'string') {
            setElementText(el, vnode.children);
        } else if (Array.isArray(vnode.children)) {
            vnode.children.forEach((child) => {
                patch(null, child, el);
            });
        }

        insert(el, container);
    }

    function patchElement(n1: VNode, n2: VNode) {
        const el = (n2.el = n1.el);

        const oldProps = n1.props;
        const newProps = n2.props;

        // 更新或新增props
        for (const key in newProps) {
            if (newProps[key] !== oldProps[key]) {
                patchProps(el!, key, oldProps?.[key], newProps[key]);
            }
        }

        // 删除属性
        for (const key in oldProps) {
            if (!(key in newProps)) {
                patchProps(el!, key, oldProps[key], null);
            }
        }

        patchChildren(n1, n2, el!);
    }

    function patchChildren(n1: VNode, n2: VNode, container: RenderElement) {
        if (typeof n2.children === 'string') {
            // 如果新传入的子节点是字符串，那么当且仅当旧节点是一组子节点的时候才需要逐个卸载，
            // 否则什么都不需要做
            if (Array.isArray(n1.children)) {
                n1.children.forEach((c) => unmount(c));
            }

            setElementText(container, n2.children);
        } else if (Array.isArray(n2.children)) {
            if (Array.isArray(n1.children)) {
                // diff算法
            } else {
                setElementText(container, '');
                n2.children.forEach((c) => patch(null, c, container));
            }
        } else {
            if (Array.isArray(n1.children)) {
                n1.children.forEach((c) => unmount(c));
            } else if (typeof n1.children === 'string') {
                setElementText(container, '');
            }
        }
    }

    function unmount(vnode: VNode) {
        // 对于Fragment只需要逐个卸载children即可
        if (vnode.type === Fragment) {
            (vnode.children as VNode[]).forEach((c) => unmount(c));
            return;
        }

        const parent = vnode.el?.parentNode;
        if (parent) {
            removeChild(parent, vnode.el!);
        }
    }

    return {
        render,
    };
}

export function normalizeClass(cls: any): string {
    if (typeof cls === 'string') {
        return cls;
    }
    if (Array.isArray(cls)) {
        return cls.map((c) => normalizeClass(c)).join(' ');
    }
    return Object.keys(cls)
        .filter((key) => Boolean(cls[key]))
        .join(' ');
}

export const renderer = createRenderer({
    createElement(tag) {
        return document.createElement(tag);
    },
    setElementText(el, text) {
        el.textContent = text;
    },
    insert(el, parent, anchor = null) {
        parent.insertBefore(el, anchor);
    },
    patchProps(el: RenderElement, key, _prevValue, nextValue) {
        if (/^on/.test(key)) {
            const invokers = el._vei || (el._vei = {});
            let invoker = invokers[key];
            const name = key.slice(2).toLowerCase();

            if (nextValue) {
                if (!invoker) {
                    /* 
                    通过封装一个invoker来避免频繁调用removeEventListener和addEventListener
                    */
                    invoker = el._vei[key] = (e) => {
                        // 如果事件触发时间早于事件绑定时间则什么都不做
                        if (e.timeStamp < invoker!.attached!) {
                            return;
                        }

                        if (Array.isArray(invoker!.value)) {
                            invoker!.value.forEach((fn) => fn(e));
                        } else {
                            invoker!.value!(e);
                        }
                    };
                    invoker.value = nextValue;
                    invoker.attached = performance.now();

                    el.addEventListener(name, invoker);
                } else {
                    invoker.value = nextValue;
                }
            } else if (invoker) {
                el.removeEventListener(key, invoker);
            }
        } else if (key === 'class') {
            // 使用className比使用classList,setAttribute设置class属性性能更高
            // 这里我们特殊处理下如果是class的话就使用className来设置属性
            el.className = nextValue || '';
        } else if (shouldSetAsDomProps(el, key)) {
            // el本身是HTMLElement类型，底下没有 [key:string]:any的任意属性签名，这里直接ignore掉
            const type = typeof el[key];
            /**
            用于处理类似disabled类似属性，只写一个disabled属性的意图是希望禁用按钮
            而经过解析的disabled属性会变成
            props:{
                disabled:''
            }
            所以这里我们需要特殊处理下变成
            el.disabled=true
             */
            if (type === 'boolean' && nextValue === '') {
                el[key] = true;
            } else {
                el[key] = nextValue;
            }
        } else {
            /* 
            html attribute一般用于设置dom properties的默认值，且浏览器会对用户传入的默认值做一些校验
            对于不合法的值会手动修复，比如说下面的type其实是不合法的，那么浏览器解析之后相应的dom properties会
            变成text，而用el.getAttribute去获取type的值仍然是foo

            <input type="foo"></input>
            */
            el.setAttribute(key, nextValue);
        }
    },
    removeChild(parent, child) {
        parent.removeChild(child);
    },
    createText(text) {
        return document.createTextNode(text);
    },
    setText(el, text) {
        el.nodeValue = text;
    },
});

function shouldSetAsDomProps(el: RenderElement, key: PropertyKey) {
    /**
     input的form属性是只读的，我们无法通过el.form=value
     的形式来修改它，只能通过浏览器的提供的api来修改它，el.setAttribute(key,value)
     */
    if (key === 'form' && el.tagName === 'INPUT') {
        return false;
    }

    // 判断当前key是否存在于dom properties
    return key in el;
}
