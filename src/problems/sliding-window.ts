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

/* 
https://leetcode.com/problems/repeated-dna-sequences/

The DNA sequence is composed of a series of nucleotides abbreviated as 'A', 'C', 'G', and 'T'.

For example, "ACGAATTCCG" is a DNA sequence.
When studying DNA, it is useful to identify repeated sequences within the DNA.

Given a string s that represents a DNA sequence, return all the 10-letter-long sequences (substrings) that occur more than once in a DNA molecule. 
You may return the answer in any order.

直接从前向后遍历即可，不用先遍历一遍拿到所有的tokens然后再遍历s对比token最后一次出现的下标是否比当前token更早
*/
export function findRepeatedDnaSequences(s: string): string[] {
    if (s.length < 11) {
        return [];
    }

    const dnaSeq = new Set<string>();
    const visited = new Set<string>();
    let start = 0;
    let end = 10;
    // 此处可以取到等于，因为slice不包含end处的字符，end-1是最后一个可以取到的字符
    while (end <= s.length) {
        const dna = s.slice(start, end);
        if (visited.has(dna)) {
            dnaSeq.add(dna);
        }
        visited.add(dna);
        start++;
        end++;
    }

    return Array.from(dnaSeq);
}
