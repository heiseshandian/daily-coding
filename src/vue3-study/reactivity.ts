// 当前激活的effect
let activeEffect: any;

// 用于实现effect嵌套
const effectStack: Function[] = [];

const bucket: WeakMap<any, Map<string, Set<any>>> = new WeakMap();

type EffectOptions = {
    scheduler?: (fn: Function) => any;
};

export function effect(fn: Function, options: EffectOptions = {}) {
    function effectFn() {
        // effectFn执行时将activeEffect标记为effectFn
        activeEffect = effectFn;
        // 将effectFn从依赖集合中删除
        cleanup(effectFn);

        fn();
    }

    // @ts-expect-error
    effectFn.deps = [];
    effectFn.options = options;

    effectStack.push(effectFn);
    effectFn();
    effectStack.length--;

    activeEffect = effectStack[effectStack.length - 1];
}

function cleanup(effectFn: any) {
    effectFn.deps.forEach((set: Set<Function>) => {
        set.delete(effectFn);
    });
    effectFn.deps.length = 0;
}

function track(target: any, key: string) {
    if (!activeEffect) {
        return;
    }

    if (!bucket.has(target)) {
        bucket.set(target, new Map());
    }
    if (!bucket.get(target)!.has(key)) {
        bucket.get(target)!.set(key, new Set());
    }

    const effectSet = bucket.get(target)!.get(key)!;

    effectSet.add(activeEffect);
    if (!activeEffect.deps) {
        activeEffect.deps = [];
    }
    activeEffect.deps.push(effectSet);
}

function trigger(target: any, key: string) {
    if (!bucket.has(target) || !bucket.get(target)?.get(key)) {
        return;
    }

    const effects = bucket.get(target)!.get(key)!;
    // set中的元素被删除又重新添加回去会导致forEach陷入无限循环，这里我们执行effect之前先copy下
    const copy = new Set(effects);

    copy.forEach((effect) => {
        // 避免无限递归循环
        if (effect == activeEffect) {
            return;
        }

        if (effect.options?.scheduler && typeof effect.options?.scheduler === 'function') {
            effect.options?.scheduler(effect);
        } else {
            effect();
        }
    });
}

const data: Record<string, any> = { outer: 'outer', inner: 'inner' };
const dataProxy = new Proxy(data, {
    get(target, key: string) {
        const result = target[key];
        // 读取的时候开始收集依赖
        track(target, key);
        return result;
    },
    set(target, key: string, newValue) {
        target[key] = newValue;
        // 变更的时候开始执行副作用函数
        trigger(target, key);
        return true;
    },
});

const jobQueue = new Set();
let isFlushing = false;

function flushJob() {
    if (isFlushing) {
        return;
    }

    // 用isFlushing标志位实现一次宏任务周期内
    // jobQueue.forEach((job: any) => job()); 只会被加入到微任务队列中一次，期间
    isFlushing = true;
    Promise.resolve()
        .then(() => {
            jobQueue.forEach((job: any) => job());
        })
        .finally(() => {
            isFlushing = false;
        });
}

effect(
    () => {
        console.log('run');
        dataProxy.foo++;
    },
    {
        scheduler(fn) {
            jobQueue.add(fn);
            flushJob();
        },
    }
);
dataProxy.foo++;
dataProxy.foo++;

console.log('结束了');
