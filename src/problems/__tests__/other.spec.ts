import { getMinCandyTestData, getMinValueOfColorTestData } from './other.testdata';
import { getMinCandy, getMinValueOfColor, getMinValueOfColor2, getMinValueOfColorDp } from '../other';

describe('other', () => {
    it.each(getMinValueOfColorTestData)('getMinValueOfColor', ({ input, expected }) => {
        expect(getMinValueOfColor(input)).toBe(expected);
        expect(getMinValueOfColorDp(input)).toBe(expected);
        expect(getMinValueOfColor2(input)).toBe(expected);
    });

    it.each(getMinCandyTestData)('getMinCandy', ({ input, expected }) => {
        expect(getMinCandy(input)).toBe(expected);
    });
});
