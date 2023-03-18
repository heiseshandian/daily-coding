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
