import { cache } from '../design-pattern/proxy';
import { swap } from '../common/index';

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
https://leetcode.com/problems/painting-the-walls/description/
2742. Painting the Walls
You are given two 0-indexed integer arrays, cost and time, of size n representing the costs and the time taken to paint n different walls respectively. There are two painters available:

	A paid painter that paints the ith wall in time[i] units of time and takes cost[i] units of money.
	A free painter that paints any wall in 1 unit of time at a cost of 0. But the free painter can only be used if the paid painter is already occupied.

Return the minimum amount of money required to paint the n walls.

Example 1:

Input: cost = [1,2,3,2], time = [1,2,3,2]
Output: 3
Explanation: The walls at index 0 and 1 will be painted by the paid painter, and it will take 3 units of time; meanwhile, the free painter will paint the walls at index 2 and 3, free of cost in 2 units of time. Thus, the total cost is 1 + 2 = 3.

Example 2:

Input: cost = [2,3,4,2], time = [1,1,1,1]
Output: 4
Explanation: The walls at index 0 and 3 will be painted by the paid painter, and it will take 2 units of time; meanwhile, the free painter will paint the walls at index 1 and 2, free of cost in 2 units of time. Thus, the total cost is 2 + 2 = 4.

Constraints:

	1 <= cost.length <= 500
	cost.length == time.length
	1 <= cost[i] <= 10^6
	1 <= time[i] <= 500
*/
export function paintWalls(cost: number[], time: number[]): number {
    const totalTime = time.reduce((acc, cur) => acc + cur);
    const halfTime = Math.ceil(totalTime / 2);
}
