import { Stack } from '../../../algorithm/stack';
import { reverseStack } from '../3';
import { times } from '../../../common';

describe('reverseStack', () => {
  test('input 1,2,3 pop 1,2,3', () => {
    const stack = new Stack();
    [1, 2, 3].forEach((val) => stack.push(val));
    reverseStack(stack);

    expect(times(3, () => stack.pop())).toEqual([1, 2, 3]);
  });
});
