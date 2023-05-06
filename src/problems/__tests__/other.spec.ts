import { parenthesesComparator } from '../../common/index';
import {
    countSmallerTestData,
    wiggleSortTestData,
    increasingTripletTestData,
    fourSumCountTestData,
    longestSubstringTestData,
    combinationSum2TestData,
    uniquePathsWithObstaclesTestData,
    nextGreaterElementsTestData,
    restoreIpAddressesTestData,
    multiplyTestData,
    getPrimeNumbersTestData,
    getMinOutNumberOfPeopleTestData,
    findMinTestData,
} from './other.testdata';
import {
    countSmaller,
    wiggleSort,
    increasingTriplet,
    increasingTriplet2,
    fourSumCount,
    topKFrequent,
    longestSubstring,
    combinationSum2,
    combinationSum3,
    uniquePathsWithObstacles,
    nextGreaterElements,
    restoreIpAddresses,
    multiply,
    getPrimeNumbers,
    getMinOutNumberOfPeople,
} from '../other';
import { topKFrequentTestData } from './other.testdata';
import { findMin } from '../other';
import {
    avoidFlood,
    calculateStr,
    canCompleteCircuit,
    canCompleteCircuit2,
    canCompleteCircuit3,
    canFinishAllCourses,
    canFinishAllCourses2,
    canFinishAllCourses3,
    canSplit4Parts,
    combinationSum,
    countJointMethods,
    countJointMethodsDp,
    countJointMethodsDp2,
    countLostNumbers,
    countPrimes,
    countSubArr,
    countSubArr2,
    countSubArrays,
    countSubArrays2,
    countSubsequence,
    countZeros,
    distinctSubsequenceII,
    divide,
    evaluationMethods,
    existWord,
    findDuplicate,
    findKthLargest,
    findMinMoves,
    findOrder,
    findSubstring,
    findSubstringInWrapRoundString,
    findSubstringInWrapRoundString2,
    findWords,
    flipNonEdgeOToX,
    getAllTriples,
    getAllTwoTuples,
    getCalculateMethods,
    getCalculateMethods2,
    getClosestSumK,
    getClosestSumKOfMatrix,
    getConnectedRegions,
    getConnectedRegions2,
    getLengthOfLongestSubArrayWithSumK,
    getLengthOfLongestSubArrayWithSumK2,
    getLongestIncreasingSubsequence,
    getMaxA,
    getMaxArrOf2PartsMin,
    getMaxArrOf2PartsMin2,
    getMaxDiff,
    getMaxGame,
    getMaxGameWindow,
    getMaxIncreasingNum,
    getMaxK,
    getMaxLengthOfIncreasingSubsequence,
    getMaxLengthOfIncreasingSubsequence2,
    getMaxLenOfComposableSubArr,
    getMaxPartsArray,
    getMaxProfit,
    getMaxProfit2,
    getMaxProfit3,
    getMaxProfit4,
    getMaxProfit4Dp,
    getMaxRemovableSubsequence,
    getMaxRopePoints,
    getMaxRopePoints2,
    getMaxSizeOfAllOnes,
    getMaxSizeOfAllOnes2,
    getMaxSumOfSubArr,
    getMaxValueOfS,
    getMinBags,
    getMinBagsDp,
    getMinBagsDp2,
    getMinBoats,
    getMinCandy,
    getMinCandy2,
    getMinCandy3,
    getMinCandy4,
    getMinChanges,
    getMinCoins,
    getMinCoinsDp,
    getMinCoinsDp2,
    getMinDistance,
    getMinJumpSteps,
    getMinJumpSteps2,
    getMinJumpStepsDp,
    getMinMissingNumber,
    getMinMoneyOfPassingMonster,
    getMinMoneyOfPassingMonsterDp,
    getMinMoneyOfPassingMonsterDp2,
    getMinMoneyOfPassingMonsterDp3,
    getMinMoneyOfPassingMonsterDp4,
    getMinPalindrome,
    getMinRange,
    getMinStrCount,
    getMinSubArrThatShouldBeSorted,
    getMinSumThatCanNotBeComposed,
    getMinSumThatCanNotBeComposed1,
    getMinTimeOfDrawing,
    getMinValue,
    getNthUglyNumber,
    getNumOfMostRightOne,
    getNumOfMostRightOne2,
    getSubsequenceWithBiggestDictionarySequence,
    getSumOfi1j1i2j2,
    getSumOfMatrix,
    getValidParentheses,
    groupAnagrams,
    kthSmallest,
    ladderLength,
    ladderLength2,
    leastWaitingTime,
    leastWaitingTime2,
    lengthOfLongestSubstring,
    lengthOfLongestSubstring2,
    lengthOfLongestSubstringKDistinct,
    longestConsecutive,
    longestIncreasingPath,
    longestValidParentheses,
    longestValidParentheses2,
    majorityElement,
    majorityElement2,
    MapWithSetAll,
    maxEqualRowsAfterFlips,
    maxProfits,
    maxProfits2,
    maxRunTime,
    maxSquareSideLength,
    maxUncrossedLines,
    mergeStones,
    MessageBox,
    minCostOfCuttingGold,
    minCostOfCuttingGold2,
    minEatingSpeed,
    minPathValue,
    minWindow,
    nextPermutation,
    numSubMatrixSumTarget,
    numTilePossibilities,
    partitionPalindrome,
    product,
    product2,
    reversePairs,
    rotate,
    setZeroes,
    setZeroes2,
    setZeroes3,
    shortestBridge,
    splitEarth,
    splitEarth2,
    trap,
    trap2,
    trapRainWater,
    unzipStr,
    updatePaths,
    wildcardMatch,
    wildcardMatch2,
    wordBreak,
} from '../other';
import {
    avoidFloodTestData,
    calculateStrTestData,
    canCompleteCircuitTestData,
    canFinishAllCoursesTestData,
    canSplit4PartsTestData,
    combinationSumTestData,
    countJointMethodsTestData,
    countLostNumbersTestData,
    countPrimesTestData,
    countSubArraysTestData,
    countSubArrTestData,
    countSubsequenceTestData,
    countZerosTestData,
    distinctSubsequenceIITestData,
    divideTestData,
    evaluationMethodsTestData,
    existWordTestData,
    findDuplicateTestData,
    findKthLargestTestData,
    findMinMovesTestData,
    findOrderTestData,
    findSubstringInWrapRoundStringTestData,
    findSubstringTestData,
    findWordsTestData,
    flipNonEdgeOToXTestData,
    getAllTriplesTestData,
    getAllTwoTuplesTestData,
    getCalculateMethodsTestData,
    getClosestSumKOfMatrixTestData,
    getClosestSumKTestData,
    getConnectedRegionsTestData,
    getLengthOfLongestSubArrayWithSumK2TestData,
    getLengthOfLongestSubArrayWithSumKTestData,
    getLongestIncreasingSubsequenceTestData,
    getMaxArrOf2PartsMinTestData,
    getMaxATestData,
    getMaxDiffTestData,
    getMaxGameTestData,
    getMaxIncreasingNumTestData,
    getMaxKTestData,
    getMaxLengthOfIncreasingSubsequenceTestData,
    getMaxLenOfComposableSubArrTestData,
    getMaxPartsArrayTestData,
    getMaxProfit3TestData,
    getMaxProfit4TestData,
    getMaxProfitTestData,
    getMaxRemovableSubsequenceTestData,
    getMaxRopePointsTestData,
    getMaxSizeOfAllOnesTestData,
    getMaxSumOfSubArrTestData,
    getMaxValueOfSTestData,
    getMinArrTestData,
    getMinBagsTestData,
    getMinBoatsTestData,
    getMinCandyTestData,
    getMinCandyTestData3,
    getMinChangesTestData,
    getMinCoinsTestData,
    getMinDistanceTestData,
    getMinJumpStepsTestData,
    getMinMissingNumberTestData,
    getMinMoneyOfPassingMonsterTestData,
    getMinPalindromeTestData,
    getMinRangeTestData,
    getMinStrCountTestData,
    getMinSumThatCanNotBeComposed1TestData,
    getMinSumThatCanNotBeComposedTestData,
    getMinTimeOfDrawingTestData,
    getMinValueTestData,
    getNthUglyNumberTestData,
    getNumOfMostRightOneTestData,
    getSubsequenceWithBiggestDictionarySequenceTestData,
    getSumOfi1j1i2j2TestData,
    getSumOfMatrixTestData,
    getValidParenthesesTestData,
    groupAnagramsTestData,
    kthSmallestTestData,
    ladderLengthTestData,
    leastWaitingTimeTestData,
    lengthOfLongestSubstringKDistinctTestData,
    lengthOfLongestSubstringTestData,
    longestConsecutiveTestData,
    longestIncreasingPathTestData,
    longestValidParenthesesTestData,
    majorityElement2TestData,
    majorityElementTestData,
    maxEqualRowsAfterFlipsTestData,
    maxProfitsTestData,
    maxRunTimeTestData,
    maxSquareSideLengthTestData,
    maxUncrossedLinesTestData,
    mergeStonesTestData,
    minCostOfCuttingGoldTestData,
    minEatingSpeedTestData,
    minPathValueTestData,
    minWindowTestData,
    nextPermutationTestData,
    numSubMatrixSumTargetTestData,
    numTilePossibilitiesTestData,
    partitionPalindromeTestData,
    productTestData,
    reversePairsTestData,
    rotateTestData,
    setZerosTestData,
    shortestBridgeTestData,
    splitEarthTestData,
    trapRainWaterTestData,
    trapTestData,
    unzipStrTestData,
    updatePathsTestData,
    wildcardMatchTestData,
    wordBreakTestData,
} from './other.testdata';

