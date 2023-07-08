### 不同点

#### 从使用上来说

-   commonjs 支持动态导入，支持通过 exports 和 module.exports 两种方式来导入，es modules 只支持通过 import 和 export 关键字实现导入导出
    commonjs 模块下不推荐 exports 和 module.exports 混用，有些情况下容易出现问题，因为 exports 本质上只是 module.exports 的一个引用，如果 exports.x 的形式导出一些成员，然后又以 module.exports 的形式导出一整个对象，那么 exports 的形式就会失效，因为整个 exports 对象都被覆盖了。

```js
// a.js
exports.a = 1;
module.exports = {};

// main.js
const a = require('./a.js');

// {}
console.log(a);
```

-   commonjs 导出的对象本质上是 module.exports 的浅复制，在导入模块中可重新赋值，而 es modules 导出的变量本质上是对原有变量的引用，或者说 live bindings，在引入模块中不可被修改，就算对基础类型来说也是如此

```js
// a.js
export let num = 1;

export function addNum() {
    num++;
}

// main.js
import { num, addNum } from './a.js';

// 1
console.log(num);
addNum();
// 2
console.log(num);
```

```js
// a.js
export let num = 1;

// main.js
import { num } from './a.js';

// TypeError: Assignment to constant variable.
num = 1;
```

#### 从执行时机上来说

-   commonjs 是同步加载并执行，依赖解析采用 dfs 算法，而 es modules 是先解析依赖，也是 dfs 方式，然后执行代码（本质上是在编译的时候将静态 import 提升到代码顶部）
    这也是为什么 es modules 可以被用于 tree shaking，因为在代码执行之前依赖关系就是确定的。当然，后面增加了 dynamic import 之后由于是动态全部导入所以不太好做 tree shaking，一种权衡的方案可能是让被动态导入的模块尽可能小，保证被动态导入的所有内容都会被使用到。

#### 其他的一些点

-   两者都通过缓存来避免重复加载
-   commonjs 在 require 的时候会先创建一个空的 module 对象，然后缓存起来，这样在下次加载这个模块的时候就会直接从缓存中返回，也就不会出现循环依赖的时候彼此等待的情况，但是这种情况下同步上下文中是拿不到一些具体的方法的，因为实际的模块代码并没有加载完成。es modules 则是通过先分析依赖关系，再执行模块代码的形式，同时借助缓存，天然的就能避免循环等待执行。

```

#### 参考资料

[「万字进阶」深入浅出 Commonjs 和 Es Module](https://juejin.cn/post/6994224541312483336)
```
