import { hanoi } from '../recursion';
import { hanoiTestData } from './recursion.testdata';

describe('hanoi', () => {
    it.each(hanoiTestData)('hanoi %j', ({ input, expected }) => {
        expect(hanoi(input)).toEqual(expected);
    });
});
