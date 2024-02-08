import { cache } from '../design-pattern/proxy';
/* 
https://leetcode.com/problems/find-the-maximum-number-of-marked-indices/description/

You are given a 0-indexed integer array nums.

Initially, all of the indices are unmarked. You are allowed to make this operation any number of times:

Pick two different unmarked indices i and j such that 2 * nums[i] <= nums[j], then mark i and j.
Return the maximum possible number of marked indices in nums using the above operation any number of times.

先从小到大排序，然后用两个指针，左边从0开始，右边从中点开始（必须从中点，确保稍微大的数可以和尽可能小的数组合）
*/
export function maxNumOfMarkedIndices(nums: number[]): number {
    nums.sort((a, b) => a - b);

    let left = 0;
    let right = nums.length >> 1;
    const set: Set<number> = new Set();
    let count = 0;
    while (right < nums.length) {
        if (set.has(left)) {
            left++;
            continue;
        }
        if (left === right) {
            right++;
            continue;
        }

        if (2 * nums[left] <= nums[right]) {
            count += 2;
            set.add(left++);
            set.add(right++);
        } else {
            right++;
        }
    }

    return count;
}

/* 
https://leetcode.com/problems/maximize-distance-to-closest-person/description/

You are given an array representing a row of seats where seats[i] = 1 represents a person sitting in the ith seat, and seats[i] = 0 represents that the ith seat is empty (0-indexed).

There is at least one empty seat, and at least one person sitting.

Alex wants to sit in the seat such that the distance between him and the closest person to him is maximized. 

Return that maximum distance to the closest person.
*/
export function maxDistToClosest(seats: number[]): number {
    let maxDistance = 1;

    let left = 0;
    let right = 1;
    while (right < seats.length) {
        if (seats[right] === 0) {
            right++;
            continue;
        }

        if (seats[left] === 0) {
            maxDistance = Math.max(maxDistance, right - left);
        } else {
            maxDistance = Math.max(maxDistance, (right - left) >> 1);
        }
        left = right;
        right++;
    }

    // 最后需考虑最后一个座位为空的情况
    if (seats[right - 1] === 0) {
        maxDistance = Math.max(maxDistance, right - left - 1);
    }
    return maxDistance;
}

/* 
https://leetcode.com/problems/remove-duplicates-from-sorted-array-ii/description/?envType=study-plan-v2&envId=top-interview-150

Given an integer array nums sorted in non-decreasing order, remove some duplicates in-place such that each unique element appears at most twice. The relative order of the elements should be kept the same.

Since it is impossible to change the length of the array in some languages, you must instead have the result be placed in the first part of the array nums. More formally, if there are k elements after removing the duplicates, then the first k elements of nums should hold the final result. It does not matter what you leave beyond the first k elements.

Return k after placing the final result in the first k slots of nums.

Do not allocate extra space for another array. You must do this by modifying the input array in-place with O(1) extra memory.

Input: nums = [1,1,1,2,2,3]
Output: 5, nums = [1,1,2,2,3,_]
Explanation: Your function should return k = 5, with the first five elements of nums being 1, 1, 2, 2 and 3 respectively.
It does not matter what you leave beyond the returned k (hence they are underscores).
*/
export function removeDuplicates(nums: number[]): number {
    if (nums.length == 0) {
        return 0;
    }

    let i = 0;
    let dup = false;
    for (let j = 1; j < nums.length; ++j) {
        if (nums[i] == nums[j]) {
            if (dup == false) {
                dup = true;
                i += 1;
                nums[i] = nums[j];
            }
            continue;
        }
        dup = false;
        i += 1;
        nums[i] = nums[j];
    }
    return i + 1;
}

/* 
https://leetcode.com/problems/merge-sorted-array/description/?envType=study-plan-v2&envId=top-interview-150

You are given two integer arrays nums1 and nums2, sorted in non-decreasing order, and two integers m and n, 
representing the number of elements in nums1 and nums2 respectively.

Merge nums1 and nums2 into a single array sorted in non-decreasing order.

The final sorted array should not be returned by the function, but instead be stored inside the array nums1. 
To accommodate this, nums1 has a length of m + n, where the first m elements denote the elements that should be merged, 
and the last n elements are set to 0 and should be ignored. nums2 has a length of n.
*/
export function merge(nums1: number[], m: number, nums2: number[], n: number): void {
    let index = m + n - 1;
    let i1 = m - 1;
    let i2 = n - 1;
    while (i1 >= 0 && i2 >= 0) {
        if (nums1[i1] >= nums2[i2]) {
            nums1[index--] = nums1[i1--];
        } else {
            nums1[index--] = nums2[i2--];
        }
    }

    while (i2 >= 0) {
        nums1[index--] = nums2[i2--];
    }
}

