export class Queue {
    #array: Array<any>;

    constructor() {
        this.#array = [];
    }

    public size() {
        return this.#array.length;
    }

    public add(val: any) {
        this.#array.push(val);
    }

    public poll() {
        return this.#array.shift();
    }
}
