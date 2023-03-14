/* 
面相切面编程

AOP（面向切面编程）的主要作用是把一些跟核心业务逻辑模块无关的功能抽离出来，
这些跟业务逻辑无关的功能通常包括日志统计、安全控制、异常处理等。
把这些功能抽离出来之后，再通过“动态织入”的方式掺入业务逻辑模块中。
这样做的好处首先是可以保持业务逻辑模块的纯净和高内聚性，
其次是可以很方便地复用日志统计等功能模块。
*/
export function before<T extends (...args: any[]) => any>(originalFn: T, beforeFn: Function) {
    return function (...args: any[]): ReturnType<T> {
        beforeFn.apply(this, args);
        return originalFn.apply(this, args);
    };
}

export function after<T extends (...args: any[]) => any>(originalFn: T, afterFn: Function) {
    return function (...args: any[]): ReturnType<T> {
        const result = originalFn.apply(this, args);
        afterFn.apply(this, args);
        return result;
    };
}
