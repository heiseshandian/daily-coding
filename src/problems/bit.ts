import { getCharIndex } from '../common/index';
import { getRightOne } from '../algorithm/exclusive-or';
import { countBits, setRightMostBit, unsetRightMostBit } from '../common/bit';

// 求一个数的n次方
export function pow(a: number, n: number): number {
  let result = 1;
  let t = a;
  while (n !== 0) {
    if ((n & 1) !== 0) {
      result *= t;
    }
    // a
    // a^2
    // a^4
    // ...
    t *= t;
    n = n >>> 1;
  }

  return result;
}

/* 
https://leetcode.com/problems/game-of-life/

According to Wikipedia's article: "The Game of Life, also known simply as Life, is a cellular automaton devised by the British mathematician John Horton Conway in 1970."

The board is made up of an m x n grid of cells, where each cell has an initial state: live (represented by a 1) or dead (represented by a 0).
Each cell interacts with its eight neighbors (horizontal, vertical, diagonal) using the following four rules (taken from the above Wikipedia article):

Any live cell with fewer than two live neighbors dies as if caused by under-population.
Any live cell with two or three live neighbors lives on to the next generation.
Any live cell with more than three live neighbors dies, as if by over-population.
Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.

The next state is created by applying the above rules simultaneously to every cell in the current state, 
where births and deaths occur simultaneously. Given the current state of the m x n grid board, return the next state.

技巧，每个位置都是int类型数据，目前就第一位有信息，我们可以用第二位来存储下一个状态的信息，秒啊
*/
export function gameOfLife(board: number[][]): void {
  const nextLive = 0b10;

  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[0].length; j++) {
      const lives = neighbors(board, i, j);
      const cur = lifeState(board, i, j);
      if ((cur === 1 && lives == 2) || lives === 3) {
        board[i][j] |= nextLive;
      }
    }
  }

  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[0].length; j++) {
      board[i][j] >>= 1;
    }
  }
}

function neighbors(board: number[][], i: number, j: number): number {
  return (
    lifeState(board, i + 1, j) +
    lifeState(board, i + 1, j - 1) +
    lifeState(board, i + 1, j + 1) +
    lifeState(board, i - 1, j) +
    lifeState(board, i - 1, j - 1) +
    lifeState(board, i - 1, j + 1) +
    lifeState(board, i, j - 1) +
    lifeState(board, i, j + 1)
  );
}

function lifeState(board: number[][], i: number, j: number): 0 | 1 {
  return i >= 0 &&
    i < board.length &&
    j >= 0 &&
    j < board[0].length &&
    (board[i][j] & 1) === 1
    ? 1
    : 0;
}

// 逆序二进制位
export function reverseBits(n: number): number {
  // n无符号右移16位之后高16位变成0 原先的高16位移动到低16位
  // n左移16位之后低16位变成0 原先的低16位移动到高位
  // 两者或运算之后高16位和低16位就交换过来了
  n = (n >>> 16) | (n << 16);
  // 高8位和低8位交换
  n = ((n & 0xff00ff00) >>> 8) | ((n & 0x00ff00ff) << 8);
  // 高4位和低4位交换
  n = ((n & 0xf0f0f0f0) >>> 4) | ((n & 0x0f0f0f0f) << 4);
  // 高2位和低2位交换
  n = ((n & 0xcccccccc) >>> 2) | ((n & 0x33333333) << 2);
  // 高1位和低1位交换
  n = ((n & 0xaaaaaaaa) >>> 1) | ((n & 0x55555555) << 1);

  // https://stackoverflow.com/questions/40884030/how-to-declare-an-unsigned-int-variable-in-javascript
  // js中所有整数字面量会被默认当成有符号整数，通过 >>>0这种神奇的方式可以把n变成无符号整数
  return n >>> 0;
}

export function reverseBits2(n: number): number {
  if (!n) return 0;
  let result = 0;
  for (let i = 0; i < 32; i++) {
    result = result * 2 + (n & 1);
    n = n >>> 1;
  }

  return result;
}

/* 
https://leetcode.com/problems/maximum-product-of-word-lengths/

Given a string array words, return the maximum value of length(word[i]) * length(word[j]) 
where the two words do not share common letters. If no such two words exist, return 0.
*/
export function maxProduct(words: string[]): number {
  // 一共有26个英文字母，我们可以用26位二进制位来表示某个字母有没有出现过，然后通过按位或的结果来判断两个字符串有没有公共字母
  const bits = words.map((word) => convertWordToBit(word));

  let max = 0;
  for (let i = 0; i < words.length; i++) {
    for (let j = i + 1; j < words.length; j++) {
      // 按位或等于0说明两个字符串没有公共字母
      if ((bits[i] & bits[j]) === 0) {
        max = Math.max(max, words[i].length * words[j].length);
      }
    }
  }

  return max;
}

function convertWordToBit(word: string): number {
  let bit = 0;

  for (let i = 0; i < word.length; i++) {
    bit = bit | (1 << getCharIndex(word[i]));
  }

  return bit;
}

/* 
https://leetcode.com/problems/single-number/description/

Given a non-empty array of integers nums, every element appears twice except for one. Find that single one.

You must implement a solution with a linear runtime complexity and use only constant extra space.
*/
export function singleNumber(nums: number[]): number {
  // 两个相同的数字异或的结果是0，任何数异或0都是本身
  let xor = 0;
  for (let i = 0; i < nums.length; i++) {
    xor ^= nums[i];
  }

  return xor;
}

