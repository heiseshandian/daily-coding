import { lengthOfLongestSubstring } from '../3';

describe('lengthOfLongestSubstring', () => {
    const testData = [
        {
            input: 'abcabcbb',
            expected: 3,
        },
        {
            input: 'bbbbbb',
            expected: 1,
        },
        {
            input: 'dvdf',
            expected: 3,
        },
        {
            input: ' ',
            expected: 1,
        },
        {
            input: 'pwwkew',
            expected: 3,
        },
    ];

    it.each(testData)('lengthOfLongestSubstring %j', ({ input, expected }) => {
        expect(lengthOfLongestSubstring(input)).toBe(expected);
    });
});
