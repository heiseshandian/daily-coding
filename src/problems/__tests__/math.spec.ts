import { atMostNGivenDigitSet } from '../math';

describe('atMostNGivenDigitSet', () => {
    it.each([
        [['1', '3', '5', '7'], 100, 20],
        [['1', '4', '9'], 1000000000, 29523],
        [['1', '2', '3'], 10, 3],
        [['1', '2', '3', '6', '7', '8'], 211, 79],
    ])('digits = %p, n = %p', (digits, n, expected) => {
        expect(atMostNGivenDigitSet(digits, n)).toBe(expected);
    });
});