/* 
https://leetcode.com/problems/single-number-ii/description/

Given an integer array nums where every element appears three times except for one, which appears exactly once. 
Find the single element and return it.

You must implement a solution with a linear runtime complexity and use only constant extra space.

// 统计每一位1的个数，并根据是否能被3整除来判断只出现一次的数字在那一位上是1还是0
// 能被3整除则仅出现一次的数字那一位必然是0，否则必然是1
*/
export function singleNumber2(nums: number[]): number {
  let result = 0;
  for (let i = 31; i >= 0; i--) {
    let count = 0;
    for (let j = 0; j < nums.length; j++) {
      if ((nums[j] >> i) & 1) {
        count++;
      }
    }

    if (count % 3 > 0) {
      result |= 1 << i;
    }
  }

  return result;
}

/* 
https://leetcode.com/problems/single-number-iii/

Given an integer array nums, in which exactly two elements appear only once and all the other elements appear exactly twice. 
Find the two elements that appear only once. You can return the answer in any order.

You must write an algorithm that runs in linear runtime complexity and uses only constant extra space.
*/
export function singleNumber3(nums: number[]): number[] {
  // 假设这两个独立的数是a和b，则xor=a^b
  // 我们需要通过某种方式将a和b区分开，由于异或可以看成是无进位相加，所以xor最右侧的1必然来自于a或者b
  // 也就是说在xor最右侧的1这一位a和b必然是一个是0一个是1，我们可以通过这个特性将两者区分开
  let xor = 0;
  for (let i = 0; i < nums.length; i++) {
    xor ^= nums[i];
  }

  const rightOne = getRightOne(xor);
  let a = 0;
  for (let i = 0; i < nums.length; i++) {
    if (rightOne & nums[i]) {
      a ^= nums[i];
    }
  }

  return [a, xor ^ a];
}

/* 
https://leetcode.com/problems/bitwise-and-of-numbers-range/description/

Given two integers left and right that represent the range [left, right], 
return the bitwise AND of all numbers in this range, inclusive.

分析
假设 
left的二进制表示是  1xxx1....
right的二进制表示为 1xxx1....
则left和right之间必然能找到 
1xxx1 01111111 和
1xxx1 10000000
这两个&之后的结果是 1xxx100000000
任何数和0与都是0，所以最终结果就是1xxxx1，也就是left和right的二进制表示的公共前缀部分
*/
export function rangeBitwiseAnd(left: number, right: number): number {
  let result = 0;

  for (let i = 0; i <= 31; i++) {
    if (left >> i === right >> i) {
      // 先右移，后左移，右边i位会变成0
      result = (left >> i) << i;
      break;
    }
  }

  return result;
}

/* 
https://leetcode.com/problems/count-the-number-of-consistent-strings/

You are given a string allowed consisting of distinct characters and an array of strings words. 
A string is consistent if all characters in the string appear in the string allowed.

Return the number of consistent strings in the array words.
*/
export function countConsistentStrings(
  allowed: string,
  words: string[]
): number {
  const allowedBit = convertWordToBit(allowed);
  let count = 0;
  for (let i = 0; i < words.length; i++) {
    // 若出现新的字符则必然按位或的结果大于 allowedBit（因为在其他位置出现了新的1）
    if ((allowedBit | convertWordToBit(words[i])) <= allowedBit) {
      count++;
    }
  }

  return count;
}

/* 
https://leetcode.com/problems/gray-code/description/

An n-bit gray code sequence is a sequence of 2^n integers where:

Every integer is in the inclusive range [0, 2^n - 1],
The first integer is 0,
An integer appears no more than once in the sequence,
The binary representation of every pair of adjacent integers differs by exactly one bit, and
The binary representation of the first and last integers differs by exactly one bit.
Given an integer n, return any valid n-bit gray code sequence.

1 <= n <= 16
*/
export function grayCode(n: number): number[] {
  const result: number[] = [0];

  while (n--) {
    for (let i = result.length - 1; i >= 0; i--) {
      result[i] <<= 1;
      result.push(result[i] | 1);
    }
  }

  return result;
}

/*
https://leetcode.com/problems/power-of-two/description/?envType=daily-question&envId=2024-02-19
231. Power of Two
Given an integer n, return true if it is a power of two. Otherwise, return false.

An integer n is a power of two, if there exists an integer x such that n == 2x.

Example 1:

Input: n = 1
Output: true
Explanation: 20 = 1

Example 2:

Input: n = 16
Output: true
Explanation: 24 = 16

Example 3:

Input: n = 3
Output: false

Constraints:

    -2^31 <= n <= 2^31 - 1

Follow up: Could you solve it without loops/recursion?
*/
export function isPowerOfTwo(n: number): boolean {
  if (n < 0) {
    return false;
  }
  let oneCount = 0;
  while (n) {
    oneCount += n & 1;
    n >>= 1;
  }

  return oneCount === 1;
}

export function isPowerOfTwo2(n: number): boolean {
  return n === (n & (~n + 1));
}

/*
https://leetcode.com/problems/missing-number/description/
268. Missing Number
Given an array nums containing n distinct numbers in the range [0, n], return the only number in the range that is missing from the array.

Example 1:

Input: nums = [3,0,1]
Output: 2
Explanation: n = 3 since there are 3 numbers, so all numbers are in the range [0,3]. 2 is the missing number in the range since it does not appear in nums.

Example 2:

Input: nums = [0,1]
Output: 2
Explanation: n = 2 since there are 2 numbers, so all numbers are in the range [0,2]. 2 is the missing number in the range since it does not appear in nums.

Example 3:

Input: nums = [9,6,4,2,3,5,7,0,1]
Output: 8
Explanation: n = 9 since there are 9 numbers, so all numbers are in the range [0,9]. 8 is the missing number in the range since it does not appear in nums.

Constraints:

    n == nums.length
    1 <= n <= 10^4
    0 <= nums[i] <= n
    All the numbers of nums are unique.

Follow up: Could you implement a solution using only O(1) extra space complexity and O(n) runtime complexity?
*/
export function missingNumber(nums: number[]): number {
  let xor = 0;

  for (let i = 0; i < nums.length; i++) {
    xor ^= nums[i] ^ (i + 1);
  }

  return xor;
}

