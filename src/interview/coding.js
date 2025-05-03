/* 
实现一个防抖函数 debounce，要求支持：

立即执行模式（leading）

触发后返回 Promise（支持 async/await 用法）
*/
export function debounce(fn, delay, leading = false) {
  let timer = null;
  let lastContext = null;

  return function debouncedFn(...args) {
    lastContext = this;

    return new Promise((resolve, reject) => {
      if (leading && !timer) {
        try {
          const result = fn.apply(lastContext, args);
          resolve(result);
        } catch (error) {
          reject(error);
        }

        // 设置定时器，在延迟时间内阻止再次立即执行
        timer = setTimeout(() => {
          timer = null;
        }, delay);
      } else {
        if (timer) {
          clearTimeout(timer);
        }

        timer = setTimeout(() => {
          try {
            const result = fn.apply(lastContext, args);
            resolve(result);
          } catch (error) {
            reject(error);
          }

          timer = null;
        }, delay);
      }
    });
  };
}

export class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(eventName, handler) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(handler);
  }

  emit(eventName, ...args) {
    if (this.events[eventName]) {
      this.events[eventName].forEach((handler) => {
        handler(...args);
      });
    }
  }

  off(eventName, handler) {
    if (!handler) {
      delete this.events[eventName];
      return;
    }

    if (this.events[eventName]) {
      const index = this.events[eventName].indexOf(handler);
      if (index !== -1) {
        this.events[eventName].splice(index, 1);
      }
    }
  }

  once(eventName, handler) {
    const onceHandler = (...args) => {
      handler(...args);
      this.off(eventName, onceHandler);
    };
    this.on(eventName, onceHandler);
  }
}

const resolvePromise = (x, resolve, reject) => {
  if (x instanceof P) {
    x.then(resolve, reject);
  } else {
    resolve(x);
  }
};

export class P {
  constructor(executor) {
    this.status = 'pending';
    this.value = null;
    this.reason = null;

    this.onResolvedCallbacks = [];
    this.onRejectedCallbacks = [];

    const resolve = (value) => {
      if (this.status === 'pending') {
        this.status = 'fulfilled';
        this.value = value;
        this.onResolvedCallbacks.forEach((callback) => {
          callback(value);
        });
      }
    };

    const reject = (reason) => {
      if (this.status === 'pending') {
        this.status = 'rejected';
        this.reason = reason;
        this.onRejectedCallbacks.forEach((callback) => {
          callback(reason);
        });
      }
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  then(onFulfilled, onRejected) {
    onFulfilled =
      typeof onFulfilled === 'function' ? onFulfilled : (value) => value;
    onRejected =
      typeof onRejected === 'function'
        ? onRejected
        : (reason) => {
            throw reason;
          };

    return new P((resolve, reject) => {
      if (this.status === 'fulfilled') {
        setTimeout(() => {
          try {
            const x = onFulfilled(this.value);
            resolvePromise(x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      }

      if (this.status === 'rejected') {
        setTimeout(() => {
          try {
            const x = onRejected(this.reason);
            resolvePromise(x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      }

      if (this.status === 'pending') {
        this.onResolvedCallbacks.push(() => {
          setTimeout(() => {
            try {
              const x = onFulfilled(this.value);
              resolvePromise(x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          }, 0);
        });

        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              const x = onRejected(this.reason);
              resolvePromise(x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          }, 0);
        });
      }
    });
  }

  catch(onRejected) {
    return this.then(null, onRejected);
  }
}

export function throttle(fn, delay, options = {}) {
  const { leading = true, trailing = true } = options;
  let lastCallTime = 0;
  let timer = null;
  let lastContext = null;

  const invoke = (args) => {
    try {
      lastCallTime = Date.now();
      fn.apply(lastContext, args);
    } catch (error) {
      throw error;
    } finally {
      lastContext = null;
    }
  };

  const throttled = function (...args) {
    const now = Date.now();
    if (!lastCallTime && leading === false) {
      lastCallTime = now;
    }

    const remaining = delay - (now - lastCallTime);
    if (remaining <= 0) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      invoke(args);
    } else if (trailing && !timer) {
      timer = setTimeout(() => {
        timer = null;
        lastCallTime = Date.now();
        if (trailing) {
          invoke(args);
        }
      }, remaining);
    }
  };

  throttled.cancel = function () {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    lastCallTime = 0;
    lastContext = null;
  };

  return throttled;
}

export class Scheduler {
  limit;
  queue = [];
  activeCount = 0;

  constructor(limit) {
    this.limit = limit;
  }

  /**
   *
   * @param {()=>Promise<any>} fn
   * @returns {Promise<any>}
   */
  add(fn) {
    return new Promise((resolve, reject) => {
      const runTask = () => {
        this.activeCount++;
        fn()
          .then(resolve)
          .catch(reject)
          .finally(() => {
            this.activeCount--;
            this.runNext();
          });
      };

      if (this.activeCount < this.limit) {
        runTask();
      } else {
        this.queue.push(runTask);
      }
    });
  }

  runNext() {
    if (this.queue.length > 0 && this.activeCount < this.limit) {
      this.queue.shift()();
    }
  }
}

Function.prototype._call = function (context, ...args) {
  if (typeof this !== 'function') {
    throw new TypeError('not a function');
  }

  context = context || globalThis;
  // 避免覆盖已有属性
  const fnSymbol = Symbol('fn');
  context[fnSymbol] = this;
  const result = context[fnSymbol](...args);
  delete context[fnSymbol];

  return result;
};

Function.prototype._apply = function (context, args) {
  if (typeof this !== 'function') {
    throw new TypeError('not a function');
  }

  context = context || globalThis;
  args = args || [];
  // 避免覆盖已有属性
  const fnSymbol = Symbol('fn');
  context[fnSymbol] = this;
  const result = context[fnSymbol](...args);
  delete context[fnSymbol];

  return result;
};

Function.prototype._bind = function (context, ...args) {
  if (typeof this !== 'function') {
    throw new TypeError('not a function');
  }

  const self = this;
  const boundFn = function (...innerArgs) {
    // 处理 new 的场景
    if (this instanceof boundFn) {
      return new self(...args.concat(innerArgs));
    }

    return self.apply(context, args.concat(innerArgs));
  };

  // 继承原函数的原型
  boundFn.prototype = Object.create(self.prototype);
  return boundFn;
};

export function newOperator(constructor, ...args) {
  if (typeof constructor !== 'function') {
    throw new TypeError('not a function');
  }

  const obj = Object.create(constructor.prototype);
  const result = constructor.apply(obj, args);
  return result instanceof Object ? result : obj;
}

export function compose(middlewares) {
  return function (context, next) {
    async function dispatch(index) {
      const fn = index === middlewares.length ? next : middlewares[index];
      if (!fn) {
        return;
      }

      return await fn(context, () => dispatch(index + 1));
    }

    return dispatch(0);
  };
}
