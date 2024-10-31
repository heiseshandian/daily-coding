import { cache } from '../design-pattern/proxy';
import {
    getCharIndex,
    getPrimeFactors,
    lcm,
    sqrtBigInt,
    swap,
} from '../common/index';
import { SlidingWindow } from '../algorithm/sliding-window';
import { GenericHeap } from '../algorithm/generic-heap';
import { UnionFind } from '../algorithm/union-find';
import { UnionFindWithSize } from '../algorithm/union-find-with-size';
import { TreeNode } from '../algorithm/tree';
import { rob } from './tree';

/*
https://leetcode.com/problems/find-the-longest-valid-obstacle-course-at-each-position/description/
1964. Find the Longest Valid Obstacle Course at Each Position
You want to build some obstacle courses. You are given a 0-indexed integer array obstacles of length n, where obstacles[i] describes the height of the ith obstacle.

For every index i between 0 and n - 1 (inclusive), find the length of the longest obstacle course in obstacles such that:

	You choose any number of obstacles between 0 and i inclusive.
	You must include the ith obstacle in the course.
	You must put the chosen obstacles in the same order as they appear in obstacles.
	Every obstacle (except the first) is taller than or the same height as the obstacle immediately before it.

Return an array ans of length n, where ans[i] is the length of the longest obstacle course for index i as described above.

Example 1:

Input: obstacles = [1,2,3,2]
Output: [1,2,3,3]
Explanation: The longest valid obstacle course at each position is:
- i = 0: [1], [1] has length 1.
- i = 1: [1,2], [1,2] has length 2.
- i = 2: [1,2,3], [1,2,3] has length 3.
- i = 3: [1,2,3,2], [1,2,2] has length 3.

Example 2:

Input: obstacles = [2,2,1]
Output: [1,2,1]
Explanation: The longest valid obstacle course at each position is:
- i = 0: [2], [2] has length 1.
- i = 1: [2,2], [2,2] has length 2.
- i = 2: [2,2,1], [1] has length 1.

Example 3:

Input: obstacles = [3,1,5,6,4,2]
Output: [1,1,2,3,2,2]
Explanation: The longest valid obstacle course at each position is:
- i = 0: [3], [3] has length 1.
- i = 1: [3,1], [1] has length 1.
- i = 2: [3,1,5], [3,5] has length 2. [1,5] is also valid.
- i = 3: [3,1,5,6], [3,5,6] has length 3. [1,5,6] is also valid.
- i = 4: [3,1,5,6,4], [3,4] has length 2. [1,4] is also valid.
- i = 5: [3,1,5,6,4,2], [1,2] has length 2.

Constraints:

	n == obstacles.length
	1 <= n <= 10^5
	1 <= obstacles[i] <= 10^7
*/
export function longestObstacleCourseAtEachPosition(
    obstacles: number[]
): number[] {
    const result: number[] = Array(obstacles.length);
    result[0] = 1;
    const minEnd = [obstacles[0]];

    for (let i = 1; i < obstacles.length; i++) {
        let left = 0;
        let right = minEnd.length - 1;
        let closestBiggerIndex = minEnd.length;
        while (left <= right) {
            const mid = left + ((right - left) >> 1);
            if (minEnd[mid] <= obstacles[i]) {
                left = mid + 1;
            } else {
                closestBiggerIndex = mid;
                right = mid - 1;
            }
        }

        minEnd[closestBiggerIndex] = obstacles[i];
        result[i] = closestBiggerIndex + 1;
    }

    return result;
}

/*
https://leetcode.com/problems/minimum-number-of-taps-to-open-to-water-a-garden/description/
1326. Minimum Number of Taps to Open to Water a Garden
There is a one-dimensional garden on the x-axis. The garden starts at the point 0 and ends at the point n. (i.e., the length of the garden is n).

There are n + 1 taps located at points [0, 1, ..., n] in the garden.

Given an integer n and an integer array ranges of length n + 1 where ranges[i] (0-indexed) means the i-th tap 
can water the area [i - ranges[i], i + ranges[i]] if it was open.

Return the minimum number of taps that should be open to water the whole garden, If the garden cannot be watered return -1.

Example 1:

Input: n = 5, ranges = [3,4,1,1,0,0]
Output: 1
Explanation: The tap at point 0 can cover the interval [-3,3]
The tap at point 1 can cover the interval [-3,5]
The tap at point 2 can cover the interval [1,3]
The tap at point 3 can cover the interval [2,4]
The tap at point 4 can cover the interval [4,4]
The tap at point 5 can cover the interval [5,5]
Opening Only the second tap will water the whole garden [0,5]

Example 2:

Input: n = 3, ranges = [0,0,0,0]
Output: -1
Explanation: Even if you activate all the four taps you cannot water the whole garden.

Constraints:

	1 <= n <= 10^4
	ranges.length == n + 1
	0 <= ranges[i] <= 100
*/
export function minTaps(n: number, ranges: number[]): number {
    const areas = ranges
        .map((v, i) => [i - v, i + v])
        .sort(([startA], [startB]) => startA - startB);

    let min = 0;
    let currentEnd = 0;
    let i = 0;
    while (currentEnd < n) {
        let maxEnd = currentEnd;
        while (i < areas.length && areas[i][0] <= currentEnd) {
            maxEnd = Math.max(maxEnd, areas[i++][1]);
        }

        if (maxEnd === currentEnd) {
            return -1;
        }

        currentEnd = maxEnd;
        min++;
    }

    return min;
}

/*
https://leetcode.com/problems/the-score-of-students-solving-math-expression/description/
2019. The Score of Students Solving Math Expression
You are given a string s that contains digits 0-9, addition symbols '+', and multiplication symbols '*' only, representing a valid math expression of single digit numbers (e.g., 3+5*2). 
This expression was given to n elementary school students. The students were instructed to get the answer of the expression by following this order of operations:

	Compute multiplication, reading from left to right; Then,
	Compute addition, reading from left to right.

You are given an integer array answers of length n, which are the submitted answers of the students in no particular order. 
You are asked to grade the answers, by following these rules:

	If an answer equals the correct answer of the expression, this student will be rewarded 5 points;
	Otherwise, if the answer could be interpreted as if the student applied the operators in the wrong order but had correct arithmetic, this student will be rewarded 2 points;
	Otherwise, this student will be rewarded 0 points.

Return the sum of the points of the students.

Example 1:

Input: s = "7+3*1*2", answers = [20,13,42]
Output: 7
Explanation: As illustrated above, the correct answer of the expression is 13, therefore one student is rewarded 5 points: [20,13,42]
A student might have applied the operators in this wrong order: ((7+3)*1)*2 = 20. Therefore one student is rewarded 2 points: [20,13,42]
The points for the students are: [2,5,0]. The sum of the points is 2+5+0=7.

Example 2:

Input: s = "3+5*2", answers = [13,0,10,13,13,16,16]
Output: 19
Explanation: The correct answer of the expression is 13, therefore three students are rewarded 5 points each: [13,0,10,13,13,16,16]
A student might have applied the operators in this wrong order: ((3+5)*2 = 16. Therefore two students are rewarded 2 points: [13,0,10,13,13,16,16]
The points for the students are: [5,0,0,5,5,2,2]. The sum of the points is 5+0+0+5+5+2+2=19.

Example 3:

Input: s = "6+0*1", answers = [12,9,6,4,8,6]
Output: 10
Explanation: The correct answer of the expression is 6.
If a student had incorrectly done (6+0)*1, the answer would also be 6.
By the rules of grading, the students will still be rewarded 5 points (as they got the correct answer), not 2 points.
The points for the students are: [0,0,5,0,0,5]. The sum of the points is 10.

Constraints:

	3 <= s.length <= 31
	s represents a valid expression that contains only digits 0-9, '+', and '*' only.
	All the integer operands in the expression are in the inclusive range [0, 9].
	1 <= The count of all operators ('+' and '*') in the math expression <= 15
	Test data are generated such that the correct answer of the expression is in the range of [0, 1000].
	n == answers.length
	1 <= n <= 10^4
	0 <= answers[i] <= 1000
*/
export function scoreOfStudents(s: string, answers: number[]): number {
    const MAX = 1000;
    const calc = cache((start: number, end: number): Set<number> => {
        if (start === end) {
            return new Set([+s[start]]);
        }

        const results = new Set<number>();
        for (let i = start + 1; i < end; i += 2) {
            const left = calc(start, i - 1);
            const right = calc(i + 1, end);

            left.forEach((l) => {
                right.forEach((r) => {
                    const val = s[i] === '+' ? l + r : l * r;
                    if (val <= MAX) {
                        results.add(val);
                    }
                });
            });
        }

        return results;
    });

    const set = calc(0, s.length - 1);
    const correctResult = calculate(s);

    return answers.reduce((acc, cur) => {
        return acc + (cur === correctResult ? 5 : set.has(cur) ? 2 : 0);
    }, 0);
}

function calculate(s: string): number {
    const stack: Array<string | number> = [s[0]];
    let i = 1;
    while (i < s.length) {
        if (s[i] >= '0' && s[i] <= '9') {
            const peek = stack[stack.length - 1];
            if (peek === '*') {
                stack.pop();
                stack.push(Number(stack.pop()!) * Number(s[i]));
            } else {
                stack.push(s[i]);
            }
        } else if (s[i] === '*') {
            stack.push('*');
        }

        i++;
    }

    let sum = 0;
    stack.forEach((v) => {
        sum += Number(v);
    });

    return sum;
}

/*
https://leetcode.com/problems/rearranging-fruits/description/
2561. Rearranging Fruits
You have two fruit baskets containing n fruits each. You are given two 0-indexed integer arrays basket1 and basket2 representing the cost of fruit 
in each basket. You want to make both baskets equal. To do so, you can use the following operation as many times as you want:

	Chose two indices i and j, and swap the ith fruit of basket1 with the jth fruit of basket2.
	The cost of the swap is min(basket1[i],basket2[j]).

Two baskets are considered equal if sorting them according to the fruit cost makes them exactly the same baskets.

Return the minimum cost to make both the baskets equal or -1 if impossible.

Example 1:

Input: basket1 = [4,2,2,2], basket2 = [1,4,1,2]
Output: 1
Explanation: Swap index 1 of basket1 with index 0 of basket2, which has cost 1. Now basket1 = [4,1,2,2] and basket2 = [2,4,1,2]. 
Rearranging both the arrays makes them equal.

Example 2:

Input: basket1 = [2,3,4,1], basket2 = [3,2,5,1]
Output: -1
Explanation: It can be shown that it is impossible to make both the baskets equal.

Constraints:

	basket1.length == basket2.length
	1 <= basket1.length <= 10^5
	1 <= basket1[i],basket2[i] <= 10^9
*/
export function minCost(basket1: number[], basket2: number[]): number {
    const [repeatTimes1, min1] = getRepeatTimesAndMin(basket1);
    const [repeatTimes2, min2] = getRepeatTimesAndMin(basket2);

    let restLen = basket1.length;
    Object.keys(repeatTimes1).forEach((v) => {
        if (repeatTimes2[v]) {
            const min = Math.min(repeatTimes1[v], repeatTimes2[v]);
            repeatTimes1[v] -= min;
            repeatTimes2[v] -= min;
            restLen -= min;

            if (repeatTimes1[v] === 0) {
                delete repeatTimes1[v];
            }
            if (repeatTimes2[v] === 0) {
                delete repeatTimes2[v];
            }
        }
    });
    if (restLen === 0) {
        return 0;
    }

    if (
        Object.keys(repeatTimes1).some((v) => repeatTimes1[v] & 1) ||
        Object.keys(repeatTimes2).some((v) => repeatTimes1[v] & 1)
    ) {
        return -1;
    }

    const nums1 = fillNums(repeatTimes1, restLen);
    const nums2 = fillNums(repeatTimes2, restLen);
    nums1.sort((a, b) => a - b);
    nums2.sort((a, b) => b - a);

    let score = 0;
    const min = Math.min(min1, min2) << 1;
    nums1.forEach((v, i) => {
        score += Math.min(v, nums2[i], min);
    });

    return score;
}

function fillNums(times: Record<number, number>, len: number) {
    const nums: number[] = Array(len);
    let i = 0;

    Object.keys(times).forEach((v) => {
        Array(times[v] >> 1)
            .fill(+v)
            .forEach((v) => (nums[i++] = v));
    });

    return nums;
}

function getRepeatTimesAndMin(
    nums: number[]
): [times: Record<number, number>, min: number] {
    const repeatTimes: Record<number, number> = {};
    let min = Infinity;
    nums.forEach((v) => {
        repeatTimes[v] = (repeatTimes[v] || 0) + 1;
        min = Math.min(min, v);
    });

    return [repeatTimes, min];
}

/*
https://leetcode.com/problems/first-missing-positive/description/
41. First Missing Positive
Given an unsorted integer array nums. Return the smallest positive integer that is not present in nums.

You must implement an algorithm that runs in O(n) time and uses O(1) auxiliary space.

Example 1:

Input: nums = [1,2,0]
Output: 3
Explanation: The numbers in the range [1,2] are all in the array.

Example 2:

Input: nums = [3,4,-1,1]
Output: 2
Explanation: 1 is in the array but 2 is missing.

Example 3:

Input: nums = [7,8,9,11,12]
Output: 1
Explanation: The smallest positive integer 1 is missing.

Constraints:

	1 <= nums.length <= 10^5
	2^31 <= nums[i] <= 2^31 - 1
*/
export function firstMissingPositive(nums: number[]): number {
    let left = 0;
    let right = nums.length;

    while (left < right) {
        if (nums[left] < left + 1 || nums[left] > right) {
            // 当前数字范围不在 left+1 到 right之间，把left位置的数丢进垃圾区
            swap(nums, left, --right);
        } else if (nums[left] === left + 1) {
            left++;
        } else if (nums[left] === nums[nums[left] - 1]) {
            // 重复出现值也直接丢进垃圾区
            swap(nums, left, --right);
        } else {
            swap(nums, left, nums[left] - 1);
        }
    }

    return left + 1;
}

