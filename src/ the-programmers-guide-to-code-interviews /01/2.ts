/*
 * 编写一个类，用两个栈实现队列，支持队列的基本操作（add、poll、peek）。
 */
import { Stack } from '../../algorithm/stack';

export class QueueWith2Stacks {
    #inputStack: Stack;

    #outputStack: Stack;

    constructor() {
        this.#inputStack = new Stack();
        this.#outputStack = new Stack();
    }

    public add(val: any) {
        this.#inputStack.push(val);
    }

    public poll() {
        this.#fillOutputStack();
        const result = this.#outputStack.pop();
        this.#recoverInputStack();

        return result;
    }

    public peek() {
        this.#fillOutputStack();
        const result = this.#outputStack.peek();
        this.#recoverInputStack();

        return result;
    }

    #fillOutputStack() {
        let current = this.#inputStack.pop();
        while (current !== undefined) {
            this.#outputStack.push(current);
            current = this.#inputStack.pop();
        }
    }

    #recoverInputStack() {
        let current = this.#outputStack.pop();
        while (current !== undefined) {
            this.#inputStack.push(current);
            current = this.#outputStack.pop();
        }
    }
}
