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

/*
https://leetcode.com/problems/knight-probability-in-chessboard/description/
688. Knight Probability in Chessboard
On an n x n chessboard, a knight starts at the cell (row, column) and attempts to make exactly k moves. The rows and columns are 0-indexed, so the top-left cell is (0, 0), and the bottom-right cell is (n - 1, n - 1).

A chess knight has eight possible moves it can make, as illustrated below. Each move is two cells in a cardinal direction, then one cell in an orthogonal direction.

Each time the knight is to move, it chooses one of eight possible moves uniformly at random (even if the piece would go off the chessboard) and moves there.

The knight continues moving until it has made exactly k moves or has moved off the chessboard.

Return the probability that the knight remains on the board after it has stopped moving.

Example 1:

Input: n = 3, k = 2, row = 0, column = 0
Output: 0.06250
Explanation: There are two moves (to (1,2), (2,1)) that will keep the knight on the board.
From each of those positions, there are also two moves that will keep the knight on the board.
The total probability the knight stays on the board is 0.0625.

Example 2:

Input: n = 1, k = 0, row = 0, column = 0
Output: 1.00000

Constraints:

	1 <= n <= 25
	0 <= k <= 100
	0 <= row, column <= n - 1
*/
export function knightProbability(
  n: number,
  k: number,
  row: number,
  column: number
): number {
  const dirs: number[][] = [
    [1, 2],
    [2, 1],
    [2, -1],
    [1, -2],
    [-1, -2],
    [-2, -1],
    [-2, 1],
    [-1, 2],
  ];
  const dp: number[][][] = Array.from({ length: k + 1 }, () =>
    Array.from({ length: n }, () => Array(n).fill(1))
  );

  for (let i = 1; i <= k; i++) {
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        let p = 0;
        dirs.forEach(([x, y]) => {
          const nextR = r + x;
          const nextC = c + y;
          if (nextR >= 0 && nextR < n && nextC >= 0 && nextC < n) {
            p += dp[i][nextR][nextC];
          }
        });

        dp[i][r][c] = p / 8;
      }
    }
  }

  return dp[k][row][column];
}

/*
https://leetcode.com/problems/maximum-subarray/description/
53. Maximum Subarray
Given an integer array nums, find the subarray with the largest sum, and return its sum.

Example 1:

Input: nums = [-2,1,-3,4,-1,2,1,-5,4]
Output: 6
Explanation: The subarray [4,-1,2,1] has the largest sum 6.

Example 2:

Input: nums = [1]
Output: 1
Explanation: The subarray [1] has the largest sum 1.

Example 3:

Input: nums = [5,4,-1,7,8]
Output: 23
Explanation: The subarray [5,4,-1,7,8] has the largest sum 23.

Constraints:

	1 <= nums.length <= 10^5
	-10^4 <= nums[i] <= 10^4

Follow up: If you have figured out the O(n) solution, try coding another solution using the divide and conquer approach, which is more subtle.
*/
export function maxSubArray(nums: number[]): number {
  let sum = 0;
  let max = -Infinity;
  nums.forEach((v) => {
    sum = Math.max(v, sum + v);
    max = Math.max(max, sum);
  });

  return max;
}

/*
https://leetcode.com/problems/house-robber/description/
198. House Robber
You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed, 
the only constraint stopping you from robbing each of them is that adjacent houses have security systems connected and it will 
automatically contact the police if two adjacent houses were broken into on the same night.

Given an integer array nums representing the amount of money of each house, return the maximum amount of money you can rob 
tonight without alerting the police.

Example 1:

Input: nums = [1,2,3,1]
Output: 4
Explanation: Rob house 1 (money = 1) and then rob house 3 (money = 3).
Total amount you can rob = 1 + 3 = 4.

Example 2:

Input: nums = [2,7,9,3,1]
Output: 12
Explanation: Rob house 1 (money = 2), rob house 3 (money = 9) and rob house 5 (money = 1).
Total amount you can rob = 2 + 9 + 1 = 12.

Constraints:

	1 <= nums.length <= 100
	0 <= nums[i] <= 400
*/
export function rob(nums: number[]): number {
  const n = nums.length;
  const dp = Array<number>(n);
  dp[0] = nums[0];
  dp[1] = Math.max(nums[0], nums[1]);

  for (let i = 2; i < n; i++) {
    dp[i] = Math.max(dp[i - 1], dp[i - 2] + nums[i], nums[i]);
  }

  return dp[n - 1];
}

/*
https://leetcode.com/problems/maximum-sum-circular-subarray/description/
918. Maximum Sum Circular Subarray
Given a circular integer array nums of length n, return the maximum possible sum of a non-empty subarray of nums.

A circular array means the end of the array connects to the beginning of the array. Formally, 
the next element of nums[i] is nums[(i + 1) % n] and the previous element of nums[i] is nums[(i - 1 + n) % n].

A subarray may only include each element of the fixed buffer nums at most once. Formally, for a subarray nums[i], 
nums[i + 1], ..., nums[j], there does not exist i <= k1, k2 <= j with k1 % n == k2 % n.

Example 1:

Input: nums = [1,-2,3,-2]
Output: 3
Explanation: Subarray [3] has maximum sum 3.

Example 2:

Input: nums = [5,-3,5]
Output: 10
Explanation: Subarray [5,5] has maximum sum 5 + 5 = 10.

Example 3:

Input: nums = [-3,-2,-3]
Output: -2
Explanation: Subarray [-2] has maximum sum -2.

Constraints:

	n == nums.length
	1 <= n <= 10^4
	-3 * 10^4 <= nums[i] <= 10^4
*/
export function maxSubarraySumCircular(nums: number[]): number {
  let sum = nums[0];
  let prevMax = nums[0];
  let prevMin = Math.min(0, nums[0]);
  let max = prevMax;
  let min = prevMin;
  for (let i = 1; i < nums.length; i++) {
    sum += nums[i];

    prevMax = Math.max(prevMax + nums[i], nums[i]);
    prevMin = Math.min(prevMin + nums[i], nums[i]);
    max = Math.max(max, prevMax);
    min = Math.min(min, prevMin);
  }

  return sum === min ? max : Math.max(max, sum - min);
}