describe('other', () => {
    it.each(getMinCandyTestData)('getMinCandy', ({ input, expected }) => {
        expect(getMinCandy(input)).toBe(expected);
        expect(getMinCandy2(input)).toBe(expected);
    });

    it.each(getMinCandyTestData3)('getMinCandy3', ({ input, expected }) => {
        expect(getMinCandy3(input)).toBe(expected);
        expect(getMinCandy4(input)).toBe(expected);
    });

    it.each(getMinBoatsTestData)('getMinBoats', ({ input: { arr, limit }, expected }) => {
        expect(getMinBoats(arr, limit)).toBe(expected);
    });

    it.each(countSubArrTestData)('countSubArr', ({ input: { arr, target }, expected }) => {
        expect(countSubArr(arr, target)).toBe(expected);
        expect(countSubArr2(arr, target)).toBe(expected);
    });

    it.each(getMaxRopePointsTestData)('getMaxRopePoints', ({ input: { arr, rope }, expected }) => {
        expect(getMaxRopePoints(arr, rope)).toBe(expected);
        expect(getMaxRopePoints2(arr, rope)).toBe(expected);
    });

    test('MapWithSetAll', () => {
        const map = new MapWithSetAll();

        map.set(1, 0);
        map.set(2, 1);
        expect(map.get(1)).toBe(0);
        expect(map.get(2)).toBe(1);

        map.setAll(3);
        map.set(4, 8);
        expect(map.get(1)).toBe(3);
        expect(map.get(2)).toBe(3);
        expect(map.get(4)).toBe(8);

        map.setAll(5);
        expect(map.get(1)).toBe(5);
        expect(map.get(2)).toBe(5);
        expect(map.get(4)).toBe(5);

        map.set(9, 0);
        expect(map.get(9)).toBe(0);
    });

    it.each(getMaxGameTestData)('getMaxGame', ({ input: { arr, k }, expected }) => {
        expect(getMaxGame(arr, k)).toBe(expected);
        expect(getMaxGameWindow(arr, k)).toBe(expected);
    });

    it.each(getMaxSumOfSubArrTestData)('getMaxSumOfSubArr', ({ input, expected }) => {
        expect(getMaxSumOfSubArr(input)).toBe(expected);
    });

    it.each(getMaxATestData)('getMaxA', ({ input, expected }) => {
        expect(getMaxA(input)).toBe(expected);
    });

    it.each(getMinCoinsTestData)('getMinCoins', ({ input: { arr, target }, expected }) => {
        expect(getMinCoins(arr, target)).toBe(expected);
        expect(getMinCoinsDp(arr, target)).toBe(expected);
        expect(getMinCoinsDp2(arr, target)).toBe(expected);
    });

    it.each(getMinJumpStepsTestData)('getMinJumpSteps', ({ input, expected }) => {
        expect(getMinJumpSteps(input)).toBe(expected);
        expect(getMinJumpStepsDp(input)).toBe(expected);
        expect(getMinJumpSteps2(input)).toBe(expected);
    });

    it.each(getMaxKTestData)('getMaxK', ({ input: { arr1, arr2, k }, expected }) => {
        expect(getMaxK(arr1, arr2, k)).toEqual(expected);
    });

    it.each(canSplit4PartsTestData)('canSplit4Parts', ({ input, expected }) => {
        expect(canSplit4Parts(input)).toBe(expected);
    });

    it.each(getNthUglyNumberTestData)('getNthUglyNumber', ({ input, expected }) => {
        expect(getNthUglyNumber(input)).toBe(expected);
    });

    it.each(getMinArrTestData)('getMinSubArrThatShouldBeSorted', ({ input, expected }) => {
        expect(getMinSubArrThatShouldBeSorted(input)).toEqual(expected);
    });

    it.each(getMinSumThatCanNotBeComposedTestData)('getMinSumThatCanNotBeComposed', ({ input, expected }) => {
        expect(getMinSumThatCanNotBeComposed(input)).toBe(expected);
    });

    it.each(getMinSumThatCanNotBeComposed1TestData)('getMinSumThatCanNotBeComposed1', ({ input, expected }) => {
        expect(getMinSumThatCanNotBeComposed1(input)).toEqual(expected);
    });

    it.each(countLostNumbersTestData)('countLostNumbers', ({ input: { arr, range }, expected }) => {
        expect(countLostNumbers(arr, range)).toBe(expected);
    });

    it.each(getConnectedRegionsTestData)('getConnectedRegions', ({ input, expected }) => {
        expect(getConnectedRegions(input)).toEqual(expected);
        expect(getConnectedRegions2(input)).toEqual(expected);
    });

    it.each(getMinMoneyOfPassingMonsterTestData)(
        'getMinMoneyOfPassingMonster',
        ({ input: { arr1, arr2 }, expected }) => {
            expect(getMinMoneyOfPassingMonster(arr1, arr2)).toBe(expected);
            expect(getMinMoneyOfPassingMonsterDp(arr1, arr2)).toBe(expected);
            expect(getMinMoneyOfPassingMonsterDp2(arr1, arr2)).toBe(expected);
            expect(getMinMoneyOfPassingMonsterDp3(arr1, arr2)).toBe(expected);
            expect(getMinMoneyOfPassingMonsterDp4(arr1, arr2)).toBe(expected);
        }
    );

    it.each(getMaxLenOfComposableSubArrTestData)('getMaxLenOfComposableSubArr', ({ input, expected }) => {
        expect(getMaxLenOfComposableSubArr(input)).toBe(expected);
    });

    it.each(getMinStrCountTestData)('getMinStrCount', ({ input, expected }) => {
        expect(getMinStrCount(input)).toBe(expected);
    });

    it.each(unzipStrTestData)('unzipStr', ({ input, expected }) => {
        expect(unzipStr(input)).toBe(expected);
    });

    it.each(getAllTwoTuplesTestData)('getAllTwoTuples', ({ input: { arr, target }, expected }) => {
        expect(getAllTwoTuples(arr, target)).toEqual(expected);
    });

    it.each(getAllTriplesTestData)('getAllTriples', ({ input: { arr, target }, expected }) => {
        expect(getAllTriples(arr, target)).toEqual(expected);
    });

    it.each(getMinMissingNumberTestData)('getMinMissingNumber', ({ input, expected }) => {
        expect(getMinMissingNumber(input)).toBe(expected);
    });

    it.each(findKthLargestTestData)('findKthLargest', ({ input: { arr, k }, expected }) => {
        expect(findKthLargest(arr, k)).toBe(expected);
    });

    describe('MessageBox', () => {
        const prev = console.log;

        beforeAll(() => {
            console.log = jest.fn();
        });
        afterAll(() => {
            console.log = prev;
        });

        test('receive', () => {
            const message = new MessageBox();

            [3, 2, 4, 1, 6, 7, 5].forEach((val) => message.receive(val, val));

            expect(console.log).toHaveBeenCalledTimes(7);
            expect((console.log as jest.Mock).mock.calls).toEqual([[1], [2], [3], [4], [5], [6], [7]]);
        });
    });

    it.each(getMinRangeTestData)('getMinRange', ({ input, expected }) => {
        expect(getMinRange(input)).toEqual(expected);
    });

    it.each(getMinPalindromeTestData)('getMinPalindrome', ({ input, expected }) => {
        expect(getMinPalindrome(input)).toBe(expected);
    });

    it.each(getMaxIncreasingNumTestData)('getMaxIncreasingNum', ({ input, expected }) => {
        expect(getMaxIncreasingNum(input)).toBe(expected);
    });

    it.each(getClosestSumKTestData)('getClosestSumK', ({ input: { arr, k }, expected }) => {
        expect(getClosestSumK(arr, k)).toBe(expected);
    });

    it.each(getClosestSumKOfMatrixTestData)('getClosestSumKOfMatrix', ({ input: { matrix, k }, expected }) => {
        expect(getClosestSumKOfMatrix(matrix, k)).toBe(expected);
    });

    it.each(findWordsTestData)('findWords', ({ input: { board, words }, expected }) => {
        expect(findWords(board, words)).toEqual(expected);
    });

    it.each(getMinValueTestData)('getMinValue', ({ input, expected }) => {
        expect(getMinValue(input)).toBe(expected);
    });

    it.each(getMaxProfitTestData)('getMaxProfit', ({ input, expected }) => {
        expect(getMaxProfit(input)).toBe(expected);
        expect(getMaxProfit2(input)).toBe(expected);
    });

    it.each(getMaxProfit3TestData)('getMaxProfit3', ({ input, expected }) => {
        expect(getMaxProfit3(input)).toBe(expected);
    });

    it.each(getMaxProfit4TestData)('getMaxProfit4', ({ input: { arr, k }, expected }) => {
        expect(getMaxProfit4(arr, k)).toBe(expected);
        expect(getMaxProfit4Dp(arr, k)).toBe(expected);
    });

    it.each(countSubsequenceTestData)('countSubsequence', ({ input: { s, t }, expected }) => {
        expect(countSubsequence(s, t)).toBe(expected);
    });

    it.each(getCalculateMethodsTestData)('getCalculateMethods', ({ input: { str, target }, expected }) => {
        expect(getCalculateMethods(str, target).sort()).toEqual(expected.sort());
        expect(getCalculateMethods2(str, target).sort()).toEqual(expected.sort());
    });

    it.each(existWordTestData)('existWord', ({ input: { board, word }, expected }) => {
        expect(existWord(board, word)).toBe(expected);
    });

    it.each(countJointMethodsTestData)('countJointMethods', ({ input: { str, arr }, expected }) => {
        expect(countJointMethods(str, arr)).toBe(expected);
        expect(countJointMethodsDp(str, arr)).toBe(expected);
        expect(countJointMethodsDp2(str, arr)).toBe(expected);
    });

    it.each(updatePathsTestData)('updatePaths', ({ input, expected }) => {
        updatePaths(input);

        expect(input).toEqual(expected);
    });

    it.each(calculateStrTestData)('calculateStr', ({ input, expected }) => {
        expect(calculateStr(input)).toBe(expected);
    });

    it.each(getValidParenthesesTestData)('getValidParentheses', ({ input, expected }) => {
        expect(getValidParentheses(input).sort(parenthesesComparator)).toEqual(expected.sort(parenthesesComparator));
    });

    it.each(getMaxLengthOfIncreasingSubsequenceTestData)(
        'getMaxLengthOfIncreasingSubsequence',
        ({ input, expected }) => {
            expect(getMaxLengthOfIncreasingSubsequence(input)).toBe(expected);
            expect(getMaxLengthOfIncreasingSubsequence2(input)).toBe(expected);
        }
    );

    it.each(getMaxSizeOfAllOnesTestData)('getMaxSizeOfAllOnes', ({ input, expected }) => {
        expect(getMaxSizeOfAllOnes(input)).toBe(expected);
        expect(getMaxSizeOfAllOnes2(input)).toBe(expected);
    });

    it.each(longestValidParenthesesTestData)('longestValidParentheses', ({ input, expected }) => {
        expect(longestValidParentheses(input)).toBe(expected);
        expect(longestValidParentheses2(input)).toBe(expected);
    });

    it.each(findSubstringTestData)('findSubstring', ({ input: { s, words }, expected }) => {
        expect(findSubstring(s, words)).toEqual(expected);
    });

    it.each(evaluationMethodsTestData)('evaluationMethods', ({ input: { str, expectedResult }, expected }) => {
        expect(evaluationMethods(str, expectedResult)).toBe(expected);
    });

    it.each(findMinMovesTestData)('findMinMoves', ({ input, expected }) => {
        expect(findMinMoves(input)).toBe(expected);
    });

    it.each(kthSmallestTestData)('kthSmallest', ({ input: { matrix, k }, expected }) => {
        expect(kthSmallest(matrix, k)).toBe(expected);
    });

    it.each(distinctSubsequenceIITestData)('distinctSubsequenceII', ({ input, expected }) => {
        expect(distinctSubsequenceII(input)).toBe(expected);
    });

    it.each(shortestBridgeTestData)('shortestBridge', ({ input, expected }) => {
        expect(shortestBridge(input)).toBe(expected);
    });

    it.each(trapTestData)('trap', ({ input, expected }) => {
        expect(trap(input)).toBe(expected);
        expect(trap2(input)).toBe(expected);
    });

    it.each(trapRainWaterTestData)('trapRainWater', ({ input, expected }) => {
        expect(trapRainWater(input)).toBe(expected);
    });

    it.each(majorityElementTestData)('majorityElement', ({ input, expected }) => {
        expect(majorityElement(input)).toBe(expected);
    });

    it.each(majorityElement2TestData)('majorityElement2', ({ input, expected }) => {
        expect(majorityElement2(input)).toEqual(expected);
    });

    it.each(mergeStonesTestData)('mergeStones', ({ input: { stones, k }, expected }) => {
        expect(mergeStones(stones, k)).toBe(expected);
    });

    it.each(minWindowTestData)('minWindow', ({ input: { str1, str2 }, expected }) => {
        expect(minWindow(str1, str2)).toBe(expected);
    });

    it.each(setZerosTestData)('setZeros', ({ input, expected }) => {
        const clone = (input: number[][]) => input.slice().map((val) => val.slice());

        const input1 = clone(input);
        const input2 = clone(input);
        const input3 = clone(input);

        setZeroes(input1);
        setZeroes2(input2);
        setZeroes3(input3);

        expect(input1).toEqual(expected);
        expect(input2).toEqual(expected);
        expect(input3).toEqual(expected);
    });

    it.each(countPrimesTestData)('countPrimes', ({ input, expected }) => {
        expect(countPrimes(input)).toBe(expected);
    });

    it.each(getSumOfMatrixTestData)('getSumOfMatrix', ({ input, expected }) => {
        expect(getSumOfMatrix(input)).toEqual(expected);
    });

    it.each(getSumOfi1j1i2j2TestData)('getSumOfi1j1i2j2', ({ input: { sumOfMatrix, i1, i2, j1, j2 }, expected }) => {
        expect(getSumOfi1j1i2j2(sumOfMatrix, i1, j1, i2, j2)).toBe(expected);
    });

    test('getSumOfi1j1i2j2 will throw error if the provided index is invalid', () => {
        expect(() => getSumOfi1j1i2j2([[]], 0, 0, 1, 1)).toThrowError('Invalid index');
    });

    it.each(splitEarthTestData)('splitEarth', ({ input, expected }) => {
        expect(splitEarth(input)).toBe(expected);
        expect(splitEarth2(input)).toBe(expected);
    });

    it.each(getMaxArrOf2PartsMinTestData)('getMaxArrOf2PartsMin', ({ input, expected }) => {
        expect(getMaxArrOf2PartsMin(input)).toEqual(expected);
        expect(getMaxArrOf2PartsMin2(input)).toEqual(expected);
    });

    it.each(lengthOfLongestSubstringTestData)('lengthOfLongestSubstring', ({ input, expected }) => {
        expect(lengthOfLongestSubstring(input)).toBe(expected);
        expect(lengthOfLongestSubstring2(input)).toBe(expected);
    });

    it.each(lengthOfLongestSubstringKDistinctTestData)(
        'lengthOfLongestSubstringKDistinct',
        ({ input: { str, k }, expected }) => {
            expect(lengthOfLongestSubstringKDistinct(str, k)).toBe(expected);
        }
    );

    it.each(getMaxPartsArrayTestData)('getMaxPartsArray', ({ input, expected }) => {
        expect(getMaxPartsArray(input)).toEqual(expected);
    });

    it.each(getSubsequenceWithBiggestDictionarySequenceTestData)(
        'getSubsequenceWithBiggestDictionarySequence',
        ({ input: { str, k }, expected }) => {
            expect(getSubsequenceWithBiggestDictionarySequence(str, k)).toBe(expected);
        }
    );

    it.each(getMaxValueOfSTestData)('getMaxValueOfS', ({ input, expected }) => {
        expect(getMaxValueOfS(input)).toBe(expected);
    });

    it.each(getLongestIncreasingSubsequenceTestData)('getLongestIncreasingSubsequence', ({ input, expected }) => {
        expect(getLongestIncreasingSubsequence(input)).toEqual(expected);
    });

    it.each(getMaxRemovableSubsequenceTestData)('getMaxRemovableSubsequence', ({ input, expected }) => {
        expect(getMaxRemovableSubsequence(input)).toBe(expected);
    });

    it.each(getMinChangesTestData)('getMinChanges', ({ input, expected }) => {
        expect(getMinChanges(input)).toBe(expected);
    });

    it.each(nextPermutationTestData)('nextPermutation', ({ input, expected }) => {
        nextPermutation(input);

        expect(input).toEqual(expected);
    });

    it.each(getLengthOfLongestSubArrayWithSumKTestData)(
        'getLengthOfLongestSubArrayWithSumK',
        ({ input: { arr, k }, expected }) => {
            expect(getLengthOfLongestSubArrayWithSumK(arr, k)).toBe(expected);
            expect(getLengthOfLongestSubArrayWithSumK2(arr, k)).toBe(expected);
        }
    );

    it.each(getLengthOfLongestSubArrayWithSumK2TestData)(
        'getLengthOfLongestSubArrayWithSumK2',
        ({ input: { arr, k }, expected }) => {
            expect(getLengthOfLongestSubArrayWithSumK2(arr, k)).toBe(expected);
        }
    );

    it.each(getMinDistanceTestData)('getMinDistance', ({ input, expected }) => {
        expect(getMinDistance(input)).toBe(expected);
    });

    it.each(minEatingSpeedTestData)('minEatingSpeed', ({ input: { arr, h }, expected }) => {
        expect(minEatingSpeed(arr, h)).toBe(expected);
    });

    it.each(maxUncrossedLinesTestData)('maxUncrossedLines', ({ input: { nums1, nums2 }, expected }) => {
        expect(maxUncrossedLines(nums1, nums2)).toBe(expected);
    });

    it.each(avoidFloodTestData)('avoidFlood', ({ input, expected }) => {
        expect(avoidFlood(input)).toEqual(expected);
    });

    it.each(rotateTestData)('rotate', ({ input, expected }) => {
        rotate(input);

        expect(input).toEqual(expected);
    });

    it.each(reversePairsTestData)('reversePairs', ({ input, expected }) => {
        expect(reversePairs(input)).toBe(expected);
    });

    it.each(maxRunTimeTestData)('maxRunTime', ({ input: { arr, n }, expected }) => {
        expect(maxRunTime(n, arr)).toBe(expected);
    });

    it.each(leastWaitingTimeTestData)('leastWaitingTime', ({ input: { arr, n }, expected }) => {
        expect(leastWaitingTime(arr, n)).toBe(expected);
        expect(leastWaitingTime2(arr, n)).toBe(expected);
    });

    it.each(findSubstringInWrapRoundStringTestData)('findSubstringInWrapRoundString', ({ input, expected }) => {
        expect(findSubstringInWrapRoundString(input)).toBe(expected);
        expect(findSubstringInWrapRoundString2(input)).toBe(expected);
    });

    it.each(numTilePossibilitiesTestData)('numTilePossibilities', ({ input, expected }) => {
        expect(numTilePossibilities(input)).toBe(expected);
    });

    it.each(getMaxDiffTestData)('getMaxDiff', ({ input, expected }) => {
        expect(getMaxDiff(input)).toBe(expected);
    });

    it.each(getMinBagsTestData)('getMinBags', ({ input, expected }) => {
        expect(getMinBags(input)).toBe(expected);
        expect(getMinBagsDp(input)).toBe(expected);
        expect(getMinBagsDp2(input)).toBe(expected);
    });

    it.each(numSubMatrixSumTargetTestData)('numSubMatrixSumTarget', ({ input: { matrix, target }, expected }) => {
        expect(numSubMatrixSumTarget(matrix, target)).toBe(expected);
    });

    it.each(maxEqualRowsAfterFlipsTestData)('maxEqualRowsAfterFlips', ({ input, expected }) => {
        expect(maxEqualRowsAfterFlips(input)).toBe(expected);
    });

    it.each(maxSquareSideLengthTestData)('maxSquareSideLength', ({ input, expected }) => {
        expect(maxSquareSideLength(input)).toBe(expected);
    });

    it.each(productTestData)('product', ({ input, expected }) => {
        expect(product(input)).toEqual(expected);
        expect(product2(input)).toEqual(expected);
    });

    it.each(countSubArraysTestData)('countSubArrays', ({ input: { arr, num }, expected }) => {
        expect(countSubArrays(arr, num)).toBe(expected);
        expect(countSubArrays2(arr, num)).toBe(expected);
    });

    it.each(countZerosTestData)('countZeros', ({ input, expected }) => {
        expect(countZeros(input)).toBe(expected);
    });

    it.each(getNumOfMostRightOneTestData)('getNumOfMostRightOne', ({ input, expected }) => {
        expect(getNumOfMostRightOne(input)).toBe(expected);
        expect(getNumOfMostRightOne2(input)).toBe(expected);
    });

    it.each(getMinTimeOfDrawingTestData)('getMinTimeOfDrawing', ({ input: { arr, num }, expected }) => {
        expect(getMinTimeOfDrawing(arr, num)).toBe(expected);
    });

    it.each(divideTestData)('divide', ({ input: { dividend, divisor }, expected }) => {
        expect(divide(dividend, divisor)).toBe(expected);
    });

    it.each(wildcardMatchTestData)('wildcardMatch', ({ input: { s, p }, expected }) => {
        expect(wildcardMatch(s, p)).toBe(expected);
        expect(wildcardMatch2(s, p)).toBe(expected);
    });

    it.each(minPathValueTestData)('minPathValue', ({ input, expected }) => {
        expect(minPathValue(input)).toBe(expected);
    });

    it.each(maxProfitsTestData)('maxProfits', ({ input: { w, k, costs, profits }, expected }) => {
        expect(maxProfits(costs, profits, w, k)).toBe(expected);
        expect(maxProfits2(costs, profits, w, k)).toBe(expected);
    });

    it.each(minCostOfCuttingGoldTestData)('minCostOfCuttingGold', ({ input, expected }) => {
        expect(minCostOfCuttingGold(input)).toBe(expected);
        expect(minCostOfCuttingGold2(input)).toBe(expected);
    });

    it.each(groupAnagramsTestData)('groupAnagrams', ({ input, expected }) => {
        expect(
            groupAnagrams(input)
                .map((val) => val.sort())
                .sort()
        ).toEqual(expected.map((val) => val.sort()).sort());
    });

    it.each(combinationSumTestData)('combinationSum', ({ input: { arr, target }, expected }) => {
        expect(combinationSum(arr, target).sort()).toEqual(expected.sort());
    });

    it.each(canFinishAllCoursesTestData)(
        'canFinishAllCourses',
        ({ input: { numCourses, prerequisites }, expected }) => {
            expect(canFinishAllCourses(numCourses, prerequisites)).toBe(expected);
            expect(canFinishAllCourses2(numCourses, prerequisites)).toBe(expected);
            expect(canFinishAllCourses3(prerequisites)).toBe(expected);
        }
    );

    it.each(longestIncreasingPathTestData)('longestIncreasingPath', ({ input, expected }) => {
        expect(longestIncreasingPath(input)).toBe(expected);
    });

    it.each(ladderLengthTestData)('ladderLength', ({ input: { beginWord, endWord, wordList }, expected }) => {
        expect(ladderLength(beginWord, endWord, wordList.slice())).toBe(expected);
        expect(ladderLength2(beginWord, endWord, wordList.slice())).toBe(expected);
    });

    it.each(longestConsecutiveTestData)('longestConsecutive', ({ input, expected }) => {
        expect(longestConsecutive(input)).toBe(expected);
    });

    it.each(flipNonEdgeOToXTestData)('flipNonEdgeOToX', ({ input, expected }) => {
        flipNonEdgeOToX(input);
        expect(input).toEqual(expected);
    });

    it.each(partitionPalindromeTestData)('partitionPalindrome', ({ input, expected }) => {
        expect(partitionPalindrome(input)).toEqual(expected);
    });

    it.each(canCompleteCircuitTestData)('canCompleteCircuit', ({ input: { gas, cost }, expected }) => {
        expect(canCompleteCircuit(gas, cost)).toBe(expected);
        expect(canCompleteCircuit2(gas, cost)).toBe(expected);
        expect(canCompleteCircuit3(gas, cost)).toBe(expected);
    });

    it.each(wordBreakTestData)('wordBreak', ({ input: { s, wordDict }, expected }) => {
        expect(wordBreak(s, wordDict)).toBe(expected);
    });

    it.each(findOrderTestData)('findOrder', ({ input: { numCourses, prerequisites }, expected }) => {
        expect(findOrder(numCourses, prerequisites)).toEqual(expected);
    });

    it.each(findDuplicateTestData)('findDuplicate', ({ input, expected }) => {
        expect(findDuplicate(input)).toBe(expected);
    });

    it.each(countSmallerTestData)('countSmaller', ({ input, expected }) => {
        expect(countSmaller(input)).toEqual(expected);
    });

    it.each(wiggleSortTestData)('wiggleSort', ({ input, expected }) => {
        wiggleSort(input);
        expect(input).toEqual(expected);
    });

    it.each(increasingTripletTestData)('increasingTriplet', ({ input, expected }) => {
        expect(increasingTriplet(input)).toBe(expected);
        expect(increasingTriplet2(input)).toBe(expected);
    });

    it.each(fourSumCountTestData)('fourSumCount', ({ input: { nums1, nums2, nums3, nums4 }, expected }) => {
        expect(fourSumCount(nums1, nums2, nums3, nums4)).toBe(expected);
    });

    it.each(topKFrequentTestData)('topKFrequent', ({ input: { nums, k }, expected }) => {
        expect(topKFrequent(nums, k)).toEqual(expected);
    });

    it.each(longestSubstringTestData)('longestSubstring', ({ input: { s, k }, expected }) => {
        expect(longestSubstring(s, k)).toBe(expected);
    });

    it.each(combinationSum2TestData)('combinationSum2', ({ input: { arr, target }, expected }) => {
        const sorter = (a: number[], b: number[]) => {
            const strA = a.join('');
            const strB = b.join('');
            if (strA > strB) {
                return 1;
            }
            if (strA === strB) {
                return 0;
            }
            return -1;
        };

        expect(combinationSum2(arr, target).sort(sorter)).toEqual(expected.sort(sorter));
        expect(combinationSum3(arr, target).sort(sorter)).toEqual(expected.sort(sorter));
    });

    it.each(uniquePathsWithObstaclesTestData)('uniquePathsWithObstacles', ({ input, expected }) => {
        expect(uniquePathsWithObstacles(input)).toBe(expected);
    });

    it.each(nextGreaterElementsTestData)('nextGreaterElements', ({ input, expected }) => {
        expect(nextGreaterElements(input)).toEqual(expected);
    });

    it.each(restoreIpAddressesTestData)('restoreIpAddresses', ({ input, expected }) => {
        expect(restoreIpAddresses(input).sort()).toEqual(expected.sort());
    });

    it.each(multiplyTestData)('multiply', ({ input: { num1, num2 }, expected }) => {
        expect(multiply(num1, num2)).toBe(expected);
    });

    it.each(getPrimeNumbersTestData)('getPrimeNumbers', ({ input, expected }) => {
        expect(getPrimeNumbers(input)).toEqual(expected);
    });

    it.each(getMinOutNumberOfPeopleTestData)('getMinOutNumberOfPeople', ({ input, expected }) => {
        expect(getMinOutNumberOfPeople(input)).toBe(expected);
    });

    it.each(findMinTestData)('findMin', ({ input, expected }) => {
        expect(findMin(input)).toBe(expected);
    });
});
