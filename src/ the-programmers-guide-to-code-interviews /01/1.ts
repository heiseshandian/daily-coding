/*
 *实现一个特殊的栈，在实现栈的基本功能的基础上，再实现返回栈中最小元素的操作。
 *1.pop、push、getMin操作的时间复杂度都是O（1）。
 *2.设计的栈类型可以使用现成的栈结构。 */

import { Stack } from '../../algorithm/stack';

export class StackWithGetMin {
    #dataStack: Stack;

    #minStack: Stack;

    constructor() {
        this.#dataStack = new Stack();
        this.#minStack = new Stack();
    }

    public push(val: any) {
        this.#dataStack.push(val);

        if (this.#minStack.peek() === undefined) {
            this.#minStack.push(val);
            return;
        }

        const previousMin = this.getMin();
        const nextMin = val < previousMin ? val : previousMin;
        this.#minStack.push(nextMin);
    }

    public pop() {
        this.#minStack.pop();
        return this.#dataStack.pop();
    }

    public getMin() {
        return this.#minStack.peek();
    }
}
