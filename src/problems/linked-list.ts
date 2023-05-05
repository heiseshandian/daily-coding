import { SingleLinkedList } from '../algorithm/linked-list';
//https://leetcode.com/problems/copy-list-with-random-pointer/
// 深度copy如下带有random指针的节点
export class NodeWithRandom {
    val: number;
    next: NodeWithRandom | null;
    random: NodeWithRandom | null;
    constructor(val?: number, next?: NodeWithRandom, random?: NodeWithRandom) {
        this.val = val === undefined ? 0 : val;
        this.next = next === undefined ? null : next;
        this.random = random === undefined ? null : random;
    }
}

export function copyRandomList(head: NodeWithRandom | null): NodeWithRandom | null {
    if (!head) {
        return head;
    }

    // 创建copy节点
    let cur: NodeWithRandom | null = head;
    while (cur) {
        const next: NodeWithRandom | null = cur.next;
        const copy = new NodeWithRandom(cur.val);
        copy.next = next;

        cur.next = copy;
        cur = next;
    }

    // 连接random指针
    cur = head;
    while (cur && cur.next) {
        const copy = cur.next;
        if (cur.random) {
            copy.random = cur.random.next;
        }

        cur = cur.next.next;
    }

    // 把copy节点分离出来
    cur = head;
    const copyHead = cur.next;
    while (cur && cur.next) {
        const next: NodeWithRandom | null = cur.next.next;
        if (!next) {
            cur.next = null;
            break;
        }

        const copy = cur.next;
        const nextCopy = next.next || null;
        copy.next = nextCopy;

        cur.next = next;
        cur = next;
    }

    return copyHead;
}

/* 
Given the head of a singly linked list and two integers left and right where left <= right, 
reverse the nodes of the list from position left to position right, and return the reversed list.
*/
export function reverseBetween(head: SingleLinkedList | null, left: number, right: number): SingleLinkedList | null {
    if (left === right) {
        return head;
    }

    let prevLeft: SingleLinkedList | null = null;
    let afterRight: SingleLinkedList | null = null;

    let count = 1;
    let cur = head;
    while (count < left && cur) {
        prevLeft = cur;
        cur = cur.next;
        count++;
    }
    const leftNode = cur;

    let prev: SingleLinkedList | null = null;
    while (count <= right && cur) {
        const next = cur.next;
        cur.next = prev;
        prev = cur;
        cur = next;

        afterRight = next;
        count++;
    }

    if (prevLeft) {
        prevLeft.next = prev;
        leftNode!.next = afterRight;
        return head;
    } else {
        leftNode!.next = afterRight;
        return prev;
    }
}

/* 
https://leetcode.com/problems/rotate-list/description/
Given the head of a linked list, rotate the list to the right by k places.

Input: head = [1,2,3,4,5], k = 2
Output: [4,5,1,2,3]

单链表旋转
*/
export function rotateRight(head: SingleLinkedList | null, k: number): SingleLinkedList | null {
    if (!head) {
        return head;
    }

    let count = 0;
    let cur: SingleLinkedList | null = head;
    let tail = cur;
    while (cur) {
        count++;
        tail = cur;
        cur = cur.next;
    }

    k = k % count;

    if (k === 0) {
        return head;
    }

    // 找到倒数第k个节点，也就是count-k个节点
    cur = head;
    // 这里num是从1开始，不是从0开始，因为当前节点已经算一个节点
    let num = 1;
    while (cur && num <= count - k) {
        num++;
        cur = cur.next;
    }

    const newHead = cur;
    cur = head;
    while (cur !== newHead) {
        tail.next = cur;
        tail = cur!;
        cur = cur!.next;
    }
    tail.next = null;

    return newHead;
}

/* 
https://leetcode.com/problems/sort-list/description/

Given the head of a linked list, return the list after sorting it in ascending order.
链表排序
*/
// 时间复杂度O(nlogn) 空间复杂度O(n)
export function sortList(head: SingleLinkedList | null): SingleLinkedList | null {
    if (!head) {
        return head;
    }

    let cur: SingleLinkedList | null = head;
    const nodes: SingleLinkedList[] = [];
    while (cur) {
        nodes.push(cur);
        cur = cur.next;
    }

    nodes.sort((a, b) => a.val - b.val);

    const newHead = nodes[0];

    nodes.reduce((prev, next) => {
        prev.next = next;
        return next;
    });
    nodes[nodes.length - 1].next = null;

    return newHead;
}

// 时间复杂度O(nlogn) 空间复杂度O(1)
export function sortList2(head: SingleLinkedList | null): SingleLinkedList | null {
    if (!head || !head.next) {
        return head;
    }

    const secondHalf = splitListInHalf(head);
    const [left, right] = [sortList2(head), sortList2(secondHalf)];
    return merge(left, right);
}

function splitListInHalf(head: SingleLinkedList) {
    let slow: SingleLinkedList = head;
    let fast: SingleLinkedList | null = head;
    let prev: SingleLinkedList | null = null;
    while (fast && fast.next) {
        prev = slow;
        slow = slow.next!;
        fast = fast.next.next;
    }

    // 将前后两部分断连
    if (prev) {
        prev.next = null;
    }

    return slow;
}

function merge(list1: SingleLinkedList | null, list2: SingleLinkedList | null): SingleLinkedList | null {
    const newHead = new SingleLinkedList(undefined);

    let cur = newHead;
    while (list1 && list2) {
        if (list1.val <= list2.val) {
            cur.next = list1;
            list1 = list1.next;
        } else {
            cur.next = list2;
            list2 = list2.next;
        }
        cur = cur.next;
    }
    cur.next = list1 || list2;

    return newHead.next;
}

/* 
https://leetcode.com/problems/odd-even-linked-list/
Given the head of a singly linked list, group all the nodes with odd indices together followed 
by the nodes with even indices, and return the reordered list.

The first node is considered odd, and the second node is even, and so on.

Note that the relative order inside both the even and odd groups should remain as it was in the input.

You must solve the problem in O(1) extra space complexity and O(n) time complexity.
*/
export function oddEvenList(head: SingleLinkedList | null): SingleLinkedList | null {
    if (!head) {
        return head;
    }

    const evenHead = head.next;
    let odd = head;
    let even = evenHead;
    while (odd && even?.next) {
        odd.next = even.next;
        odd = odd.next;

        even.next = even.next.next;
        even = even.next;
    }
    odd.next = evenHead;

    return head;
}

/* 
https://leetcode.com/problems/linked-list-cycle-ii/description/

Given the head of a linked list, return the node where the cycle begins. If there is no cycle, return null.

There is a cycle in a linked list if there is some node in the list that can be reached again by continuously 
following the next pointer. Internally, pos is used to denote the index of the node that tail's next pointer 
is connected to (0-indexed). It is -1 if there is no cycle. Note that pos is not passed as a parameter.

Do not modify the linked list.
*/
export function detectCycle(head: SingleLinkedList | null): SingleLinkedList | null {
    if (!head || !head.next) {
        return null;
    }

    let slow: SingleLinkedList | null | undefined = head.next;
    let fast: SingleLinkedList | null | undefined = head.next?.next;
    while (fast && slow !== fast) {
        slow = slow?.next;
        fast = fast.next?.next;
    }

    // 此处不能直接用fast===null，因为经过上面的?.运算符fast的结果有可能是undefined
    if (!fast) {
        return null;
    }

    fast = head;
    while (fast !== slow) {
        slow = slow!.next;
        fast = fast!.next;
    }

    return fast;
}
