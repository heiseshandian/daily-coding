export const kthSmallestTestData = [
    {
        input: {
            tree: [3, 1, 4, null, 2],
            k: 1,
        },
        expected: 1,
    },
    {
        input: {
            tree: [5, 3, 6, 2, 4, null, null, 1],
            k: 3,
        },
        expected: 3,
    },
];

export const sufficientSubsetTestData = [
    {
        input: {
            root: [1, 2, 3, 4, -99, -99, 7, 8, 9, -99, -99, 12, 13, -99, 14],
            limit: 1,
        },
        expected: [1, 2, 3, 4, null, null, 7, 8, 9, null, 14],
    },
    {
        input: {
            root: [5, 4, 8, 11, null, 17, 4, 7, 1, null, null, 5, 3],
            limit: 22,
        },
        expected: [5, 4, 8, 11, null, 17, 4, 7, null, null, null, 5],
    },
    {
        input: {
            root: [1, 2, -3, -5, null, 4, null],
            limit: 1,
        },
        expected: [1, null, -3, 4],
    },
];

export const buildTreeTestData = [
    {
        input: {
            preorder: [3, 9, 20, 15, 7],
            inorder: [9, 3, 15, 20, 7],
        },
        expected: [3, 9, 20, null, null, 15, 7],
    },
    {
        input: {
            preorder: [-1],
            inorder: [-1],
        },
        expected: [-1],
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

export const lowestCommonAncestorTestData = [
    {
        input: {
            root: [3, 5, 1, 6, 2, 0, 8, null, null, 7, 4],
            p: 5,
            q: 1,
        },
        expected: 3,
    },
    {
        input: {
            root: [3, 5, 1, 6, 2, 0, 8, null, null, 7, 4],
            p: 5,
            q: 4,
        },
        expected: 5,
    },
    {
        input: {
            root: [1, 2],
            p: 1,
            q: 2,
        },
        expected: 1,
    },
];

export const robTestData = [
    {
        input: [3, 2, 3, null, 3, null, 1],
        expected: 7,
    },
    {
        input: [3, 4, 5, 1, 3, null, 1],
        expected: 9,
    },
];
