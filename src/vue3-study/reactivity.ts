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

let activeEffect: ActiveEffect | null = null;
const effectStack: ActiveEffect[] = [];

const bucket = new WeakMap<object, Map<PropertyKey, Set<ActiveEffect>>>();

function track(target: object, key: PropertyKey) {
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

enum TriggerTypes {
    Set,
    Add,
}

function trigger(target: object, key: PropertyKey, type = TriggerTypes.Set) {
    const effectsMap = bucket.get(target);
    if (!effectsMap) {
        return;
    }

    const effects = effectsMap.get(key);

    /* 这里之所以需要copy是因为fn在执行的过程中会先删除依赖并重新收集依赖
    而js规范指定set中的元素被删除然后重新加入会导致循环继续执行，比如说下面的代码会进入死循环
    const set = new Set([1]);
    set.forEach((i) => {
        set.delete(i);
        set.add(i);
    }); */
    const effectsToRun = new Set<ActiveEffect>();
    addEffectsToRun(effectsToRun, effects);

    if (type === TriggerTypes.Add && effectsMap.has(ITERATE_KEY)) {
        const iterateEffects = effectsMap.get(ITERATE_KEY);
        addEffectsToRun(effectsToRun, iterateEffects);
    }

    effectsToRun.forEach((fn) => {
        // 用户定义了调度器则直接把控制权交给用户定义的调度器
        if (fn.options.scheduler) {
            fn.options.scheduler(fn);
        } else {
            fn();
        }
    });
}

function addEffectsToRun(effectsToRun: Set<ActiveEffect>, effects: Set<ActiveEffect> | undefined | null) {
    if (!effects) {
        return;
    }

    effects.forEach((effect) => {
        // 避免无限递归循环
        // 比如说在effect中执行自增操作（一个effect同时包含set和get操作）
        if (effect !== activeEffect) {
            effectsToRun.add(effect);
        }
    });
}

const ITERATE_KEY = Symbol();

function createReactive<T extends object>(target: T, isShallow = false) {
    return new Proxy<T>(target, {
        get(target, key, receiver) {
            track(target, key);

            /* 
            处理getter的场景

            const original = {
                foo: 1,
                get bar() {
                    // 如果我们直接使用target[key]来返回值的话那么这里的this就会指向
                    // target，而target本身不是响应式对象，所以foo就不会被当成依赖被收集起来
                    // 从而导致修改foo的时候那些依赖于bar的副作用不会被重新执行
                    // 而用Reflect结合receiver属性可以修改上下文对象，从而使得这里的this指向
                    // 代理对象，从而被收集依赖
                    return this.foo;
                },
            };
            const observed = reactive(original);

            // observed就是这里的receiver
            effect(()=>observed.bar);
            */
            const ret = Reflect.get(target, key, receiver);
            if (isShallow) {
                return ret;
            }

            // 支持深度响应式
            if (typeof ret === 'object' && ret !== null) {
                return reactive(ret);
            }

            return ret;
        },
        set(target, key, newValue, receiver) {
            const oldValue = Reflect.get(target, key, receiver);
            // 用于区别是否新增属性，新增属性会影响for in行为，我们需要触发ITERATE_KEY相关的副作用
            const hasOwnProp = Object.prototype.hasOwnProperty.call(target, key);
            const ret = Reflect.set(target, key, newValue, receiver);

            // 数据变更或者至少有一个不是NaN时才触发副作用
            // NaN !== NaN
            if (oldValue !== newValue && (!Number.isNaN(oldValue) || !Number.isNaN(newValue))) {
                trigger(target, key, hasOwnProp ? TriggerTypes.Set : TriggerTypes.Add);
            }

            return ret;
        },
        // https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-relational-operators
        // 用于拦截 key in obj操作
        // key in obj最终会通过调用obj上的[[HasProperty]]内部方法来判断结果，所以我们可以使用has来进行拦截
        has(target, key) {
            track(target, key);
            return Reflect.has(target, key);
        },
        // https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-runtime-semantics-forinofheadevaluation
        // https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-enumerate-object-properties
        // 用于拦截for in循环操作
        ownKeys(target) {
            track(target, ITERATE_KEY);
            return Reflect.ownKeys(target);
        },
        deleteProperty(target, key) {
            // 删除属性会影响for in行为
            trigger(target, ITERATE_KEY);
            return Reflect.deleteProperty(target, key);
        },
    });
}

const reactiveMap = new WeakMap<object, any>();
const shallowReactiveMap = new WeakMap<object, any>();

export function reactive<T extends object>(target: T): T {
    // 避免多次为同一个对象创建响应式对象
    if (reactiveMap.has(target)) {
        return reactiveMap.get(target);
    }

    reactiveMap.set(target, createReactive(target));
    return reactiveMap.get(target);
}

export function shallowReactive<T extends object>(target: T): T {
    if (shallowReactiveMap.has(target)) {
        return shallowReactiveMap.get(target);
    }

    shallowReactiveMap.set(target, createReactive(target, true));
    return shallowReactiveMap.get(target);
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
    const jobs: Set<Function> = new Set();
    let isFlushing = false;
    const p = Promise.resolve();

    return function (job: Function) {
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

        return p;
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

            // 当外部把obj.value作为依赖放入effect的时候手动触发收集依赖
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