/*
https://leetcode.com/problems/subarrays-with-k-different-integers/description/?envType=daily-question&envId=2024-03-30
992. Subarrays with K Different Integers
Given an integer array nums and an integer k, return the number of good subarrays of nums.

A good array is an array where the number of different integers in that array is exactly k.

	For example, [1,2,3,1,2] has 3 different integers: 1, 2, and 3.

A subarray is a contiguous part of an array.

Example 1:

Input: nums = [1,2,1,2,3], k = 2
Output: 7
Explanation: Subarrays formed with exactly 2 different integers: [1,2], [2,1], [1,2], [2,3], [1,2,1], [2,1,2], [1,2,1,2]

Example 2:

Input: nums = [1,2,1,3,4], k = 3
Output: 3
Explanation: Subarrays formed with exactly 3 different integers: [1,2,1,3], [2,1,3], [1,3,4].

Constraints:

	1 <= nums.length <= 10^4
	1 <= nums[i], k <= nums.length
*/
export function subarraysWithKDistinct(nums: number[], k: number): number {
    const freqMap = new Map<number, number>();
    freqMap.set(nums[0], 1);
    let left = 0;
    let right = 0;
    let count = 0;
    while (left < nums.length) {
        while (freqMap.size < k && right < nums.length) {
            right++;
            freqMap.set(nums[right], (freqMap.get(nums[right]) || 0) + 1);
        }

        if (freqMap.size === k) {
            let j = right;
            while (j < nums.length && freqMap.has(nums[j])) {
                count++;
                j++;
            }

            if (freqMap.get(nums[left]) === 1) {
                freqMap.delete(nums[left]);
            } else {
                freqMap.set(nums[left], freqMap.get(nums[left])! - 1);
            }
            left++;
        } else {
            break;
        }
    }

    return count;
}

/*
https://leetcode.com/problems/count-subarrays-with-fixed-bounds/description/
2444. Count Subarrays With Fixed Bounds
You are given an integer array nums and two integers minK and maxK.

A fixed-bound subarray of nums is a subarray that satisfies the following conditions:

	The minimum value in the subarray is equal to minK.
	The maximum value in the subarray is equal to maxK.

Return the number of fixed-bound subarrays.

A subarray is a contiguous part of an array.

Example 1:

Input: nums = [1,3,5,2,7,5], minK = 1, maxK = 5
Output: 2
Explanation: The fixed-bound subarrays are [1,3,5] and [1,3,5,2].

Example 2:

Input: nums = [1,1,1,1], minK = 1, maxK = 1
Output: 10
Explanation: Every subarray of nums is a fixed-bound subarray. There are 10 possible subarrays.

Constraints:

	2 <= nums.length <= 10^5
	1 <= nums[i], minK, maxK <= 10^6
*/
export function countSubarrays(
    nums: number[],
    minK: number,
    maxK: number
): number {
    const minWindow = new SlidingWindow(nums, (a, b) => a - b);
    const maxWindow = new SlidingWindow(nums, (a, b) => b - a);
    minWindow.moveRight();
    maxWindow.moveRight();

    let count = 0;
    let lastK = -1;
    while (maxWindow.right < nums.length) {
        if (minWindow.peek() === minK && maxWindow.peek() === maxK) {
            let k = Math.max(lastK, minWindow.right);
            while (k < nums.length && nums[k] >= minK && nums[k] <= maxK) {
                k++;
            }
            lastK = k;

            count += lastK - minWindow.right;

            minWindow.moveLeft();
            maxWindow.moveLeft();
        } else if (minWindow.peek() >= minK && maxWindow.peek() <= maxK) {
            minWindow.moveRight();
            maxWindow.moveRight();
        } else {
            while (minWindow.left < minWindow.right) {
                minWindow.moveLeft();
                maxWindow.moveLeft();
            }

            minWindow.moveRight();
            maxWindow.moveRight();
        }
    }

    return count;
}

/*
https://leetcode.com/problems/sum-of-floored-pairs/description/?envType=list&envId=o5cftq05
1862. Sum of Floored Pairs
Given an integer array nums, return the sum of floor(nums[i] / nums[j]) for all pairs of indices 0 <= i, j < nums.length in the array. Since the answer may be too large, return it modulo 109 + 7.

The floor() function returns the integer part of the division.

Example 1:

Input: nums = [2,5,9]
Output: 10
Explanation:
floor(2 / 5) = floor(2 / 9) = floor(5 / 9) = 0
floor(2 / 2) = floor(5 / 5) = floor(9 / 9) = 1
floor(5 / 2) = 2
floor(9 / 2) = 4
floor(9 / 5) = 1
We calculate the floor of the division for every pair of indices in the array then sum them up.

Example 2:

Input: nums = [7,7,7,7,7,7,7]
Output: 49

Constraints:

	1 <= nums.length <= 10^5
	1 <= nums[i] <= 10^5
*/
export function sumOfFlooredPairs(nums: number[]) {
    const MAX = Math.max(...nums);

    const countsGreaterOrEqualTo = new Array(MAX + 1).fill(0);

    nums.forEach((num) => (countsGreaterOrEqualTo[num] += 1));

    for (let num = MAX - 1; num >= 0; num -= 1) {
        countsGreaterOrEqualTo[num] += countsGreaterOrEqualTo[num + 1];
    }

    const numCounts = nums.reduce((counts, num) => {
        counts.set(num, (counts.get(num) || 0) + 1);
        return counts;
    }, new Map());

    const MOD = 10 ** 9 + 7;
    let totalCount = 0;

    numCounts.forEach((count, num) => {
        let current = num;

        while (current <= MAX) {
            totalCount =
                (totalCount + countsGreaterOrEqualTo[current] * count) % MOD;
            current += num;
        }
    });

    return totalCount;
}

/*
https://leetcode.com/problems/insert-delete-getrandom-o1-duplicates-allowed/description/?envType=list&envId=o5cftq05
381. Insert Delete GetRandom O(1) - Duplicates allowed
RandomizedCollection is a data structure that contains a collection of numbers, possibly duplicates (i.e., a multiset). It should support inserting and removing specific elements and also reporting a random element.

Implement the RandomizedCollection class:

	RandomizedCollection() Initializes the empty RandomizedCollection object.
	bool insert(int val) Inserts an item val into the multiset, even if the item is already present. Returns true if the item is not present, false otherwise.
	bool remove(int val) Removes an item val from the multiset if present. Returns true if the item is present, false otherwise. Note that if val has multiple occurrences in the multiset, we only remove one of them.
	int getRandom() Returns a random element from the current multiset of elements. The probability of each element being returned is linearly related to the number of the same values the multiset contains.

You must implement the functions of the class such that each function works on average O(1) time complexity.

Note: The test cases are generated such that getRandom will only be called if there is at least one item in the RandomizedCollection.

Example 1:

Input
["RandomizedCollection", "insert", "insert", "insert", "getRandom", "remove", "getRandom"]
[[], [1], [1], [2], [], [1], []]
Output
[null, true, false, true, 2, true, 1]

Explanation
RandomizedCollection randomizedCollection = new RandomizedCollection();
randomizedCollection.insert(1);   // return true since the collection does not contain 1.
                                  // Inserts 1 into the collection.
randomizedCollection.insert(1);   // return false since the collection contains 1.
                                  // Inserts another 1 into the collection. Collection now contains [1,1].
randomizedCollection.insert(2);   // return true since the collection does not contain 2.
                                  // Inserts 2 into the collection. Collection now contains [1,1,2].
randomizedCollection.getRandom(); // getRandom should:
                                  // - return 1 with probability 2/3, or
                                  // - return 2 with probability 1/3.
randomizedCollection.remove(1);   // return true since the collection contains 1.
                                  // Removes 1 from the collection. Collection now contains [1,2].
randomizedCollection.getRandom(); // getRandom should return 1 or 2, both equally likely.

Constraints:

	2^31 <= val <= 2^31 - 1
	At most 2 * 105 calls in total will be made to insert, remove, and getRandom.
	There will be at least one element in the data structure when getRandom is called.
*/
export class RandomizedCollection {
    private index2ValMap: Map<number, number>;
    private val2IndexMap: Map<number, Set<number>>;
    private size: number;

    constructor() {
        this.index2ValMap = new Map();
        this.val2IndexMap = new Map();
        this.size = 0;
    }

    insert(val: number): boolean {
        const inserted = this.val2IndexMap.has(val);
        if (!inserted) {
            this.index2ValMap.set(this.size, val);
            this.val2IndexMap.set(val, new Set([this.size]));
        } else {
            const indexSet = this.val2IndexMap.get(val)!;
            this.index2ValMap.set(this.size, val);
            indexSet.add(this.size);
        }
        this.size++;

        return !inserted;
    }

    remove(val: number): boolean {
        const indexSet = this.val2IndexMap.get(val);
        if (indexSet === undefined) {
            return false;
        }

        const toDeleteIndex = indexSet.values().next().value;
        this.swap(toDeleteIndex, this.size - 1);
        indexSet.delete(this.size - 1);
        if (indexSet.size === 0) {
            this.val2IndexMap.delete(val);
        }

        this.index2ValMap.delete(this.size - 1);
        this.size--;

        return true;
    }

    private swap(i: number, j: number) {
        if (i === j) {
            return;
        }

        const valI = this.index2ValMap.get(i)!;
        const valJ = this.index2ValMap.get(j)!;
        this.index2ValMap.set(i, valJ);
        this.index2ValMap.set(j, valI);

        const indexSetI = this.val2IndexMap.get(valI)!;
        const indexSetJ = this.val2IndexMap.get(valJ)!;
        indexSetI.delete(i);
        indexSetI.add(j);
        indexSetJ.delete(j);
        indexSetJ.add(i);
    }

    getRandom(): number {
        const random = Math.floor(Math.random() * this.size);
        return this.index2ValMap.get(random)!;
    }
}

/*
https://leetcode.com/problems/find-in-mountain-array/description/?envType=list&envId=o5cftq05
1095. Find in Mountain Array
(This problem is an interactive problem.)

You may recall that an array arr is a mountain array if and only if:

	arr.length >= 3
	There exists some i with 0 < i < arr.length - 1 such that:

		arr[0] < arr[1] < ... < arr[i - 1] < arr[i]
		arr[i] > arr[i + 1] > ... > arr[arr.length - 1]

Given a mountain array mountainArr, return the minimum index such that mountainArr.get(index) == target. If such an index does not exist, return -1.

You cannot access the mountain array directly. You may only access the array using a MountainArray interface:

	MountainArray.get(k) returns the element of the array at index k (0-indexed).
	MountainArray.length() returns the length of the array.

Submissions making more than 100 calls to MountainArray.get will be judged Wrong Answer. Also, any solutions that attempt to circumvent the judge will result in disqualification.

Example 1:

Input: array = [1,2,3,4,5,3,1], target = 3
Output: 2
Explanation: 3 exists in the array, at index=2 and index=5. Return the minimum index, which is 2.

Example 2:

Input: array = [0,1,2,4,2,1], target = 3
Output: -1
Explanation: 3 does not exist in the array, so we return -1.

Constraints:

	3 <= mountain_arr.length() <= 10^4
	0 <= target <= 10^9
	0 <= mountain_arr.get(index) <= 10^9
*/

// This is the MountainArray's API interface.
// You should not implement it, or speculate about its implementation
class MountainArray {
    // @ts-expect-error
    get(index: number): number {}
    // @ts-expect-error
    length(): number {}
}

