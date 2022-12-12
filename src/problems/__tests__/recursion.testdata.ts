export const hanoiTestData = [
    {
        input: 3,
        expected: [
            '1 left > right',
            '2 left > center',
            '1 right > center',
            '3 left > right',
            '1 center > left',
            '2 center > right',
            '1 left > right',
        ],
    },
];

export const subsequenceTestData = [
    { input: 'abc', expected: ['', 'c', 'b', 'bc', 'a', 'ac', 'ab', 'abc'] },
    {
        input: 'abcd',
        expected: ['', 'd', 'c', 'cd', 'b', 'bd', 'bc', 'bcd', 'a', 'ad', 'ac', 'acd', 'ab', 'abd', 'abc', 'abcd'],
    },
];
