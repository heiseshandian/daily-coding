import { bag, hanoi, maxPoint, nQueen, subsequence, jump, jumpDp, jumpDp2, getMaxSumK } from '../recursion';
import {
    bagTestData,
    hanoiTestData,
    jumpTestData,
    maxNumTestData,
    nQueenTestData,
    subsequenceTestData,
} from './recursion.testdata';

describe('hanoi', () => {
    it.each(hanoiTestData)('hanoi %j', ({ input, expected }) => {
        expect(hanoi(input)).toEqual(expected);
    });
});

describe('subsequence', () => {
    it.each(subsequenceTestData)('subsequence %j', ({ input, expected }) => {
        expect(subsequence(input)).toEqual(expected);
    });
});

describe('bag', () => {
    it.each(bagTestData)('bag %j', ({ input: { weights, values, targetWeight }, expected }) => {
        expect(bag(weights, values, targetWeight)).toBe(expected);
    });
});

describe('maxPoint', () => {
    it.each(maxNumTestData)('maxPoint', ({ input, expected }) => {
        expect(maxPoint(input)).toBe(expected);
    });
});

describe('nQueen', () => {
    it.each(nQueenTestData)('nQueen %j', ({ input, expected }) => {
        expect(nQueen(input)).toBe(expected);
    });
});

describe('jump', () => {
    it.each(jumpTestData)('jump %j', ({ input, expected }) => {
        expect(jump(input)).toBe(expected);
        expect(jumpDp(input)).toBe(expected);
        expect(jumpDp2(input)).toBe(expected);
    });
});

describe('getMaxSumK', () => {
    test('getMaxSumK arr1:[1,2,3,4,5] arr2:[3,5,7,9,11],k=4 maxK:[16,15,14,14]', () => {
        expect(getMaxSumK([1, 2, 3, 4, 5], [3, 5, 7, 9, 11], 4)).toEqual([16, 15, 14, 14]);
    });
});