export function findInMountainArray(
    target: number,
    mountainArr: MountainArray
) {
    const len = mountainArr.length();
    const get = cache((index: number) => mountainArr.get(index));

    // find peak
    let left = 0;
    let right = len - 1;
    let peak: number = 0;
    while (left <= right) {
        const mid = left + ((right - left) >> 1);
        if (get(mid) > get(mid - 1) && get(mid) > get(mid + 1)) {
            peak = mid;
            break;
        }

        if (get(mid - 1) < get(mid) && get(mid) < get(mid + 1)) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    // find target from left side
    left = 0;
    right = peak;
    while (left <= right) {
        const mid = left + ((right - left) >> 1);
        if (get(mid) === target) {
            return mid;
        }

        if (get(mid) > target) {
            right = mid - 1;
        } else {
            left = mid + 1;
        }
    }

    // find target from right side
    left = peak + 1;
    right = len - 1;
    while (left <= right) {
        const mid = left + ((right - left) >> 1);
        if (get(mid) === target) {
            return mid;
        }

        if (get(mid) > target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    return -1;
}

/*
https://leetcode.com/problems/number-of-flowers-in-full-bloom/description/?envType=list&envId=o5cftq05
2251. Number of Flowers in Full Bloom
You are given a 0-indexed 2D integer array flowers, where flowers[i] = [starti, endi] means the ith flower will be in 
full bloom from starti to endi (inclusive). You are also given a 0-indexed integer array people of size n, where people[i] 
is the time that the ith person will arrive to see the flowers.

Return an integer array answer of size n, where answer[i] is the number of flowers that are in full bloom when the ith person arrives.

Example 1:

Input: flowers = [[1,6],[3,7],[9,12],[4,13]], people = [2,3,7,11]
Output: [1,2,2,2]
Explanation: The figure above shows the times when the flowers are in full bloom and when the people arrive.
For each person, we return the number of flowers in full bloom during their arrival.

Example 2:

Input: flowers = [[1,10],[3,3]], people = [3,3,2]
Output: [2,2,1]
Explanation: The figure above shows the times when the flowers are in full bloom and when the people arrive.
For each person, we return the number of flowers in full bloom during their arrival.

Constraints:

	1 <= flowers.length <= 10^4
	flowers[i].length == 2
	1 <= starti <= endi <= 10^9
	1 <= people.length <= 10^4
	1 <= people[i] <= 10^9
*/
export function fullBloomFlowers(
    flowers: number[][],
    people: number[]
): number[] {
    flowers.sort(([startA], [startB]) => startA - startB);
    const sorted = people.map((t, i) => [t, i]).sort(([tA], [tB]) => tA - tB);
    const result = Array(people.length);

    const heap = new GenericHeap((a, b) => a - b);

    let prev = 0;
    sorted.forEach(([t, index]) => {
        let i = prev;
        while (i < flowers.length && flowers[i][0] <= t) {
            heap.push(flowers[i][1]);
            i++;
        }
        prev = i;

        while (heap.size() > 0 && heap.peek() < t) {
            heap.pop();
        }

        result[index] = heap.size();
    });

    return result;
}

/*
https://leetcode.com/problems/valid-number/description/
65. Valid Number
Given a string s, return whether s is a valid number.

For example, all the following are valid numbers: "2", "0089", "-0.1", "+3.14", "4.", "-.9", "2e10", "-90E3", "3e+7", 
"+6e-1", "53.5e93", "-123.456e789", while the following are not valid numbers: "abc", "1a", "1e", "e3", "99e2.5", "--6", "-+3", "95a54e53".

Formally, a valid number is defined using one of the following definitions:

	An integer number followed by an optional exponent.
	A decimal number followed by an optional exponent.

An integer number is defined with an optional sign '-' or '+' followed by digits.

A decimal number is defined with an optional sign '-' or '+' followed by one of the following definitions:

	Digits followed by a dot '.'.
	Digits followed by a dot '.' followed by digits.
	A dot '.' followed by digits.

An exponent is defined with an exponent notation 'e' or 'E' followed by an integer number.

The digits are defined as one or more digits.

Example 1:

Input: s = "0"

Output: true

Example 2:

Input: s = "e"

Output: false

Example 3:

Input: s = "."

Output: false

Constraints:

	1 <= s.length <= 20
	s consists of only English letters (both uppercase and lowercase), digits (0-9), plus '+', minus '-', or dot '.'.
*/
export function isNumber(s: string): boolean {
    return /^[+-]?(\d+(\.\d*)?|\.\d+)([eE][+-]?\d+)?$/.test(s.trim());
}

/*
https://leetcode.com/problems/n-queens-ii/
52. N-Queens II
The n-queens puzzle is the problem of placing n queens on an n x n chessboard such that no two queens attack each other.

Given an integer n, return the number of distinct solutions to the n-queens puzzle.

Example 1:

Input: n = 4
Output: 2
Explanation: There are two distinct solutions to the 4-queens puzzle as shown.

Example 2:

Input: n = 1
Output: 1

Constraints:

	1 <= n <= 9
*/
export function totalNQueens(n: number): number {
    const limit = (1 << n) - 1;

    const dfs = (column: number, left: number, right: number): number => {
        if (column === limit) {
            return 1;
        }

        const l = column | left | right;
        let candidate = limit & ~l;

        let count = 0;
        while (candidate) {
            const place = candidate & -candidate;
            candidate ^= place;
            count += dfs(
                column | place,
                (left | place) >> 1,
                (right | place) << 1
            );
        }

        return count;
    };

    return dfs(0, 0, 0);
}

/*
https://leetcode.com/problems/nth-magical-number/description/
878. Nth Magical Number
A positive integer is magical if it is divisible by either a or b.

Given the three integers n, a, and b, return the nth magical number. Since the answer may be very large, return it modulo 10^9 + 7.

Example 1:

Input: n = 1, a = 2, b = 3
Output: 2

Example 2:

Input: n = 4, a = 2, b = 3
Output: 6

Constraints:

	1 <= n <= 10^9
	2 <= a, b <= 10^4

* 采用二分答案的思路来求解
*/
export function nthMagicalNumber(n: number, a: number, b: number): number {
    const l = lcm(a, b);
    const countMagicNumbers = (x: number) =>
        Math.floor(x / a) + Math.floor(x / b) - Math.floor(x / l);
    const modulo = Math.pow(10, 9) + 7;

    let left = 1;
    let right = n * Math.min(a, b);
    let closest = right;
    while (left <= right) {
        // ! 此处不可使用 位运算 来求解 mid ，会溢出导致超时
        const mid = left + Math.floor((right - left) / 2);

        /**
         * ! 此处找到 n 个 magic number 的时候不能直接返回 mid，因为 mid 有可能比第 n 个
         * ! magic number 大，比如说 n=3,a=6,b=4 此时 mid = 9，1-9 一共三个 magic number
         * ! 但是 9 本身并不是 magic number ，我们需要继续缩小范围，找到第 n 个 magic number
         */
        if (countMagicNumbers(mid) >= n) {
            closest = mid;
            right = mid - 1;
        } else {
            left = mid + 1;
        }
    }

    return closest % modulo;
}

/*
https://leetcode.com/problems/minimum-cost-to-hire-k-workers/description/?envType=daily-question&envId=2024-05-11
857. Minimum Cost to Hire K Workers
There are n workers. You are given two integer arrays quality and wage where quality[i] is the quality of the ith worker and wage[i] is the minimum wage expectation for the ith worker.

We want to hire exactly k workers to form a paid group. To hire a group of k workers, we must pay them according to the following rules:

	Every worker in the paid group must be paid at least their minimum wage expectation.
	In the group, each worker's pay must be directly proportional to their quality. This means if a worker’s quality is double that of another worker in the group, then they must be paid twice as much as the other worker.

Given the integer k, return the least amount of money needed to form a paid group satisfying the above conditions. Answers within 10-5 of the actual answer will be accepted.

Example 1:

Input: quality = [10,20,5], wage = [70,50,30], k = 2
Output: 105.00000
Explanation: We pay 70 to 0th worker and 35 to 2nd worker.

Example 2:

Input: quality = [3,1,10,10,1], wage = [4,8,2,2,7], k = 3
Output: 30.66667
Explanation: We pay 4 to 0th worker, 13.33333 to 2nd and 3rd workers separately.

Constraints:

	n == quality.length == wage.length
	1 <= k <= n <= 10^4
	1 <= quality[i], wage[i] <= 10^4
*/
export function mincostToHireWorkers(
    quality: number[],
    wage: number[],
    k: number
): number {
    const sorted = quality
        .map((q, i) => [wage[i] / q, q])
        .sort(([a], [b]) => a - b);

    let sum = 0;
    const maxHeap = new GenericHeap((a, b) => b - a);
    let minCost = Infinity;
    for (const [ratio, q] of sorted) {
        sum += q;
        maxHeap.push(q);
        if (maxHeap.size() > k) {
            sum -= maxHeap.pop()!;
        }
        if (maxHeap.size() === k) {
            minCost = Math.min(minCost, sum * ratio);
        }
    }
    return minCost;
}

/*
https://leetcode.com/problems/split-array-largest-sum/description/
410. Split Array Largest Sum
Given an integer array nums and an integer k, split nums into k non-empty subarrays such that the largest sum of any subarray is minimized.

Return the minimized largest sum of the split.

A subarray is a contiguous part of the array.

Example 1:

Input: nums = [7,2,5,10,8], k = 2
Output: 18
Explanation: There are four ways to split nums into two subarrays.
The best way is to split it into [7,2,5] and [10,8], where the largest sum among the two subarrays is only 18.

Example 2:

Input: nums = [1,2,3,4,5], k = 2
Output: 9
Explanation: There are four ways to split nums into two subarrays.
The best way is to split it into [1,2,3] and [4,5], where the largest sum among the two subarrays is only 9.

Constraints:

	1 <= nums.length <= 1000
	0 <= nums[i] <= 10^6
	1 <= k <= min(50, nums.length)

分析
1. 范围分析：range 必然在 [0, sum of nums]
2. 单调性分析：range 越大，则需要更少的份数即可满足条件
3. f 函数分析：给定 nums 和 range，问分出的份数是否小于等于 k
*/
export function splitArray(nums: number[], k: number): number {
    let l = 0;
    let r = nums.reduce((sum, cur) => sum + cur);
    let result = 0;
    while (l <= r) {
        const m = l + ((r - l) >> 1);
        if (canSplit(nums, k, m)) {
            result = m;
            r = m - 1;
        } else {
            l = m + 1;
        }
    }

    return result;
}

function canSplit(nums: number[], k: number, range: number): boolean {
    let parts = 1;
    let sum = 0;
    let i = 0;
    while (i < nums.length) {
        if (nums[i] > range) {
            return false;
        }

        if (sum + nums[i] > range) {
            parts++;
            sum = nums[i++];
        } else {
            sum += nums[i++];
        }
    }

    return parts <= k;
}

/*
https://leetcode.com/problems/find-k-th-smallest-pair-distance/description/
719. Find K-th Smallest Pair Distance
The distance of a pair of integers a and b is defined as the absolute difference between a and b.

Given an integer array nums and an integer k, return the kth smallest distance among all the pairs nums[i] and nums[j] where 0 <= i < j < nums.length.

Example 1:

Input: nums = [1,3,1], k = 1
Output: 0
Explanation: Here are all the pairs:
(1,3) -> 2
(1,1) -> 0
(3,1) -> 2
Then the 1st smallest distance pair is (1,1), and its distance is 0.

Example 2:

Input: nums = [1,1,1], k = 2
Output: 0

Example 3:

Input: nums = [1,6,1], k = 3
Output: 5

Constraints:

	n == nums.length
	2 <= n <= 10^4
	0 <= nums[i] <= 10^6
	1 <= k <= n * (n - 1) / 2
*/
export function smallestDistancePair(nums: number[], k: number): number {
    nums.sort((a, b) => a - b);

    let l = 0;
    let r = nums[nums.length - 1] - nums[0];
    let distance = -1;
    while (l <= r) {
        const m = l + ((r - l) >> 1);
        if (countPairsWithSmallerDistance(nums, m) >= k) {
            distance = m;
            r = m - 1;
        } else {
            l = m + 1;
        }
    }

    return distance;
}

function countPairsWithSmallerDistance(
    nums: number[],
    distance: number
): number {
    let count = 0;
    const n = nums.length;
    for (let i = 0; i < n - 1; i++) {
        if (nums[i + 1] - nums[i] > distance) {
            continue;
        }

        let l = i + 1;
        let r = n - 1;
        let rightBound = i + 1;
        while (l <= r) {
            const m = l + ((r - l) >> 1);
            if (nums[m] - nums[i] <= distance) {
                rightBound = m;
                l = m + 1;
            } else {
                r = m - 1;
            }
        }

        count += rightBound - i;
    }

    return count;
}

/*
https://leetcode.com/problems/shortest-subarray-with-sum-at-least-k/description/
862. Shortest Subarray with Sum at Least K
Given an integer array nums and an integer k, return the length of the shortest non-empty subarray of 
nums with a sum of at least k. If there is no such subarray, return -1.

A subarray is a contiguous part of an array.

Example 1:
Input: nums = [1], k = 1
Output: 1
Example 2:
Input: nums = [1,2], k = 4
Output: -1
Example 3:
Input: nums = [2,-1,2], k = 3
Output: 3

Constraints:

	1 <= nums.length <= 10^5
	-10^5 <= nums[i] <= 10^5
	1 <= k <= 10^9
*/
export function shortestSubarray(nums: number[], k: number): number {
    const minQ: number[] = [];
    const prefix: number[] = Array(nums.length);
    let i = 0;
    let sum = 0;
    let min = Infinity;
    while (i < nums.length) {
        sum += nums[i];
        prefix[i] = sum;
        if (sum >= k) {
            min = Math.min(min, i + 1);
        }

        while (minQ.length && prefix[minQ[minQ.length - 1]] >= sum) {
            minQ.pop();
        }
        minQ.push(i);

        while (minQ.length && prefix[minQ[0]] <= sum - k) {
            min = Math.min(min, i - minQ[0]);
            minQ.shift();
        }
        i++;
    }

    return min === Infinity ? -1 : min;
}

/*
https://leetcode.com/problems/couples-holding-hands/description/
765. Couples Holding Hands
There are n couples sitting in 2n seats arranged in a row and want to hold hands.

The people and seats are represented by an integer array row where row[i] is the ID of 
the person sitting in the ith seat. The couples are numbered in order, the first couple being (0, 1), 
the second couple being (2, 3), and so on with the last couple being (2n - 2, 2n - 1).

Return the minimum number of swaps so that every couple is sitting side by side. 
A swap consists of choosing any two people, then they stand up and switch seats.

Example 1:

Input: row = [0,2,1,3]
Output: 1
Explanation: We only need to swap the second (row[1]) and third (row[2]) person.

Example 2:

Input: row = [3,2,0,1]
Output: 0
Explanation: All couples are already seated side by side.

Constraints:

	2n == row.length
	2 <= n <= 30
	n is even.
	0 <= row[i] < 2n
	All the elements of row are unique.
*/
export function minSwapsCouples(row: number[]): number {
    const n = row.length;
    const couples = n >> 1;
    const unionFind = new UnionFind(couples);
    let sets = couples;

    for (let i = 0; i < n; i += 2) {
        const a = row[i] >> 1;
        const b = row[i + 1] >> 1;
        if (a !== b && !unionFind.isSameSet(a, b)) {
            unionFind.union(a, b);
            sets--;
        }
    }

    return couples - sets;
}

/*
https://leetcode.com/problems/similar-string-groups/description/
839. Similar String Groups
Two strings, X and Y, are considered similar if either they are identical or we can make them 
equivalent by swapping at most two letters (in distinct positions) within the string X.

For example, "tars" and "rats" are similar (swapping at positions 0 and 2), and "rats" 
and "arts" are similar, but "star" is not similar to "tars", "rats", or "arts".

Together, these form two connected groups by similarity: {"tars", "rats", "arts"} and {"star"}.  
Notice that "tars" and "arts" are in the same group even though they are not similar.  
Formally, each group is such that a word is in the group if and only if it is similar to at 
least one other word in the group.

We are given a list strs of strings where every string in strs is an anagram of 
every other string in strs. How many groups are there?

Example 1:

Input: strs = ["tars","rats","arts","star"]
Output: 2

Example 2:

Input: strs = ["omv","ovm"]
Output: 1

Constraints:

	1 <= strs.length <= 300
	1 <= strs[i].length <= 300
	strs[i] consists of lowercase letters only.
	All words in strs have the same length and are anagrams of each other.
*/
export function numSimilarGroups(strs: string[]): number {
    const n = strs.length;
    const unionFind = new UnionFind(n);
    let sets = n;

    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            if (!unionFind.isSameSet(i, j) && isSimilar(strs[i], strs[j])) {
                unionFind.union(i, j);
                sets--;
            }
        }
    }

    return sets;
}

function isSimilar(a: string, b: string): boolean {
    let i = 0;
    let n = a.length;
    let diff = 0;

    while (i < n) {
        if (a[i] !== b[i]) {
            diff++;
        }
        if (diff >= 3) {
            return false;
        }
        i++;
    }

    return true;
}

/*
https://leetcode.com/problems/maximum-score-words-formed-by-letters/description/?envType=daily-question&envId=2024-05-24
1255. Maximum Score Words Formed by Letters
Given a list of words, list of  single letters (might be repeating) and score of every character.

Return the maximum score of any valid set of words formed by using the given letters (words[i] cannot be used two or more times).

It is not necessary to use all characters in letters and each letter can only be used once. Score of letters 'a', 'b', 'c', ... ,'z' is given by score[0], score[1], ... , score[25] respectively.

Example 1:

Input: words = ["dog","cat","dad","good"], letters = ["a","a","c","d","d","d","g","o","o"], score = [1,0,9,5,0,0,3,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0]
Output: 23
Explanation:
Score  a=1, c=9, d=5, g=3, o=2
Given letters, we can form the words "dad" (5+1+5) and "good" (3+2+2+5) with a score of 23.
Words "dad" and "dog" only get a score of 21.

Example 2:

Input: words = ["xxxz","ax","bx","cx"], letters = ["z","a","b","c","x","x","x"], score = [4,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,0,10]
Output: 27
Explanation:
Score  a=4, b=4, c=4, x=5, z=10
Given letters, we can form the words "ax" (4+5), "bx" (4+5) and "cx" (4+5) with a score of 27.
Word "xxxz" only get a score of 25.

Example 3:

Input: words = ["leetcode"], letters = ["l","e","t","c","o","d"], score = [0,0,1,1,1,0,0,0,0,0,0,1,0,0,1,0,0,0,0,1,0,0,0,0,0,0]
Output: 0
Explanation:
Letter "e" can only be used once.

Constraints:

	1 <= words.length <= 14
	1 <= words[i].length <= 15
	1 <= letters.length <= 100
	letters[i].length == 1
	score.length == 26
	0 <= score[i] <= 10
	words[i], letters[i] contains only lower case English letters.
*/
export function maxScoreWords(
    words: string[],
    letters: string[],
    score: number[]
): number {
    const freq = Array(26).fill(0);
    letters.forEach((l) => {
        freq[getCharIndex(l)]++;
    });

    const subsets = getAllSubsets(words);
    let max = 0;

    subsets.forEach((subset) => {
        const f = freq.slice();
        let cur = 0;
        subset.forEach((w) => {
            let wCur = 0;
            for (let i = 0; i < w.length; i++) {
                const index = getCharIndex(w[i]);
                if (f[index] === 0) {
                    return;
                }

                f[index]--;
                wCur += score[index];
            }
            cur += wCur;
        });

        max = Math.max(max, cur);
    });

    return max;
}

function getAllSubsets(words: string[]) {
    const subsets: string[][] = [];
    const backtracking = (i: number, path: string[]) => {
        if (i === words.length) {
            subsets.push(path.slice());
            return;
        }

        path.push(words[i]);
        backtracking(i + 1, path);
        path.pop();

        backtracking(i + 1, path);
    };
    backtracking(0, []);

    return subsets;
}

/*
https://leetcode.com/problems/word-break-ii/description/
140. Word Break II
Given a string s and a dictionary of strings wordDict, add spaces in s to construct a sentence where each word is a valid dictionary word. Return all such possible sentences in any order.

Note that the same word in the dictionary may be reused multiple times in the segmentation.

Example 1:

Input: s = "catsanddog", wordDict = ["cat","cats","and","sand","dog"]
Output: ["cats and dog","cat sand dog"]

Example 2:

Input: s = "pineapplepenapple", wordDict = ["apple","pen","applepen","pine","pineapple"]
Output: ["pine apple pen apple","pineapple pen apple","pine applepen apple"]
Explanation: Note that you are allowed to reuse a dictionary word.

Example 3:

Input: s = "catsandog", wordDict = ["cats","dog","sand","and","cat"]
Output: []

Constraints:

	1 <= s.length <= 20
	1 <= wordDict.length <= 1000
	1 <= wordDict[i].length <= 10
	s and wordDict[i] consist of only lowercase English letters.
	All the strings of wordDict are unique.
	Input is generated in a way that the length of the answer doesn't exceed 105.
*/
export function wordBreak(s: string, wordDict: string[]): string[] {
    const set = new Set<string>();
    let min = 0;
    let max = 0;
    wordDict.forEach((w) => {
        min = Math.min(min, w.length);
        max = Math.max(max, w.length);
        set.add(w);
    });

    const result: string[] = [];
    const backtracking = (index: number, path: string) => {
        if (index === s.length) {
            result.push(path.trim());
            return;
        }

        for (let l = min; l <= max; l++) {
            const w = s.slice(index, index + l);
            if (set.has(w)) {
                backtracking(index + l, path + ' ' + w);
            }
        }
    };
    backtracking(0, '');

    return result;
}

/*
https://leetcode.com/problems/find-the-maximum-sum-of-node-values/description/?envType=daily-question&envId=2024-05-19
3068. Find the Maximum Sum of Node Values
There exists an undirected tree with n nodes numbered 0 to n - 1. You are given a 0-indexed 2D integer array edges of length n - 1, 
where edges[i] = [ui, vi] indicates that there is an edge between nodes ui and vi in the tree. You are also given a positive integer k, 
and a 0-indexed array of non-negative integers nums of length n, where nums[i] represents the value of the node numbered i.

Alice wants the sum of values of tree nodes to be maximum, for which Alice can perform the following operation any number 
of times (including zero) on the tree:

	Choose any edge [u, v] connecting the nodes u and v, and update their values as follows:

		nums[u] = nums[u] XOR k
		nums[v] = nums[v] XOR k

Return the maximum possible sum of the values Alice can achieve by performing the operation any number of times.

Example 1:

Input: nums = [1,2,1], k = 3, edges = [[0,1],[0,2]]
Output: 6
Explanation: Alice can achieve the maximum sum of 6 using a single operation:
- Choose the edge [0,2]. nums[0] and nums[2] become: 1 XOR 3 = 2, and the array nums becomes: [1,2,1] -> [2,2,2].
The total sum of values is 2 + 2 + 2 = 6.
It can be shown that 6 is the maximum achievable sum of values.

Example 2:

Input: nums = [2,3], k = 7, edges = [[0,1]]
Output: 9
Explanation: Alice can achieve the maximum sum of 9 using a single operation:
- Choose the edge [0,1]. nums[0] becomes: 2 XOR 7 = 5 and nums[1] become: 3 XOR 7 = 4, and the array nums becomes: [2,3] -> [5,4].
The total sum of values is 5 + 4 = 9.
It can be shown that 9 is the maximum achievable sum of values.

Example 3:

Input: nums = [7,7,7,7,7,7], k = 3, edges = [[0,1],[0,2],[0,3],[0,4],[0,5]]
Output: 42
Explanation: The maximum achievable sum is 42 which can be achieved by Alice performing no operations.

Constraints:

	2 <= n == nums.length <= 10^4
	1 <= k <= 10^9
	0 <= nums[i] <= 10^9
	edges.length == n - 1
	edges[i].length == 2
	0 <= edges[i][0], edges[i][1] <= n - 1
	The input is generated such that edges represent a valid tree.
*/
export function maximumValueSum(
    nums: number[],
    k: number,
    _edges: number[][]
): number {
    const sum = nums.reduce((s, c) => s + c, 0);
    let minDiff = Infinity;
    let diff = 0;
    let diffCount = 0;
    nums.forEach((n) => {
        const d = (n ^ k) - n;
        if (d > 0) {
            diff += d;
            diffCount++;
        }
        minDiff = Math.min(minDiff, Math.abs(d));
    });

    if ((diffCount & 1) === 1) {
        diff -= minDiff;
    }

    return sum + diff;
}

/*
https://leetcode.com/problems/number-of-good-paths/description/
2421. Number of Good Paths
There is a tree (i.e. a connected, undirected graph with no cycles) consisting of n nodes numbered from 0 to n - 1 and exactly n - 1 edges.

You are given a 0-indexed integer array vals of length n where vals[i] denotes the value of the ith node. You are also given 
a 2D integer array edges where edges[i] = [ai, bi] denotes that there exists an undirected edge connecting nodes ai and bi.

A good path is a simple path that satisfies the following conditions:

	The starting node and the ending node have the same value.
	All nodes between the starting node and the ending node have values less than or equal to the starting node 
    (i.e. the starting node's value should be the maximum value along the path).

Return the number of distinct good paths.

Note that a path and its reverse are counted as the same path. For example, 0 -> 1 is considered to be the same as 1 -> 0. 
A single node is also considered as a valid path.

Example 1:

Input: vals = [1,3,2,1,3], edges = [[0,1],[0,2],[2,3],[2,4]]
Output: 6
Explanation: There are 5 good paths consisting of a single node.
There is 1 additional good path: 1 -> 0 -> 2 -> 4.
(The reverse path 4 -> 2 -> 0 -> 1 is treated as the same as 1 -> 0 -> 2 -> 4.)
Note that 0 -> 2 -> 3 is not a good path because vals[2] > vals[0].

Example 2:

Input: vals = [1,1,2,2,3], edges = [[0,1],[1,2],[2,3],[2,4]]
Output: 7
Explanation: There are 5 good paths consisting of a single node.
There are 2 additional good paths: 0 -> 1 and 2 -> 3.

Example 3:

Input: vals = [1], edges = []
Output: 1
Explanation: The tree consists of only one node, so there is one good path.

Constraints:

	n == vals.length
	1 <= n <= 10^4
	0 <= vals[i] <= 10^5
	edges.length == n - 1
	edges[i].length == 2
	0 <= ai, bi < n
	ai != bi
	edges represents a valid tree.
*/
export function numberOfGoodPaths(vals: number[], edges: number[][]): number {
    let count = vals.length;
    const unionFind = new UnionFind(count);
    const map = new Map<number, [max: number, count: number]>();
    vals.forEach((val, i) => {
        map.set(i, [val, 1]);
    });

    edges
        .sort(
            ([a, b], [c, d]) =>
                Math.max(vals[a], vals[b]) - Math.max(vals[c], vals[d])
        )
        .forEach(([a, b]) => {
            const pA = unionFind.find(a);
            const pB = unionFind.find(b);
            const [maxA, countA] = map.get(pA)!;
            const [maxB, countB] = map.get(pB)!;

            unionFind.union(pA, pB);
            const newP = unionFind.find(pA);
            if (maxA === maxB) {
                count += countA * countB;
                map.set(newP, [maxA, countA + countB]);
            } else if (maxA > maxB) {
                map.set(newP, [maxA, countA]);
            } else {
                map.set(newP, [maxB, countB]);
            }
        });

    return count;
}

/*
https://leetcode.com/problems/making-a-large-island/description/
827. Making A Large Island
You are given an n x n binary matrix grid. You are allowed to change at most one 0 to be 1.

Return the size of the largest island in grid after applying this operation.

An island is a 4-directionally connected group of 1s.

Example 1:

Input: grid = [[1,0],[0,1]]
Output: 3
Explanation: Change one 0 to 1 and connect two 1s, then we get an island with area = 3.

Example 2:

Input: grid = [[1,1],[1,0]]
Output: 4
Explanation: Change the 0 to 1 and make the island bigger, only one island with area = 4.

Example 3:

Input: grid = [[1,1],[1,1]]
Output: 4
Explanation: Can't change any 0 to 1, only one island with area = 4.

Constraints:

	n == grid.length
	n == grid[i].length
	1 <= n <= 500
	grid[i][j] is either 0 or 1.
*/
export function largestIsland(grid: number[][]): number {
    let id = 2;
    const m = grid.length;
    const n = grid[0].length;
    const islandCount: number[] = [];

    const moves: number[] = [-1, 0, 1, 0, -1];
    const infect = (i: number, j: number) => {
        if (i < 0 || i >= m || j < 0 || j >= n || grid[i][j] !== 1) {
            return;
        }

        grid[i][j] = id;
        islandCount[id] = (islandCount[id] || 0) + 1;
        for (let k = 0; k < moves.length - 1; k++) {
            infect(i + moves[k], j + moves[k + 1]);
        }
    };

    let max = 0;
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (grid[i][j] === 1) {
                infect(i, j);
                max = Math.max(max, islandCount[id++]);
            }
        }
    }

    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (grid[i][j] === 0) {
                const set = new Set<number>();
                for (let k = 0; k < moves.length - 1; k++) {
                    const nextI = i + moves[k];
                    const nextJ = j + moves[k + 1];

                    if (
                        nextI >= 0 &&
                        nextI < m &&
                        nextJ >= 0 &&
                        nextJ < n &&
                        grid[nextI][nextJ]
                    ) {
                        set.add(grid[nextI][nextJ]);
                    }
                }

                max = Math.max(
                    max,
                    Array.from(set).reduce((s, c) => s + islandCount[c], 1)
                );
            }
        }
    }

    return max;
}

