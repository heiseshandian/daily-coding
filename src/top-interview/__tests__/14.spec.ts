import { longestCommonPrefix } from '../14';
describe('longestCommonPrefix', () => {
    const testData = [
        {
            input: ['flower', 'flow', 'flight'],
            expected: 'fl',
        },
        {
            input: ['dog', 'racecar', 'car'],
            expected: '',
        },
    ];

    it.each(testData)('longestCommonPrefix %j', ({ input, expected }) => {
        expect(longestCommonPrefix(input)).toBe(expected);
    });
});