/* 
https://leetcode.com/problems/3sum-closest/description/

Given an integer array nums of length n and an integer target, find three integers in nums such that the sum is closest to target.

Return the sum of the three integers.

You may assume that each input would have exactly one solution.
*/
export function threeSumClosest(nums: number[], target: number): number {
    nums.sort((a, b) => a - b);

    let closestSum = nums[0] + nums[1] + nums[2];
    if (nums.length <= 3) {
        return closestSum;
    }

    // 先固定一个数，然后在剩下的范围上玩双指针
    for (let i = 0; i < nums.length - 2; i++) {
        let left = i + 1;
        let right = nums.length - 1;
        while (left < right) {
            const sum = nums[left] + nums[right] + nums[i];
            if (sum === target) {
                return target;
            }

            if (Math.abs(sum - target) < Math.abs(closestSum - target)) {
                closestSum = sum;
            }

            if (sum < target) {
                left++;
            } else {
                right--;
            }
        }
    }

    return closestSum;
}

/* 
https://leetcode.com/problems/minimum-time-visiting-all-points/

On a 2D plane, there are n points with integer coordinates points[i] = [xi, yi]. Return the minimum time in seconds to visit all the points in the order given by points.

You can move according to these rules:

In 1 second, you can either:
    move vertically by one unit,
    move horizontally by one unit, or
    move diagonally sqrt(2) units (in other words, move one unit vertically then one unit horizontally in 1 second).
You have to visit the points in the same order as they appear in the array.
You are allowed to pass through points that appear later in the order, but these do not count as visits.
*/
export function minTimeToVisitAllPoints(points: number[][]): number {
    let minTime = 0;
    for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1];
        const cur = points[i];
        const xDiff = Math.abs(cur[0] - prev[0]);
        const yDiff = Math.abs(cur[1] - prev[1]);
        minTime += Math.max(xDiff, yDiff);
    }
    return minTime;
}

/* 
https://leetcode.com/problems/find-maximum-number-of-string-pairs/

You are given a 0-indexed array words consisting of distinct strings.

The string words[i] can be paired with the string words[j] if:

The string words[i] is equal to the reversed string of words[j].
0 <= i < j < words.length.
Return the maximum number of pairs that can be formed from the array words.

Note that each string can belong in at most one pair.
*/
export function maximumNumberOfStringPairs(words: string[]): number {
    const set = new Set();

    for (let word of words) {
        set.add(word.split('').sort().join());
    }

    return words.length - set.size;
}

/* 
https://leetcode.com/problems/find-the-value-of-the-partition/

You are given a positive integer array nums.

Partition nums into two arrays, nums1 and nums2, such that:

Each element of the array nums belongs to either the array nums1 or the array nums2.
Both arrays are non-empty.
The value of the partition is minimized.
The value of the partition is |max(nums1) - min(nums2)|.

Here, max(nums1) denotes the maximum element of the array nums1, and min(nums2) denotes the minimum element of the array nums2.

Return the integer denoting the value of such partition.
*/
export function findValueOfPartition(nums: number[]): number {
    nums.sort((a, b) => a - b);
    let min = Infinity;

    for (let i = 0; i < nums.length - 1; i++) {
        const current = nums[i + 1] - nums[i];
        // 0必然是最小值，可提前返回
        if (current === 0) {
            return 0;
        }

        min = Math.min(min, current);
    }

    return min;
}

