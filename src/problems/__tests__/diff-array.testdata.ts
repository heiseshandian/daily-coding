export const carPoolingTestData = [
    {
        input: {
            trips: [
                [2, 1, 5],
                [3, 3, 7],
            ],
            capacity: 4,
        },
        expected: false,
    },
    {
        input: {
            trips: [
                [2, 1, 5],
                [3, 3, 7],
            ],
            capacity: 5,
        },
        expected: true,
    },
    {
        input: {
            trips: [
                [9, 0, 1],
                [3, 3, 7],
            ],
            capacity: 5,
        },
        expected: false,
    },
];
