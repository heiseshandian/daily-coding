import { isEven, isOdd } from '../common';
import { cache } from '../design-pattern/proxy';
import { GenericHeap } from '../algorithm/generic-heap';
import { TreeSet } from '../algorithm/TreeSet';

/* 
https://leetcode.com/problems/non-overlapping-intervals/

Given an array of intervals intervals where intervals[i] = [starti, endi], 
return the minimum number of intervals you need to remove to make the rest of the intervals non-overlapping.
*/
export function eraseOverlapIntervals(intervals: number[][]): number {
    // 按照左边界排序
    intervals.sort(([a], [b]) => a - b);

    let overlapCount = 0;
    for (let i = 1; i < intervals.length; i++) {
        if (intervals[i][0] < intervals[i - 1][1]) {
            overlapCount++;

            // 用于判断intervals[i+1] 与 intervals[i]，intervals[i-1]是否都重叠
            intervals[i][1] = Math.min(intervals[i - 1][1], intervals[i][1]);
        }
    }

    return overlapCount;
}

/* 
https://leetcode.com/problems/longest-palindrome/description/

Given a string s which consists of lowercase or uppercase letters, 
return the length of the longest palindrome that can be built with those letters.

Letters are case sensitive, for example, "Aa" is not considered a palindrome here.
*/
export function longestPalindrome(s: string): number {
    const countMap: Record<string, number> = {};
    for (const char of s) {
        if (!countMap[char]) {
            countMap[char] = 0;
        }
        countMap[char]++;
    }

    let max = 0;
    let hasOdd = false;
    Object.values(countMap).forEach((count) => {
        if (isEven(count)) {
            max += count;
        } else {
            hasOdd = true;
            max += count - 1;
        }
    });

    return hasOdd ? max + 1 : max;
}

export function longestPalindrome2(s: string): number {
    const countMap: Record<string, number> = {};
    for (const char of s) {
        if (!countMap[char]) {
            countMap[char] = 0;
        }
        countMap[char]++;
    }

    const oddCount = Object.values(countMap).filter((count) =>
        isOdd(count)
    ).length;

    return oddCount > 0 ? s.length - oddCount + 1 : s.length;
}

/*
https://leetcode.com/problems/longest-unequal-adjacent-groups-subsequence-i/description/
2900. Longest Unequal Adjacent Groups Subsequence I
You are given a string array words and a binary array groups both of length n, where words[i] is associated with groups[i].

Your task is to select the longest alternating subsequence from words. A subsequence of words is alternating if for any two consecutive strings in the sequence, their corresponding elements in the binary array groups differ. Essentially, you are to choose strings such that adjacent elements have non-matching corresponding bits in the groups array.

Formally, you need to find the longest subsequence of an array of indices [0, 1, ..., n - 1] denoted as [i0, i1, ..., ik-1], such that groups[ij] != groups[ij+1] for each 0 <= j < k - 1 and then find the words corresponding to these indices.

Return the selected subsequence. If there are multiple answers, return any of them.

Note: The elements in words are distinct.

Example 1:

Input: words = ["e","a","b"], groups = [0,0,1]

Output: ["e","b"]

Explanation: A subsequence that can be selected is ["e","b"] because groups[0] != groups[2]. Another subsequence that can be selected is ["a","b"] because groups[1] != groups[2]. It can be demonstrated that the length of the longest subsequence of indices that satisfies the condition is 2.

Example 2:

Input: words = ["a","b","c","d"], groups = [1,0,1,1]

Output: ["a","b","c"]

Explanation: A subsequence that can be selected is ["a","b","c"] because groups[0] != groups[1] and groups[1] != groups[2]. Another subsequence that can be selected is ["a","b","d"] because groups[0] != groups[1] and groups[1] != groups[3]. It can be shown that the length of the longest subsequence of indices that satisfies the condition is 3.

Constraints:

	1 <= n == words.length == groups.length <= 100
	1 <= words[i].length <= 10
	groups[i] is either 0 or 1.
	words consists of distinct strings.
	words[i] consists of lowercase English letters.
*/
export function getLongestSubsequence(
    words: string[],
    groups: number[]
): string[] {
    const indexes: number[] = [0];

    for (let i = 1; i < groups.length; i++) {
        if (groups[i] !== groups[indexes[indexes.length - 1]]) {
            indexes.push(i);
        }
    }

    return indexes.map((i) => words[i]);
}

/*
https://leetcode.com/problems/minimum-cost-to-make-all-characters-equal/description/
2712. Minimum Cost to Make All Characters Equal
You are given a 0-indexed binary string s of length n on which you can apply two types of operations:

	Choose an index i and invert all characters from index 0 to index i (both inclusive), with a cost of i + 1
	Choose an index i and invert all characters from index i to index n - 1 (both inclusive), with a cost of n - i

Return the minimum cost to make all characters of the string equal.

Invert a character means if its value is '0' it becomes '1' and vice-versa.

Example 1:

Input: s = "0011"
Output: 2
Explanation: Apply the second operation with i = 2 to obtain s = "0000" for a cost of 2. It can be shown that 2 is the minimum cost to make all characters equal.

Example 2:

Input: s = "010101"
Output: 9
Explanation: Apply the first operation with i = 2 to obtain s = "101101" for a cost of 3.
Apply the first operation with i = 1 to obtain s = "011101" for a cost of 2. 
Apply the first operation with i = 0 to obtain s = "111101" for a cost of 1. 
Apply the second operation with i = 4 to obtain s = "111110" for a cost of 2.
Apply the second operation with i = 5 to obtain s = "111111" for a cost of 1. 
The total cost to make all characters equal is 9. It can be shown that 9 is the minimum cost to make all characters equal.

Constraints:

	1 <= s.length == n <= 10^5
	s[i] is either '0' or '1'
*/
export function minimumCost(s: string): number {
    let left = s.length >> 1;
    let right = left + 1;

    const getLeftCount = (dest: string, flipped: string) => {
        let flip = false;
        let count = 0;
        let l = left;
        while (l >= 0) {
            if ((!flip && s[l] === dest) || (flip && s[l] === flipped)) {
                l--;
            } else {
                count += l + 1;
                flip = !flip;
            }
        }

        return count;
    };
    const getRightCount = (dest: string, flipped: string) => {
        let flip = false;
        let count = 0;
        let r = right;
        while (r < s.length) {
            if ((!flip && s[r] === dest) || (flip && s[r] === flipped)) {
                r++;
            } else {
                count += s.length - r;
                flip = !flip;
            }
        }

        return count;
    };

    return Math.min(
        getLeftCount('0', '1') + getRightCount('0', '1'),
        getLeftCount('1', '0') + getRightCount('1', '0')
    );
}

