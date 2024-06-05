/*
https://leetcode.com/problems/minimum-path-sum/description/
64. Minimum Path Sum
Given a m x n grid filled with non-negative numbers, find a path from top left to bottom right, which minimizes the sum of all numbers along its path.

Note: You can only move either down or right at any point in time.

Example 1:

Input: grid = [[1,3,1],[1,5,1],[4,2,1]]
Output: 7
Explanation: Because the path 1 → 3 → 1 → 1 → 1 minimizes the sum.

Example 2:

Input: grid = [[1,2,3],[4,5,6]]
Output: 12

Constraints:

	m == grid.length
	n == grid[i].length
	1 <= m, n <= 200
	0 <= grid[i][j] <= 200
*/
export function minPathSum(grid: number[][]): number {
    const n = grid.length;
    const m = grid[0].length;
    const dp: number[] = Array(m);
    dp[0] = grid[0][0];
    for (let j = 1; j < m; j++) {
        dp[j] = dp[j - 1] + grid[0][j];
    }

    for (let i = 1; i < n; i++) {
        dp[0] += grid[i][0];
        for (let j = 1; j < m; j++) {
            dp[j] = Math.min(dp[j - 1], dp[j]) + grid[i][j];
        }
    }

    return dp[m - 1];
}

/*
https://leetcode.com/problems/longest-common-subsequence/description/
1143. Longest Common Subsequence
Given two strings text1 and text2, return the length of their longest common subsequence. If there is no common subsequence, return 0.

A subsequence of a string is a new string generated from the original string with some characters (can be none) deleted without changing the relative order of the remaining characters.

	For example, "ace" is a subsequence of "abcde".

A common subsequence of two strings is a subsequence that is common to both strings.

Example 1:

Input: text1 = "abcde", text2 = "ace" 
Output: 3  
Explanation: The longest common subsequence is "ace" and its length is 3.

Example 2:

Input: text1 = "abc", text2 = "abc"
Output: 3
Explanation: The longest common subsequence is "abc" and its length is 3.

Example 3:

Input: text1 = "abc", text2 = "def"
Output: 0
Explanation: There is no such common subsequence, so the result is 0.

Constraints:

	1 <= text1.length, text2.length <= 1000
	text1 and text2 consist of only lowercase English characters.
*/
export function longestCommonSubsequence(text1: string, text2: string): number {
    const short = text1.length < text2.length ? text1 : text2;
    const long = short === text1 ? text2 : text1;
    const n = short.length;
    const m = long.length;
    const dp: number[] = Array(n + 1).fill(0);

    for (let i = 1; i <= m; i++) {
        let leftUp = 0;
        let backup = 0;
        for (let j = 1; j <= n; j++) {
            backup = dp[j];
            if (short[j - 1] === long[i - 1]) {
                dp[j] = leftUp + 1;
            } else {
                dp[j] = Math.max(dp[j - 1], dp[j]);
            }
            leftUp = backup;
        }
    }

    return dp[n];
}
