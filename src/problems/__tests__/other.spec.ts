import { TreeNode } from '../../algorithm/tree';
import {
    calculateStr,
    canSplit4Parts,
    countEqualTree2,
    countJointMethods,
    countJointMethodsDp,
    countJointMethodsDp2,
    countLostNumbers,
    countPrimes,
    distinctSubsequenceII,
    evaluationMethods,
    findKthLargest,
    findMinMoves,
    findSubstring,
    findWords,
    getAllTriples,
    getAllTwoTuples,
    getCalculateMethods,
    getClosestSumK,
    getClosestSumKOfMatrix,
    getConnectedRegions,
    getMaxA,
    getMaxIncreasingNum,
    getMaxK,
    getMaxLengthOfIncreasingSubsequence,
    getMaxLengthOfIncreasingSubsequence2,
    getMaxLenOfComposableSubArr,
    getMaxProfit,
    getMaxProfit2,
    getMaxProfit4,
    getMaxProfit4Dp,
    getMaxSizeOfAllOnes,
    getMinCoins,
    getMinCoinsDp,
    getMinEditDistance,
    getMinEditDistance2,
    getMinMissingNumber,
    getMinMoneyOfPassingMonster,
    getMinPalindrome,
    getMinRange,
    getMinStrCount,
    getMinSubArrThatShouldBeSorted,
    getMinSumThatCanNotBeComposed,
    getMinSumThatCanNotBeComposed1,
    getSumOfMatrix,
    getValidParentheses,
    kthSmallest,
    longestValidParentheses,
    mergeStones,
    MessageBox,
    minCameraCover,
    minCameraCover2,
    minWindow,
    reverseBetween,
    reverseBits,
    reverseBits2,
    shortestBridge,
    splitEarth,
    trap,
    trapRainWater,
    unzipStr,
    zigzagLevelOrder,
} from '../other';
import {
    getMaxATestData,
    getMinCoinsTestData,
    reverseBitsTestData,
    getMinJumpStepsTestData,
    getMaxKTestData,
    getMinArrTestData,
    getMinSumThatCanNotBeComposed1TestData,
    getMinMoneyOfPassingMonsterTestData,
    getMaxLenOfComposableSubArrTestData,
    getMinStrCountTestData,
    unzipStrTestData,
    getAllTwoTuplesTestData,
    getAllTriplesTestData,
    findKthLargestTestData,
    getMinRangeTestData,
    getMaxIncreasingNumTestData,
    getClosestSumKTestData,
    getClosestSumKOfMatrixTestData,
    findWordsTestData,
    getMinValueTestData,
    getMaxProfit3TestData,
    getMaxProfit4TestData,
    getCalculateMethodsTestData,
    existWordTestData,
    countJointMethodsTestData,
    getValidParenthesesTestData,
    getMaxLengthOfIncreasingSubsequenceTestData,
    getMaxSizeOfAllOnesTestData,
    evaluationMethodsTestData,
    findMinMovesTestData,
    kthSmallestTestData,
    distinctSubsequenceIITestData,
    shortestBridgeTestData,
    trapTestData,
    trapRainWaterTestData,
    mergeStonesTestData,
    minWindowTestData,
    setZerosTestData,
    countPrimesTestData,
    getSumOfMatrixTestData,
    getSumOfi1j1i2j2TestData,
    splitEarthTestData,
} from './other.testdata';
import {
    getMinCoinsDp2,
    getMinJumpSteps,
    getMinJumpStepsDp,
    getMinJumpSteps2,
    getNthUglyNumber,
    getConnectedRegions2,
} from '../other';
import {
    editDistanceTestData,
    getMaxGameTestData,
    getMaxMoneyTestData,
    getMaxSumOfSubArrTestData,
    isInterleaveTestData,
} from './other.testdata';
import {
    countEqualTree,
    getMaxGame,
    getMaxGameWindow,
    getMaxMoneyDp,
    getMaxMoneyDp2,
    getMaxSumOfSubArr,
    isInterleave,
    MapWithSetAll,
} from '../other';
import {
    getMaxMoney,
    getMaxMoney2,
    getMaxRopePoints,
    getMaxRopePoints2,
    getPlusOrMinusCount,
    getPlusOrMinusCountDp,
    getPlusOrMinusCountDp2,
} from '../other';
import {
    countSubArrTestData,
    getMaxRopePointsTestData,
    getMinBoatsTestData,
    getMinCandyTestData,
    getMinValueOfColorTestData,
    getPlusOrMinusCountTestData,
    canSplit4PartsTestData,
} from './other.testdata';
import {
    countSubArr,
    countSubArr2,
    getMinBoats,
    getMinCandy,
    getMinValueOfColor,
    getMinValueOfColor2,
    getMinValueOfColorDp,
} from '../other';
import {
    getConnectedRegionsTestData,
    getMinMissingNumberTestData,
    getMinPalindromeTestData,
    getMaxProfitTestData,
} from './other.testdata';
import {
    getMinMoneyOfPassingMonsterDp4,
    getMinValue,
    getMaxProfit3,
    countSubsequence,
    getCalculateMethods2,
} from '../other';
import {
    countSubsequenceTestData,
    reverseBetweenTestData,
    updatePathsTestData,
    getMinCandyTestData3,
} from './other.testdata';
import {
    getMinMoneyOfPassingMonsterDp,
    getMinMoneyOfPassingMonsterDp2,
    getMinMoneyOfPassingMonsterDp3,
} from '../other';
import {
    getNthUglyNumberTestData,
    getMinSumThatCanNotBeComposedTestData,
    countLostNumbersTestData,
} from './other.testdata';
import { SingleLinkedList } from '../../algorithm/linked-list';
import {
    updatePaths,
    getMinCandy3,
    getMinCandy2,
    getMinCandy4,
    getMaxSizeOfAllOnes2,
    longestValidParentheses2,
} from '../other';
import {
    calculateStrTestData,
    longestValidParenthesesTestData,
    findSubstringTestData,
    majorityElementTestData,
} from './other.testdata';
import { parenthesesComparator } from '../../common/index';
import {
    trap2,
    existWord,
    majorityElement,
    majorityElement2,
    setZeroes,
    setZeroes2,
    setZeroes3,
    getSumOfi1j1i2j2,
} from '../other';
import { majorityElement2TestData } from './other.testdata';

