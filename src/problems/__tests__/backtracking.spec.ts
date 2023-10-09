import { combinationSum3 } from '../backtracking';

describe('backtracking', () => {
    it.each([
        [3, 7, [[1, 2, 4]]],
        [
            3,
            9,
            [
                [1, 2, 6],
                [1, 3, 5],
                [2, 3, 4],
            ],
        ],
        [4, 1, []],
        [3, 2, []],
        [9, 45, [[1, 2, 3, 4, 5, 6, 7, 8, 9]]],
    ])('returns correct combinations for k = %i and n = %i', (k, n, expected) => {
        expect(combinationSum3(k, n)).toEqual(expected);
    });
});
