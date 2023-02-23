function createRenderer(options) {
    // 自定义渲染器并不是“黑魔法”，它只是通过抽象的手段，让核心代码不再依赖平台特有的 API，再通过支持个性化配置的能力来实现跨平台。
    const { createElement, setElementText, insert, patchProps } = options;

    function render(vnode, container) {
        // 新的node存在，则直接交给patch
        if (vnode) {
            patch(container._vnode, vnode, container);
        } else {
            // 这种方式清空有很多问题
            /* 
            1) 如果销毁的是组件，则组件的unmounted, onBeforeUnmount等钩子函数没有正确执行
            2）dom上绑定的事件没有正常销毁
            */
            // container.innerHTML = '';

            if (container._vnode) {
                unmount(container._vnode);
            }
        }

        // 更新或挂载结束之后将当前vnode赋值给老的vnode
        container._vnode = vnode;
    }

    function patch(oldVNode, newVNode, container, anchor) {
        // 新旧节点类型一致才有打补丁的必要，否则之前的应该先被卸载掉，比如说之前是个input元素，现在换成了一个p元素
        // 那我们应该先把之前的input元素卸载掉，然后重新挂载p节点
        if (oldVNode && oldVNode.type !== newVNode.type) {
            unmount(oldVNode);
            oldVNode = null;
        }

        // 普通节点，组件
        const { type } = newVNode;

        if (typeof type === 'string') {
            // 普通标签节点
            if (!oldVNode) {
                mountElement(newVNode, container, anchor);
            } else {
                patchElement(oldVNode, newVNode);
            }
        } else if (typeof type === 'object') {
            // 组件节点
        }
    }

    function patchElement(oldVNode, newVNode) {
        const el = (newVNode.el = oldVNode.el);
        const oldProps = oldVNode.props;
        const newProps = newVNode.props;

        // 新增或修改属性
        for (const key in newProps) {
            if (newProps[key] !== oldProps[key]) {
                patchProps(el, key, oldProps[key], newProps[key]);
            }
        }

        // 删除属性
        for (const key in oldProps) {
            if (!(key in newProps)) {
                patchProps(el, key, oldProps[key], null);
            }
        }

        patchChildren(oldVNode, newVNode, el);
    }

    function patchChildren(oldVNode, newVNode, container) {
        if (typeof newVNode.children === 'string') {
            // 旧节点有三种可能，文本，无子节点，数组，只有数组场景才需要逐个卸载原先节点
            if (Array.isArray(oldVNode.children)) {
                oldVNode.children.forEach((child) => {
                    unmount(child);
                });
            }

            setElementText(container, newVNode.children);
        } else if (Array.isArray(newVNode.children)) {
            if (Array.isArray(oldVNode.children)) {
                const oldChildren = oldVNode.children;
                const newChildren = newVNode.children;

                let lastIndex = 0;
                for (let i = 0; i < newChildren.length; i++) {
                    let found = false;
                    for (let j = 0; j < oldChildren.length; j++) {
                        // 最大限度的复用旧节点上的dom元素
                        if (newChildren[i].key === oldChildren[j].key) {
                            found = true;

                            patch(oldChildren[j], newChildren[i], container);

                            if (j < lastIndex) {
                                // 如果当前找到的节点在旧children中的索引值大于上一次的索引值
                                // 则该节点对应的真实dom需要移动
                                const prevVNode = newChildren[i - 1];
                                if (prevVNode) {
                                    const nextSibling = prevVNode.el.nextSibling;
                                    insert(newChildren[i].el, container, nextSibling);
                                }
                            } else {
                                lastIndex = j;
                            }
                            break;
                        }
                    }

                    // 遍历完所有的旧节点还没找到可复用节点
                    if (!found) {
                        const prevVNode = newChildren[i - 1];
                        let anchor = null;
                        if (prevVNode) {
                            anchor = prevVNode.el.nextSibling;
                        } else {
                            anchor = container.firstChild;
                        }

                        patch(null, newChildren[i], container, anchor);
                    }
                }

                // 删除旧节点
                for (let i = 0; i < oldChildren.length; i++) {
                    const has = newChildren.find((child) => child.key === oldChildren[i].key);

                    // 旧节点没有在新节点中找到对应节点说明需要删除掉
                    if (!has) {
                        unmount(oldChildren[i]);
                    }
                }
            } else {
                // 旧节点要么是文本节点，要么是空，我们只需要清空文本即可
                setElementText(container, '');

                newVNode.children.forEach((child) => patch(null, child, container));
            }
        } else {
            // 只有旧节点，没有新节点，只需要区分旧节点的类型然后卸载掉即可
            if (Array.isArray(oldVNode.children)) {
                oldVNode.children.forEach((child) => unmount(child));
            } else {
                setElementText(container, '');
            }
        }
    }

    function patchKeyedChildren(n1, n2, container) {
        const oldChildren = n1.children;
        const newChildren = n2.children;

        let oldStartIndex = 0;
        let oldEndIndex = oldChildren.length - 1;
        let newStartIndex = 0;
        let newEndIndex = newChildren.length - 1;

        let oldStartNode = oldChildren[oldStartIndex];
        let oldEndNode = oldChildren[oldEndIndex];
        let newStartNode = newChildren[newStartIndex];
        let newEndNode = newChildren[newEndNode];

        while (newStartIndex <= newEndIndex && oldStartIndex <= oldEndIndex) {
            if (!oldStartNode) {
                // 后面我们在四种匹配都没找到的情况下暴力枚举oldChildren中所有节点，如果找到节点的话已经把节点移动到其他位置并把相应位置的oldChildren[i]置空
                // 这里需要处理下
                oldStartNode = oldChildren[++oldStartIndex];
            } else if (!oldEndNode) {
                oldEndNode = oldChildren[--oldEndIndex];
            } else if (oldStartNode.key === newStartNode.key) {
                patch(oldStartNode, newStartNode, container);

                oldStartNode = oldChildren[++oldStartIndex];
                newStartNode = newChildren[++newStartIndex];
            } else if (oldEndNode.key === newEndNode.key) {
                patch(oldEndNode, newEndNode, container);

                oldEndNode = oldChildren[--oldEndIndex];
                newEndNode = newChildren[--newEndIndex];
            } else if (oldStartNode.key === newEndNode.key) {
                patch(oldStartNode, newEndNode, container);

                // 旧头部现在变成了新的尾部，所以我们需要把oldStartNode.el插入到oldEndNode.el之后
                insert(oldStartNode.el, container, oldEndNode.el.nextSibling);

                oldStartNode = oldChildren[++oldStartIndex];
                newEndNode = newChildren[--newEndIndex];
            } else if (oldEndNode.key === newStartNode.key) {
                patch(oldEndNode, newStartNode, container);

                // 旧节点之前在最后，在newChildren中在第一，所以我们需要把
                // oldEndNode.el移动到oldStartNode.el之前，变成新的第一
                insert(oldEndNode.el, container, oldStartNode.el);

                oldEndNode = oldChildren[--oldEndIndex];
                newStartNode = newChildren[++newStartIndex];
            } else {
                const indexInOld = oldChildren.findIndex((child) => child.key === newStartNode.key);
                // 此处不会出现等于0的场景，如果出现上面第一个判断条件必然命中
                if (indexInOld > 0) {
                    const vnodeToMove = oldChildren[indexInOld];
                    patch(vnodeToMove, newStartNode, container);
                    // 将vnodeToMove移动到头部
                    insert(vnodeToMove.el, container, oldStartNode.el);

                    // indexInOld处的dom元素已经移动到了头部，我们这里置空下
                    oldChildren[indexInOld] = undefined;
                } else {
                    patch(null, newStartNode, container, oldStartNode.el);
                }

                newStartNode = newChildren[++newStartIndex];
            }
        }

        // 还有新增节点需要挂载
        if (newStartIndex <= newEndIndex) {
            for (let i = newStartIndex; i <= newEndIndex; i++) {
                patch(null, newChildren[i], container, oldStartNode.el);
            }
        }

        // 还有旧节点需要删除
        if (oldStartIndex <= oldEndIndex) {
            for (let i = oldStartIndex; i <= oldEndIndex; i++) {
                if (oldChildren[i]) {
                    unmount(oldChildren[i]);
                }
            }
        }
    }

    function unmount(vnode) {
        const parent = vnode.el.parentNode;
        if (parent) {
            parent.removeChild(vnode.el);
        }
    }

    function mountElement(vnode, container, anchor) {
        const el = createElement(vnode.type);

        // 将实际dom节点挂在vnode上，后续卸载的时候可以拿到实际的dom元素
        vnode.el = el;

        if (vnode.props) {
            /* 
            html attributes和dom properties并不是一一对应的（class vs className）
            html attributes会被用来设置dom properties的初始值，对于一些不合法的初始值浏览器会校验并将对应的dom properties设置为合法值
            */
            for (const key in vnode.props) {
                const value = vnode.props[key];
                patchProps(el, key, null, value);
            }
        }

        // 子节点是字符串直接设置文本内容
        if (typeof vnode.children === 'string') {
            setElementText(el, vnode.children);
        } else if (Array.isArray(vnode.children)) {
            // 递归处理子节点列表
            vnode.children.forEach((node) => {
                mountElement(node, el);
            });
        }

        // 把节点挂在到容器上
        insert(el, container, anchor);
    }

    return { render };
}