/*
https://leetcode.com/problems/russian-doll-envelopes/description/
354. Russian Doll Envelopes
You are given a 2D array of integers envelopes where envelopes[i] = [wi, hi] represents the width and the height of an envelope.

One envelope can fit into another if and only if both the width and height of one envelope are greater than the other envelope's width and height.

Return the maximum number of envelopes you can Russian doll (i.e., put one inside the other).

Note: You cannot rotate an envelope.

Example 1:

Input: envelopes = [[5,4],[6,4],[6,7],[2,3]]
Output: 3
Explanation: The maximum number of envelopes you can Russian doll is 3 ([2,3] => [5,4] => [6,7]).

Example 2:

Input: envelopes = [[1,1],[1,1],[1,1]]
Output: 1

Constraints:

	1 <= envelopes.length <= 10^5
	envelopes[i].length == 2
	1 <= wi, hi <= 10^5
*/
export function maxEnvelopes(envelopes: number[][]): number {
    const heights = envelopes
        .sort(([wa, ha], [wb, hb]) => wa - wb || hb - ha)
        .map(([, h]) => h);

    const ends: number[] = [];
    let max = -Infinity;
    heights.forEach((v) => {
        let l = 0;
        let r = ends.length - 1;
        let closest = r + 1;
        while (l <= r) {
            const m = l + ((r - l) >> 1);
            if (ends[m] >= v) {
                closest = m;
                r = m - 1;
            } else {
                l = m + 1;
            }
        }

        ends[closest] = v;
        max = Math.max(max, closest + 1);
    });

    return max;
}

