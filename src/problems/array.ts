import { cache } from '../design-pattern/proxy';
import { GenericHeap } from '../algorithm/generic-heap';
import { isEven, swap } from '../common';
import { UnionSet } from '../algorithm/union-set';
import { countBits } from '../common/bit';
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

export function maxDistToClosest2(seats: number[]): number {
    const emptySeats = seats.join('').split(/1+/);
    let max = Math.max(
        emptySeats[0].length,
        emptySeats[emptySeats.length - 1].length
    );

    for (let i = 1; i < emptySeats.length - 1; i++) {
        const cur = Math.ceil(emptySeats[i].length / 2);
        if (max < cur) {
            max = cur;
        }
    }

    return max;
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
export function merge(
    nums1: number[],
    m: number,
    nums2: number[],
    n: number
): void {
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

        return Math.max(
            piles[left] + last(left + 1, right),
            piles[right] + last(left, right - 1)
        );
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

    const chars: Array<[string, number]> = Object.keys(map).map((k) => [
        k,
        map[k],
    ]);

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

export function sequentialDigits2(low: number, high: number): number[] {
    const result: number[] = [];

    for (let i = 1; i <= 8; i++) {
        let num = i;
        let nextDigit = i + 1;

        while (num <= high && nextDigit <= 9) {
            num = num * 10 + nextDigit;
            if (num >= low && num <= high) {
                result.push(num);
            }

            nextDigit++;
        }
    }

    return result.sort((a, b) => a - b);
}

/* 
https://leetcode.com/problems/count-items-matching-a-rule/description/
1773. Count Items Matching a Rule
You are given an array items, where each items[i] = [typei, colori, namei] describes the type, color, and name of the ith item. You are also given a rule represented by two strings, ruleKey and ruleValue.

The ith item is said to match the rule if one of the following is true:

	ruleKey == "type" and ruleValue == typei.
	ruleKey == "color" and ruleValue == colori.
	ruleKey == "name" and ruleValue == namei.

Return the number of items that match the given rule.

Example 1:

Input: items = [["phone","blue","pixel"],["computer","silver","lenovo"],["phone","gold","iphone"]], ruleKey = "color", ruleValue = "silver"
Output: 1
Explanation: There is only one item matching the given rule, which is ["computer","silver","lenovo"].

Example 2:

Input: items = [["phone","blue","pixel"],["computer","silver","phone"],["phone","gold","iphone"]], ruleKey = "type", ruleValue = "phone"
Output: 2
Explanation: There are only two items matching the given rule, which are ["phone","blue","pixel"] and ["phone","gold","iphone"]. Note that the item ["computer","silver","phone"] does not match.

Constraints:

	1 <= items.length <= 10^4
	1 <= typei.length, colori.length, namei.length, ruleValue.length <= 10
	ruleKey is equal to either "type", "color", or "name".
	All strings consist only of lowercase letters.
*/
export function countMatches(
    items: string[][],
    ruleKey: string,
    ruleValue: string
): number {
    const index = ['type', 'color', 'name'].indexOf(ruleKey);
    return items.filter((item) => item[index] === ruleValue).length;
}

/* 
https://leetcode.com/problems/monotonic-array/description/
896. Monotonic Array
An array is monotonic if it is either monotone increasing or monotone decreasing.

An array nums is monotone increasing if for all i <= j, nums[i] <= nums[j]. An array nums is monotone decreasing if for all i <= j, nums[i] >= nums[j].

Given an integer array nums, return true if the given array is monotonic, or false otherwise.

Example 1:

Input: nums = [1,2,2,3]
Output: true

Example 2:

Input: nums = [6,5,4,4]
Output: true

Example 3:

Input: nums = [1,3,2]
Output: false

Constraints:

	1 <= nums.length <= 10^5
	-10^5 <= nums[i] <= 10^5
*/
export function isMonotonic(nums: number[]): boolean {
    let i = 0;
    let isIncreasing = false;
    let isDecreasing = false;
    while (i < nums.length - 1) {
        if (nums[i] === nums[i + 1]) {
            // do nonthing
        } else if (nums[i] < nums[i + 1]) {
            isIncreasing = true;
        } else {
            isDecreasing = true;
        }

        if (isIncreasing && isDecreasing) {
            return false;
        }

        i++;
    }

    return isIncreasing === false || isDecreasing === false;
}

/*
https://leetcode.com/problems/how-many-numbers-are-smaller-than-the-current-number/description/
1365. How Many Numbers Are Smaller Than the Current Number
Given the array nums, for each nums[i] find out how many numbers in the array are smaller than it. That is, for each nums[i] you have to count the number of valid j's such that j != i and nums[j] < nums[i].

Return the answer in an array.

Example 1:

Input: nums = [8,1,2,2,3]
Output: [4,0,1,1,3]
Explanation: 
For nums[0]=8 there exist four smaller numbers than it (1, 2, 2 and 3). 
For nums[1]=1 does not exist any smaller number than it.
For nums[2]=2 there exist one smaller number than it (1). 
For nums[3]=2 there exist one smaller number than it (1). 
For nums[4]=3 there exist three smaller numbers than it (1, 2 and 2).

Example 2:

Input: nums = [6,5,4,8]
Output: [2,1,0,3]

Example 3:

Input: nums = [7,7,7,7]
Output: [0,0,0,0]

Constraints:

	2 <= nums.length <= 500
	0 <= nums[i] <= 100
*/
export function smallerNumbersThanCurrent(nums: number[]): number[] {
    const sorted = [...nums].sort((a, b) => a - b);
    return nums.map((num) => sorted.indexOf(num));
}

/*
https://leetcode.com/problems/shortest-subarray-to-be-removed-to-make-array-sorted/
1574. Shortest Subarray to be Removed to Make Array Sorted
Given an integer array arr, remove a subarray (can be empty) from arr such that the remaining elements in arr are non-decreasing.

Return the length of the shortest subarray to remove.

A subarray is a contiguous subsequence of the array.

Example 1:

Input: arr = [1,2,3,10,4,2,3,5]
Output: 3
Explanation: The shortest subarray we can remove is [10,4,2] of length 3. The remaining elements after that will be [1,2,3,3,5] which are sorted.
Another correct solution is to remove the subarray [3,10,4].

Example 2:

Input: arr = [5,4,3,2,1]
Output: 4
Explanation: Since the array is strictly decreasing, we can only keep a single element. Therefore we need to remove a subarray of length 4, either [5,4,3,2] or [4,3,2,1].

Example 3:

Input: arr = [1,2,3]
Output: 0
Explanation: The array is already non-decreasing. We do not need to remove any elements.

Constraints:

	1 <= arr.length <= 10^5
	0 <= arr[i] <= 10^9

思路分析
- 先找到以0开始的最长增长子串 prefix 和以最后一个元素结尾的最长增长子串 suffix
- 由于是删除某个子串，所以 prefix 和 suffix 中间的部分（如果有的话，若无中间部分，则整个串必然都是最长增长子串）必然会被删除
- 然后从中间部分向左或向右扩张，使得 prefix 的最后一个元素小于 suffix 的第一个元素
    - 终止条件 prefix 的最后一个元素小于 suffix 的第一个元素 | prefix 为空 | suffix 为空
    - 删除 prefix 的最右边元素
    - 删除 suffix 的最左边元素
*/
export function findLengthOfShortestSubarray(arr: number[]): number {
    let prefixEnd = 1;
    let suffixStart = arr.length - 1;

    // 找到左侧最长增长子序列的末尾
    while (prefixEnd < arr.length && arr[prefixEnd] >= arr[prefixEnd - 1]) {
        prefixEnd++;
    }
    if (prefixEnd === arr.length) {
        return 0;
    }
    prefixEnd--;

    // 找到右侧最长增长子序列的开头
    while (suffixStart >= 1 && arr[suffixStart - 1] <= arr[suffixStart]) {
        suffixStart--;
    }

    let sortestSubarrayLen = suffixStart - prefixEnd - 1;
    const findSortestSubarrayLen = cache(
        (end: number, start: number): number => {
            if (end === -1 || start === arr.length || arr[end] <= arr[start]) {
                return 0;
            }

            // 删除 prefix 的最右边元素
            const left = findSortestSubarrayLen(end - 1, start);
            // 删除 suffix 的最左边元素
            const right = findSortestSubarrayLen(end, start + 1);

            return Math.min(left + 1, right + 1);
        }
    );

    return sortestSubarrayLen + findSortestSubarrayLen(prefixEnd, suffixStart);
}

/*
https://leetcode.com/problems/find-players-with-zero-or-one-losses/description/?envType=daily-question&envId=2024-02-11
2225. Find Players With Zero or One Losses
You are given an integer array matches where matches[i] = [winneri, loseri] indicates that the player winneri defeated player loseri in a match.

Return a list answer of size 2 where:

	answer[0] is a list of all players that have not lost any matches.
	answer[1] is a list of all players that have lost exactly one match.

The values in the two lists should be returned in increasing order.

Note:

	You should only consider the players that have played at least one match.
	The testcases will be generated such that no two matches will have the same outcome.

Example 1:

Input: matches = [[1,3],[2,3],[3,6],[5,6],[5,7],[4,5],[4,8],[4,9],[10,4],[10,9]]
Output: [[1,2,10],[4,5,7,8]]
Explanation:
Players 1, 2, and 10 have not lost any matches.
Players 4, 5, 7, and 8 each have lost one match.
Players 3, 6, and 9 each have lost two matches.
Thus, answer[0] = [1,2,10] and answer[1] = [4,5,7,8].

Example 2:

Input: matches = [[2,3],[1,3],[5,4],[6,4]]
Output: [[1,2,5,6],[]]
Explanation:
Players 1, 2, 5, and 6 have not lost any matches.
Players 3 and 4 each have lost two matches.
Thus, answer[0] = [1,2,5,6] and answer[1] = [].

Constraints:

	1 <= matches.length <= 10^5
	matches[i].length == 2
	1 <= winneri, loseri <= 10^5
	winneri != loseri
	All matches[i] are unique.
*/
export function findWinners(matches: number[][]): number[][] {
    const losersMap: Record<number, number> = {};

    matches.forEach(([_winner, loser]) => {
        const prev = losersMap[loser] || 0;
        losersMap[loser] = prev + 1;
    });

    const answer1 = new Set<number>();
    const answer2 = new Set<number>();
    matches.forEach(([winner, loser]) => {
        if (!losersMap[winner]) {
            answer1.add(winner);
        }

        if (losersMap[loser] === 1) {
            answer2.add(loser);
        }
    });

    return [
        Array.from(answer1).sort((a, b) => a - b),
        Array.from(answer2).sort((a, b) => a - b),
    ];
}

// 用空间换时间
export function findWinners2(matches: number[][]): number[][] {
    const playerStatus: number[] = new Array(Math.pow(10, 5));

    matches.forEach(([winner, loser]) => {
        if (playerStatus[winner] === undefined) {
            playerStatus[winner] = 0;
        }

        if (playerStatus[loser] === undefined) {
            playerStatus[loser] = 1;
        } else {
            playerStatus[loser]++;
        }
    });

    const answer1: number[] = [];
    const answer2: number[] = [];
    playerStatus.forEach((v, i) => {
        if (v === 0) {
            answer1.push(i);
        }
        if (v === 1) {
            answer2.push(i);
        }
    });

    return [answer1, answer2];
}

/*
https://leetcode.com/problems/find-the-kth-largest-integer-in-the-array/
1985. Find the Kth Largest Integer in the Array
You are given an array of strings nums and an integer k. Each string in nums represents an integer without leading zeros.

Return the string that represents the kth largest integer in nums.

Note: Duplicate numbers should be counted distinctly. For example, if nums is ["1","2","2"], "2" is the first largest integer, "2" is the second-largest integer, and "1" is the third-largest integer.

Example 1:

Input: nums = ["3","6","7","10"], k = 4
Output: "3"
Explanation:
The numbers in nums sorted in non-decreasing order are ["3","6","7","10"].
The 4th largest integer in nums is "3".

Example 2:

Input: nums = ["2","21","12","1"], k = 3
Output: "2"
Explanation:
The numbers in nums sorted in non-decreasing order are ["1","2","12","21"].
The 3rd largest integer in nums is "2".

Example 3:

Input: nums = ["0","0"], k = 2
Output: "0"
Explanation:
The numbers in nums sorted in non-decreasing order are ["0","0"].
The 2nd largest integer in nums is "0".

Constraints:

	1 <= k <= nums.length <= 10^4
	1 <= nums[i].length <= 100
	nums[i] consists of only digits.
	nums[i] will not have any leading zeros.
*/
export function kthLargestNumber(nums: string[], k: number): string {
    const minHeap = new GenericHeap<string>((a, b) => {
        const aBigInt = BigInt(a);
        const bBigInt = BigInt(b);

        if (aBigInt < bBigInt) {
            return -1;
        }
        if (aBigInt === bBigInt) {
            return 0;
        }
        return 1;
    });
    minHeap.push(nums[0]);

    for (let i = 1; i < nums.length; i++) {
        if (minHeap.size() < k) {
            minHeap.push(nums[i]);
            continue;
        }
        if (BigInt(minHeap.peek()) > BigInt(nums[i])) {
            continue;
        }

        if (minHeap.size() >= k) {
            minHeap.pop();
        }
        minHeap.push(nums[i]);
    }

    return String(minHeap.pop());
}

export function kthLargestNumber2(nums: string[], k: number): string {
    let left = 0;
    let right = nums.length - 1;
    k--;

    while (left <= right) {
        const [l, r] = partition(nums, left, right);
        if (k >= l && k <= r) {
            return nums[l];
        }

        if (k < l) {
            right = l - 1;
        } else {
            left = r + 1;
        }
    }

    return nums[left];
}

function partition(
    nums: string[],
    left: number,
    right: number
): [left: number, right: number] {
    const targetPosition = Math.ceil(Math.random() * (right - left)) + left;
    const target = BigInt(nums[targetPosition]);

    for (let i = left; i <= right; ) {
        const cur = BigInt(nums[i]);

        if (cur === target) {
            i++;
        } else if (cur > target) {
            swap(nums, left++, i++);
        } else {
            swap(nums, right--, i);
        }
    }

    return [left, right];
}

/*
https://leetcode.com/problems/valid-tic-tac-toe-state/description/
794. Valid Tic-Tac-Toe State
Given a Tic-Tac-Toe board as a string array board, return true if and only if it is possible to reach this board position during the course of a valid tic-tac-toe game.

The board is a 3 x 3 array that consists of characters ' ', 'X', and 'O'. The ' ' character represents an empty square.

Here are the rules of Tic-Tac-Toe:

	Players take turns placing characters into empty squares ' '.
	The first player always places 'X' characters, while the second player always places 'O' characters.
	'X' and 'O' characters are always placed into empty squares, never filled ones.
	The game ends when there are three of the same (non-empty) character filling any row, column, or diagonal.
	The game also ends if all squares are non-empty.
	No more moves can be played if the game is over.

Example 1:

Input: board = ["O  ","   ","   "]
Output: false
Explanation: The first player always plays "X".

Example 2:

Input: board = ["XOX"," X ","   "]
Output: false
Explanation: Players take turns making moves.

Example 3:

Input: board = ["XOX","O O","XOX"]
Output: true

Constraints:

	board.length == 3
	board[i].length == 3
	board[i][j] is either 'X', 'O', or ' '.

分析：
- 如果X赢了则x必然比o多一个子 且 O不可能赢
- 如果O赢了则O必然和x一样多
- 正常情况下 X >= O
*/
export function validTicTacToe(board: string[]): boolean {
    let xCount = 0;
    let oCount = 0;
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j] === 'X') {
                xCount++;
            } else if (board[i][j] === 'O') {
                oCount++;
            }
        }
    }
    if (oCount > xCount || xCount > oCount + 1) {
        return false;
    }

    const isOver = (player: string): boolean => {
        const success = player.repeat(board[0].length);
        // 横向
        for (let i = 0; i < board.length; i++) {
            if (board[i] === success) {
                return true;
            }
        }

        // 纵向
        for (let j = 0; j < board[0].length; j++) {
            if (board.map((b) => b[j]).join('') === success) {
                return true;
            }
        }

        // 正反交叉
        let positiveDiagonal = '';
        let negtiveDiagonal = '';
        let i = 0;
        let positiveJ = 0;
        let negtiveJ = board.length - 1;
        while (i < board.length) {
            positiveDiagonal += board[i][positiveJ++];
            negtiveDiagonal += board[i++][negtiveJ--];
        }
        if (positiveDiagonal === success || negtiveDiagonal === success) {
            return true;
        }

        return false;
    };

    if (isOver('X')) {
        return xCount === oCount + 1 && !isOver('O');
    }
    if (isOver('O')) {
        return xCount === oCount;
    }

    return true;
}

