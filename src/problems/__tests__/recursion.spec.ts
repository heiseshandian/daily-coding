import { bag, hanoi, maxPoint, subsequence } from '../recursion';
import { bagTestData, hanoiTestData, maxNumTestData, subsequenceTestData } from './recursion.testdata';

describe('hanoi', () => {
    it.each(hanoiTestData)('hanoi %j', ({ input, expected }) => {
        expect(hanoi(input)).toEqual(expected);
    });
});

describe('subsequence', () => {
    it.each(subsequenceTestData)('subsequence %j', ({ input, expected }) => {
        expect(subsequence(input)).toEqual(expected);
    });
});

describe('bag', () => {
    it.each(bagTestData)('bag %j', ({ input: { weights, values, targetWeight }, expected }) => {
        expect(bag(weights, values, targetWeight)).toBe(expected);
    });
});

describe('maxNum', () => {
    it.each(maxNumTestData)('maxNum', ({ input, expected }) => {
        expect(maxPoint(input)).toBe(expected);
    });
});
