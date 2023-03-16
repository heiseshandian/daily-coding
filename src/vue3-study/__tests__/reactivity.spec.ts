import { reactive, effect, computed, watch } from '../reactivity';

describe('reactivity', () => {
    test('Object reactive', () => {
        const original = { foo: 1 };
        const observed = reactive(original);

        expect(observed).not.toBe(original);
        // get
        expect(observed.foo).toBe(1);
        // set
        original.foo = 2;
        expect(observed.foo).toBe(2);
    });

    test('Object reactive cache', () => {
        const original = { foo: 1 };
        const observed1 = reactive(original);
        const observed2 = reactive(original);

        expect(observed1).toBe(observed2);
    });

    test('basic effect', () => {
        const observed = reactive({ foo: 1, bar: 2 });
        const fn = jest.fn(() => observed.foo);

        effect(fn);

        observed.foo = 2;
        expect(fn).toHaveBeenCalledTimes(2);

        observed.bar = 3;
        expect(fn).toHaveBeenCalledTimes(2);
    });

    test('effect switch/cleanup', () => {
        const observed = reactive({ foo: 1, ok: true });
        const fn = jest.fn(() => (observed.ok ? observed.foo : 1));

        effect(fn);
        expect(fn).toHaveBeenCalled();

        observed.ok = false;
        expect(fn).toHaveBeenCalledTimes(2);
        fn.mockClear();

        observed.foo = 3;
        expect(fn).not.toHaveBeenCalled();

        observed.ok = true;
        expect(fn).toHaveBeenCalledTimes(1);

        observed.foo = 1;
        expect(fn).toHaveBeenCalledTimes(2);
    });

    test('can handle ++', () => {
        const observed = reactive({ foo: 1 });
        const fn = jest.fn(() => observed.foo);
        effect(fn);

        observed.foo++;
        expect(fn).toHaveBeenCalledTimes(2);
    });

    test('support schedular', () => {
        const observed = reactive({ foo: 1 });
        const fn = jest.fn(() => observed.foo);
        const innerFn = jest.fn();

        effect(fn, {
            scheduler(effectFn) {
                effectFn();
                innerFn();
            },
        });

        observed.foo = 2;

        expect(fn).toHaveBeenCalledTimes(2);
        expect(innerFn).toHaveBeenCalledTimes(1);
    });

    test('lazy effect', () => {
        const observed = reactive({ foo: 1 });
        const fn = jest.fn(() => observed.foo);
        const effectFn = effect(fn, { lazy: true });

        expect(fn).not.toHaveBeenCalled();

        effectFn();
        expect(fn).toHaveBeenCalled();
    });

    test('computed', () => {
        const observed = reactive({ foo: 1, bar: 2 });
        const computedObj = computed(() => observed.foo + observed.bar);
        const fn = jest.fn(() => computedObj.value);

        effect(fn);

        expect(fn).toHaveBeenCalledTimes(1);
        observed.foo = 2;
        expect(fn).toHaveBeenCalledTimes(2);
    });

    test('lazy computed', () => {
        const observed = reactive({ foo: 1, bar: 2 });
        const getter = jest.fn(() => observed.foo + observed.bar);
        const computedObj = computed(getter);

        expect(computedObj.value).toBe(observed.foo + observed.bar);
        expect(getter).toHaveBeenCalledTimes(1);

        observed.foo = 1;
        expect(getter).toHaveBeenCalledTimes(1);
    });

    test('watch getter', () => {
        const observed = reactive({ bar: 2 });
        const fn = jest.fn();

        watch(() => observed.bar, fn);
        expect(fn).not.toHaveBeenCalled();

        observed.bar = 1;
        expect(fn).toHaveBeenCalled();
    });

    test('watch getter immediate', () => {
        const observed = reactive({ bar: 2 });
        const fn = jest.fn();

        watch(() => observed.bar, fn, { immediate: true });
        expect(fn).toHaveBeenCalled();
    });

    test('watch object', () => {
        const observed = reactive({
            bar: 2,
            inner: {
                foo: 3,
            },
        });
        const fn = jest.fn();

        watch(observed, fn);

        observed.inner.foo = 4;
        expect(fn).toHaveBeenCalled();
    });

    test('watch onInvalidate', () => {
        const observed = reactive({ bar: 2 });

        const cleanup = jest.fn();
        const fn = jest.fn((_newValue, _oldValue, onInvalidate) => {
            onInvalidate(cleanup);
        });

        watch(observed, fn, { immediate: true });
        expect(cleanup).not.toHaveBeenCalled();

        observed.bar = 1;
        expect(cleanup).toHaveBeenCalled();
    });
});
