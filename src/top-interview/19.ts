import { SingleLinkedList } from '../algorithm/linked-list';

export function removeNthFromEnd(head: SingleLinkedList | null, n: number): SingleLinkedList | null {
    if (!head) {
        return head;
    }

    let cur: SingleLinkedList | null = head;
    let count = 0;
    while (cur) {
        count++;
        cur = cur.next;
    }

    let start = count - n + 1;
    if (start < 1 || start > count) {
        return head;
    }
    if (start === 1) {
        return head.next;
    }
    if (start === count) {
        let i = 1;
        cur = head;
        while (i < count - 1) {
            cur = cur!.next;
            i++;
        }
        cur!.next = null;
    }

    let i = 1;
    cur = head;
    while (i < start - 1) {
        cur = cur!.next;
        i++;
    }
    const next = cur?.next?.next;
    if (cur) {
        cur.next = next || null;
    }

    return head;
}
