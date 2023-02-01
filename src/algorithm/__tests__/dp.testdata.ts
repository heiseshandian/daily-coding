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
