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

/*
https://leetcode.com/problems/remove-stones-to-minimize-the-total/description/
1962. Remove Stones to Minimize the Total
You are given a 0-indexed integer array piles, where piles[i] represents the number of stones in the ith pile, 
and an integer k. You should apply the following operation exactly k times:

	Choose any piles[i] and remove floor(piles[i] / 2) stones from it.

Notice that you can apply the operation on the same pile more than once.

Return the minimum possible total number of stones remaining after applying the k operations.

floor(x) is the greatest integer that is smaller than or equal to x (i.e., rounds x down).

Example 1:

Input: piles = [5,4,9], k = 2
Output: 12
Explanation: Steps of a possible scenario are:
- Apply the operation on pile 2. The resulting piles are [5,4,5].
- Apply the operation on pile 0. The resulting piles are [3,4,5].
The total number of stones in [3,4,5] is 12.

Example 2:

Input: piles = [4,3,6,7], k = 3
Output: 12
Explanation: Steps of a possible scenario are:
- Apply the operation on pile 2. The resulting piles are [4,3,3,7].
- Apply the operation on pile 3. The resulting piles are [4,3,3,4].
- Apply the operation on pile 0. The resulting piles are [2,3,3,4].
The total number of stones in [2,3,3,4] is 12.

Constraints:

	1 <= piles.length <= 10^5
	1 <= piles[i] <= 10^4
	1 <= k <= 10^5
*/
export function minStoneSum(piles: number[], k: number): number {
    const maxHeap = new GenericHeap((a, b) => b - a);
    maxHeap.initHeap(piles);

    while (k > 0 && maxHeap.size() > 0) {
        const half = Math.ceil(maxHeap.pop() / 2);
        if (half > 0) {
            maxHeap.push(half);
        }

        k--;
    }

    return maxHeap.container.reduce((acc, cur) => acc + cur);
}

/*
https://leetcode.com/problems/distant-barcodes/description/?envType=list&envId=o5cftq05
1054. Distant Barcodes
In a warehouse, there is a row of barcodes, where the ith barcode is barcodes[i].

Rearrange the barcodes so that no two adjacent barcodes are equal. You may return any answer, and it is guaranteed an answer exists.

Example 1:
Input: barcodes = [1,1,1,2,2,2]
Output: [2,1,2,1,2,1]
Example 2:
Input: barcodes = [1,1,1,1,2,2,3,3]
Output: [1,3,1,3,1,2,1,2]

Constraints:

	1 <= barcodes.length <= 10000
	1 <= barcodes[i] <= 10000
*/
type BarcodePair = [barcode: number, count: number];

export function rearrangeBarcodes(barcodes: number[]): number[] {
    const map: Record<number, number> = {};
    barcodes.forEach((v) => {
        map[v] = (map[v] || 0) + 1;
    });

    const heap = new GenericHeap<BarcodePair>(([, a], [, b]) => b - a);
    heap.initHeap(Object.keys(map).map((v) => [+v, map[v]]));

    const result: number[] = Array(barcodes.length);
    let i = 0;
    let cycle = 2;
    while (heap.size() > 0) {
        cycle = 2;
        const remainingPairs: BarcodePair[] = [];
        while (cycle && heap.size() > 0) {
            const [v, count] = heap.pop();
            if (count - 1 > 0) {
                remainingPairs.push([v, count - 1]);
            }

            cycle--;
            result[i++] = v;
        }

        remainingPairs.forEach((t) => {
            heap.push(t);
        });
    }

    return result;
}

