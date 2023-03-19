interface VNode {
    type: string;
    props?: Record<PropertyKey, any>;
    children: VNode[];
}

interface RendererOptions {
    createElement: (tag: string) => HTMLElement;
    setElementText: (el: HTMLElement, text: string) => void;
    insert: (el: HTMLElement, parent: HTMLElement, anchor?: HTMLElement | null) => void;
    patchProps: (el: HTMLElement, key: string, prevValue: any, newValue: any) => void;
}

interface Container extends HTMLElement {
    _vnode?: VNode;
}

export function createRenderer(options: RendererOptions) {
    const { createElement, setElementText, insert, patchProps } = options;

    function render(vnode: VNode, container: Container) {
        if (vnode) {
            patch(container._vnode, vnode, container);
        } else {
            // 如果vnode不存在切_vnode存在则说明是卸载操作，直接将container清空即可
            if (container._vnode) {
                container.innerHTML = '';
            }
        }

        // 将新的vnode挂在container上，方便下次render的时候取出前一次渲染的vnode
        container._vnode = vnode;
    }

    function patch(n1: VNode | null | undefined, n2: VNode, container: Container) {
        if (!n1) {
            mountElement(n2, container);
        } else {
            //
        }
    }

    function mountElement(vnode: VNode, container: Container) {
        const el = createElement(vnode.type);
        if (vnode.props) {
            for (const key in vnode.props) {
                patchProps(el, key, null, vnode.props[key]);
            }
        }

        if (typeof vnode.children === 'string') {
            setElementText(el, vnode.children);
        } else if (Array.isArray(vnode.children)) {
            vnode.children.forEach((child) => {
                mountElement(child, el);
            });
        }

        insert(el, container);
    }

    return {
        render,
        patch,
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
    createElement(tag: string) {
        return document.createElement(tag);
    },
    setElementText(el: HTMLElement, text: string) {
        el.textContent = text;
    },
    insert(el: HTMLElement, parent: HTMLElement, anchor: HTMLElement | null = null) {
        parent.insertBefore(el, anchor);
    },
    patchProps(el: any, key: string, _prevValue: any, nextValue: any) {
        if (key === 'class') {
            // 使用className比使用classList,setAttribute设置class属性性能更高
            // 这里我们特殊处理下如果是class的话就使用className来设置属性
            el.className = nextValue || '';
        } else if (shouldSetAsDomProps(el, key)) {
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
});

function shouldSetAsDomProps(el: HTMLElement, key: PropertyKey) {
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
