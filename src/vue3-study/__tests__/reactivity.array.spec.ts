import { reactive, effect } from '../reactivity';
describe('reactivity/array', () => {
  test('change length by setting', () => {
    const observed = reactive(['foo']);
    const fn = jest.fn(() => observed.length);
    effect(fn);

    observed[1] = 'test';
    expect(fn).toHaveBeenCalledTimes(2);
  });

  test('change arr by changing length', () => {
    const observed = reactive(['foo']);
    const fn = jest.fn(() => observed[0]);
    effect(fn);

    observed.length = 0;
    expect(fn).toHaveBeenCalledTimes(2);
  });

  test('for in', () => {
    const observed = reactive(['foo']);
    const fn = jest.fn(() => {
      for (const _key in observed) {
        // do nothing
      }
    });

    effect(fn);
    observed.length = 0;

    expect(fn).toHaveBeenCalledTimes(2);
    fn.mockClear();

    observed[2] = '1';
    expect(fn).toHaveBeenCalled();
    fn.mockClear();

    delete observed[2];
    expect(fn).toHaveBeenCalled();
  });

  test('for of', () => {
    const observed = reactive(['foo']);
    const fn = jest.fn(() => {
      for (const _key of observed) {
        // do nothing
      }
    });

    effect(fn);
    observed.length = 0;

    expect(fn).toHaveBeenCalledTimes(2);
    fn.mockClear();

    observed[2] = '1';
    expect(fn).toHaveBeenCalled();
  });

  test('includes object', () => {
    const obj = {};
    const observed = reactive([obj]);

    expect(observed.includes(observed[0])).toBe(true);
    expect(observed.includes(obj)).toBe(true);
  });
});
