export const powTestData = [
    {
        input: {
            a: 10,
            n: 3,
        },
        expected: 1000,
    },
    {
        input: {
            a: 3,
            n: 5,
        },
        expected: 243,
    },
];

export const gameOfLifeTestData = [
    {
        input: [
            [0, 1, 0],
            [0, 0, 1],
            [1, 1, 1],
            [0, 0, 0],
        ],
        expected: [
            [0, 0, 0],
            [1, 0, 1],
            [0, 1, 1],
            [0, 1, 0],
        ],
    },
    {
        input: [
            [1, 1],
            [1, 0],
        ],
        expected: [
            [1, 1],
            [1, 1],
        ],
    },
];