/*
https://leetcode.com/problems/minimum-operations-to-reduce-an-integer-to-0/description/?envType=list&envId=mhgl61ev
2571. Minimum Operations to Reduce an Integer to 0
You are given a positive integer n, you can do the following operation any number of times:

	Add or subtract a power of 2 from n.

Return the minimum number of operations to make n equal to 0.

A number x is power of 2 if x == 2i where i >= 0.

Example 1:

Input: n = 39
Output: 3
Explanation: We can do the following operations:
- Add 20 = 1 to n, so now n = 40.
- Subtract 23 = 8 from n, so now n = 32.
- Subtract 25 = 32 from n, so now n = 0.
It can be shown that 3 is the minimum number of operations we need to make n equal to 0.

Example 2:

Input: n = 54
Output: 3
Explanation: We can do the following operations:
- Add 21 = 2 to n, so now n = 56.
- Add 23 = 8 to n, so now n = 64.
- Subtract 26 = 64 from n, so now n = 0.
So the minimum number of operations is 3.

Constraints:

	1 <= n <= 10^5
*/
export function minOperations(n: number): number {
  const ones = n.toString(2).split('0');
  let prev = ones[ones.length - 1].length;
  let minOp = 0;
  for (let i = ones.length - 2; i >= 0; i--) {
    if (ones[i].length >= 1 && prev >= 2) {
      minOp++;
      ones.splice(i, 1);
    } else {
      prev = ones[i].length;
    }
  }

  ones.forEach((v) => {
    minOp += Math.min(2, v.length);
  });

  return minOp;
}

/*
https://leetcode.com/problems/minimum-number-of-operations-to-make-array-xor-equal-to-k/description/
2997. Minimum Number of Operations to Make Array XOR Equal to K
You are given a 0-indexed integer array nums and a positive integer k.

You can apply the following operation on the array any number of times:

	Choose any element of the array and flip a bit in its binary representation. Flipping a bit means changing a 0 to 1 or vice versa.

Return the minimum number of operations required to make the bitwise XOR of all elements of the final array equal to k.

Note that you can flip leading zero bits in the binary representation of elements. For example, for the number (101)2 you 
can flip the fourth bit and obtain (1101)2.

Example 1:

Input: nums = [2,1,3,4], k = 1
Output: 2
Explanation: We can do the following operations:
- Choose element 2 which is 3 == (011)2, we flip the first bit and we obtain (010)2 == 2. nums becomes [2,1,2,4].
- Choose element 0 which is 2 == (010)2, we flip the third bit and we obtain (110)2 = 6. nums becomes [6,1,2,4].
The XOR of elements of the final array is (6 XOR 1 XOR 2 XOR 4) == 1 == k.
It can be shown that we cannot make the XOR equal to k in less than 2 operations.

Example 2:

Input: nums = [2,0,2,0], k = 0
Output: 0
Explanation: The XOR of elements of the array is (2 XOR 0 XOR 2 XOR 0) == 0 == k. So no operation is needed.

Constraints:

	1 <= nums.length <= 10^5
	0 <= nums[i] <= 10^6
	0 <= k <= 10^6
*/
export function minOperations2(nums: number[], k: number): number {
  let minOp = 0;
  const max = Math.pow(10, 6).toString(2).length;
  let i = 0;
  while (i < max) {
    const kBit = k & 1;
    k >>= 1;

    const numBit = nums.reduce((acc, cur, i) => {
      acc ^= cur & 1;
      nums[i] >>= 1;
      return acc;
    }, 0);

    if (kBit !== numBit) {
      minOp++;
    }
    i++;
  }

  return minOp;
}

/*
https://leetcode.com/problems/number-of-steps-to-reduce-a-number-in-binary-representation-to-one/description/
1404. Number of Steps to Reduce a Number in Binary Representation to One
Given the binary representation of an integer as a string s, return the number of steps to reduce it to 1 under the following rules:

	If the current number is even, you have to divide it by 2.

	If the current number is odd, you have to add 1 to it.

It is guaranteed that you can always reach one for all test cases.

Example 1:

Input: s = "1101"
Output: 6
Explanation: "1101" corressponds to number 13 in their decimal representation.
Step 1) 13 is odd, add 1 and obtain 14. 
Step 2) 14 is even, divide by 2 and obtain 7.
Step 3) 7 is odd, add 1 and obtain 8.
Step 4) 8 is even, divide by 2 and obtain 4.  
Step 5) 4 is even, divide by 2 and obtain 2. 
Step 6) 2 is even, divide by 2 and obtain 1.  

Example 2:

Input: s = "10"
Output: 1
Explanation: "10" corressponds to number 2 in their decimal representation.
Step 1) 2 is even, divide by 2 and obtain 1.  

Example 3:

Input: s = "1"
Output: 0

Constraints:

	1 <= s.length <= 500
	s consists of characters '0' or '1'
	s[0] == '1'
*/
export function numSteps(s: string): number {
  const bits = s.split('');
  let steps = 0;

  while (bits.length > 1) {
    const last = bits[bits.length - 1];

    if (last === '0') {
      bits.pop();
    } else {
      addOneToBinaryArrayInPlace(bits);
    }
    steps++;
  }

  return steps;
}