/*
https://leetcode.com/problems/maximum-score-from-removing-substrings/
1717. Maximum Score From Removing Substrings
You are given a string s and two integers x and y. You can perform two types of operations any number of times.

	Remove substring "ab" and gain x points.

		For example, when removing "ab" from "cabxbae" it becomes "cxbae".

	Remove substring "ba" and gain y points.

		For example, when removing "ba" from "cabxbae" it becomes "cabxe".

Return the maximum points you can gain after applying the above operations on s.

Example 1:

Input: s = "cdbcbbaaabab", x = 4, y = 5
Output: 19
Explanation:
- Remove the "ba" underlined in "cdbcbbaaabab". Now, s = "cdbcbbaaab" and 5 points are added to the score.
- Remove the "ab" underlined in "cdbcbbaaab". Now, s = "cdbcbbaa" and 4 points are added to the score.
- Remove the "ba" underlined in "cdbcbbaa". Now, s = "cdbcba" and 5 points are added to the score.
- Remove the "ba" underlined in "cdbcba". Now, s = "cdbc" and 5 points are added to the score.
Total score = 5 + 4 + 5 + 5 = 19.

Example 2:

Input: s = "aabbaaxybbaabb", x = 5, y = 4
Output: 20

Constraints:

	1 <= s.length <= 10^5
	1 <= x, y <= 10^4
	s consists of lowercase English letters.
*/
export function maximumGain(s: string, x: number, y: number): number {
    const biggerChar = x >= y ? 'ab' : 'ba';
    const smallerChar = biggerChar === 'ab' ? 'ba' : 'ab';
    const bigger = Math.max(x, y);
    const smaller = Math.min(x, y);

    const getPoints = (
        str: string | string[],
        char: string,
        point: number
    ): [points: number, s: string[]] => {
        const stack = [str[0]];
        let i = 1;
        let points = 0;
        while (i < str.length) {
            if (stack.length === 0) {
                stack.push(str[i++]);
                continue;
            }

            while (stack.length > 0) {
                const top = stack.pop()!;

                if (top + str[i] === char) {
                    points += point;
                    i++;
                } else {
                    stack.push(top);
                    stack.push(str[i++]);
                    break;
                }
            }
        }

        return [points, stack];
    };

    const [biggerPoints, rest] = getPoints(s, biggerChar, bigger);
    const [smallerPoints] = getPoints(rest, smallerChar, smaller);

    return biggerPoints + smallerPoints;
}

/*
https://leetcode.com/problems/maximum-score-from-removing-stones/description/
1753. Maximum Score From Removing Stones
You are playing a solitaire game with three piles of stones of sizes a​​​​​​, b,​​​​​​ and c​​​​​​ respectively. Each turn you choose two different non-empty piles, 
take one stone from each, and add 1 point to your score. The game stops when there are fewer than two non-empty piles (meaning there are no more available moves).

Given three integers a​​​​​, b,​​​​​ and c​​​​​, return the maximum score you can get.

Example 1:

Input: a = 2, b = 4, c = 6
Output: 6
Explanation: The starting state is (2, 4, 6). One optimal set of moves is:
- Take from 1st and 3rd piles, state is now (1, 4, 5)
- Take from 1st and 3rd piles, state is now (0, 4, 4)
- Take from 2nd and 3rd piles, state is now (0, 3, 3)
- Take from 2nd and 3rd piles, state is now (0, 2, 2)
- Take from 2nd and 3rd piles, state is now (0, 1, 1)
- Take from 2nd and 3rd piles, state is now (0, 0, 0)
There are fewer than two non-empty piles, so the game ends. Total: 6 points.

Example 2:

Input: a = 4, b = 4, c = 6
Output: 7
Explanation: The starting state is (4, 4, 6). One optimal set of moves is:
- Take from 1st and 2nd piles, state is now (3, 3, 6)
- Take from 1st and 3rd piles, state is now (2, 3, 5)
- Take from 1st and 3rd piles, state is now (1, 3, 4)
- Take from 1st and 3rd piles, state is now (0, 3, 3)
- Take from 2nd and 3rd piles, state is now (0, 2, 2)
- Take from 2nd and 3rd piles, state is now (0, 1, 1)
- Take from 2nd and 3rd piles, state is now (0, 0, 0)
There are fewer than two non-empty piles, so the game ends. Total: 7 points.

Example 3:

Input: a = 1, b = 8, c = 8
Output: 8
Explanation: One optimal set of moves is to take from the 2nd and 3rd piles for 8 turns until they are empty.
After that, there are fewer than two non-empty piles, so the game ends.

Constraints:

	1 <= a, b, c <= 10^5
*/
export function maximumScore(a: number, b: number, c: number): number {
    let min = Math.min(a, b, c);
    let max = Math.max(a, b, c);
    let mid = a + b + c - min - max;

    if (min + mid <= max) {
        return min + mid;
    }

    let score = 0;
    while (min + mid > max && min > 0 && mid > 0) {
        min--;
        mid--;
        score++;
    }
    score += mid + min;

    return score;
}

/*
https://leetcode.com/problems/minimum-moves-to-equal-array-elements-ii/description/
462. Minimum Moves to Equal Array Elements II
Given an integer array nums of size n, return the minimum number of moves required to make all array elements equal.

In one move, you can increment or decrement an element of the array by 1.

Test cases are designed so that the answer will fit in a 32-bit integer.

Example 1:

Input: nums = [1,2,3]
Output: 2
Explanation:
Only two moves are needed (remember each move increments or decrements one element):
[1,2,3]  =>  [2,2,3]  =>  [2,2,2]

Example 2:

Input: nums = [1,10,2,9]
Output: 16

Constraints:

	n == nums.length
	1 <= nums.length <= 10^5
	-10^9 <= nums[i] <= 10^9
*/
export function minMoves2(nums: number[]): number {
    nums.sort((a, b) => a - b);
    const mid = nums[nums.length >> 1];
    return nums.reduce((acc, cur) => acc + Math.abs(cur - mid), 0);
}