describe('other', () => {
    it.each(getMinValueOfColorTestData)('getMinValueOfColor', ({ input, expected }) => {
        expect(getMinValueOfColor(input)).toBe(expected);
        expect(getMinValueOfColorDp(input)).toBe(expected);
        expect(getMinValueOfColor2(input)).toBe(expected);
    });

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

    it.each(getPlusOrMinusCountTestData)('getPlusOrMinusCount', ({ input: { arr, target }, expected }) => {
        expect(getPlusOrMinusCount(arr, target)).toBe(expected);
        expect(getPlusOrMinusCountDp(arr, target)).toBe(expected);
        expect(getPlusOrMinusCountDp2(arr, target)).toBe(expected);
    });

    it.each(getMaxMoneyTestData)('getMaxMoney', ({ input, expected }) => {
        expect(getMaxMoney(input)).toBe(expected);
        expect(getMaxMoney2(input)).toBe(expected);
        expect(getMaxMoneyDp(input)).toBe(expected);
        expect(getMaxMoneyDp2(input)).toBe(expected);
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

    it.each(isInterleaveTestData)('isInterleave', ({ input: { str1, str2, str3 }, expected }) => {
        expect(isInterleave(str1, str2, str3)).toBe(expected);
    });

    describe('countEqualTree', () => {
        test('countEqualTree 1', () => {
            const head = new TreeNode(1);
            head.left = new TreeNode(2);
            head.right = new TreeNode(3);

            expect(countEqualTree(head)).toBe(2);
            expect(countEqualTree2(head)).toBe(2);
        });

        test('countEqualTree 2', () => {
            const head = new TreeNode(1);
            head.left = new TreeNode(2);

            expect(countEqualTree(head)).toBe(1);
        });

        test('countEqualTree 3', () => {
            const head = new TreeNode(1);
            head.left = new TreeNode(2);
            head.right = new TreeNode(2);
            head.left.left = new TreeNode(4);
            head.right.right = new TreeNode(4);

            expect(countEqualTree(head)).toBe(3);
        });
    });

    it.each(editDistanceTestData)('getMinEditDistance', ({ input: { word1, word2 }, expected }) => {
        expect(getMinEditDistance(word1, word2)).toBe(expected);
        expect(getMinEditDistance2(word1, word2)).toBe(expected);
    });

    it.each(reverseBitsTestData)('reverseBits', ({ input, expected }) => {
        expect(reverseBits(input)).toBe(expected);
        expect(reverseBits2(input)).toBe(expected);
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

    test('zigzagLevelOrder', () => {
        const head = new TreeNode(3);
        head.left = new TreeNode(9);
        head.right = new TreeNode(20);
        head.right.left = new TreeNode(15);
        head.right.right = new TreeNode(7);

        expect(zigzagLevelOrder(head)).toEqual([[3], [20, 9], [15, 7]]);
    });

    it.each(existWordTestData)('existWord', ({ input: { board, word }, expected }) => {
        expect(existWord(board, word)).toBe(expected);
    });

    it.each(countJointMethodsTestData)('countJointMethods', ({ input: { str, arr }, expected }) => {
        expect(countJointMethods(str, arr)).toBe(expected);
        expect(countJointMethodsDp(str, arr)).toBe(expected);
        expect(countJointMethodsDp2(str, arr)).toBe(expected);
    });

    it.each(reverseBetweenTestData)('reverseBetween', ({ input: { arr, left, right }, expected }) => {
        const head = SingleLinkedList.from(arr);

        expect(SingleLinkedList.toArray(reverseBetween(head, left, right))).toEqual(expected);
    });

    it.each(updatePathsTestData)('updatePaths', ({ input, expected }) => {
        updatePaths(input);

        expect(input).toEqual(expected);
    });

    describe('minCameraCover', () => {
        test('1 camera', () => {
            const head = new TreeNode(0);
            head.left = new TreeNode(0);
            head.left.left = new TreeNode(0);
            head.left.right = new TreeNode(0);

            expect(minCameraCover(head)).toBe(1);
            expect(minCameraCover2(head)).toBe(1);
        });

        test('2 cameras', () => {
            const head = new TreeNode(0);
            head.left = new TreeNode(0);
            head.left.left = new TreeNode(0);
            head.left.left.left = new TreeNode(0);
            head.left.left.right = new TreeNode(0);

            expect(minCameraCover(head)).toBe(2);
            expect(minCameraCover2(head)).toBe(2);
        });

        test('3 cameras', () => {
            const head = new TreeNode(0);
            head.left = new TreeNode(0);
            head.left.left = new TreeNode(0);
            head.left.left.left = new TreeNode(0);
            head.left.left.right = new TreeNode(0);
            head.left.left.right.right = new TreeNode(0);

            expect(minCameraCover(head)).toBe(3);
            expect(minCameraCover2(head)).toBe(3);
        });
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
    });
});
