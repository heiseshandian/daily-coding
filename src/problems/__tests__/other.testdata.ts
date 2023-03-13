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
    {
        input: [16, 52, 73, 62, 77, 2, 75, 13, 4, 71],
        expected: [-Infinity, 16, 68, 68, 139, 141, 154, 167, 171, 203],
    },
    {
        input: [93, 28, 47, 23, 85, 37, 75, 9, 56, 22],
        expected: [-Infinity, 28, 75, 93, 121, 145, 191, 191, 191, 199],
    },
    {
        input: [19, 23, 68, 34, 22, 77, 81, 56, 45, 50],
        expected: [-Infinity, 19, 42, 42, 56, 110, 158, 166, 182, 232],
    },
    {
        input: [61, 26, 59, 62, 9, 12, 81, 71, 23, 62],
        expected: [-Infinity, 26, 61, 87, 87, 87, 146, 173, 196, 229],
    },
    {
        input: [100, 2, 100, 21, 97, 82, 65, 72, 57, 99],
        expected: [-Infinity, 2, 100, 102, 118, 200, 223, 223, 276, 320],
    },
    {
        input: [50, 5, 18, 91, 53, 39, 32, 71, 64, 2],
        expected: [-Infinity, 5, 23, 73, 73, 92, 124, 164, 206, 208],
    },
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

export const getLongestIncreasingSubsequenceTestData = [
    { input: [93, 14, 50, 52, 13], expected: [14, 50, 52] },
    { input: [89, 95, 77, 19, 95], expected: [89, 95] },
    { input: [38, 26, 9, 83, 63], expected: [9, 63] },
    { input: [100, 11, 95, 3, 51], expected: [11, 51] },
    { input: [1, 3, 5, 8, 6, 1], expected: [1, 3, 5, 6] },
];

export const getMaxRemovableSubsequenceTestData = [
    {
        input: '0123',
        expected: 4,
    },
    {
        input: '02131',
        expected: 4,
    },
    {
        input: '02331',
        expected: 4,
    },
];

export const getMinChangesTestData = [
    {
        input: [1, 2, 3, 4],
        expected: 0,
    },
    {
        input: [7, 4, 3, 1],
        expected: 0,
    },
    {
        input: [1, 5, 3, 2, 6],
        expected: 1,
    },
];

export const nextPermutationTestData = [
    {
        input: [1, 3, 2],
        expected: [2, 1, 3],
    },
    {
        input: [1, 1, 5],
        expected: [1, 5, 1],
    },
    {
        input: [3, 2, 1],
        expected: [1, 2, 3],
    },
    {
        input: [20, 12, 9, 20, 19],
        expected: [20, 12, 19, 9, 20],
    },
];

export const getLengthOfLongestSubArrayWithSumKTestData = [
    {
        input: {
            arr: [10, 1, 1, 1],
            k: 3,
        },
        expected: 3,
    },
    {
        input: {
            arr: [1, 2, 3, 1, 1, 1, 2, 1],
            k: 6,
        },
        expected: 5,
    },
    {
        input: {
            arr: [1, 2, 3, 1, 1, 1, 1, 1],
            k: 6,
        },
        expected: 4,
    },
    {
        input: {
            arr: [3, 6, 5],
            k: 3,
        },
        expected: 1,
    },
];

export const getLengthOfLongestSubArrayWithSumK2TestData = [
    {
        input: {
            arr: [-10, 1, 1, 1, 7, 3, 4],
            k: 3,
        },
        expected: 6,
    },
    {
        input: {
            arr: [10, 1, 1, 1],
            k: 3,
        },
        expected: 3,
    },
    {
        input: {
            arr: [10, -1, -1, -8, 2, 1, 3, 2],
            k: 3,
        },
        expected: 6,
    },
];

export const getMinDistanceTestData = [
    {
        input: [
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
        ],
        expected: 12,
    },
    {
        input: [
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
        ],
        expected: 20,
    },
    {
        input: [
            [1, 1, 1],
            [1, 0, 1],
            [1, 1, 1],
            [1, 1, 1],
        ],
        expected: 19,
    },
];

