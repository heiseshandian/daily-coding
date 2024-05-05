import { calculateTestData } from './stack.testdata';
import { calculate, reverseStack, sortStack } from '../stack';

const generateNums = (len: number) =>
    Array(len)
        .fill(0)
        .map(() => (Math.random() * len) >>> 0);

describe('stack', () => {
    it.each(calculateTestData)('calculate', ({ input, expected }) => {
        expect(calculate(input)).toBe(expected);
    });

    describe('reverseStack', () => {
        const len = 100;
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

    describe('sortStack', () => {
        const len = 100;
        const numsList = generateNums(len).map((n) => {
            const nums = generateNums(n);

            return {
                input: nums,
                expected: nums.slice().sort((a, b) => b - a),
            };
        });

        it.each(numsList)('sortStack', ({ input, expected }) => {
            sortStack(input);
            expect(input).toEqual(expected);
        });
    });
});
