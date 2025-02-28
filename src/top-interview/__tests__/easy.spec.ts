import { searchInsert } from '../easy';
describe('searchInsert', () => {
  const testData = [
    {
      input: {
        arr: [1, 3, 5, 6],
        target: 5,
      },
      expected: 2,
    },
    {
      input: {
        arr: [1, 3, 5, 6],
        target: 2,
      },
      expected: 1,
    },
    {
      input: {
        arr: [1, 3, 5, 6],
        target: 7,
      },
      expected: 4,
    },
  ];

  it.each(testData)(
    'searchInsert %j',
    ({ input: { arr, target }, expected }) => {
      expect(searchInsert(arr, target)).toBe(expected);
    }
  );
});
