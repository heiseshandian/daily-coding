import { getCharIndex } from '../common/index';
import { getRightOne } from '../algorithm/exclusive-or';

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
