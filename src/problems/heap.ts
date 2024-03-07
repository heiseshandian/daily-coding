import { GenericHeap } from '../algorithm/generic-heap';

/*
https://leetcode.com/problems/equal-sum-arrays-with-minimum-number-of-operations/description/
1775. Equal Sum Arrays With Minimum Number of Operationscopy contentgpt prompt
You are given two arrays of integers nums1 and nums2, possibly of different lengths. The values in the arrays are between 1 and 6, inclusive.

In one operation, you can change any integer's value in any of the arrays to any value between 1 and 6, inclusive.

Return the minimum number of operations required to make the sum of values in nums1 equal to the sum of values in nums2. Return -1​​​​​ if it is not possible to make the sum of the two arrays equal.

Example 1:

Input: nums1 = [1,2,3,4,5,6], nums2 = [1,1,2,2,2,2]
Output: 3
Explanation: You can make the sums of nums1 and nums2 equal with 3 operations. All indices are 0-indexed.
- Change nums2[0] to 6. nums1 = [1,2,3,4,5,6], nums2 = [6,1,2,2,2,2].
- Change nums1[5] to 1. nums1 = [1,2,3,4,5,1], nums2 = [6,1,2,2,2,2].
- Change nums1[2] to 2. nums1 = [1,2,2,4,5,1], nums2 = [6,1,2,2,2,2].

Example 2:

Input: nums1 = [1,1,1,1,1,1,1], nums2 = [6]
Output: -1
Explanation: There is no way to decrease the sum of nums1 or to increase the sum of nums2 to make them equal.

Example 3:

Input: nums1 = [6,6], nums2 = [1]
Output: 3
Explanation: You can make the sums of nums1 and nums2 equal with 3 operations. All indices are 0-indexed. 
- Change nums1[0] to 2. nums1 = [2,6], nums2 = [1].
- Change nums1[1] to 2. nums1 = [2,2], nums2 = [1].
- Change nums2[0] to 4. nums1 = [2,2], nums2 = [4].

Constraints:

	1 <= nums1.length, nums2.length <= 10^5
	1 <= nums1[i], nums2[i] <= 6

- Let's note that we want to either decrease the sum of the array with a larger sum or increase the array's sum with the smaller sum.
- You can maintain the largest increase or decrease you can make in a binary search tree and each time get the maximum one.
*/
export function minOperations(nums1: number[], nums2: number[]): number {
    const minLen = Math.min(nums1.length, nums2.length);
    const maxLen = Math.max(nums1.length, nums2.length);
    if (maxLen > minLen * 6) {
        return -1;
    }

    const sum1 = nums1.reduce((acc, cur) => acc + cur);
    const sum2 = nums2.reduce((acc, cur) => acc + cur);
    let diff = Math.abs(sum1 - sum2);
    if (diff === 0) {
        return 0;
    }

    const bigger = sum1 > sum2 ? nums1 : nums2;
    const smaller = bigger === nums1 ? nums2 : nums1;
    const biggerHeap = new GenericHeap((a, b) => b - a);
    const smallerHeap = new GenericHeap((a, b) => b - a);

    bigger.forEach((v) => {
        if (v > 1) {
            biggerHeap.push(v - 1);
        }
    });
    smaller.forEach((v) => {
        if (v < 6) {
            smallerHeap.push(6 - v);
        }
    });

    let count = 0;
    while (diff > 0 && biggerHeap.size() > 0 && smallerHeap.size() > 0) {
        const b = biggerHeap.peek();
        const s = smallerHeap.peek();

        if (b > s) {
            diff -= b;
            biggerHeap.pop();
        } else {
            diff -= s;
            smallerHeap.pop();
        }
        count++;
    }

    while (diff > 0 && biggerHeap.size() > 0) {
        diff -= biggerHeap.pop();
        count++;
    }
    while (diff > 0 && smallerHeap.size() > 0) {
        diff -= smallerHeap.pop();
        count++;
    }

    return count;
}

/*
https://leetcode.com/problems/task-scheduler/description/
621. Task Scheduler
You are given an array of CPU tasks, each represented by letters A to Z, and a cooling time, n. Each cycle or interval allows the completion of one task. Tasks can be completed in any order, but there's a constraint: identical tasks must be separated by at least n intervals due to cooling time.

​Return the minimum number of intervals required to complete all tasks.

Example 1:

Input: tasks = ["A","A","A","B","B","B"], n = 2

Output: 8

Explanation: A possible sequence is: A -> B -> idle -> A -> B -> idle -> A -> B.

After completing task A, you must wait two cycles before doing A again. The same applies to task B. In the 3rd interval, neither A nor B can be done, so you idle. By the 4th cycle, you can do A again as 2 intervals have passed.

Example 2:

Input: tasks = ["A","C","A","B","D","B"], n = 1

Output: 6

Explanation: A possible sequence is: A -> B -> C -> D -> A -> B.

With a cooling interval of 1, you can repeat a task after just one other task.

Example 3:

Input: tasks = ["A","A","A", "B","B","B"], n = 3

Output: 10

Explanation: A possible sequence is: A -> B -> idle -> idle -> A -> B -> idle -> idle -> A -> B.

There are only two types of tasks, A and B, which need to be separated by 3 intervals. This leads to idling twice between repetitions of these tasks.

Constraints:

	1 <= tasks.length <= 10^4
	tasks[i] is an uppercase English letter.
	0 <= n <= 100
*/
export function leastInterval(tasks: string[], n: number): number {
    const map: Record<number, number> = {};
    tasks.forEach((v) => {
        map[v] = (map[v] || 0) + 1;
    });

    const heap = new GenericHeap((a, b) => b - a);
    heap.initHeap(Object.values(map));

    let count = 0;
    let cycle = n + 1;
    while (heap.size() > 0) {
        cycle = n + 1;
        const remainingTasks: number[] = [];
        while (cycle && heap.size() > 0) {
            const peek = heap.pop();
            if (peek - 1 > 0) {
                remainingTasks.push(peek - 1);
            }

            cycle--;
            count++;
        }

        remainingTasks.forEach((t) => {
            heap.push(t);
        });

        if (cycle > 0) {
            count += cycle;
        }
    }
    if (cycle > 0) {
        count -= cycle;
    }

    return count;
}
