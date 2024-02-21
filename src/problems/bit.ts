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