/*
https://leetcode.com/problems/valid-parenthesis-string/description/
678. Valid Parenthesis String
Given a string s containing only three types of characters: '(', ')' and '*', return true if s is valid.

The following rules define a valid string:

	Any left parenthesis '(' must have a corresponding right parenthesis ')'.
	Any right parenthesis ')' must have a corresponding left parenthesis '('.
	Left parenthesis '(' must go before the corresponding right parenthesis ')'.
	'*' could be treated as a single right parenthesis ')' or a single left parenthesis '(' or an empty string "".

Example 1:
Input: s = "()"
Output: true
Example 2:
Input: s = "(*)"
Output: true
Example 3:
Input: s = "(*))"
Output: true

Constraints:

	1 <= s.length <= 100
	s[i] is '(', ')' or '*'.
*/
export function checkValidString(s: string): boolean {
    let leftMin = 0;
    let leftMax = 0;
    let i = 0;
    while (i < s.length) {
        if (s[i] === '(') {
            leftMin++;
            leftMax++;
        } else if (s[i] === ')') {
            leftMin = Math.max(leftMin - 1, 0);
            leftMax--;
        } else {
            leftMin = Math.max(leftMin - 1, 0);
            leftMax++;
        }

        if (leftMax < 0) {
            return false;
        }
        i++;
    }

    return leftMin === 0;
}

/*
https://leetcode.com/problems/largest-number/description/
179. Largest Number
Given a list of non-negative integers nums, arrange them such that they form the largest number and return it.

Since the result may be very large, so you need to return a string instead of an integer.

Example 1:

Input: nums = [10,2]
Output: "210"

Example 2:

Input: nums = [3,30,34,5,9]
Output: "9534330"

Constraints:

	1 <= nums.length <= 100
	0 <= nums[i] <= 10^9
*/
export function largestNumber(nums: number[]): string {
    const comparator = (a: number, b: number) => {
        return Number(String(b) + String(a)) - Number(String(a) + String(b));
    };
    const num = nums
        .sort((a, b) => comparator(a, b))
        .reduce((s, c) => s + c, '');

    return num[0] === '0' ? '0' : num;
}

/*
https://leetcode.com/problems/two-city-scheduling/description/
1029. Two City Scheduling
A company is planning to interview 2n people. Given the array costs where costs[i] = [aCosti, bCosti], the cost of flying the ith person to city a is aCosti, and the cost of flying the ith person to city b is bCosti.

Return the minimum cost to fly every person to a city such that exactly n people arrive in each city.

Example 1:

Input: costs = [[10,20],[30,200],[400,50],[30,20]]
Output: 110
Explanation: 
The first person goes to city A for a cost of 10.
The second person goes to city A for a cost of 30.
The third person goes to city B for a cost of 50.
The fourth person goes to city B for a cost of 20.

The total minimum cost is 10 + 30 + 50 + 20 = 110 to have half the people interviewing in each city.

Example 2:

Input: costs = [[259,770],[448,54],[926,667],[184,139],[840,118],[577,469]]
Output: 1859

Example 3:

Input: costs = [[515,563],[451,713],[537,709],[343,819],[855,779],[457,60],[650,359],[631,42]]
Output: 3086

Constraints:

	2 * n == costs.length
	2 <= costs.length <= 100
	costs.length is even.
	1 <= aCosti, bCosti <= 1000
*/
export function twoCitySchedCost(costs: number[][]): number {
    const len = costs.length;
    const n = len >> 1;

    const deltas = costs
        .map(([aCost, bCost]) => bCost - aCost)
        .sort((a, b) => a - b);

    let sum = costs.reduce((s, [cost]) => s + cost, 0);
    for (let i = 0; i < n; i++) {
        sum += deltas[i];
    }

    return sum;
}

/*
https://leetcode.com/problems/minimum-number-of-days-to-eat-n-oranges/description/
1553. Minimum Number of Days to Eat N Oranges
There are n oranges in the kitchen and you decided to eat some of these oranges every day as follows:

	Eat one orange.
	If the number of remaining oranges n is divisible by 2 then you can eat n / 2 oranges.
	If the number of remaining oranges n is divisible by 3 then you can eat 2 * (n / 3) oranges.

You can only choose one of the actions per day.

Given the integer n, return the minimum number of days to eat n oranges.

Example 1:

Input: n = 10
Output: 4
Explanation: You have 10 oranges.
Day 1: Eat 1 orange,  10 - 1 = 9.  
Day 2: Eat 6 oranges, 9 - 2*(9/3) = 9 - 6 = 3. (Since 9 is divisible by 3)
Day 3: Eat 2 oranges, 3 - 2*(3/3) = 3 - 2 = 1. 
Day 4: Eat the last orange  1 - 1  = 0.
You need at least 4 days to eat the 10 oranges.

Example 2:

Input: n = 6
Output: 3
Explanation: You have 6 oranges.
Day 1: Eat 3 oranges, 6 - 6/2 = 6 - 3 = 3. (Since 6 is divisible by 2).
Day 2: Eat 2 oranges, 3 - 2*(3/3) = 3 - 2 = 1. (Since 3 is divisible by 3)
Day 3: Eat the last orange  1 - 1  = 0.
You need at least 3 days to eat the 6 oranges.

Constraints:

	1 <= n <= 10^9
*/
export const minDays = cache((n: number) => {
    if (n <= 1) {
        return 1;
    }

    return Math.min(
        (n % 2) + 1 + minDays(Math.floor(n / 2)),
        (n % 3) + 1 + minDays(Math.floor(n / 3))
    );
});

