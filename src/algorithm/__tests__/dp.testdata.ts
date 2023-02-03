export const countWalkMethodsTestData = [
    {
        input: {
            n: 6,
            m: 2,
            k: 4,
            p: 4,
        },
        expected: 4,
    },
    {
        input: {
            n: 6,
            m: 2,
            k: 2,
            p: 4,
        },
        expected: 1,
    },
];

export const countMoneyTestData = [
    {
        input: {
            arr: [10, 20, 30],
            target: 100,
        },
        expected: 14,
    },
    {
        input: {
            arr: [10, 50, 52, 21, 2],
            target: 30,
        },
        expected: 4,
    },
    {
        input: {
            arr: [10, 31],
            target: 100,
        },
        expected: 1,
    },
    {
        input: {
            arr: [5, 10, 50, 100],
            target: 1000,
        },
        expected: 4246,
    },
];

export const getMinMethodsTestData = [
    {
        input: {
            str: 'babac',
            arr: ['ba', 'c', 'abcd'],
        },
        expected: 2,
    },
    {
        input: {
            str: 'babace',
            arr: ['ba', 'c', 'abcd'],
        },
        expected: -1,
    },
];

export const maxCommonSubsequenceTestData = [
    {
        input: {
            str1: 'abc1234ef5',
            str2: 'ty671234',
        },
        expected: 4,
    },
    {
        input: {
            str1: '1234',
            str2: 'abcd',
        },
        expected: 0,
    },
];

export const getCoffeeTimeTestData = [
    {
        input: {
            arr: [1, 1, 1, 1, 1, 1, 1, 1, 1, 11],
            a: 3,
            b: 10,
        },
        expected: 14,
    },
    {
        input: {
            arr: [1, 3, 5, 6, 8, 9, 2, 1, 11],
            a: 3,
            b: 10,
        },
        expected: 17,
    },
];