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
