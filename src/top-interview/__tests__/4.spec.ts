import { findMedianSortedArrays } from '../4';

describe('findMedianSortedArrays', () => {
  const testData = [
    {
      input: {
        nums1: [1, 3],
        nums2: [2],
      },
      expected: 2,
    },
    {
      input: {
        nums1: [0, 1, 9],
        nums2: [1, 2, 3],
      },
      expected: 1.5,
    },
    {
      input: {
        nums1: [1, 3],
        nums2: [2, 4],
      },
      expected: 2.5,
    },
    {
      input: {
        nums1: [1, 2],
        nums2: [3, 4],
      },
      expected: 2.5,
    },
    {
      input: {
        nums1: [10],
        nums2: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      },
      expected: 5.5,
    },
    {
      input: {
        nums1: [0, 0],
        nums2: [0, 0],
      },
      expected: 0,
    },
  ];

  it.each(testData)(
    'findMedianSortedArrays %j',
    ({ input: { nums1, nums2 }, expected }) => {
      expect(findMedianSortedArrays(nums1, nums2)).toBe(expected);
    }
  );
});
