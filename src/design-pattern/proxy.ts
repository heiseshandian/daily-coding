/*
代理模式的关键是，当客户不方便直接访问一个对象或者不满足需要的时候，
提供一个替身对象来控制对这个对象的访问，客户实际上访问的是替身对象。 
*/
const setSrc = (() => {
    const imageNode = document.createElement('img');
    document.body.appendChild(imageNode);

    return (src: string) => {
        imageNode.src = src;
    };
})();

// 代理对象的接口与原始对象的接口完全一致，日后网络情况改善去掉代理的时候也非常方便
// 任何使用代理对象的地方都能透明的替换成原始对象
const setSrcProxy = (() => {
    const toPreloadRealImg = new Image();
    toPreloadRealImg.onload = () => {
        // 大图加载完毕后设置到页面上
        setSrc(toPreloadRealImg.src);
    };

    return (src: string) => {
        // 利用内存中的img对象来加载实际大图
        toPreloadRealImg.src = src;

        // 显示一个加载中的菊花图
        setSrc('loading.gif');
    };
})();

// 假设我们在做一个文件同步的功能，当我们选中一个checkbox的时候，对应的文件就会被同步到另一台服务器上
// 但其实我们并不需要点击一次checkbox就同步一次，这时候我们可以用代理来把一段时间的请求合并成一个
function syncFile(id: string) {
    console.log(`${id}正在同步中~`);
}

const syncFileProxy = (() => {
    const ids: string[] = [];
    let timer: number | null = null;

    return (id: string) => {
        ids.push(id);
        if (timer) {
            return;
        }

        timer = window.setTimeout(() => {
            syncFile(ids.join(','));
            ids.length = 0;
            timer = null;
        }, 2000);
    };
})();

function once<T>(fn: (...args: any[]) => T) {
    const runCache: Record<string, T> = {};

    return function (...args: any[]): T {
        const id = args.join(',');
        if (runCache.hasOwnProperty(id)) {
            return runCache[id];
        }

        runCache[id] = fn.apply(this, args);
        return runCache[id];
    };
}

const loadScript = once((src: string) => {
    const script = document.createElement('script');
    script.src = src;
    document.getElementsByTagName('head')[0].appendChild(script);

    return script;
});

const miniConsoleProxy = (() => {
    const cachedLogs = [];

    const f12Handler = (e: KeyboardEvent) => {
        if (e.key === 'F12') {
            const script = loadScript('real miniConsole script path');

            script.onload = () => {
                for (let i = 0; i < cachedLogs.length; i++) {
                    // 使用实际的miniConsole对象来打印日志
                }

                // 处理完后清空cache
                cachedLogs.length = 0;
            };

            document.body.removeEventListener('keydown', f12Handler);
        }
    };

    document.body.addEventListener('keydown', f12Handler, false);

    return {
        log(...args: string[]) {
            // 如果实际miniConsole对象存在（说明miniConsole对象已加载），直接使用miniConsole对象来处理
            // if (miniConsole) {
            // } else {
            //     cachedLogs.push(args);
            // }
        },
    };
})();
