import { getClosestMaxArr } from '../monotonous-stack';

describe('getClosestMaxArr', () => {
  const testData = [
    {
      input: [5, 4, 3, 6, 1, 2, 0],
      expected: [
        [undefined, 3],
        [0, 3],
        [1, 3],
        [undefined, undefined],
        [3, 5],
        [3, undefined],
        [5, undefined],
      ],
    },
    {
      input: [5, 4, 3, 6, 1, 2, 0, 7],
      expected: [
        [undefined, 3],
        [0, 3],
        [1, 3],
        [undefined, 7],
        [3, 5],
        [3, 7],
        [5, 7],
        [undefined, undefined],
      ],
    },

    {
      input: [5, 5, 4, 3, 6, 4, 1, 3, 2, 0],
      expected: [
        [undefined, 4],
        [undefined, 4],
        [1, 4],
        [2, 4],
        [undefined, undefined],
        [4, undefined],
        [5, 7],
        [5, undefined],
        [7, undefined],
        [8, undefined],
      ],
    },
  ];

  it.each(testData)('getClosestMaxArr', ({ input, expected }) => {
    expect(getClosestMaxArr(input)).toEqual(expected);
  });
});