/*
https://leetcode.com/problems/minimum-number-of-k-consecutive-bit-flips/description/
995. Minimum Number of K Consecutive Bit Flips
You are given a binary array nums and an integer k.

A k-bit flip is choosing a subarray of length k from nums and simultaneously changing every 0 in the subarray to 1, and every 1 in the subarray to 0.

Return the minimum number of k-bit flips required so that there is no 0 in the array. If it is not possible, return -1.

A subarray is a contiguous part of an array.

Example 1:

Input: nums = [0,1,0], k = 1
Output: 2
Explanation: Flip nums[0], then flip nums[2].

Example 2:

Input: nums = [1,1,0], k = 2
Output: -1
Explanation: No matter how we flip subarrays of size 2, we cannot make the array become [1,1,1].

Example 3:

Input: nums = [0,0,0,1,0,1,1,0], k = 3
Output: 3
Explanation: 
Flip nums[0],nums[1],nums[2]: nums becomes [1,1,1,1,0,1,1,0]
Flip nums[4],nums[5],nums[6]: nums becomes [1,1,1,1,1,0,0,0]
Flip nums[5],nums[6],nums[7]: nums becomes [1,1,1,1,1,1,1,1]

Constraints:

	1 <= nums.length <= 10^5
	1 <= k <= nums.length

There is only one way to filp A[0],
and A[0] will tell us if we need to filp the range A[0] ~ A[K -1].
So we start from the leftmost one by one using a greedy idea to solve this problem.

Create a new array isFlipped[n].
isFlipped[i] = 1 if we flip K consecutive bits starting at A[i].

We maintain a variable flipped and flipped = 1 if the current bit is flipped.

If flipped = 0 and A[i] = 0, we need to flip at A[i].
If flipped = 1 and A[i] = 1, we need to flip at A[i].
*/
export function minKBitFlips(nums: number[], k: number): number {
    const n = nums.length;
    let flipped = 0;
    const isFlipped = Array(n).fill(0);

    let count = 0;
    for (let i = 0; i < n; i++) {
        if (i >= k) {
            flipped ^= isFlipped[i - k];
        }
        if (flipped === nums[i]) {
            if (i + k > n) {
                return -1;
            }
            isFlipped[i] = 1;
            flipped ^= 1;
            count++;
        }
    }

    return count;
}

/*
https://leetcode.com/problems/minimum-falling-path-sum-ii/description/?envType=daily-question&envId=2024-04-26
1289. Minimum Falling Path Sum II
Given an n x n integer matrix grid, return the minimum sum of a falling path with non-zero shifts.

A falling path with non-zero shifts is a choice of exactly one element from each row of grid such that no two elements chosen in adjacent rows are in the same column.

Example 1:

Input: grid = [[1,2,3],[4,5,6],[7,8,9]]
Output: 13
Explanation: 
The possible falling paths are:
[1,5,9], [1,5,7], [1,6,7], [1,6,8],
[2,4,8], [2,4,9], [2,6,7], [2,6,8],
[3,4,8], [3,4,9], [3,5,7], [3,5,9]
The falling path with the smallest sum is [1,5,7], so the answer is 13.

Example 2:

Input: grid = [[7]]
Output: 7

Constraints:

	n == grid.length == grid[i].length
	1 <= n <= 200
	-99 <= grid[i][j] <= 99
*/
export function minFallingPathSum(grid: number[][]): number {
    const n = grid.length;
    const dp: number[] = Array(n);
    for (let j = 0; j < n; j++) {
        dp[j] = grid[0][j];
    }

    for (let i = 1; i < n; i++) {
        let min = Infinity;
        let minIndex = -1;
        let secondMin = Infinity;
        for (let k = 0; k < n; k++) {
            if (dp[k] < min) {
                secondMin = min;
                min = dp[k];
                minIndex = k;
            } else if (dp[k] >= min && dp[k] < secondMin) {
                secondMin = dp[k];
            }
        }

        for (let j = 0; j < n; j++) {
            dp[j] = (j === minIndex ? secondMin : min) + grid[i][j];
        }
    }

    return Math.min(...dp);
}

/*
https://leetcode.com/problems/remove-max-number-of-edges-to-keep-graph-fully-traversable/description/?envType=daily-question&envId=2024-06-30
1579. Remove Max Number of Edges to Keep Graph Fully Traversable
Alice and Bob have an undirected graph of n nodes and three types of edges:

	Type 1: Can be traversed by Alice only.
	Type 2: Can be traversed by Bob only.
	Type 3: Can be traversed by both Alice and Bob.

Given an array edges where edges[i] = [typei, ui, vi] represents a bidirectional edge of type typei between nodes ui and vi, find the maximum number of edges you can remove so that after removing the edges, the graph can still be fully traversed by both Alice and Bob. The graph is fully traversed by Alice and Bob if starting from any node, they can reach all other nodes.

Return the maximum number of edges you can remove, or return -1 if Alice and Bob cannot fully traverse the graph.

Example 1:

Input: n = 4, edges = [[3,1,2],[3,2,3],[1,1,3],[1,2,4],[1,1,2],[2,3,4]]
Output: 2
Explanation: If we remove the 2 edges [1,1,2] and [1,1,3]. The graph will still be fully traversable by Alice and Bob. Removing any additional edge will not make it so. So the maximum number of edges we can remove is 2.

Example 2:

Input: n = 4, edges = [[3,1,2],[3,2,3],[1,1,4],[2,1,4]]
Output: 0
Explanation: Notice that removing any edge will not make the graph fully traversable by Alice and Bob.

Example 3:

Input: n = 4, edges = [[3,2,3],[1,1,2],[2,3,4]]
Output: -1
Explanation: In the current graph, Alice cannot reach node 4 from the other nodes. Likewise, Bob cannot reach 1. Therefore it's impossible to make the graph fully traversable.

Constraints:

	1 <= n <= 10^5
	1 <= edges.length <= min(105, 3 * n * (n - 1) / 2)
	edges[i].length == 3
	1 <= typei <= 3
	1 <= ui < vi <= n
	All tuples (typei, ui, vi) are distinct.
*/
export function maxNumEdgesToRemove(n: number, edges: number[][]): number {
    const alice = new UnionFind(n);
    const bob = new UnionFind(n);
    let set = n;
    let max = 0;
    for (const [type, from, to] of edges) {
        if (type !== 3) {
            continue;
        }

        if (alice.isSameSet(from, to)) {
            max++;
        } else {
            alice.union(from, to);
            bob.union(from, to);
            set--;
        }
    }

    let aliceSet = set;
    let bobSet = set;
    for (const [type, from, to] of edges) {
        if (type === 1) {
            if (alice.isSameSet(from, to)) {
                max++;
            } else {
                alice.union(from, to);
                aliceSet--;
            }
        }

        if (type === 2) {
            if (bob.isSameSet(from, to)) {
                max++;
            } else {
                bob.union(from, to);
                bobSet--;
            }
        }
    }

    return aliceSet === 1 && bobSet === 1 ? max : -1;
}

/*
https://leetcode.com/problems/freedom-trail/description/?envType=daily-question&envId=2024-04-27
514. Freedom Trail
In the video game Fallout 4, the quest "Road to Freedom" requires players to reach a metal dial called the "Freedom Trail Ring" and use the dial to spell a specific keyword to open the door.

Given a string ring that represents the code engraved on the outer ring and another string key that represents the keyword that needs to be spelled, return the minimum number of steps to spell all the characters in the keyword.

Initially, the first character of the ring is aligned at the "12:00" direction. You should spell all the characters in key one by one by rotating ring clockwise or anticlockwise to make each character of the string key aligned at the "12:00" direction and then by pressing the center button.

At the stage of rotating the ring to spell the key character key[i]:

	You can rotate the ring clockwise or anticlockwise by one place, which counts as one step. The final purpose of the rotation is to align one of ring's characters at the "12:00" direction, where this character must equal key[i].
	If the character key[i] has been aligned at the "12:00" direction, press the center button to spell, which also counts as one step. After the pressing, you could begin to spell the next character in the key (next stage). Otherwise, you have finished all the spelling.

Example 1:

Input: ring = "godding", key = "gd"
Output: 4
Explanation:
For the first key character 'g', since it is already in place, we just need 1 step to spell this character. 
For the second key character 'd', we need to rotate the ring "godding" anticlockwise by two steps to make it become "ddinggo".
Also, we need 1 more step for spelling.
So the final output is 4.

Example 2:

Input: ring = "godding", key = "godding"
Output: 13

Constraints:

	1 <= ring.length, key.length <= 100
	ring and key consist of only lower case English letters.
	It is guaranteed that key could always be spelled by rotating ring.
*/
export function findRotateSteps(ring: string, key: string): number {
    const indexMap: Record<string, number[]> = {};
    for (let i = 0, c = ring[i]; i < ring.length; c = ring[++i]) {
        if (indexMap[c]) {
            indexMap[c].push(i);
        } else {
            indexMap[c] = [i];
        }
    }

    const dfs = cache((ringIndex: number, keyIndex: number): number => {
        if (keyIndex === key.length) {
            return 0;
        }

        let ret = Infinity;
        let c = key[keyIndex];
        for (const i of indexMap[c]) {
            let d1 = Math.abs(i - ringIndex);
            let d2 = ring.length - i;
            let min = Math.min(d1, d2);
            ret = Math.min(ret, min + dfs(i, keyIndex + 1));
        }

        return ret;
    });

    return key.length + dfs(0, 0);
}

/*
https://leetcode.com/problems/sum-of-distances-in-tree/description/?envType=daily-question&envId=2024-04-28
834. Sum of Distances in Tree
There is an undirected connected tree with n nodes labeled from 0 to n - 1 and n - 1 edges.

You are given the integer n and the array edges where edges[i] = [ai, bi] indicates that there is an edge between nodes ai and bi in the tree.

Return an array answer of length n where answer[i] is the sum of the distances between the ith node in the tree and all other nodes.

Example 1:

Input: n = 6, edges = [[0,1],[0,2],[2,3],[2,4],[2,5]]
Output: [8,12,6,10,10,10]
Explanation: The tree is shown above.
We can see that dist(0,1) + dist(0,2) + dist(0,3) + dist(0,4) + dist(0,5)
equals 1 + 1 + 2 + 2 + 2 = 8.
Hence, answer[0] = 8, and so on.

Example 2:

Input: n = 1, edges = []
Output: [0]

Example 3:

Input: n = 2, edges = [[1,0]]
Output: [1,1]

Constraints:

	1 <= n <= 10^4
	edges.length == n - 1
	edges[i].length == 2
	0 <= ai, bi < n
	ai != bi
	The given input represents a valid tree.
*/
export function sumOfDistancesInTree(n: number, edges: number[][]): number[] {
    const tree: number[][] = Array.from({ length: n }, () => []);
    const res: number[] = Array(n).fill(0);
    const count: number[] = Array(n).fill(1);

    // Build the tree using adjacency list
    for (const [u, v] of edges) {
        tree[u].push(v);
        tree[v].push(u);
    }

    // First DFS to calculate subtree sizes and root distances
    function dfs(node: number, parent: number) {
        for (const neighbor of tree[node]) {
            if (neighbor !== parent) {
                dfs(neighbor, node);
                count[node] += count[neighbor];
                res[node] += res[neighbor] + count[neighbor];
            }
        }
    }

    // Second DFS to calculate result for all nodes
    function dfs2(node: number, parent: number) {
        for (const neighbor of tree[node]) {
            if (neighbor !== parent) {
                res[neighbor] =
                    res[node] - count[neighbor] + (n - count[neighbor]);
                dfs2(neighbor, node);
            }
        }
    }

    dfs(0, -1);
    dfs2(0, -1);

    return res;
}

