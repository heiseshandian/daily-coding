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

export const getMinCandyTestData = [
    {
        input: [1, 2, 5, 4, 3, 1],
        expected: 13,
    },
    {
        input: [1, 2, 5, 4, 3, 6, 4],
        expected: 14,
    },
];

export const getMinBoatsTestData = [
    {
        input: {
            arr: [1, 3, 5, 7, 9, 2, 2, 4, 6, 8],
            limit: 10,
        },
        expected: 6,
    },
];

export const countSubArrTestData = [
    {
        input: {
            arr: [1, -1, 0, 4, 3, 5, 0, 4, 2, 9, 1],
            target: 9,
        },
        expected: 2,
    },
];

export const getMaxRopePointsTestData = [
    {
        input: {
            arr: [1, 7, 8, 9, 10, 11, 16, 18],
            rope: 4,
        },
        expected: 5,
    },
    {
        input: {
            arr: [1, 7, 8, 13],
            rope: 4,
        },
        expected: 2,
    },
];

export const getPlusOrMinusCountTestData = [
    {
        input: {
            arr: [1, 1, 1, 1, 1, 0, 0],
            target: 3,
        },
        expected: 20,
    },
    {
        input: {
            arr: [1],
            target: 1,
        },
        expected: 1,
    },
    {
        input: {
            arr: [1, 2, 3],
            target: 5,
        },
        expected: 0,
    },
    {
        input: {
            arr: [1, 2, 3],
            target: 8,
        },
        expected: 0,
    },
];

export const getMaxMoneyTestData = [
    {
        input: [
            [1, 2],
            [2, 4],
            [6, 1],
            [3, 2],
        ],
        expected: 15,
    },
];

export const getMaxGameTestData = [
    {
        input: { arr: [1, 3, 7, 5], k: 2 },
        expected: 2,
    },
    {
        input: { arr: [1, 3, 7, 5, 8, 0, 6], k: 2 },
        expected: 3,
    },
];
