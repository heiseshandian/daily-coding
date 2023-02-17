export class Stack<T = any> {
    arr: T[] = [];

    public push(val: T) {
        this.arr.push(val);
    }

    public pop() {
        if (this.isEmpty()) {
            return;
        }

        const result = this.arr[this.arr.length - 1];
        this.arr.length--;
        return result;
    }

    public popFirst() {
        return this.arr.shift();
    }

    public pushFirst(val: T) {
        return this.arr.unshift(val);
    }

    public peek() {
        if (this.isEmpty()) {
            return;
        }

        return this.arr[this.arr.length - 1];
    }

    public isEmpty() {
        return this.arr.length === 0;
    }
}
