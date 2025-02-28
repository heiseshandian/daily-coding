import {
  bag,
  hanoi,
  maxPoint,
  nQueen,
  subsequence,
  jump,
  jumpDp,
  jumpDp2,
  getMaxSumK,
  getSubstrings,
  fullPermutation,
  bagDp,
  getMinUnavailableSum,
  getMinUnavailableSum2,
  getMinCount,
  getIslandCount,
} from '../recursion';
import {
  bagTestData,
  fullPermutationTestData,
  getIslandCountTestData,
  getMinCountTestData,
  getMinUnavailableSumTestData,
  getMinUnavailableSumTestData2,
  getSubstringsTestData,
  hanoiTestData,
  jumpTestData,
  maxPointsTestData,
  nQueenTestData,
  subsequenceTestData,
} from './recursion.testdata';

describe('hanoi', () => {
  it.each(hanoiTestData)('hanoi %j', ({ input, expected }) => {
    expect(hanoi(input)).toEqual(expected);
  });
});

describe('subsequence', () => {
  it.each(subsequenceTestData)('subsequence %j', ({ input, expected }) => {
    expect(subsequence(input)).toEqual(expected);
  });
});

describe('bag', () => {
  it.each(bagTestData)(
    'bag %j',
    ({ input: { weights, values, targetWeight }, expected }) => {
      expect(bag(weights, values, targetWeight)).toBe(expected);
      expect(bagDp(weights, values, targetWeight)).toBe(expected);
    }
  );
});

describe('maxPoint', () => {
  it.each(maxPointsTestData)('maxPoint', ({ input, expected }) => {
    expect(maxPoint(input)).toBe(expected);
  });
});

describe('nQueen', () => {
  it.each(nQueenTestData)('nQueen %j', ({ input, expected }) => {
    expect(nQueen(input)).toBe(expected);
  });
});

describe('jump', () => {
  it.each(jumpTestData)('jump %j', ({ input, expected }) => {
    expect(jump(input)).toBe(expected);
    expect(jumpDp(input)).toBe(expected);
    expect(jumpDp2(input)).toBe(expected);
  });
});

describe('getMaxSumK', () => {
  test('getMaxSumK arr1:[1,2,3,4,5] arr2:[3,5,7,9,11],k=4 maxK:[16,15,14,14]', () => {
    expect(getMaxSumK([1, 2, 3, 4, 5], [3, 5, 7, 9, 11], 4)).toEqual([
      16, 15, 14, 14,
    ]);
  });
});

describe('getSubstrings', () => {
  it.each(getSubstringsTestData)('getSubstrings %j', ({ input, expected }) => {
    expect(getSubstrings(input)).toEqual(expected);
  });
});

describe('fullPermutation', () => {
  it.each(fullPermutationTestData)(
    'fullPermutation %j',
    ({ input, expected }) => {
      expect(fullPermutation(input)).toEqual(expected);
    }
  );
});

describe('getMinUnavailableSum', () => {
  it.each(getMinUnavailableSumTestData)(
    'getMinUnavailableSum %j',
    ({ input, expected }) => {
      expect(getMinUnavailableSum(input)).toBe(expected);
    }
  );
});

describe('getMinUnavailableSum2', () => {
  it.each(getMinUnavailableSumTestData2)(
    'getMinUnavailableSum2 %j',
    ({ input, expected }) => {
      expect(getMinUnavailableSum2(input)).toBe(expected);
    }
  );
});

describe('getMinCount', () => {
  it.each(getMinCountTestData)(
    'getMinCount %j',
    ({ input: { arr, target }, expected }) => {
      expect(getMinCount(arr, target)).toBe(expected);
    }
  );
});

describe('getIslandCount', () => {
  it.each(getIslandCountTestData)(
    'getIslandCount %j',
    ({ input, expected }) => {
      expect(getIslandCount(input)).toBe(expected);
    }
  );
});
