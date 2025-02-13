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

/*
https://leetcode.com/problems/find-k-pairs-with-smallest-sums/description/
373. Find K Pairs with Smallest Sums
You are given two integer arrays nums1 and nums2 sorted in non-decreasing order and an integer k.

Define a pair (u, v) which consists of one element from the first array and one element from the second array.

Return the k pairs (u1, v1), (u2, v2), ..., (uk, vk) with the smallest sums.

Example 1:

Input: nums1 = [1,7,11], nums2 = [2,4,6], k = 3
Output: [[1,2],[1,4],[1,6]]
Explanation: The first 3 pairs are returned from the sequence: [1,2],[1,4],[1,6],[7,2],[7,4],[11,2],[7,6],[11,4],[11,6]

Example 2:

Input: nums1 = [1,1,2], nums2 = [1,2,3], k = 2
Output: [[1,1],[1,1]]
Explanation: The first 2 pairs are returned from the sequence: [1,1],[1,1],[1,2],[2,1],[1,2],[2,2],[1,3],[1,3],[2,3]

Constraints:

	1 <= nums1.length, nums2.length <= 10^5
	-10^9 <= nums1[i], nums2[i] <= 10^9
	nums1 and nums2 both are sorted in non-decreasing order.
	1 <= k <= 10^4
	k <= nums1.length * nums2.length
*/
export function kSmallestPairs(
    nums1: number[],
    nums2: number[],
    k: number
): number[][] {
    const minHeap = new GenericHeap<[sum: number, i: number, j: number]>(
        (a, b) => a[0] - b[0]
    );
    minHeap.push([nums1[0] + nums2[0], 0, 0]);

    const visited = new Set<string>();
    const add = (i: number, j: number) => {
        const id = `${i},${j}`;
        if (!visited.has(id)) {
            visited.add(id);
            minHeap.push([nums1[i] + nums2[j], i, j]);
        }
    };

    const ret: number[][] = [];
    while (k > 0) {
        k--;
        const [, i, j] = minHeap.pop();
        ret.push([nums1[i], nums2[j]]);

        if (i + 1 < nums1.length) {
            add(i + 1, j);
        }
        if (j + 1 < nums2.length) {
            add(i, j + 1);
        }
    }

    return ret;
}

/*
https://leetcode.com/problems/two-best-non-overlapping-events/description/
2054. Two Best Non-Overlapping Events
You are given a 0-indexed 2D integer array of events where events[i] = [startTimei, endTimei, valuei]. The ith event starts at startTimei and ends at endTimei, and if you attend this event, you will receive a value of valuei. You can choose at most two non-overlapping events to attend such that the sum of their values is maximized.

Return this maximum sum.

Note that the start time and end time is inclusive: that is, you cannot attend two events where one of them starts and the other ends at the same time. More specifically, if you attend an event with end time t, the next event must start at or after t + 1.

Example 1:

Input: events = [[1,3,2],[4,5,2],[2,4,3]]
Output: 4
Explanation: Choose the green events, 0 and 1 for a sum of 2 + 2 = 4.

Example 2:

Input: events = [[1,3,2],[4,5,2],[1,5,5]]
Output: 5
Explanation: Choose event 2 for a sum of 5.

Example 3:

Input: events = [[1,5,3],[1,5,1],[6,6,5]]
Output: 8
Explanation: Choose events 0 and 2 for a sum of 3 + 5 = 8.

Constraints:

	2 <= events.length <= 10^5
	events[i].length == 3
	1 <= startTimei <= endTimei <= 10^9
	1 <= valuei <= 10^6
*/
export function maxTwoEvents(events: number[][]): number {
    events.sort((a, b) => a[1] - b[1]);
    const maxHeap = new GenericHeap<number[]>((a, b) => b[2] - a[2]);
    maxHeap.initHeap(events);

    let max = -Infinity;
    for (let i = 0; i < events.length; i++) {
        while (maxHeap.size() > 0 && maxHeap.peek()[0] <= events[i][1]) {
            maxHeap.pop();
        }

        max = Math.max(
            max,
            events[i][2] + (maxHeap.peek() ? maxHeap.peek()[2] : 0)
        );
    }

    return max;
}