/* 
https://leetcode.com/problems/max-dot-product-of-two-subsequences/description/

Given two arrays nums1 and nums2.

Return the maximum dot product between non-empty subsequences of nums1 and nums2 with the same length.

A subsequence of a array is a new array which is formed from the original array by deleting some (can be none) 
of the characters without disturbing the relative positions of the remaining characters. 
(ie, [2,3,5] is a subsequence of [1,2,3,4,5] while [1,5,3] is not).
*/
export function maxDotProduct(nums1: number[], nums2: number[]): number {
    // dp[i][j] nums[0-j],nums2[0-j] 所形成的等长子序列中最大值
    const dp: number[][] = new Array(nums1.length).fill(0).map((_) => new Array(nums2.length));
    dp[0][0] = nums1[0] * nums2[0];

    // 第一行 dp[0][x]
    for (let j = 1; j < nums2.length; j++) {
        dp[0][j] = Math.max(dp[0][j - 1], nums1[0] * nums2[j]);
    }

    // 第一列 dp[i][0]
    for (let i = 1; i < nums1.length; i++) {
        dp[i][0] = Math.max(dp[i - 1][0], nums1[i] * nums2[0]);
    }

    // 从上到下，从左到右填表
    for (let i = 1; i < nums1.length; i++) {
        for (let j = 1; j < nums2.length; j++) {
            /* 
            可能性分类
            - dp[i][j] 的值来源于 dp[i-1][j]相当于抛弃i
            - dp[i][j] 的值来源于 dp[i][j-1]相当于抛弃j
            - dp[i][j] 的值来源于 dp[i - 1][j - 1] + nums1[i] * nums2[j]
            - dp[i][j] 的值来源于 nums1[i] * nums2[j] 相当于抛弃前面的数组，直接从i,j处开始
            */
            dp[i][j] = Math.max(Math.max(0, dp[i - 1][j - 1]) + nums1[i] * nums2[j], dp[i - 1][j], dp[i][j - 1]);
        }
    }

    return dp[nums1.length - 1][nums2.length - 1];
}

// 空间压缩技巧
// https://www.bilibili.com/video/BV1AS4y1C7qR/?spm_id_from=333.788.recommend_more_video.0&vd_source=7b242528b70c1c6d4ee0ca3780b547a5
export function maxDotProduct2(nums1: number[], nums2: number[]): number {
    // 空间压缩技术，用一个数组滚动的方式来填表
    const dp: number[] = new Array(nums2.length);
    dp[0] = nums1[0] * nums2[0];

    // 第一行 dp[x]
    for (let j = 1; j < nums2.length; j++) {
        dp[j] = Math.max(dp[j - 1], nums1[0] * nums2[j]);
    }

    let topLeftCorner: number;
    let nextTopLeftCorner: number;
    for (let i = 1; i < nums1.length; i++) {
        topLeftCorner = dp[0];
        for (let j = 0; j < nums2.length; j++) {
            nextTopLeftCorner = dp[j];

            if (j === 0) {
                dp[j] = Math.max(dp[j], nums1[i] * nums2[j]);
            } else {
                dp[j] = Math.max(Math.max(0, topLeftCorner) + nums1[i] * nums2[j], dp[j - 1], dp[j]);
            }

            topLeftCorner = nextTopLeftCorner;
        }
    }

    return dp[nums2.length - 1];
}

/* 
https://leetcode.com/problems/two-sum/description/

Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.
*/
export function twoSum(nums: number[], target: number): number[] {
    const indexMap: Record<number, number> = {};
    for (let i = 0; i < nums.length; i++) {
        indexMap[nums[i]] = i;
    }

    for (let i = 0; i < nums.length; i++) {
        const index = indexMap[target - nums[i]];
        if (index !== undefined && index > i) {
            return [i, index];
        }
    }
    return [];
}

// 不必一开始就经过一遍循环建立所有索引数据，可以一边遍历一遍更新索引信息
// 减少一次循环操作
export function twoSum2(nums: number[], target: number): number[] {
    const indexMap: Record<number, number> = {};

    for (let i = 0; i < nums.length; i++) {
        const pair = target - nums[i];
        if (indexMap[pair] !== undefined) {
            return [indexMap[pair], i];
        }
        indexMap[nums[i]] = i;
    }
    return [];
}

/* 
https://leetcode.com/problems/stone-game/description/

Alice and Bob play a game with piles of stones. There are an even number of piles arranged in a row, 
and each pile has a positive integer number of stones piles[i].

The objective of the game is to end with the most stones. The total number of stones across all the piles is odd, so there are no ties.

Alice and Bob take turns, with Alice starting first. Each turn, a player takes the entire pile of stones either 
from the beginning or from the end of the row. This continues until there are no more piles left, at which point the person with the most stones wins.

Assuming Alice and Bob play optimally, return true if Alice wins the game, or false if Bob wins.
*/
export function stoneGame(piles: number[]): boolean {
    const first = cache((left: number, right: number): number => {
        if (left === right) {
            return piles[left];
        }

        return Math.max(piles[left] + last(left + 1, right), piles[right] + last(left, right - 1));
    });

    const last = cache((left: number, right: number): number => {
        if (left === right) {
            return 0;
        }

        return Math.min(first(left + 1, right), first(left, right - 1));
    });

    return first(0, piles.length - 1) > last(0, piles.length - 1);
}

