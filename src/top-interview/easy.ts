export function searchInsert(nums: number[], target: number): number {
    let right = nums.length - 1;
    let left = 0;
    let mid = right - ((right - left) >> 1);

    while (left <= right) {
        mid = right - ((right - left) >> 1);
        if (nums[mid] === target) {
            return mid;
        }

        if (nums[mid] > target) {
            right = mid - 1;
        } else {
            left = mid + 1;
        }
    }

    return nums[mid] > target ? mid : mid + 1;
}

/**
 Do not return anything, modify board in-place instead.
 */
// https://leetcode.com/problems/sudoku-solver/
export function solveSudoku(board: string[][]): void {
    // row[i][num] (i:0-8,num:1-9) row[0][9]=true 表示0行9这个数字已经出现过（也就是说第0行不能再放9了）
    const row: boolean[][] = new Array(9).fill(0).map((_) => new Array(10));
    // 某一列某个数字是否出现过
    const col: boolean[][] = new Array(9).fill(0).map((_) => new Array(10));
    // 某个桶里某个数字是否出现过
    const bucket: boolean[][] = new Array(9).fill(0).map((_) => new Array(10));
    initFlags(board, row, col, bucket);

    dfs(board, 0, 0, row, col, bucket);
}

function initFlags(board: string[][], row: boolean[][], col: boolean[][], bucket: boolean[][]): void {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[0].length; j++) {
            const bucketId = 3 * parseInt(`${i / 3}`) + parseInt(`${j / 3}`);
            if (board[i][j] === '.') {
                continue;
            }

            const num = parseInt(board[i][j]);
            row[i][num] = true;
            col[j][num] = true;
            bucket[bucketId][num] = true;
        }
    }
}

function dfs(
    board: string[][],
    i: number,
    j: number,
    row: boolean[][],
    col: boolean[][],
    bucket: boolean[][]
): boolean {
    if (i === 9) {
        return true;
    }
    // j到8之后i需要换行，也就是加1
    const nexti = j < 8 ? i : i + 1;
    // j到8之后需要跳到下一行从0开始
    const nextj = j < 8 ? j + 1 : 0;

    // 如果当前位置是数字则直接跳到下一个位置
    if (board[i][j] !== '.') {
        return dfs(board, nexti, nextj, row, col, bucket);
    }

    const bucketId = 3 * parseInt(`${i / 3}`) + parseInt(`${j / 3}`);
    // 否则从1-9开始尝试
    for (let num = 1; num <= 9; num++) {
        if (!row[i][num] && !col[j][num] && !bucket[bucketId][num]) {
            row[i][num] = true;
            col[j][num] = true;
            bucket[bucketId][num] = true;
            board[i][j] = `${num}`;

            // 后续可以成功直接返回
            if (dfs(board, nexti, nextj, row, col, bucket)) {
                return true;
            }

            // 恢复现场用下一个数字来尝试
            row[i][num] = false;
            col[j][num] = false;
            bucket[bucketId][num] = false;
            board[i][j] = '.';
        }
    }

    return false;
}

// 反转二进制位
// https://leetcode.com/problems/reverse-bits/
// 0000....0001 > 1000....0000
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
