import { TreeNode } from '../../algorithm/tree';
import {
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

describe('other', () => {
    it.each(getMinValueOfColorTestData)('getMinValueOfColor', ({ input, expected }) => {
        expect(getMinValueOfColor(input)).toBe(expected);
        expect(getMinValueOfColorDp(input)).toBe(expected);
        expect(getMinValueOfColor2(input)).toBe(expected);
    });

    it.each(getMinCandyTestData)('getMinCandy', ({ input, expected }) => {
        expect(getMinCandy(input)).toBe(expected);
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
});
