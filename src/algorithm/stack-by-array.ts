export class StackByArray {
    readonly #capacity: number;

    #size: number;

    #head: number;

    readonly #container: Array<any>;

    constructor(capacity: number) {
        this.#capacity = capacity;
        this.#container = new Array(capacity);

        this.#size = 0;
        this.#head = -1;
    }

    public push(val: any) {
        if (this.#size >= this.#capacity) {
            throw new Error('The stack is full');
        }

        this.#size++;
        this.#head = this.#getNextPushIndex();

        this.#container[this.#head] = val;
    }

    #getNextPushIndex() {
        return this.#head < this.#capacity - 1 ? this.#head + 1 : 0;
    }

    public pop() {
        if (this.#size <= 0) {
            throw new Error('The stack is empty');
        }

        this.#size--;
        const currentHead = this.#head;
        this.#updateHead();

        return this.#container[currentHead];
    }

    #updateHead() {
        this.#head = this.#head > 0 ? this.#head - 1 : this.#capacity - 1;
    }
}
