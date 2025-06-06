import { serializeByLevel } from '../../algorithm/tree';
import { diffWaysToCompute, generateTrees } from '../divide-and-conquer';

describe('divide-and-conquer', () => {
  it.each([
    ['2-1-1', [0, 2]],
    ['2*3-4*5', [-34, -14, -10, -10, 10]],
  ])('returns the closest sum for %p and target %p', (expression, result) => {
    expect(diffWaysToCompute(expression).sort()).toEqual(result.sort());
  });

  it.each([
    [
      3,
      [
        [1, null, 2, null, 3],
        [1, null, 3, 2],
        [2, 1, 3],
        [3, 1, null, null, 2],
        [3, 2, null, 1],
      ],
    ],
    [1, [[1]]],
  ])("returns all the structurally unique BST's for %p", (n, result) => {
    const trees = generateTrees(n).map(serializeByLevel);
    expect(trees.sort()).toEqual(result.sort());
  });
});
