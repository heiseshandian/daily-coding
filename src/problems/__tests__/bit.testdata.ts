export const powTestData = [
    {
        input: {
            a: 10,
            n: 3,
        },
        expected: 1000,
    },
    {
        input: {
            a: 3,
            n: 5,
        },
        expected: 243,
    },
];

export const gameOfLifeTestData = [
    {
        input: [
            [0, 1, 0],
            [0, 0, 1],
            [1, 1, 1],
            [0, 0, 0],
        ],
        expected: [
            [0, 0, 0],
            [1, 0, 1],
            [0, 1, 1],
            [0, 1, 0],
        ],
    },
    {
        input: [
            [1, 1],
            [1, 0],
        ],
        expected: [
            [1, 1],
            [1, 1],
        ],
    },
];

export const reverseBitsTestData = [
    {
        input: 0xff00ff00,
        expected: 0x00ff00ff,
    },
    {
        input: 0b00000010100101000001111010011100,
        expected: 0b00111001011110000010100101000000,
    },
    {
        input: -1,
        expected: 0b11111111111111111111111111111111,
    },
];
