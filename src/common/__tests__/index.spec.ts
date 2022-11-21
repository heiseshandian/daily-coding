import { times } from '../index';

describe('times', () => {
    test('times', () => {
        const fn = jest.fn(() => 1);
        const result = times(3, fn);

        expect(fn).toHaveBeenCalledTimes(3);
        expect(result).toEqual([1, 1, 1]);
    });
});
