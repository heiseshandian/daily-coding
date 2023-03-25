export const countWalkMethodsTestData = [
    {
        input: {
            n: 6,
            m: 2,
            k: 4,
            p: 4,
        },
        expected: 4,
    },
    {
        input: {
            n: 6,
            m: 2,
            k: 2,
            p: 4,
        },
        expected: 1,
    },
];

export const countMoneyTestData = [
    {
        input: {
            arr: [10, 20, 30],
            target: 100,
        },
        expected: 14,
    },
    {
        input: {
            arr: [10, 50, 52, 21, 2],
            target: 30,
        },
        expected: 4,
    },
    {
        input: {
            arr: [10, 31],
            target: 100,
        },
        expected: 1,
    },
    {
        input: {
            arr: [5, 10, 50, 100],
            target: 1000,
        },
        expected: 4246,
    },
];

export const getMinMethodsTestData = [
    {
        input: {
            str: 'babac',
            arr: ['ba', 'c', 'abcd'],
        },
        expected: 2,
    },
    {
        input: {
            str: 'babace',
            arr: ['ba', 'c', 'abcd'],
        },
        expected: -1,
    },
];

export const maxCommonSubsequenceTestData = [
    {
        input: {
            str1: 'abc1234ef5',
            str2: 'ty671234',
        },
        expected: 4,
    },
    {
        input: {
            str1: '1234',
            str2: 'abcd',
        },
        expected: 0,
    },
];

export const getCoffeeTimeTestData = [
    {
        input: {
            arr: [1, 1, 1, 1, 1, 1, 1, 1, 1, 11],
            a: 3,
            b: 10,
        },
        expected: 14,
    },
    {
        input: {
            arr: [1, 3, 5, 6, 8, 9, 2, 1, 11],
            a: 3,
            b: 10,
        },
        expected: 17,
    },
];

export const getHorseMethodsTestData = [
    {
        input: {
            a: 2,
            b: 1,
            k: 1,
        },
        expected: 1,
    },
    {
        input: {
            a: 2,
            b: 1,
            k: 3,
        },
        expected: 8,
    },
];

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

export const isInterleaveTestData = [
    {
        input: {
            str1: 'aabcc',
            str2: 'dbbca',
            str3: 'aadbbcbcac',
        },
        expected: true,
    },
    {
        input: {
            str1: 'aabcc',
            str2: 'dbbca',
            str3: 'aadbbbaccc',
        },
        expected: false,
    },
    {
        input: {
            str1: '',
            str2: '',
            str3: '',
        },
        expected: true,
    },
];

export const editDistanceTestData = [
    {
        input: {
            word1: 'horse',
            word2: 'ros',
        },
        expected: 3,
    },
    {
        input: {
            word1: 'horse',
            word2: '',
        },
        expected: 5,
    },
    {
        input: {
            word1: 'intention',
            word2: 'execution',
        },
        expected: 5,
    },
];

export const numSquaresTestData = [
    {
        input: 12,
        expected: 3,
    },
    {
        input: 13,
        expected: 2,
    },
];
