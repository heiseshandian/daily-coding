export class StackByArray {
    readonly #capacity: number;

    #head: number;

    readonly #container: Array<any>;

    constructor(capacity: number) {
        this.#capacity = capacity;
        this.#container = new Array(capacity);
        this.#head = -1;
    }

    public isEmpty() {
        return this.#head === -1;
    }

    public push(val: any) {
        if (this.#head === this.#capacity - 1) {
            throw new Error('The stack is full');
        }

        this.#head++;
        this.#container[this.#head] = val;
    }

    public pop() {
        if (this.isEmpty()) {
            throw new Error('The stack is empty');
        }

        const result = this.#container[this.#head];
        this.#head--;

        return result;
    }
}
