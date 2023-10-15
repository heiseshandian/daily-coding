import { getCharIndex } from '../common/index';

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
    return i >= 0 && i < board.length && j >= 0 && j < board[0].length && (board[i][j] & 1) === 1 ? 1 : 0;
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
    const bits = words.map((word) => {
        let bit = 0;

        for (let i = 0; i < word.length; i++) {
            bit = bit | (1 << getCharIndex(word[i]));
        }

        return bit;
    });

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

/* 
https://leetcode.com/problems/single-number-ii/description/

Given an integer array nums where every element appears three times except for one, which appears exactly once. 
Find the single element and return it.

You must implement a solution with a linear runtime complexity and use only constant extra space.

// 统计每一位1的个数，并根据是否能被3整除来判断只出现一次的数字在那一位上是1还是0
// 能被3整除则仅出现一次的数字那一位必然是0，否则必然是1
*/
export function singleNumber(nums: number[]): number {
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
