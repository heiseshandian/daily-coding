import { currying } from '../function';

describe('function', () => {
  test('currying', () => {
    const add = (a, b, c) => {
      return a + b + c;
    };

    expect(currying(add, 1)(2)(3)).toBe(6);
    expect(currying(add)(1, 2, 3)).toBe(6);
  });
});
