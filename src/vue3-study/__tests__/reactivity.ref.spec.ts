import { ref, effect, reactive, toRefs, proxyRefs } from '../reactivity';

describe('reactivity/ref', () => {
  test('ref', () => {
    const foo = ref(0);
    const fn = jest.fn(() => foo.value);

    effect(fn);

    foo.value = 2;
    expect(fn).toHaveBeenCalledTimes(2);
  });

  test('toRefs', () => {
    const p = reactive({ foo: 1 });
    const newP = { ...toRefs(p) };
    const fn = jest.fn(() => newP.foo.value);

    effect(fn);

    newP.foo.value = 2;
    expect(fn).toHaveBeenCalledTimes(2);
  });

  test('proxyRefs', () => {
    const p = reactive({ foo: 1 });
    const newP = proxyRefs({ ...toRefs(p) });
    const fn = jest.fn(() => newP.foo);

    effect(fn);

    newP.foo = 2;
    expect(fn).toHaveBeenCalledTimes(2);
  });
});
