import { getMinBoatsTestData, getMinCandyTestData, getMinValueOfColorTestData } from './other.testdata';
import { getMinBoats, getMinCandy, getMinValueOfColor, getMinValueOfColor2, getMinValueOfColorDp } from '../other';

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
});
