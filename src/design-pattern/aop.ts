/* 
面相切面编程
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
