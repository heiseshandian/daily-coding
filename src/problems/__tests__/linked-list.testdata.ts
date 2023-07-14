type TestData<T = any, U = any> = Array<{
    input: T;
    expected: U;
}>;

export const copyRandomListTestData: TestData<
    Array<[val: number, random: number | null]>,
    Array<[val: number, random: number | null]>
> = [
    {
        input: [
            [7, null],
            [13, 0],
            [11, 4],
            [10, 2],
            [1, 0],
        ],
        expected: [
            [7, null],
            [13, 0],
            [11, 4],
            [10, 2],
            [1, 0],
        ],
    },
    {
        input: [
            [1, 1],
            [2, 1],
        ],
        expected: [
            [1, 1],
            [2, 1],
        ],
    },
    {
        input: [
            [3, null],
            [3, 0],
            [3, null],
        ],
        expected: [
            [3, null],
            [3, 0],
            [3, null],
        ],
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

export const sortListTestData = [
    {
        input: [4, 2, 1, 3],
        expected: [1, 2, 3, 4],
    },
    {
        input: [-1, 5, 3, 4, 0],
        expected: [-1, 0, 3, 4, 5],
    },
    {
        input: [],
        expected: [],
    },
    {
        input: [1],
        expected: [1],
    },
];

export const oddEvenListTestData = [
    {
        input: [1, 2, 3, 4, 5],
        expected: [1, 3, 5, 2, 4],
    },
    {
        input: [2, 1, 3, 5, 6, 4, 7],
        expected: [2, 3, 6, 7, 1, 5, 4],
    },
];

export const detectCycleTestData = [
    {
        input: {
            arr: [3, 2, 0, -4],
            pos: 1,
        },
        expected: 2,
    },
    {
        input: {
            arr: [1, 2],
            pos: 0,
        },
        expected: 1,
    },
    {
        input: {
            arr: [1],
            pos: -1,
        },
        expected: undefined,
    },
];

export const deleteDuplicatesTestData = [
    {
        input: [1, 2, 3, 3, 4, 4, 5],
        expected: [1, 2, 5],
    },
    {
        input: [1, 1, 2, 3, 3, 4, 4, 5],
        expected: [2, 5],
    },
    {
        input: [1, 1, 1, 2, 2, 3, 3, 4, 4, 5],
        expected: [5],
    },
    {
        input: [1, 1, 1, 2, 2, 3, 3, 4, 4],
        expected: [],
    },
];

export const reorderListTestData = [
    {
        input: [1, 2, 3, 4],
        expected: [1, 4, 2, 3],
    },
    {
        input: [1, 2, 3, 4, 5],
        expected: [1, 5, 2, 4, 3],
    },
];
