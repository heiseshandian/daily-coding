import { longestPalindrome, longestPalindrome2, longestPalindrome3 } from '../5';
describe('longestPalindrome', () => {
    const testData = [
        {
            input: 'babad',
            expected: 'bab',
        },
        {
            input: 'cbbd',
            expected: 'bb',
        },
        {
            input: 'abcddcba',
            expected: 'abcddcba',
        },
        {
            input: 'a',
            expected: 'a',
        },
        {
            input: 'ac',
            expected: 'a',
        },
    ];

    it.each(testData)('longestPalindrome %j', ({ input, expected }) => {
        expect(longestPalindrome(input)).toBe(expected);
        expect(longestPalindrome2(input)).toBe(expected);
        expect(longestPalindrome3(input)).toBe(expected);
    });
});
