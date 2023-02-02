import { bagTestData, maxPointsTestData, nQueenTestData } from '../../problems/__tests__/recursion.testdata';
import {
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
    getMaxPointsDp,
    getMinMethodsDp,
} from '../dp';
import {
    countMoneyTestData,
    countWalkMethodsTestData,
    getCoffeeTimeTestData,
    getMinMethodsTestData,
    maxCommonSubsequenceTestData,
} from './dp.testdata';
import { getMinMethods, maxCommonSubsequence } from '../dp';
import {
    countConversionResult,
    countConversionResultDp,
    countConversionResultDp2,
    getMaxPoints,
    maxValueOfBag,
    maxValueOfBagDp,
    maxValueOfBagDp2,
} from '../dp';

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
    });
});
