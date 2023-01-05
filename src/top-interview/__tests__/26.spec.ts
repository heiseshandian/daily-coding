import { removeDuplicates } from '../26';
describe('removeDuplicates', () => {
    const testData = [
        {
            input: [1, 1, 2],
            expected: [1, 2],
        },
        {
            input: [0, 0, 1, 1, 1, 2, 2, 3, 3, 4],
            expected: [0, 1, 2, 3, 4],
        },
        {
            input: [0, 0, 0, 0, 0, 1, 2, 2, 3, 3, 4, 4],
            expected: [0, 1, 2, 3, 4],
        },
        {
            input: [1, 2, 3],
            expected: [1, 2, 3],
        },
        {
            input: [1, 2, 3, 3],
            expected: [1, 2, 3],
        },
        {
            input: [1, 1, 1, 2],
            expected: [1, 2],
        },
        {
            input: [0, 0, 0, 1, 1, 2, 3, 4, 4],
            expected: [0, 1, 2, 3, 4],
        },
    ];

    it.each(testData)('removeDuplicates %j', ({ input, expected }) => {
        const k = removeDuplicates(input);
        expect(input.slice(0, k)).toEqual(expected);
    });
});
