export const maxNumOfMarkedIndicesTestData = [
    {
        input: [3, 5, 2, 4],
        expected: 2,
    },
    {
        input: [9, 2, 5, 4],
        expected: 4,
    },
    {
        input: [7, 6, 8],
        expected: 0,
    },
];

export const maxDistToClosestTestData = [
    {
        input: [1, 0, 0, 0, 1, 0, 1],
        expected: 2,
    },
    {
        input: [1, 0, 0, 0],
        expected: 3,
    },
    {
        input: [0, 1],
        expected: 1,
    },
];

export const removeDuplicatesTestData = [
    {
        input: [1, 1, 1, 2, 2, 3],
        expected: {
            k: 5,
            nums: [1, 1, 2, 2, 3],
        },
    },
    {
        input: [1, 2, 2],
        expected: {
            k: 3,
            nums: [1, 2, 2],
        },
    },
    {
        input: [0, 0, 1, 1, 1, 1, 2, 3, 3],
        expected: {
            k: 7,
            nums: [0, 0, 1, 1, 2, 3, 3],
        },
    },
];
