import { diffWaysToCompute } from '../divide-and-conquer';

describe('divide-and-conquer', () => {
    it.each([
        ['2-1-1', [0, 2]],
        ['2*3-4*5', [-34, -14, -10, -10, 10]],
    ])('returns the closest sum for %p and target %p', (expression, result) => {
        expect(diffWaysToCompute(expression).sort()).toEqual(result.sort());
    });
});
