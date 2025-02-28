import { StackWithGetMin } from '../1';

describe('StackWithGetMin', () => {
  test('getMin will return undefined if the stack is empty', () => {
    const stack = new StackWithGetMin();
    expect(stack.getMin()).toBe(undefined);
  });

  test('push 3,2,1,4 then pop 4,1 then getMin will return 2', () => {
    const stack = new StackWithGetMin();
    [3, 2, 1, 4].forEach((val) => stack.push(val));

    stack.pop();
    stack.pop();

    expect(stack.getMin()).toBe(2);
  });
});