/* 
https://leetcode.com/problems/maximal-square/description/

Given an m x n binary matrix filled with 0's and 1's, find the largest square containing only 1's and return its area.
*/
export function maximalSquare(matrix: string[][]): number {
    const arr = matrix[0].map((v) => +v);
    let max = arr.indexOf(1) !== -1 ? 1 : 0;

    for (let i = 1; i < matrix.length; i++) {
        for (let j = 0; j < matrix[0].length; j++) {
            arr[j] = matrix[i][j] === '0' ? 0 : 1 + arr[j];
        }

        for (let j = 0; j < arr.length; j++) {
            if (arr[j] < 1) {
                continue;
            }

            let left = 1;
            let right = arr[j];
            while (left <= right) {
                const mid = left + ((right - left) >> 1);
                if (canExpand(arr, mid, j)) {
                    max = Math.max(max, mid);
                    left = mid + 1;
                } else {
                    right = mid - 1;
                }
            }
        }
    }

    return max * max;
}

function canExpand(arr: number[], target: number, i: number): boolean {
    let len = 1;
    let right = i + 1;
    while (right < arr.length && len < target) {
        if (arr[right] >= target) {
            len++;
            right++;
        } else {
            break;
        }
    }

    let left = i - 1;
    while (left >= 0 && len < target) {
        if (arr[left] >= target) {
            len++;
            left--;
        } else {
            break;
        }
    }

    return len >= target;
}

export function maximalSquare2(matrix: string[][]): number {
    let max = 0;
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[0].length; j++) {
            if (matrix[i][j] === '0') {
                continue;
            }

            if (i > 0 && j > 0) {
                matrix[i][j] = (
                    Math.min(Number(matrix[i - 1][j]), Number(matrix[i][j - 1]), Number(matrix[i - 1][j - 1])) + 1
                ).toString();
            }

            max = Math.max(max, Number(matrix[i][j]));
        }
    }
    return max * max;
}

/* 
https://leetcode.com/problems/sort-characters-by-frequency/description/?envType=daily-question&envId=2024-02-07
451. Sort Characters By Frequency
Given a string s, sort it in decreasing order based on the frequency of the characters. The frequency of a character is the number of times it appears in the string.

Return the sorted string. If there are multiple answers, return any of them.

Example 1:

Input: s = "tree"
Output: "eert"
Explanation: 'e' appears twice while 'r' and 't' both appear once.
So 'e' must appear before both 'r' and 't'. Therefore "eetr" is also a valid answer.

Example 2:

Input: s = "cccaaa"
Output: "aaaccc"
Explanation: Both 'c' and 'a' appear three times, so both "cccaaa" and "aaaccc" are valid answers.
Note that "cacaca" is incorrect, as the same characters must be together.

Example 3:

Input: s = "Aabb"
Output: "bbAa"
Explanation: "bbaA" is also a valid answer, but "Aabb" is incorrect.
Note that 'A' and 'a' are treated as two different characters.

Constraints:

  1 <= s.length <= 5 * 10^5
  s consists of uppercase and lowercase English letters and digits.
*/
export function frequencySort(s: string): string {
    const map: Record<string, number> = {};

    for (let i = 0; i < s.length; i++) {
        const prev = map[s[i]] || 0;
        map[s[i]] = prev + 1;
    }

    const chars: Array<[string, number]> = Object.keys(map).map((k) => [k, map[k]]);

    return chars
        .sort(([, timesA], [, timesB]) => timesB - timesA)
        .map(([k, times]) => k.repeat(times))
        .join('');
}