function addOneToBinaryArrayInPlace(bits: string[]): void {
  let carry = 1;

  for (let i = bits.length - 1; i >= 0; i--) {
    if (bits[i] === '1' && carry === 1) {
      bits[i] = '0';
    } else if (bits[i] === '0' && carry === 1) {
      bits[i] = '1';
      carry = 0;
      break;
    } else {
      break;
    }
  }

  if (carry === 1) {
    bits.unshift('1');
  }
}

/*
https://leetcode.com/problems/number-complement/description/?envType=daily-question&envId=2024-08-22
476. Number Complement
The complement of an integer is the integer you get when you flip all the 0's to 1's and all the 1's to 0's in its binary representation.

	For example, The integer 5 is "101" in binary and its complement is "010" which is the integer 2.

Given an integer num, return its complement.

Example 1:

Input: num = 5
Output: 2
Explanation: The binary representation of 5 is 101 (no leading zero bits), and its complement is 010. So you need to output 2.

Example 2:

Input: num = 1
Output: 0
Explanation: The binary representation of 1 is 1 (no leading zero bits), and its complement is 0. So you need to output 0.

Constraints:

	1 <= num < 2^31

Note: This question is the same as 1009: https://leetcode.com/problems/complement-of-base-10-integer/
*/
export function findComplement(num: number): number {
  const len = num.toString(2).length;
  const mask = (1 << len) - 1;
  return num ^ mask;
}

/*
https://leetcode.com/problems/minimum-bit-flips-to-convert-number/description/
2220. Minimum Bit Flips to Convert Number
A bit flip of a number x is choosing a bit in the binary representation of x and flipping it from either 0 to 1 or 1 to 0.

	For example, for x = 7, the binary representation is 111 and we may choose any bit (including any leading zeros not shown) and flip it. We can flip the first bit from the right to get 110, flip the second bit from the right to get 101, flip the fifth bit from the right (a leading zero) to get 10111, etc.

Given two integers start and goal, return the minimum number of bit flips to convert start to goal.

Example 1:

Input: start = 10, goal = 7
Output: 3
Explanation: The binary representation of 10 and 7 are 1010 and 0111 respectively. We can convert 10 to 7 in 3 steps:
- Flip the first bit from the right: 1010 -> 1011.
- Flip the third bit from the right: 1011 -> 1111.
- Flip the fourth bit from the right: 1111 -> 0111.
It can be shown we cannot convert 10 to 7 in less than 3 steps. Hence, we return 3.

Example 2:

Input: start = 3, goal = 4
Output: 3
Explanation: The binary representation of 3 and 4 are 011 and 100 respectively. We can convert 3 to 4 in 3 steps:
- Flip the first bit from the right: 011 -> 010.
- Flip the second bit from the right: 010 -> 000.
- Flip the third bit from the right: 000 -> 100.
It can be shown we cannot convert 3 to 4 in less than 3 steps. Hence, we return 3.

Constraints:

	0 <= start, goal <= 10^9
*/
export function minBitFlips(start: number, goal: number): number {
  let min = 0;
  while (start || goal) {
    if ((start & 1) !== (goal & 1)) {
      min++;
    }
    start >>= 1;
    goal >>= 1;
  }

  return min;
}

/*
https://leetcode.com/problems/matchsticks-to-square/description/
473. Matchsticks to Square
You are given an integer array matchsticks where matchsticks[i] is the length of the ith matchstick. You want to use all the matchsticks to make one square. You should not break any stick, but you can link them up, and each matchstick must be used exactly one time.

Return true if you can make this square and false otherwise.

Example 1:

Input: matchsticks = [1,1,2,2,2]
Output: true
Explanation: You can form a square with length 2, one side of the square came two sticks with length 1.

Example 2:

Input: matchsticks = [3,3,3,3,4]
Output: false
Explanation: You cannot find a way to form a square with all the matchsticks.

Constraints:

	1 <= matchsticks.length <= 15
	1 <= matchsticks[i] <= 10^8
*/
export function makesquare(matchsticks: number[]): boolean {
  const sum = matchsticks.reduce((s, c) => s + c, 0);
  if (sum % 4 !== 0) {
    return false;
  }

  const edgeLen = sum / 4;
  const n = matchsticks.length;
  const dp: boolean[] = Array(1 << n);

  const dfs = (status: number, edge: number, rest: number): boolean => {
    if (dp[status] !== undefined) {
      return dp[status];
    }
    if (edge === 3) {
      dp[status] = true;
      return true;
    }
    if (rest === 0) {
      return dfs(status, edge + 1, edgeLen);
    }

    for (let i = 0; i < n; i++) {
      if (status & (1 << i) && matchsticks[i] <= rest) {
        const ret = dfs(status ^ (1 << i), edge, rest - matchsticks[i]);
        if (ret) {
          dp[status] = true;
          return true;
        }
      }
    }

    dp[status] = false;
    return false;
  };

  return dfs((1 << (n + 1)) - 1, 0, edgeLen);
}

/**
 * https://www.luogu.com.cn/problem/P1171
 * # 售货员的难题

## 题目描述

某乡有 $n\ (2\le n\le 20)$ 个村庄，有一个售货员，他要到各个村庄去售货，各村庄之间的路程 $s\ (0<s<1000)$ 是已知的，且 $A$ 村到 $B$ 村与 $B$ 村到 $A$ 村的路大多不同。为了提高效率，他从商店出发到每个村庄一次，然后返回商店所在的村，假设商店所在的村庄为 $1$，他不知道选择什么样的路线才能使所走的路程最短。请你帮他选择一条最短的路。

## 输入格式

村庄数 $n$ 和各村之间的路程（均是整数）。

第一行，第 $i+1$ 行第 $j$ 个数代表村庄 $i$ 到 $j$ 的单向路径的路程。

## 输出格式

最短的路程。

## 样例 #1

### 样例输入 #1

```
3
0 2 1
1 0 2
2 1 0
```

### 样例输出 #1

```
3
```
 */
