export class SingleLinkedList {
    val: any;
    next: SingleLinkedList | null;

    constructor(val: any, next?: SingleLinkedList | null) {
        this.val = val !== undefined ? val : null;
        this.next = next !== undefined ? next : null;
    }

    static from(arr: Array<any> = []): SingleLinkedList | null {
        const nodes = arr.map((val) => new SingleLinkedList(val));

        nodes.forEach((value, index, array) => {
            value.next = array[index + 1] || null;
        });

        return nodes[0] || null;
    }
}

export class DoubleLinkedList {
    val: any;
    next: DoubleLinkedList | null;
    prev: DoubleLinkedList | null;

    constructor(val: any, prev?: DoubleLinkedList | null, next?: DoubleLinkedList | null) {
        this.val = val !== undefined ? val : null;
        this.prev = prev !== undefined ? prev : null;
        this.next = next !== undefined ? next : null;
    }

    static from(arr: Array<any> = []): DoubleLinkedList {
        const nodes = arr.map((val) => new DoubleLinkedList(val));

        nodes.forEach((value, index, array) => {
            value.next = array[index + 1] || null;
            value.prev = array[index - 1] || null;
        });

        return nodes[0] || null;
    }
}

export function reverseSingleLinkedList(head: SingleLinkedList | null) {
    let prev = null;
    let current = head;

    while (current) {
        const next = current.next;

        current.next = prev;
        prev = current;

        current = next;
    }

    return prev;
}

export function reverseDoubleLinkedList(head: DoubleLinkedList | null) {
    let prev = null;
    let current = head;

    while (current) {
        const next = current.next;

        current.next = prev;
        current.prev = next;
        prev = current;

        current = next;
    }

    return prev;
}

export function deleteNum(head: SingleLinkedList | null, num: number): SingleLinkedList | null {
    let current = head;
    while (current?.val === num) {
        current = current.next;
    }
    const newHead = current;

    let prev: SingleLinkedList | null = null;
    while (current) {
        if (current.val === num) {
            //@ts-ignore
            prev?.next = current.next;
        } else {
            prev = current;
        }

        current = current.next;
    }

    return newHead;
}
