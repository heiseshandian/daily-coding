import { plusOne } from '../66';
describe('removeDuplicates', () => {
    const testData = [
        {
            input: [1, 2, 3],
            expected: [1, 2, 4],
        },
        {
            input: [1, 2, 9],
            expected: [1, 3, 0],
        },
        {
            input: [9, 9, 9],
            expected: [1, 0, 0, 0],
        },
    ];

    it.each(testData)('plusOne %j', ({ input, expected }) => {
        expect(plusOne(input)).toEqual(expected);
    });
});
