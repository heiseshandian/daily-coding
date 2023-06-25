### new 的过程

```js
function Con(params) {}
const instance = new Con(params);
```

1. 创建一个空对象（obj）
2. 将这个空对象的原型设置为构造函数的原型对象

```js
Object.setPrototypeOf(obj, Con.prototype);
```

3. 将构造函数的 this 指向新创建的对象并执行构造函数

```js
const result = Con.apply(obj, params);
```

4. 若构造函数没有人为返回一个对象类型的值则将这个新建的对象返回（注：在构造函数中手动返回对象会破坏原型继承，因为我们并没有手动为返回的对象绑定原型）

```js
return typeof result === 'object' ? result : obj;
```

### 手动实现一个 newFunction 操作

```js
function newFunction() {
    // 1. 创建一个空对象（obj）
    const obj = Object.create(null);

    const Con = Array.prototype.shift.call(arguments);
    // 2. 将这个空对象的原型设置为构造函数的原型对象
    Object.setPrototypeOf(obj, Con.prototype);

    // 3. 将构造函数的 this 指向新创建的对象并执行构造函数
    const result = Con.apply(obj, arguments);

    // 4. 若构造函数没有人为返回一个对象类型的值则将这个新建的对象返回
    return typeof result === 'object' ? result : obj;
}

function Person() {}
Person.prototype.hello = () => {
    console.log('hello world');
};

const p = newFunction(Person);
p.hello();
```
