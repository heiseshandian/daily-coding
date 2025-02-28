export interface Beverage {
  // 共有方法，抽象父类负责实现，但这里其实不是重点，模板方法关注的重点是使用模版方法封装算法执行顺序
  boilWater?: () => void;

  /* 
    模版方法，由抽象父类来负责实现，里面封装了算法框架，指导子类以何种顺序去执行哪些方法
    */
  init?: () => void;

  brew: () => void;
  pourInCup: () => void;
  addCondiments: () => void;

  // hooks
  // 用于支持算法的可变部分
  shouldAddCondiments?: () => boolean;
}

const throwSubClassShouldImplementMethodsError = (name: string) => {
  throw new Error(`${name} should be implemented by the subClass`);
};

export class AbstractBeverage implements Beverage {
  shouldAddCondiments() {
    return true;
  }

  boilWater() {
    console.log('boil water');
  }

  init() {
    this.boilWater();
    this.brew();
    this.pourInCup();

    // 在模版中可能变化的部分添加钩子，由子类掌控是否执行算法的某个可变部分
    if (this.shouldAddCondiments()) {
      this.addCondiments();
    }
  }

  brew() {
    throwSubClassShouldImplementMethodsError('brew');
  }

  pourInCup() {
    throwSubClassShouldImplementMethodsError('pourInCup');
  }

  addCondiments() {
    throwSubClassShouldImplementMethodsError('addCondiments');
  }
}

export class Tea implements Beverage {
  boilWater?: (() => void) | undefined;
  init?: (() => void) | undefined;
  brew() {
    console.log('用沸水泡茶');
  }

  pourInCup() {
    console.log('把茶倒入杯子');
  }

  addCondiments() {
    console.log('添加柠檬');
  }
}

export class Coffee implements Beverage {
  boilWater?: (() => void) | undefined;
  init?: (() => void) | undefined;
  brew() {
    console.log('用沸水冲泡咖啡');
  }

  pourInCup() {
    console.log('把咖啡倒入杯子');
  }

  addCondiments() {
    console.log('添加糖');
  }

  innerShouldAddCondiments: boolean = true;

  constructor(shouldAddCondiments?: boolean) {
    if (shouldAddCondiments !== undefined) {
      this.innerShouldAddCondiments = shouldAddCondiments;
    }
  }

  shouldAddCondiments() {
    return this.innerShouldAddCondiments;
  }
}

/* 
hooks

模版中定义了算法框架，规定子类中的方法以何种顺序执行，不过也有一些特殊场景，比如说上面的例子，未必所有的
都喜欢在自己的饮料中加糖或者柠檬。那么我们有什么办法可以使得子类跳过模版方法的约束呢？

钩子方法（hook）可以用来解决这个问题，放置钩子是隔离变化的一种常见手段。
我们在父类中容易变化的地方放置钩子，钩子可以有一个默认的实现，究竟要不要“挂钩”，
这由子类自行决定。钩子方法的返回结果决定了模板方法后面部分的执行步骤，
也就是程序接下来的走向，这样一来，程序就拥有了变化的可能。
*/

/* 
通过传递参数的形式来实现模版模式
*/
export class Beverage2 implements Beverage {
  options: Beverage;

  constructor(options: Beverage) {
    this.options = options;
  }

  boilWater() {
    console.log('把水煮沸');
  }

  init() {
    this.boilWater();
    this.brew();
    this.pourInCup();

    // 在模版中可能变化的部分添加钩子，由子类掌控是否执行算法的某个可变部分
    if (this.shouldAddCondiments()) {
      this.addCondiments();
    }
  }

  brew() {
    this.options.brew();
  }

  pourInCup() {
    this.options.pourInCup();
  }

  addCondiments() {
    this.options.addCondiments();
  }

  shouldAddCondiments() {
    if (this.options.shouldAddCondiments) {
      return this.options.shouldAddCondiments();
    }
    return true;
  }
}

export const tea = new Beverage2({
  brew() {
    console.log('brew');
  },
  pourInCup() {
    console.log('pourInCup');
  },
  addCondiments() {
    console.log('pourInCup');
  },
});

export const coffee = new Beverage2({
  brew() {
    console.log('brew');
  },
  pourInCup() {
    console.log('pourInCup');
  },
  addCondiments() {
    console.log('pourInCup');
  },

  shouldAddCondiments() {
    return false;
  },
});
