import { reverseInteger } from '../7';

describe('reverseInteger', () => {
  const testData = [
    { input: 123, expected: 321 },
    { input: -123, expected: -321 },
    { input: 120, expected: 21 },
  ];

  it.each(testData)('reverseInteger %j', ({ input, expected }) => {
    expect(reverseInteger(input)).toBe(expected);
  });
});
