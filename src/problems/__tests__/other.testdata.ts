export const getMinValueOfColorTestData = [
    {
        input: [
            [0, 4, 7],
            [0, 8, 8],
            [1, 1, 1],
            [2, 1, 1],
        ],
        expected: 12,
    },
    {
        input: [
            [0, 4, 7],
            [0, 4, 7],
            [0, 8, 8],
            [1, 1, 1],
            [2, 1, 1],
        ],
        expected: -1,
    },
    {
        input: [
            [1, 4, 7],
            [2, 4, 7],
            [1, 1, 1],
            [2, 1, 1],
        ],
        expected: 0,
    },
];
