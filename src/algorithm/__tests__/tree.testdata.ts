export const preVisitNodeTestData = [
  { input: [], expected: [] },
  { input: [1, null, null], expected: [1] },
  { input: [1, 2, null, null, 3, null, null], expected: [1, 2, 3] },
  {
    input: [1, 2, null, null, 3, 4, 6, null, null, null, 5, null, null],
    expected: [1, 2, 3, 4, 6, 5],
  },
];

export const postVisitNodeTestData = [
  { input: [], expected: [] },
  { input: [1, null, null], expected: [1] },
  { input: [1, 2, null, null, 3, null, null], expected: [2, 3, 1] },
  {
    input: [1, 2, null, null, 3, 4, 6, null, null, null, 5, null, null],
    expected: [2, 6, 4, 5, 3, 1],
  },
];

export const middleVisitNodeTestData = [
  { input: [], expected: [] },
  { input: [1, null, null], expected: [1] },
  { input: [1, 2, null, null, 3, null, null], expected: [2, 1, 3] },
  {
    input: [1, 2, null, null, 3, 4, 6, null, null, null, 5, null, null],
    expected: [2, 1, 6, 4, 3, 5],
  },
];

export const visitTreeByLevelTestData = [
  { input: [], expected: [] },
  { input: [1, null, null], expected: [1] },
  { input: [1, 2, null, null, 3, null, null], expected: [1, 2, 3] },
  {
    input: [1, 2, null, null, 3, 4, 6, null, null, null, 5, null, null],
    expected: [1, 2, 3, 4, 5, 6],
  },
];

export const getMaxWidthTestData = [
  { input: [], expected: 0 },
  { input: [1, null, null], expected: 1 },
  { input: [1, 2, null, null, 3, null, null], expected: 2 },
  {
    input: [1, 2, null, null, 3, 4, 6, null, null, null, 5, null, null],
    expected: 2,
  },
  {
    input: [
      1,
      2,
      null,
      null,
      3,
      4,
      6,
      10,
      null,
      null,
      11,
      null,
      null,
      7,
      null,
      null,
      5,
      8,
      null,
      null,
      9,
      null,
      null,
    ],
    expected: 4,
  },
];

export const preSerializeTestData = [
  { input: [null] },
  { input: [1, null, null] },
  { input: [1, 2, null, null, 3, null, null] },
  { input: [1, 2, null, null, 3, 4, 6, null, null, null, 5, null, null] },
  {
    input: [
      1,
      2,
      null,
      null,
      3,
      4,
      6,
      10,
      null,
      null,
      11,
      null,
      null,
      7,
      null,
      null,
      5,
      8,
      null,
      null,
      9,
      null,
      null,
    ],
  },
];
