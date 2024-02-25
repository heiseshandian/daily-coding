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
