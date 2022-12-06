export const bfsGraphTestData = [
    {
        input: [
            [0, 1, 2],
            [0, 1, 3],
            [0, 1, 4],
            [0, 2, 3],
            [0, 2, 5],
            [0, 3, 4],
            [0, 3, 5],
            [0, 4, 5],
        ],
        expected: [1, 2, 3, 4, 5],
    },
];

export const dfsGraphTestData = [
    {
        input: [
            [0, 1, 2],
            [0, 1, 3],
            [0, 1, 4],
            [0, 2, 5],
            [0, 3, 4],
            [0, 3, 5],
            [0, 4, 5],
        ],
        expected: [1, 2, 5, 3, 4],
    },
];
