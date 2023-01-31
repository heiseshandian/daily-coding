import { bagTestData } from '../../problems/__tests__/recursion.testdata';
import {
    countConversionResult,
    countConversionResultDp,
    countConversionResultDp2,
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
});
