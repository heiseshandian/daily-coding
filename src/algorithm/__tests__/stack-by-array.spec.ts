import { StackByArray } from '../stack-by-array';

describe('Stack', () => {
    test('will throw error if the stack is empty', () => {
        const stack = new StackByArray(10);
        expect(() => stack.pop()).toThrow();
    });

    test('will throw error if the stack is full', () => {
        const stack = new StackByArray(1);
        stack.push(1);

        expect(() => stack.push(2)).toThrow();
    });

    test('push 2 then pop 2', () => {
        const stack = new StackByArray(10);
        stack.push(2);

        expect(stack.pop()).toEqual(2);
    });

    test('push 1,2,3 pop 3,2,1', () => {
        const stack = new StackByArray(10);
        [1, 2, 3].forEach((val) => stack.push(val));

        expect([stack.pop(), stack.pop(), stack.pop()]).toEqual([3, 2, 1]);
    });

    test('push 1,2,3 pop 3,2 then push 4, then pop 4,1', () => {
        const stack = new StackByArray(10);
        [1, 2, 3].forEach((val) => stack.push(val));

        const expected1 = [stack.pop(), stack.pop()];
        stack.push(4);
        const expected2 = [stack.pop(), stack.pop()];

        expect(expected1).toEqual([3, 2]);
        expect(expected2).toEqual([4, 1]);
    });
});
