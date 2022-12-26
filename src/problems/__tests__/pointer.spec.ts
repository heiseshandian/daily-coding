import { getMinArr, getNthUglyNumber } from '../pointer';
import { getNthUglyNumberTestData, getMinArrTestData } from './pointer.testdata';

describe('getNthUglyNumber', () => {
    it.each(getNthUglyNumberTestData)('getNthUglyNumber %j', ({ input, expected }) => {
        expect(getNthUglyNumber(input)).toBe(expected);
    });
});

describe('getMinArr', () => {
    it.each(getMinArrTestData)('getMinArr %j', ({ input, expected }) => {
        expect(getMinArr(input)).toEqual(expected);
    });
});
