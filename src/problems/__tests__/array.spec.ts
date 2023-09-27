import { maxNumOfMarkedIndices, maxDistToClosest, removeDuplicates, merge } from '../array';
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
});
