import { QueueWith2Stacks } from '../2';
import { times } from '../../../common';

describe('QueueWith2Stacks', () => {
  test('add 1,2,3,4 peek 1, then poll 1,2,3,4,undefined', () => {
    const queue = new QueueWith2Stacks();
    [1, 2, 3, 4].forEach((val) => queue.add(val));

    expect(queue.peek()).toBe(1);
    expect(times(5, () => queue.poll())).toEqual([1, 2, 3, 4, undefined]);
  });
});