const renderer = createRenderer({
    createElement(tag) {
        return document.createElement(tag);
    },
    setElementText(el, text) {
        el.textContent = text;
    },
    insert(el, parent, anchor) {
        parent.insertBefore(el, anchor);
    },
    patchProps(el, key, prevValue, nextValue) {
        const type = typeof el[key];

        // 处理事件
        if (/^on/.test(key)) {
            // 避免频繁的调用removeEventListener和addEventListener来卸载和添加事件
            // 设计成对象是因为同一个元素上会绑定多种事件类型，click,mouseover等
            const invokers = el._vei || (el._vei = {});

            // onClick -> click
            const name = key.slice(2).toLowerCase();

            let invoker = invokers[key];

            if (nextValue) {
                if (!invoker) {
                    invoker = (e) => {
                        // 在事件冒泡等场景中，可能存在事件触发的时候父组件上还没绑定事件，等到事件冒泡到父组件上
                        // 时父组件又绑定了事件，这时候按理说不应该触发父组件上的事件处理函数
                        if (e.timeStamp < invoker.attached) {
                            return;
                        }

                        // 支持同一类型事件绑定多个处理函数
                        if (Array.isArray(invoker.value)) {
                            invoker.value.forEach((fn) => fn(e));
                        } else {
                            invoker.value(e);
                        }
                    };
                    invoker.attached = performance.now();

                    el._vei[key] = invoker;

                    invoker.value = nextValue;

                    el.addEventListener(name, invoker);
                } else {
                    invoker.value = nextValue;
                }
            } else {
                // 新的事件处理函数不存在说明需要移除之前的事件绑定
                el.removeEventListener(name, invoker);
            }
        } else if (key === 'class') {
            // 对class特殊处理
            el.className = nextValue || '';
        } else if (shouldSetAsProps(el, key, nextValue)) {
            // 比如说disabled属性，用户只传入一个disabled:''的本意是想禁用按钮，如果直接
            // el.disabled=''会变成el.disabled=false也就是不禁用按钮，这里我们手动修复下
            if (type === 'boolean' && value === '') {
                el[key] = true;
            }

            el[key] = value;
        } else {
            el.setAttribute(key, nextValue);
        }
    },
});

function shouldSetAsProps(el, key, value) {
    // input的form属性只读，使用寻常的input.form=newValue方式无法修改
    // 这里其实不止input的form属性是只读的，只是为了说明属性的处理要考虑的因素和边界条件
    if (key === 'form' && el.tagName === 'INPUT') {
        return false;
    }

    return key in el;
}

function normalizeClass(classNames) {
    // 字符串，数组，对象，可以嵌套
    if (typeof classNames === 'string') {
        return classNames;
    } else if (Array.isArray(classNames)) {
        return classNames.map((className) => normalizeClass(className)).join(' ');
    } else {
        // 对象
        return Object.keys(classNames)
            .reduce((acc, cur) => {
                if (classNames[cur]) {
                    acc += ` ${cur}`;
                }
                return acc;
            }, '')
            .trim();
    }
}
