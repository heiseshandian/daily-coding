import { cache } from '../design-pattern/proxy';
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

/*
https://leetcode.com/problems/longest-palindromic-subsequence/description/
516. Longest Palindromic Subsequence
Given a string s, find the longest palindromic subsequence's length in s.

A subsequence is a sequence that can be derived from another sequence by deleting some or no elements without changing the order of the remaining elements.

Example 1:

Input: s = "bbbab"
Output: 4
Explanation: One possible longest palindromic subsequence is "bbbb".

Example 2:

Input: s = "cbbd"
Output: 2
Explanation: One possible longest palindromic subsequence is "bb".

Constraints:

	1 <= s.length <= 1000
	s consists only of lowercase English letters.
*/
export function longestPalindromeSubseq(s: string): number {
    const n = s.length;
    const dp: number[] = Array(n).fill(1);

    for (let i = n - 2; i >= 0; i--) {
        let leftDown = 0;
        let backup = 0;
        for (let j = i + 1; j < n; j++) {
            backup = dp[j];
            if (s[j] === s[i]) {
                dp[j] = 2 + leftDown;
            } else {
                dp[j] = Math.max(dp[j - 1], dp[j]);
            }
            leftDown = backup;
        }
    }

    return dp[n - 1];
}

/*
https://leetcode.com/problems/longest-palindromic-substring/description/
5. Longest Palindromic Substring
Given a string s, return the longest palindromic substring in s.

Example 1:

Input: s = "babad"
Output: "bab"
Explanation: "aba" is also a valid answer.

Example 2:

Input: s = "cbbd"
Output: "bb"

Constraints:

	1 <= s.length <= 1000
	s consist of only digits and English letters.
*/
export function longestPalindrome(s: string): string {
    const n = s.length;
    const dp: boolean[] = Array(n).fill(false);
    let [l, r] = [0, 0];
    for (let i = n - 1; i >= 0; i--) {
        dp[i] = true;
        for (let j = n - 1; j > i; j--) {
            if (s[j] === s[i] && (j - i === 1 || dp[j - 1])) {
                dp[j] = true;
                if (r - l < j - i) {
                    l = i;
                    r = j;
                }
            } else {
                dp[j] = false;
            }
        }
    }

    return s.slice(l, r + 1);
}

/*
https://leetcode.com/problems/ones-and-zeroes/description/
474. Ones and Zeroes
You are given an array of binary strings strs and two integers m and n.

Return the size of the largest subset of strs such that there are at most m 0's and n 1's in the subset.

A set x is a subset of a set y if all elements of x are also elements of y.

Example 1:

Input: strs = ["10","0001","111001","1","0"], m = 5, n = 3
Output: 4
Explanation: The largest subset with at most 5 0's and 3 1's is {"10", "0001", "1", "0"}, so the answer is 4.
Other valid but smaller subsets include {"0001", "1"} and {"10", "1", "0"}.
{"111001"} is an invalid subset because it contains 4 1's, greater than the maximum of 3.

Example 2:

Input: strs = ["10","0","1"], m = 1, n = 1
Output: 2
Explanation: The largest subset is {"0", "1"}, so the answer is 2.

Constraints:

	1 <= strs.length <= 600
	1 <= strs[i].length <= 100
	strs[i] consists only of digits '0' and '1'.
	1 <= m, n <= 100
*/
export function findMaxForm(strs: string[], m: number, n: number): number {
    const countZeros = (str: string) => {
        let zeros = 0;
        for (let i = 0; i < str.length; i++) {
            if (str[i] === '0') {
                zeros++;
            }
        }

        return zeros;
    };

    const dp: number[][] = Array.from({ length: m + 1 }, () =>
        Array(n + 1).fill(0)
    );
    for (let i = strs.length - 1; i >= 0; i--) {
        const zeros = countZeros(strs[i]);
        const ones = strs[i].length - zeros;
        for (let j = m; j >= zeros; j--) {
            for (let k = n; k >= ones; k--) {
                dp[j][k] = Math.max(dp[j][k], 1 + dp[j - zeros][k - ones]);
            }
        }
    }

    return dp[m][n];
}

/*
https://leetcode.com/problems/profitable-schemes/description/
879. Profitable Schemes
There is a group of n members, and a list of various crimes they could commit. The ith crime generates a profit[i] and requires group[i] members to participate in it. If a member participates in one crime, that member can't participate in another crime.

Let's call a profitable scheme any subset of these crimes that generates at least minProfit profit, and the total number of members participating in that subset of crimes is at most n.

Return the number of schemes that can be chosen. Since the answer may be very large, return it modulo 109 + 7.

Example 1:

Input: n = 5, minProfit = 3, group = [2,2], profit = [2,3]
Output: 2
Explanation: To make a profit of at least 3, the group could either commit crimes 0 and 1, or just crime 1.
In total, there are 2 schemes.

Example 2:

Input: n = 10, minProfit = 5, group = [2,3,5], profit = [6,7,8]
Output: 7
Explanation: To make a profit of at least 5, the group could commit any crimes, as long as they commit one.
There are 7 possible schemes: (0), (1), (2), (0,1), (0,2), (1,2), and (0,1,2).

Constraints:

	1 <= n <= 100
	0 <= minProfit <= 100
	1 <= group.length <= 100
	1 <= group[i] <= 100
	profit.length == group.length
	0 <= profit[i] <= 100
*/
export function profitableSchemes(
    n: number,
    minProfit: number,
    group: number[],
    profit: number[]
): number {
    const MOD = Math.pow(10, 9) + 7;

    const dp: number[][] = Array.from({ length: minProfit + 1 }, () =>
        Array(n + 1).fill(0)
    );
    for (let k = 0; k <= n; k++) {
        dp[0][k] = 1;
    }

    for (let i = group.length - 1; i >= 0; i--) {
        for (let j = minProfit; j >= 0; j--) {
            const tmp = Math.max(0, j - profit[i]);
            for (let k = n; k >= group[i]; k--) {
                dp[j][k] = (dp[j][k] + dp[tmp][k - group[i]]) % MOD;
            }
        }
    }

    return dp[minProfit][n];
}
