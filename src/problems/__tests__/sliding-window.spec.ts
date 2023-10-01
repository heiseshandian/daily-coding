import { constrainedSubsetSum } from '../sliding-window';

describe('sliding-window', () => {
    it.each([
        [[10, 20, 30, -10, -20, 10], 2, 60],
        [[1, -2, 3, -2], 1, 3],
    ])('constrainedSubsetSum(%p, %p) should return %p', (nums, k, expected) => {
        expect(constrainedSubsetSum(nums, k)).toBe(expected);
    });
});
