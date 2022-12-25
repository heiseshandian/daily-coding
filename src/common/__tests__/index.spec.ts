import { times, maxCommonFactor } from '../index';

describe('times', () => {
    test('times', () => {
        const fn = jest.fn(() => 1);
        const result = times(3, fn);

        expect(fn).toHaveBeenCalledTimes(3);
        expect(result).toEqual([1, 1, 1]);
    });
});

describe('maxCommonFactor', () => {
    test('Input 6,10 return 2', () => {
        expect(maxCommonFactor(6, 10)).toBe(2);
    });

    test('Input 3,5 return 1', () => {
        expect(maxCommonFactor(3, 5)).toBe(1);
    });
});
