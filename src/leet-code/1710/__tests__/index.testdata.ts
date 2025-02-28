export const sortBoxTypesTestData: Array<{
  input: number[][];
  expected: number[][];
}> = [
  {
    input: [
      [5, 10],
      [2, 5],
      [4, 7],
      [3, 9],
    ],
    expected: [
      [5, 10],
      [3, 9],
      [4, 7],
      [2, 5],
    ],
  },
  {
    input: [
      [5, 10],
      [2, 8],
      [4, 7],
      [3, 9],
    ],
    expected: [
      [5, 10],
      [3, 9],
      [2, 8],
      [4, 7],
    ],
  },
];

export const maximumUnitsTestData: Array<{
  input: {
    boxTypes: number[][];
    truckSize: number;
  };
  expected: number;
}> = [
  {
    input: {
      boxTypes: [
        [1, 3],
        [2, 2],
        [3, 1],
      ],
      truckSize: 4,
    },
    expected: 8,
  },
  {
    input: {
      boxTypes: [
        [1, 3],
        [2, 2],
        [3, 1],
        [3, 2],
      ],
      truckSize: 4,
    },
    expected: 9,
  },
  {
    input: {
      boxTypes: [
        [1, 3],
        [5, 5],
        [2, 5],
        [4, 2],
        [4, 1],
        [3, 1],
        [2, 2],
        [1, 3],
        [2, 5],
        [3, 2],
      ],
      truckSize: 35,
    },
    expected: 76,
  },
];
