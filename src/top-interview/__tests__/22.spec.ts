import { parenthesesComparator } from '../../common';
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

  it.each(testData)('threeSum %j', ({ input, expected }) => {
    expect(generateParenthesis(input).sort(parenthesesComparator)).toEqual(
      expected.sort(parenthesesComparator)
    );
  });
});
