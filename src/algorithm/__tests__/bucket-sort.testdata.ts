export const countSortTestData = [
  {
    input: [
      7, 20, 95, 16, 96, 87, 24, 13, 12, 95, 73, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ],
    expected: [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 12, 13, 16, 20, 24, 73, 87, 95, 95, 96,
    ],
  },
  {
    input: [26, 92, 93, 20, 47, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    expected: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 20, 26, 47, 92, 93],
  },
  {
    input: [92, 23, 31, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    expected: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 23, 31, 92],
  },
  {
    input: [23, 30, 85, 100, 15, 58, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    expected: [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 15, 23, 30, 58, 85, 100,
    ],
  },
  {
    input: [
      88, 49, 77, 33, 16, 96, 99, 84, 42, 88, 34, 83, 0, 0, 0, 0, 0, 0, 0, 0,
    ],
    expected: [
      0, 0, 0, 0, 0, 0, 0, 0, 16, 33, 34, 42, 49, 77, 83, 84, 88, 88, 96, 99,
    ],
  },
  {
    input: [65, 48, 80, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    expected: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 48, 65, 80],
  },
  {
    input: [80, 6, 37, 37, 97, 28, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    expected: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 8, 28, 37, 37, 80, 97],
  },
  {
    input: [87, 52, 21, 4, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    expected: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 10, 21, 52, 87],
  },
];

export const baseSortTestData = [
  {
    input: [80, 70, 36, 34, 7, 95, 51, 65, 40, 30, 21, 8, 24, 49, 82, 10],
    expected: [7, 8, 10, 21, 24, 30, 34, 36, 40, 49, 51, 65, 70, 80, 82, 95],
  },
  {
    input: [20, 60, 19, 73, 55, 6, 54, 11, 98, 46, 85, 62, 10, 30, 41, 75],
    expected: [6, 10, 11, 19, 20, 30, 41, 46, 54, 55, 60, 62, 73, 75, 85, 98],
  },
  {
    input: [46, 10, 72, 69, 19, 70, 13, 11, 23, 71, 3, 16, 29, 2, 23, 23],
    expected: [2, 3, 10, 11, 13, 16, 19, 23, 23, 23, 29, 46, 69, 70, 71, 72],
  },
  {
    input: [49, 98, 72, 8, 62, 84, 22, 47, 89, 8, 58, 89, 3, 93, 86, 38],
    expected: [3, 8, 8, 22, 38, 47, 49, 58, 62, 72, 84, 86, 89, 89, 93, 98],
  },
  {
    input: [26, 69, 64, 11, 62, 29, 95, 95, 60, 23, 30, 80, 49, 77, 81, 90],
    expected: [11, 23, 26, 29, 30, 49, 60, 62, 64, 69, 77, 80, 81, 90, 95, 95],
  },
  {
    input: [29, 33, 16, 59, 22, 58, 9, 73, 8, 86, 34, 56, 93, 27, 65, 48],
    expected: [8, 9, 16, 22, 27, 29, 33, 34, 48, 56, 58, 59, 65, 73, 86, 93],
  },
  {
    input: [52, 9, 75, 99, 36, 81, 71, 2, 23, 74, 18, 45, 10, 28, 55, 2],
    expected: [2, 2, 9, 10, 18, 23, 28, 36, 45, 52, 55, 71, 74, 75, 81, 99],
  },
  {
    input: [87, 2, 36, 69, 31, 6, 74, 59, 84, 4, 16, 65, 17, 9, 48, 68],
    expected: [2, 4, 6, 9, 16, 17, 31, 36, 48, 59, 65, 68, 69, 74, 84, 87],
  },
];