/*
https://leetcode.com/problems/most-profit-assigning-work/description/
826. Most Profit Assigning Work
You have n jobs and m workers. You are given three arrays: difficulty, profit, and worker where:

	difficulty[i] and profit[i] are the difficulty and the profit of the ith job, and
	worker[j] is the ability of jth worker (i.e., the jth worker can only complete a job with difficulty at most worker[j]).

Every worker can be assigned at most one job, but one job can be completed multiple times.

	For example, if three workers attempt the same job that pays $1, then the total profit will be $3. If a worker cannot complete any job, their profit is $0.

Return the maximum profit we can achieve after assigning the workers to the jobs.

Example 1:

Input: difficulty = [2,4,6,8,10], profit = [10,20,30,40,50], worker = [4,5,6,7]
Output: 100
Explanation: Workers are assigned jobs of difficulty [4,4,6,6] and they get a profit of [20,20,30,30] separately.

Example 2:

Input: difficulty = [85,47,57], profit = [24,66,99], worker = [40,25,25]
Output: 0

Constraints:

	n == difficulty.length
	n == profit.length
	m == worker.length
	1 <= n, m <= 10^4
	1 <= difficulty[i], profit[i], worker[i] <= 10^5

思路分析
- 直接组合 difficulty 和 profit 之后按照 profit 从大到小排序，每个 worker 从 profit 最大的job开始挑选，时间复杂度 O(n^2)
- 通过某种方式避免内层遍历，比如说 jobs 和 worker 都按照 difficulty 升序排列，然后对 worker 进行遍历，遍历的过程中记录index和
找到的最大的 profit
*/
export function maxProfitAssignment(
    difficulty: number[],
    profit: number[],
    worker: number[]
): number {
    const jobs: Array<[difficulty: number, profit: number]> = difficulty.map(
        (d, i) => [d, profit[i]]
    );
    jobs.sort(([d1], [d2]) => d1 - d2);

    let maxProfit = 0;
    let lastIndex = 0;

    let max = 0;
    worker.sort((a, b) => a - b);
    for (let i = 0; i < worker.length; i++) {
        while (lastIndex < jobs.length && jobs[lastIndex][0] <= worker[i]) {
            maxProfit = Math.max(maxProfit, jobs[lastIndex][1]);
            lastIndex++;
        }

        max += maxProfit;
    }

    return max;
}

/*
https://leetcode.com/problems/rearrange-array-elements-by-sign/description/?envType=daily-question&envId=2024-02-14
2149. Rearrange Array Elements by Sign
You are given a 0-indexed integer array nums of even length consisting of an equal number of positive and negative integers.

You should rearrange the elements of nums such that the modified array follows the given conditions:

	Every consecutive pair of integers have opposite signs.
	For all integers with the same sign, the order in which they were present in nums is preserved.
	The rearranged array begins with a positive integer.

Return the modified array after rearranging the elements to satisfy the aforementioned conditions.

Example 1:

Input: nums = [3,1,-2,-5,2,-4]
Output: [3,-2,1,-5,2,-4]
Explanation:
The positive integers in nums are [3,1,2]. The negative integers are [-2,-5,-4].
The only possible way to rearrange them such that they satisfy all conditions is [3,-2,1,-5,2,-4].
Other ways such as [1,-2,2,-5,3,-4], [3,1,2,-2,-5,-4], [-2,3,-5,1,-4,2] are incorrect because they do not satisfy one or more conditions.  

Example 2:

Input: nums = [-1,1]
Output: [1,-1]
Explanation:
1 is the only positive integer and -1 the only negative integer in nums.
So nums is rearranged to [1,-1].

Constraints:

	2 <= nums.length <= 10^5
	nums.length is even
	1 <= |nums[i]| <= 10^5
	nums consists of equal number of positive and negative integers.
*/
export function rearrangeArray(nums: number[]): number[] {
    const halfLen = nums.length >> 1;

    const positives: number[] = new Array(halfLen);
    const negtives: number[] = new Array(halfLen);
    let p = 0;
    let n = 0;
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] > 0) {
            positives[p++] = nums[i];
        } else {
            negtives[n++] = nums[i];
        }
    }

    p = 0;
    n = 0;
    let i = 0;
    while (p < halfLen) {
        nums[i++] = positives[p++];
        nums[i++] = negtives[n++];
    }

    return nums;
}

export function rearrangeArray2(nums: number[]): number[] {
    let p = 0;
    let n = 1;

    const result: number[] = new Array(nums.length);
    nums.forEach((num) => {
        if (num > 0) {
            result[p] = num;
            p += 2;
        } else {
            result[n] = num;
            n += 2;
        }
    });

    return result;
}

/*
https://leetcode.com/problems/find-polygon-with-the-largest-perimeter/description/?envType=daily-question&envId=2024-02-15
2971. Find Polygon With the Largest Perimeter
You are given an array of positive integers nums of length n.

A polygon is a closed plane figure that has at least 3 sides. The longest side of a polygon is smaller than the sum of its other sides.

Conversely, if you have k (k >= 3) positive real numbers a1, a2, a3, ..., ak where a1 <= a2 <= a3 <= ... <= ak and a1 + a2 + a3 + ... + ak-1 > ak, then there always exists a polygon with k sides whose lengths are a1, a2, a3, ..., ak.

The perimeter of a polygon is the sum of lengths of its sides.

Return the largest possible perimeter of a polygon whose sides can be formed from nums, or -1 if it is not possible to create a polygon.

Example 1:

Input: nums = [5,5,5]
Output: 15
Explanation: The only possible polygon that can be made from nums has 3 sides: 5, 5, and 5. The perimeter is 5 + 5 + 5 = 15.

Example 2:

Input: nums = [1,12,1,2,5,50,3]
Output: 12
Explanation: The polygon with the largest perimeter which can be made from nums has 5 sides: 1, 1, 2, 3, and 5. The perimeter is 1 + 1 + 2 + 3 + 5 = 12.
We cannot have a polygon with either 12 or 50 as the longest side because it is not possible to include 2 or more smaller sides that have a greater sum than either of them.
It can be shown that the largest possible perimeter is 12.

Example 3:

Input: nums = [5,5,50]
Output: -1
Explanation: There is no possible way to form a polygon from nums, as a polygon has at least 3 sides and 50 > 5 + 5.

Constraints:

	3 <= n <= 10^5
	1 <= nums[i] <= 10^9
*/
export function largestPerimeter(nums: number[]): number {
    nums.sort((a, b) => a - b);

    const prefixSum = new Array(nums.length);
    prefixSum[0] = nums[0];

    for (let i = 1; i < nums.length; i++) {
        prefixSum[i] = prefixSum[i - 1] + nums[i];
    }

    for (let i = nums.length - 1; i >= 2; i--) {
        if (nums[i] < prefixSum[i - 1]) {
            return prefixSum[i];
        }
    }

    return -1;
}

