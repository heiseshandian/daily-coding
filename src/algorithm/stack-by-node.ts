import { DoubleLinkedList } from './linked-list';

export class StackByNode<T = any> {
    #head: DoubleLinkedList | null;

    constructor() {
        this.#head = null;
    }

    public push(val: T) {
        const newNode = new DoubleLinkedList(val, this.#head);
        if (this.#head) {
            this.#head.next = newNode;
        }

        this.#head = newNode;
    }

    public pop(): T {
        const val = this.#head?.val;
        if (this.#head) {
            this.#head = this.#head.prev;
        }

        return val;
    }

    public peek() {
        return this.#head?.val;
    }

    public isEmpty() {
        return this.#head === null;
    }
}