/*
https://leetcode.com/problems/course-schedule-iii/description/
630. Course Schedule III
There are n different online courses numbered from 1 to n. You are given an array courses where courses[i] = [durationi, lastDayi] 
indicate that the ith course should be taken continuously for durationi days and must be finished before or on lastDayi.

You will start on the 1st day and you cannot take two or more courses simultaneously.

Return the maximum number of courses that you can take.

Example 1:

Input: courses = [[100,200],[200,1300],[1000,1250],[2000,3200]]
Output: 3
Explanation: 
There are totally 4 courses, but you can take 3 courses at most:
First, take the 1st course, it costs 100 days so you will finish it on the 100th day, and ready to take the next course on the 101st day.
Second, take the 3rd course, it costs 1000 days so you will finish it on the 1100th day, and ready to take the next course on the 1101st day. 
Third, take the 2nd course, it costs 200 days so you will finish it on the 1300th day. 
The 4th course cannot be taken now, since you will finish it on the 3300th day, which exceeds the closed date.

Example 2:

Input: courses = [[1,2]]
Output: 1

Example 3:

Input: courses = [[3,2],[4,3]]
Output: 0

Constraints:

	1 <= courses.length <= 10^4
	1 <= durationi, lastDayi <= 10^4
*/
export function scheduleCourse(courses: number[][]): number {
    courses.sort(([, endA], [, endB]) => endA - endB);

    const heap = new GenericHeap((a, b) => b - a);
    let time = 0;
    let count = 0;
    courses.forEach(([duration, end]) => {
        if (time + duration <= end) {
            heap.push(duration);
            time += duration;
            count++;
        } else if (heap.size() > 0 && heap.peek() > duration) {
            time -= heap.pop();
            heap.push(duration);
            time += duration;
        }
    });

    return count;
}

/*
https://leetcode.com/problems/maximum-number-of-events-that-can-be-attended/description/
1353. Maximum Number of Events That Can Be Attended
You are given an array of events where events[i] = [startDayi, endDayi]. Every event i starts at startDayi and ends at endDayi.

You can attend an event i at any day d where startTimei <= d <= endTimei. You can only attend one event at any time d.

Return the maximum number of events you can attend.

Example 1:

Input: events = [[1,2],[2,3],[3,4]]
Output: 3
Explanation: You can attend all the three events.
One way to attend them all is as shown.
Attend the first event on day 1.
Attend the second event on day 2.
Attend the third event on day 3.

Example 2:

Input: events= [[1,2],[2,3],[3,4],[1,2]]
Output: 4

Constraints:

	1 <= events.length <= 10^5
	events[i].length == 2
	1 <= startDayi <= endDayi <= 10^5
*/
export function maxEvents(events: number[][]): number {
    const maxEndDay = events.reduce(
        (m, [, endDay]) => Math.max(m, endDay),
        -Infinity
    );

    events.sort(([startA], [startB]) => startA - startB);
    const heap = new GenericHeap((a, b) => a - b);
    let day = events[0][0];
    let i = 0;
    let max = 0;
    while (day <= maxEndDay) {
        while (i < events.length && events[i][0] <= day) {
            heap.push(events[i++][1]);
        }

        if (heap.size() > 0 && heap.peek() >= day) {
            heap.pop();
            max++;
        }

        while (heap.size() > 0 && heap.peek() <= day) {
            heap.pop();
        }
        day++;
    }

    return max;
}

/*
https://leetcode.com/problems/ipo/description/
502. IPO
Suppose LeetCode will start its IPO soon. In order to sell a good price of its shares to Venture Capital, LeetCode would like to work on some projects to increase its capital before the IPO. Since it has limited resources, it can only finish at most k distinct projects before the IPO. Help LeetCode design the best way to maximize its total capital after finishing at most k distinct projects.

You are given n projects where the ith project has a pure profit profits[i] and a minimum capital of capital[i] is needed to start it.

Initially, you have w capital. When you finish a project, you will obtain its pure profit and the profit will be added to your total capital.

Pick a list of at most k distinct projects from given projects to maximize your final capital, and return the final maximized capital.

The answer is guaranteed to fit in a 32-bit signed integer.

Example 1:

Input: k = 2, w = 0, profits = [1,2,3], capital = [0,1,1]
Output: 4
Explanation: Since your initial capital is 0, you can only start the project indexed 0.
After finishing it you will obtain profit 1 and your capital becomes 1.
With capital 1, you can either start the project indexed 1 or the project indexed 2.
Since you can choose at most 2 projects, you need to finish the project indexed 2 to get the maximum capital.
Therefore, output the final maximized capital, which is 0 + 1 + 3 = 4.

Example 2:

Input: k = 3, w = 0, profits = [1,2,3], capital = [0,1,2]
Output: 6

Constraints:

	1 <= k <= 10^5
	0 <= w <= 10^9
	n == profits.length
	n == capital.length
	1 <= n <= 10^5
	0 <= profits[i] <= 10^4
	0 <= capital[i] <= 10^9
*/
export function findMaximizedCapital(
    k: number,
    w: number,
    profits: number[],
    capital: number[]
): number {
    const heap = new GenericHeap((a, b) => b - a);
    const sorted = capital
        .map((c, i) => [c, profits[i]])
        .sort(([cA], [cB]) => cA - cB);

    let i = 0;
    while (k) {
        while (i < sorted.length && w >= sorted[i][0]) {
            heap.push(sorted[i++][1]);
        }

        if (heap.size() > 0) {
            w += heap.pop();
            k--;
        } else {
            break;
        }
    }

    return w;
}

/*
https://leetcode.com/problems/minimize-deviation-in-array/description/
1675. Minimize Deviation in Array
You are given an array nums of n positive integers.

You can perform two types of operations on any element of the array any number of times:

	If the element is even, divide it by 2.

		For example, if the array is [1,2,3,4], then you can do this operation on the last element, and the array will be [1,2,3,2].

	If the element is odd, multiply it by 2.

		For example, if the array is [1,2,3,4], then you can do this operation on the first element, and the array will be [2,2,3,4].

The deviation of the array is the maximum difference between any two elements in the array.

Return the minimum deviation the array can have after performing some number of operations.

Example 1:

Input: nums = [1,2,3,4]
Output: 1
Explanation: You can transform the array to [1,2,3,2], then to [2,2,3,2], then the deviation will be 3 - 2 = 1.

Example 2:

Input: nums = [4,1,5,20,3]
Output: 3
Explanation: You can transform the array after two operations to [4,2,5,5,3], then the deviation will be 5 - 2 = 3.

Example 3:

Input: nums = [2,10,8]
Output: 3

Constraints:

	n == nums.length
	2 <= n <= 10^4
	1 <= nums[i] <= 10^9
*/
export function minimumDeviation(nums: number[]): number {
    const treeSet = new TreeSet((a, b) => a - b);
    nums.forEach((v) => {
        if (v & 1) {
            treeSet.add(v * 2);
        } else {
            treeSet.add(v);
        }
    });

    let max = treeSet.getMax()!;
    let min = treeSet.getMin()!;
    let result = max - min;
    while (true) {
        result = Math.min(result, max - min);
        if (max & 1) {
            return result;
        }

        treeSet.remove(max);
        treeSet.add(max >> 1);
        max = treeSet.getMax()!;
        min = treeSet.getMin()!;
    }
}

