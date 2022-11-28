export class Queue<T = any> {
    #array: Array<T>;

    constructor() {
        this.#array = [];
    }

    public size() {
        return this.#array.length;
    }

    public isEmpty() {
        return this.size() === 0;
    }

    public add(val: T) {
        this.#array.push(val);
    }

    public poll() {
        return this.#array.shift();
    }

    static from<T>(arr: T[]) {
        const queue = new Queue<T>();
        arr.forEach((val) => queue.add(val));
        return queue;
    }

    public valueOf() {
        return this.#array.slice();
    }
}
