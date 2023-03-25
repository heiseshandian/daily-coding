import {
    countConversionResult,
    countConversionResultDp,
    countConversionResultDp2,
    countMoney,
    countMoneyDp,
    countMoneyDp2,
    countMoneyDp3,
    countNQueen,
    countNQueen2,
    countWalkMethods,
    countWalkMethodsDp,
    countWalkMethodsDp2,
    getCoffeeTime,
    getCoffeeTimeDp,
    getCoffeeTimeDp2,
    getCoffeeTimeDp3,
    getHorseMethods,
    getHorseMethods2,
    getHorseMethodsDp,
    getHorseMethodsDp2,
    getMaxPoints,
    getMaxPointsDp,
    getMinMethods,
    getMinMethodsDp,
    getMinValueOfColor,
    getMinValueOfColor2,
    getMinValueOfColorDp,
    maxCommonSubsequence,
    maxValueOfBag,
    maxValueOfBagDp,
    maxValueOfBagDp2,
    getPlusOrMinusCount,
    getPlusOrMinusCountDp,
    getPlusOrMinusCountDp2,
    getMaxMoney,
    getMaxMoney2,
    getMaxMoneyDp,
    getMaxMoneyDp2,
    isInterleave,
    getMinEditDistance,
    getMinEditDistance2,
} from '../dp';
import {
    countMoneyTestData,
    countWalkMethodsTestData,
    getCoffeeTimeTestData,
    getHorseMethodsTestData,
    getMinMethodsTestData,
    getMinValueOfColorTestData,
    maxCommonSubsequenceTestData,
    getPlusOrMinusCountTestData,
    getMaxMoneyTestData,
    isInterleaveTestData,
    editDistanceTestData,
} from './dp.testdata';
import { bagTestData, maxPointsTestData, nQueenTestData } from './recursion.testdata';
import { numSquaresTestData } from './dp.testdata';
import { numSquares, numSquares2 } from '../dp';

describe('dp', () => {
    test('countConversionResult', () => {
        for (let i = 0; i < 10000; i++) {
            let str = `${Math.floor(Math.random() * 100000000)}`;

            const result1 = countConversionResult(str);
            const result2 = countConversionResultDp(str);
            const result3 = countConversionResultDp2(str);

            expect(result1).toBe(result2);
            expect(result1).toBe(result3);
        }
    });

    it.each(bagTestData)('bag %j', ({ input: { weights, values, targetWeight }, expected }) => {
        expect(maxValueOfBag(weights, values, targetWeight)).toBe(expected);
        expect(maxValueOfBagDp(weights, values, targetWeight)).toBe(expected);
        expect(maxValueOfBagDp2(weights, values, targetWeight)).toBe(expected);
    });

    it.each(maxPointsTestData)('getMaxPoints', ({ input, expected }) => {
        expect(getMaxPoints(input)).toBe(expected);
        expect(getMaxPointsDp(input)).toBe(expected);
    });

    it.each(nQueenTestData)('countNQueen', ({ input, expected }) => {
        expect(countNQueen(input)).toBe(expected);
        expect(countNQueen2(input)).toBe(expected);
    });

    it.each(countWalkMethodsTestData)('countWalkMethods %j', ({ input: { n, m, k, p }, expected }) => {
        expect(countWalkMethods(n, m, k, p)).toBe(expected);
        expect(countWalkMethodsDp(n, m, k, p)).toBe(expected);
        expect(countWalkMethodsDp2(n, m, k, p)).toBe(expected);
    });

    it.each(countMoneyTestData)('countMoney', ({ input: { arr, target }, expected }) => {
        expect(countMoney(arr, target)).toBe(expected);
        expect(countMoneyDp(arr, target)).toBe(expected);
        expect(countMoneyDp2(arr, target)).toBe(expected);
        expect(countMoneyDp3(arr, target)).toBe(expected);
    });

    it.each(getMinMethodsTestData)('getMinMethods', ({ input: { str, arr }, expected }) => {
        expect(getMinMethods(str, arr)).toBe(expected);
        expect(getMinMethodsDp(str, arr)).toBe(expected);
    });

    it.each(maxCommonSubsequenceTestData)('maxCommonSubsequence', ({ input: { str1, str2 }, expected }) => {
        expect(maxCommonSubsequence(str1, str2)).toBe(expected);
    });

    it.each(getCoffeeTimeTestData)('getCoffeeTime', ({ input: { arr, a, b }, expected }) => {
        expect(getCoffeeTime(arr, a, b)).toBe(expected);
        expect(getCoffeeTimeDp(arr, a, b)).toBe(expected);
        expect(getCoffeeTimeDp2(arr, a, b)).toBe(expected);
        expect(getCoffeeTimeDp3(arr, a, b)).toBe(expected);
    });

    it.each(getHorseMethodsTestData)('getHorseMethods', ({ input: { a, b, k }, expected }) => {
        expect(getHorseMethods(8, 9, a, b, k)).toBe(expected);
        expect(getHorseMethods2(8, 9, a, b, k)).toBe(expected);
        expect(getHorseMethodsDp(8, 9, a, b, k)).toBe(expected);
        expect(getHorseMethodsDp2(8, 9, a, b, k)).toBe(expected);
    });

    it.each(getMinValueOfColorTestData)('getMinValueOfColor', ({ input, expected }) => {
        expect(getMinValueOfColor(input)).toBe(expected);
        expect(getMinValueOfColorDp(input)).toBe(expected);
        expect(getMinValueOfColor2(input)).toBe(expected);
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

    it.each(isInterleaveTestData)('isInterleave', ({ input: { str1, str2, str3 }, expected }) => {
        expect(isInterleave(str1, str2, str3)).toBe(expected);
    });

    it.each(editDistanceTestData)('getMinEditDistance', ({ input: { word1, word2 }, expected }) => {
        expect(getMinEditDistance(word1, word2)).toBe(expected);
        expect(getMinEditDistance2(word1, word2)).toBe(expected);
    });

    it.each(numSquaresTestData)('numSquares', ({ input, expected }) => {
        expect(numSquares(input)).toBe(expected);
        expect(numSquares2(input)).toBe(expected);
    });
});
