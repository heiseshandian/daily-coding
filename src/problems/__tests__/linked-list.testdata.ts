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
