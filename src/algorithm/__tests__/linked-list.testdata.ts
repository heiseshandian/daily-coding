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

export const isPalindromeTestData = [
    { input: [], expected: true },
    { input: ['a'], expected: true },
    { input: ['a', 'a'], expected: true },
    { input: ['a', 'b'], expected: false },
    { input: ['a', 'b', 'a'], expected: true },
    { input: ['a', 'b', 'c'], expected: false },
    { input: ['a', 'b', 'c', 'd'], expected: false },
    { input: ['a', 'b', 'b', 'a'], expected: true },
];
