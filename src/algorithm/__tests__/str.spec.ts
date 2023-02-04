import { getIndexOf, getMaxPalindrome } from '../str';

describe('getIndexOf', () => {
    const testData = [
        {
            input: {
                str1: 'hello',
                str2: 'll',
            },
            expected: 2,
        },
    ];

    it.each(testData)('getIndexOf %j', ({ input: { str1, str2 }, expected }) => {
        expect(getIndexOf(str1, str2)).toBe(expected);
    });
});

describe('getMaxPalindrome', () => {
    const testData = [
        {
            input: '',
            expected: '',
        },
        {
            input: 'ccc',
            expected: 'ccc',
        },
        {
            input: 'abccdd',
            expected: 'cc',
        },
        {
            input: 'aba',
            expected: 'aba',
        },
    ];

    it.each(testData)('getMaxPalindrome %j', ({ input, expected }) => {
        expect(getMaxPalindrome(input)).toBe(expected);
    });
});
