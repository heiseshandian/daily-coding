### var

- 全局作用域或函数作用域
- 存在变量提升，也就是 var 声明的变量会被提升到作用域顶部
- 可重复定义和更新其值，多人合作场景下可能会出现一些问题，比如说 B 无意间覆盖了 A 定义的全局变量

### let

- 块级作用域（`{}`包裹的代码块）
- 变量可重新赋值但是同一个块内不可重复声明
- 存在变量提升（也就是说 js 引擎知道变量是存在的），不过不会为其设定默认的初始值。在声明前使用会抛出 `Reference Error` 引用错误

```js
// ReferenceError: Cannot access 'number' before initialization
console.log(number);
let number = 10;

// ReferenceError: number2 is not defined
console.log(number2);
let number = 10;
```

### const

- 块级作用域
- 声明时就需要赋值，不可更新或重新赋值
- const 的变量提升行为和 let 类似，声明前不可使用，称为 `Temporal Dead Zone`