export const minEatingSpeedTestData = [
    {
        input: {
            arr: [3, 6, 7, 11],
            h: 8,
        },
        expected: 4,
    },
    {
        input: {
            arr: [30, 11, 23, 4, 20],
            h: 5,
        },
        expected: 30,
    },
    {
        input: {
            arr: [30, 11, 23, 4, 20],
            h: 6,
        },
        expected: 23,
    },
    {
        input: {
            arr: [1, 1, 1, 1, 9999999],
            h: 10,
        },
        expected: 1666667,
    },
];

export const maxUncrossedLinesTestData = [
    {
        input: {
            nums1: [1, 4, 2],
            nums2: [1, 2, 4],
        },
        expected: 2,
    },
    {
        input: {
            nums1: [2, 5, 1, 2, 5],
            nums2: [10, 5, 2, 1, 5, 2],
        },
        expected: 3,
    },
    {
        input: {
            nums1: [1, 3, 7, 1, 7, 5],
            nums2: [1, 9, 2, 5, 1],
        },
        expected: 2,
    },
];

export const avoidFloodTestData = [
    {
        input: [1, 2, 3, 4],
        expected: [-1, -1, -1, -1],
    },
    {
        input: [1, 2, 0, 0, 2, 1],
        expected: [-1, -1, 2, 1, -1, -1],
    },
    {
        input: [1, 2, 0, 1, 2],
        expected: [],
    },
    {
        input: [0, 1, 1],
        expected: [],
    },
];

export const rotateTestData = [
    {
        input: [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9],
        ],
        expected: [
            [7, 4, 1],
            [8, 5, 2],
            [9, 6, 3],
        ],
    },
    {
        input: [
            [5, 1, 9, 11],
            [2, 4, 8, 10],
            [13, 3, 6, 7],
            [15, 14, 12, 16],
        ],
        expected: [
            [15, 13, 2, 5],
            [14, 3, 4, 1],
            [12, 6, 8, 9],
            [16, 7, 10, 11],
        ],
    },
];

export const rotateRightTestData = [
    {
        input: {
            arr: [1, 2, 3, 4, 5],
            k: 2,
        },
        expected: [4, 5, 1, 2, 3],
    },
    {
        input: {
            arr: [0, 1, 2],
            k: 4,
        },
        expected: [2, 0, 1],
    },
];

export const reversePairsTestData = [
    {
        input: [1, 3, 2, 3, 1],
        expected: 2,
    },
    {
        input: [2, 4, 3, 5, 1],
        expected: 3,
    },
];

export const maxRunTimeTestData = [
    {
        input: {
            arr: [3, 3, 3],
            n: 2,
        },
        expected: 4,
    },
    {
        input: {
            arr: [1, 1, 1, 1],
            n: 2,
        },
        expected: 2,
    },
];

export const leastWaitingTimeTestData = [
    {
        input: {
            arr: [1, 2, 3, 5],
            n: 5,
        },
        expected: 2,
    },
    {
        input: {
            arr: [1, 2, 3, 5],
            n: 6,
        },
        expected: 2,
    },
];

export const findSubstringInWrapRoundStringTestData = [
    {
        input: 'a',
        expected: 1,
    },
    {
        input: 'zab',
        expected: 6,
    },
    {
        input: 'cac',
        expected: 2,
    },
];

export const numTilePossibilitiesTestData = [
    {
        input: 'AAB',
        expected: 8,
    },
    {
        input: 'AAABBC',
        expected: 188,
    },
    {
        input: 'C',
        expected: 1,
    },
];

export const getMaxDiffTestData = [
    {
        input: [1, 99, 78, 43, 22],
        expected: 35,
    },
    {
        input: [1, 1, 2],
        expected: 1,
    },
    {
        input: [1, 1, 1],
        expected: 0,
    },
];

export const getMinBagsTestData = [
    {
        input: 14,
        expected: 2,
    },
    {
        input: 22,
        expected: 3,
    },
    {
        input: 108,
        expected: 14,
    },
    {
        input: 99,
        expected: -1,
    },
    {
        input: 266,
        expected: 34,
    },
    {
        input: 274,
        expected: 35,
    },
    {
        input: 271,
        expected: -1,
    },
];

