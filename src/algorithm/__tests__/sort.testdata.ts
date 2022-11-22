export const sortTestData = [
    { input: [], expected: [] },
    { input: [1], expected: [1] },
    { input: [3, 5, 2, 1, 4, 3], expected: [1, 2, 3, 3, 4, 5] },
    { input: [3, 5, 2, 1, 4, 3, 10, 2, 11, 24, 0], expected: [0, 1, 2, 2, 3, 3, 4, 5, 10, 11, 24] },
    { input: [5, 2, 1, 2, 3, 3, 4], expected: [1, 2, 2, 3, 3, 4, 5] },
];
