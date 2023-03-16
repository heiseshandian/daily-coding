import { reactive, effect } from '../reactivity';

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
});