/*
https://leetcode.com/problems/maximum-value-of-k-coins-from-piles/description/
2218. Maximum Value of K Coins From Piles
There are n piles of coins on a table. Each pile consists of a positive number of coins of assorted denominations.

In one move, you can choose any coin on top of any pile, remove it, and add it to your wallet.

Given a list piles, where piles[i] is a list of integers denoting the composition of the ith pile from top to bottom, and a positive integer k, return the maximum total value of coins you can have in your wallet if you choose exactly k coins optimally.

Example 1:

Input: piles = [[1,100,3],[7,8,9]], k = 2
Output: 101
Explanation:
The above diagram shows the different ways we can choose k coins.
The maximum total we can obtain is 101.

Example 2:

Input: piles = [[100],[100],[100],[100],[100],[100],[1,1,1,1,1,1,700]], k = 7
Output: 706
Explanation:
The maximum total can be obtained if we choose all coins from the last pile.

Constraints:

	n == piles.length
	1 <= n <= 1000
	1 <= piles[i][j] <= 10^5
	1 <= k <= sum(piles[i].length) <= 2000
*/
export function maxValueOfCoins(piles: number[][], k: number): number {
    const n = piles.length;
    const dp: number[] = Array(k + 1).fill(0);

    for (let i = 1; i <= n; i++) {
        const pile = piles[i - 1];
        const max = Math.min(k, pile.length);
        const prefix: number[] = [pile[0]];
        for (let j = 1; j < max; j++) {
            prefix[j] = prefix[j - 1] + pile[j];
        }

        for (let j = k; j >= 0; j--) {
            for (let l = Math.min(max - 1, j - 1); l >= 0; l--) {
                dp[j] = Math.max(dp[j], dp[j - l - 1] + prefix[l]);
            }
        }
    }

    return dp[k];
}

/*
https://leetcode.com/problems/minimum-number-of-days-to-disconnect-island/description/
1568. Minimum Number of Days to Disconnect Island
You are given an m x n binary grid grid where 1 represents land and 0 represents water. An island is a maximal 4-directionally (horizontal or vertical) connected group of 1's.

The grid is said to be connected if we have exactly one island, otherwise is said disconnected.

In one day, we are allowed to change any single land cell (1) into a water cell (0).

Return the minimum number of days to disconnect the grid.

Example 1:

Input: grid = [[0,1,1,0],[0,1,1,0],[0,0,0,0]]

Output: 2
Explanation: We need at least 2 days to get a disconnected grid.
Change land grid[1][1] and grid[0][2] to water and get 2 disconnected island.

Example 2:

Input: grid = [[1,1]]
Output: 2
Explanation: Grid of full water is also disconnected ([[1,1]] -> [[0,0]]), 0 islands.

Constraints:

	m == grid.length
	n == grid[i].length
	1 <= m, n <= 30
	grid[i][j] is either 0 or 1.
*/
export function minDays(grid: number[][]): number {
    const m = grid.length;
    const n = grid[0].length;

    const directions = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
    ];

    const isInBounds = (x: number, y: number): boolean => {
        return x >= 0 && x < m && y >= 0 && y < n;
    };

    const dfs = (x: number, y: number, visited: boolean[][]): void => {
        visited[x][y] = true;
        for (const [dx, dy] of directions) {
            const nx = x + dx;
            const ny = y + dy;
            if (isInBounds(nx, ny) && grid[nx][ny] === 1 && !visited[nx][ny]) {
                dfs(nx, ny, visited);
            }
        }
    };

    const countIslands = (): number => {
        const visited = Array.from({ length: m }, () => Array(n).fill(false));
        let count = 0;
        for (let i = 0; i < m; i++) {
            for (let j = 0; j < n; j++) {
                if (grid[i][j] === 1 && !visited[i][j]) {
                    count++;
                    dfs(i, j, visited);
                }
            }
        }
        return count;
    };

    if (countIslands() !== 1) return 0;

    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (grid[i][j] === 1) {
                grid[i][j] = 0;
                if (countIslands() !== 1) return 1;
                grid[i][j] = 1;
            }
        }
    }

    return 2;
}

/*
https://leetcode.com/problems/strange-printer/description/?envType=daily-question&envId=2024-08-21
664. Strange Printer
There is a strange printer with the following two special properties:

	The printer can only print a sequence of the same character each time.
	At each turn, the printer can print new characters starting from and ending at any place and will cover the original existing characters.

Given a string s, return the minimum number of turns the printer needed to print it.

Example 1:

Input: s = "aaabbb"
Output: 2
Explanation: Print "aaa" first and then print "bbb".

Example 2:

Input: s = "aba"
Output: 2
Explanation: Print "aaa" first and then print "b" from the second place of the string, which will cover the existing character 'a'.

Constraints:

	1 <= s.length <= 100
	s consists of lowercase English letters.
*/
export function strangePrinter(s: string): number {
    const n = s.length;
    const dp: number[][] = Array.from({ length: n }, () => Array(n).fill(0));

    for (let i = n - 1; i >= 0; i--) {
        dp[i][i] = 1;
        for (let j = i + 1; j < n; j++) {
            dp[i][j] = dp[i][j - 1] + 1;
            for (let k = i; k < j; k++) {
                if (s[k] === s[j]) {
                    dp[i][j] = Math.min(
                        dp[i][j],
                        dp[i][k] + (k + 1 <= j - 1 ? dp[k + 1][j - 1] : 0)
                    );
                }
            }
        }
    }

    return dp[0][n - 1];
}

/*
https://leetcode.com/problems/minimum-insertion-steps-to-make-a-string-palindrome/description/
1312. Minimum Insertion Steps to Make a String Palindrome
Given a string s. In one step you can insert any character at any index of the string.

Return the minimum number of steps to make s palindrome.

A Palindrome String is one that reads the same backward as well as forward.

Example 1:

Input: s = "zzazz"
Output: 0
Explanation: The string "zzazz" is already palindrome we do not need any insertions.

Example 2:

Input: s = "mbadm"
Output: 2
Explanation: String can be "mbdadbm" or "mdbabdm".

Example 3:

Input: s = "leetcode"
Output: 5
Explanation: Inserting 5 characters the string becomes "leetcodocteel".

Constraints:

	1 <= s.length <= 500
	s consists of lowercase English letters.
*/
export function minInsertions(s: string): number {
    const n = s.length;
    const dp: number[] = Array(n).fill(0);
    for (let i = n - 2; i >= 0; i--) {
        let leftDown = 0;
        let backup = 0;
        for (let j = i + 1; j < n; j++) {
            backup = dp[j];
            if (s[i] === s[j]) {
                dp[j] = leftDown;
            } else {
                dp[j] = Math.min(dp[j] + 1, dp[j - 1] + 1);
            }
            leftDown = backup;
        }
    }

    return dp[n - 1];
}

/*
https://leetcode.com/problems/find-the-closest-palindrome/description/
564. Find the Closest Palindrome
Given a string n representing an integer, return the closest integer (not including itself), which is a palindrome. If there is a tie, return the smaller one.

The closest is defined as the absolute difference minimized between two integers.

Example 1:

Input: n = "123"
Output: "121"

Example 2:

Input: n = "1"
Output: "0"
Explanation: 0 and 2 are the closest palindromes but we return the smallest which is 0.

Constraints:

	1 <= n.length <= 18
	n consists of only digits.
	n does not have leading zeros.
	n is representing an integer in the range [1, 1018 - 1].
*/
export function nearestPalindromic(n: string): string {
    const length = n.length;
    const candidates = new Set<string>();

    // Edge case for '1'
    if (n === '1') {
        return '0';
    }

    // 1. Consider the mirrored palindrome
    const prefix = n.substring(0, Math.floor((length + 1) / 2));
    const prefixNum = parseInt(prefix);

    // Generate palindromes by decrementing, mirroring, and incrementing the prefix
    for (let i of [prefixNum - 1, prefixNum, prefixNum + 1]) {
        const iStr = i.toString();
        if (length % 2 === 0) {
            candidates.add(iStr + iStr.split('').reverse().join(''));
        } else {
            candidates.add(
                iStr + iStr.slice(0, -1).split('').reverse().join('')
            );
        }
    }

    // 2. Consider palindromes with different lengths
    candidates.add('9'.repeat(length - 1)); // Example: "999" for "1000"
    candidates.add('1' + '0'.repeat(length - 1) + '1'); // Example: "1001" for "999"

    // 3. Remove the original number from candidates if present
    candidates.delete(n);

    // 4. Find the closest palindrome by comparing differences
    let closest: string | null = null;
    for (let candidate of candidates) {
        if (
            closest === null ||
            Math.abs(parseInt(candidate) - parseInt(n)) <
                Math.abs(parseInt(closest) - parseInt(n)) ||
            (Math.abs(parseInt(candidate) - parseInt(n)) ===
                Math.abs(parseInt(closest) - parseInt(n)) &&
                parseInt(candidate) < parseInt(closest))
        ) {
            closest = candidate;
        }
    }

    return closest!;
}

/*
https://leetcode.com/problems/largest-palindrome-product/description/
479. Largest Palindrome Product
Given an integer n, return the largest palindromic integer that can be represented as the product of two n-digits integers. 
Since the answer can be very large, return it modulo 1337.

Example 1:

Input: n = 2
Output: 987
Explanation: 99 x 91 = 9009, 9009 % 1337 = 987

Example 2:

Input: n = 1
Output: 9

Constraints:

	1 <= n <= 8
*/
export function largestPalindrome(n: number): number {
    const start = BigInt('9'.padEnd(n, '9'));
    const end = BigInt('1'.padEnd(n, '0'));

    const isValid = (palindrome: bigint): boolean => {
        for (let i = start; i >= end; i--) {
            if (palindrome / i > i) {
                return false;
            }

            if (palindrome % i === 0n) {
                return true;
            }
        }

        return false;
    };

    let i = BigInt((start * start).toString().slice(0, n));
    let p = 1n;
    while (i >= end) {
        p = BigInt(i.toString() + i.toString().split('').reverse().join(''));
        if (isValid(p)) {
            return Number(p % 1337n);
        }
        i--;
    }

    // when n === 1
    return 9;
}

/*
https://leetcode.com/problems/super-palindromes/description/
906. Super Palindromes
Let's say a positive integer is a super-palindrome if it is a palindrome, and it is also the square of a palindrome.

Given two positive integers left and right represented as strings, return the number of super-palindromes integers in the inclusive range [left, right].

Example 1:

Input: left = "4", right = "1000"
Output: 4
Explanation: 4, 9, 121, and 484 are superpalindromes.
Note that 676 is not a superpalindrome: 26 * 26 = 676, but 26 is not a palindrome.

Example 2:

Input: left = "1", right = "2"
Output: 1

Constraints:

	1 <= left.length, right.length <= 18
	left and right consist of only digits.
	left and right cannot have leading zeros.
	left and right represent integers in the range [1, 10^18 - 1].
	left is less than or equal to right.
*/
export function superpalindromesInRange(left: string, right: string): number {
    const down = BigInt(left);
    const upper = BigInt(right);

    const isValid = (n: string) => {
        const square = BigInt(n) * BigInt(n);
        if (square < down || square > upper) {
            return false;
        }

        const target = square.toString();
        let l = 0;
        let r = target.length - 1;
        while (l < r) {
            if (target[l] !== target[r]) {
                return false;
            }
            l++;
            r--;
        }

        return true;
    };

    const reverse = (part: string) => {
        if (!part) {
            return part;
        }

        return part.split('').reverse().join('');
    };

    const sqrtLeft = sqrtBigInt(down);
    // sqrtBigInt 默认会向下取整，这里加个 1 确保我们不会漏掉一些接近 right 的超级回文数
    const sqrtRight = sqrtBigInt(upper) + 1n;
    const sqrtLeftStr = sqrtLeft.toString();
    const sqrtRightStr = sqrtRight.toString();
    let l = Number(sqrtLeftStr.slice(0, sqrtLeftStr.length >> 1));
    let r = Number(sqrtRightStr.slice(0, (sqrtRightStr.length >> 1) + 1));

    let count = 0;
    while (l <= r) {
        // odd
        const char = String(l);
        let leftPart = char.slice(0, char.length - 1);
        const centerPart = char[char.length - 1];
        if (isValid(`${leftPart}${centerPart}${reverse(leftPart)}`)) {
            count++;
        }

        // even
        leftPart = char;
        if (isValid(`${leftPart}${reverse(leftPart)}`)) {
            count++;
        }

        l++;
    }

    return count;
}

/*
https://leetcode.com/problems/largest-component-size-by-common-factor/description/
952. Largest Component Size by Common Factor
You are given an integer array of unique positive integers nums. Consider the following graph:

	There are nums.length nodes, labeled nums[0] to nums[nums.length - 1],
	There is an undirected edge between nums[i] and nums[j] if nums[i] and nums[j] share a common factor greater than 1.

Return the size of the largest connected component in the graph.

Example 1:

Input: nums = [4,6,15,35]
Output: 4

Example 2:

Input: nums = [20,50,9,63]
Output: 2

Example 3:

Input: nums = [2,3,6,7,4,12,21,39]
Output: 8

Constraints:

	1 <= nums.length <= 10^4
	1 <= nums[i] <= 10^5
	All the values of nums are unique.
*/
export function largestComponentSize(nums: number[]): number {
    const unionFind = new UnionFindWithSize(nums.length);
    const map: Record<number, number> = {};

    nums.forEach((v, i) => {
        const factors = getPrimeFactors(v);

        factors.forEach((f) => {
            if (map[f] === undefined) {
                map[f] = i;
            } else if (!unionFind.isSameSet(map[f], i)) {
                unionFind.union(map[f], i);
            }
        });
    });

    return Math.max(...unionFind.size);
}