/*
https://leetcode.com/problems/house-robber-iv/description/
2560. House Robber IV
There are several consecutive houses along a street, each of which has some money inside. There is also a robber, 
who wants to steal money from the homes, but he refuses to steal from adjacent homes.

The capability of the robber is the maximum amount of money he steals from one house of all the houses he robbed.

You are given an integer array nums representing how much money is stashed in each house. More formally, the ith house from the left has nums[i] dollars.

You are also given an integer k, representing the minimum number of houses the robber will steal from. It is always possible to steal at least k houses.

Return the minimum capability of the robber out of all the possible ways to steal at least k houses.

Example 1:

Input: nums = [2,3,5,9], k = 2
Output: 5
Explanation: 
There are three ways to rob at least 2 houses:
- Rob the houses at indices 0 and 2. Capability is max(nums[0], nums[2]) = 5.
- Rob the houses at indices 0 and 3. Capability is max(nums[0], nums[3]) = 9.
- Rob the houses at indices 1 and 3. Capability is max(nums[1], nums[3]) = 9.
Therefore, we return min(5, 9, 9) = 5.

Example 2:

Input: nums = [2,7,9,3,1], k = 2
Output: 2
Explanation: There are 7 ways to rob the houses. The way which leads to minimum capability is to rob the house at index 0 and 4.
Return max(nums[0], nums[4]) = 2.

Constraints:

	1 <= nums.length <= 10^5
	1 <= nums[i] <= 10^9
	1 <= k <= (nums.length + 1)/2
*/
export function minCapability1(nums: number[], k: number): number {
  const canSteal = (m: number): boolean => {
    let prePrev = nums[0] <= m ? 1 : 0;
    let prev = Math.max(nums[1] <= m ? 1 : 0, prePrev);
    let cur = prev;
    for (let i = 2; i < nums.length; i++) {
      if (nums[i] <= m) {
        cur = Math.max(prev, prePrev + 1);
      } else {
        cur = prev;
      }

      prePrev = prev;
      prev = cur;
    }

    return cur >= k;
  };

  let l = 0;
  let r = Math.max(...nums);
  let min = r;
  while (l <= r) {
    const m = l + ((r - l) >> 1);
    if (canSteal(m)) {
      r = m - 1;
      min = m;
    } else {
      l = m + 1;
    }
  }

  return min;
}

export function minCapability(nums: number[], k: number): number {
  const canSteal = (m: number): boolean => {
    let sum = 0;
    for (let i = 0; i < nums.length; i++) {
      // 能偷的时候尽早偷即可（因为偷前面的还是偷后面的都是偷了一间房）
      // 能偷之后直接绕过下一间房
      if (nums[i] <= m) {
        sum++;
        i++;
      }
      if (sum >= k) {
        return true;
      }
    }

    return sum >= k;
  };

  let l = 0;
  let r = Math.max(...nums);
  let min = r;
  while (l <= r) {
    const m = l + ((r - l) >> 1);
    if (canSteal(m)) {
      r = m - 1;
      min = m;
    } else {
      l = m + 1;
    }
  }

  return min;
}

/*
https://leetcode.com/problems/rotate-function/description/?envType=problem-list-v2&envId=dynamic-programming
396. Rotate Function
You are given an integer array nums of length n.

Assume arrk to be an array obtained by rotating nums by k positions clock-wise. We define the rotation function F on nums as follow:

	F(k) = 0 * arrk[0] + 1 * arrk[1] + ... + (n - 1) * arrk[n - 1].

Return the maximum value of F(0), F(1), ..., F(n-1).

The test cases are generated so that the answer fits in a 32-bit integer.

Example 1:

Input: nums = [4,3,2,6]
Output: 26
Explanation:
F(0) = (0 * 4) + (1 * 3) + (2 * 2) + (3 * 6) = 0 + 3 + 4 + 18 = 25
F(1) = (0 * 6) + (1 * 4) + (2 * 3) + (3 * 2) = 0 + 4 + 6 + 6 = 16
F(2) = (0 * 2) + (1 * 6) + (2 * 4) + (3 * 3) = 0 + 6 + 8 + 9 = 23
F(3) = (0 * 3) + (1 * 2) + (2 * 6) + (3 * 4) = 0 + 2 + 12 + 12 = 26
So the maximum value of F(0), F(1), F(2), F(3) is F(3) = 26.

Example 2:

Input: nums = [100]
Output: 0

Constraints:

	n == nums.length
	1 <= n <= 10^5
	-100 <= nums[i] <= 100
*/
export function maxRotateFunction(nums: number[]): number {
  const n = nums.length;
  let prev = 0;
  let next = 0;
  let sum = 0;
  for (let i = 0; i < n; i++) {
    prev += i * nums[i];
    sum += nums[i];
  }

  let max = prev;
  for (let i = 1; i < n; i++) {
    next = prev - sum + n * nums[i - 1];
    max = Math.max(max, next);
    prev = next;
  }

  return max;
}