/*
https://leetcode.com/problems/minimum-number-of-operations-to-make-array-continuous/?envType=daily-question&envId=2024-02-15
2009. Minimum Number of Operations to Make Array Continuous
You are given an integer array nums. In one operation, you can replace any element in nums with any integer.

nums is considered continuous if both of the following conditions are fulfilled:

	All elements in nums are unique.
	The difference between the maximum element and the minimum element in nums equals nums.length - 1.

For example, nums = [4, 2, 5, 3] is continuous, but nums = [1, 2, 3, 5, 6] is not continuous.

Return the minimum number of operations to make nums continuous.

Example 1:

Input: nums = [4,2,5,3]
Output: 0
Explanation: nums is already continuous.

Example 2:

Input: nums = [1,2,3,5,6]
Output: 1
Explanation: One possible solution is to change the last element to 4.
The resulting array is [1,2,3,5,4], which is continuous.

Example 3:

Input: nums = [1,10,100,1000]
Output: 3
Explanation: One possible solution is to:
- Change the second element to 2.
- Change the third element to 3.
- Change the fourth element to 4.
The resulting array is [1,2,3,4], which is continuous.

Constraints:

	1 <= nums.length <= 10^5
	1 <= nums[i] <= 10^9

Hint:
- Sort the array.
- For every index do a binary search to get the possible right end of the window and calculate the possible answer.
*/
export function minOperations(nums: number[]): number {
    nums.sort((a, b) => a - b);

    const dupes: number[] = [];
    let prev = nums[0];
    for (let i = 1; i < nums.length; i++) {
        if (nums[i] === prev) {
            dupes.push(prev);
        } else {
            prev = nums[i];
        }
    }
    const getDupesLen = (leftTarget: number, rightTarget: number): number => {
        let left = 0;
        let right = dupes.length - 1;
        let l: number | null = null;
        while (left <= right) {
            const mid = left + ((right - left) >> 1);
            if (dupes[mid] >= leftTarget) {
                l = mid;
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        }
        if (l === null) {
            return 0;
        }

        left = 0;
        right = dupes.length - 1;
        let r: number | null = null;
        while (left <= right) {
            const mid = left + ((right - left) >> 1);
            if (dupes[mid] <= rightTarget) {
                r = mid;
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        if (r === null) {
            return 0;
        }

        return r - l + 1;
    };

    let minOps = Infinity;
    for (let i = 0; i < nums.length; i++) {
        let left = 0;
        let right = nums.length - 1;
        let mostEnd = i;
        const target = nums[i] + nums.length - 1;
        while (left <= right) {
            const mid = left + ((right - left) >> 1);
            if (nums[mid] <= target) {
                mostEnd = mid;
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }

        minOps = Math.min(
            minOps,
            nums.length -
                (mostEnd - i + 1 - getDupesLen(nums[i], nums[mostEnd]))
        );
    }

    return minOps;
}

/*
https://leetcode.com/problems/meeting-rooms-iii/description/?envType=daily-question&envId=2024-02-18
2402. Meeting Rooms III
You are given an integer n. There are n rooms numbered from 0 to n - 1.

You are given a 2D integer array meetings where meetings[i] = [starti, endi] means that a meeting will be held during the half-closed time interval [starti, endi). All the values of starti are unique.

Meetings are allocated to rooms in the following manner:

	Each meeting will take place in the unused room with the lowest number.
	If there are no available rooms, the meeting will be delayed until a room becomes free. The delayed meeting should have the same duration as the original meeting.
	When a room becomes unused, meetings that have an earlier original start time should be given the room.

Return the number of the room that held the most meetings. If there are multiple rooms, return the room with the lowest number.

A half-closed interval [a, b) is the interval between a and b including a and not including b.

Example 1:

Input: n = 2, meetings = [[0,10],[1,5],[2,7],[3,4]]
Output: 0
Explanation:
- At time 0, both rooms are not being used. The first meeting starts in room 0.
- At time 1, only room 1 is not being used. The second meeting starts in room 1.
- At time 2, both rooms are being used. The third meeting is delayed.
- At time 3, both rooms are being used. The fourth meeting is delayed.
- At time 5, the meeting in room 1 finishes. The third meeting starts in room 1 for the time period [5,10).
- At time 10, the meetings in both rooms finish. The fourth meeting starts in room 0 for the time period [10,11).
Both rooms 0 and 1 held 2 meetings, so we return 0. 

Example 2:

Input: n = 3, meetings = [[1,20],[2,10],[3,5],[4,9],[6,8]]
Output: 1
Explanation:
- At time 1, all three rooms are not being used. The first meeting starts in room 0.
- At time 2, rooms 1 and 2 are not being used. The second meeting starts in room 1.
- At time 3, only room 2 is not being used. The third meeting starts in room 2.
- At time 4, all three rooms are being used. The fourth meeting is delayed.
- At time 5, the meeting in room 2 finishes. The fourth meeting starts in room 2 for the time period [5,10).
- At time 6, all three rooms are being used. The fifth meeting is delayed.
- At time 10, the meetings in rooms 1 and 2 finish. The fifth meeting starts in room 1 for the time period [10,12).
Room 0 held 1 meeting while rooms 1 and 2 each held 2 meetings, so we return 1. 

Constraints:

	1 <= n <= 100
	1 <= meetings.length <= 10^5
	meetings[i].length == 2
	0 <= starti < endi <= 10^5
	All the values of starti are unique.

Hints:
- Sort meetings based on start times.
- Use two min heaps, the first one keeps track of the numbers of all the rooms that are free. 
The second heap keeps track of the end times of all the meetings that are happening and the room that they are in.
- Keep track of the number of times each room is used in an array.
- With each meeting, check if there are any free rooms. If there are, then use the room with the smallest number. 
Otherwise, assign the meeting to the room whose meeting will end the soonest.
*/
export function mostBooked(n: number, meetings: number[][]): number {
    meetings.sort(([startA], [startB]) => startA - startB);

    const usedTimes = new Array(n).fill(0);
    const freeRooms = new GenericHeap((a, b) => a - b);
    const endTimes = new GenericHeap<[endTime: number, room: number]>(
        ([endTimeA, roomA], [endTimeB, roomB]) =>
            endTimeA - endTimeB || roomA - roomB
    );
    for (let i = 0; i < n; i++) {
        freeRooms.push(i);
    }

    for (let i = 0; i < meetings.length; i++) {
        const [starti, endi] = meetings[i];
        while (endTimes.size() > 0 && endTimes.peek()[0] <= starti) {
            const [, room] = endTimes.pop();
            freeRooms.push(room);
        }

        if (freeRooms.size() > 0) {
            const firstFreeRoom = freeRooms.pop();
            endTimes.push([endi, firstFreeRoom]);
            usedTimes[firstFreeRoom]++;
        } else {
            const [endTime, room] = endTimes.pop();
            endTimes.push([endTime + endi - starti, room]);
            usedTimes[room]++;
        }
    }

    let max = -Infinity;
    let maxIndex = -1;
    for (let i = 0; i < usedTimes.length; i++) {
        if (max < usedTimes[i]) {
            max = usedTimes[i];
            maxIndex = i;
        }
    }

    return maxIndex;
}

/*
https://leetcode.com/problems/minimum-jumps-to-reach-home/description/
1654. Minimum Jumps to Reach Home
A certain bug's home is on the x-axis at position x. Help them get there from position 0.

The bug jumps according to the following rules:

    It can jump exactly a positions forward (to the right).
    It can jump exactly b positions backward (to the left).
    It cannot jump backward twice in a row.
    It cannot jump to any forbidden positions.

The bug may jump forward beyond its home, but it cannot jump to positions numbered with negative integers.

Given an array of integers forbidden, where forbidden[i] means that the bug cannot jump to the position forbidden[i], 
and integers a, b, and x, return the minimum number of jumps needed for the bug to reach its home. 
If there is no possible sequence of jumps that lands the bug on position x, return -1.

Example 1:

Input: forbidden = [14,4,18,1,15], a = 3, b = 15, x = 9
Output: 3
Explanation: 3 jumps forward (0 -> 3 -> 6 -> 9) will get the bug home.

Example 2:

Input: forbidden = [8,3,16,6,12,20], a = 15, b = 13, x = 11
Output: -1

Example 3:

Input: forbidden = [1,6,2,14,5,17,4], a = 16, b = 9, x = 7
Output: 2
Explanation: One jump forward (0 -> 16) then one jump backward (16 -> 7) will get the bug home.

Constraints:

    1 <= forbidden.length <= 1000
    1 <= a, b, forbidden[i] <= 2000
    0 <= x <= 2000
    All the elements in forbidden are distinct.
    Position x is not forbidden.
*/
export function minimumJumps(
    forbidden: number[],
    a: number,
    b: number,
    x: number
): number {
    const set = new Set(forbidden);
    const upperBond = a + b + Math.max(...forbidden, x);

    const nodes: Array<[position: number, steps: number, isBacked: number]> = [
        [0, 0, 0],
    ];
    const visited = new Set();
    while (nodes.length) {
        const [position, steps, isBacked] = nodes.shift()!;
        const id = (position << 1) | isBacked;
        if (visited.has(id)) {
            continue;
        }
        visited.add(id);

        if (position === x) {
            return steps;
        }

        // forward
        if (!set.has(position + a) && position + a <= upperBond) {
            nodes.push([position + a, steps + 1, 0]);
        }

        // backward
        if (!set.has(position - b) && position - b >= 0 && !isBacked) {
            nodes.push([position - b, steps + 1, 1]);
        }
    }

    return -1;
}

/*
https://leetcode.com/problems/count-good-meals/
1711. Count Good Meals
A good meal is a meal that contains exactly two different food items with a sum of deliciousness equal to a power of two.

You can pick any two different foods to make a good meal.

Given an array of integers deliciousness where deliciousness[i] is the deliciousness of the i​​​​​​th​​​​​​​​ item of food,
return the number of different good meals you can make from this list modulo 10^9 + 7.

Note that items with different indices are considered different even if they have the same deliciousness value.

Example 1:

Input: deliciousness = [1,3,5,7,9]
Output: 4
Explanation: The good meals are (1,3), (1,7), (3,5) and, (7,9).
Their respective sums are 4, 8, 8, and 16, all of which are powers of 2.

Example 2:

Input: deliciousness = [1,1,1,3,3,3,7]
Output: 15
Explanation: The good meals are (1,1) with 3 ways, (1,3) with 9 ways, and (1,7) with 3 ways.

Constraints:

	1 <= deliciousness.length <= 10^5
	0 <= deliciousness[i] <= 2^20
*/
export function countPairs(deliciousness: number[]): number {
    deliciousness.sort((a, b) => a - b);

    const repeatTimes: Record<number, number> = {};
    let max = -Infinity;
    for (let i = 0; i < deliciousness.length; i++) {
        repeatTimes[deliciousness[i]] =
            (repeatTimes[deliciousness[i]] || 0) + 1;

        if (max < deliciousness[i]) {
            max = deliciousness[i];
        }
    }
    max *= 2;

    const deduped = Array.from(new Set(deliciousness));
    let pow = Math.pow(2, 21);
    while (pow > max) {
        pow /= 2;
    }

    let count = 0;
    while (pow >= 1) {
        for (let i = 0; i < deduped.length; i++) {
            const target = pow - deduped[i];
            if (target === deduped[i]) {
                count += factorial(repeatTimes[target] - 1);
            }
            if (target < deduped[i]) {
                continue;
            }

            let left = i + 1;
            let right = deduped.length - 1;
            while (left <= right) {
                const mid = left + ((right - left) >> 1);
                if (deduped[mid] === target) {
                    count += repeatTimes[deduped[i]] * repeatTimes[target];
                    break;
                }

                if (deduped[mid] > target) {
                    right = mid - 1;
                } else {
                    left = mid + 1;
                }
            }
        }

        pow /= 2;
    }

    return count % (Math.pow(10, 9) + 7);
}

function factorial(n: number): number {
    return ((n + 1) * n) / 2;
}

/*
https://leetcode.com/problems/split-array-into-consecutive-subsequences/
659. Split Array into Consecutive Subsequences
You are given an integer array nums that is sorted in non-decreasing order.

Determine if it is possible to split nums into one or more subsequences such that both of the following conditions are true:

	Each subsequence is a consecutive increasing sequence (i.e. each integer is exactly one more than the previous integer).
	All subsequences have a length of 3 or more.

Return true if you can split nums according to the above conditions, or false otherwise.

A subsequence of an array is a new array that is formed from the original array by deleting some (can be none) of the elements 
without disturbing the relative positions of the remaining elements. (i.e., [1,3,5] is a subsequence of [1,2,3,4,5] while [1,3,2] is not).

Example 1:

Input: nums = [1,2,3,3,4,5]
Output: true
Explanation: nums can be split into the following subsequences:
[1,2,3,3,4,5] --> 1, 2, 3
[1,2,3,3,4,5] --> 3, 4, 5

Example 2:

Input: nums = [1,2,3,3,4,4,5,5]
Output: true
Explanation: nums can be split into the following subsequences:
[1,2,3,3,4,4,5,5] --> 1, 2, 3, 4, 5
[1,2,3,3,4,4,5,5] --> 3, 4, 5

Example 3:

Input: nums = [1,2,3,4,4,5]
Output: false
Explanation: It is impossible to split nums into consecutive increasing subsequences of length 3 or more.

Constraints:

	1 <= nums.length <= 10^4
	-1000 <= nums[i] <= 1000
	nums is sorted in non-decreasing order.
*/
export function isPossible(nums: number[]): boolean {
    const freqMap: Record<number, number> = {};
    for (let i = 0; i < nums.length; i++) {
        freqMap[nums[i]] = (freqMap[nums[i]] || 0) + 1;
    }
    const tails: Record<number, number> = {};

    for (let i = 0; i < nums.length; i++) {
        if (freqMap[nums[i]] === 0) {
            continue;
        }

        if (tails[nums[i] - 1] > 0) {
            freqMap[nums[i]]--;
            tails[nums[i] - 1]--;
            tails[nums[i]] = (tails[nums[i]] || 0) + 1;
        } else if (freqMap[nums[i] + 1] > 0 && freqMap[nums[i] + 2] > 0) {
            freqMap[nums[i]]--;
            freqMap[nums[i] + 1]--;
            freqMap[nums[i] + 2]--;
            tails[nums[i] + 2] = (tails[nums[i] + 2] || 0) + 1;
        } else {
            return false;
        }
    }

    return true;
}

/*
https://leetcode.com/problems/patching-array/
330. Patching Array
Given a sorted integer array nums and an integer n, add/patch elements to the array 
such that any number in the range [1, n] inclusive can be formed by the sum of some elements in the array.

Return the minimum number of patches required.

Example 1:

Input: nums = [1,3], n = 6
Output: 1
Explanation:
Combinations of nums are [1], [3], [1,3], which form possible sums of: 1, 3, 4.
Now if we add/patch 2 to nums, the combinations are: [1], [2], [3], [1,3], [2,3], [1,2,3].
Possible sums are 1, 2, 3, 4, 5, 6, which now covers the range [1, 6].
So we only need 1 patch.

Example 2:

Input: nums = [1,5,10], n = 20
Output: 2
Explanation: The two patches can be [2, 4].

Example 3:

Input: nums = [1,2,2], n = 5
Output: 0

Constraints:

	1 <= nums.length <= 1000
	1 <= nums[i] <= 10^4
	nums is sorted in ascending order.
	1 <= n <= 2^31 - 1
*/
export function minPatches(nums: number[], n: number): number {
    let currentMax = 0;
    let next = 1;
    let count = 0;

    let i = 0;
    while (currentMax < n) {
        if (i < nums.length && nums[i] <= next) {
            currentMax += nums[i++];
        } else {
            currentMax += next;
            count++;
        }

        next = currentMax + 1;
    }

    return count;
}

/*
https://leetcode.com/problems/find-the-town-judge/description/
997. Find the Town Judge
In a town, there are n people labeled from 1 to n. There is a rumor that one of these people is secretly the town judge.

If the town judge exists, then:

	The town judge trusts nobody.
	Everybody (except for the town judge) trusts the town judge.
	There is exactly one person that satisfies properties 1 and 2.

You are given an array trust where trust[i] = [ai, bi] representing that the person labeled ai trusts the person labeled bi. 
If a trust relationship does not exist in trust array, then such a trust relationship does not exist.

Return the label of the town judge if the town judge exists and can be identified, or return -1 otherwise.

Example 1:

Input: n = 2, trust = [[1,2]]
Output: 2

Example 2:

Input: n = 3, trust = [[1,3],[2,3]]
Output: 3

Example 3:

Input: n = 3, trust = [[1,3],[2,3],[3,1]]
Output: -1

Constraints:

	1 <= n <= 1000
	0 <= trust.length <= 10^4
	trust[i].length == 2
	All the pairs of trust are unique.
	ai != bi
	1 <= ai, bi <= n
*/
export function findJudge(n: number, trust: number[][]): number {
    if (n === 1 && trust.length === 0) {
        return 1;
    }

    const freqMap: Record<number, number> = {};
    const set = new Set<number>();

    trust.forEach(([a, b]) => {
        set.add(a);
        freqMap[b] = (freqMap[b] || 0) + 1;
    });

    const result = Object.keys(freqMap).find(
        (cand) => freqMap[cand] === n - 1 && !set.has(Number(cand))
    );

    return result ? Number(result) : -1;
}

export function findJudge2(n: number, trust: number[][]): number {
    let trustsCount: number[] = new Array(n).fill(0);
    let trustedByCount: number[] = new Array(n).fill(0);
    let judge = 0;

    for (let i = 0; i < trust.length; ++i) {
        const [a, b] = trust[i];
        trustsCount[a - 1]++;
        trustedByCount[b - 1]++;
    }
    for (let i = 0; i < trustsCount.length; ++i) {
        if (trustsCount[i] == 0) {
            if (trustedByCount[i] == n - 1) {
                judge = i + 1;
                break;
            }
        }
    }
    if (judge == 0) {
        return -1;
    }
    return judge;
}

/*
https://leetcode.com/problems/video-stitching/
1024. Video Stitching
You are given a series of video clips from a sporting event that lasted time seconds. 
These video clips can be overlapping with each other and have varying lengths.

Each video clip is described by an array clips where clips[i] = [starti, endi] 
indicates that the ith clip started at starti and ended at endi.

We can cut these clips into segments freely.

    For example, a clip [0, 7] can be cut into segments [0, 1] + [1, 3] + [3, 7].

Return the minimum number of clips needed so that we can cut the clips into segments 
that cover the entire sporting event [0, time]. If the task is impossible, return -1.

Example 1:

Input: clips = [[0,2],[4,6],[8,10],[1,9],[1,5],[5,9]], time = 10
Output: 3
Explanation: We take the clips [0,2], [8,10], [1,9]; a total of 3 clips.
Then, we can reconstruct the sporting event as follows:
We cut [1,9] into segments [1,2] + [2,8] + [8,9].
Now we have segments [0,2] + [2,8] + [8,10] which cover the sporting event [0, 10].

Example 2:

Input: clips = [[0,1],[1,2]], time = 5
Output: -1
Explanation: We cannot cover [0,5] with only [0,1] and [1,2].

Example 3:

Input: clips = [[0,1],[6,8],[0,2],[5,6],[0,4],[0,3],[6,7],[1,3],[4,7],[1,4],[2,5],[2,6],[3,4],[4,5],[5,7],[6,9]], time = 9
Output: 3
Explanation: We can take clips [0,4], [4,7], and [6,9].

Constraints:

    1 <= clips.length <= 100
    0 <= starti <= endi <= 100
    1 <= time <= 100
*/
export function videoStitching(clips: number[][], time: number): number {
    clips.sort(
        ([startA, endA], [startB, endB]) =>
            startA - startB || endA - startA - (endB - startB)
    );

    let [prevStart, maxEnd] = clips[clips.length - 1];
    for (let i = clips.length - 2; i >= 0; i--) {
        const [s, e] = clips[i];
        maxEnd = Math.max(maxEnd, e);

        if (s === prevStart) {
            clips.splice(i, 1);
        } else {
            prevStart = s;
        }
    }

    if (clips[0][0] > 0 || maxEnd < time) {
        return -1;
    }

    let [, prevEnd] = clips[0];
    let prevEndIndex = 0;
    let count = 1;
    while (prevEnd < time) {
        let max = prevEnd;
        for (let i = prevEndIndex + 1; i < clips.length; i++) {
            const [s, e] = clips[i];
            if (s <= prevEnd && e > max) {
                max = e;
                prevEndIndex = i;
            }
        }
        if (max === prevEnd) {
            return -1;
        }

        prevEnd = max;
        count++;
    }

    return count;
}

/*
https://leetcode.com/problems/find-all-people-with-secret/description/?envType=daily-question&envId=2024-02-24
2092. Find All People With Secret
You are given an integer n indicating there are n people numbered from 0 to n - 1. You are also given a 0-indexed 2D integer array meetings where meetings[i] = [xi, yi, timei] indicates that person xi and person yi have a meeting at timei. A person may attend multiple meetings at the same time. Finally, you are given an integer firstPerson.

Person 0 has a secret and initially shares the secret with a person firstPerson at time 0. This secret is then shared every time a meeting takes place with a person that has the secret. More formally, for every meeting, if a person xi has the secret at timei, then they will share the secret with person yi, and vice versa.

The secrets are shared instantaneously. That is, a person may receive the secret and share it with people in other meetings within the same time frame.

Return a list of all the people that have the secret after all the meetings have taken place. You may return the answer in any order.

Example 1:

Input: n = 6, meetings = [[1,2,5],[2,3,8],[1,5,10]], firstPerson = 1
Output: [0,1,2,3,5]
Explanation:
At time 0, person 0 shares the secret with person 1.
At time 5, person 1 shares the secret with person 2.
At time 8, person 2 shares the secret with person 3.
At time 10, person 1 shares the secret with person 5.​​​​
Thus, people 0, 1, 2, 3, and 5 know the secret after all the meetings.

Example 2:

Input: n = 4, meetings = [[3,1,3],[1,2,2],[0,3,3]], firstPerson = 3
Output: [0,1,3]
Explanation:
At time 0, person 0 shares the secret with person 3.
At time 2, neither person 1 nor person 2 know the secret.
At time 3, person 3 shares the secret with person 0 and person 1.
Thus, people 0, 1, and 3 know the secret after all the meetings.

Example 3:

Input: n = 5, meetings = [[3,4,2],[1,2,1],[2,3,1]], firstPerson = 1
Output: [0,1,2,3,4]
Explanation:
At time 0, person 0 shares the secret with person 1.
At time 1, person 1 shares the secret with person 2, and person 2 shares the secret with person 3.
Note that person 2 can share the secret at the same time as receiving it.
At time 2, person 3 shares the secret with person 4.
Thus, people 0, 1, 2, 3, and 4 know the secret after all the meetings.

Constraints:

	2 <= n <= 10^5
	1 <= meetings.length <= 10^5
	meetings[i].length == 3
	0 <= xi, yi <= n - 1
	xi != yi
	1 <= timei <= 10^5
	1 <= firstPerson <= n - 1

Hints
- Could you model all the meetings happening at the same time as a graph?
- What data structure can you use to efficiently share the secret?
- You can use the union-find data structure to quickly determine who knows the secret and share the secret.
*/
export function findAllPeople(
    n: number,
    meetings: number[][],
    firstPerson: number
): number[] {
    meetings.sort(([, , timeA], [, , timeB]) => timeA - timeB);

    const unionSet = new UnionSet<number>();
    for (let i = 0; i < n; i++) {
        unionSet.addNode(i);
    }
    unionSet.union(0, firstPerson);

    const updateUnionSet = (start: number, end: number) => {
        // union
        for (let k = start; k < end; k++) {
            const [x, y] = meetings[k];
            unionSet.union(x, y);
        }

        // reset connections
        for (let k = start; k < end; k++) {
            const [x, y] = meetings[k];
            if (!unionSet.isSameSet(0, x)) {
                const nodeX = unionSet.nodes.get(x)!;
                const nodeY = unionSet.nodes.get(y)!;

                unionSet.parents.set(nodeX, nodeX);
                unionSet.parents.set(nodeY, nodeY);
                unionSet.sizeMap.set(nodeX, 1);
                unionSet.sizeMap.set(nodeY, 1);
            }
        }
    };

    let [, , prevTime] = meetings[0];
    let start = 0;
    let i = 1;

    while (i < meetings.length) {
        const [, , t] = meetings[i];

        if (prevTime !== t) {
            updateUnionSet(start, i);

            prevTime = t;
            start = i;
        }

        i++;
    }
    updateUnionSet(start, meetings.length);

    const result = [0];
    for (let i = 1; i < n; i++) {
        if (unionSet.isSameSet(0, i)) {
            result.push(i);
        }
    }

    return result;
}

/*
https://leetcode.com/problems/restore-the-array-from-adjacent-pairs/description/?envType=daily-question&envId=2024-02-25
1743. Restore the Array From Adjacent Pairs
There is an integer array nums that consists of n unique elements, but you have forgotten it. 
However, you do remember every pair of adjacent elements in nums.

You are given a 2D integer array adjacentPairs of size n - 1 where each adjacentPairs[i] = [ui, vi] 
indicates that the elements ui and vi are adjacent in nums.

It is guaranteed that every adjacent pair of elements nums[i] and nums[i+1] will exist in adjacentPairs, 
either as [nums[i], nums[i+1]] or [nums[i+1], nums[i]]. The pairs can appear in any order.

Return the original array nums. If there are multiple solutions, return any of them.

Example 1:

Input: adjacentPairs = [[2,1],[3,4],[3,2]]
Output: [1,2,3,4]
Explanation: This array has all its adjacent pairs in adjacentPairs.
Notice that adjacentPairs[i] may not be in left-to-right order.

Example 2:

Input: adjacentPairs = [[4,-2],[1,4],[-3,1]]
Output: [-2,4,1,-3]
Explanation: There can be negative numbers.
Another solution is [-3,1,4,-2], which would also be accepted.

Example 3:

Input: adjacentPairs = [[100000,-100000]]
Output: [100000,-100000]

Constraints:

	nums.length == n
	adjacentPairs.length == n - 1
	adjacentPairs[i].length == 2
	2 <= n <= 10^5
	-10^5 <= nums[i], ui, vi <= 10^5
	There exists some nums that has adjacentPairs as its pairs.

Hints:
- Find the first element of nums - it will only appear once in adjacentPairs.
- The adjacent pairs are like edges of a graph. Perform a depth-first search from the first element.
*/
export function restoreArray(adjacentPairs: number[][]): number[] {
    const edgesMap: Record<number, number[]> = {};
    adjacentPairs.forEach(([from, to]) => {
        edgesMap[from] = (edgesMap[from] || []).concat(to);
        edgesMap[to] = (edgesMap[to] || []).concat(from);
    });

    const first = Number(
        Object.keys(edgesMap).find((k) => edgesMap[k].length === 1)
    );
    const nodes = [first];
    const result = new Array(adjacentPairs.length + 1);
    let i = 0;
    const visited = new Set();
    while (nodes.length) {
        const node = nodes.shift()!;
        result[i++] = node;
        visited.add(node);

        if (edgesMap[node].length) {
            edgesMap[node].forEach((n) => {
                if (!visited.has(n)) {
                    nodes.push(n);
                }
            });
        }
    }

    return result;
}

/*
https://leetcode.com/problems/max-number-of-k-sum-pairs/
1679. Max Number of K-Sum Pairs
You are given an integer array nums and an integer k.

In one operation, you can pick two numbers from the array whose sum equals k and remove them from the array.

Return the maximum number of operations you can perform on the array.

Example 1:

Input: nums = [1,2,3,4], k = 5
Output: 2
Explanation: Starting with nums = [1,2,3,4]:
- Remove numbers 1 and 4, then nums = [2,3]
- Remove numbers 2 and 3, then nums = []
There are no more pairs that sum up to 5, hence a total of 2 operations.

Example 2:

Input: nums = [3,1,3,4,3], k = 6
Output: 1
Explanation: Starting with nums = [3,1,3,4,3]:
- Remove the first two 3's, then nums = [1,4,3]
There are no more pairs that sum up to 6, hence a total of 1 operation.

Constraints:

	1 <= nums.length <= 10^5
	1 <= nums[i] <= 10^9
	1 <= k <= 10^9
*/
export function maxOperations(nums: number[], k: number): number {
    nums.sort((a, b) => a - b);

    let left = 0;
    let right = nums.length - 1;
    let count = 0;
    while (left < right) {
        const sum = nums[left] + nums[right];
        if (sum === k) {
            left++;
            right--;
            count++;
        } else if (sum > k) {
            right--;
        } else {
            left++;
        }
    }

    return count;
}

/*
https://leetcode.com/problems/combination-sum-iv/description/
377. Combination Sum IV
Given an array of distinct integers nums and a target integer target, return the number of possible 
combinations that add up to target.

The test cases are generated so that the answer can fit in a 32-bit integer.

Example 1:

Input: nums = [1,2,3], target = 4
Output: 7
Explanation:
The possible combination ways are:
(1, 1, 1, 1)
(1, 1, 2)
(1, 2, 1)
(1, 3)
(2, 1, 1)
(2, 2)
(3, 1)
Note that different sequences are counted as different combinations.

Example 2:

Input: nums = [9], target = 3
Output: 0

Constraints:

	1 <= nums.length <= 200
	1 <= nums[i] <= 1000
	All the elements of nums are unique.
	1 <= target <= 1000

Follow up: What if negative numbers are allowed in the given array? How does it change the problem? 
What limitation we need to add to the question to allow negative numbers?

注：此处实际是个排列问题，不是组合问题，dfs 不可以从i开始取，一直到 nums.length-1 ，相反，每次都能从头开始取数
*/
export function combinationSum4(nums: number[], target: number): number {
    const dfs = cache((rest: number): number => {
        if (rest === 0) {
            return 1;
        }

        let count = 0;
        for (const num of nums) {
            if (rest - num >= 0) {
                count += dfs(rest - num);
            }
        }

        return count;
    });

    return dfs(target);
}

/*
https://leetcode.com/problems/mice-and-cheese/description/
2611. Mice and Cheese
There are two mice and n different types of cheese, each type of cheese should be eaten by exactly one mouse.

A point of the cheese with index i (0-indexed) is:

	reward1[i] if the first mouse eats it.
	reward2[i] if the second mouse eats it.

You are given a positive integer array reward1, a positive integer array reward2, and a non-negative integer k.

Return the maximum points the mice can achieve if the first mouse eats exactly k types of cheese.

Example 1:

Input: reward1 = [1,1,3,4], reward2 = [4,4,1,1], k = 2
Output: 15
Explanation: In this example, the first mouse eats the 2nd (0-indexed) and the 3rd types of cheese, and the second mouse eats the 0th and the 1st types of cheese.
The total points are 4 + 4 + 3 + 4 = 15.
It can be proven that 15 is the maximum total points that the mice can achieve.

Example 2:

Input: reward1 = [1,1], reward2 = [1,1], k = 2
Output: 2
Explanation: In this example, the first mouse eats the 0th (0-indexed) and 1st types of cheese, and the second mouse does not eat any cheese.
The total points are 1 + 1 = 2.
It can be proven that 2 is the maximum total points that the mice can achieve.

Constraints:

	1 <= n == reward1.length == reward2.length <= 10^5
	1 <= reward1[i], reward2[i] <= 1000
	0 <= k <= n
*/
export function miceAndCheese(
    reward1: number[],
    reward2: number[],
    k: number
): number {
    const rewards = reward1
        .map((l, i) => [l - reward2[i], l, reward2[i]])
        .sort(([diffA], [diffB]) => diffB - diffA);

    return (
        rewards.slice(0, k).reduce((acc, [, l]) => acc + l, 0) +
        rewards.slice(k).reduce((acc, [, , r]) => acc + r, 0)
    );
}

/*
https://leetcode.com/problems/least-number-of-unique-integers-after-k-removals/description/?envType=daily-question&envId=2024-02-16
1481. Least Number of Unique Integers after K Removals
Given an array of integers arr and an integer k. Find the least number of unique integers after removing exactly k elements.

Example 1:

Input: arr = [5,5,4], k = 1
Output: 1
Explanation: Remove the single 4, only 5 is left.

Example 2:

Input: arr = [4,3,1,1,3,3,2], k = 3
Output: 2
Explanation: Remove 4, 2 and either one of the two 1s or three 3s. 1 and 3 will be left.

Constraints:

	1 <= arr.length <= 10^5
	1 <= arr[i] <= 10^9
	0 <= k <= arr.length
*/
export function findLeastNumOfUniqueInts(arr: number[], k: number): number {
    const repeatTimes: Record<number, number> = {};
    arr.forEach((v) => {
        repeatTimes[v] = (repeatTimes[v] || 0) + 1;
    });

    const sortedTimes = Object.values(repeatTimes).sort((a, b) => a - b);
    let count = 0;
    for (let i = 0; i < sortedTimes.length; i++) {
        count += sortedTimes[i];

        if (count >= k) {
            return count === k
                ? sortedTimes.length - i - 1
                : sortedTimes.length - i;
        }
    }

    return 0;
}

/*
https://leetcode.com/problems/maximum-odd-binary-number/description/?envType=daily-question&envId=2024-03-01
2864. Maximum Odd Binary Number
You are given a binary string s that contains at least one '1'.

You have to rearrange the bits in such a way that the resulting binary number is the maximum odd binary number that can be created from this combination.

Return a string representing the maximum odd binary number that can be created from the given combination.

Note that the resulting string can have leading zeros.

Example 1:

Input: s = "010"
Output: "001"
Explanation: Because there is just one '1', it must be in the last position. So the answer is "001".

Example 2:

Input: s = "0101"
Output: "1001"
Explanation: One of the '1's must be in the last position. The maximum number that can be made with the remaining digits is "100". So the answer is "1001".

Constraints:

	1 <= s.length <= 100
	s consists only of '0' and '1'.
	s contains at least one '1'.
*/
export function maximumOddBinaryNumber(s: string): string {
    let oneCount = 0;
    for (let i = 0; i < s.length; i++) {
        if (s[i] === '1') {
            oneCount++;
        }
    }

    return '1'.repeat(oneCount - 1) + '0'.repeat(s.length - oneCount) + '1';
}

/*
https://leetcode.com/problems/squares-of-a-sorted-array/description/
977. Squares of a Sorted Array
Given an integer array nums sorted in non-decreasing order, return an array of the squares of each number sorted in non-decreasing order.

Example 1:

Input: nums = [-4,-1,0,3,10]
Output: [0,1,9,16,100]
Explanation: After squaring, the array becomes [16,1,0,9,100].
After sorting, it becomes [0,1,9,16,100].

Example 2:

Input: nums = [-7,-3,2,3,11]
Output: [4,9,9,49,121]

Constraints:

	1 <= nums.length <= 10^4
	-10^4 <= nums[i] <= 10^4
	nums is sorted in non-decreasing order.

Follow up: Squaring each element and sorting the new array is very trivial, could you find an O(n) solution using a different approach?
*/
export function sortedSquares(nums: number[]): number[] {
    nums = nums.map((n) => n * n);

    // find the min index
    let min = Infinity;
    let minIndex = 0;
    nums.forEach((v, i) => {
        if (v < min) {
            min = v;
            minIndex = i;
        }
    });

    // merge
    const result: number[] = new Array(nums.length);
    let left = minIndex;
    let right = minIndex + 1;
    let i = 0;
    while (left >= 0 && right < nums.length) {
        result[i++] = nums[left] <= nums[right] ? nums[left--] : nums[right++];
    }
    while (left >= 0) {
        result[i++] = nums[left--];
    }
    while (right < nums.length) {
        result[i++] = nums[right++];
    }

    return result;
}

/*
https://leetcode.com/problems/visit-array-positions-to-maximize-score/
2786. Visit Array Positions to Maximize Score
You are given a 0-indexed integer array nums and a positive integer x.

You are initially at position 0 in the array and you can visit other positions according to the following rules:

	If you are currently in position i, then you can move to any position j such that i < j.
	For each position i that you visit, you get a score of nums[i].
	If you move from a position i to a position j and the parities of nums[i] and nums[j] differ, then you lose a score of x.

Return the maximum total score you can get.

Note that initially you have nums[0] points.

Example 1:

Input: nums = [2,3,6,1,9,2], x = 5
Output: 13
Explanation: We can visit the following positions in the array: 0 -> 2 -> 3 -> 4.
The corresponding values are 2, 6, 1 and 9. Since the integers 6 and 1 have different parities, the move 2 -> 3 will make you lose a score of x = 5.
The total score will be: 2 + 6 + 1 + 9 - 5 = 13.

Example 2:

Input: nums = [2,4,6,8], x = 3
Output: 20
Explanation: All the integers in the array have the same parities, so we can visit all of them without losing any score.
The total score is: 2 + 4 + 6 + 8 = 20.

Constraints:

	2 <= nums.length <= 10^5
	1 <= nums[i], x <= 10^6
*/
export function maxScore(nums: number[], x: number): number {
    const dfs = cache((i: number, even: boolean) => {
        if (i === nums.length) {
            return 0;
        }

        const currentEven = isEven(nums[i]);
        return Math.max(
            dfs(i + 1, even),
            nums[i] + dfs(i + 1, currentEven) - (currentEven === even ? 0 : x)
        );
    });

    return nums[0] + dfs(1, isEven(nums[0]));
}

/*
https://leetcode.com/problems/semi-ordered-permutation/
2717. Semi-Ordered Permutation
You are given a 0-indexed permutation of n integers nums.

A permutation is called semi-ordered if the first number equals 1 and the last number equals n. You can perform the below operation as many times as you want until you make nums a semi-ordered permutation:

	Pick two adjacent elements in nums, then swap them.

Return the minimum number of operations to make nums a semi-ordered permutation.

A permutation is a sequence of integers from 1 to n of length n containing each number exactly once.

Example 1:

Input: nums = [2,1,4,3]
Output: 2
Explanation: We can make the permutation semi-ordered using these sequence of operations: 
1 - swap i = 0 and j = 1. The permutation becomes [1,2,4,3].
2 - swap i = 2 and j = 3. The permutation becomes [1,2,3,4].
It can be proved that there is no sequence of less than two operations that make nums a semi-ordered permutation. 

Example 2:

Input: nums = [2,4,1,3]
Output: 3
Explanation: We can make the permutation semi-ordered using these sequence of operations:
1 - swap i = 1 and j = 2. The permutation becomes [2,1,4,3].
2 - swap i = 0 and j = 1. The permutation becomes [1,2,4,3].
3 - swap i = 2 and j = 3. The permutation becomes [1,2,3,4].
It can be proved that there is no sequence of less than three operations that make nums a semi-ordered permutation.

Example 3:

Input: nums = [1,3,4,2,5]
Output: 0
Explanation: The permutation is already a semi-ordered permutation.

Constraints:

	2 <= nums.length == n <= 50
	1 <= nums[i] <= 50
	nums is a permutation.
*/
export function semiOrderedPermutation(nums: number[]): number {
    let oneIndex = -1;
    let nIndex = -1;
    nums.forEach((v, i) => {
        if (v === 1) {
            oneIndex = i;
        }
        if (v === nums.length) {
            nIndex = i;
        }
    });
    const switchOps = nIndex < oneIndex ? 1 : 0;

    return oneIndex + nums.length - 1 - nIndex - switchOps;
}

/*
https://leetcode.com/problems/bag-of-tokens/description/
948. Bag of Tokens
You start with an initial power of power, an initial score of 0, and a bag of tokens given as an integer array tokens, where each tokens[i] donates the value of tokeni.

Your goal is to maximize the total score by strategically playing these tokens. In one move, you can play an unplayed token in one of the two ways (but not both for the same token):

	Face-up: If your current power is at least tokens[i], you may play tokeni, losing tokens[i] power and gaining 1 score.
	Face-down: If your current score is at least 1, you may play tokeni, gaining tokens[i] power and losing 1 score.

Return the maximum possible score you can achieve after playing any number of tokens.

Example 1:

Input: tokens = [100], power = 50

Output: 0

Explanation: Since your score is 0 initially, you cannot play the token face-down. You also cannot play it face-up since your power (50) is less than tokens[0] (100).

Example 2:

Input: tokens = [200,100], power = 150

Output: 1

Explanation: Play token1 (100) face-up, reducing your power to 50 and increasing your score to 1.

There is no need to play token0, since you cannot play it face-up to add to your score. The maximum score achievable is 1.

Example 3:

Input: tokens = [100,200,300,400], power = 200

Output: 2

Explanation: Play the tokens in this order to get a score of 2:

	Play token0 (100) face-up, reducing power to 100 and increasing score to 1.
	Play token3 (400) face-down, increasing power to 500 and reducing score to 0.
	Play token1 (200) face-up, reducing power to 300 and increasing score to 1.
	Play token2 (300) face-up, reducing power to 0 and increasing score to 2.

The maximum score achievable is 2.

Constraints:

	0 <= tokens.length <= 1000
	0 <= tokens[i], power < 10^4
*/
export function bagOfTokensScore(tokens: number[], power: number): number {
    tokens.sort((a, b) => a - b);
    let score = 0;

    while (tokens.length) {
        if (power >= tokens[0]) {
            power -= tokens[0];
            score++;
            tokens.splice(0, 1);
        } else if (score > 0 && tokens.length > 1) {
            score--;
            power += tokens[tokens.length - 1];
            tokens.length--;
        } else {
            break;
        }
    }

    return score;
}

/*
https://leetcode.com/problems/join-two-arrays-by-id/description/
2722. Join Two Arrays by ID
Given two arrays arr1 and arr2, return a new array joinedArray. All the objects in each of the two inputs arrays will contain an id field that has an integer value. 
joinedArray is an array formed by merging arr1 and arr2 based on their id key. The length of joinedArray should be the length of unique values of id. 
The returned array should be sorted in ascending order based on the id key.

If a given id exists in one array but not the other, the single object with that id should be included in the result array without modification.

If two objects share an id, their properties should be merged into a single object:

	If a key only exists in one object, that single key-value pair should be included in the object.
	If a key is included in both objects, the value in the object from arr2 should override the value from arr1.

Example 1:

Input: 
arr1 = [
    {"id": 1, "x": 1},
    {"id": 2, "x": 9}
], 
arr2 = [
    {"id": 3, "x": 5}
]
Output: 
[
    {"id": 1, "x": 1},
    {"id": 2, "x": 9},
    {"id": 3, "x": 5}
]
Explanation: There are no duplicate ids so arr1 is simply concatenated with arr2.

Example 2:

Input: 
arr1 = [
    {"id": 1, "x": 2, "y": 3},
    {"id": 2, "x": 3, "y": 6}
], 
arr2 = [
    {"id": 2, "x": 10, "y": 20},
    {"id": 3, "x": 0, "y": 0}
]
Output: 
[
    {"id": 1, "x": 2, "y": 3},
    {"id": 2, "x": 10, "y": 20},
    {"id": 3, "x": 0, "y": 0}
]
Explanation: The two objects with id=1 and id=3 are included in the result array without modifiction. The two objects with id=2 are merged together. The keys from arr2 override the values in arr1.

Example 3:

Input: 
arr1 = [
    {"id": 1, "b": {"b": 94},"v": [4, 3], "y": 48}
]
arr2 = [
    {"id": 1, "b": {"c": 84}, "v": [1, 3]}
]
Output: [
    {"id": 1, "b": {"c": 84}, "v": [1, 3], "y": 48}
]
Explanation: The two objects with id=1 are merged together. For the keys "b" and "v" the values from arr2 are used. Since the key "y" only exists in arr1, that value is taken form arr1.

Constraints:

	arr1 and arr2 are valid JSON arrays
	Each object in arr1 and arr2 has a unique integer id key
	2 <= JSON.stringify(arr1).length <= 10^6
	2 <= JSON.stringify(arr2).length <= 10^6
*/
type JSONValue =
    | null
    | boolean
    | number
    | string
    | JSONValue[]
    | { [key: string]: JSONValue };
type ArrayType = { id: number } & Record<string, JSONValue>;

export function join(arr1: ArrayType[], arr2: ArrayType[]): ArrayType[] {
    const map2: Record<number, JSONValue> = {};
    arr2.forEach((v) => {
        map2[v.id] = v;
    });

    const set = new Set<number>();
    const result: ArrayType[] = [];
    arr1.forEach((v) => {
        if (map2[v.id]) {
            result.push(Object.assign(v, map2[v.id]));
            set.add(v.id);
        } else {
            result.push(v);
        }
    });

    if (set.size !== arr2.length) {
        arr2.forEach((v) => {
            if (!set.has(v.id)) {
                result.push(v);
            }
        });
    }

    return result.sort((a, b) => a.id - b.id);
}

/*
https://leetcode.com/problems/maximum-population-year/description/
1854. Maximum Population Year
You are given a 2D integer array logs where each logs[i] = [birthi, deathi] indicates the birth and death years of the ith person.

The population of some year x is the number of people alive during that year. The ith person is counted in year x's population if x is in the inclusive range [birthi, deathi - 1]. Note that the person is not counted in the year that they die.

Return the earliest year with the maximum population.

Example 1:

Input: logs = [[1993,1999],[2000,2010]]
Output: 1993
Explanation: The maximum population is 1, and 1993 is the earliest year with this population.

Example 2:

Input: logs = [[1950,1961],[1960,1971],[1970,1981]]
Output: 1960
Explanation: 
The maximum population is 2, and it had happened in years 1960 and 1970.
The earlier year between them is 1960.

Constraints:

	1 <= logs.length <= 100
	1950 <= birthi < deathi <= 2050
*/
export function maximumPopulation(logs: number[][]): number {
    const minYear = Math.min(...logs.map(([birth]) => birth));
    const maxYear = Math.max(...logs.map(([, death]) => death));

    let max = -Infinity;
    let maxY = -1;
    let i = maxYear - 1;
    while (i >= minYear) {
        let cur = 0;
        logs.forEach(([birth, death]) => {
            if (birth <= i && i < death) {
                cur++;
            }
        });

        if (max <= cur) {
            max = cur;
            maxY = i;
        }
        i--;
    }

    return maxY;
}

/*
https://leetcode.com/problems/decode-xored-array/description/
1720. Decode XORed Array
There is a hidden integer array arr that consists of n non-negative integers.

It was encoded into another integer array encoded of length n - 1, such that encoded[i] = arr[i] XOR arr[i + 1]. 
For example, if arr = [1,0,2,1], then encoded = [1,2,3].

You are given the encoded array. You are also given an integer first, that is the first element of arr, i.e. arr[0].

Return the original array arr. It can be proved that the answer exists and is unique.

Example 1:

Input: encoded = [1,2,3], first = 1
Output: [1,0,2,1]
Explanation: If arr = [1,0,2,1], then first = 1 and encoded = [1 XOR 0, 0 XOR 2, 2 XOR 1] = [1,2,3]

Example 2:

Input: encoded = [6,2,7,3], first = 4
Output: [4,2,0,7,4]

Constraints:

	2 <= n <= 10^4
	encoded.length == n - 1
	0 <= encoded[i] <= 10^5
	0 <= first <= 10^5
*/
export function decode(encoded: number[], first: number): number[] {
    encoded[0] ^= first;
    for (let i = 1; i < encoded.length; i++) {
        encoded[i] ^= encoded[i - 1];
    }
    encoded.unshift(first);

    return encoded;
}

/*
https://leetcode.com/problems/watering-plants/description/
2079. Watering Plants
You want to water n plants in your garden with a watering can. The plants are arranged in a row and are labeled from 0 to n - 1 from left to right where the ith plant is located at x = i. There is a river at x = -1 that you can refill your watering can at.

Each plant needs a specific amount of water. You will water the plants in the following way:

	Water the plants in order from left to right.
	After watering the current plant, if you do not have enough water to completely water the next plant, return to the river to fully refill the watering can.
	You cannot refill the watering can early.

You are initially at the river (i.e., x = -1). It takes one step to move one unit on the x-axis.

Given a 0-indexed integer array plants of n integers, where plants[i] is the amount of water the ith plant needs, and an integer capacity representing the watering can capacity, return the number of steps needed to water all the plants.

Example 1:

Input: plants = [2,2,3,3], capacity = 5
Output: 14
Explanation: Start at the river with a full watering can:
- Walk to plant 0 (1 step) and water it. Watering can has 3 units of water.
- Walk to plant 1 (1 step) and water it. Watering can has 1 unit of water.
- Since you cannot completely water plant 2, walk back to the river to refill (2 steps).
- Walk to plant 2 (3 steps) and water it. Watering can has 2 units of water.
- Since you cannot completely water plant 3, walk back to the river to refill (3 steps).
- Walk to plant 3 (4 steps) and water it.
Steps needed = 1 + 1 + 2 + 3 + 3 + 4 = 14.

Example 2:

Input: plants = [1,1,1,4,2,3], capacity = 4
Output: 30
Explanation: Start at the river with a full watering can:
- Water plants 0, 1, and 2 (3 steps). Return to river (3 steps).
- Water plant 3 (4 steps). Return to river (4 steps).
- Water plant 4 (5 steps). Return to river (5 steps).
- Water plant 5 (6 steps).
Steps needed = 3 + 3 + 4 + 4 + 5 + 5 + 6 = 30.

Example 3:

Input: plants = [7,7,7,7,7,7,7], capacity = 8
Output: 49
Explanation: You have to refill before watering each plant.
Steps needed = 1 + 1 + 2 + 2 + 3 + 3 + 4 + 4 + 5 + 5 + 6 + 6 + 7 = 49.

Constraints:

	n == plants.length
	1 <= n <= 1000
	1 <= plants[i] <= 10^6
	max(plants[i]) <= capacity <= 10^9
*/
export function wateringPlants(plants: number[], capacity: number): number {
    let steps = 0;
    let rest = capacity;
    plants.forEach((v, i) => {
        if (rest >= v) {
            rest -= v;
            steps++;
        } else {
            steps += (i << 1) | 1;
            rest = capacity - v;
        }
    });
    return steps;
}

/*
https://leetcode.com/problems/watering-plants-ii/
2105. Watering Plants II
Alice and Bob want to water n plants in their garden. The plants are arranged in a row and are labeled from 0 to n - 1 
from left to right where the ith plant is located at x = i.

Each plant needs a specific amount of water. Alice and Bob have a watering can each, initially full. 
They water the plants in the following way:

	Alice waters the plants in order from left to right, starting from the 0th plant. Bob waters the plants in order 
    from right to left, starting from the (n - 1)th plant. They begin watering the plants simultaneously.
	It takes the same amount of time to water each plant regardless of how much water it needs.
	Alice/Bob must water the plant if they have enough in their can to fully water it. Otherwise, they first 
    refill their can (instantaneously) then water the plant.
	In case both Alice and Bob reach the same plant, the one with more water currently in his/her watering can 
    should water this plant. If they have the same amount of water, then Alice should water this plant.

Given a 0-indexed integer array plants of n integers, where plants[i] is the amount of water the ith plant needs, 
and two integers capacityA and capacityB representing the capacities of Alice's and Bob's watering cans respectively, 
return the number of times they have to refill to water all the plants.

Example 1:

Input: plants = [2,2,3,3], capacityA = 5, capacityB = 5
Output: 1
Explanation:
- Initially, Alice and Bob have 5 units of water each in their watering cans.
- Alice waters plant 0, Bob waters plant 3.
- Alice and Bob now have 3 units and 2 units of water respectively.
- Alice has enough water for plant 1, so she waters it. Bob does not have enough water for plant 2, so he refills 
his can then waters it.
So, the total number of times they have to refill to water all the plants is 0 + 0 + 1 + 0 = 1.

Example 2:

Input: plants = [2,2,3,3], capacityA = 3, capacityB = 4
Output: 2
Explanation:
- Initially, Alice and Bob have 3 units and 4 units of water in their watering cans respectively.
- Alice waters plant 0, Bob waters plant 3.
- Alice and Bob now have 1 unit of water each, and need to water plants 1 and 2 respectively.
- Since neither of them have enough water for their current plants, they refill their cans and then water the plants.
So, the total number of times they have to refill to water all the plants is 0 + 1 + 1 + 0 = 2.

Example 3:

Input: plants = [5], capacityA = 10, capacityB = 8
Output: 0
Explanation:
- There is only one plant.
- Alice's watering can has 10 units of water, whereas Bob's can has 8 units. Since Alice has more water in her can, 
she waters this plant.
So, the total number of times they have to refill is 0.

Constraints:

	n == plants.length
	1 <= n <= 10^5
	1 <= plants[i] <= 10^6
	max(plants[i]) <= capacityA, capacityB <= 10^9
*/
export function minimumRefill(
    plants: number[],
    capacityA: number,
    capacityB: number
): number {
    let left = 0;
    let right = plants.length - 1;
    let refillTimes = 0;
    let restA = capacityA;
    let restB = capacityB;
    while (left < right) {
        if (restA >= plants[left]) {
            restA -= plants[left];
        } else {
            refillTimes++;
            restA = capacityA - plants[left];
        }
        left++;

        if (restB >= plants[right]) {
            restB -= plants[right];
        } else {
            refillTimes++;
            restB = capacityB - plants[right];
        }
        right--;
    }

    if (left === right && Math.max(restA, restB) < plants[left]) {
        refillTimes++;
    }

    return refillTimes;
}

/*
https://leetcode.com/problems/last-visited-integers/description/
2899. Last Visited Integers
Given an integer array nums where nums[i] is either a positive integer or -1.

We need to find for each -1 the respective positive integer, which we call the last visited integer.

To achieve this goal, let's define two empty arrays: seen and ans.

Start iterating from the beginning of the array nums.

	If a positive integer is encountered, prepend it to the front of seen.
	If -1 is encountered, let k be the number of consecutive -1s seen so far (including the current -1),

		If k is less than or equal to the length of seen, append the k-th element of seen to ans.
		If k is strictly greater than the length of seen, append -1 to ans.

Return the array ans.

Example 1:

Input: nums = [1,2,-1,-1,-1]

Output: [2,1,-1]

Explanation: Start with seen = [] and ans = [].

	Process nums[0]: The first element in nums is 1. We prepend it to the front of seen. Now, seen == [1].
	Process nums[1]: The next element is 2. We prepend it to the front of seen. Now, seen == [2, 1].
	Process nums[2]: The next element is -1. This is the first occurrence of -1, so k == 1. We look for the first element in seen. We append 2 to ans. Now, ans == [2].
	Process nums[3]: Another -1. This is the second consecutive -1, so k == 2. The second element in seen is 1, so we append 1 to ans. Now, ans == [2, 1].
	Process nums[4]: Another -1, the third in a row, making k = 3. However, seen only has two elements ([2, 1]). Since k is greater than the number of elements in seen, we append -1 to ans. Finally, ans == [2, 1, -1].

Example 2:

Input: nums = [1,-1,2,-1,-1]

Output: [1,2,1]

Explanation: Start with seen = [] and ans = [].

	Process nums[0]: The first element in nums is 1. We prepend it to the front of seen. Now, seen == [1].
	Process nums[1]: The next element is -1. This is the first occurrence of -1, so k == 1. We look for the first element in seen, which is 1. Append 1 to ans. Now, ans == [1].
	Process nums[2]: The next element is 2. Prepend this to the front of seen. Now, seen == [2, 1].
	Process nums[3]: The next element is -1. This -1 is not consecutive to the first -1 since 2 was in between. Thus, k resets to 1. The first element in seen is 2, so append 2 to ans. Now, ans == [1, 2].
	Process nums[4]: Another -1. This is consecutive to the previous -1, so k == 2. The second element in seen is 1, append 1 to ans. Finally, ans == [1, 2, 1].

Constraints:

	1 <= nums.length <= 100
	nums[i] == -1 or 1 <= nums[i] <= 100
*/
export function lastVisitedIntegers(nums: number[]): number[] {
    const seen: number[] = [];
    const ans: number[] = [];
    let k = 0;

    nums.forEach((n) => {
        if (n !== -1) {
            seen.unshift(n);
            k = 0;
        } else {
            k++;
            ans.push(k - 1 < seen.length ? seen[k - 1] : -1);
        }
    });

    return ans;
}

/*
https://leetcode.com/problems/max-dot-product-of-two-subsequences/description/
1458. Max Dot Product of Two Subsequences
Given two arrays nums1 and nums2.

Return the maximum dot product between non-empty subsequences of nums1 and nums2 with the same length.

A subsequence of a array is a new array which is formed from the original array by deleting some (can be none) 
of the characters without disturbing the relative positions of the remaining characters. 
(ie, [2,3,5] is a subsequence of [1,2,3,4,5] while [1,5,3] is not).

Example 1:

Input: nums1 = [2,1,-2,5], nums2 = [3,0,-6]
Output: 18
Explanation: Take subsequence [2,-2] from nums1 and subsequence [3,-6] from nums2.
Their dot product is (2*3 + (-2)*(-6)) = 18.

Example 2:

Input: nums1 = [3,-2], nums2 = [2,-6,7]
Output: 21
Explanation: Take subsequence [3] from nums1 and subsequence [7] from nums2.
Their dot product is (3*7) = 21.

Example 3:

Input: nums1 = [-1,-1], nums2 = [1,1]
Output: -1
Explanation: Take subsequence [-1] from nums1 and subsequence [1] from nums2.
Their dot product is -1.

Constraints:

	1 <= nums1.length, nums2.length <= 500
	-1000 <= nums1[i], nums2[i] <= 1000
*/
export function maxDotProduct(nums1: number[], nums2: number[]): number {
    const dp: number[][] = Array.from({ length: nums1.length + 1 }, () =>
        Array(nums2.length + 1).fill(-Infinity)
    );

    let product = 0;
    for (let i = 1; i <= nums1.length; i++) {
        for (let j = 1; j <= nums2.length; j++) {
            product = nums1[i - 1] * nums2[j - 1];

            dp[i][j] = Math.max(
                product,
                dp[i - 1][j - 1] + product,
                dp[i - 1][j],
                dp[i][j - 1]
            );
        }
    }

    return dp[nums1.length][nums2.length];
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
                dp[j] = Math.max(
                    Math.max(0, topLeftCorner) + nums1[i] * nums2[j],
                    dp[j - 1],
                    dp[j]
                );
            }

            topLeftCorner = nextTopLeftCorner;
        }
    }

    return dp[nums2.length - 1];
}

/*
https://leetcode.com/problems/find-if-array-can-be-sorted/description/
3011. Find if Array Can Be Sorted
You are given a 0-indexed array of positive integers nums.

In one operation, you can swap any two adjacent elements if they have the same number of set bits. 
You are allowed to do this operation any number of times (including zero).

Return true if you can sort the array, else return false.

Example 1:

Input: nums = [8,4,2,30,15]
Output: true
Explanation: Let's look at the binary representation of every element. The numbers 2, 4, and 8 have one set bit each with binary representation "10", "100", and "1000" respectively. The numbers 15 and 30 have four set bits each with binary representation "1111" and "11110".
We can sort the array using 4 operations:
- Swap nums[0] with nums[1]. This operation is valid because 8 and 4 have one set bit each. The array becomes [4,8,2,30,15].
- Swap nums[1] with nums[2]. This operation is valid because 8 and 2 have one set bit each. The array becomes [4,2,8,30,15].
- Swap nums[0] with nums[1]. This operation is valid because 4 and 2 have one set bit each. The array becomes [2,4,8,30,15].
- Swap nums[3] with nums[4]. This operation is valid because 30 and 15 have four set bits each. The array becomes [2,4,8,15,30].
The array has become sorted, hence we return true.
Note that there may be other sequences of operations which also sort the array.

Example 2:

Input: nums = [1,2,3,4,5]
Output: true
Explanation: The array is already sorted, hence we return true.

Example 3:

Input: nums = [3,16,8,4,2]
Output: false
Explanation: It can be shown that it is not possible to sort the input array using any number of operations.

Constraints:

	1 <= nums.length <= 100
	1 <= nums[i] <= 28
*/
export function canSortArray(nums: number[]): boolean {
    let prev = countBits(nums[0]);
    let min = nums[0];
    let max = nums[0];
    let prevMax = -Infinity;
    let i = 1;
    while (i < nums.length) {
        const bits = countBits(nums[i]);

        if (prev === bits) {
            min = Math.min(min, nums[i]);
            max = Math.max(max, nums[i]);
            i++;
        } else {
            if (prevMax > min) {
                return false;
            }
            prevMax = max;

            prev = bits;
            min = nums[i];
            max = nums[i];
        }
    }
    if (prevMax > min) {
        return false;
    }

    return true;
}

/*
https://leetcode.com/problems/minimum-common-value/description/
2540. Minimum Common Value
Given two integer arrays nums1 and nums2, sorted in non-decreasing order, return the minimum integer common to both arrays. 
If there is no common integer amongst nums1 and nums2, return -1.

Note that an integer is said to be common to nums1 and nums2 if both arrays have at least one occurrence of that integer.

Example 1:

Input: nums1 = [1,2,3], nums2 = [2,4]
Output: 2
Explanation: The smallest element common to both arrays is 2, so we return 2.

Example 2:

Input: nums1 = [1,2,3,6], nums2 = [2,3,4,5]
Output: 2
Explanation: There are two common elements in the array 2 and 3 out of which 2 is the smallest, so 2 is returned.

Constraints:

	1 <= nums1.length, nums2.length <= 10^5
	1 <= nums1[i], nums2[j] <= 10^9
	Both nums1 and nums2 are sorted in non-decreasing order.
*/
export function getCommon(nums1: number[], nums2: number[]): number {
    let i = 0;
    let j = 0;
    while (i < nums1.length && j < nums2.length) {
        if (nums1[i] === nums2[j]) {
            return nums1[i];
        }

        if (nums1[i] > nums2[j]) {
            j++;
        } else {
            i++;
        }
    }

    return -1;
}

/*
https://leetcode.com/problems/movement-of-robots/description/
2731. Movement of Robots
Some robots are standing on an infinite number line with their initial coordinates given by a 0-indexed integer array nums and 
will start moving once given the command to move. The robots will move a unit distance each second.

You are given a string s denoting the direction in which robots will move on command. 'L' means the robot will move towards the left side or 
negative side of the number line, whereas 'R' means the robot will move towards the right side or positive side of the number line.

If two robots collide, they will start moving in opposite directions.

Return the sum of distances between all the pairs of robots d seconds after the command. Since the sum can be very large, return it modulo 10^9 + 7.

Note: 

	For two robots at the index i and j, pair (i,j) and pair (j,i) are considered the same pair.
	When robots collide, they instantly change their directions without wasting any time.
	Collision happens when two robots share the same place in a moment.

		For example, if a robot is positioned in 0 going to the right and another is positioned in 2 going to the left, the next second they'll 
        be both in 1 and they will change direction and the next second the first one will be in 0, heading left, and another will be in 2, heading right.
		For example, if a robot is positioned in 0 going to the right and another is positioned in 1 going to the left, the next second the 
        first one will be in 0, heading left, and another will be in 1, heading right.

Example 1:

Input: nums = [-2,0,2], s = "RLL", d = 3
Output: 8
Explanation: 
After 1 second, the positions are [-1,-1,1]. Now, the robot at index 0 will move left, and the robot at index 1 will move right.
After 2 seconds, the positions are [-2,0,0]. Now, the robot at index 1 will move left, and the robot at index 2 will move right.
After 3 seconds, the positions are [-3,-1,1].
The distance between the robot at index 0 and 1 is abs(-3 - (-1)) = 2.
The distance between the robot at index 0 and 2 is abs(-3 - 1) = 4.
The distance between the robot at index 1 and 2 is abs(-1 - 1) = 2.
The sum of the pairs of all distances = 2 + 4 + 2 = 8.

Example 2:

Input: nums = [1,0], s = "RL", d = 2
Output: 5
Explanation: 
After 1 second, the positions are [2,-1].
After 2 seconds, the positions are [3,-2].
The distance between the two robots is abs(-2 - 3) = 5.

Constraints:

	2 <= nums.length <= 10^5
	-2 * 10^9 <= nums[i] <= 10^9
	0 <= d <= 10^9
	nums.length == s.length 
	s consists of 'L' and 'R' only
	nums[i] will be unique.

Hints
- Observe that if you ignore collisions, the resultant positions of robots after d seconds would be the same.
- After d seconds, sort the ending positions and use prefix sum to calculate the distance sum.
*/
export function sumDistance(nums: number[], s: string, d: number): number {
    for (let i = 0; i < s.length; i++) {
        nums[i] += s[i] === 'L' ? -d : d;
    }
    nums.sort((a, b) => a - b);

    const modulo = Math.pow(10, 9) + 7;

    let prefix = 0;
    let sum = 0;
    for (let i = 0; i < nums.length; i++) {
        sum = (sum + i * nums[i] - prefix) % modulo;
        prefix += nums[i];
    }

    return sum;
}

/*
https://leetcode.com/problems/find-the-original-array-of-prefix-xor/description/
2433. Find The Original Array of Prefix Xor
You are given an integer array pref of size n. Find and return the array arr of size n that satisfies:

	pref[i] = arr[0] ^ arr[1] ^ ... ^ arr[i].

Note that ^ denotes the bitwise-xor operation.

It can be proven that the answer is unique.

Example 1:

Input: pref = [5,2,0,3,1]
Output: [5,7,2,3,2]
Explanation: From the array [5,7,2,3,2] we have the following:
- pref[0] = 5.
- pref[1] = 5 ^ 7 = 2.
- pref[2] = 5 ^ 7 ^ 2 = 0.
- pref[3] = 5 ^ 7 ^ 2 ^ 3 = 3.
- pref[4] = 5 ^ 7 ^ 2 ^ 3 ^ 2 = 1.

Example 2:

Input: pref = [13]
Output: [13]
Explanation: We have pref[0] = arr[0] = 13.

Constraints:

	1 <= pref.length <= 10^5
	0 <= pref[i] <= 10^6
*/
export function findArray(pref: number[]): number[] {
    let prev = pref[0];

    for (let i = 1; i < pref.length; i++) {
        pref[i] ^= prev;
        prev ^= pref[i];
    }

    return pref;
}

/*
https://leetcode.com/problems/time-needed-to-buy-tickets/description/
2073. Time Needed to Buy Tickets
There are n people in a line queuing to buy tickets, where the 0th person is at the front of the line and the (n - 1)th person is at the back of the line.

You are given a 0-indexed integer array tickets of length n where the number of tickets that the ith person would like to buy is tickets[i].

Each person takes exactly 1 second to buy a ticket. A person can only buy 1 ticket at a time and has to go back to the end of the line (which happens instantaneously) in order to buy more tickets. If a person does not have any tickets left to buy, the person will leave the line.

Return the time taken for the person at position k (0-indexed) to finish buying tickets.

Example 1:

Input: tickets = [2,3,2], k = 2
Output: 6
Explanation: 
- In the first pass, everyone in the line buys a ticket and the line becomes [1, 2, 1].
- In the second pass, everyone in the line buys a ticket and the line becomes [0, 1, 0].
The person at position 2 has successfully bought 2 tickets and it took 3 + 3 = 6 seconds.

Example 2:

Input: tickets = [5,1,1,1], k = 0
Output: 8
Explanation:
- In the first pass, everyone in the line buys a ticket and the line becomes [4, 0, 0, 0].
- In the next 4 passes, only the person in position 0 is buying tickets.
The person at position 0 has successfully bought 5 tickets and it took 4 + 1 + 1 + 1 + 1 = 8 seconds.

Constraints:

	n == tickets.length
	1 <= n <= 100
	1 <= tickets[i] <= 100
	0 <= k < n
*/
export function timeRequiredToBuy(tickets: number[], k: number): number {
    const getSeconds = (start: number, end: number, min: number) => {
        let sum = 0;
        for (let i = start; i <= end; i++) {
            sum += Math.min(tickets[i], min);
        }

        return sum;
    };

    return (
        getSeconds(0, k, tickets[k]) +
        getSeconds(k + 1, tickets.length - 1, tickets[k] - 1)
    );
}

/*
https://leetcode.com/problems/binary-subarrays-with-sum/description/
930. Binary Subarrays With Sum
Given a binary array nums and an integer goal, return the number of non-empty subarrays with a sum goal.

A subarray is a contiguous part of the array.

Example 1:

Input: nums = [1,0,1,0,1], goal = 2
Output: 4
Explanation: The 4 subarrays are bolded and underlined below:
[1,0,1,0,1]
[1,0,1,0,1]
[1,0,1,0,1]
[1,0,1,0,1]

Example 2:

Input: nums = [0,0,0,0,0], goal = 0
Output: 15

Constraints:

	1 <= nums.length <= 10^4
	nums[i] is either 0 or 1.
	0 <= goal <= nums.length
*/
export function numSubarraysWithSum(nums: number[], goal: number): number {
    let prefix = 0;
    const repeatTimes: Record<number, number> = { 0: 1 };
    let count = 0;

    nums.forEach((v) => {
        prefix += v;
        count += repeatTimes[prefix - goal] || 0;
        repeatTimes[prefix] = (repeatTimes[prefix] || 0) + 1;
    });

    return count;
}

/*
https://leetcode.com/problems/product-of-array-except-self/description/?envType=daily-question&envId=2024-03-15
238. Product of Array Except Self
Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i].

The product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer.

You must write an algorithm that runs in O(n) time and without using the division operation.

Example 1:
Input: nums = [1,2,3,4]
Output: [24,12,8,6]
Example 2:
Input: nums = [-1,1,0,-3,3]
Output: [0,0,9,0,0]

Constraints:

	2 <= nums.length <= 10^5
	-30 <= nums[i] <= 30
	The product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer.

Follow up: Can you solve the problem in O(1) extra space complexity? (The output array does not count as extra space for space complexity analysis.)
*/
export function productExceptSelf(nums: number[]): number[] {
    const prefix: number[] = new Array(nums.length);
    const suffix: number[] = new Array(nums.length);
    prefix[0] = nums[0];
    suffix[nums.length - 1] = nums[nums.length - 1];

    for (let i = 1; i < nums.length; i++) {
        prefix[i] = prefix[i - 1] * nums[i];
    }
    for (let i = nums.length - 2; i >= 0; i--) {
        suffix[i] = suffix[i + 1] * nums[i];
    }

    const result: number[] = new Array(nums.length);
    for (let i = 0; i < nums.length; i++) {
        const prev = i - 1 >= 0 ? prefix[i - 1] : 1;
        const next = i + 1 < nums.length ? suffix[i + 1] : 1;
        result[i] = prev * next;
    }

    return result;
}

/*
https://leetcode.com/problems/contiguous-array/description/?envType=daily-question&envId=2024-03-16
525. Contiguous Array
Given a binary array nums, return the maximum length of a contiguous subarray with an equal number of 0 and 1.

Example 1:

Input: nums = [0,1]
Output: 2
Explanation: [0, 1] is the longest contiguous subarray with an equal number of 0 and 1.

Example 2:

Input: nums = [0,1,0]
Output: 2
Explanation: [0, 1] (or [1, 0]) is a longest contiguous subarray with equal number of 0 and 1.

Constraints:

	1 <= nums.length <= 10^5
	nums[i] is either 0 or 1.
*/
export function findMaxLength(nums: number[]): number {
    let prefix = 0;
    const map: Record<number, number> = { 0: -1 };
    let max = 0;
    for (let i = 0; i < nums.length; i++) {
        prefix += nums[i] || -1;

        // 此处不可直接使用 map[prefix] 来判断，因为 map[prefix] 如果等于 0 的话也是 false
        if (map[prefix] !== undefined) {
            max = Math.max(max, i - map[prefix]);
        } else {
            map[prefix] = i;
        }
    }

    return max;
}

/*
https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/description/
452. Minimum Number of Arrows to Burst Balloons
There are some spherical balloons taped onto a flat wall that represents the XY-plane. The balloons are represented as a 2D integer array points where points[i] = [xstart, xend] denotes a balloon whose horizontal diameter stretches between xstart and xend. You do not know the exact y-coordinates of the balloons.

Arrows can be shot up directly vertically (in the positive y-direction) from different points along the x-axis. A balloon with xstart and xend is burst by an arrow shot at x if xstart <= x <= xend. There is no limit to the number of arrows that can be shot. A shot arrow keeps traveling up infinitely, bursting any balloons in its path.

Given the array points, return the minimum number of arrows that must be shot to burst all balloons.

Example 1:

Input: points = [[10,16],[2,8],[1,6],[7,12]]
Output: 2
Explanation: The balloons can be burst by 2 arrows:
- Shoot an arrow at x = 6, bursting the balloons [2,8] and [1,6].
- Shoot an arrow at x = 11, bursting the balloons [10,16] and [7,12].

Example 2:

Input: points = [[1,2],[3,4],[5,6],[7,8]]
Output: 4
Explanation: One arrow needs to be shot for each balloon for a total of 4 arrows.

Example 3:

Input: points = [[1,2],[2,3],[3,4],[4,5]]
Output: 2
Explanation: The balloons can be burst by 2 arrows:
- Shoot an arrow at x = 2, bursting the balloons [1,2] and [2,3].
- Shoot an arrow at x = 4, bursting the balloons [3,4] and [4,5].

Constraints:

	1 <= points.length <= 10^5
	points[i].length == 2
	2^31 <= xstart < xend <= 2^31 - 1
*/
export function findMinArrowShots(points: number[][]): number {
    points.sort(([startA], [startB]) => startA - startB);

    let count = 1;
    let [, prevEnd] = points[0];
    for (let i = 1; i < points.length; i++) {
        const [start, end] = points[i];
        if (start > prevEnd) {
            prevEnd = end;
            count++;
        } else {
            prevEnd = Math.min(prevEnd, end);
        }
    }

    return count;
}

/*
https://leetcode.com/problems/arithmetic-slices/description/
413. Arithmetic Slices
An integer array is called arithmetic if it consists of at least three elements and if the difference 
between any two consecutive elements is the same.

	For example, [1,3,5,7,9], [7,7,7,7], and [3,-1,-5,-9] are arithmetic sequences.

Given an integer array nums, return the number of arithmetic subarrays of nums.

A subarray is a contiguous subsequence of the array.

Example 1:

Input: nums = [1,2,3,4]
Output: 3
Explanation: We have 3 arithmetic slices in nums: [1, 2, 3], [2, 3, 4] and [1,2,3,4] itself.

Example 2:

Input: nums = [1]
Output: 0

Constraints:

	1 <= nums.length <= 5000
	-1000 <= nums[i] <= 1000
*/
export function numberOfArithmeticSlices(nums: number[]): number {
    let count = 0;
    let i = 0;
    while (i < nums.length - 2) {
        if (nums[i + 2] - nums[i + 1] !== nums[i + 1] - nums[i]) {
            i++;
            continue;
        }

        const diff = nums[i + 1] - nums[i];
        let k = i + 3;
        while (k < nums.length && nums[k] - nums[k - 1] === diff) {
            k++;
        }
        const n = k - i;
        count += ((n - 1) * (n - 2)) / 2;
        i = k - 1;
    }

    return count;
}

/*
https://leetcode.com/problems/find-the-most-competitive-subsequence/
1673. Find the Most Competitive Subsequence
Given an integer array nums and a positive integer k, return the most competitive subsequence of nums of size k.

An array's subsequence is a resulting sequence obtained by erasing some (possibly zero) elements from the array.

We define that a subsequence a is more competitive than a subsequence b (of the same length) if in the first position where a and b differ, 
subsequence a has a number less than the corresponding number in b. For example, [1,3,4] is more competitive than [1,3,5] because the first position 
they differ is at the final number, and 4 is less than 5.

Example 1:

Input: nums = [3,5,2,6], k = 2
Output: [2,6]
Explanation: Among the set of every possible subsequence: {[3,5], [3,2], [3,6], [5,2], [5,6], [2,6]}, [2,6] is the most competitive.

Example 2:

Input: nums = [2,4,3,3,5,4,9,6], k = 4
Output: [2,3,3,4]

Constraints:

	1 <= nums.length <= 10^5
	0 <= nums[i] <= 10^9
	1 <= k <= nums.length
*/
export function mostCompetitive(nums: number[], k: number): number[] {
    const result: number[] = Array(k);
    let i = 0;
    let start = 0;
    let end = nums.length - k + i;
    while (i < k) {
        let min = nums[start];
        let minIndex = start;
        // TODO:use segment tree to optimize getting min value of range
        for (let j = start + 1; j <= end; j++) {
            if (nums[j] < min) {
                min = nums[j];
                minIndex = j;
            }
        }

        result[i++] = min;

        start = minIndex + 1;
        end = nums.length - k + i;
    }

    return result;
}

/*
https://leetcode.com/problems/find-the-duplicate-number/description/?envType=daily-question&envId=2024-03-24
287. Find the Duplicate Number
Given an array of integers nums containing n + 1 integers where each integer is in the range [1, n] inclusive.

There is only one repeated number in nums, return this repeated number.

You must solve the problem without modifying the array nums and uses only constant extra space.

Example 1:

Input: nums = [1,3,4,2,2]
Output: 2

Example 2:

Input: nums = [3,1,3,4,2]
Output: 3

Example 3:

Input: nums = [3,3,3,3,3]
Output: 3

Constraints:

	1 <= n <= 10^5
	nums.length == n + 1
	1 <= nums[i] <= n
	All the integers in nums appear only once except for precisely one integer which appears two or more times.

Follow up:

	How can we prove that at least one duplicate number must exist in nums?
	Can you solve the problem in linear runtime complexity?

本质上是个链表入环节点检测问题
*/
export function findDuplicate(nums: number[]): number {
    let slow = nums[0];
    let fast = nums[nums[0]];
    while (slow != fast) {
        slow = nums[slow];
        fast = nums[nums[fast]];
    }
    fast = 0;
    while (fast != slow) {
        fast = nums[fast];
        slow = nums[slow];
    }

    return slow;
}

/*
https://leetcode.com/problems/predict-the-winner/description/
486. Predict the Winner
You are given an integer array nums. Two players are playing a game with this array: player 1 and player 2.

Player 1 and player 2 take turns, with player 1 starting first. Both players start the game with a score of 0. At each turn, the player takes one of the numbers from either end of the array (i.e., nums[0] or nums[nums.length - 1]) which reduces the size of the array by 1. The player adds the chosen number to their score. The game ends when there are no more elements in the array.

Return true if Player 1 can win the game. If the scores of both players are equal, then player 1 is still the winner, and you should also return true. You may assume that both players are playing optimally.

Example 1:

Input: nums = [1,5,2]
Output: false
Explanation: Initially, player 1 can choose between 1 and 2. 
If he chooses 2 (or 1), then player 2 can choose from 1 (or 2) and 5. If player 2 chooses 5, then player 1 will be left with 1 (or 2). 
So, final score of player 1 is 1 + 2 = 3, and player 2 is 5. 
Hence, player 1 will never be the winner and you need to return false.

Example 2:

Input: nums = [1,5,233,7]
Output: true
Explanation: Player 1 first chooses 1. Then player 2 has to choose between 5 and 7. No matter which number player 2 choose, player 1 can choose 233.
Finally, player 1 has more score (234) than player 2 (12), so you need to return True representing player1 can win.

Constraints:

	1 <= nums.length <= 20
	0 <= nums[i] <= 10^7
*/
export function predictTheWinner(nums: number[]): boolean {
    const first = cache((left: number, right: number): number => {
        if (left === right) {
            return nums[left];
        }

        return Math.max(
            nums[left] + last(left + 1, right),
            nums[right] + last(left, right - 1)
        );
    });

    const last = cache((left: number, right: number): number => {
        if (left === right) {
            return 0;
        }

        return Math.min(first(left + 1, right), first(left, right - 1));
    });

    return first(0, nums.length - 1) >= last(0, nums.length - 1);
}

/*
https://leetcode.com/problems/find-all-duplicates-in-an-array/description/
442. Find All Duplicates in an Array
Given an integer array nums of length n where all the integers of nums are in the range [1, n] and each integer appears once or twice, 
return an array of all the integers that appears twice.

You must write an algorithm that runs in O(n) time and uses only constant extra space.

Example 1:
Input: nums = [4,3,2,7,8,2,3,1]
Output: [2,3]
Example 2:
Input: nums = [1,1,2]
Output: [1]
Example 3:
Input: nums = [1]
Output: []

Constraints:

	n == nums.length
	1 <= n <= 10^5
	1 <= nums[i] <= n
	Each element in nums appears once or twice.
*/
export function findDuplicates(nums: number[]): number[] {
    const result: number[] = [];

    nums.forEach((v) => {
        const index = Math.abs(v) - 1;
        if (nums[index] > 0) {
            nums[index] = -nums[index];
        } else {
            result.push(index + 1);
        }
    });

    return result;
}

/*
https://leetcode.com/problems/subarray-product-less-than-k/description/
713. Subarray Product Less Than K
Given an array of integers nums and an integer k, return the number of contiguous subarrays where the product 
of all the elements in the subarray is strictly less than k.

Example 1:

Input: nums = [10,5,2,6], k = 100
Output: 8
Explanation: The 8 subarrays that have product less than 100 are:
[10], [5], [2], [6], [10, 5], [5, 2], [2, 6], [5, 2, 6]
Note that [10, 5, 2] is not included as the product of 100 is not strictly less than k.

Example 2:

Input: nums = [1,2,3], k = 0
Output: 0

Constraints:

    1 <= nums.length <= 10^4
    1 <= nums[i] <= 1000
    0 <= k <= 10^6
*/
export function numSubarrayProductLessThanK(nums: number[], k: number): number {
    let left = 0;
    let right = 0;
    let product = 1;
    let count = 0;
    while (left < nums.length) {
        while (right < nums.length && product < k) {
            product *= nums[right++];
        }

        if (left < right) {
            count += product < k ? right - left : right - left - 1;
            product /= nums[left++];
        } else {
            product = 1;
            right = ++left;
        }
    }

    return count;
}

/*
https://leetcode.com/problems/length-of-longest-subarray-with-at-most-k-frequency/description/
2958. Length of Longest Subarray With at Most K Frequency
You are given an integer array nums and an integer k.

The frequency of an element x is the number of times it occurs in an array.

An array is called good if the frequency of each element in this array is less than or equal to k.

Return the length of the longest good subarray of nums.

A subarray is a contiguous non-empty sequence of elements within an array.

Example 1:

Input: nums = [1,2,3,1,2,3,1,2], k = 2
Output: 6
Explanation: The longest possible good subarray is [1,2,3,1,2,3] since the values 1, 2, and 3 occur at most twice in this subarray. Note that the subarrays [2,3,1,2,3,1] and [3,1,2,3,1,2] are also good.
It can be shown that there are no good subarrays with length more than 6.

Example 2:

Input: nums = [1,2,1,2,1,2,1,2], k = 1
Output: 2
Explanation: The longest possible good subarray is [1,2] since the values 1 and 2 occur at most once in this subarray. Note that the subarray [2,1] is also good.
It can be shown that there are no good subarrays with length more than 2.

Example 3:

Input: nums = [5,5,5,5,5,5,5], k = 4
Output: 4
Explanation: The longest possible good subarray is [5,5,5,5] since the value 5 occurs 4 times in this subarray.
It can be shown that there are no good subarrays with length more than 4.

Constraints:

	1 <= nums.length <= 10^5
	1 <= nums[i] <= 10^9
	1 <= k <= nums.length
*/
export function maxSubarrayLength(nums: number[], k: number): number {
    let freqMap: Record<number, number> = {};
    let left = 0;
    let right = 0;
    let maxLen = 0;

    while (right < nums.length) {
        const cur = nums[right];
        freqMap[cur] = (freqMap[cur] || 0) + 1;
        right++;

        if (freqMap[cur] <= k) {
            maxLen = Math.max(right - left, maxLen);
        }

        while (freqMap[cur] > k) {
            freqMap[nums[left]] -= 1;
            left++;
        }
    }

    return maxLen;
}
