import { Stack } from '../stack';

describe('Stack', () => {
    test('isEmpty', () => {
        const stack = new Stack();
        expect(stack.isEmpty()).toBe(true);
    });

    test('push 1 then check isEmpty', () => {
        const stack = new Stack();
        stack.push(1);

        expect(stack.isEmpty()).toBe(false);
    });

    test('push 1, pop 1 then check isEmpty', () => {
        const stack = new Stack();
        stack.push(1);
        stack.pop();

        expect(stack.isEmpty()).toBe(true);
    });

    test('pop undefined', () => {
        const stack = new Stack();
        expect(stack.pop()).toEqual(undefined);
    });

    test('pop undefined, push 2 then pop 2', () => {
        const stack = new Stack();
        stack.pop();
        stack.push(2);

        expect(stack.pop()).toEqual(2);
    });

    test('push 1,2,3 pop 3,2,1', () => {
        const stack = new Stack();
        [1, 2, 3].forEach((val) => stack.push(val));

        expect([stack.pop(), stack.pop(), stack.pop()]).toEqual([3, 2, 1]);
    });

    test('push 1,2,3 pop 3,2 then push 4, then pop 4,1', () => {
        const stack = new Stack();
        [1, 2, 3].forEach((val) => stack.push(val));

        const expected1 = [stack.pop(), stack.pop()];
        stack.push(4);
        const expected2 = [stack.pop(), stack.pop()];

        expect(expected1).toEqual([3, 2]);
        expect(expected2).toEqual([4, 1]);
    });
});