export function shortestTravelingPath(grid: number[][]) {
  const n = grid.length;
  const dp: number[][] = Array.from({ length: 1 << n }, () => Array(n));
  const target = (1 << n) - 1;

  const dfs = (status: number, index: number): number => {
    if (dp[status][index] !== undefined) {
      return dp[status][index];
    }
    if (status === target) {
      dp[status][index] = grid[index][0];
      return grid[index][0];
    }

    let min = Infinity;
    for (let i = 0; i < n; i++) {
      if ((status & (1 << i)) === 0) {
        min = Math.min(min, grid[index][i] + dfs(status | (1 << i), i));
      }
    }

    dp[status][index] = min;
    return min;
  };

  return dfs(1, 0);
}

/*
https://leetcode.com/problems/number-of-ways-to-wear-different-hats-to-each-other/description/
1434. Number of Ways to Wear Different Hats to Each Other
There are n people and 40 types of hats labeled from 1 to 40.

Given a 2D integer array hats, where hats[i] is a list of all hats preferred by the ith person.

Return the number of ways that the n people wear different hats to each other.

Since the answer may be too large, return it modulo 10^9 + 7.

Example 1:

Input: hats = [[3,4],[4,5],[5]]
Output: 1
Explanation: There is only one way to choose hats given the conditions. 
First person choose hat 3, Second person choose hat 4 and last one hat 5.

Example 2:

Input: hats = [[3,5,1],[3,5]]
Output: 4
Explanation: There are 4 ways to choose hats:
(3,5), (5,3), (1,3) and (1,5)

Example 3:

Input: hats = [[1,2,3,4],[1,2,3,4],[1,2,3,4],[1,2,3,4]]
Output: 24
Explanation: Each person can choose hats labeled from 1 to 4.
Number of Permutations of (1,2,3,4) = 24.

Constraints:

	n == hats.length
	1 <= n <= 10
	1 <= hats[i].length <= 40
	1 <= hats[i][j] <= 40
	hats[i] contains a list of unique integers.
*/
export function numberWays(hats: number[][]): number {
  const MOD = 1e9 + 7;

  const bits: number[] = Array(41).fill(0);
  let m = 1;
  hats.forEach((colors, i) => {
    colors.forEach((c) => {
      bits[c] |= 1 << i;
      m = Math.max(m, c);
    });
  });
  bits.length = m + 1;

  const n = hats.length;
  const dp: number[][] = Array.from({ length: 1 << n }, () => Array(m + 1));
  const target = (1 << n) - 1;

  const dfs = (status: number, index: number): number => {
    if (dp[status][index] !== undefined) {
      return dp[status][index];
    }
    if (status === target) {
      return 1;
    }
    if (index === bits.length) {
      return 0;
    }

    let ret = dfs(status, index + 1);
    for (let j = 0; j < n; j++) {
      if ((status & (1 << j)) === 0 && bits[index] & (1 << j)) {
        ret = (ret + dfs(status | (1 << j), index + 1)) % MOD;
      }
    }

    dp[status][index] = ret;
    return ret;
  };

  return dfs(0, 1);
}

/*
https://leetcode.com/problems/xor-queries-of-a-subarray/description/
1310. XOR Queries of a Subarray
You are given an array arr of positive integers. You are also given the array queries where queries[i] = [lefti, righti].

For each query i compute the XOR of elements from lefti to righti (that is, arr[lefti] XOR arr[lefti + 1] XOR ... XOR arr[righti] ).

Return an array answer where answer[i] is the answer to the ith query.

Example 1:

Input: arr = [1,3,4,8], queries = [[0,1],[1,2],[0,3],[3,3]]
Output: [2,7,14,8] 
Explanation: 
The binary representation of the elements in the array are:
1 = 0001 
3 = 0011 
4 = 0100 
8 = 1000 
The XOR values for queries are:
[0,1] = 1 xor 3 = 2 
[1,2] = 3 xor 4 = 7 
[0,3] = 1 xor 3 xor 4 xor 8 = 14 
[3,3] = 8

Example 2:

Input: arr = [4,8,2,10], queries = [[2,3],[1,3],[0,0],[0,3]]
Output: [8,0,4,4]

Constraints:

	1 <= arr.length, queries.length <= 10^4
	1 <= arr[i] <= 10^9
	queries[i].length == 2
	0 <= lefti <= righti < arr.length
*/
export function xorQueries(arr: number[], queries: number[][]): number[] {
  const n = arr.length;
  const prefix = Array(n);
  prefix[0] = arr[0];
  for (let i = 1; i < n; i++) {
    prefix[i] = prefix[i - 1] ^ arr[i];
  }

  const ret: number[] = Array(queries.length);
  queries.forEach(([left, right], i) => {
    ret[i] = prefix[right] ^ prefix[left - 1];
  });

  return ret;
}

/*
https://leetcode.com/problems/longest-subarray-with-maximum-bitwise-and/description/
2419. Longest Subarray With Maximum Bitwise AND
You are given an integer array nums of size n.

Consider a non-empty subarray from nums that has the maximum possible bitwise AND.

	In other words, let k be the maximum value of the bitwise AND of any subarray of nums. Then, only subarrays with a bitwise AND equal to k should be considered.

Return the length of the longest such subarray.

The bitwise AND of an array is the bitwise AND of all the numbers in it.

A subarray is a contiguous sequence of elements within an array.

Example 1:

Input: nums = [1,2,3,3,2,2]
Output: 2
Explanation:
The maximum possible bitwise AND of a subarray is 3.
The longest subarray with that value is [3,3], so we return 2.

Example 2:

Input: nums = [1,2,3,4]
Output: 1
Explanation:
The maximum possible bitwise AND of a subarray is 4.
The longest subarray with that value is [4], so we return 1.

Constraints:

	1 <= nums.length <= 10^5
	1 <= nums[i] <= 10^6
*/
export function longestSubarray(nums: number[]): number {
  const max = Math.max(...nums);
  let m = 1;
  let count = 0;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === max) {
      count++;

      m = Math.max(m, count);
    } else {
      count = 0;
    }
  }

  return m;
}

