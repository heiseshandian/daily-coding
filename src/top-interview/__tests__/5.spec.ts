import { longestPalindrome } from '../5';
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
    });
});