/*
https://leetcode.com/problems/hand-of-straights/description/
846. Hand of Straights
Alice has some number of cards and she wants to rearrange the cards into groups so that each group is of size groupSize, and consists of groupSize consecutive cards.

Given an integer array hand where hand[i] is the value written on the ith card and an integer groupSize, return true if she can rearrange the cards, or false otherwise.

Example 1:

Input: hand = [1,2,3,6,2,3,4,7,8], groupSize = 3
Output: true
Explanation: Alice's hand can be rearranged as [1,2,3],[2,3,4],[6,7,8]

Example 2:

Input: hand = [1,2,3,4,5], groupSize = 4
Output: false
Explanation: Alice's hand can not be rearranged into groups of 4.

Constraints:

	1 <= hand.length <= 10^4
	0 <= hand[i] <= 10^9
	1 <= groupSize <= hand.length

Note: This question is the same as 1296: https://leetcode.com/problems/divide-array-in-sets-of-k-consecutive-numbers/
*/
export function isNStraightHand(hand: number[], groupSize: number): boolean {
    const groups = hand.length / groupSize;
    if (groupSize * groups !== hand.length) {
        return false;
    }

    const freqMap = new Map<number, number>();
    hand.forEach((v) => {
        freqMap.set(v, (freqMap.get(v) || 0) + 1);
    });

    const sorted = Array.from(freqMap.keys()).sort((a, b) => a - b);
    let group = 0;
    let nextI = 0;
    while (group < groups) {
        const upper =
            sorted[Math.min(nextI + groupSize - 1, sorted.length - 1)];
        if (upper - sorted[nextI] !== groupSize - 1) {
            return false;
        }

        let backup = nextI;
        for (let i = nextI; i < nextI + groupSize; i++) {
            const times = freqMap.get(sorted[i])!;
            if (!times) {
                return false;
            }

            if (times > 1) {
                freqMap.set(sorted[i], times - 1);
            } else {
                freqMap.delete(sorted[i]);
                backup = i + 1;
            }
        }

        nextI = backup;
        group++;
    }

    return true;
}

/*
https://leetcode.com/problems/minimize-the-maximum-difference-of-pairs/description/
2616. Minimize the Maximum Difference of Pairs
You are given a 0-indexed integer array nums and an integer p. Find p pairs of indices of nums such that the maximum difference amongst all the pairs is minimized. Also, ensure no index appears more than once amongst the p pairs.

Note that for a pair of elements at the index i and j, the difference of this pair is |nums[i] - nums[j]|, where |x| represents the absolute value of x.

Return the minimum maximum difference among all p pairs. We define the maximum of an empty set to be zero.

Example 1:

Input: nums = [10,1,2,7,1,3], p = 2
Output: 1
Explanation: The first pair is formed from the indices 1 and 4, and the second pair is formed from the indices 2 and 5. 
The maximum difference is max(|nums[1] - nums[4]|, |nums[2] - nums[5]|) = max(0, 1) = 1. Therefore, we return 1.

Example 2:

Input: nums = [4,2,1,2], p = 1
Output: 0
Explanation: Let the indices 1 and 3 form a pair. The difference of that pair is |2 - 2| = 0, which is the minimum we can attain.

Constraints:

	1 <= nums.length <= 10^5
	0 <= nums[i] <= 10^9
	0 <= p <= (nums.length)/2
*/
export function minimizeMax(nums: number[], p: number): number {
    if (p === 0) {
        return 0;
    }

    const n = nums.length;
    nums.sort((a, b) => a - b);

    const checkDiff = (d: number): boolean => {
        let i = 0;
        let count = 0;
        while (i < n - 1 && count < p) {
            if (nums[i + 1] - nums[i] <= d) {
                count++;
                i += 2;
            } else {
                i++;
            }
        }

        return count >= p;
    };

    let l = 0;
    let r = nums[n - 1] - nums[0];
    let diff = 0;
    while (l <= r) {
        const m = l + ((r - l) >> 1);
        if (checkDiff(m)) {
            diff = m;
            r = m - 1;
        } else {
            l = m + 1;
        }
    }

    return diff;
}

/*
https://leetcode.com/problems/crawler-log-folder/description/
1598. Crawler Log Folder
The Leetcode file system keeps a log each time some user performs a change folder operation.

The operations are described below:

	"../" : Move to the parent folder of the current folder. (If you are already in the main folder, remain in the same folder).
	"./" : Remain in the same folder.
	"x/" : Move to the child folder named x (This folder is guaranteed to always exist).

You are given a list of strings logs where logs[i] is the operation performed by the user at the ith step.

The file system starts in the main folder, then the operations in logs are performed.

Return the minimum number of operations needed to go back to the main folder after the change folder operations.

Example 1:

Input: logs = ["d1/","d2/","../","d21/","./"]
Output: 2
Explanation: Use this change folder operation "../" 2 times and go back to the main folder.

Example 2:

Input: logs = ["d1/","d2/","./","d3/","../","d31/"]
Output: 3

Example 3:

Input: logs = ["d1/","../","../","../"]
Output: 0

Constraints:

	1 <= logs.length <= 10^3
	2 <= logs[i].length <= 10
	logs[i] contains lowercase English letters, digits, '.', and '/'.
	logs[i] follows the format described in the statement.
	Folder names consist of lowercase English letters and digits.
*/
export function minOperations(logs: string[]): number {
    const map = {
        './': 0,
        '../': -1,
        default: 1,
    };

    let sum = 0;
    logs.forEach((v) => {
        sum = Math.max(0, sum + (map[v] ?? map.default));
    });

    return sum;
}

