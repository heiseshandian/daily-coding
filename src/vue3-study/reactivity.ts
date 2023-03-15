interface ActiveEffect<T = any> {
    (): T;
    effectsList: Array<Set<ActiveEffect<T>>>;
    options: ActiveEffectOptions;
}

interface ActiveEffectOptions {
    /* 
    支持调度执行

    所谓可调度，指的是当 trigger 动作触发副作用函数重新执行时，
    有能力决定副作用函数执行的时机、次数以及方式。
    */
    scheduler?: (effect: ActiveEffect) => any;
    // 懒执行
    lazy?: boolean;
}

type Key = string | number | symbol;

let activeEffect: ActiveEffect | null = null;
const effectStack: ActiveEffect[] = [];

const bucket: WeakMap<object, Map<Key, Set<ActiveEffect>>> = new WeakMap();

function track(target: object, key: Key) {
    if (!activeEffect) {
        return;
    }
    let depsMap = bucket.get(target);
    if (!depsMap) {
        bucket.set(target, (depsMap = new Map()));
    }
    let effects = depsMap.get(key);
    if (!effects) {
        depsMap.set(key, (effects = new Set()));
    }

    effects.add(activeEffect);
    activeEffect.effectsList.push(effects);
}

function trigger(target: object, key: Key) {
    const depsMap = bucket.get(target);
    if (!depsMap) {
        return;
    }

    const effects = depsMap.get(key);
    if (!effects) {
        return;
    }

    /* 这里之所以需要copy是因为fn在执行的过程中会先删除依赖并重新收集依赖
    而js规范指定set中的元素被删除然后重新加入会导致循环继续执行，比如说下面的代码会进入死循环
    const set = new Set([1]);
    set.forEach((i) => {
        set.delete(i);
        set.add(i);
    }); */
    const copy = new Set(effects);
    copy.forEach((fn) => {
        // 避免无限递归循环
        // 比如说在effect中执行自增操作（一个effect同时包含set和get操作）
        if (fn === activeEffect) {
            return;
        }

        // 用户定义了调度器则直接把控制权交给用户定义的调度器
        if (fn.options.scheduler) {
            fn.options.scheduler(fn);
        } else {
            fn();
        }
    });
}

export function effect<T extends (...args: any[]) => any>(fn: T, options: ActiveEffectOptions = {}) {
    function effectFn(): ReturnType<T> {
        cleanup(effectFn as ActiveEffect);
        activeEffect = effectFn as ActiveEffect;

        // 用于解决effect嵌套问题
        effectStack.push(activeEffect);
        const result = fn();
        effectStack.pop();

        activeEffect = effectStack[effectStack.length - 1];

        return result;
    }

    (effectFn as ActiveEffect).effectsList = [];
    (effectFn as ActiveEffect).options = options;

    if (!options.lazy) {
        // 首次执行effect
        effectFn();
    }

    // 用于实现计算属性，用户可以自行决定何时触发副作用函数
    return effectFn;
}

// 用于处理分支切换
function cleanup(effectFn: ActiveEffect) {
    for (let i = 0; i < effectFn.effectsList.length; i++) {
        const effects = effectFn.effectsList[i];
        effects.delete(effectFn);
    }

    // 清理完之后需要置空，因为effectFn在执行的过程中会重新收集正确的effectsList
    effectFn.effectsList.length = 0;
}

export const flushJobs = (() => {
    // 利用set的自动去重能力，同一个微任务循环某个effect只加入一次
    const jobs: Set<ActiveEffect> = new Set();
    let isFlushing = false;
    const p = Promise.resolve();

    return function (job: ActiveEffect) {
        jobs.add(job);

        if (isFlushing) {
            return;
        }
        isFlushing = true;

        p.then(() => {
            jobs.forEach((fn) => fn());
        }).finally(() => {
            isFlushing = false;
        });
    };
})();

// 计算属性
export function computed<T extends (...args: any[]) => any>(getter: T) {
    let value: ReturnType<T>;
    let shouldReComputed = true;

    const effectFn = effect(getter, {
        lazy: true,
        scheduler() {
            if (!shouldReComputed) {
                shouldReComputed = true;

                // 当计算属性依赖的响应式数据变化时，手动调用trigger触发响应
                trigger(obj, 'value');
            }
        },
    });

    const obj = {
        get value() {
            if (shouldReComputed) {
                value = effectFn();
                shouldReComputed = false;
            }

            // 当外部把obj.value作为放入effect的时候手动触发收集依赖
            track(obj, 'value');
            return value;
        },
    };

    return obj;
}

interface WatchOptions {
    // 是否立即执行回调函数
    immediate?: boolean;

    /* 
    sync:同步执行
    pre:组价更新前
    post:组件更新后
    */
    flush?: 'pre' | 'post' | 'sync';
}

type ReturnTypeOrT<T> = T extends (...args: any[]) => any ? ReturnType<T> : T;

export function watch<T>(
    source: T,
    cb: (
        newValue: ReturnTypeOrT<T>,
        oldValue: ReturnTypeOrT<T>,
        // 过期的副作用，主要用于处理竞态场景下判断数据是否有效，实际例子见下方
        onInvalidate: (fn: Function) => void
    ) => void,
    { immediate, flush }: WatchOptions = {}
) {
    let getter: Function;
    if (typeof source === 'function') {
        getter = source;
    } else {
        getter = () => traverse(source);
    }

    let oldValue: ReturnTypeOrT<T>;
    let newValue: ReturnTypeOrT<T>;

    let cleanup: Function;
    function onInvalidate(fn: Function) {
        cleanup = fn;
    }

    const job = () => {
        newValue = effectFn();

        // 触发回调之前调用过期回调
        if (cleanup) {
            cleanup();
        }
        cb(newValue, oldValue, onInvalidate);

        oldValue = newValue;
    };

    const effectFn = effect(() => getter(), {
        lazy: true,
        scheduler: () => {
            if (flush === 'post') {
                Promise.resolve().then(job);
            } else {
                job();
            }
        },
    });

    if (immediate) {
        job();
    } else {
        oldValue = effectFn();
    }
}

function traverse(val: any, visited = new Set()) {
    if (typeof val !== 'object' || val === null || val === undefined || visited.has(val)) {
        return;
    }
    visited.add(val);

    // 暂时不考虑数组等其他数据结构
    for (const k in val) {
        traverse(val[k], visited);
    }

    return val;
}
