import { getMinValueOfColorTestData } from './other.testdata';
import { getMinValueOfColor, getMinValueOfColor2, getMinValueOfColorDp } from '../other';

describe('other', () => {
    it.each(getMinValueOfColorTestData)('getMinValueOfColor', ({ input, expected }) => {
        expect(getMinValueOfColor(input)).toBe(expected);
        expect(getMinValueOfColorDp(input)).toBe(expected);
        expect(getMinValueOfColor2(input)).toBe(expected);
    });
});
