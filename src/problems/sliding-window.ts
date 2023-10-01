import { SlidingWindow } from '../algorithm/sliding-window';

/* 
https://leetcode.com/problems/constrained-subsequence-sum/

Given an integer array nums and an integer k, return the maximum sum of a non-empty 
subsequence of that array such that for every two consecutive integers in the subsequence, 
nums[i] and nums[j], where i < j, the condition j - i <= k is satisfied.

A subsequence of an array is obtained by deleting some number of elements (can be zero) from the array, 
leaving the remaining elements in their original order.
*/
export function constrainedSubsetSum(nums: number[], k: number): number {
    // dp[i] 以i为结尾的数组最大的非空子序列的和
    const dp: number[] = new Array(nums.length);
    dp[0] = nums[0];

    let max = dp[0];
    // 使用滑动窗口来加速求解窗口内最大值问题
    const s = new SlidingWindow(dp);
    for (let i = 1; i < nums.length; i++) {
        s.moveRight();
        if (i >= k + 1) {
            s.moveLeft();
        }

        dp[i] = nums[i] + Math.max(0, s.peek());
        max = Math.max(max, dp[i]);
    }

    return max;
}