export const numSubMatrixSumTargetTestData = [
    {
        input: {
            matrix: [
                [0, 1, 0],
                [1, 1, 1],
                [0, 1, 0],
            ],
            target: 0,
        },
        expected: 4,
    },
    {
        input: {
            matrix: [
                [1, -1],
                [-1, 1],
            ],
            target: 0,
        },
        expected: 5,
    },
    {
        input: {
            matrix: [[904]],
            target: 0,
        },
        expected: 0,
    },
];

export const maxEqualRowsAfterFlipsTestData = [
    {
        input: [
            [0, 1],
            [1, 1],
        ],
        expected: 1,
    },
    {
        input: [
            [0, 1],
            [1, 0],
        ],
        expected: 2,
    },
    {
        input: [
            [0, 0, 0],
            [0, 0, 1],
            [1, 1, 0],
        ],
        expected: 2,
    },
];

export const maxSquareSideLengthTestData = [
    {
        input: [
            [0, 1, 1, 1],
            [0, 1, 1, 1],
        ],
        expected: 2,
    },
    {
        input: [
            [0, 0, 0, 1],
            [0, 1, 1, 1],
        ],
        expected: 0,
    },
    {
        input: [
            [1, 1, 1, 1],
            [1, 1, 0, 1],
            [1, 1, 1, 1],
            [1, 1, 1, 1],
        ],
        expected: 4,
    },
    {
        input: [
            [0, 1, 1, 1],
            [1, 1, 0, 1],
            [1, 1, 1, 1],
            [1, 1, 1, 1],
        ],
        expected: 3,
    },
];

export const productTestData = [
    {
        input: [5, 41, 94, 61, 90, 14],
        expected: [296218440, 36124200, 15756300, 24280200, 16456580, 105792300],
    },
    {
        input: [5, 60, 90, 37, 21, 18],
        expected: [75524400, 6293700, 4195800, 10206000, 17982000, 20979000],
    },
    {
        input: [40, 93, 24, 65, 73, 92],
        expected: [974357280, 419078400, 1623928800, 599604480, 533894400, 423633600],
    },
    {
        input: [31, 83, 80, 43, 94, 15],
        expected: [402583200, 150362400, 156000990, 290234400, 132766800, 832005280],
    },
    {
        input: [92, 56, 3, 91, 70, 2],
        expected: [2140320, 3516240, 65636480, 2163840, 2812992, 98454720],
    },
    {
        input: [52, 2, 68, 92, 65, 11],
        expected: [8946080, 232598080, 6841120, 5056480, 7156864, 42290560],
    },
    {
        input: [7, 34, 13, 30, 64, 40],
        expected: [33945600, 6988800, 18278400, 7920640, 3712800, 5940480],
    },
    {
        input: [0, 0, 1, 2, 3],
        expected: [0, 0, 0, 0, 0],
    },
    {
        input: [0, 1, 2, 3],
        expected: [6, 0, 0, 0],
    },
];

export const countSubArraysTestData = [
    {
        input: { arr: [84, 20, 54, 40, 30, 63, 94, 5, 45, 48, 49], num: 23 },
        expected: 16,
    },
    {
        input: { arr: [17, 57, 90, 69, 56, 30, 29, 40, 47, 27, 21], num: 8 },
        expected: 14,
    },
    {
        input: { arr: [26, 78, 43, 75, 23, 82, 83, 56, 41, 100, 23], num: 1 },
        expected: 12,
    },
    {
        input: { arr: [91, 66, 90, 15, 33, 87, 72, 60, 86, 79, 100], num: 14 },
        expected: 13,
    },
    {
        input: { arr: [60, 39, 4, 15, 47, 53, 84, 38, 72, 89, 72], num: 30 },
        expected: 17,
    },
    {
        input: { arr: [28, 53, 79, 81, 6, 58, 79, 14, 10, 67, 3], num: 15 },
        expected: 13,
    },
    {
        input: { arr: [43, 100, 46, 51, 84, 73, 78, 62, 43, 65, 96], num: 22 },
        expected: 21,
    },
    {
        input: { arr: [25, 68, 45, 17, 65, 93, 9, 63, 30, 18, 53], num: 28 },
        expected: 15,
    },
    {
        input: { arr: [23, 4, 83, 38, 4, 21, 35, 38, 65, 39, 33], num: 22 },
        expected: 17,
    },
    {
        input: { arr: [8, 64, 91, 39, 10, 83, 47, 13, 70, 30, 34], num: 11 },
        expected: 12,
    },
];

