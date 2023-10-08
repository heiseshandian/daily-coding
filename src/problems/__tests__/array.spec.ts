import {
    maxNumOfMarkedIndices,
    maxDistToClosest,
    removeDuplicates,
    merge,
    threeSumClosest,
    findValueOfPartition,
    maxDotProduct,
    maxDotProduct2,
} from '../array';
import {
    maxDistToClosestTestData,
    maxNumOfMarkedIndicesTestData,
    mergeTestData,
    removeDuplicatesTestData,
} from './array.testdata';

describe('array', () => {
    it.each(maxNumOfMarkedIndicesTestData)('maxNumOfMarkedIndices', ({ input, expected }) => {
        expect(maxNumOfMarkedIndices(input)).toBe(expected);
    });

    it.each(maxDistToClosestTestData)('maxDistToClosest', ({ input, expected }) => {
        expect(maxDistToClosest(input)).toBe(expected);
    });

    it.each(removeDuplicatesTestData)('removeDuplicates', ({ input, expected: { k, nums } }) => {
        const result = removeDuplicates(input);

        expect(result).toBe(k);
        expect(input.slice(0, k)).toEqual(nums);
    });

    it.each(mergeTestData)('should test merge function', ({ nums1, m, nums2, n, expected }) => {
        merge(nums1, m, nums2, n);
        expect(nums1).toEqual(expected);
    });

    it.each([
        [[-1, 2, 1, -4], 1, 2],
        [[0, 0, 0], 1, 0],
        [[1, 1, 1, 1], 0, 3],
        [[-10, -5, -2, 0, 1, 3, 7], 6, 6],
        [[-10, -5, -2, 0, 1, 3, 7], 10, 10],
    ])('returns the closest sum for %p and target %p', (nums, target, expected) => {
        expect(threeSumClosest(nums, target)).toBe(expected);
    });

    it.each([
        [[1, 2, 3, 4, 5], 1],
        [[5, 4, 3, 2, 1], 1],
        [[1, 1, 1, 1, 1], 0],
        [[1, 3, 6, 10, 15], 2],
        [[], Infinity],
    ])('returns correct value for array %p', (nums, expected) => {
        const result = findValueOfPartition(nums);
        expect(result).toBe(expected);
    });

    it.each([
        [[2, 1, -2, 5], [3, 0, -6], 18],
        [[3, -2], [2, -6, 7], 21],
        [[-1, -1], [1, 1], -1],
        [[9, 2, 3, 7, -9, 1, -8, 5, -1, -1], [-3, -8, 3, -10, 1, 3, 9], 200],
    ])('returns correct value for nums1 %p and nums2 %p', (nums1, nums2, expected) => {
        expect(maxDotProduct(nums1, nums2)).toBe(expected);
        expect(maxDotProduct2(nums1, nums2)).toBe(expected);
    });
});
