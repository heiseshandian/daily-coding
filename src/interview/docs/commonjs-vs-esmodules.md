### 不同点

-   commonjs 导出的变量可修改，es module 导出的变量不可修改（相当于 es module 导出的内容都是 const）
-   es module 导出的变量按引用传递，即使是基础类型也是按照引用传递，而 commonjs 导出是按照值传递（本来导入的时候就是普通的赋值操作）

```js
// a.js
export let num = 1;

export function addNum() {
    num++;
}

// main.js
import { num, addNum } from './a.js';
console.log(num); //1
addNum();
console.log(num); //2
```

-   commonjs 同步加载并执行模块，es module 会在预处理阶段分析模块依赖，在执行阶段执行模块（本质上是编译时所有 import 会被提到文件顶部）

同时由于 es module 在编译时就能分析出模块依赖关系，可以很好的做 tree shaking。（当然动态 import 是不行的，因为动态 import 是引入整个模块，所以可以把需要动态引入的模块尽可能拆分的更小，确保动态引入的部分都是不需要做 tree shaking 的）

```js
// main.js
console.log('main.js开始执行');
import say from './a.js';
import say1 from './b.js';
console.log('main.js执行完毕');

// a.js
import b from './b.js';
console.log('a模块加载');
export default function say() {
    console.log('hello , world');
}

// b.js
console.log('b模块加载')
export default function sayhello(){
    console.log('hello,world')
}

/*
b模块加载
a模块加载
main.js开始执行
main.js执行完毕
*/
```

### 相同点

两者在解析依赖的时候都是采用 dfs 遍历

#### 参考资料

[「万字进阶」深入浅出 Commonjs 和 Es Module](https://juejin.cn/post/6994224541312483336)