/*
https://leetcode.com/problems/shortest-palindrome/description/
214. Shortest Palindrome
You are given a string s. You can convert s to a palindrome by adding characters in front of it.

Return the shortest palindrome you can find by performing this transformation.

Example 1:
Input: s = "aacecaaa"
Output: "aaacecaaa"
Example 2:
Input: s = "abcd"
Output: "dcbabcd"

Constraints:

	0 <= s.length <= 10^4
	s consists of lowercase English letters only.
*/
export function shortestPalindrome(s: string): string {
    const isPalindrome = (left: number, right: number): boolean => {
        while (left < right) {
            if (s[left++] !== s[right--]) {
                return false;
            }
        }

        return true;
    };

    let i = s.length - 1;
    while (i > 0) {
        if (isPalindrome(0, i)) {
            break;
        }
        i--;
    }

    const prefix = s
        .slice(i + 1)
        .split('')
        .reverse()
        .join('');

    return prefix + s;
}

/*
https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iv/description/
188. Best Time to Buy and Sell Stock IV
You are given an integer array prices where prices[i] is the price of a given stock on the ith day, and an integer k.

Find the maximum profit you can achieve. You may complete at most k transactions: i.e. you may buy at most k times and sell at most k times.

Note: You may not engage in multiple transactions simultaneously (i.e., you must sell the stock before you buy again).

Example 1:

Input: k = 2, prices = [2,4,1]
Output: 2
Explanation: Buy on day 1 (price = 2) and sell on day 2 (price = 4), profit = 4-2 = 2.

Example 2:

Input: k = 2, prices = [3,2,6,5,0,3]
Output: 7
Explanation: Buy on day 2 (price = 2) and sell on day 3 (price = 6), profit = 6-2 = 4. Then buy on day 5 (price = 0) and sell on day 6 (price = 3), profit = 3-0 = 3.

Constraints:

	1 <= k <= 100
	1 <= prices.length <= 1000
	0 <= prices[i] <= 1000
*/
export function maxProfit(k: number, prices: number[]): number {
    const dp: number[][] = Array.from({ length: k + 1 }, () =>
        Array(prices.length).fill(0)
    );

    for (let i = 1; i <= k; i++) {
        // https://www.bilibili.com/list/8888480?sort_field=pubtime&spm_id_from=333.999.0.0&oid=494277801&bvid=BV1PN411j7aG
        // 通过画格子观察优化枚举行为
        let prev = dp[i - 1][0] - prices[0];
        for (let j = 1; j < prices.length; j++) {
            prev = Math.max(prev, dp[i - 1][j - 1] - prices[j - 1]);
            dp[i][j] = Math.max(prev + prices[j], dp[i][j - 1]);
        }
    }

    return dp[k][prices.length - 1];
}

/*
https://leetcode.com/problems/k-th-smallest-in-lexicographical-order/description/
440. K-th Smallest in Lexicographical Order
Given two integers n and k, return the kth lexicographically smallest integer in the range [1, n].

Example 1:

Input: n = 13, k = 2
Output: 10
Explanation: The lexicographical order is [1, 10, 11, 12, 13, 2, 3, 4, 5, 6, 7, 8, 9], so the second smallest number is 10.

Example 2:

Input: n = 1, k = 1
Output: 1

Constraints:

	1 <= k <= n <= 10^9
*/
export function findKthNumber(n: number, k: number): number {
    // Helper function to calculate how many numbers are lexicographically between current and current + 1
    const countSteps = () => {
        let first = current;
        let last = current;
        let steps = 0;

        // Count numbers in ranges [current, current+1), [current*10, (current+1)*10), etc.
        while (first <= n) {
            steps += Math.min(last, n) - first + 1;
            // first number in the range that ending with 0
            first *= 10;
            // last number in the range that ending with 9
            last = last * 10 + 9;
        }

        return steps;
    };

    let current = 1;
    // Since we already start at 1, we decrement k
    k--;

    while (k > 0) {
        const steps = countSteps();
        if (steps <= k) {
            // Not enough steps, move to the next sibling prefix
            k -= steps;
            current++;
        } else {
            // Enough steps, go down to the next level in the current subtree
            k--;
            current *= 10;
        }
    }

    return current;
}

/*
https://leetcode.com/problems/sum-of-prefix-scores-of-strings/description/
2416. Sum of Prefix Scores of Strings
You are given an array words of size n consisting of non-empty strings.

We define the score of a string word as the number of strings words[i] such that word is a prefix of words[i].

	For example, if words = ["a", "ab", "abc", "cab"], then the score of "ab" is 2, since "ab" is a prefix of both "ab" and "abc".

Return an array answer of size n where answer[i] is the sum of scores of every non-empty prefix of words[i].

Note that a string is considered as a prefix of itself.

Example 1:

Input: words = ["abc","ab","bc","b"]
Output: [5,4,3,2]
Explanation: The answer for each string is the following:
- "abc" has 3 prefixes: "a", "ab", and "abc".
- There are 2 strings with the prefix "a", 2 strings with the prefix "ab", and 1 string with the prefix "abc".
The total is answer[0] = 2 + 2 + 1 = 5.
- "ab" has 2 prefixes: "a" and "ab".
- There are 2 strings with the prefix "a", and 2 strings with the prefix "ab".
The total is answer[1] = 2 + 2 = 4.
- "bc" has 2 prefixes: "b" and "bc".
- There are 2 strings with the prefix "b", and 1 string with the prefix "bc".
The total is answer[2] = 2 + 1 = 3.
- "b" has 1 prefix: "b".
- There are 2 strings with the prefix "b".
The total is answer[3] = 2.

Example 2:

Input: words = ["abcd"]
Output: [4]
Explanation:
"abcd" has 4 prefixes: "a", "ab", "abc", and "abcd".
Each prefix has a score of one, so the total is answer[0] = 1 + 1 + 1 + 1 = 4.

Constraints:

	1 <= words.length <= 1000
	1 <= words[i].length <= 1000
	words[i] consists of lowercase English letters.
*/
export function sumPrefixScores(words: string[]): number[] {
    const root = new AlphaTrieNode();
    words.forEach((w) => {
        insertWord(root, w);
    });

    return words.map((w) => countPrefix(root, w));
}

class AlphaTrieNode {
    pass = 0;
    children: Record<string, AlphaTrieNode> = {};
}

function insertWord(root: AlphaTrieNode, word: string) {
    let cur = root;
    cur.pass++;

    for (const char of word) {
        if (!cur.children[char]) {
            cur.children[char] = new AlphaTrieNode();
        }

        cur = cur.children[char];
        cur.pass++;
    }
}

function countPrefix(root: AlphaTrieNode, prefix: string): number {
    let cur = root;
    let count = 0;
    for (const char of prefix) {
        if (!cur.children[char]) {
            return count;
        }

        cur = cur.children[char];
        count += cur.pass;
    }

    return count;
}

/*
https://leetcode.com/problems/minimum-deletions-to-make-array-divisible/description/
2344. Minimum Deletions to Make Array Divisible
You are given two positive integer arrays nums and numsDivide. You can delete any number of elements from nums.

Return the minimum number of deletions such that the smallest element in nums divides all the elements of numsDivide. If this is not possible, return -1.

Note that an integer x divides y if y % x == 0.

Example 1:

Input: nums = [2,3,2,4,3], numsDivide = [9,6,9,3,15]
Output: 2
Explanation: 
The smallest element in [2,3,2,4,3] is 2, which does not divide all the elements of numsDivide.
We use 2 deletions to delete the elements in nums that are equal to 2 which makes nums = [3,4,3].
The smallest element in [3,4,3] is 3, which divides all the elements of numsDivide.
It can be shown that 2 is the minimum number of deletions needed.

Example 2:

Input: nums = [4,3,6], numsDivide = [8,2,6,10]
Output: -1
Explanation: 
We want the smallest element in nums to divide all the elements of numsDivide.
There is no way to delete elements from nums to allow this.

Constraints:

	1 <= nums.length, numsDivide.length <= 10^5
	1 <= nums[i], numsDivide[i] <= 10^9
*/
export function minOperations(nums: number[], numsDivide: number[]): number {
    const factors = new Set(getFactors(numsDivide[0]));

    for (let i = 1; i < numsDivide.length; i++) {
        factors.forEach((f) => {
            if (numsDivide[i] % f !== 0) {
                factors.delete(f);
            }
        });
    }

    factors.add(1);

    nums.sort((a, b) => a - b);
    for (let i = 0; i < nums.length; i++) {
        if (factors.has(nums[i])) {
            return i;
        }
    }

    return -1;
}

function getFactors(num: number): number[] {
    const factors: number[] = [];
    for (let i = 1; i <= Math.sqrt(num); i++) {
        if (num % i === 0) {
            factors.push(i);
            if (i !== num / i) {
                factors.push(num / i);
            }
        }
    }

    return factors;
}

/*
https://leetcode.com/problems/smallest-range-covering-elements-from-k-lists/description/
632. Smallest Range Covering Elements from K Lists
You have k lists of sorted integers in non-decreasing order. Find the smallest range that includes at least one number from each of the k lists.

We define the range [a, b] is smaller than range [c, d] if b - a < d - c or a < c if b - a == d - c.

Example 1:

Input: nums = [[4,10,15,24,26],[0,9,12,20],[5,18,22,30]]
Output: [20,24]
Explanation: 
List 1: [4, 10, 15, 24,26], 24 is in range [20,24].
List 2: [0, 9, 12, 20], 20 is in range [20,24].
List 3: [5, 18, 22, 30], 22 is in range [20,24].

Example 2:

Input: nums = [[1,2,3],[1,2,3],[1,2,3]]
Output: [1,1]

Constraints:

	nums.length == k
	1 <= k <= 3500
	1 <= nums[i].length <= 50
	-10^5 <= nums[i][j] <= 10^5
	nums[i] is sorted in non-decreasing order.
*/
export function smallestRange(nums: number[][]): number[] {
    const minHeap = new GenericHeap<[v: number, i: number, j: number]>(
        (a, b) => a[0] - b[0]
    );

    let max = -Infinity;
    nums.forEach((row, i) => {
        minHeap.push([row[0], i, 0]);
        max = Math.max(max, row[0]);
    });

    let left = minHeap.peek()[0];
    let right = max;
    while (true) {
        const [, i, j] = minHeap.pop();
        if (j === nums[i].length - 1) {
            break;
        }

        minHeap.push([nums[i][j + 1], i, j + 1]);
        max = Math.max(max, nums[i][j + 1]);
        if (max - minHeap.peek()[0] < right - left) {
            left = minHeap.peek()[0];
            right = max;
        }
    }

    return [left, right];
}

/*
https://leetcode.com/problems/parsing-a-boolean-expression/description/
1106. Parsing A Boolean Expression
A boolean expression is an expression that evaluates to either true or false. It can be in one of the following shapes:

	't' that evaluates to true.
	'f' that evaluates to false.
	'!(subExpr)' that evaluates to the logical NOT of the inner expression subExpr.
	'&(subExpr1, subExpr2, ..., subExprn)' that evaluates to the logical AND of the inner expressions subExpr1, subExpr2, ..., subExprn where n >= 1.
	'|(subExpr1, subExpr2, ..., subExprn)' that evaluates to the logical OR of the inner expressions subExpr1, subExpr2, ..., subExprn where n >= 1.

Given a string expression that represents a boolean expression, return the evaluation of that expression.

It is guaranteed that the given expression is valid and follows the given rules.

Example 1:

Input: expression = "&(|(f))"
Output: false
Explanation: 
First, evaluate |(f) --> f. The expression is now "&(f)".
Then, evaluate &(f) --> f. The expression is now "f".
Finally, return false.

Example 2:

Input: expression = "|(f,f,f,t)"
Output: true
Explanation: The evaluation of (false OR false OR false OR true) is true.

Example 3:

Input: expression = "!(&(f,t))"
Output: true
Explanation: 
First, evaluate &(f,t) --> (false AND true) --> false --> f. The expression is now "!(f)".
Then, evaluate !(f) --> NOT false --> true. We return true.

Constraints:

	1 <= expression.length <= 10^4
	expression[i] is one following characters: '(', ')', '&', '|', '!', 't', 'f', and ','.
*/
export function parseBoolExpr(expression: string): boolean {
    const stack: string[] = [];

    for (let i = 0; i < expression.length; i++) {
        const char = expression[i];
        if (char === '(') {
            continue;
        }
        if (char === ')') {
            const vals: string[] = [];
            while (stack.length > 0) {
                if (stack.at(-1) === '!') {
                    stack.pop();
                    stack.push(vals[0] === 't' ? 'f' : 't');
                    break;
                }
                if (stack.at(-1) === '|') {
                    stack.pop();
                    stack.push(vals.includes('t') ? 't' : 'f');
                    break;
                }
                if (stack.at(-1) === '&') {
                    stack.pop();
                    stack.push(vals.includes('f') ? 'f' : 't');
                    break;
                }

                vals.push(stack.pop()!);
            }
            continue;
        }
        stack.push(char);
    }

    return stack[0] === 't';
}

