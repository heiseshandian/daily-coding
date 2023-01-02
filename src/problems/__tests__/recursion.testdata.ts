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

export const jumpTestData = [
    {
        input: [2, 3, 2, 1, 2, 1, 5],
        expected: 3,
    },
    {
        input: [2, 9, 2, 1, 2, 1, 5],
        expected: 2,
    },
    {
        input: [3, 6, 2, 1, 4, 5, 2, 1, 1, 1],
        expected: 3,
    },
];

export const getSubstringsTestData = [
    {
        input: 'ab',
        expected: ['a', 'ab', 'b'],
    },
    {
        input: 'abc',
        expected: ['a', 'ab', 'abc', 'b', 'bc', 'c'],
    },
    {
        input: 'abcd',
        expected: ['a', 'ab', 'abc', 'abcd', 'b', 'bc', 'bcd', 'c', 'cd', 'd'],
    },
];

export const fullPermutationTestData = [
    {
        input: 'abc',
        expected: ['abc', 'acb', 'bac', 'bca', 'cba', 'cab'],
    },
    {
        input: 'abcd',
        expected: [
            'abcd',
            'abdc',
            'acbd',
            'acdb',
            'adcb',
            'adbc',
            'bacd',
            'badc',
            'bcad',
            'bcda',
            'bdca',
            'bdac',
            'cbad',
            'cbda',
            'cabd',
            'cadb',
            'cdab',
            'cdba',
            'dbca',
            'dbac',
            'dcba',
            'dcab',
            'dacb',
            'dabc',
        ],
    },
];

export const getMinUnavailableSumTestData = [
    {
        input: [2, 3, 5],
        expected: 4,
    },
    {
        input: [1, 2, 4],
        expected: 8,
    },
];

export const getMinUnavailableSumTestData2 = [
    {
        input: [1, 2, 4],
        expected: 8,
    },
    {
        input: [1, 1, 7, 1],
        expected: 4,
    },
];

export const getMinCountTestData = [
    {
        input: { arr: [1, 2, 3, 7], target: 15 },
        expected: 1,
    },
    {
        input: { arr: [1, 5, 7], target: 15 },
        expected: 2,
    },
    {
        input: { arr: [1], target: 15 },
        expected: 3,
    },
];
