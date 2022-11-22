import {
    getInversionPairCount,
    getInversionPairCount2,
    getMinSumOfArray,
    getMinSumOfArray2,
    mergeSort,
    mergeSort2,
} from '../merge-sort';
import { sortTestData } from './sort.testdata';

describe('mergeSort', () => {
    it.each(sortTestData)('mergeSort %j', ({ input, expected }) => {
        const clone1 = input.slice();
        const clone2 = input.slice();
        mergeSort(clone1);
        mergeSort2(clone2);

        expect(clone1).toEqual(expected);
        expect(clone2).toEqual(expected);
    });
});

describe('getMinSumOfArray', () => {
    const testData = [
        { input: [1, 3, 4, 2, 5], expected: 16 },
        { input: [1, 3, 4, 2, 5, 0], expected: 16 },
        { input: [1, 3, 4, 2, 5, 6], expected: 31 },
        { input: [1, 3, 4, 2, 5, 6, 7], expected: 52 },
    ];

    it.each(testData)('getMinSumOfArray %j', ({ input, expected }) => {
        expect(getMinSumOfArray(input)).toBe(expected);
        expect(getMinSumOfArray2(input)).toBe(expected);
    });
});

describe('getInversionPairCount', () => {
    const testData = [
        { input: [4, 1, 2, 3, 5, 2], expected: 6 },
        { input: [4, 1, 2, 3, 5, 2, 1], expected: 11 },
        { input: [4, 1, 2, 3, 5, 2, 1, 0], expected: 18 },
        { input: [4, 1, 2, 3, 5, 2, 1, 0, 10], expected: 18 },
    ];

    it.each(testData)('getInversionPairCount %j', ({ input, expected }) => {
        expect(getInversionPairCount(input)).toBe(expected);
        expect(getInversionPairCount2(input)).toBe(expected);
    });
});
