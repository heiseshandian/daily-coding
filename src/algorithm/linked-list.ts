export class SingleLinkedList {
    val: any;
    next: SingleLinkedList | null;

    constructor(val: any, next?: SingleLinkedList | null) {
        this.val = val !== undefined ? val : null;
        this.next = next !== undefined ? next : null;
    }

    static from(arr: Array<any> = []): SingleLinkedList | null {
        const nodes = arr.map((val) => new SingleLinkedList(val));

        nodes.forEach((node, index) => {
            node.next = nodes[index + 1] || null;
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

        nodes.forEach((node, index) => {
            node.next = nodes[index + 1] || null;
            node.prev = nodes[index - 1] || null;
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

// 奇数长度返回中点，偶数长度返回上中点（偶数有两个中点，这里我们仅返回上中点）
export function getMiddleNode(head: SingleLinkedList | null) {
    if (head === null || head.next === null || head.next.next === null) {
        return head;
    }

    let slow = head;
    let fast = head;
    while (fast.next && fast.next.next) {
        // @ts-ignore
        slow = slow.next;
        fast = fast.next.next;
    }

    return slow;
}

// 奇数长度返回中点，偶数长度返回下中点（偶数有两个中点，这里我们仅返回下中点）
export function getMiddleNode2(head: SingleLinkedList | null) {
    if (head === null || head.next === null) {
        return head;
    }

    let slow = head;
    let fast = head.next;
    while (fast) {
        // @ts-ignore
        slow = slow.next;
        // @ts-ignore
        fast = fast.next?.next;
    }

    return slow;
}

// 奇数长度返回中点前一个节点，偶数长度返回上中点前一个节点
export function getMiddleNode3(head: SingleLinkedList | null) {
    if (head === null || head.next === null || head.next.next === null) {
        return null;
    }

    let slow = head;
    let fast = head.next.next;
    while (fast && fast.next && fast.next.next) {
        // @ts-ignore
        slow = slow.next;
        fast = fast.next.next;
    }

    return slow;
}

// 奇数长度返回中点前一个节点，偶数长度返回上中点
export function getMiddleNode4(head: SingleLinkedList | null) {
    if (head === null || head.next === null) {
        return null;
    }

    let slow = head;
    let fast = head.next;
    while (fast && fast.next && fast.next.next) {
        // @ts-ignore
        slow = slow.next;
        fast = fast.next.next;
    }

    return slow;
}

// 判断单链表是否回文
export function isPalindrome(head: SingleLinkedList | null) {
    if (head === null || head.next === null) {
        return true;
    }

    const middle = getMiddleNode2(head);
    const originalTail = reverseSingleLinkedList(middle);

    let result = true;
    let tail = originalTail;
    while (head && tail) {
        if (head.val !== tail.val) {
            result = false;
            break;
        }

        head = head.next;
        tail = tail.next;
    }

    reverseSingleLinkedList(originalTail);

    return result;
}

/* 
根据给定的值将链表分成三部分，左边大于p，中间等于p，右边大于p
例：
input:[1,5,4,3,2,3,1] p=3
output:[1,2,1,3,3,5,4]
注：给定的p值有可能在链表中不存在
*/
export function partition(head: SingleLinkedList | null, p: number) {
    let [lessHead, lessTail]: [SingleLinkedList | null, SingleLinkedList | null] = [null, null];
    let [equalHead, equalTail]: [SingleLinkedList | null, SingleLinkedList | null] = [null, null];
    let [moreHead, moreTail]: [SingleLinkedList | null, SingleLinkedList | null] = [null, null];

    if (head === null) {
        return head;
    }

    let current = head;
    while (current) {
        if (current.val < p) {
            if (!lessHead) {
                lessHead = current;
                lessTail = current;
            } else {
                lessTail!.next = current;
                lessTail = current;
            }
        } else if (current.val === p) {
            if (!equalHead) {
                equalHead = current;
                equalTail = current;
            } else {
                equalTail!.next = current;
                equalTail = current;
            }
        } else {
            if (!moreHead) {
                moreHead = current;
                moreTail = current;
            } else {
                moreTail!.next = current;
                moreTail = current;
            }
        }

        // @ts-ignore
        current = current.next;
    }

    if (lessTail) {
        lessTail.next = equalHead;
        equalTail = equalTail || lessTail;
    }
    if (equalTail) {
        equalTail.next = moreHead;
    }

    if (moreTail) {
        moreTail.next = null;
    }
    return lessHead ? lessHead : equalHead ? equalHead : moreHead;
}

// 实现一个函数来深度copy SpecialNode
export class SpecialNode {
    val: number;
    next: SpecialNode | null = null;
    random: SpecialNode | null = null;

    constructor(val: number) {
        this.val = val;
    }
}

export function deepCloneSpecialNodeList(head: SpecialNode | null) {
    if (!head) {
        return head;
    }

    // 先遍历复制节点，并把复制出来的节点放在原先节点的后一个节点上
    // 1 > 2 > 3 变成 1 > 1' > 2 > 2' > 3 > 3' ('表示复制出来的节点)
    let cur = head;
    while (cur) {
        const next = cur.next;
        const clone = new SpecialNode(cur.val);
        cur.next = clone;
        clone.next = next;
        // @ts-ignore
        cur = next;
    }

    // 建立复制节点的random指针
    cur = head;
    while (cur) {
        const next = cur.next!.next;
        const clone = cur.next;
        // @ts-ignore
        clone!.random = cur.random?.next;
        // @ts-ignore
        cur = next;
    }

    const cloneHead = head.next;

    // 分离原始节点与clone节点
    cur = head;
    while (cur) {
        const next = cur.next?.next;
        // @ts-ignore
        cur.next.next = next?.next;
        // @ts-ignore
        cur.next = next;
        // @ts-ignore
        cur = next;
    }

    return cloneHead;
}
