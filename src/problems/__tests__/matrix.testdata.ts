export const zigzagMatrixTestData = [
    {
        input: [],
        expected: [],
    },
    {
        input: [[1]],
        expected: [1],
    },
    {
        input: [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9],
        ],
        expected: [1, 2, 4, 7, 5, 3, 6, 8, 9],
    },
    {
        input: [
            [1, 2, 3, 4],
            [5, 6, 7, 8],
            [9, 10, 11, 12],
            [13, 14, 15, 16],
        ],
        expected: [1, 2, 5, 9, 6, 3, 4, 7, 10, 13, 14, 11, 8, 12, 15, 16],
    },
];