/*
https://leetcode.com/problems/final-array-state-after-k-multiplication-operations-i/description/
3264. Final Array State After K Multiplication Operations I
You are given an integer array nums, an integer k, and an integer multiplier.

You need to perform k operations on nums. In each operation:

	Find the minimum value x in nums. If there are multiple occurrences of the minimum value, select the one that appears first.
	Replace the selected minimum value x with x * multiplier.

Return an integer array denoting the final state of nums after performing all k operations.

Example 1:

Input: nums = [2,1,3,5,6], k = 5, multiplier = 2

Output: [8,4,6,5,6]

Explanation:

OperationResultAfter operation 1[2, 2, 3, 5, 6]After operation 2[4, 2, 3, 5, 6]After operation 3[4, 4, 3, 5, 6]After operation 4[4, 4, 6, 5, 6]After operation 5[8, 4, 6, 5, 6]

Example 2:

Input: nums = [1,2], k = 3, multiplier = 4

Output: [16,8]

Explanation:

OperationResultAfter operation 1[4, 2]After operation 2[4, 8]After operation 3[16, 8]

Constraints:

	1 <= nums.length <= 100
	1 <= nums[i] <= 100
	1 <= k <= 10
	1 <= multiplier <= 5
*/
export function getFinalState(
    nums: number[],
    k: number,
    multiplier: number
): number[] {
    const heap = new GenericHeap<number[]>(
        (a, b) => a[0] - b[0] || a[1] - b[1]
    );
    heap.initHeap(nums.map((v, i) => [v, i]));

    while (k > 0) {
        k--;
        const [v, i] = heap.pop();
        heap.push([v * multiplier, i]);
    }

    return heap.container.sort((a, b) => a[1] - b[1]).map(([v]) => v);
}

/*
https://leetcode.com/problems/minimum-operations-to-exceed-threshold-value-ii/description/?envType=daily-question&envId=2025-02-13
3066. Minimum Operations to Exceed Threshold Value II
You are given a 0-indexed integer array nums, and an integer k.

In one operation, you will:

	Take the two smallest integers x and y in nums.
	Remove x and y from nums.
	Add min(x, y) * 2 + max(x, y) anywhere in the array.

Note that you can only apply the described operation if nums contains at least two elements.

Return the minimum number of operations needed so that all elements of the array are greater than or equal to k.

Example 1:

Input: nums = [2,11,10,1,3], k = 10
Output: 2
Explanation: In the first operation, we remove elements 1 and 2, then add 1 * 2 + 2 to nums. nums becomes equal to [4, 11, 10, 3].
In the second operation, we remove elements 3 and 4, then add 3 * 2 + 4 to nums. nums becomes equal to [10, 11, 10].
At this stage, all the elements of nums are greater than or equal to 10 so we can stop.
It can be shown that 2 is the minimum number of operations needed so that all elements of the array are greater than or equal to 10.

Example 2:

Input: nums = [1,1,2,4,9], k = 20
Output: 4
Explanation: After one operation, nums becomes equal to [2, 4, 9, 3].
After two operations, nums becomes equal to [7, 4, 9].
After three operations, nums becomes equal to [15, 9].
After four operations, nums becomes equal to [33].
At this stage, all the elements of nums are greater than 20 so we can stop.
It can be shown that 4 is the minimum number of operations needed so that all elements of the array are greater than or equal to 20.

Constraints:

	2 <= nums.length <= 10^5
	1 <= nums[i] <= 10^9
	1 <= k <= 10^9
	The input is generated such that an answer always exists. That is, there exists some sequence of operations after which all elements of the array are greater than or equal to k.
*/
export function minOperations2(nums: number[], k: number): number {
    const minHeap = new GenericHeap<number>((a, b) => a - b);
    minHeap.initHeap(nums);
    let minOp = 0;
    while (minHeap.size() >= 2) {
        const x = minHeap.pop();
        if (x >= k) {
            break;
        }
        const y = minHeap.pop();

        minHeap.push(Math.min(x, y) * 2 + Math.max(x, y));
        minOp++;
    }

    return minOp;
}
