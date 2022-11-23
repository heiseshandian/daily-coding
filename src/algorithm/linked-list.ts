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
    let next = null;

    while (head) {
        next = head.next;
        head.next = prev;
        prev = head;
        head = next;
    }

    return prev;
}

export function reverseDoubleLinkedList(head: DoubleLinkedList | null) {
    let prev = null;
    let next = null;

    while (head) {
        next = head.next;
        head.next = prev;
        head.prev = next;
        prev = head;
        head = next;
    }

    return prev;
}

export function deleteNum(head: SingleLinkedList | null, num: number): SingleLinkedList | null {
    while (head?.val === num) {
        head = head.next;
    }

    const newHead = head;
    let prev = head;
    while (head) {
        if (head.val === num) {
            //@ts-ignore
            prev.next = head.next;
        } else {
            prev = head;
        }

        head = head.next;
    }

    return newHead;
}
