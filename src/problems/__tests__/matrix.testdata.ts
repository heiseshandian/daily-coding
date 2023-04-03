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
    {
        input: [
            [1, 2, 3, 4],
            [5, 6, 7, 8],
            [9, 10, 11, 12],
        ],
        expected: [1, 2, 5, 9, 6, 3, 4, 7, 10, 11, 8, 12],
    },
    {
        input: [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9],
            [10, 11, 12],
        ],
        expected: [1, 2, 4, 7, 5, 3, 6, 8, 10, 11, 9, 12],
    },
];

export const circleMatrixTestData = [
    {
        input: [],
        expected: [],
    },
    {
        input: [[1, 2, 3]],
        expected: [1, 2, 3],
    },
    {
        input: [[1], [2], [3]],
        expected: [1, 2, 3],
    },
    {
        input: [
            [1, 2, 3, 4],
            [5, 6, 7, 8],
            [9, 10, 11, 12],
        ],
        expected: [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7],
    },
    {
        input: [
            [1, 2, 3, 4],
            [5, 6, 7, 8],
            [9, 10, 11, 12],
            [13, 14, 15, 16],
        ],
        expected: [1, 2, 3, 4, 8, 12, 16, 15, 14, 13, 9, 5, 6, 7, 11, 10],
    },
    {
        input: [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9],
            [10, 11, 12],
            [13, 14, 15],
        ],
        expected: [1, 2, 3, 6, 9, 12, 15, 14, 13, 10, 7, 4, 5, 8, 11],
    },
];

export const generateMatrixTestData = [
    {
        input: 3,
        expected: [
            [1, 2, 3],
            [8, 9, 4],
            [7, 6, 5],
        ],
    },
    {
        input: 1,
        expected: [[1]],
    },
    {
        input: 4,
        expected: [
            [1, 2, 3, 4],
            [12, 13, 14, 5],
            [11, 16, 15, 6],
            [10, 9, 8, 7],
        ],
    },
];
