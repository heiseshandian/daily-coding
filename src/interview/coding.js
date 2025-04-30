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
