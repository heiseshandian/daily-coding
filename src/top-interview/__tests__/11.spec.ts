import { maxArea, maxArea2 } from '../11';
describe('maxArea', () => {
    const testData = [
        {
            input: [1, 8, 6, 2, 5, 4, 8, 3, 7],
            expected: 49,
        },
        {
            input: [1, 1],
            expected: 1,
        },
    ];

    it.each(testData)('maxArea %j', ({ input, expected }) => {
        expect(maxArea(input)).toBe(expected);
        expect(maxArea2(input)).toBe(expected);
    });
});
