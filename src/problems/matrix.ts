// 锯齿形打印矩阵
export function zigzagMatrix(matrix: number[][]) {
    if (!matrix || matrix.length === 0) {
        return [];
    }

    const result: number[] = [];

    let pointAX = 0;
    let pointAY = 0;
    let pointBX = 0;
    let pointBY = 0;
    const endX = matrix.length - 1;
    const endY = matrix[0].length - 1;
    let shouldReverse = false;

    while (pointAX <= endX && pointAY <= endY && pointBX <= endX && pointBY <= endY) {
        const slashResult = slash(matrix, pointAX, pointAY, pointBX, pointBY, shouldReverse);
        result.push(...slashResult);
        shouldReverse = !shouldReverse;

        // 此处变量设置的顺序不能变
        pointAX = pointAY < endY ? 0 : pointAX + 1;
        pointAY = pointAX === 0 ? pointAY + 1 : endY;
        pointBY = pointBX < endX ? 0 : pointBY + 1;
        pointBX = pointBY === 0 ? pointBX + 1 : endX;
    }

    return result;
}

function slash(
    matrix: number[][],
    pointAX: number,
    pointAY: number,
    pointBX: number,
    pointBY: number,
    shouldReverse: boolean
) {
    const result: number[] = [];

    let x = pointBX;
    let y = pointBY;
    while (x >= pointAX && y <= pointAY) {
        result.push(matrix[x--][y++]);
    }

    if (shouldReverse) {
        return result.reverse();
    }
    return result;
}

// 环形打印矩阵
export function circleMatrix(matrix: number[][]) {
    if (!matrix || matrix.length === 0) {
        return [];
    }

    let startX = 0;
    let startY = 0;
    let endX = matrix.length - 1;
    let endY = matrix[0].length - 1;

    const result: number[] = [];
    while (startX <= endX && startY <= endY) {
        result.push(...getEdge(matrix, startX++, startY++, endX--, endY--));
    }

    return result;
}

function getEdge(matrix: number[][], startX: number, startY: number, endX: number, endY: number) {
    const result: number[] = [];

    if (startX === endX) {
        while (startY <= endY) {
            result.push(matrix[startX][startY++]);
        }
    } else if (startY === endY) {
        while (startX <= endX) {
            result.push(matrix[startX++][startY]);
        }
    } else {
        let x = startX;
        let y = startY;
        while (y < endY) {
            result.push(matrix[startX][y++]);
        }
        while (x < endX) {
            result.push(matrix[x++][endY]);
        }
        while (y > startY) {
            result.push(matrix[endX][y--]);
        }
        while (x > startX) {
            result.push(matrix[x--][startY]);
        }
    }

    return result;
}

/* 
https://leetcode.com/problems/spiral-matrix-ii/
Given a positive integer n, generate an n x n matrix filled with elements from 1 to n2 in spiral order.

Input: n = 3
Output: [[1,2,3],[8,9,4],[7,6,5]]
*/
export function generateMatrix(n: number): number[][] {
    const matrix = new Array(n).fill(0).map((_) => new Array(n).fill(0));

    let start = 1;
    const fill = (startX: number, endX: number) => {
        // 填充第一行
        for (let j = startX; j < endX; j++) {
            matrix[startX][j] = start++;
        }
        // 填充右边的列
        for (let i = startX; i < endX; i++) {
            matrix[i][endX] = start++;
        }
        // 填充下边的行
        for (let j = endX; j > startX; j--) {
            matrix[endX][j] = start++;
        }
        // 填充左边的列
        for (let i = endX; i > startX; i--) {
            matrix[i][startX] = start++;
        }
    };

    const level = n >> 1;
    matrix[level][level] = n * n;

    let i = 0;
    while (i < level) {
        fill(i, n - i - 1);
        i++;
    }

    return matrix;
}