/*
https://leetcode.com/problems/maximum-distance-in-arrays/description/
624. Maximum Distance in Arrays
You are given m arrays, where each array is sorted in ascending order.

You can pick up two integers from two different arrays (each array picks one) and calculate the distance. We define the distance between two integers a and b to be their absolute difference |a - b|.

Return the maximum distance.

Example 1:

Input: arrays = [[1,2,3],[4,5],[1,2,3]]
Output: 4
Explanation: One way to reach the maximum distance 4 is to pick 1 in the first or third array and pick 5 in the second array.

Example 2:

Input: arrays = [[1],[1]]
Output: 0

Constraints:

    m == arrays.length
    2 <= m <= 10^5
    1 <= arrays[i].length <= 500
    -10^4 <= arrays[i][j] <= 10^4
    arrays[i] is sorted in ascending order.
    There will be at most 105 integers in all the arrays.
*/
export function maxDistance(arrays: number[][]): number {
    let min = arrays[0][0];
    let max = arrays[0].at(-1)!;
    let maxDistance = 0;
    for (let i = 1; i < arrays.length; i++) {
        maxDistance = Math.max(
            maxDistance,
            Math.abs(arrays[i].at(-1)! - min),
            Math.abs(max - arrays[i][0])
        );

        min = Math.min(min, arrays[i][0]);
        max = Math.max(max, arrays[i].at(-1)!);
    }

    return maxDistance;
}

/*
https://www.nowcoder.com/practice/1ae8d0b6bb4e4bcdbf64ec491f63fc37
线段重合

描述：
  每一个线段都有start和end两个数据项，表示这条线段在X轴上从start位置开始到end位置结束。
  给定一批线段，求所有重合区域中最多重合了几个线段，首尾相接的线段不算重合。
  例如：线段[1,2]和线段[2.3]不重合。
  线段[1,3]和线段[2,3]重合
    
输入描述：
  输入描述：

输出描述：
  输出描述：

示例：
输入：
  3
  1 2
  2 3
  1 3
输出：
  2
*/
export function getMaxOverlapLines(lines: number[][]): number {
    const heap = new GenericHeap<number>((a, b) => a - b);
    lines.sort((a, b) => a[0] - b[0]);

    let max = 1;
    lines.forEach(([start, end]) => {
        while (!heap.isEmpty() && heap.peek() <= start) {
            heap.pop();
        }
        heap.push(end);

        max = Math.max(max, heap.size());
    });

    return max;
}

/**
 * https://www.luogu.com.cn/problem/P1090
 * https://www.bilibili.com/list/8888480?sort_field=pubtime&spm_id_from=333.999.0.0&oid=237940995&bvid=BV1be41167yw
 * # [NOIP2004 提高组] 合并果子 / [USACO06NOV] Fence Repair G

## 题目描述

在一个果园里，多多已经将所有的果子打了下来，而且按果子的不同种类分成了不同的堆。多多决定把所有的果子合成一堆。

每一次合并，多多可以把两堆果子合并到一起，消耗的体力等于两堆果子的重量之和。可以看出，所有的果子经过 $n-1$ 次合并之后， 就只剩下一堆了。多多在合并果子时总共消耗的体力等于每次合并所耗体力之和。

因为还要花大力气把这些果子搬回家，所以多多在合并果子时要尽可能地节省体力。假定每个果子重量都为 $1$ ，并且已知果子的种类 数和每种果子的数目，你的任务是设计出合并的次序方案，使多多耗费的体力最少，并输出这个最小的体力耗费值。

例如有 $3$ 种果子，数目依次为 $1$ ， $2$ ， $9$ 。可以先将 $1$ 、 $2$ 堆合并，新堆数目为 $3$ ，耗费体力为 $3$ 。接着，将新堆与原先的第三堆合并，又得到新的堆，数目为 $12$ ，耗费体力为 $12$ 。所以多多总共耗费体力 $=3+12=15$ 。可以证明 $15$ 为最小的体力耗费值。

## 输入格式

共两行。  
第一行是一个整数 $n(1\leq n\leq 10000)$ ，表示果子的种类数。  

第二行包含 $n$ 个整数，用空格分隔，第 $i$ 个整数 $a_i(1\leq a_i\leq 20000)$ 是第 $i$ 种果子的数目。

## 输出格式

一个整数，也就是最小的体力耗费值。输入数据保证这个值小于 $2^{31}$ 。

## 样例 #1

### 样例输入 #1

```
3 
1 2 9
```

### 样例输出 #1

```
15
```

## 提示

对于 $30\%$ 的数据，保证有 $n \le 1000$：

对于 $50\%$ 的数据，保证有 $n \le 5000$；

对于全部的数据，保证有 $n \le 10000$。
 */
export function minCost(nums: number[]): number {
    const heap = new GenericHeap<number>((a, b) => a - b);
    heap.initHeap(nums);

    let cost = 0;
    while (heap.size() > 1) {
        const sum = heap.pop() + heap.pop();
        cost += sum;
        heap.push(sum);
    }

    return cost;
}

/*
https://leetcode.com/problems/minimum-number-of-swaps-to-make-the-string-balanced/description/
1963. Minimum Number of Swaps to Make the String Balanced
You are given a 0-indexed string s of even length n. The string consists of exactly n / 2 opening brackets '[' and n / 2 closing brackets ']'.

A string is called balanced if and only if:

	It is the empty string, or
	It can be written as AB, where both A and B are balanced strings, or
	It can be written as [C], where C is a balanced string.

You may swap the brackets at any two indices any number of times.

Return the minimum number of swaps to make s balanced.

Example 1:

Input: s = "][]["
Output: 1
Explanation: You can make the string balanced by swapping index 0 with index 3.
The resulting string is "[[]]".

Example 2:

Input: s = "]]][[["
Output: 2
Explanation: You can do the following to make the string balanced:
- Swap index 0 with index 4. s = "[]][][".
- Swap index 1 with index 5. s = "[[][]]".
The resulting string is "[[][]]".

Example 3:

Input: s = "[]"
Output: 0
Explanation: The string is already balanced.

Constraints:

	n == s.length
	2 <= n <= 10^6
	n is even.
	s[i] is either '[' or ']'.
	The number of opening brackets '[' equals n / 2, and the number of closing brackets ']' equals n / 2.
*/
export function minSwaps(s: string): number {
    let left = 0;
    let right = 0;
    for (const char of s) {
        if (char === '[') {
            left++;
        } else if (left > 0) {
            left--;
        } else {
            right++;
        }
    }

    return Math.ceil(right / 2);
}