/*
https://leetcode.com/problems/range-sum-of-sorted-subarray-sums/description/?envType=problem-list-v2&envId=o5cftq05
1508. Range Sum of Sorted Subarray Sums
You are given the array nums consisting of n positive integers. You computed the sum of all non-empty continuous subarrays from the array and then sorted them in non-decreasing order, creating a new array of n * (n + 1) / 2 numbers.

Return the sum of the numbers from index left to index right (indexed from 1), inclusive, in the new array. Since the answer can be a huge number return it modulo 109 + 7.

Example 1:

Input: nums = [1,2,3,4], n = 4, left = 1, right = 5
Output: 13 
Explanation: All subarray sums are 1, 3, 6, 10, 2, 5, 9, 3, 7, 4. After sorting them in non-decreasing order we have the new array [1, 2, 3, 3, 4, 5, 6, 7, 9, 10]. The sum of the numbers from index le = 1 to ri = 5 is 1 + 2 + 3 + 3 + 4 = 13. 

Example 2:

Input: nums = [1,2,3,4], n = 4, left = 3, right = 4
Output: 6
Explanation: The given array is the same as example 1. We have the new array [1, 2, 3, 3, 4, 5, 6, 7, 9, 10]. The sum of the numbers from index le = 3 to ri = 4 is 3 + 3 = 6.

Example 3:

Input: nums = [1,2,3,4], n = 4, left = 1, right = 10
Output: 50

Constraints:

	n == nums.length
	1 <= nums.length <= 1000
	1 <= nums[i] <= 100
	1 <= left <= right <= n * (n + 1) / 2
*/
export function rangeSum(
    nums: number[],
    n: number,
    left: number,
    right: number
): number {
    const modulo = 10 ** 9 + 7;
    const heap = new GenericHeap<[val: number, pos: number]>(
        ([a], [b]) => a - b
    );
    let i = 0;
    while (i < n) {
        heap.push([nums[i], ++i]);
    }

    let ret = 0;
    for (let i = 1; i <= right; i++) {
        const p = heap.pop()!;
        if (i >= left) {
            ret = (ret + p[0]) % modulo;
        }
        if (p[1] < n) {
            p[0] += nums[p[1]++];
            heap.push(p);
        }
    }

    return ret;
}

/*
https://leetcode.com/problems/divide-intervals-into-minimum-number-of-groups/description/
2406. Divide Intervals Into Minimum Number of Groups
You are given a 2D integer array intervals where intervals[i] = [lefti, righti] represents the inclusive interval [lefti, righti].

You have to divide the intervals into one or more groups such that each interval is in exactly one group, and no two intervals that are in the same group intersect each other.

Return the minimum number of groups you need to make.

Two intervals intersect if there is at least one common number between them. For example, the intervals [1, 5] and [5, 8] intersect.

Example 1:

Input: intervals = [[5,10],[6,8],[1,5],[2,3],[1,10]]
Output: 3
Explanation: We can divide the intervals into the following groups:
- Group 1: [1, 5], [6, 8].
- Group 2: [2, 3], [5, 10].
- Group 3: [1, 10].
It can be proven that it is not possible to divide the intervals into fewer than 3 groups.

Example 2:

Input: intervals = [[1,3],[5,6],[8,10],[11,13]]
Output: 1
Explanation: None of the intervals overlap, so we can put all of them in one group.

Constraints:

	1 <= intervals.length <= 10^5
	intervals[i].length == 2
	1 <= lefti <= righti <= 10^6
*/
export function minGroups(intervals: number[][]): number {
    intervals.sort((a, b) => a[0] - b[0]);
    const heap = new GenericHeap((a, b) => a - b);

    let groups = 0;
    intervals.forEach(([left, right]) => {
        while (heap.size() > 0 && heap.peek() < left) {
            heap.pop();
        }
        heap.push(right);
        groups = Math.max(groups, heap.size());
    });

    return groups;
}

/*
https://leetcode.com/problems/maximal-score-after-applying-k-operations/description/
2530. Maximal Score After Applying K Operations
You are given a 0-indexed integer array nums and an integer k. You have a starting score of 0.

In one operation:

	choose an index i such that 0 <= i < nums.length,
	increase your score by nums[i], and
	replace nums[i] with ceil(nums[i] / 3).

Return the maximum possible score you can attain after applying exactly k operations.

The ceiling function ceil(val) is the least integer greater than or equal to val.

Example 1:

Input: nums = [10,10,10,10,10], k = 5
Output: 50
Explanation: Apply the operation to each array element exactly once. The final score is 10 + 10 + 10 + 10 + 10 = 50.

Example 2:

Input: nums = [1,10,3,3,3], k = 3
Output: 17
Explanation: You can do the following operations:
Operation 1: Select i = 1, so nums becomes [1,4,3,3,3]. Your score increases by 10.
Operation 2: Select i = 1, so nums becomes [1,2,3,3,3]. Your score increases by 4.
Operation 3: Select i = 2, so nums becomes [1,1,1,3,3]. Your score increases by 3.
The final score is 10 + 4 + 3 = 17.

Constraints:

	1 <= nums.length, k <= 10^5
	1 <= nums[i] <= 10^9
*/
export function maxKelements(nums: number[], k: number): number {
    const maxHeap = new GenericHeap((a, b) => b - a);
    maxHeap.initHeap(nums);

    let ret = 0;
    while (k > 0) {
        k--;
        const max = maxHeap.pop();
        ret += max;
        maxHeap.push(Math.ceil(max / 3));
    }

    return ret;
}
