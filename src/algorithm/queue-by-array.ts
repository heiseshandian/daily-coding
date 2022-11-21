export class QueueByArray {
    #capacity: number;

    #size: number;

    #head: number;

    #tail: number;

    #container: Array<any>;

    constructor(capacity: number) {
        this.#capacity = capacity;
        this.#container = new Array(capacity);

        this.#size = 0;
        this.#head = -1;
        this.#tail = -1;
    }

    public add(val: any) {
        if (this.#size === this.#capacity) {
            throw new Error('The queue is full');
        }

        this.#size++;
        this.#head = this.#getNextHead();

        this.#container[this.#head] = val;
    }

    public poll() {
        if (this.isEmpty()) {
            throw new Error('The queue is empty');
        }

        this.#size--;
        this.#tail = this.#getNextTail();

        return this.#container[this.#tail];
    }

    public isEmpty() {
        return this.#size === 0;
    }

    #getNextTail() {
        return this.#tail < this.#capacity - 1 ? this.#tail + 1 : 0;
    }

    #getNextHead() {
        return this.#head < this.#capacity - 1 ? this.#head + 1 : 0;
    }
}
