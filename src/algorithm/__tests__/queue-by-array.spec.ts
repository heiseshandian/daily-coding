import { QueueByArray } from '../queue-by-array';
import { times } from '../../common/index';
describe('QueueByArray', () => {
    test('isEmpty', () => {
        const queue = new QueueByArray(1);

        expect(queue.isEmpty()).toBe(true);
    });

    test('add 1,2,3,4 poll 1,2,3,4', () => {
        const queue = new QueueByArray(10);
        [1, 2, 3, 4].forEach((val) => queue.add(val));

        expect(times(4, () => queue.poll())).toEqual([1, 2, 3, 4]);
    });

    test('will throw error when the queue is full', () => {
        const queue = new QueueByArray(1);
        queue.add(1);

        expect(() => queue.add(2)).toThrow();
    });

    test('will throw error when the queue is empty', () => {
        const queue = new QueueByArray(1);

        expect(() => queue.poll()).toThrow();
    });
});
