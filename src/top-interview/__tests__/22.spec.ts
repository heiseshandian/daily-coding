import { generateParenthesis } from '../22';

describe('generateParenthesis', () => {
    const testData = [
        {
            input: 3,
            expected: ['(()())', '(())()', '()(())', '()()()', '((()))'],
        },
        {
            input: 1,
            expected: ['()'],
        },
    ];

    const comparator = (a: string, b: string) => {
        for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) {
                if (a[i] === '(') {
                    return -1;
                }
                return 1;
            }
        }

        return 0;
    };

    it.each(testData)('threeSum %j', ({ input, expected }) => {
        expect(generateParenthesis(input).sort(comparator)).toEqual(expected.sort(comparator));
    });
});
