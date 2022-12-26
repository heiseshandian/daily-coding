import { getNthUglyNumber } from '../pointer';
import { getNthUglyNumberTestData } from './pointer.testdata';

describe('getNthUglyNumber', () => {
    it.each(getNthUglyNumberTestData)('getNthUglyNumber %j', ({ input, expected }) => {
        expect(getNthUglyNumber(input)).toBe(expected);
    });
});
