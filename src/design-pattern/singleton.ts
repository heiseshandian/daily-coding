export const getLoginLayer = (() => {
    // 利用闭包实现缓存，同时避免全局污染
    let div: HTMLElement | null = null;

    return () => {
        if (div) {
            return div;
        }

        div = document.createElement('div');
        div.innerHTML = '登录';
        div.style.display = 'none';
        document.body.appendChild(div);
        return div;
    };
})();

document.getElementById('loginBtn')?.addEventListener('click', () => {
    const loginLayer = getLoginLayer();
    loginLayer!.style.display = 'block';
});

// 将管理单例的逻辑从具体的业务逻辑中抽取出来
export function getSingle<T>(fn: () => T) {
    let result: T | null = null;

    return function () {
        if (result !== null) {
            return result;
        }

        // @ts-expect-error
        result = fn.apply(this, arguments);
        return result;
    };
}

export const getLoginLayer2 = getSingle<HTMLElement>(() => {
    const div = document.createElement('div');
    div.innerHTML = '登录';
    div.style.display = 'none';
    document.body.appendChild(div);
    return div;
});