/*
https://leetcode.com/problems/height-of-binary-tree-after-subtree-removal-queries/description/?envType=daily-question&envId=2024-10-26
2458. Height of Binary Tree After Subtree Removal Queries
You are given the root of a binary tree with n nodes. Each node is assigned a unique value from 1 to n. You are also given an array queries of size m.

You have to perform m independent queries on the tree where in the ith query you do the following:

	Remove the subtree rooted at the node with the value queries[i] from the tree. It is guaranteed that queries[i] will not be equal to the value of the root.

Return an array answer of size m where answer[i] is the height of the tree after performing the ith query.

Note:

	The queries are independent, so the tree returns to its initial state after each query.
	The height of a tree is the number of edges in the longest simple path from the root to some node in the tree.

Example 1:

Input: root = [1,3,4,2,null,6,5,null,null,null,null,null,7], queries = [4]
Output: [2]
Explanation: The diagram above shows the tree after removing the subtree rooted at node with value 4.
The height of the tree is 2 (The path 1 -> 3 -> 2).

Example 2:

Input: root = [5,8,9,2,1,3,7,4,6], queries = [3,2,4,8]
Output: [3,2,3,2]
Explanation: We have the following queries:
- Removing the subtree rooted at node with value 3. The height of the tree becomes 3 (The path 5 -> 8 -> 2 -> 4).
- Removing the subtree rooted at node with value 2. The height of the tree becomes 2 (The path 5 -> 8 -> 1).
- Removing the subtree rooted at node with value 4. The height of the tree becomes 3 (The path 5 -> 8 -> 2 -> 6).
- Removing the subtree rooted at node with value 8. The height of the tree becomes 2 (The path 5 -> 9 -> 3).

Constraints:

	The number of nodes in the tree is n.
	2 <= n <= 10^5
	1 <= Node.val <= n
	All the values in the tree are unique.
	m == queries.length
	1 <= m <= min(n, 104)
	1 <= queries[i] <= n
	queries[i] != root.val
*/
export function treeQueries(
    root: TreeNode | null,
    queries: number[]
): number[] {
    const heights = [0];

    const getHeight = (node: TreeNode | null) => {
        if (!node) {
            return 0;
        }

        const left = getHeight(node.left);
        const right = getHeight(node.right);
        heights[node.val] = Math.max(left, right) + 1;
        return heights[node.val];
    };

    const dfs = (node: TreeNode | null, depth: number, maxHeight: number) => {
        if (!node) {
            return;
        }
        // update heights without current node
        heights[node.val] = maxHeight;

        const left = node.left ? heights[node.left.val] : 0;
        const right = node.right ? heights[node.right.val] : 0;

        dfs(node.left, depth + 1, Math.max(maxHeight, depth + right));
        dfs(node.right, depth + 1, Math.max(maxHeight, depth + left));
    };

    getHeight(root);
    dfs(root, 0, 0);

    return queries.map((v) => heights[v]);
}

/*
https://leetcode.com/problems/text-justification/description/
68. Text Justification
Given an array of strings words and a width maxWidth, format the text such that each line has exactly maxWidth characters and is fully (left and right) justified.

You should pack your words in a greedy approach; that is, pack as many words as you can in each line. Pad extra spaces ' ' when necessary so that each line has exactly maxWidth characters.

Extra spaces between words should be distributed as evenly as possible. If the number of spaces on a line does not divide evenly between words, the empty slots on the left will be assigned more spaces than the slots on the right.

For the last line of text, it should be left-justified, and no extra space is inserted between words.

Note:

	A word is defined as a character sequence consisting of non-space characters only.
	Each word's length is guaranteed to be greater than 0 and not exceed maxWidth.
	The input array words contains at least one word.

Example 1:

Input: words = ["This", "is", "an", "example", "of", "text", "justification."], maxWidth = 16
Output:
[
   "This    is    an",
   "example  of text",
   "justification.  "
]

Example 2:

Input: words = ["What","must","be","acknowledgment","shall","be"], maxWidth = 16
Output:
[
  "What   must   be",
  "acknowledgment  ",
  "shall be        "
]
Explanation: Note that the last line is "shall be    " instead of "shall     be", because the last line must be left-justified instead of fully-justified.
Note that the second line is also left-justified because it contains only one word.

Example 3:

Input: words = ["Science","is","what","we","understand","well","enough","to","explain","to","a","computer.","Art","is","everything","else","we","do"], maxWidth = 20
Output:
[
  "Science  is  what we",
  "understand      well",
  "enough to explain to",
  "a  computer.  Art is",
  "everything  else  we",
  "do                  "
]

Constraints:

	1 <= words.length <= 300
	1 <= words[i].length <= 20
	words[i] consists of only English letters and symbols.
	1 <= maxWidth <= 100
	words[i].length <= maxWidth
*/
export function fullJustify(words: string[], maxWidth: number): string[] {
    const ret: string[] = [];
    let line = words[0];
    for (let i = 1; i < words.length; i++) {
        const char = words[i];

        if ((line + ' ' + char).length <= maxWidth) {
            line += ' ' + char;
        } else {
            ret.push(justifyLine(line, maxWidth));
            line = char;
        }
    }
    const last = line.split(' ').join(' ');
    ret.push(last.padEnd(maxWidth, ' '));

    return ret;
}

function justifyLine(line: string, maxWidth: number): string {
    const w = line.split(' ');
    if (w.length === 1) {
        return w[0] + ' '.repeat(maxWidth - w[0].length);
    }

    const wordsWidth = w.reduce((s, v) => s + v.length, 0);
    const spaceWidth = maxWidth - wordsWidth;
    const spaceCount = w.length - 1;
    const base = (spaceWidth / spaceCount) | 0;
    const extra = spaceWidth % spaceCount;

    let l = '';
    let i = 0;
    while (i < extra) {
        l += w[i++] + ' '.repeat(base + 1);
    }
    while (i < w.length - 1) {
        l += w[i++] + ' '.repeat(base);
    }
    l += w[i];

    return l;
}

/*
https://leetcode.com/problems/scramble-string/description/
87. Scramble String
We can scramble a string s to get a string t using the following algorithm:

	If the length of the string is 1, stop.
	If the length of the string is > 1, do the following:

		Split the string into two non-empty substrings at a random index, i.e., if the string is s, divide it to x and y where s = x + y.
		Randomly decide to swap the two substrings or to keep them in the same order. i.e., after this step, s may become s = x + y or s = y + x.
		Apply step 1 recursively on each of the two substrings x and y.

Given two strings s1 and s2 of the same length, return true if s2 is a scrambled string of s1, otherwise, return false.

Example 1:

Input: s1 = "great", s2 = "rgeat"
Output: true
Explanation: One possible scenario applied on s1 is:
"great" --> "gr/eat" // divide at random index.
"gr/eat" --> "gr/eat" // random decision is not to swap the two substrings and keep them in order.
"gr/eat" --> "g/r / e/at" // apply the same algorithm recursively on both substrings. divide at random index each of them.
"g/r / e/at" --> "r/g / e/at" // random decision was to swap the first substring and to keep the second substring in the same order.
"r/g / e/at" --> "r/g / e/ a/t" // again apply the algorithm recursively, divide "at" to "a/t".
"r/g / e/ a/t" --> "r/g / e/ a/t" // random decision is to keep both substrings in the same order.
The algorithm stops now, and the result string is "rgeat" which is s2.
As one possible scenario led s1 to be scrambled to s2, we return true.

Example 2:

Input: s1 = "abcde", s2 = "caebd"
Output: false

Example 3:

Input: s1 = "a", s2 = "a"
Output: true

Constraints:

	s1.length == s2.length
	1 <= s1.length <= 30
	s1 and s2 consist of lowercase English letters.
*/
export const isScramble = cache((s1: string, s2: string) => {
    if (s1 === s2) {
        return true;
    }
    if (!hasEqualFreq(s1, s2)) {
        return false;
    }

    for (let i = 1; i < s1.length; i++) {
        const x = s1.slice(0, i);
        const y = s1.slice(i);
        const x1 = s2.slice(0, i);
        const y1 = s2.slice(i);
        const x2 = s2.slice(0, y.length);
        const y2 = s2.slice(y.length);

        if (
            (isScramble(x, x1) && isScramble(y, y1)) ||
            (isScramble(x, y2) && isScramble(x2, y))
        ) {
            return true;
        }
    }

    return false;
});

function hasEqualFreq(s1: string, s2: string): boolean {
    if (s1.length !== s2.length) {
        return false;
    }

    const freq = s1.split('').reduce((s, c) => {
        s[c] = (s[c] ?? 0) + 1;
        return s;
    }, {});

    for (let i = 0; i < s2.length; i++) {
        const char = s2[i];

        if (freq[char] > 0) {
            freq[char]--;
        } else {
            return false;
        }
    }

    return true;
}

/*
https://leetcode.com/problems/minimum-number-of-removals-to-make-mountain-array/description/
1671. Minimum Number of Removals to Make Mountain Array
You may recall that an array arr is a mountain array if and only if:

	arr.length >= 3
	There exists some index i (0-indexed) with 0 < i < arr.length - 1 such that:

		arr[0] < arr[1] < ... < arr[i - 1] < arr[i]
		arr[i] > arr[i + 1] > ... > arr[arr.length - 1]

Given an integer array nums​​​, return the minimum number of elements to remove to make nums​​​ a mountain array.

Example 1:

Input: nums = [1,3,1]
Output: 0
Explanation: The array itself is a mountain array so we do not need to remove any elements.

Example 2:

Input: nums = [2,1,1,5,6,2,3,1]
Output: 3
Explanation: One solution is to remove the elements at indices 0, 1, and 5, making the array nums = [1,5,6,3,1].

Constraints:

	3 <= nums.length <= 1000
	1 <= nums[i] <= 10^9
	It is guaranteed that you can make a mountain array out of nums.
*/
export function minimumMountainRemovals(nums: number[]): number {
    const prefix = longestIncreasingSubSequence(nums);
    const suffix = longestIncreasingSubSequence(
        nums.slice().reverse()
    ).reverse();

    let max = 1;
    for (let i = 1; i < nums.length - 1; i++) {
        if (prefix[i] > 1 && suffix[i] > 1) {
            max = Math.max(max, prefix[i] + suffix[i] - 1);
        }
    }

    return nums.length - max;
}

function longestIncreasingSubSequence(nums: number[]) {
    const dp: number[] = Array(nums.length).fill(1);

    for (let i = 1; i < nums.length; i++) {
        for (let j = i - 1; j >= 0; j--) {
            if (nums[i] > nums[j]) {
                dp[i] = Math.max(dp[i], dp[j] + 1);
            }
        }
    }

    return dp;
}

/*
https://leetcode.com/problems/minimum-total-distance-traveled/description/
2463. Minimum Total Distance Traveled
There are some robots and factories on the X-axis. You are given an integer array robot where robot[i] is the position of the ith robot. You are also given a 2D integer array factory where factory[j] = [positionj, limitj] indicates that positionj is the position of the jth factory and that the jth factory can repair at most limitj robots.

The positions of each robot are unique. The positions of each factory are also unique. Note that a robot can be in the same position as a factory initially.

All the robots are initially broken; they keep moving in one direction. The direction could be the negative or the positive direction of the X-axis. When a robot reaches a factory that did not reach its limit, the factory repairs the robot, and it stops moving.

At any moment, you can set the initial direction of moving for some robot. Your target is to minimize the total distance traveled by all the robots.

Return the minimum total distance traveled by all the robots. The test cases are generated such that all the robots can be repaired.

Note that

	All robots move at the same speed.
	If two robots move in the same direction, they will never collide.
	If two robots move in opposite directions and they meet at some point, they do not collide. They cross each other.
	If a robot passes by a factory that reached its limits, it crosses it as if it does not exist.
	If the robot moved from a position x to a position y, the distance it moved is |y - x|.

Example 1:

Input: robot = [0,4,6], factory = [[2,2],[6,2]]
Output: 4
Explanation: As shown in the figure:
- The first robot at position 0 moves in the positive direction. It will be repaired at the first factory.
- The second robot at position 4 moves in the negative direction. It will be repaired at the first factory.
- The third robot at position 6 will be repaired at the second factory. It does not need to move.
The limit of the first factory is 2, and it fixed 2 robots.
The limit of the second factory is 2, and it fixed 1 robot.
The total distance is |2 - 0| + |2 - 4| + |6 - 6| = 4. It can be shown that we cannot achieve a better total distance than 4.

Example 2:

Input: robot = [1,-1], factory = [[-2,1],[2,1]]
Output: 2
Explanation: As shown in the figure:
- The first robot at position 1 moves in the positive direction. It will be repaired at the second factory.
- The second robot at position -1 moves in the negative direction. It will be repaired at the first factory.
The limit of the first factory is 1, and it fixed 1 robot.
The limit of the second factory is 1, and it fixed 1 robot.
The total distance is |2 - 1| + |(-2) - (-1)| = 2. It can be shown that we cannot achieve a better total distance than 2.

Constraints:

	1 <= robot.length, factory.length <= 100
	factory[j].length == 2
	-10^9 <= robot[i], positionj <= 10^9
	0 <= limitj <= robot.length
	The input will be generated such that it is always possible to repair every robot.
*/
export function minimumTotalDistance(
    robots: number[],
    factories: [number, number][]
): number {
    // Sort robots and factories based on position
    robots.sort((a, b) => a - b);
    factories.sort((a, b) => a[0] - b[0]);

    const m = robots.length;
    const n = factories.length;

    const dp: number[][] = Array.from({ length: m + 1 }, () =>
        Array(n + 1).fill(Infinity)
    );
    dp[0][0] = 0;

    for (let f = 1; f <= n; f++) {
        const [factoryPos, capacity] = factories[f - 1];
        for (let r = 0; r <= m; r++) {
            dp[r][f] = dp[r][f - 1]; // Skip assigning any robots to this factory

            // Try assigning robots to this factory, up to its capacity
            let totalDist = 0;
            for (let k = 1; k <= Math.min(capacity, r); k++) {
                totalDist += Math.abs(robots[r - k] - factoryPos);
                dp[r][f] = Math.min(dp[r][f], dp[r - k][f - 1] + totalDist);
            }
        }
    }

    return dp[m][n];
}
