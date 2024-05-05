import { calculateTestData } from './stack.testdata';
import { calculate, reverseStack } from '../stack';

describe('stack', () => {
    it.each(calculateTestData)('calculate', ({ input, expected }) => {
        expect(calculate(input)).toBe(expected);
    });

    const len = 1000;
    const generateNums = (len: number) =>
        Array(len)
            .fill(0)
            .map(() => (Math.random() * len) >>> 0);
    const numsList = generateNums(len).map((n) => {
        const nums = generateNums(n);

        return {
            input: nums,
            expected: nums.slice().reverse(),
        };
    });

    it.each(numsList)('reverseStack', ({ input, expected }) => {
        reverseStack(input);
        expect(input).toEqual(expected);
    });
});
