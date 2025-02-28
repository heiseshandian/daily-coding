export const getMiddleNodeTestData = [
  { input: [], expected: undefined },
  { input: [1, 2], expected: 1 },
  { input: [1, 2, 3], expected: 2 },
  { input: [1, 2, 3, 4], expected: 2 },
  { input: [1, 2, 3, 4, 5], expected: 3 },
];

export const getMiddleNode2TestData = [
  { input: [], expected: undefined },
  { input: [1, 2], expected: 2 },
  { input: [1, 2, 3], expected: 2 },
  { input: [1, 2, 3, 4], expected: 3 },
  { input: [1, 2, 3, 4, 5], expected: 3 },
];

export const getMiddleNode3TestData = [
  { input: [], expected: undefined },
  { input: [1, 2], expected: undefined },
  { input: [1, 2, 3], expected: 1 },
  { input: [1, 2, 3, 4], expected: 1 },
  { input: [1, 2, 3, 4, 5], expected: 2 },
];

export const getMiddleNode4TestData = [
  { input: [], expected: undefined },
  { input: [1, 2], expected: 1 },
  { input: [1, 2, 3], expected: 1 },
  { input: [1, 2, 3, 4], expected: 2 },
  { input: [1, 2, 3, 4, 5], expected: 2 },
];

export const isPalindromeTestData = [
  { input: [], expected: true },
  { input: ['a'], expected: true },
  { input: ['a', 'a'], expected: true },
  { input: ['a', 'b'], expected: false },
  { input: ['a', 'b', 'a'], expected: true },
  { input: ['a', 'b', 'c'], expected: false },
  { input: ['a', 'b', 'c', 'd'], expected: false },
  { input: ['a', 'b', 'b', 'a'], expected: true },
];

export const partitionTestData = [
  { input: [], p: 1, expected: [] },
  { input: [1], p: 1, expected: [1] },
  { input: [1], p: 0, expected: [1] },
  { input: [1, 2, 1, 3, 2], p: 0, expected: [1, 2, 1, 3, 2] },
  { input: [1, 2, 1, 3, 2], p: 1, expected: [1, 1, 2, 3, 2] },
  { input: [1, 2, 1, 3, 2], p: 2, expected: [1, 1, 2, 2, 3] },
  { input: [1, 2, 1, 3, 2], p: 4, expected: [1, 2, 1, 3, 2] },
];

export const deepCloneSpecialNodeListTestData = [
  { input: [] },
  {
    input: [{ val: 1, next: null, random: 1 }],
  },
  {
    input: [{ val: 1, next: null, random: null }],
  },
  {
    input: [
      { val: 1, next: 2, random: 1 },
      { val: 2, next: null, random: 2 },
    ],
  },
  {
    input: [
      { val: 1, next: 2, random: null },
      { val: 2, next: 3, random: 1 },
      { val: 3, next: 4, random: 3 },
      { val: 4, next: null, random: 2 },
    ],
  },
];
