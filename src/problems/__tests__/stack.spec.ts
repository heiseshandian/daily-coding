import { calculateTestData } from './stack.testdata';
import { calculate } from '../stack';

describe('stack', () => {
    it.each(calculateTestData)('calculate', ({ input, expected }) => {
        expect(calculate(input)).toBe(expected);
    });
});
