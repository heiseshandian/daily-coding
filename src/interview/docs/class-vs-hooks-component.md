### why hooks

-   类组件需要为方法手动绑定 this（当然，通过箭头函数语法可以避免）

```js
class Foo {
    constructor() {
        this.name = 'foo';
    }

    test() {
        console.log(this.name);
    }

    fn = () => {
        console.log(this.name);
    };
}

const f = new Foo();
// foo
f.test();
// foo
f.fn();

const fn = f.test;
// TypeError: Cannot read properties of undefined (reading 'name')
fn();
```

-   在类组件间复用逻辑很难（HOC 或 render props）
    对于 HOC 来说组件多层嵌套，增加复杂度与理解成本。同名 props 存在覆盖，且多层嵌套难以明确 props 来源，不太便于了解组件逻辑。基于此，render props 应运而生，render props 可以很好解决 HOC 场景下的 props 重名与来源问题。不过 render props 很容易形成多层嵌套。

```js
function withXY(Comp) {
    return () => <Comp x="x" y="y"></Comp>;
}

function withAnotherXY(Comp) {
    return () => <Comp x="another x" y="another y"></Comp>;
}

function SimpleXY({ x, y }) {
    return (
        <div>
            {x},{y}
        </div>
    );
}
const HOC = withXY(withAnotherXY(SimpleXY));

// 最终HOC渲染出来的是 another x,another y
// 也就是说外层包裹传入的props会被内层包裹函数传入的同名props所覆盖
```

```js
// render props导致的多层嵌套地狱
const MyComponent = () => {
    return (
        <Mouse>
            {({ x, y }) => (
                <Page>
                    {({ x: pageX, y: pageY }) => (
                        <Connection>
                            {({ api }) => {
                                // yikes
                            }}
                        </Connection>
                    )}
                </Page>
            )}
        </Mouse>
    );
};
```

-   类组件通过生命周期钩子来引入副作用
    这种方法有个很大的问题就是副作用的逻辑被不同的生命周期钩子所割裂，没办法完全按照逻辑功能来组织代码。比如说添加和销毁监听器，按理说这是个完整的功能，应该放在一起，但在 class 语法里我们只能放在不同的生命周期函数中。同时，这种逻辑上的割裂感还会带来维护上的问题，比如说某天我们需要删除订阅相关功能，那我们需要同时在两个地方删除这些代码。

### hooks

#### 优点

hooks 将副作用引入函数式组件，在逻辑复用上和代码编写上更简洁
可通过自定义 hooks 的方式抽取逻辑，使用时和内置 hooks 一样，逻辑组合能力更强，也没有高阶组件和 render props 所带来的各种问题。

#### 缺点

-   useEffect 需要提供明确的依赖项，当然可以通过 eslint 插件来自动提供
-   强依赖于不可变数据

```js
import {useState, useEffect} from 'react'

export function() useData(api){
  const [data, setDate] = useState([]);
  useEffect(()=>{
    api().then(res=>setData(res.data)) ;
    // 这里要求传入的api是immutable的，被useCallback/useMemo所包裹。
    // 不然每次api一变， 都会非预期地多调用一次useEffect。
  },[api])
}
```

-   useCallback/useMemo 等缓存钩子的使用稍显冗余