/*
https://leetcode.com/problems/minimum-add-to-make-parentheses-valid/description/
921. Minimum Add to Make Parentheses Valid
A parentheses string is valid if and only if:

	It is the empty string,
	It can be written as AB (A concatenated with B), where A and B are valid strings, or
	It can be written as (A), where A is a valid string.

You are given a parentheses string s. In one move, you can insert a parenthesis at any position of the string.

	For example, if s = "()))", you can insert an opening parenthesis to be "(()))" or a closing parenthesis to be "())))".

Return the minimum number of moves required to make s valid.

Example 1:

Input: s = "())"
Output: 1

Example 2:

Input: s = "((("
Output: 3

Constraints:

	1 <= s.length <= 1000
	s[i] is either '(' or ')'.
*/
export function minAddToMakeValid(s: string): number {
    let left = 0;
    let right = 0;
    for (const char of s) {
        if (char === '(') {
            left++;
        } else if (left > 0) {
            left--;
        } else {
            right++;
        }
    }

    return left + right;
}

/*
https://leetcode.com/problems/separate-black-and-white-balls/description/
2938. Separate Black and White Balls
There are n balls on a table, each ball has a color black or white.

You are given a 0-indexed binary string s of length n, where 1 and 0 represent black and white balls, respectively.

In each step, you can choose two adjacent balls and swap them.

Return the minimum number of steps to group all the black balls to the right and all the white balls to the left.

Example 1:

Input: s = "101"
Output: 1
Explanation: We can group all the black balls to the right in the following way:
- Swap s[0] and s[1], s = "011".
Initially, 1s are not grouped together, requiring at least 1 step to group them to the right.

Example 2:

Input: s = "100"
Output: 2
Explanation: We can group all the black balls to the right in the following way:
- Swap s[0] and s[1], s = "010".
- Swap s[1] and s[2], s = "001".
It can be proven that the minimum number of steps needed is 2.

Example 3:

Input: s = "0111"
Output: 0
Explanation: All the black balls are already grouped to the right.

Constraints:

	1 <= n == s.length <= 10^5
	s[i] is either '0' or '1'.
*/
export function minimumSteps(s: string): number {
    let steps = 0;
    let zeroIndex = 0;
    for (let i = 0; i < s.length; i++) {
        if (s[i] === '0') {
            steps += i - zeroIndex++;
        }
    }

    return steps;
}

/*
https://leetcode.com/problems/minimized-maximum-of-products-distributed-to-any-store/description/
2064. Minimized Maximum of Products Distributed to Any Store
You are given an integer n indicating there are n specialty retail stores. There are m product types of varying amounts, which are given as a 0-indexed integer array quantities, where quantities[i] represents the number of products of the ith product type.

You need to distribute all products to the retail stores following these rules:

	A store can only be given at most one product type but can be given any amount of it.
	After distribution, each store will have been given some number of products (possibly 0). Let x represent the maximum number of products given to any store. You want x to be as small as possible, i.e., you want to minimize the maximum number of products that are given to any store.

Return the minimum possible x.

Example 1:

Input: n = 6, quantities = [11,6]
Output: 3
Explanation: One optimal way is:
- The 11 products of type 0 are distributed to the first four stores in these amounts: 2, 3, 3, 3
- The 6 products of type 1 are distributed to the other two stores in these amounts: 3, 3
The maximum number of products given to any store is max(2, 3, 3, 3, 3, 3) = 3.

Example 2:

Input: n = 7, quantities = [15,10,10]
Output: 5
Explanation: One optimal way is:
- The 15 products of type 0 are distributed to the first three stores in these amounts: 5, 5, 5
- The 10 products of type 1 are distributed to the next two stores in these amounts: 5, 5
- The 10 products of type 2 are distributed to the last two stores in these amounts: 5, 5
The maximum number of products given to any store is max(5, 5, 5, 5, 5, 5, 5) = 5.

Example 3:

Input: n = 1, quantities = [100000]
Output: 100000
Explanation: The only optimal way is:
- The 100000 products of type 0 are distributed to the only store.
The maximum number of products given to any store is max(100000) = 100000.

Constraints:

	m == quantities.length
	1 <= m <= n <= 10^5
	1 <= quantities[i] <= 10^5
*/
export function minimizedMaximum(n: number, quantities: number[]): number {
    const canDistribute = (max: number): boolean =>
        quantities.reduce((s, v) => s + Math.ceil(v / max), 0) <= n;

    let left = 0;
    let right = 1e5;
    let closest = right;
    while (left <= right) {
        const mid = left + ((right - left) >> 1);
        if (canDistribute(mid)) {
            closest = mid;
            right = mid - 1;
        } else {
            left = mid + 1;
        }
    }

    return closest;
}

/*
https://leetcode.com/problems/maximum-possible-number-by-binary-concatenation/description/
3309. Maximum Possible Number by Binary Concatenation
You are given an array of integers nums of size 3.

Return the maximum possible number whose binary representation can be formed by concatenating the binary representation of all elements in nums in some order.

Note that the binary representation of any number does not contain leading zeros.

Example 1:

Input: nums = [1,2,3]

Output: 30

Explanation:

Concatenate the numbers in the order [3, 1, 2] to get the result "11110", which is the binary representation of 30.

Example 2:

Input: nums = [2,8,16]

Output: 1296

Explanation:

Concatenate the numbers in the order [2, 8, 16] to get the result "10100010000", which is the binary representation of 1296.

Constraints:

	nums.length == 3
	1 <= nums[i] <= 127
*/
export function maxGoodNumber(nums: number[]): number {
    const sorted = nums
        .map((v) => v.toString(2))
        .sort((a, b) => parseInt(`${b}${a}`, 2) - parseInt(`${a}${b}`, 2));

    return parseInt(sorted.join(''), 2);
}

