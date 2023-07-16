import { maxNumOfMarkedIndices, maxDistToClosest, removeDuplicates } from '../array';
import { maxDistToClosestTestData, maxNumOfMarkedIndicesTestData, removeDuplicatesTestData } from './array.testdata';

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
});
