export class ListNode {
    val: number;
    next: ListNode | null;
    constructor(val?: number, next?: ListNode | null) {
        this.val = val === undefined ? 0 : val;
        this.next = next === undefined ? null : next;
    }
}

export function pairSum(head: ListNode | null): number {
    let middle = reverseSingleLinkedList(findMiddleNode(head));
    // @ts-ignore
    let maxCount = head?.val + middle.val;
    while (middle) {
        // @ts-ignore
        const count = middle.val + head.val;
        if (maxCount < count) {
            maxCount = count;
        }

        middle = middle.next;
        // @ts-ignore
        head = head.next;
    }

    return maxCount;
}

function findMiddleNode(head: ListNode | null) {
    let slow: ListNode | null | undefined = head;
    let fast = head?.next;

    while (fast) {
        slow = slow?.next;
        fast = fast.next?.next;
    }

    return slow;
}

export function reverseSingleLinkedList(head: ListNode | null | undefined) {
    let prev = null;
    let current = head;

    while (current) {
        const next = current.next;
        current.next = prev;
        prev = current;
        //@ts-ignore
        current = next;
    }

    return prev;
}
