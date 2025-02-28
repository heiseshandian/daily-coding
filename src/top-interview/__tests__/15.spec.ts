import { threeSum, threeSum2 } from '../15';

describe('threeSum', () => {
  const testData = [
    {
      input: [-1, 0, 1, 2, -1, -4],
      expected: [
        [-1, 0, 1],
        [-1, -1, 2],
      ],
    },
    {
      input: [0, 1, 1],
      expected: [],
    },
  ];
  const comparator = (a: number[], b: number[]) => {
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) {
        return a[i] - b[i];
      }
    }
    return 0;
  };

  it.each(testData)('threeSum %j', ({ input, expected }) => {
    expect(threeSum(input).sort(comparator)).toEqual(expected.sort(comparator));
    expect(threeSum2(input).sort(comparator)).toEqual(
      expected.sort(comparator)
    );
  });
});
