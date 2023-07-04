import { reduce } from '../array';

describe('array', () => {
    test('reduce,without initialValue', () => {
        const arr = [1, 2, 3, 4, 5];
        expect(arr.reduce((a, b) => a + b)).toBe(reduce(arr, (a, b) => a + b));
    });

    test('reduce,with initialValue', () => {
        const arr = [1, 2, 3, 4, 5];
        expect(arr.reduce((a, b) => a + b, 10)).toBe(reduce(arr, (a, b) => a + b, 10));
    });
});
