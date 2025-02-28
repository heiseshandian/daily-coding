export const maxNumOfMarkedIndicesTestData = [
  {
    input: [3, 5, 2, 4],
    expected: 2,
  },
  {
    input: [9, 2, 5, 4],
    expected: 4,
  },
  {
    input: [7, 6, 8],
    expected: 0,
  },
];

export const maxDistToClosestTestData = [
  {
    input: [1, 0, 0, 0, 1, 0, 1],
    expected: 2,
  },
  {
    input: [1, 0, 0, 0],
    expected: 3,
  },
  {
    input: [0, 1],
    expected: 1,
  },
];

export const removeDuplicatesTestData = [
  {
    input: [1, 1, 1, 2, 2, 3],
    expected: {
      k: 5,
      nums: [1, 1, 2, 2, 3],
    },
  },
  {
    input: [1, 2, 2],
    expected: {
      k: 3,
      nums: [1, 2, 2],
    },
  },
  {
    input: [0, 0, 1, 1, 1, 1, 2, 3, 3],
    expected: {
      k: 7,
      nums: [0, 0, 1, 1, 2, 3, 3],
    },
  },
];

export const mergeTestData = [
  {
    nums1: [1, 2, 3, 0, 0, 0],
    m: 3,
    nums2: [2, 5, 6],
    n: 3,
    expected: [1, 2, 2, 3, 5, 6],
  },
  {
    nums1: [1],
    m: 1,
    nums2: [],
    n: 0,
    expected: [1],
  },
  {
    nums1: [0],
    m: 0,
    nums2: [1],
    n: 1,
    expected: [1],
  },
];
