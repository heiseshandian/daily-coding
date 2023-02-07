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
    {
        input: { arr: [1, 3, 7, 5, 5, 8, 0, 6], k: 0 },
        expected: 1,
    },
    {
        input: { arr: [1, 3, 7, 5, 5, 8, 0, 6], k: -1 },
        expected: 0,
    },
];

export const getMaxSumOfSubArrTestData = [
    {
        input: [1, 4, 3, 2, -1, -6, 9],
        expected: 12,
    },
    {
        input: [1, 4, 3, 2, -1, -1, 11],
        expected: 19,
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

export const reverseBitsTestData = [
    {
        input: 0xff00ff00,
        expected: 0x00ff00ff,
    },
    {
        input: 0b00000010100101000001111010011100,
        expected: 0b00111001011110000010100101000000,
    },
    {
        input: -1,
        expected: 0b11111111111111111111111111111111,
    },
];

export const getMaxATestData = [
    {
        input: [5, 5, 5, 5],
        expected: 100,
    },
    {
        input: [5, 4, 3, 6, 1, 7],
        expected: 54,
    },
];

export const getMinCoinsTestData = [
    {
        input: {
            arr: [2, 7, 3, 5, 3],
            target: 10,
        },
        expected: 2,
    },
    {
        input: {
            arr: [2, 7, 3, 5, 10],
            target: 10,
        },
        expected: 1,
    },
    {
        input: {
            arr: [2],
            target: 10,
        },
        expected: -1,
    },
];

export const getMinJumpStepsTestData = [
    {
        input: [2, 3, 2, 1, 2, 1, 5],
        expected: 3,
    },
    {
        input: [2, 4, 1],
        expected: 1,
    },
    {
        input: [],
        expected: 0,
    },
];

export const getMaxKTestData = [
    {
        input: {
            arr1: [1, 2, 3, 4, 5],
            arr2: [3, 5, 7, 9, 11],
            k: 4,
        },
        expected: [16, 15, 14, 14],
    },
];

export const canSplit4PartsTestData = [
    {
        input: [4, 5, 1, 3, 6, 2, 2, 9, 1, 2, 1, 8],
        expected: false,
    },
    {
        input: [1, 5, 9, 3, 3, 8, 1, 2, 3, 7, 3, 3],
        expected: true,
    },
];

export const getNthUglyNumberTestData = [
    {
        input: 1,
        expected: 1,
    },
    {
        input: 2,
        expected: 2,
    },
    {
        input: 3,
        expected: 3,
    },
    {
        input: 4,
        expected: 4,
    },
    {
        input: 5,
        expected: 5,
    },
    {
        input: 6,
        expected: 6,
    },
    {
        input: 7,
        expected: 8,
    },
    {
        input: 8,
        expected: 9,
    },
    {
        input: 9,
        expected: 10,
    },
    {
        input: 10,
        expected: 12,
    },
    {
        input: 11,
        expected: 15,
    },
];

export const getMinArrTestData = [
    {
        input: [1, 5, 4, 3, 2, 6, 7],
        expected: [5, 4, 3, 2],
    },
    {
        input: [1, 5, 4, 3, 2, 6, 7, 0],
        expected: [1, 5, 4, 3, 2, 6, 7, 0],
    },
    {
        input: [2, 1],
        expected: [2, 1],
    },
    {
        input: [],
        expected: [],
    },
    {
        input: [1],
        expected: [],
    },
];

export const getMinSumThatCanNotBeComposedTestData = [
    {
        input: [3, 2, 5],
        expected: 4,
    },
    {
        input: [1, 2, 4],
        expected: 8,
    },
];

export const getMinSumThatCanNotBeComposed1TestData = [
    {
        input: [1, 2, 6],
        expected: 4,
    },
    {
        input: [1, 2, 4],
        expected: 8,
    },
    {
        input: [1],
        expected: 2,
    },
];

export const countLostNumbersTestData = [
    {
        input: {
            arr: [1, 2, 3, 7],
            range: 15,
        },
        expected: 1,
    },
    {
        input: {
            arr: [1, 5, 7],
            range: 15,
        },
        expected: 2,
    },
    {
        input: {
            arr: [2, 3, 5],
            range: 10,
        },
        expected: 1,
    },
];

export const getConnectedRegionsTestData = [
    {
        input: [2, 4, 6, 8, 10, 12, 16, 3, 7, 11, 3, 5],
        expected: [3, 10],
    },
];

export const getMinMoneyOfPassingMonsterTestData = [
    {
        input: {
            arr1: [7, 2, 9],
            arr2: [3, 6, 1],
        },
        expected: 4,
    },
    {
        input: {
            arr1: [7, 2, 9],
            arr2: [3, 6, 100],
        },
        expected: 9,
    },
];

export const getMaxLenOfComposableSubArrTestData = [
    {
        input: [5, 3, 4, 6, 2],
        expected: 5,
    },
    {
        input: [5, 5, 3, 2, 6, 4, 3],
        expected: 5,
    },
];
