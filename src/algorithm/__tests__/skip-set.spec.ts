import { SkipSet } from '../skip-set';

describe('skip-list', () => {
  test('add search delete', () => {
    const skipSet = new SkipSet();

    [3, 5, 6, 7, 2, 1, 0, -1, 56, 23, 12].forEach((val) => {
      skipSet.add(val);
    });

    expect(skipSet.search(2)?.key).toBe(2);
    skipSet.delete(2);
    expect(skipSet.search(2)).toBe(null);

    expect(skipSet.search(100)).toBe(null);
    skipSet.add(100);
    expect(skipSet.search(100)?.key).toBe(100);
  });

  test('keys', () => {
    const skipSet = new SkipSet();

    [3, 5, 6, 7, 2, 1, 0, -1, 56, 23, 12].forEach((val) => {
      skipSet.add(val);
    });

    expect(skipSet.keys()).toEqual([null, -1, 0, 1, 2, 3, 5, 6, 7, 12, 23, 56]);
  });

  test('first last', () => {
    const skipSet = new SkipSet();

    [3, 5, 6, 7, 2, 1, 0, -1, 56, 23, 12].forEach((val) => {
      skipSet.add(val);
    });

    expect(skipSet.first()).toBe(-1);
    expect(skipSet.last()).toBe(56);
  });

  test('isEmpty', () => {
    const skipSet = new SkipSet();

    expect(skipSet.isEmpty()).toBe(true);

    skipSet.add(1);
    expect(skipSet.isEmpty()).toBe(false);

    skipSet.delete(1);
    expect(skipSet.isEmpty()).toBe(true);
  });

  test('ceil floor', () => {
    const skipSet = new SkipSet();

    [3, 5, 6, 7, 2, 1, 0, -1, 56, 23, 12].forEach((val) => {
      skipSet.add(val);
    });

    expect(skipSet.ceil(4)).toBe(5);
    expect(skipSet.floor(4)).toBe(3);

    expect(skipSet.ceil(6)).toBe(6);
    expect(skipSet.floor(6)).toBe(6);
  });
});