/*
https://leetcode.com/problems/largest-combination-with-bitwise-and-greater-than-zero/description/
2275. Largest Combination With Bitwise AND Greater Than Zero
The bitwise AND of an array nums is the bitwise AND of all integers in nums.

	For example, for nums = [1, 5, 3], the bitwise AND is equal to 1 & 5 & 3 = 1.
	Also, for nums = [7], the bitwise AND is 7.

You are given an array of positive integers candidates. Evaluate the bitwise AND of every combination of numbers of candidates. Each number in candidates may only be used once in each combination.

Return the size of the largest combination of candidates with a bitwise AND greater than 0.

Example 1:

Input: candidates = [16,17,71,62,12,24,14]
Output: 4
Explanation: The combination [16,17,62,24] has a bitwise AND of 16 & 17 & 62 & 24 = 16 > 0.
The size of the combination is 4.
It can be shown that no combination with a size greater than 4 has a bitwise AND greater than 0.
Note that more than one combination may have the largest size.
For example, the combination [62,12,24,14] has a bitwise AND of 62 & 12 & 24 & 14 = 8 > 0.

Example 2:

Input: candidates = [8,8]
Output: 2
Explanation: The largest combination [8,8] has a bitwise AND of 8 & 8 = 8 > 0.
The size of the combination is 2, so we return 2.

Constraints:

	1 <= candidates.length <= 10^5
	1 <= candidates[i] <= 10^7
*/
export function largestCombination(candidates: number[]): number {
  const bits = Array((1e7).toString(2).length).fill(0);
  candidates.forEach((v) => {
    let i = 0;
    while (v > 0) {
      if (v & 1) {
        bits[i]++;
      }
      v >>= 1;
      i++;
    }
  });

  return Math.max(...bits);
}

/*
https://leetcode.com/problems/maximum-xor-for-each-query/description/
1829. Maximum XOR for Each Query
You are given a sorted array nums of n non-negative integers and an integer maximumBit. You want to perform the following query n times:

	Find a non-negative integer k < 2maximumBit such that nums[0] XOR nums[1] XOR ... XOR nums[nums.length-1] XOR k is maximized. k is the answer to the ith query.
	Remove the last element from the current array nums.

Return an array answer, where answer[i] is the answer to the ith query.

Example 1:

Input: nums = [0,1,1,3], maximumBit = 2
Output: [0,3,2,3]
Explanation: The queries are answered as follows:
1st query: nums = [0,1,1,3], k = 0 since 0 XOR 1 XOR 1 XOR 3 XOR 0 = 3.
2nd query: nums = [0,1,1], k = 3 since 0 XOR 1 XOR 1 XOR 3 = 3.
3rd query: nums = [0,1], k = 2 since 0 XOR 1 XOR 2 = 3.
4th query: nums = [0], k = 3 since 0 XOR 3 = 3.

Example 2:

Input: nums = [2,3,4,7], maximumBit = 3
Output: [5,2,6,5]
Explanation: The queries are answered as follows:
1st query: nums = [2,3,4,7], k = 5 since 2 XOR 3 XOR 4 XOR 7 XOR 5 = 7.
2nd query: nums = [2,3,4], k = 2 since 2 XOR 3 XOR 4 XOR 2 = 7.
3rd query: nums = [2,3], k = 6 since 2 XOR 3 XOR 6 = 7.
4th query: nums = [2], k = 5 since 2 XOR 5 = 7.

Example 3:

Input: nums = [0,1,2,2,5,7], maximumBit = 3
Output: [4,3,6,4,6,7]

Constraints:

	nums.length == n
	1 <= n <= 10^5
	1 <= maximumBit <= 20
	0 <= nums[i] < 2maximumBit
	nums​​​ is sorted in ascending order.
*/
export function getMaximumXor(nums: number[], maximumBit: number): number[] {
  let xor = nums.reduce((s, v) => s ^ v, 0);
  const k = (1 << maximumBit) - 1;

  const ret: number[] = Array(nums.length);
  for (let i = 0; i < nums.length; i++) {
    ret[i] = xor ^ k;
    xor ^= nums[nums.length - 1 - i];
  }

  return ret;
}

/*
https://leetcode.com/problems/minimum-array-end/description/
3133. Minimum Array End
You are given two integers n and x. You have to construct an array of positive integers nums of size n where for every 0 <= i < n - 1, nums[i + 1] is greater than nums[i], and the result of the bitwise AND operation between all elements of nums is x.

Return the minimum possible value of nums[n - 1].

Example 1:

Input: n = 3, x = 4

Output: 6

Explanation:

nums can be [4,5,6] and its last element is 6.

Example 2:

Input: n = 2, x = 7

Output: 15

Explanation:

nums can be [7,15] and its last element is 15.

Constraints:

	1 <= n, x <= 10^8
*/
export function minEnd(n: number, x: number): number {
  let nBigInt = BigInt(n) - 1n;
  let xBigInt = BigInt(x);
  let offset = 1n;

  while (nBigInt > 0) {
    if ((offset & xBigInt) === 0n) {
      if (nBigInt & 1n) {
        xBigInt |= offset;
      }

      nBigInt >>= 1n;
    }

    offset <<= 1n;
  }

  return Number(xBigInt);
}

