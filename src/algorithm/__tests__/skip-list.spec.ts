import { SkipList } from '../skip-list';

describe('skip-list', () => {
  test('add search delete', () => {
    const skipList = new SkipList();

    [3, 5, 6, 7, 2, 1, 0, -1, 56, 23, 12].forEach((val) => {
      skipList.add(val);
    });

    expect(skipList.search(2)?.key).toBe(2);
    skipList.delete(2);
    expect(skipList.search(2)).toBe(null);

    expect(skipList.search(100)).toBe(null);
    skipList.add(100);
    expect(skipList.search(100)?.key).toBe(100);
  });

  test('keys', () => {
    const skipList = new SkipList();

    [3, 5, 6, 7, 2, 1, 0, -1, 56, 23, 12].forEach((val) => {
      skipList.add(val);
    });

    expect(skipList.keys()).toEqual([
      null,
      -1,
      0,
      1,
      2,
      3,
      5,
      6,
      7,
      12,
      23,
      56,
    ]);
  });
});
