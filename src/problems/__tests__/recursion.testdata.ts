export const hanoiTestData = [
    {
        input: 3,
        expected: [
            '1 left > right',
            '2 left > center',
            '1 right > center',
            '3 left > right',
            '1 center > left',
            '2 center > right',
            '1 left > right',
        ],
    },
];

export const subsequenceTestData = [
    { input: 'abc', expected: ['', 'c', 'b', 'bc', 'a', 'ac', 'ab', 'abc'] },
    {
        input: 'abcd',
        expected: ['', 'd', 'c', 'cd', 'b', 'bd', 'bc', 'bcd', 'a', 'ad', 'ac', 'acd', 'ab', 'abd', 'abc', 'abcd'],
    },
];

export const bagTestData = [
    {
        input: {
            weights: [10, 90, 1, 4],
            values: [20, 30, 20, 3],
            targetWeight: 100,
        },
        expected: 53,
    },
    {
        input: {
            weights: [10, 90, 1, 4],
            values: [20, 30, 20, 3],
            targetWeight: 90,
        },
        expected: 43,
    },
    {
        input: {
            weights: [10, 90, 1, 4, 5, 6, 7, 8],
            values: [20, 30, 20, 3, 5, 6, 8, 7],
            targetWeight: 90,
        },
        expected: 69,
    },
    {
        input: {
            weights: [10, 90, 1, 4, 5, 6, 7, 8],
            values: [20, 30, 20, 3, 5, 6, 8, 7],
            targetWeight: 30,
        },
        expected: 59,
    },
    {
        input: {
            weights: [100],
            values: [100],
            targetWeight: 30,
        },
        expected: 0,
    },
];

export const maxNumTestData = [
    { input: [1, 100, 1], expected: 100 },
    {
        input: [1, 100, 1, 4],
        expected: 104,
    },
];

export const nQueenTestData = [
    {
        input: 1,
        expected: 1,
    },
    {
        input: 2,
        expected: 0,
    },
    {
        input: 3,
        expected: 0,
    },
    {
        input: 4,
        expected: 2,
    },
    {
        input: 5,
        expected: 10,
    },
    {
        input: 8,
        expected: 92,
    },
    {
        input: 9,
        expected: 352,
    },
];