/*
https://leetcode.com/problems/shortest-subarray-with-or-at-least-k-ii/description/
3097. Shortest Subarray With OR at Least K II
You are given an array nums of non-negative integers and an integer k.

An array is called special if the bitwise OR of all of its elements is at least k.

Return the length of the shortest special non-empty subarray of nums, or return -1 if no special subarray exists.

Example 1:

Input: nums = [1,2,3], k = 2

Output: 1

Explanation:

The subarray [3] has OR value of 3. Hence, we return 1.

Example 2:

Input: nums = [2,1,8], k = 10

Output: 3

Explanation:

The subarray [2,1,8] has OR value of 11. Hence, we return 3.

Example 3:

Input: nums = [1,2], k = 0

Output: 1

Explanation:

The subarray [1] has OR value of 1. Hence, we return 1.

Constraints:

	1 <= nums.length <= 10^5
	0 <= nums[i] <= 10^9
	0 <= k <= 10^9
*/
export function minimumSubarrayLength(nums: number[], k: number): number {
  const n = nums.length;
  const bits: number[] = new Array(32).fill(0);
  let min = n + 1;
  let s = 0;
  let left = 0;

  for (let right = 0; right < n; right++) {
    const x = nums[right];
    s |= x;

    for (let h = 0; h < 32; h++) {
      if ((x >> h) & 1) {
        bits[h] += 1;
      }
    }

    while (s >= k && left <= right) {
      min = Math.min(min, right - left + 1);
      const y = nums[left];

      for (let h = 0; h < 32; h++) {
        if ((y >> h) & 1) {
          bits[h] -= 1;
          if (bits[h] === 0) {
            s ^= 1 << h;
          }
        }
      }
      left += 1;
    }
  }

  return min > n ? -1 : min;
}

/*
https://leetcode.com/problems/construct-the-minimum-bitwise-array-ii/description/
3315. Construct the Minimum Bitwise Array II
You are given an array nums consisting of n prime integers.

You need to construct an array ans of length n, such that, for each index i, the bitwise OR of ans[i] and ans[i] + 1 is equal to nums[i], i.e. ans[i] OR (ans[i] + 1) == nums[i].

Additionally, you must minimize each value of ans[i] in the resulting array.

If it is not possible to find such a value for ans[i] that satisfies the condition, then set ans[i] = -1.

Example 1:

Input: nums = [2,3,5,7]

Output: [-1,1,4,3]

Explanation:

	For i = 0, as there is no value for ans[0] that satisfies ans[0] OR (ans[0] + 1) = 2, so ans[0] = -1.
	For i = 1, the smallest ans[1] that satisfies ans[1] OR (ans[1] + 1) = 3 is 1, because 1 OR (1 + 1) = 3.
	For i = 2, the smallest ans[2] that satisfies ans[2] OR (ans[2] + 1) = 5 is 4, because 4 OR (4 + 1) = 5.
	For i = 3, the smallest ans[3] that satisfies ans[3] OR (ans[3] + 1) = 7 is 3, because 3 OR (3 + 1) = 7.

Example 2:

Input: nums = [11,13,31]

Output: [9,12,15]

Explanation:

	For i = 0, the smallest ans[0] that satisfies ans[0] OR (ans[0] + 1) = 11 is 9, because 9 OR (9 + 1) = 11.
	For i = 1, the smallest ans[1] that satisfies ans[1] OR (ans[1] + 1) = 13 is 12, because 12 OR (12 + 1) = 13.
	For i = 2, the smallest ans[2] that satisfies ans[2] OR (ans[2] + 1) = 31 is 15, because 15 OR (15 + 1) = 31.

Constraints:

	1 <= nums.length <= 100
	2 <= nums[i] <= 10^9
	nums[i] is a prime number.
*/
export function minBitwiseArray(nums: number[]): number[] {
  return nums.map((v) => {
    if (v === 2) {
      return -1;
    }

    let offset = 1;
    while (offset & v) {
      offset <<= 1;
    }

    return v - (offset >> 1);
  });
}

/*
https://leetcode.com/problems/minimize-xor/description/
2429. Minimize XOR
Given two positive integers num1 and num2, find the positive integer x such that:

	x has the same number of set bits as num2, and
	The value x XOR num1 is minimal.

Note that XOR is the bitwise XOR operation.

Return the integer x. The test cases are generated such that x is uniquely determined.

The number of set bits of an integer is the number of 1's in its binary representation.

Example 1:

Input: num1 = 3, num2 = 5
Output: 3
Explanation:
The binary representations of num1 and num2 are 0011 and 0101, respectively.
The integer 3 has the same number of set bits as num2, and the value 3 XOR 3 = 0 is minimal.

Example 2:

Input: num1 = 1, num2 = 12
Output: 3
Explanation:
The binary representations of num1 and num2 are 0001 and 1100, respectively.
The integer 3 has the same number of set bits as num2, and the value 3 XOR 1 = 2 is minimal.

Constraints:

	1 <= num1, num2 <= 10^9
*/
export function minimizeXor(num1: number, num2: number): number {
  const diff = countBits(num1) - countBits(num2);
  const setBit = diff > 0 ? unsetRightMostBit : setRightMostBit;
  let x = num1;
  let absDiff = Math.abs(diff);
  while (absDiff) {
    x = setBit(x);
    absDiff--;
  }

  return x;
}

