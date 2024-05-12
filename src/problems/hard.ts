import { cache } from '../design-pattern/proxy';
import { lcm, swap } from '../common/index';
import { SlidingWindow } from '../algorithm/sliding-window';
import { GenericHeap } from '../algorithm/generic-heap';

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
