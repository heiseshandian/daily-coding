export function currying(fn, ...args) {
    // fn需要的参数个数
    const len = fn.length;

    // 返回一个函数接收剩余参数
    return function (...params) {
        // 拼接已经接收和新接收的参数列表
        let _args = [...args, ...params];
        // 如果已经接收的参数个数还不够，继续返回一个新函数接收剩余参数
        if (_args.length < len) {
            return currying.call(this, fn, ..._args);
        }

        // 参数全部接收完调用原函数
        return fn.apply(this, _args);
    };
}
