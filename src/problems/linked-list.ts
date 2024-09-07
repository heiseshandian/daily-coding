import {
    ListNode,
    SingleLinkedList,
    reverseSingleLinkedList,
} from '../algorithm/linked-list';
import { getClosestMaxArr } from '../algorithm/monotonous-stack';
import { TreeNode } from '../algorithm/tree';
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

export function copyRandomList(
    head: NodeWithRandom | null
): NodeWithRandom | null {
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
export function reverseBetween(
    head: SingleLinkedList | null,
    left: number,
    right: number
): SingleLinkedList | null {
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
export function rotateRight(
    head: SingleLinkedList | null,
    k: number
): SingleLinkedList | null {
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
export function sortList(
    head: SingleLinkedList | null
): SingleLinkedList | null {
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
export function sortList2(
    head: SingleLinkedList | null
): SingleLinkedList | null {
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

function merge(
    list1: SingleLinkedList | null,
    list2: SingleLinkedList | null
): SingleLinkedList | null {
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
export function oddEvenList(
    head: SingleLinkedList | null
): SingleLinkedList | null {
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
export function detectCycle(
    head: SingleLinkedList | null
): SingleLinkedList | null {
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

/* 
https://leetcode.com/problems/remove-duplicates-from-sorted-list-ii/description/

Given the head of a sorted linked list, delete all nodes that have duplicate numbers, 
leaving only distinct numbers from the original list. Return the linked list sorted as well.
*/
export function deleteDuplicates(
    head: SingleLinkedList | null
): SingleLinkedList | null {
    if (!head || !head.next) {
        return head;
    }

    const newHead = findFirstDistinctNode(head);
    if (!newHead) {
        return newHead;
    }

    let cur = newHead;
    let next = newHead.next;
    while (next) {
        const distinct = findFirstDistinctNode(next);
        cur.next = distinct;
        if (!distinct) {
            break;
        }

        cur = cur.next!;
        next = cur?.next;
    }

    return newHead;
}

function findFirstDistinctNode(
    node: SingleLinkedList | null
): SingleLinkedList | null {
    if (!node || !node.next) {
        return node;
    }

    let distinct = node;
    let next = distinct.next;
    // 如果当前节点与下一个节点不同则直接返回
    if (distinct.val !== next?.val) {
        return distinct;
    }

    while (next) {
        if (!distinct || distinct.val !== next?.val) {
            // 此处需要递归调用，因为下一个节点有可能是一堆相同节点的开头，也可能是一个独立的distinct节点
            return findFirstDistinctNode(next);
        }
        next = next.next;
    }
    return null;
}

// 更为简洁的代码实现
export function deleteDuplicates2(
    head: SingleLinkedList | null
): SingleLinkedList | null {
    if (!head || !head.next) {
        return head;
    }

    if (head.val === head.next?.val) {
        while (head?.val === head?.next?.val) {
            head = head?.next!;
        }

        return deleteDuplicates2(head.next);
    }

    head.next = deleteDuplicates2(head.next);
    return head;
}

/* 
https://leetcode.com/problems/reorder-list/

You are given the head of a singly linked-list. The list can be represented as:
L0 → L1 → … → Ln - 1 → Ln
Reorder the list to be on the following form:
L0 → Ln → L1 → Ln - 1 → L2 → Ln - 2 → …
You may not modify the values in the list's nodes. Only nodes themselves may be changed.
*/
export function reorderList(head: SingleLinkedList | null): void {
    if (!head || !head.next || !head.next.next) {
        return;
    }

    // 对于奇数个节点，slow指向中点，对于偶数个节点，slow指向上节点
    let slow = head;
    let fast = head;
    while (fast && fast.next && fast.next.next) {
        slow = slow.next!;
        fast = fast.next.next;
    }
    let secondHalf = slow.next;
    // 切断前后半部分
    slow.next = null;

    secondHalf = reverseSingleLinkedList(secondHalf);
    let cur = head;
    while (secondHalf) {
        const curNext = cur.next;
        const secondNext = secondHalf.next;
        cur.next = secondHalf;
        secondHalf.next = curNext;
        cur = curNext!;
        secondHalf = secondNext;
    }
}

/* 
https://leetcode.com/problems/remove-linked-list-elements/description/

Given the head of a linked list and an integer val, remove all the nodes 
of the linked list that has Node.val == val, and return the new head.
*/
export function removeElements(
    head: SingleLinkedList | null,
    val: number
): SingleLinkedList | null {
    if (!head) {
        return head;
    }

    // 找到新头部
    let cur: SingleLinkedList | null = head;
    while (cur && cur.val === val) {
        cur = cur.next;
    }
    const newHead = cur;
    if (!newHead || !newHead.next) {
        return newHead;
    }

    let prev = newHead;
    cur = newHead.next;
    while (cur) {
        if (cur.val === val) {
            prev.next = cur.next;
        } else {
            prev = cur;
        }

        cur = cur.next;
    }

    return newHead;
}

export function removeElements2(
    head: SingleLinkedList | null,
    val: number
): SingleLinkedList | null {
    const holder = new SingleLinkedList(-1, head);
    let cur = holder;
    while (cur && cur.next) {
        if (cur.next.val === val) {
            cur.next = cur.next.next;
        } else {
            cur = cur.next;
        }
    }

    return holder.next;
}

/* 
https://leetcode.com/problems/insertion-sort-list/description/

Given the head of a singly linked list, sort the list using insertion sort, and return the sorted list's head.

The steps of the insertion sort algorithm:

Insertion sort iterates, consuming one input element each repetition and growing a sorted output list.
At each iteration, insertion sort removes one element from the input data, finds the location it belongs within the sorted list and inserts it there.
It repeats until no input elements remain.
*/
export function insertionSortList(
    head: SingleLinkedList | null
): SingleLinkedList | null {
    if (!head || !head.next) {
        return head;
    }

    const placeholder = new SingleLinkedList(-Infinity);
    placeholder.next = head;

    let sortedStart: SingleLinkedList | null = placeholder;
    let sortedEnd: SingleLinkedList = head;
    let cur: SingleLinkedList | null = head.next;
    while (cur) {
        if (sortedEnd.val <= cur.val) {
            const next: SingleLinkedList | null = cur.next;
            sortedEnd.next = cur;
            sortedEnd = cur;
            cur = next;
        } else {
            sortedEnd.next = cur.next;
            sortedStart = placeholder;

            while (sortedStart?.next && sortedStart.next.val < cur.val) {
                sortedStart = sortedStart?.next;
            }
            const next = sortedStart.next;
            sortedStart.next = cur;
            cur.next = next;
            cur = sortedEnd.next;
        }
    }

    return placeholder.next;
}

/*
https://leetcode.com/problems/merge-in-between-linked-lists/description/
1669. Merge In Between Linked Lists
You are given two linked lists: list1 and list2 of sizes n and m respectively.

Remove list1's nodes from the ath node to the bth node, and put list2 in their place.

The blue edges and nodes in the following figure indicate the result:

Build the result list and return its head.

Example 1:

Input: list1 = [10,1,13,6,9,5], a = 3, b = 4, list2 = [1000000,1000001,1000002]
Output: [10,1,13,1000000,1000001,1000002,5]
Explanation: We remove the nodes 3 and 4 and put the entire list2 in their place. The blue edges and nodes in the above figure indicate the result.

Example 2:

Input: list1 = [0,1,2,3,4,5,6], a = 2, b = 5, list2 = [1000000,1000001,1000002,1000003,1000004]
Output: [0,1,1000000,1000001,1000002,1000003,1000004,6]
Explanation: The blue edges and nodes in the above figure indicate the result.

Constraints:

	3 <= list1.length <= 10^4
	1 <= a <= b < list1.length - 1
	1 <= list2.length <= 10^4
*/

export function mergeInBetween(
    list1: ListNode | null,
    a: number,
    b: number,
    list2: ListNode | null
): ListNode | null {
    let preA: ListNode | null = null;
    let i = 0;
    let cur = list1;
    while (i < a && cur) {
        preA = cur;
        cur = cur.next;
        i++;
    }
    i--;

    let nextB: ListNode | null = null;
    while (i < b && cur) {
        cur = cur.next;
        i++;
        nextB = cur;
    }

    let endB: ListNode | null = null;
    cur = list2;
    while (cur) {
        endB = cur;
        cur = cur.next;
    }

    preA!.next = list2;
    endB!.next = nextB;

    return list1;
}

/*
https://leetcode.com/problems/linked-list-cycle/description/?envType=daily-question&envId=2024-03-06
141. Linked List Cycle
Given head, the head of a linked list, determine if the linked list has a cycle in it.

There is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the next pointer. 
Internally, pos is used to denote the index of the node that tail's next pointer is connected to. Note that pos is not passed as a parameter.

Return true if there is a cycle in the linked list. Otherwise, return false.

Example 1:

Input: head = [3,2,0,-4], pos = 1
Output: true
Explanation: There is a cycle in the linked list, where the tail connects to the 1st node (0-indexed).

Example 2:

Input: head = [1,2], pos = 0
Output: true
Explanation: There is a cycle in the linked list, where the tail connects to the 0th node.

Example 3:

Input: head = [1], pos = -1
Output: false
Explanation: There is no cycle in the linked list.

Constraints:

	The number of the nodes in the list is in the range [0, 10^4].
	-10^5 <= Node.val <= 10^5
	pos is -1 or a valid index in the linked-list.

Follow up: Can you solve it using O(1) (i.e. constant) memory?
*/
export function hasCycle(head: ListNode | null): boolean {
    if (!head) {
        return false;
    }

    let slow: ListNode | null = head;
    let fast: ListNode | null | undefined = head.next;
    while (slow && fast) {
        if (fast === slow) {
            return true;
        }

        slow = slow.next;
        fast = fast.next?.next;
    }

    return false;
}

/*
https://leetcode.com/problems/middle-of-the-linked-list/description/
876. Middle of the Linked List
Given the head of a singly linked list, return the middle node of the linked list.

If there are two middle nodes, return the second middle node.

Example 1:

Input: head = [1,2,3,4,5]
Output: [3,4,5]
Explanation: The middle node of the list is node 3.

Example 2:

Input: head = [1,2,3,4,5,6]
Output: [4,5,6]
Explanation: Since the list has two middle nodes with values 3 and 4, we return the second one.

Constraints:

	The number of nodes in the list is in the range [1, 100].
	1 <= Node.val <= 100
*/
export function middleNode(head: ListNode | null): ListNode | null {
    let slow = head;
    let fast = head?.next;
    while (slow && fast) {
        slow = slow.next;
        fast = fast.next?.next;
    }

    return slow;
}

/*
https://leetcode.com/problems/remove-zero-sum-consecutive-nodes-from-linked-list/description/
1171. Remove Zero Sum Consecutive Nodes from Linked List
Given the head of a linked list, we repeatedly delete consecutive sequences of nodes that sum to 0 until there are no such sequences.

After doing so, return the head of the final linked list.  You may return any such answer.

(Note that in the examples below, all sequences are serializations of ListNode objects.)

Example 1:

Input: head = [1,2,-3,3,1]
Output: [3,1]
Note: The answer [1,2,1] would also be accepted.

Example 2:

Input: head = [1,2,3,-3,4]
Output: [1,2,4]

Example 3:

Input: head = [1,2,3,-3,-2]
Output: [1]

Constraints:

	The given linked list will contain between 1 and 1000 nodes.
	Each node in the linked list has -1000 <= node.val <= 1000.
*/
export function removeZeroSumSublists(head: ListNode | null): ListNode | null {
    if (!head) {
        return head;
    }

    const nums: number[] = [];
    let cur: ListNode | null = head;
    while (cur) {
        nums.push(cur.val);
        cur = cur.next;
    }

    const suffixSum: number[] = new Array(nums.length);
    suffixSum[nums.length - 1] = nums[nums.length - 1];
    for (let i = nums.length - 2; i >= 0; i--) {
        suffixSum[i] = suffixSum[i + 1] + nums[i];
    }

    for (let i = nums.length - 1; i >= 0; ) {
        let j = i;
        let mostLeft: number | null = null;
        const prev = i === nums.length - 1 ? 0 : suffixSum[i + 1];
        while (j >= 0) {
            if (suffixSum[j] - prev === 0) {
                mostLeft = j;
            }
            j--;
        }

        if (mostLeft === null) {
            i--;
        } else {
            nums.splice(mostLeft, i - mostLeft + 1);
            i = mostLeft - 1;
        }
    }

    const nodes = nums.map((v) => new ListNode(v));
    nodes.forEach((n, i) => {
        n.next = nodes[i + 1] || null;
    });

    return nodes[0] || null;
}

/*
https://leetcode.com/problems/remove-duplicates-from-sorted-list/description/?utm_source=LCUS&utm_medium=ip_redirect&utm_campaign=transfer2china
83. Remove Duplicates from Sorted List
Given the head of a sorted linked list, delete all duplicates such that each element appears only once. Return the linked list sorted as well.

Example 1:

Input: head = [1,1,2]
Output: [1,2]

Example 2:

Input: head = [1,1,2,3,3]
Output: [1,2,3]

Constraints:

	The number of nodes in the list is in the range [0, 300].
	-100 <= Node.val <= 100
	The list is guaranteed to be sorted in ascending order.
*/
export function deleteDuplicates3(head: ListNode | null): ListNode | null {
    const set = new Set<number>();
    let cur = head;
    while (cur) {
        set.add(cur.val);
        cur = cur.next;
    }

    const nodes = Array.from(set).map((v) => new ListNode(v));
    nodes.forEach((n, i) => {
        n.next = nodes[i + 1] ?? null;
    });

    return nodes[0] ?? null;
}

/*
https://leetcode.com/problems/remove-nodes-from-linked-list/description/
2487. Remove Nodes From Linked List
You are given the head of a linked list.

Remove every node which has a node with a greater value anywhere to the right side of it.

Return the head of the modified linked list.

Example 1:

Input: head = [5,2,13,3,8]
Output: [13,8]
Explanation: The nodes that should be removed are 5, 2 and 3.
- Node 13 is to the right of node 5.
- Node 13 is to the right of node 2.
- Node 8 is to the right of node 3.

Example 2:

Input: head = [1,1,1,1]
Output: [1,1,1,1]
Explanation: Every node has value 1, so no nodes are removed.

Constraints:

	The number of the nodes in the given list is in the range [1, 10^5].
	1 <= Node.val <= 10^5

TODO:暴力解法，需用其他方式优化下性能
*/
export function removeNodes(head: ListNode | null): ListNode | null {
    if (!head) {
        return head;
    }

    const nodeVals: number[] = [];
    let cur: ListNode | null = head;
    while (cur) {
        nodeVals.push(cur.val);
        cur = cur.next;
    }

    const closestMax = getClosestMaxArr(nodeVals);
    const filteredNodeVals = nodeVals
        .map((val, i) => [closestMax[i][1], val])
        .filter(([biggerIndex]) => biggerIndex === undefined)
        .map(([, val]) => val);

    const nodes = filteredNodeVals.map((val) => new ListNode(val));
    nodes.forEach((n, i) => {
        n.next = nodes[i + 1] ?? null;
    });
    return nodes[0] ?? null;
}

/*
https://leetcode.com/problems/double-a-number-represented-as-a-linked-list/description/
2816. Double a Number Represented as a Linked List
You are given the head of a non-empty linked list representing a non-negative integer without leading zeroes.

Return the head of the linked list after doubling it.

Example 1:

Input: head = [1,8,9]
Output: [3,7,8]
Explanation: The figure above corresponds to the given linked list which represents the number 189. Hence, the returned linked list represents the number 189 * 2 = 378.

Example 2:

Input: head = [9,9,9]
Output: [1,9,9,8]
Explanation: The figure above corresponds to the given linked list which represents the number 999. Hence, the returned linked list reprersents the number 999 * 2 = 1998. 

Constraints:

	The number of nodes in the list is in the range [1, 10^4]
	0 <= Node.val <= 9
	The input is generated such that the list represents a number that does not have leading zeros, except the number 0 itself.
*/
export function doubleIt(head: ListNode): ListNode {
    const tail = reverse(head);

    let cur: ListNode | null = tail;
    let carry = 0;
    let tmp = 0;
    while (cur) {
        tmp = cur.val * 2 + carry;
        cur.val = tmp % 10;
        carry = Math.floor(tmp / 10);

        if (!cur.next && carry) {
            cur.next = new ListNode(carry);
            break;
        }

        cur = cur.next;
    }

    return reverse(tail);
}

function reverse(head: ListNode): ListNode {
    let prev: ListNode | null = null;
    let cur: ListNode | null = head;
    while (cur) {
        const next = cur.next;
        cur.next = prev;
        prev = cur;
        cur = next;
    }

    return prev!;
}

/*
https://leetcode.com/problems/merge-nodes-in-between-zeros/description/
2181. Merge Nodes in Between Zeros
You are given the head of a linked list, which contains a series of integers separated by 0's. The beginning and end of the linked list will have Node.val == 0.

For every two consecutive 0's, merge all the nodes lying in between them into a single node whose value is the sum of all the merged nodes. The modified list should not contain any 0's.

Return the head of the modified linked list.

Example 1:

Input: head = [0,3,1,0,4,5,2,0]
Output: [4,11]
Explanation: 
The above figure represents the given linked list. The modified list contains
- The sum of the nodes marked in green: 3 + 1 = 4.
- The sum of the nodes marked in red: 4 + 5 + 2 = 11.

Example 2:

Input: head = [0,1,0,3,0,2,2,0]
Output: [1,3,4]
Explanation: 
The above figure represents the given linked list. The modified list contains
- The sum of the nodes marked in green: 1 = 1.
- The sum of the nodes marked in red: 3 = 3.
- The sum of the nodes marked in yellow: 2 + 2 = 4.

Constraints:

	The number of nodes in the list is in the range [3, 2 * 10^5].
	0 <= Node.val <= 1000
	There are no two consecutive nodes with Node.val == 0.
	The beginning and end of the linked list have Node.val == 0.
*/
export function mergeNodes(head: ListNode): ListNode {
    const newHead = head.next!;

    let left: ListNode = head.next!;
    let sum = 0;
    let cur: ListNode | null = left;
    while (cur) {
        if (cur.val !== 0) {
            sum += cur.val;
            cur = cur.next;
        } else {
            left.val = sum;
            left.next = cur.next;
            sum = 0;
            cur = cur.next;
            left = cur!;
        }
    }

    return newHead;
}

/*
https://leetcode.com/problems/find-the-minimum-and-maximum-number-of-nodes-between-critical-points/description/
2058. Find the Minimum and Maximum Number of Nodes Between Critical Points
A critical point in a linked list is defined as either a local maxima or a local minima.

A node is a local maxima if the current node has a value strictly greater than the previous node and the next node.

A node is a local minima if the current node has a value strictly smaller than the previous node and the next node.

Note that a node can only be a local maxima/minima if there exists both a previous node and a next node.

Given a linked list head, return an array of length 2 containing [minDistance, maxDistance] where minDistance is the minimum distance between any two distinct critical points and maxDistance is the maximum distance between any two distinct critical points. If there are fewer than two critical points, return [-1, -1].

Example 1:

Input: head = [3,1]
Output: [-1,-1]
Explanation: There are no critical points in [3,1].

Example 2:

Input: head = [5,3,1,2,5,1,2]
Output: [1,3]
Explanation: There are three critical points:
- [5,3,1,2,5,1,2]: The third node is a local minima because 1 is less than 3 and 2.
- [5,3,1,2,5,1,2]: The fifth node is a local maxima because 5 is greater than 2 and 1.
- [5,3,1,2,5,1,2]: The sixth node is a local minima because 1 is less than 5 and 2.
The minimum distance is between the fifth and the sixth node. minDistance = 6 - 5 = 1.
The maximum distance is between the third and the sixth node. maxDistance = 6 - 3 = 3.

Example 3:

Input: head = [1,3,2,2,3,2,2,2,7]
Output: [3,3]
Explanation: There are two critical points:
- [1,3,2,2,3,2,2,2,7]: The second node is a local maxima because 3 is greater than 1 and 2.
- [1,3,2,2,3,2,2,2,7]: The fifth node is a local maxima because 3 is greater than 2 and 2.
Both the minimum and maximum distances are between the second and the fifth node.
Thus, minDistance and maxDistance is 5 - 2 = 3.
Note that the last node is not considered a local maxima because it does not have a next node.

Constraints:

	The number of nodes in the list is in the range [2, 10^5].
	1 <= Node.val <= 10^5
*/
export function nodesBetweenCriticalPoints(head: ListNode): number[] {
    let prev = head;
    let cur = head.next!;
    let next = cur.next;
    if (!next) {
        return [-1, -1];
    }

    const points: number[] = [];
    let i = 0;
    while (next) {
        if (
            (cur.val > prev.val && cur.val > next.val) ||
            (cur.val < prev.val && cur.val < next.val)
        ) {
            points.push(i);
        }

        prev = cur;
        cur = next;
        next = next.next;
        i++;
    }

    if (points.length < 2) {
        return [-1, -1];
    }

    let min = Infinity;
    const n = points.length;
    for (let i = 1; i < n; i++) {
        min = Math.min(min, points[i] - points[i - 1]);
    }
    return [min, points[n - 1] - points[0]];
}

/*
https://leetcode.com/problems/delete-nodes-from-linked-list-present-in-array/description/?envType=daily-question&envId=2024-09-06
3217. Delete Nodes From Linked List Present in Array
You are given an array of integers nums and the head of a linked list. Return the head of the modified linked list after removing all nodes from the linked list that have a value that exists in nums.

Example 1:

Input: nums = [1,2,3], head = [1,2,3,4,5]

Output: [4,5]

Explanation:

Remove the nodes with values 1, 2, and 3.

Example 2:

Input: nums = [1], head = [1,2,1,2,1,2]

Output: [2,2,2]

Explanation:

Remove the nodes with value 1.

Example 3:

Input: nums = [5], head = [1,2,3,4]

Output: [1,2,3,4]

Explanation:

No node has value 5.

Constraints:

	1 <= nums.length <= 10^5
	1 <= nums[i] <= 10^5
	All elements in nums are unique.
	The number of nodes in the given list is in the range [1, 10^5].
	1 <= Node.val <= 10^5
	The input is generated such that there is at least one node in the linked list that has a value not present in nums.
*/
export function modifiedList(
    nums: number[],
    head: ListNode | null
): ListNode | null {
    const toDelete = new Set(nums);
    let cur: ListNode | null | undefined = head;
    while (toDelete.has(cur?.val)) {
        cur = cur?.next;
    }
    if (!cur) {
        return null;
    }

    const newHead = cur;
    let prev = cur;
    while (cur) {
        if (toDelete.has(cur.val)) {
            prev.next = cur.next;
        } else {
            prev = cur;
        }

        cur = cur.next;
    }

    return newHead;
}

/*
https://leetcode.com/problems/linked-list-in-binary-tree/description/
1367. Linked List in Binary Tree
Given a binary tree root and a linked list with head as the first node. 

Return True if all the elements in the linked list starting from the head correspond to some downward path connected in the binary tree otherwise return False.

In this context downward path means a path that starts at some node and goes downwards.

Example 1:

Input: head = [4,2,8], root = [1,4,4,null,2,2,null,1,null,6,8,null,null,null,null,1,3]
Output: true
Explanation: Nodes in blue form a subpath in the binary Tree.  

Example 2:

Input: head = [1,4,2,6], root = [1,4,4,null,2,2,null,1,null,6,8,null,null,null,null,1,3]
Output: true

Example 3:

Input: head = [1,4,2,6,8], root = [1,4,4,null,2,2,null,1,null,6,8,null,null,null,null,1,3]
Output: false
Explanation: There is no path in the binary tree that contains all the elements of the linked list from head.

Constraints:

	The number of nodes in the tree will be in the range [1, 2500].
	The number of nodes in the list will be in the range [1, 100].
	1 <= Node.val <= 100 for each node in the linked list and binary tree.
*/
export function isSubPath(
    head: ListNode | null,
    root: TreeNode | null
): boolean {
    if (!root) {
        return false;
    }

    return (
        isSubPathDfs(root, head) ||
        isSubPath(head, root.left) ||
        isSubPath(head, root.right)
    );
}

function isSubPathDfs(root: TreeNode | null, head: ListNode | null): boolean {
    if (!head) {
        return true;
    }
    if (!root) {
        return false;
    }

    if (root.val === head.val) {
        return (
            isSubPathDfs(root.left, head.next) ||
            isSubPathDfs(root.right, head.next)
        );
    }

    return false;
}
