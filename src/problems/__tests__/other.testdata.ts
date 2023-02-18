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
