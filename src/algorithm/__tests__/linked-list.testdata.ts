export const getMiddleNodeTestData = [
    { input: [], expected: undefined },
    { input: [1, 2], expected: 1 },
    { input: [1, 2, 3], expected: 2 },
    { input: [1, 2, 3, 4], expected: 2 },
    { input: [1, 2, 3, 4, 5], expected: 3 },
];

export const getMiddleNode2TestData = [
    { input: [], expected: undefined },
    { input: [1, 2], expected: 2 },
    { input: [1, 2, 3], expected: 2 },
    { input: [1, 2, 3, 4], expected: 3 },
    { input: [1, 2, 3, 4, 5], expected: 3 },
];

export const getMiddleNode3TestData = [
    { input: [], expected: undefined },
    { input: [1, 2], expected: undefined },
    { input: [1, 2, 3], expected: 1 },
    { input: [1, 2, 3, 4], expected: 1 },
    { input: [1, 2, 3, 4, 5], expected: 2 },
];

export const getMiddleNode4TestData = [
    { input: [], expected: undefined },
    { input: [1, 2], expected: 1 },
    { input: [1, 2, 3], expected: 1 },
    { input: [1, 2, 3, 4], expected: 2 },
    { input: [1, 2, 3, 4, 5], expected: 2 },
];