/*
https://leetcode.com/problems/maximum-number-of-integers-to-choose-from-a-range-i/description/
2554. Maximum Number of Integers to Choose From a Range I
You are given an integer array banned and two integers n and maxSum. You are choosing some number of integers following the below rules:

	The chosen integers have to be in the range [1, n].
	Each integer can be chosen at most once.
	The chosen integers should not be in the array banned.
	The sum of the chosen integers should not exceed maxSum.

Return the maximum number of integers you can choose following the mentioned rules.

Example 1:

Input: banned = [1,6,5], n = 5, maxSum = 6
Output: 2
Explanation: You can choose the integers 2 and 4.
2 and 4 are from the range [1, 5], both did not appear in banned, and their sum is 6, which did not exceed maxSum.

Example 2:

Input: banned = [1,2,3,4,5,6,7], n = 8, maxSum = 1
Output: 0
Explanation: You cannot choose any integer while following the mentioned conditions.

Example 3:

Input: banned = [11], n = 7, maxSum = 50
Output: 7
Explanation: You can choose the integers 1, 2, 3, 4, 5, 6, and 7.
They are from the range [1, 7], all did not appear in banned, and their sum is 28, which did not exceed maxSum.

Constraints:

	1 <= banned.length <= 10^4
	1 <= banned[i], n <= 10^4
	1 <= maxSum <= 10^9
*/
export function maxCount(banned: number[], n: number, maxSum: number): number {
    let sum = 0;
    const bannedSet = new Set(banned);
    let count = 0;
    for (let i = 1; i <= n; i++) {
        if (!bannedSet.has(i) && sum + i <= maxSum) {
            sum += i;
            count++;
        }
    }

    return count;
}

/*
https://leetcode.com/problems/construct-string-with-repeat-limit/description/
2182. Construct String With Repeat Limit
You are given a string s and an integer repeatLimit. Construct a new string repeatLimitedString using the characters of s such that no letter appears more than repeatLimit times in a row. You do not have to use all characters from s.

Return the lexicographically largest repeatLimitedString possible.

A string a is lexicographically larger than a string b if in the first position where a and b differ, string a has a letter that appears later in the alphabet than the corresponding letter in b. If the first min(a.length, b.length) characters do not differ, then the longer string is the lexicographically larger one.

Example 1:

Input: s = "cczazcc", repeatLimit = 3
Output: "zzcccac"
Explanation: We use all of the characters from s to construct the repeatLimitedString "zzcccac".
The letter 'a' appears at most 1 time in a row.
The letter 'c' appears at most 3 times in a row.
The letter 'z' appears at most 2 times in a row.
Hence, no letter appears more than repeatLimit times in a row and the string is a valid repeatLimitedString.
The string is the lexicographically largest repeatLimitedString possible so we return "zzcccac".
Note that the string "zzcccca" is lexicographically larger but the letter 'c' appears more than 3 times in a row, so it is not a valid repeatLimitedString.

Example 2:

Input: s = "aababab", repeatLimit = 2
Output: "bbabaa"
Explanation: We use only some of the characters from s to construct the repeatLimitedString "bbabaa". 
The letter 'a' appears at most 2 times in a row.
The letter 'b' appears at most 2 times in a row.
Hence, no letter appears more than repeatLimit times in a row and the string is a valid repeatLimitedString.
The string is the lexicographically largest repeatLimitedString possible so we return "bbabaa".
Note that the string "bbabaaa" is lexicographically larger but the letter 'a' appears more than 2 times in a row, so it is not a valid repeatLimitedString.

Constraints:

	1 <= repeatLimit <= s.length <= 10^5
	s consists of lowercase English letters.
*/
export function repeatLimitedString(s: string, repeatLimit: number): string {
    const alphas = Array(26).fill(0);
    const aCode = 'a'.charCodeAt(0);
    for (let i = 0; i < s.length; i++) {
        alphas[s[i].charCodeAt(0) - aCode]++;
    }

    const ret: string[] = [];
    let first = alphas.length - 1;
    let second = first - 1;
    while (first >= 0) {
        if (alphas[first] === 0) {
            first--;
            second = first - 1;
            continue;
        }
        if (second >= 0 && alphas[second] === 0) {
            second--;
            continue;
        }

        const char = String.fromCharCode(first + aCode);
        const limit = ret.at(-1) === char ? repeatLimit - 1 : repeatLimit;
        const len = Math.min(limit, alphas[first]);
        ret.push(char.repeat(len));
        alphas[first] -= len;

        if (second < 0) {
            return ret.join('');
        }

        ret.push(String.fromCharCode(second + aCode));
        alphas[second]--;
    }

    return ret.join('');
}

/*
https://leetcode.com/problems/minimum-length-of-string-after-operations/description/
3223. Minimum Length of String After Operations
You are given a string s.

You can perform the following process on s any number of times:

	Choose an index i in the string such that there is at least one character to the left of index i that is equal to s[i], and at least one character to the right that is also equal to s[i].
	Delete the closest character to the left of index i that is equal to s[i].
	Delete the closest character to the right of index i that is equal to s[i].

Return the minimum length of the final string s that you can achieve.

Example 1:

Input: s = "abaacbcbb"

Output: 5

Explanation:
We do the following operations:

	Choose index 2, then remove the characters at indices 0 and 3. The resulting string is s = "bacbcbb".
	Choose index 3, then remove the characters at indices 0 and 5. The resulting string is s = "acbcb".

Example 2:

Input: s = "aa"

Output: 2

Explanation:
We cannot perform any operations, so we return the length of the original string.

Constraints:

	1 <= s.length <= 10^5
	s consists only of lowercase English letters.
*/
export function minimumLength(s: string): number {
    const freq = new Map<string, number>();
    for (const c of s) {
        freq.set(c, (freq.get(c) || 0) + 1);
    }

    let min = 0;
    for (const [, v] of freq) {
        if (v >= 3) {
            min += v & 1 ? 1 : 2;
        } else {
            min += v;
        }
    }

    return min;
}
