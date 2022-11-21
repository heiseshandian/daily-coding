import { StackWithGetMinV2 } from '../1.1';
import { times } from '../../utils';

describe('StackWithGetMin', () => {
    test('getMin will return undefined if the stack is empty', () => {
        const stack = new StackWithGetMinV2();
        expect(stack.getMin()).toBe(undefined);
    });

    test('push 3,2,1,4 then pop 4,1 then getMin will return 2', () => {
        const stack = new StackWithGetMinV2();
        [3, 2, 1, 4].forEach((val) => stack.push(val));

        stack.pop();
        stack.pop();

        expect(stack.getMin()).toBe(2);
    });

    test('push 1, 1, 1, 1, 4, 0, 0, 0, 1, 1', () => {
        const stack = new StackWithGetMinV2();
        [1, 1, 1, 1, 4, 0, 0, 0, 1, 1].forEach((val) => stack.push(val));
        expect(stack.getMin()).toBe(0);

        times(4, () => stack.pop());
        expect(stack.getMin()).toBe(0);

        stack.pop();
        expect(stack.getMin()).toBe(1);

        times(4, () => stack.pop());
        expect(stack.getMin()).toBe(1);

        stack.pop();
        expect(stack.getMin()).toBe(undefined);
    });
});
