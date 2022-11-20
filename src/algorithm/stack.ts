import { DoubleLinkedList } from './linked-list';

export class Stack {
    #head: DoubleLinkedList | null;

    constructor() {
        this.#head = null;
    }

    public push(val: any) {
        const newNode = new DoubleLinkedList(val, this.#head);
        if (this.#head) {
            this.#head.next = newNode;
        }

        this.#head = newNode;
    }

    public pop() {
        const val = this.#head?.val;
        if (this.#head) {
            this.#head = this.#head.prev;
        }

        return val;
    }
}
