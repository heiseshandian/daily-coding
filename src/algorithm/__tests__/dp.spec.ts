import { bagTestData, maxPointsTestData, nQueenTestData } from '../../problems/__tests__/recursion.testdata';
import {
    countNQueen,
    countNQueen2,
    countWalkMethods,
    countWalkMethodsDp,
    countWalkMethodsDp2,
    getMaxPointsDp,
} from '../dp';
import { countWalkMethodsTestData } from './dp.testdata';
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
});