/*
https://leetcode.com/problems/bitwise-xor-of-all-pairings/description/
2425. Bitwise XOR of All Pairings
You are given two 0-indexed arrays, nums1 and nums2, consisting of non-negative integers. There exists another array, nums3, which contains the bitwise XOR of all pairings of integers between nums1 and nums2 (every integer in nums1 is paired with every integer in nums2 exactly once).

Return the bitwise XOR of all integers in nums3.

Example 1:

Input: nums1 = [2,1,3], nums2 = [10,2,5,0]
Output: 13
Explanation:
A possible nums3 array is [8,0,7,2,11,3,4,1,9,1,6,3].
The bitwise XOR of all these numbers is 13, so we return 13.

Example 2:

Input: nums1 = [1,2], nums2 = [3,4]
Output: 0
Explanation:
All possible pairs of bitwise XORs are nums1[0] ^ nums2[0], nums1[0] ^ nums2[1], nums1[1] ^ nums2[0],
and nums1[1] ^ nums2[1].
Thus, one possible nums3 array is [2,5,1,6].
2 ^ 5 ^ 1 ^ 6 = 0, so we return 0.

Constraints:

	1 <= nums1.length, nums2.length <= 10^5
	0 <= nums1[i], nums2[j] <= 10^9
*/
export function xorAllNums(nums1: number[], nums2: number[]): number {
  const xor1 = nums1.reduce((s, v) => s ^ v, 0);
  const xor2 = nums2.reduce((s, v) => s ^ v, 0);

  if (nums1.length % 2 === 0 && nums2.length % 2 === 0) {
    return 0;
  }
  if (nums1.length % 2 === 0) {
    return xor1;
  }
  if (nums2.length % 2 === 0) {
    return xor2;
  }
  return xor1 ^ xor2;
}

/*
https://leetcode.com/problems/neighboring-bitwise-xor/description/
2683. Neighboring Bitwise XOR
A 0-indexed array derived with length n is derived by computing the bitwise XOR (⊕) of adjacent values in a binary array original of length n.

Specifically, for each index i in the range [0, n - 1]:

	If i = n - 1, then derived[i] = original[i] ⊕ original[0].
	Otherwise, derived[i] = original[i] ⊕ original[i + 1].

Given an array derived, your task is to determine whether there exists a valid binary array original that could have formed derived.

Return true if such an array exists or false otherwise.

	A binary array is an array containing only 0's and 1's

Example 1:

Input: derived = [1,1,0]
Output: true
Explanation: A valid original array that gives derived is [0,1,0].
derived[0] = original[0] ⊕ original[1] = 0 ⊕ 1 = 1 
derived[1] = original[1] ⊕ original[2] = 1 ⊕ 0 = 1
derived[2] = original[2] ⊕ original[0] = 0 ⊕ 0 = 0

Example 2:

Input: derived = [1,1]
Output: true
Explanation: A valid original array that gives derived is [0,1].
derived[0] = original[0] ⊕ original[1] = 1
derived[1] = original[1] ⊕ original[0] = 1

Example 3:

Input: derived = [1,0]
Output: false
Explanation: There is no valid original array that gives derived.

Constraints:

	n == derived.length
	1 <= n <= 10^5
	The values in derived are either 0's or 1's
*/
export function doesValidArrayExist(derived: number[]): boolean {
  let xor = 0;
  for (const x of derived) {
    xor ^= x;
  }

  return xor === 0;
}

/*
https://leetcode.com/problems/number-of-excellent-pairs/description/
2354. Number of Excellent Pairs
You are given a 0-indexed positive integer array nums and a positive integer k.

A pair of numbers (num1, num2) is called excellent if the following conditions are satisfied:

	Both the numbers num1 and num2 exist in the array nums.
	The sum of the number of set bits in num1 OR num2 and num1 AND num2 is greater than or equal to k, where OR is the bitwise OR operation and AND is the bitwise AND operation.

Return the number of distinct excellent pairs.

Two pairs (a, b) and (c, d) are considered distinct if either a != c or b != d. For example, (1, 2) and (2, 1) are distinct.

Note that a pair (num1, num2) such that num1 == num2 can also be excellent if you have at least one occurrence of num1 in the array.

Example 1:

Input: nums = [1,2,3,1], k = 3
Output: 5
Explanation: The excellent pairs are the following:
- (3, 3). (3 AND 3) and (3 OR 3) are both equal to (11) in binary. The total number of set bits is 2 + 2 = 4, which is greater than or equal to k = 3.
- (2, 3) and (3, 2). (2 AND 3) is equal to (10) in binary, and (2 OR 3) is equal to (11) in binary. The total number of set bits is 1 + 2 = 3.
- (1, 3) and (3, 1). (1 AND 3) is equal to (01) in binary, and (1 OR 3) is equal to (11) in binary. The total number of set bits is 1 + 2 = 3.
So the number of excellent pairs is 5.

Example 2:

Input: nums = [5,1,1], k = 10
Output: 0
Explanation: There are no excellent pairs for this array.

Constraints:

	1 <= nums.length <= 10^5
	1 <= nums[i] <= 10^9
	1 <= k <= 60
*/
export function countExcellentPairs(nums: number[], k: number): number {
  const deduped = Array.from(new Set(nums));
  const bits = Array(deduped.length);
  for (let i = 0; i < deduped.length; i++) {
    bits[i] = countBits(deduped[i]);
  }

  bits.sort((a, b) => a - b);
  let count = 0;
  for (let i = 0; i < bits.length; i++) {
    const target = k - bits[i];
    let left = i;
    let right = bits.length - 1;
    let closest = bits.length;
    while (left <= right) {
      const mid = left + ((right - left) >> 1);
      if (bits[mid] >= target) {
        closest = mid;
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    }

    if (closest === i) {
      count += ((bits.length - closest - 1) << 1) | 1;
    } else {
      count += (bits.length - closest) << 1;
    }
  }

  return count;
}
