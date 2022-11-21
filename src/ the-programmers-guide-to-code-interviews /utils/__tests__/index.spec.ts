import { times } from '../index';

describe('times', () => {
    test('times', () => {
        const fn = jest.fn();
        times(10, fn);

        expect(fn).toHaveBeenCalledTimes(10);
    });
});