/* 
https://leetcode.com/problems/perfect-squares/description/
279. Perfect Squares
Given an integer n, return the least number of perfect square numbers that sum to n.

A perfect square is an integer that is the square of an integer; in other words, it is the product of some integer with itself. For example, 1, 4, 9, and 16 are perfect squares while 3 and 11 are not.

Example 1:

Input: n = 12
Output: 3
Explanation: 12 = 4 + 4 + 4.

Example 2:

Input: n = 13
Output: 2
Explanation: 13 = 4 + 9.

Constraints:

	1 <= n <= 10^4
*/
export const numSquares = cache((n: number): number => {
    if (n === 0) {
        return 0;
    }

    const start = Math.floor(Math.sqrt(n));
    let min = Infinity;
    for (let i = start; i >= 1; i--) {
        const rest = numSquares(n - i * i);
        if (rest < min) {
            min = rest;
        }
    }

    return min + 1;
});

/* 
https://leetcode.com/problems/divide-array-into-arrays-with-max-difference/description/?envType=daily-question&envId=2024-02-01
2966. Divide Array Into Arrays With Max Difference
You are given an integer array nums of size n and a positive integer k.

Divide the array into one or more arrays of size 3 satisfying the following conditions:

	Each element of nums should be in exactly one array.
	The difference between any two elements in one array is less than or equal to k.

Return a 2D array containing all the arrays. If it is impossible to satisfy the conditions, return an empty array. And if there are multiple answers, return any of them.

Example 1:

Input: nums = [1,3,4,8,7,9,3,5,1], k = 2
Output: [[1,1,3],[3,4,5],[7,8,9]]
Explanation: We can divide the array into the following arrays: [1,1,3], [3,4,5] and [7,8,9].
The difference between any two elements in each array is less than or equal to 2.
Note that the order of elements is not important.

Example 2:

Input: nums = [1,3,3,2,7,3], k = 3
Output: []
Explanation: It is not possible to divide the array satisfying all the conditions.

Constraints:

	n == nums.length
	1 <= n <= 10^5
	n is a multiple of 3.
	1 <= nums[i] <= 10^5
	1 <= k <= 10^5
*/
export function divideArray(nums: number[], k: number): number[][] {
    nums.sort((a, b) => a - b);

    const result: number[][] = [];
    for (let i = 0; i < nums.length; i += 3) {
        // 由于n正好是3的倍数，此处不必考虑i + 2超出数组范围的场景
        if (nums[i + 2] - nums[i] > k) {
            return [];
        }
        result.push(nums.slice(i, i + 3));
    }

    return result;
}

/* 
https://leetcode.com/problems/sequential-digits/description/?envType=daily-question&envId=2024-02-02
1291. Sequential Digits
An integer has sequential digits if and only if each digit in the number is one more than the previous digit.

Return a sorted list of all the integers in the range [low, high] inclusive that have sequential digits.

Example 1:
Input: low = 100, high = 300
Output: [123,234]
Example 2:
Input: low = 1000, high = 13000
Output: [1234,2345,3456,4567,5678,6789,12345]

Constraints:

	10 <= low <= high <= 10^9

注意：对于分类讨论的场景需要考虑以下因素
- 分类是否完备？分类是否覆盖所有场景？
- 分类之间是否有交叉？如果有交叉的话如何去重？
*/
export function sequentialDigits(low: number, high: number): number[] {
    const lowDigits = countDigits(low);
    const highDigits = countDigits(high);

    const generateSequentialDigits = (bit: number) => {
        const result: number[] = [];
        for (let i = 1; i <= 9 - bit + 1; i++) {
            let count = bit;
            let digits = i;
            let cur = i;
            while (--count) {
                digits *= 10;
                digits += ++cur;
            }

            result.push(digits);
        }

        return result;
    };

    const set: Set<number> = new Set();
    // for lowDigits
    let digits = generateSequentialDigits(lowDigits);
    for (let i = 0; i < digits.length; i++) {
        if (digits[i] >= low && digits[i] <= high) {
            set.add(digits[i]);
        }
    }

    // for center
    for (let i = lowDigits + 1; i < highDigits; i++) {
        const digits = generateSequentialDigits(i);
        digits.forEach((digit) => set.add(digit));
    }

    // for highDigits
    digits = generateSequentialDigits(highDigits);
    for (let i = 0; i < digits.length; i++) {
        if (digits[i] >= low && digits[i] <= high) {
            set.add(digits[i]);
        }
    }

    return Array.from(set);
}

function countDigits(n: number): number {
    let count = 0;
    while (n) {
        count++;
        n = Math.floor(n / 10);
    }

    return count;
}
