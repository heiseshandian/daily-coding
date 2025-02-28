import { times } from '../../common';
import { Queue } from '../queue';
describe('queue', () => {
  test('add 1,2,3,4,5 poll 1,2,3,4,5', () => {
    const queue = new Queue();
    [1, 2, 3, 4, 5].forEach((val) => queue.add(val));

    expect(times(5, () => queue.poll())).toEqual([1, 2, 3, 4, 5]);
  });
});
