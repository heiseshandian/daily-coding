import { convertStr2Int } from '../8';

describe('convertStr2Int', () => {
  const testData = [
    {
      input: '   -42',
      expected: -42,
    },
    {
      input: '42',
      expected: 42,
    },
    {
      input: '4193 with words',
      expected: 4193,
    },
    {
      input: '419341934193',
      expected: 2147483647,
    },
    {
      input: '+-12',
      expected: 0,
    },
    {
      input: '2147483648',
      expected: 2147483647,
    },
  ];

  it.each(testData)('convertStr2Int %j', ({ input, expected }) => {
    expect(convertStr2Int(input)).toBe(expected);
  });
});
