import { hanoi, subsequence } from '../recursion';
import { hanoiTestData, subsequenceTestData } from './recursion.testdata';

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
