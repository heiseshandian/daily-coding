import { swap } from '../common';

export class Heap {
    #container: number[];

    constructor() {
        this.#container = [];
    }

    public isEmpty() {
        return this.#container.length === 0;
    }

    public push(val: number) {
        this.#container.push(val);
        insertHeap(this.#container, this.#container.length - 1);
    }

    public pop() {
        const result = this.#container[0];
        swap(this.#container, 0, this.#container.length - 1);
        this.#container.length--;
        heapify(this.#container, 0, this.#container.length);

        return result;
    }
}

function insertHeap(arr: number[], i: number) {
    while (i) {
        const parent = (i - 1) >> 1;
        if (arr[parent] >= arr[i]) {
            break;
        }

        swap(arr, i, parent);
        i = parent;
    }
}

function heapify(arr: number[], i: number, heapSize: number) {
    let left = 2 * i + 1;
    while (left < heapSize) {
        const right = left + 1;
        let largestIndex = right < heapSize && arr[right] > arr[left] ? right : left;
        largestIndex = arr[largestIndex] > arr[i] ? largestIndex : i;

        if (largestIndex === i) {
            break;
        }

        swap(arr, i, largestIndex);
        i = largestIndex;
        left = 2 * i + 1;
    }
}

export function heapSort(arr: number[]) {
    // for (let i = 0; i < arr.length; i++) {
    //     insertHeap(arr, i);
    // }

    for (let i = arr.length - 1; i >= 0; i--) {
        heapify(arr, i, arr.length);
    }

    let heapSize = arr.length;
    while (heapSize > 1) {
        swap(arr, 0, heapSize - 1);
        heapify(arr, 0, --heapSize);
    }
}
