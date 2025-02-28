/* 
职责链模式的定义是：使多个对象都有机会处理请求，从而避免请求的发送者和接收者之间的耦合关系，
将这些对象连成一条链，并沿着这条链传递该请求，直到有一个对象处理它为止。

请求发送者只需要知道链中的第一个节点，从而弱化了发送者和一组接收者之间的强联系。
*/
enum OrderType {
  // 500元定金预购，得到100优惠券
  VIP1,
  // 200元定金预购，得到50优惠券
  VIP2,
  Normal,
}

export function order(orderType: OrderType, pay: boolean, stock: number) {
  if (orderType === OrderType.VIP1) {
    if (pay === true) {
      console.log('500元定金预购，得到100元优惠券');
    } else {
      if (stock > 0) {
        console.log('普通购买，无优惠券');
      } else {
        console.log('手机库存不足');
      }
    }
  } else if (orderType === OrderType.VIP2) {
    if (pay === true) {
      console.log('200元定金预购，得到50元优惠券');
    } else {
      if (stock > 0) {
        console.log('普通购买，无优惠券');
      } else {
        console.log('手机库存不足');
      }
    }
  } else {
    if (stock > 0) {
      console.log('普通购买，无优惠券');
    } else {
      console.log('手机库存不足');
    }
  }
}

/* 
使用责任链模式重构代码
*/
interface Chainable {
  shouldGoNext?: boolean;
  [key: number | string | symbol]: any;
}

function order500(
  orderType: OrderType,
  pay: boolean,
  _stock: number
): Chainable {
  let shouldGoNext = true;
  if (orderType === OrderType.VIP1 && pay === true) {
    console.log('500元定金预购，得到100元优惠券');
    shouldGoNext = false;
  }

  return {
    shouldGoNext,
  };
}

function order200(
  orderType: OrderType,
  pay: boolean,
  _stock: number
): Chainable {
  let shouldGoNext = true;
  if (orderType === OrderType.VIP2 && pay === true) {
    console.log('200元定金预购，得到50元优惠券');
    shouldGoNext = false;
  }

  return {
    shouldGoNext,
  };
}

function orderNormal(
  _orderType: OrderType,
  _pay: boolean,
  stock: number
): Chainable {
  if (stock > 0) {
    console.log('普通购买，无优惠券');
  } else {
    console.log('手机库存不足');
  }

  return {
    shouldGoNext: false,
  };
}

type ChainItem = (...args: any[]) => Chainable | void;

// export class Chain {
//     fns: ChainItem[];

//     constructor(fns: ChainItem[] = []) {
//         this.fns = fns;
//     }

//     public add(fn: (...args: any[]) => Chainable) {
//         this.fns.push(fn);
//     }

//     public run(...args: any[]) {
//         for (let i = 0; i < this.fns.length; i++) {
//             const fn = this.fns[i];
//             const { shouldGoNext } = fn.apply(fn, args);
//             if (!shouldGoNext) {
//                 break;
//             }
//         }
//     }
// }

// const orderChain = new Chain([order500, order200, orderNormal]);

// orderChain.run(0, true, 500);
// orderChain.run(1, true, 500);
// orderChain.run(2, true, 500);
// orderChain.run(0, false, 0);

export class Chain {
  fn: ChainItem;
  nextChain?: Chain;

  constructor(fn: ChainItem, nextChain?: Chain) {
    this.fn = fn;
    this.nextChain = nextChain;
  }

  public setNextChain(nextChain: Chain) {
    return (this.nextChain = nextChain);
  }

  // 执行责任链，并自行判断是否需要将请求转给下一个对象
  public run(...args: any[]): Chainable | void {
    const result = this.fn.apply(this, args);
    if (result?.shouldGoNext && this.nextChain) {
      return this.nextChain.run.apply(this.nextChain, args);
    }

    return result;
  }

  // 用于支持异步的责任链，某个节点自行决定是否继续往下传
  public next(...args: any[]): Chainable | void {
    if (this.nextChain) {
      return this.nextChain.run.apply(this.nextChain, args);
    }

    return {
      shouldGoNext: true,
    };
  }
}

export function initChain(fns: ChainItem[]) {
  if (fns.length === 0) {
    return;
  }

  const first = new Chain(fns.shift()!);

  fns.reduce((curChain, next) => {
    const nextChain = new Chain(next);
    curChain.setNextChain(nextChain);
    return nextChain;
  }, first);

  return first;
}

const chain = initChain([order500, order200, orderNormal])!;

chain.run(0, true, 500);
chain.run(1, true, 500);
chain.run(2, true, 500);
chain.run(0, false, 0);

/* 
异步的责任链

此处不能使用箭头表达式，箭头表达式的this有特定的binding规则，不受call,apply传入的context影响
*/
const chain1 = initChain([
  function () {
    console.log(1);
    return {
      shouldGoNext: true,
    };
  },
  function () {
    console.log(2);
    setTimeout(() => {
      this.next();
    }, 1000);

    // 先返回false，异步处理完成后再手动调用next来传递到下一个节点
    return {
      shouldGoNext: false,
    };
  },
  function () {
    console.log(3);
  },
])!;
chain1.run();

/* 
在JavaScript开发中，职责链模式是最容易被忽视的模式之一。
实际上只要运用得当，职责链模式可以很好地帮助我们管理代码，
降低发起请求的对象和处理请求的对象之间的耦合性。
职责链中的节点数量和顺序是可以自由变化的，我们可以在运行时决定链中包含哪些节点。

无论是作用域链、原型链，还是DOM节点中的事件冒泡，我们都能从中找到职责链模式的影子。
职责链模式还可以和组合模式结合在一起，用来连接部件和父部件，或是提高组合对象的效率。
*/
