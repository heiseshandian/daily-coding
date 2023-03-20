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
    key: PropertyKey;
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

    insert: (el: RenderElement, parent: HTMLElement, anchor?: ChildNode | null) => void;
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

    function patch(n1: VNode | null | undefined, n2: VNode, container: RenderElement, anchor?: ChildNode | null) {
        // 如果旧节点和新节点的类型不同则没有必要patch（比如说老的n1是input，而新的n2是p，那这时候patch是没有意义的）
        // 正确的步骤是卸载旧节点然后挂载新节点
        if (n1 && n1.type !== n2.type) {
            unmount(n1);
            n1 = null;
        }

        const { type } = n2;

        if (typeof type === 'string') {
            if (!n1) {
                mountElement(n2, container, anchor);
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

    function mountElement(vnode: VNode, container: RenderElement, anchor?: ChildNode | null) {
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

        insert(el, container, anchor);
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
            // 简单diff算法
            if (Array.isArray(n1.children)) {
                const oldChildren = n1.children;
                const newChildren = n2.children;

                let lastFoundIndex = 0;
                // 通过两层for循环来找老节点中可复用的节点
                for (let i = 0; i < newChildren.length; i++) {
                    let found = false;
                    for (let j = 0; j < oldChildren.length; j++) {
                        // 在旧节点中找可以复用的节点
                        if (newChildren[i].key === oldChildren[j].key) {
                            found = true;
                            patch(oldChildren[j], newChildren[i], container);

                            if (j < lastFoundIndex) {
                                const prevNode = newChildren[i - 1];
                                if (prevNode) {
                                    const anchor = prevNode.el!.nextSibling;
                                    insert(newChildren[i].el!, container, anchor);
                                }
                            } else {
                                lastFoundIndex = j;
                            }
                            break;
                        }
                    }

                    // 如果没有找到可复用的节点说明是新增节点
                    if (!found) {
                        const prevVNode = newChildren[i - 1];
                        let anchor: ChildNode | null = null;
                        if (prevVNode) {
                            // 如果有前一个vnode节点，则使用它的下一个兄弟节点作为锚点元素
                            anchor = prevVNode.el!.nextSibling;
                        } else {
                            // 如果没有前一个vnode节点，说明即将挂载的新节点是第一个子节点
                            // 这时我们使用容器元素的firstChild作为锚点
                            anchor = container.firstChild;
                        }

                        patch(null, newChildren[i], container, anchor);
                    }
                }

                // 删除不存在的节点
                for (let i = 0; i < oldChildren.length; i++) {
                    const has = newChildren.find((v) => v.key === oldChildren[i].key);
                    if (!has) {
                        unmount(oldChildren[i]);
                    }
                }
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

    /* 
    快速diff算法

    借鉴纯文本Diff算法的预处理步骤，前后相等的部分直接跳过
    */
    // make ts happy(unused functions)
    // @ts-ignore
    function patchKeyedChildren(n1: VNode, n2: VNode, container: RenderElement) {
        const oldChildren = n1.children as VNode[];
        const newChildren = n2.children as VNode[];

        // 处理相同的前置节点
        let j = 0;
        let oldNode = oldChildren[j];
        let newNode = newChildren[j];
        while (oldNode.key === newNode.key) {
            patch(oldNode, newNode, container);
            j++;

            oldNode = oldChildren[j];
            newNode = newChildren[j];
        }

        // 处理相同的后置节点
        let oldEnd = oldChildren.length - 1;
        let newEnd = newChildren.length - 1;
        oldNode = oldChildren[oldEnd];
        newNode = newChildren[newEnd];
        while (oldNode.key === newNode.key) {
            patch(oldNode, newNode, container);
            oldNode = oldChildren[--oldEnd];
            newNode = newChildren[--newEnd];
        }

        // 老节点处理完，只剩下新增节点,j-->newEnd之间的节点应该作为新节点插入
        if (oldEnd < j && newEnd >= j) {
            const anchorIndex = newEnd + 1;
            const anchor = anchorIndex < newChildren.length ? newChildren[anchorIndex].el : null;

            while (j <= newEnd) {
                patch(null, newChildren[j++], container, anchor);
            }
        } else if (j > newEnd && j <= oldEnd) {
            // 新节点已经处理完，只剩下需要卸载的老节点
            while (j <= oldEnd) {
                unmount(oldChildren[j++]);
            }
        } else {
            // 新的一组子节点中剩余未处理节点的数量
            const toBePatched = newEnd - j + 1;

            /* 
            用于存储新的组子节点在旧的一组子节点中的位置索引，并用来计算出一个最长递增子序列，可
            用于辅助完成DOM移动操作
            */
            const source = new Array(toBePatched);
            source.fill(-1);

            const oldStart = j;
            const newStart = j;
            const newKeyIndexMap: Partial<Record<PropertyKey, number>> = {};
            for (let k = newStart; k <= newEnd; k++) {
                newKeyIndexMap[newChildren[k].key] = k;
            }

            // 用于判断是否需要移动节点
            let moved = false;
            let lastIndex = 0;

            // 已经经过patch的节点
            let patched = 0;

            // 遍历旧节点中未处理的节点
            for (let i = oldStart; i <= oldEnd; i++) {
                if (patched >= toBePatched) {
                    unmount(oldChildren[i]);
                    continue;
                }

                const newIndex = newKeyIndexMap[oldChildren[i].key];
                if (newIndex !== undefined) {
                    patch(oldChildren[i], newChildren[newIndex], container);
                    patched++;

                    // source数组是从0开始，所以需要减去newStart修复下索引
                    // 存储新的一组节点在老节点中的位置信息
                    source[newIndex - newStart] = i;

                    if (newIndex < lastIndex) {
                        moved = true;
                    } else {
                        lastIndex = newIndex;
                    }
                } else {
                    // 没有找到对应的新节点，说明需要卸载掉
                    unmount(oldChildren[i]);
                }
            }

            const seq = moved ? getSequence(source) : [];
            let s = seq.length - 1;
            // 这里之所以从后往前是因为可以利用后面先插入的节点作为锚点
            for (let i = toBePatched - 1; i >= 0; i--) {
                const pos = i + newStart;
                const nextPos = pos + 1;
                const anchor = nextPos < newChildren.length ? newChildren[nextPos].el : null;

                if (source[i] === -1) {
                    // 新增节点，需要patch并插入到正确位置
                    patch(null, newChildren[pos], container, anchor);
                } else if (moved) {
                    if (s < 0 || i !== seq[s]) {
                        // 上面已经patch过，只需要移动到正确的位置即可
                        insert(newChildren[pos].el!, container, anchor);
                    } else {
                        // 当前节点属于最长递增子序列，上面已经patch过，不用移动，直接s--即可
                        s--;
                    }
                }
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

// 返回最长递增子序列的索引信息
function getSequence(arr: number[]): number[] {
    const p = arr.slice();
    const result = [0];
    let i, j, u, v, c;
    const len = arr.length;
    for (i = 0; i < len; i++) {
        const arrI = arr[i];
        if (arrI !== 0) {
            j = result[result.length - 1];
            if (arr[j] < arrI) {
                p[i] = j;
                result.push(i);
                continue;
            }
            u = 0;
            v = result.length - 1;
            while (u < v) {
                c = (u + v) >> 1;
                if (arr[result[c]] < arrI) {
                    u = c + 1;
                } else {
                    v = c;
                }
            }
            if (arrI < arr[result[u]]) {
                if (u > 0) {
                    p[i] = result[u - 1];
                }
                result[u] = i;
            }
        }
    }
    u = result.length;
    v = result[u - 1];
    while (u-- > 0) {
        result[u] = v;
        v = p[v];
    }
    return result;
}
