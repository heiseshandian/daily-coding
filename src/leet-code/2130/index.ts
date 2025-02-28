export class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val?: number, next?: ListNode | null) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
  }
}

/*
 * 1. 采用双指针法先找到中间位置
 * 2. 将后一半节点反转并返回反转后的节点
 * 3. 从头到尾遍历两个节点找出最大值
 * */
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
