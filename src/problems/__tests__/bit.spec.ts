import { gameOfLife, pow, reverseBits, reverseBits2 } from '../bit';
import { gameOfLifeTestData, powTestData, reverseBitsTestData } from './bit.testdata';

describe('bit', () => {
    it.each(powTestData)('pow', ({ input: { a, n }, expected }) => {
        expect(pow(a, n)).toBe(expected);
    });

    it.each(gameOfLifeTestData)('gameOfLive', ({ input, expected }) => {
        gameOfLife(input);

        expect(input).toEqual(expected);
    });

    it.each(reverseBitsTestData)('reverseBits', ({ input, expected }) => {
        expect(reverseBits(input)).toBe(expected);
        expect(reverseBits2(input)).toBe(expected);
    });
});
