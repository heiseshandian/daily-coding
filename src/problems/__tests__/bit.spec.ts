import { gameOfLife, pow } from '../bit';
import { gameOfLifeTestData, powTestData } from './bit.testdata';

describe('bit', () => {
    it.each(powTestData)('pow', ({ input: { a, n }, expected }) => {
        expect(pow(a, n)).toBe(expected);
    });

    it.each(gameOfLifeTestData)('gameOfLive', ({ input, expected }) => {
        gameOfLife(input);

        expect(input).toEqual(expected);
    });
});
