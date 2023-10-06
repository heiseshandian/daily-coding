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
