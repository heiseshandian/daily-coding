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
    {
        input: [1, 2, 5, 4, 3, 6, 4, 5, 5, 6, 1, 2, 4, 5, 3, 2, 1, 4, 5, 6, 3, 2, 1, 1, 2],
        expected: 51,
    },
    {
        input: [2, 2, 2, 2],
        expected: 4,
    },
    {
        input: [2, 2, 2, 2, 3, 4, 2, 2, 2, 2, 2, 2, 2, 2, 3, 4, 2, 2, 2, 2],
        expected: 26,
    },
];

export const getMinCandyTestData3 = [
    {
        input: [1, 2, 2],
        expected: 5,
    },
    {
        input: [1, 2, 5, 4, 3, 6, 4],
        expected: 14,
    },
    {
        input: [1, 2, 5, 5, 4, 3, 6, 6, 4],
        expected: 20,
    },
    {
        input: [1, 2, 5, 4, 3, 6, 4, 5, 5, 6, 1, 2, 4, 5, 3, 2, 1, 4, 5, 6, 3, 2, 1, 1, 2],
        expected: 53,
    },
    {
        input: [2, 2, 2, 2],
        expected: 4,
    },
    {
        input: [2, 2, 2, 2, 3, 4, 4, 2, 2, 2, 2, 2, 2, 2, 2, 3, 4, 2, 2, 2, 2],
        expected: 29,
    },
    {
        input: [2, 2, 2, 2, 3, 4, 4, 2, 2, 2, 2, 2, 2, 2, 2, 3, 4, 2, 2, 2, 2, 3, 4, 3, 3, 3, 35, 4, 3, 2, 33, 4, 5, 6],
        expected: 55,
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
    {
        input: [0],
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
    {
        input: [5, 5, 1, 2, 6, 4, 3],
        expected: 6,
    },
    {
        input: [44, 4, 6, 3, 2, 1, 5, 8],
        expected: 6,
    },
];

export const getMinStrCountTestData = [
    {
        input: '123123',
        expected: 3,
    },
    {
        input: '123ab123',
        expected: 5,
    },
    {
        input: 'abcde',
        expected: 5,
    },
];

export const unzipStrTestData = [
    {
        input: '3{2{abc}}',
        expected: 'abcabcabcabcabcabc',
    },
    {
        input: '3{a}2{bc}',
        expected: 'aaabcbc',
    },
    {
        input: '3{a2{c}}',
        expected: 'accaccacc',
    },
];

export const getAllTwoTuplesTestData = [
    {
        input: {
            arr: [1, 2, 4, 4, 4, 6, 6, 6, 8, 11],
            target: 10,
        },
        expected: [
            [2, 8],
            [4, 6],
        ],
    },
    {
        input: {
            arr: [1, 9],
            target: 10,
        },
        expected: [[1, 9]],
    },
    {
        input: {
            arr: [1, 9],
            target: 11,
        },
        expected: [],
    },
];

export const getAllTriplesTestData = [
    {
        input: {
            arr: [1, 1, 2, 4, 4, 4, 6, 6, 6, 8, 11],
            target: 11,
        },
        expected: [
            [1, 2, 8],
            [1, 4, 6],
        ],
    },
];

export const getMinMissingNumberTestData = [
    {
        input: [0, -1, 3, 5, 4, 2, 1, 3, 3, 3, 3, 3, 3, 3],
        expected: 6,
    },
    {
        input: [0, -1, 3, 6, 4, 2, 1],
        expected: 5,
    },
    {
        input: [-1, 0, 1, 3, 4, 5],
        expected: 2,
    },
    {
        input: [1, 2, 0],
        expected: 3,
    },
];

export const findKthLargestTestData = [
    {
        input: {
            arr: [3, 2, 1, 5, 6, 4],
            k: 2,
        },
        expected: 5,
    },
    {
        input: {
            arr: [3, 2, 3, 1, 2, 4, 5, 5, 6],
            k: 4,
        },
        expected: 4,
    },
];

export const getMinRangeTestData = [
    {
        input: [
            [-5, 0, 1, 4, 5],
            [3, 4, 7, 8],
            [9, 10, 13],
            [1, 99],
        ],
        expected: [1, 9],
    },
    {
        input: [
            [-100, 0, 3, 10],
            [0, 4, 6, 7, 11],
            [8, 9, 11, 18],
            [200, 201, 300, 400],
        ],
        expected: [10, 200],
    },
];

export const getMinPalindromeTestData = [
    {
        input: 'AB',
        expected: 'ABA',
    },
    {
        input: 'ab12231c',
        expected: 'abc132231cba',
    },
];

export const getMaxIncreasingNumTestData = [
    {
        input: [
            [9, 9, 4],
            [6, 6, 8],
            [2, 1, 1],
        ],
        expected: 4,
    },
    {
        input: [
            [3, 4, 5],
            [3, 2, 6],
            [2, 2, 1],
        ],
        expected: 4,
    },
];

export const getClosestSumKTestData = [
    {
        input: {
            arr: [1, 3, 4, 5, 6],
            k: 100,
        },
        expected: 19,
    },
    {
        input: {
            arr: [2, 3, 4, 5, 6],
            k: 8,
        },
        expected: 7,
    },
    {
        input: {
            arr: [1, 3, 4, 5, 6],
            k: 8,
        },
        expected: 8,
    },
];

export const getClosestSumKOfMatrixTestData = [
    {
        input: {
            matrix: [
                [1, 3, 2, 4],
                [4, 5, 7, 6],
                [3, 2, 3, 3],
            ],
            k: 100,
        },
        expected: 43,
    },
    {
        input: {
            matrix: [
                [1, 3, 2, 4],
                [4, 5, 7, 6],
                [3, 2, 3, 3],
            ],
            k: 14,
        },
        expected: 13,
    },
];

export const findWordsTestData = [
    {
        input: {
            board: [
                ['o', 'a', 'a', 'n'],
                ['e', 't', 'a', 'e'],
                ['i', 'h', 'k', 'r'],
                ['i', 'f', 'l', 'v'],
            ],
            words: ['oath', 'pea', 'eat', 'rain', 'oathi', 'oathk', 'oathf', 'oate', 'oathii', 'oathfi', 'oathfii'],
        },
        expected: ['oath', 'oathf', 'oathfi', 'oathfii', 'oathi', 'oathii', 'oathk', 'oate', 'eat'],
    },
    {
        input: {
            board: [
                ['o', 'a', 'a', 'n'],
                ['e', 't', 'a', 'e'],
                ['i', 'h', 'k', 'r'],
                ['i', 'f', 'l', 'v'],
            ],
            words: ['oath', 'pea', 'eat', 'rain'],
        },
        expected: ['oath', 'eat'],
    },
    {
        input: {
            board: [
                ['a', 'b'],
                ['c', 'd'],
            ],
            words: ['abcb'],
        },
        expected: [],
    },
];

export const getMinValueTestData = [
    {
        input: [2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        expected: 1,
    },
    {
        input: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2],
        expected: 1,
    },
    {
        input: [2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        expected: 1,
    },
    {
        input: [3, 4, 5, 0, 1, 2, 3],
        expected: 0,
    },
    {
        input: [3, 4, 5, 0, 0, 0, 1, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
        expected: 0,
    },
    {
        input: [1, 2, 3],
        expected: 1,
    },
];

export const getMaxProfitTestData = [
    {
        input: [1, 3, 2, 4, 5, 0, 9],
        expected: 9,
    },
    {
        input: [1, 3, 2, 8, 5, 3, 9],
        expected: 8,
    },
];

export const getMaxProfit3TestData = [
    {
        input: [0, 7, 8, 4, 9],
        expected: 13,
    },
    {
        input: [9, 8, 7, 6, 5, 6],
        expected: 1,
    },
];

export const getMaxProfit4TestData = [
    {
        input: {
            arr: [1, 3, 2, 4, 5, 0, 9],
            k: 1,
        },
        expected: 9,
    },
    {
        input: {
            arr: [1, 3, 2, 8, 5, 3, 9],
            k: 1,
        },
        expected: 8,
    },
    {
        input: {
            arr: [0, 7, 8, 4, 9],
            k: 2,
        },
        expected: 13,
    },
    {
        input: {
            arr: [0, 7, 8, 4, 9],
            k: 11,
        },
        expected: 13,
    },
    {
        input: {
            arr: [0, 7, 8, 4, 9],
            k: 1,
        },
        expected: 9,
    },
];

export const countSubsequenceTestData = [
    {
        input: {
            s: 'rabbbit',
            t: 'rabbit',
        },
        expected: 3,
    },
    {
        input: {
            s: 'rabbabit',
            t: 'rabbit',
        },
        expected: 3,
    },
];

export const getCalculateMethodsTestData = [
    {
        input: {
            str: '123',
            target: 6,
        },
        expected: ['1+2+3', '1*2*3'],
    },
    {
        input: {
            str: '232',
            target: 8,
        },
        expected: ['2*3+2', '2+3*2'],
    },
    {
        input: {
            str: '105',
            target: 5,
        },
        expected: ['10-5', '1*0+5'],
    },
    {
        input: {
            str: '00',
            target: 0,
        },
        expected: ['0*0', '0+0', '0-0'],
    },
    {
        input: {
            str: '3456237490',
            target: 9191,
        },
        expected: [],
    },
];

export const existWordTestData = [
    {
        input: {
            board: [
                ['A', 'B', 'C', 'E'],
                ['S', 'F', 'C', 'S'],
                ['A', 'D', 'E', 'E'],
            ],
            word: 'ABCCED',
        },
        expected: true,
    },
    {
        input: {
            board: [
                ['A', 'B', 'C', 'E'],
                ['S', 'F', 'C', 'S'],
                ['A', 'D', 'E', 'E'],
            ],
            word: 'SEE',
        },
        expected: true,
    },
    {
        input: {
            board: [
                ['A', 'B', 'C', 'E'],
                ['S', 'F', 'C', 'S'],
                ['A', 'D', 'E', 'E'],
            ],
            word: 'ABCB',
        },
        expected: false,
    },
];

export const countJointMethodsTestData = [
    {
        input: {
            str: 'aaabc',
            arr: ['a', 'aa', 'aaa', 'bc'],
        },
        expected: 4,
    },
    {
        input: {
            str: 'aaabc',
            arr: ['a', 'aaa', 'bc'],
        },
        expected: 2,
    },
    {
        input: {
            str: 'aaabc',
            arr: ['a', 'aa', 'bc'],
        },
        expected: 3,
    },
];

export const reverseBetweenTestData = [
    {
        input: { arr: [1, 2, 3, 4, 5], left: 2, right: 4 },
        expected: [1, 4, 3, 2, 5],
    },
    {
        input: { arr: [1], left: 1, right: 1 },
        expected: [1],
    },
    {
        input: { arr: [1, 2], left: 1, right: 2 },
        expected: [2, 1],
    },
    {
        input: { arr: [1, 2, 3], left: 1, right: 2 },
        expected: [2, 1, 3],
    },
];

export const updatePathsTestData = [
    {
        input: [9, 1, 4, 9, 0, 4, 8, 9, 0, 1],
        expected: [1, 1, 3, 2, 3, 0, 0, 0, 0, 0],
    },
    {
        input: [4, 9, 1, 9, 1, 9, 3, 5, 4, 9],
        expected: [1, 3, 4, 2, 0, 0, 0, 0, 0, 0],
    },
];

export const calculateStrTestData = [
    {
        input: '48*(70-65)-43+8*1',
        expected: 205,
    },
    {
        input: '3+(-1)*4-(-4*6)',
        expected: 23,
    },
    {
        input: '3+(-1)*4-(-4/4)',
        expected: 0,
    },
];

export const getValidParenthesesTestData = [
    {
        input: '()())()',
        expected: ['(())()', '()()()'],
    },
    {
        input: '((()',
        expected: ['()'],
    },
    {
        input: ')()',
        expected: ['()'],
    },
    {
        input: ')(',
        expected: [''],
    },
];

export const getMaxLengthOfIncreasingSubsequenceTestData = [
    {
        input: [4, 1, 3, 2, 3, 9, 5, 6],
        expected: 5,
    },
    {
        input: [4, 1, 3, 2, 3, 4, 9, 1, 2],
        expected: 5,
    },
    {
        input: [4, 1, 3, 2, 3, 4, 9, 1, 2, 5, 8, 9],
        expected: 7,
    },
    {
        input: [1, 1, 1, 1, 1],
        expected: 1,
    },
    {
        input: [1],
        expected: 1,
    },
    {
        input: [],
        expected: 0,
    },
    {
        input: [3, 2, 1, 2, 3, 9, 4, 3, 2, 1],
        expected: 4,
    },
];

export const getMaxSizeOfAllOnesTestData = [
    {
        input: [
            [1, 1, 0, 1],
            [1, 1, 1, 0],
            [1, 1, 1, 1],
        ],
        expected: 6,
    },
    {
        input: [[1, 1, 1, 0]],
        expected: 3,
    },
    {
        input: [[1, 0]],
        expected: 1,
    },
    {
        input: [[0, 0]],
        expected: 0,
    },
    {
        input: [
            [1, 1, 1, 1, 0],
            [1, 1, 0, 1, 0],
            [1, 1, 1, 1, 0],
        ],
        expected: 6,
    },
];

export const longestValidParenthesesTestData = [
    {
        input: '(()',
        expected: 2,
    },
    {
        input: '()(())',
        expected: 6,
    },
    {
        input: ')',
        expected: 0,
    },
    {
        input: ')()())',
        expected: 4,
    },
    {
        input: '(())()())',
        expected: 8,
    },
];

export const findSubstringTestData = [
    {
        input: {
            s: 'barfoothefoobarman',
            words: ['foo', 'bar'],
        },
        expected: [0, 9],
    },
    {
        input: {
            s: 'wordgoodgoodgoodbestword',
            words: ['word', 'good', 'best', 'word'],
        },
        expected: [],
    },
    {
        input: {
            s: 'barfoofoobarthefoobarman',
            words: ['bar', 'foo', 'the'],
        },
        expected: [6, 9, 12],
    },
    {
        input: {
            s: 'aaaaaaaaaaaaaaaa',
            words: ['a', 'a'],
        },
        expected: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
    },
];

export const evaluationMethodsTestData = [
    {
        input: {
            str: '1',
            expectedResult: 0,
        },
        expected: 0,
    },
    {
        input: {
            str: '1^0|0|1',
            expectedResult: 0,
        },
        expected: 2,
    },
    {
        input: {
            str: '0&1&1|1',
            expectedResult: 1,
        },
        expected: 2,
    },
];

export const findMinMovesTestData = [
    {
        input: [1, 0, 5],
        expected: 3,
    },
    {
        input: [0, 3, 0],
        expected: 2,
    },
    {
        input: [0, 2, 0],
        expected: -1,
    },
];

export const kthSmallestTestData = [
    {
        input: {
            matrix: [
                [1, 5, 9],
                [10, 11, 13],
                [12, 13, 15],
            ],
            k: 8,
        },
        expected: 13,
    },
    {
        input: {
            matrix: [
                [1, 2],
                [1, 2],
            ],
            k: 1,
        },
        expected: 1,
    },
];

export const distinctSubsequenceIITestData = [
    {
        input: 'abc',
        expected: 7,
    },
    {
        input: '121',
        expected: 6,
    },
    {
        input: '1211',
        expected: 9,
    },
];

export const shortestBridgeTestData = [
    {
        input: [
            [0, 1, 0, 0, 0],
            [0, 1, 0, 1, 1],
            [0, 0, 0, 0, 1],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
        ],
        expected: 1,
    },
    {
        input: [
            [0, 1],
            [1, 0],
        ],
        expected: 1,
    },
    {
        input: [
            [0, 1, 0],
            [0, 0, 0],
            [0, 0, 1],
        ],
        expected: 2,
    },
    {
        input: [
            [1, 1, 1, 1, 1],
            [1, 0, 0, 0, 1],
            [1, 0, 1, 0, 1],
            [1, 0, 0, 0, 1],
            [1, 1, 1, 1, 1],
        ],
        expected: 1,
    },
];

export const trapTestData = [
    {
        input: [4, 2, 3],
        expected: 1,
    },
    {
        input: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1],
        expected: 6,
    },
    {
        input: [4, 2, 0, 3, 2, 5],
        expected: 9,
    },
];

export const trapRainWaterTestData = [
    {
        input: [
            [1, 4, 3, 1, 3, 2],
            [3, 2, 1, 3, 2, 4],
            [2, 3, 3, 2, 3, 1],
        ],
        expected: 4,
    },
    {
        input: [
            [3, 3, 3, 3, 3],
            [3, 2, 2, 2, 3],
            [3, 2, 1, 2, 3],
            [3, 2, 2, 2, 3],
            [3, 3, 3, 3, 3],
        ],
        expected: 10,
    },
];

export const majorityElementTestData = [
    {
        input: [1, 1, 2],
        expected: 1,
    },
    {
        input: [1, 1, 2, 3, 1],
        expected: 1,
    },
];

export const majorityElement2TestData = [
    {
        input: [1, 1, 2],
        expected: [1],
    },
    {
        input: [1, 1, 2, 3, 1],
        expected: [1],
    },
    {
        input: [1, 2],
        expected: [1, 2],
    },
    {
        input: [1, 2, 1, 2, 3, 3, 1],
        expected: [1],
    },
];

export const mergeStonesTestData = [
    {
        input: {
            stones: [3, 2, 4, 1],
            k: 2,
        },
        expected: 20,
    },
    {
        input: {
            stones: [3, 2, 4, 1],
            k: 3,
        },
        expected: -1,
    },
    {
        input: {
            stones: [3, 5, 1, 2, 6],
            k: 3,
        },
        expected: 25,
    },
];

export const minWindowTestData = [
    {
        input: {
            str1: 'ADOBECODEBANC',
            str2: 'ABC',
        },
        expected: 'BANC',
    },
    {
        input: {
            str1: 'ab',
            str2: 'a',
        },
        expected: 'a',
    },
];

export const setZerosTestData = [
    {
        input: [
            [1, 1, 1],
            [1, 0, 1],
            [1, 1, 1],
        ],
        expected: [
            [1, 0, 1],
            [0, 0, 0],
            [1, 0, 1],
        ],
    },
    {
        input: [
            [0, 1, 2, 0],
            [3, 4, 5, 2],
            [1, 3, 1, 5],
        ],
        expected: [
            [0, 0, 0, 0],
            [0, 4, 5, 0],
            [0, 3, 1, 0],
        ],
    },
];

export const countPrimesTestData = [
    {
        input: 10,
        expected: 4,
    },
];

export const getSumOfMatrixTestData = [
    {
        input: [[1, 2, 3, 4]],
        expected: [[1, 3, 6, 10]],
    },
    {
        input: [[1], [3], [5], [1]],
        expected: [[1], [4], [9], [10]],
    },
    {
        input: [
            [1, 4, 3, 2],
            [5, 4, 3, 2],
            [3, 2, 2, 1],
        ],
        expected: [
            [1, 5, 8, 10],
            [6, 14, 20, 24],
            [9, 19, 27, 32],
        ],
    },
];

export const getSumOfi1j1i2j2TestData = [
    {
        input: {
            sumOfMatrix: [
                [1, 5, 8, 10],
                [6, 14, 20, 24],
                [9, 19, 27, 32],
            ],
            i1: 0,
            j1: 0,
            i2: 0,
            j2: 0,
        },
        expected: 1,
    },
    {
        input: {
            sumOfMatrix: [
                [1, 5, 8, 10],
                [6, 14, 20, 24],
                [9, 19, 27, 32],
            ],
            i1: 0,
            j1: 0,
            i2: 0,
            j2: 3,
        },
        expected: 10,
    },
    {
        input: {
            sumOfMatrix: [
                [1, 5, 8, 10],
                [6, 14, 20, 24],
                [9, 19, 27, 32],
            ],
            i1: 0,
            j1: 0,
            i2: 2,
            j2: 0,
        },
        expected: 9,
    },
    {
        input: {
            sumOfMatrix: [
                [1, 5, 8, 10],
                [6, 14, 20, 24],
                [9, 19, 27, 32],
            ],
            i1: 0,
            j1: 1,
            i2: 0,
            j2: 3,
        },
        expected: 9,
    },
    {
        input: {
            sumOfMatrix: [
                [1, 5, 8, 10],
                [6, 14, 20, 24],
                [9, 19, 27, 32],
            ],
            i1: 1,
            j1: 1,
            i2: 2,
            j2: 3,
        },
        expected: 14,
    },
];

export const splitEarthTestData = [
    {
        input: [
            [3, 3, 3, 2],
            [3, 2, 3, 3],
            [3, 3, 3, 2],
            [2, 3, 2, 3],
        ],
        expected: 2,
    },
    {
        input: [
            [3, 3, 3, 1],
            [3, 2, 3, 3],
            [3, 3, 3, 2],
            [2, 3, 2, 3],
        ],
        expected: 1,
    },
    {
        input: [
            [3, 3, 3, 2, 5, 6, 3, 2],
            [3, 2, 3, 3, 9, 7, 6, 3],
            [3, 3, 3, 2, 4, 5, 3, 2],
            [2, 3, 2, 3, 4, 3, 2, 1],
        ],
        expected: 4,
    },
    {
        input: [
            [3, 3, 3, 2, 5, 6, 3, 2],
            [3, 2, 3, 3, 9, 7, 6, 3],
            [3, 3, 3, 2, 4, 5, 3, 2],
            [2, 3, 2, 3, 4, 3, 2, 1],
            [3, 2, 3, 3, 4, 6, 5, 3],
            [1, 2, 4, 2, 4, 5, 3, 2],
            [1, 2, 4, 2, 4, 5, 6, 2],
        ],
        expected: 6,
    },
    {
        input: [
            [14, 17, 5, 75, 98, 7, 49, 38, 42, 72],
            [63, 40, 88, 91, 45, 53, 90, 25, 51, 6],
            [67, 2, 54, 17, 11, 52, 16, 48, 67, 44],
            [75, 48, 61, 48, 43, 36, 92, 26, 87, 94],
            [5, 52, 64, 36, 4, 16, 50, 37, 83, 16],
            [71, 66, 30, 94, 96, 65, 37, 32, 98, 8],
            [58, 76, 49, 88, 93, 17, 39, 78, 28, 85],
            [30, 36, 37, 42, 36, 99, 10, 77, 54, 34],
            [13, 12, 48, 31, 76, 89, 72, 48, 54, 20],
            [58, 59, 65, 94, 73, 69, 36, 81, 75, 11],
        ],
        expected: 183,
    },
    {
        input: [
            [57, 50, 64, 91, 72, 80, 60, 82],
            [55, 16, 91, 80, 10, 80, 28, 75],
            [26, 59, 8, 83, 75, 63, 69, 64],
            [76, 62, 64, 33, 68, 29, 63, 57],
            [37, 46, 81, 41, 29, 52, 50, 39],
            [13, 35, 8, 56, 98, 32, 2, 14],
            [11, 61, 28, 70, 77, 43, 97, 55],
            [19, 62, 31, 48, 39, 65, 18, 35],
            [4, 61, 75, 88, 62, 42, 56, 51],
        ],
        expected: 146,
    },
];

export const getMaxArrOf2PartsMinTestData = [
    {
        input: [64, 16, 58, 50, 81, 57, 50, 16, 88, 16],
        expected: [-Infinity, 16, 64, 80, 131, 138, 188, 188, 211, 227],
    },
    {
        input: [84, 71, 43, 19, 70, 77, 66, 81, 37, 29],
        expected: [-Infinity, 71, 84, 84, 132, 166, 213, 224, 261, 287],
    },
    {
        input: [70, 12, 42, 75, 88, 40, 17, 86, 40, 48],
        expected: [-Infinity, 12, 54, 82, 124, 128, 145, 199, 199, 231],
    },
    {
        input: [75, 59, 80, 91, 70, 63, 28, 65, 51, 31],
        expected: [-Infinity, 59, 80, 134, 161, 214, 214, 226, 277, 305],
    },
    { input: [16, 52, 73, 62, 77, 2, 75, 13, 4, 71], expected: [-Infinity, 16, 68, 68, 139, 141, 154, 167, 171, 203] },
    { input: [93, 28, 47, 23, 85, 37, 75, 9, 56, 22], expected: [-Infinity, 28, 75, 93, 121, 145, 191, 191, 191, 199] },
    { input: [19, 23, 68, 34, 22, 77, 81, 56, 45, 50], expected: [-Infinity, 19, 42, 42, 56, 110, 158, 166, 182, 232] },
    { input: [61, 26, 59, 62, 9, 12, 81, 71, 23, 62], expected: [-Infinity, 26, 61, 87, 87, 87, 146, 173, 196, 229] },
    {
        input: [100, 2, 100, 21, 97, 82, 65, 72, 57, 99],
        expected: [-Infinity, 2, 100, 102, 118, 200, 223, 223, 276, 320],
    },
    { input: [50, 5, 18, 91, 53, 39, 32, 71, 64, 2], expected: [-Infinity, 5, 23, 73, 73, 92, 124, 164, 206, 208] },
];

export const lengthOfLongestSubstringTestData = [
    {
        input: 'abcabcbb',
        expected: 3,
    },
    {
        input: 'bbbbb',
        expected: 1,
    },
    {
        input: 'pwwkew',
        expected: 3,
    },
];

export const lengthOfLongestSubstringKDistinctTestData = [
    {
        input: {
            str: 'aaaccccctgbacdcd',
            k: 2,
        },
        expected: 8,
    },
    {
        input: {
            str: 'aac',
            k: 2,
        },
        expected: 3,
    },
    {
        input: {
            str: 'aacc',
            k: 2,
        },
        expected: 4,
    },
    {
        input: {
            str: 'aacc',
            k: 3,
        },
        expected: 4,
    },
];

export const getMaxPartsArrayTestData = [
    {
        input: '010100001',
        expected: [1, 1, 1, 2, 1, 2, 1, 1, 3],
    },
];

export const getSubsequenceWithBiggestDictionarySequenceTestData = [
    {
        input: {
            str: 'cabacd',
            k: 5,
        },
        expected: 'cbacd',
    },
    {
        input: {
            str: 'cabacd',
            k: 4,
        },
        expected: 'cbcd',
    },
    {
        input: {
            str: 'zsxwea',
            k: 5,
        },
        expected: 'zxwea',
    },
    {
        input: {
            str: 'zsxwea',
            k: 3,
        },
        expected: 'zxw',
    },
];

export const getMaxValueOfSTestData = [
    {
        input: '000001100000',
        expected: 55,
    },
    {
        input: '01010101',
        expected: 11,
    },
];