export const countZerosTestData = [
    {
        input: 5,
        expected: 1,
    },
    {
        input: 3,
        expected: 0,
    },
    {
        input: 10,
        expected: 2,
    },
    {
        input: 1000000000,
        expected: 249999998,
    },
];

export const getNumOfMostRightOneTestData = [
    {
        input: 1000000000,
        expected: 999999987,
    },
    {
        input: 1,
        expected: 0,
    },
    {
        input: 2,
        expected: 1,
    },
];

export const getMinTimeOfDrawingTestData = [
    {
        input: {
            arr: [3, 1, 4],
            num: 2,
        },
        expected: 4,
    },
    {
        input: {
            arr: [1, 1, 1, 3, 1, 4],
            num: 3,
        },
        expected: 4,
    },
    {
        input: { arr: [53, 17, 26, 95, 8, 37, 64, 76, 2, 51, 11, 64, 98, 49, 60, 19, 41], num: 15 },
        expected: 98,
    },
    {
        input: { arr: [26, 23, 48, 91, 71, 45, 84, 52, 28, 50, 57, 63, 7, 15, 2, 39, 36], num: 25 },
        expected: 91,
    },
    {
        input: { arr: [50, 11, 57, 35, 30, 48, 47, 88, 68, 86, 19, 59, 91, 94, 38, 54, 51], num: 19 },
        expected: 94,
    },
    {
        input: { arr: [47, 52, 77, 48, 35, 95, 9, 2, 6, 85, 86, 79, 46, 43, 79, 86, 87], num: 7 },
        expected: 171,
    },
    {
        input: { arr: [13, 26, 65, 63, 5, 4, 72, 28, 88, 12, 40, 94, 83, 76, 8, 53, 19], num: 5 },
        expected: 177,
    },
    {
        input: { arr: [43, 54, 91, 84, 80, 5, 83, 70, 30, 61, 40, 22, 47, 99, 16, 23, 45], num: 24 },
        expected: 99,
    },
    {
        input: { arr: [91, 44, 96, 17, 37, 70, 21, 22, 25, 82, 37, 52, 73, 62, 59, 17, 49], num: 31 },
        expected: 96,
    },
    {
        input: { arr: [70, 22, 33, 55, 99, 28, 94, 24, 83, 59, 56, 7, 82, 48, 25, 86, 9], num: 29 },
        expected: 99,
    },
    {
        input: { arr: [42, 84, 56, 39, 46, 55, 73, 57, 26, 54, 76, 94, 47, 14, 93, 53, 24], num: 22 },
        expected: 94,
    },
    {
        input: { arr: [21, 32, 37, 34, 35, 70, 12, 79, 62, 13, 58, 44, 10, 48, 12, 36, 72], num: 10 },
        expected: 90,
    },
    {
        input: { arr: [92, 99, 67, 87, 43, 57, 26, 38, 22, 74, 99, 22, 72, 69, 11, 65, 24], num: 30 },
        expected: 99,
    },
];

export const divideTestData = [
    {
        input: {
            dividend: 10,
            divisor: 3,
        },
        expected: 3,
    },
    {
        input: {
            dividend: 7,
            divisor: -3,
        },
        expected: -2,
    },
    {
        input: {
            dividend: -2147483648,
            divisor: -1,
        },
        expected: 2147483647,
    },
    {
        input: {
            dividend: -2147483648,
            divisor: 1,
        },
        expected: -2147483648,
    },
];

export const wildcardMatchTestData = [
    {
        input: {
            s: 'aa',
            p: 'a',
        },
        expected: false,
    },
    {
        input: {
            s: 'aa',
            p: '*',
        },
        expected: true,
    },
    {
        input: {
            s: 'cb',
            p: '?a',
        },
        expected: false,
    },
];

export const minPathValueTestData = [
    {
        input: [
            [1, 0, 1, 1, 1],
            [1, 0, 1, 0, 1],
            [1, 1, 1, 0, 1],
            [1, 0, 1, 0, 1],
        ],
        expected: 12,
    },
    {
        input: [
            [1, 0, 1, 1, 1],
            [1, 0, 1, 0, 1],
            [1, 1, 1, 0, 1],
            [1, 1, 1, 1, 1],
        ],
        expected: 8,
    },
];

