import { pow } from '../bit';
import { powTestData } from './bit.testdata';

describe('bit', () => {
    it.each(powTestData)('pow', ({ input: { a, n }, expected }) => {
        expect(pow(a, n)).toBe(expected);
    });
});