export const maxProfitsTestData = [
    {
        input: {
            w: 3,
            k: 2,
            costs: [5, 4, 1, 2],
            profits: [3, 5, 3, 2],
        },
        expected: 11,
    },
];

export const minCostOfCuttingGoldTestData = [
    {
        input: [10, 20, 30],
        expected: 90,
    },
    {
        input: [10, 20, 30, 5],
        expected: 115,
    },
];

export const groupAnagramsTestData = [
    {
        input: ['eat', 'tea', 'tan', 'ate', 'nat', 'bat'],
        expected: [['bat'], ['nat', 'tan'], ['ate', 'eat', 'tea']],
    },
    {
        input: [''],
        expected: [['']],
    },
    {
        input: ['a'],
        expected: [['a']],
    },
];

export const combinationSumTestData = [
    {
        input: {
            arr: [2, 3, 6, 7],
            target: 7,
        },
        expected: [[2, 2, 3], [7]],
    },
    {
        input: {
            arr: [2, 3, 5],
            target: 8,
        },
        expected: [
            [2, 2, 2, 2],
            [2, 3, 3],
            [3, 5],
        ],
    },
    {
        input: {
            arr: [2],
            target: 1,
        },
        expected: [],
    },
];

export const canFinishAllCoursesTestData = [
    {
        input: {
            numCourses: 2,
            prerequisites: [[1, 0]],
        },
        expected: true,
    },
    {
        input: {
            numCourses: 2,
            prerequisites: [
                [1, 0],
                [0, 1],
            ],
        },
        expected: false,
    },
    {
        input: {
            numCourses: 5,
            prerequisites: [
                [1, 4],
                [2, 4],
                [3, 1],
                [2, 3],
            ],
        },
        expected: true,
    },
    {
        input: {
            numCourses: 20,
            prerequisites: [
                [0, 10],
                [3, 18],
                [5, 5],
                [6, 11],
                [11, 14],
                [13, 1],
                [15, 1],
                [17, 4],
            ],
        },
        expected: false,
    },
];

export const printEdgeNodesTestData = [
    {
        input: [1, 2, null, null, 3, null, null],
        expected: [1, 2, 3],
    },
    {
        input: [
            1,
            2,
            null,
            4,
            7,
            null,
            null,
            8,
            null,
            11,
            13,
            null,
            null,
            14,
            null,
            null,
            3,
            5,
            9,
            12,
            15,
            null,
            null,
            16,
            null,
            null,
            null,
            10,
            null,
            null,
            6,
            null,
            null,
        ],
        expected: [1, 2, 4, 7, 11, 13, 14, 15, 16, 12, 10, 6, 3],
    },
];

export const maxPathSumTestData = [
    {
        input: [1, 2, null, null, 3, null, null],
        expected: 6,
    },
    {
        input: [-10, 9, null, null, 20, 15, null, null, 7, null, null],
        expected: 42,
    },
    {
        input: [-3, -1, null, null, -2, null, null],
        expected: -1,
    },
];

export const longestIncreasingPathTestData = [
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
    {
        input: [[1]],
        expected: 1,
    },
    {
        input: [
            [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
            [19, 18, 17, 16, 15, 14, 13, 12, 11, 10],
            [20, 21, 22, 23, 24, 25, 26, 27, 28, 29],
            [39, 38, 37, 36, 35, 34, 33, 32, 31, 30],
            [40, 41, 42, 43, 44, 45, 46, 47, 48, 49],
            [59, 58, 57, 56, 55, 54, 53, 52, 51, 50],
            [60, 61, 62, 63, 64, 65, 66, 67, 68, 69],
            [79, 78, 77, 76, 75, 74, 73, 72, 71, 70],
            [80, 81, 82, 83, 84, 85, 86, 87, 88, 89],
            [99, 98, 97, 96, 95, 94, 93, 92, 91, 90],
            [100, 101, 102, 103, 104, 105, 106, 107, 108, 109],
            [119, 118, 117, 116, 115, 114, 113, 112, 111, 110],
            [120, 121, 122, 123, 124, 125, 126, 127, 128, 129],
            [139, 138, 137, 136, 135, 134, 133, 132, 131, 130],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        ],
        expected: 140,
    },
];
