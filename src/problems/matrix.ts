import { cache } from '../design-pattern/proxy';
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

    while (
        pointAX <= endX &&
        pointAY <= endY &&
        pointBX <= endX &&
        pointBY <= endY
    ) {
        const slashResult = slash(
            matrix,
            pointAX,
            pointAY,
            pointBX,
            pointBY,
            shouldReverse
        );
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

function getEdge(
    matrix: number[][],
    startX: number,
    startY: number,
    endX: number,
    endY: number
) {
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

/*
https://leetcode.com/problems/range-sum-query-2d-immutable/description/
304. Range Sum Query 2D - Immutable
Given a 2D matrix matrix, handle multiple queries of the following type:

	Calculate the sum of the elements of matrix inside the rectangle defined by its upper left corner (row1, col1) and lower right corner (row2, col2).

Implement the NumMatrix class:

	NumMatrix(int[][] matrix) Initializes the object with the integer matrix matrix.
	int sumRegion(int row1, int col1, int row2, int col2) Returns the sum of the elements of matrix inside the rectangle defined by its upper left corner (row1, col1) and lower right corner (row2, col2).

You must design an algorithm where sumRegion works on O(1) time complexity.

Example 1:

Input
["NumMatrix", "sumRegion", "sumRegion", "sumRegion"]
[[[[3, 0, 1, 4, 2], [5, 6, 3, 2, 1], [1, 2, 0, 1, 5], [4, 1, 0, 1, 7], [1, 0, 3, 0, 5]]], [2, 1, 4, 3], [1, 1, 2, 2], [1, 2, 2, 4]]
Output
[null, 8, 11, 12]

Explanation
NumMatrix numMatrix = new NumMatrix([[3, 0, 1, 4, 2], [5, 6, 3, 2, 1], [1, 2, 0, 1, 5], [4, 1, 0, 1, 7], [1, 0, 3, 0, 5]]);
numMatrix.sumRegion(2, 1, 4, 3); // return 8 (i.e sum of the red rectangle)
numMatrix.sumRegion(1, 1, 2, 2); // return 11 (i.e sum of the green rectangle)
numMatrix.sumRegion(1, 2, 2, 4); // return 12 (i.e sum of the blue rectangle)

Constraints:

	m == matrix.length
	n == matrix[i].length
	1 <= m, n <= 200
	-10^4 <= matrix[i][j] <= 10^4
	0 <= row1 <= row2 < m
	0 <= col1 <= col2 < n
	At most 10^4 calls will be made to sumRegion.
*/
export class NumMatrix {
    private prefixSumMatrix: number[][];

    constructor(matrix: number[][]) {
        const rowLen = matrix.length;
        const columnLen = matrix[0].length;

        this.prefixSumMatrix = Array.from({ length: rowLen }, () =>
            Array(columnLen).fill(0)
        );

        for (let i = 0; i < rowLen; i++) {
            for (let j = 0; j < columnLen; j++) {
                const top = i - 1 >= 0 ? this.prefixSumMatrix[i - 1][j] : 0;
                const left = j - 1 >= 0 ? this.prefixSumMatrix[i][j - 1] : 0;
                const leftTop =
                    i - 1 >= 0 && j - 1 >= 0
                        ? this.prefixSumMatrix[i - 1][j - 1]
                        : 0;

                this.prefixSumMatrix[i][j] =
                    top + left - leftTop + matrix[i][j];
            }
        }
    }

    sumRegion(row1: number, col1: number, row2: number, col2: number): number {
        const top = row1 - 1 >= 0 ? this.prefixSumMatrix[row1 - 1][col2] : 0;
        const left = col1 - 1 >= 0 ? this.prefixSumMatrix[row2][col1 - 1] : 0;
        const topLeft =
            row1 - 1 >= 0 && col1 - 1 >= 0
                ? this.prefixSumMatrix[row1 - 1][col1 - 1]
                : 0;

        return this.prefixSumMatrix[row2][col2] - left - top + topLeft;
    }
}

/*
https://leetcode.com/problems/sum-of-matrix-after-queries/description/?utm_source=LCUS&utm_medium=ip_redirect&utm_campaign=transfer2china
2718. Sum of Matrix After Queries
You are given an integer n and a 0-indexed 2D array queries where queries[i] = [typei, indexi, vali].

Initially, there is a 0-indexed n x n matrix filled with 0's. For each query, you must apply one of the following changes:

    if typei == 0, set the values in the row with indexi to vali, overwriting any previous values.
    if typei == 1, set the values in the column with indexi to vali, overwriting any previous values.

Return the sum of integers in the matrix after all queries are applied.

Example 1:

Input: n = 3, queries = [[0,0,1],[1,2,2],[0,2,3],[1,0,4]]
Output: 23
Explanation: The image above describes the matrix after each query. The sum of the matrix after all queries are applied is 23. 

Example 2:

Input: n = 3, queries = [[0,0,4],[0,1,2],[1,0,1],[0,2,3],[1,2,1]]
Output: 17
Explanation: The image above describes the matrix after each query. The sum of the matrix after all queries are applied is 17.

Constraints:

    1 <= n <= 10^4
    1 <= queries.length <= 10^4
    queries[i].length == 3
    0 <= typei <= 1
    0 <= indexi < n
    0 <= vali <= 10^5
    
Hints：
- Process queries in reversed order, as the latest queries represent the most recent changes in the matrix.
- Once you encounter an operation on some row/column, no further operations will affect the values in this row/column. 
Keep track of seen rows and columns with a set.
- When operating on an unseen row/column, the number of affected cells is the number of columns/rows you haven’t previously seen.
*/
export function matrixSumQueries(n: number, queries: number[][]): number {
    const seenRows = new Set<number>();
    const seenColumns = new Set<number>();
    let result = 0;
    for (let i = queries.length - 1; i >= 0; i--) {
        const [type, index, val] = queries[i];
        if (type === 0 && !seenRows.has(index)) {
            result += (n - seenColumns.size) * val;
            seenRows.add(index);
        } else if (type === 1 && !seenColumns.has(index)) {
            result += (n - seenRows.size) * val;
            seenColumns.add(index);
        }
    }

    return result;
}

/* 
https://leetcode.com/problems/maximal-square/description/

Given an m x n binary matrix filled with 0's and 1's, find the largest square containing only 1's and return its area.
*/
export function maximalSquare(matrix: string[][]): number {
    const arr = matrix[0].map((v) => +v);
    let max = arr.indexOf(1) !== -1 ? 1 : 0;

    for (let i = 1; i < matrix.length; i++) {
        for (let j = 0; j < matrix[0].length; j++) {
            arr[j] = matrix[i][j] === '0' ? 0 : 1 + arr[j];
        }

        for (let j = 0; j < arr.length; j++) {
            if (arr[j] < 1) {
                continue;
            }

            let left = 1;
            let right = arr[j];
            while (left <= right) {
                const mid = left + ((right - left) >> 1);
                if (canExpand(arr, mid, j)) {
                    max = Math.max(max, mid);
                    left = mid + 1;
                } else {
                    right = mid - 1;
                }
            }
        }
    }

    return max * max;
}

function canExpand(arr: number[], target: number, i: number): boolean {
    let len = 1;
    let right = i + 1;
    while (right < arr.length && len < target) {
        if (arr[right] >= target) {
            len++;
            right++;
        } else {
            break;
        }
    }

    let left = i - 1;
    while (left >= 0 && len < target) {
        if (arr[left] >= target) {
            len++;
            left--;
        } else {
            break;
        }
    }

    return len >= target;
}

export function maximalSquare2(matrix: string[][]): number {
    let max = 0;
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[0].length; j++) {
            if (matrix[i][j] === '0') {
                continue;
            }

            if (i > 0 && j > 0) {
                matrix[i][j] = (
                    Math.min(
                        Number(matrix[i - 1][j]),
                        Number(matrix[i][j - 1]),
                        Number(matrix[i - 1][j - 1])
                    ) + 1
                ).toString();
            }

            max = Math.max(max, Number(matrix[i][j]));
        }
    }
    return max * max;
}

/*
https://leetcode.com/problems/minimum-falling-path-sum/description/
931. Minimum Falling Path Sum
Given an n x n array of integers matrix, return the minimum sum of any falling path through matrix.

A falling path starts at any element in the first row and chooses the element in the next row that is either directly below or diagonally left/right. Specifically, the next element from position (row, col) will be (row + 1, col - 1), (row + 1, col), or (row + 1, col + 1).

Example 1:

Input: matrix = [[2,1,3],[6,5,4],[7,8,9]]
Output: 13
Explanation: There are two falling paths with a minimum sum as shown.

Example 2:

Input: matrix = [[-19,57],[-40,-5]]
Output: -59
Explanation: The falling path with a minimum sum is shown.

Constraints:

	n == matrix.length == matrix[i].length
	1 <= n <= 100
	-100 <= matrix[i][j] <= 100
*/
export function minFallingPathSum(matrix: number[][]): number {
    const dfs = cache((row: number, col: number) => {
        if (row === matrix.length) {
            return 0;
        }
        const cur = matrix[row][col];

        let min = Infinity;
        // left
        if (col - 1 >= 0) {
            min = Math.min(min, cur + dfs(row + 1, col - 1));
        }
        // center
        min = Math.min(min, cur + dfs(row + 1, col));
        // right
        if (col + 1 < matrix[0].length) {
            min = Math.min(min, cur + dfs(row + 1, col + 1));
        }

        return min;
    });

    return Math.min(...matrix[0].map((_, j) => dfs(0, j)));
}

/*
https://leetcode.com/problems/find-a-good-subset-of-the-matrix/description/
2732. Find a Good Subset of the Matrix
You are given a 0-indexed m x n binary matrix grid.

Let us call a non-empty subset of rows good if the sum of each column of the subset is at most half of the length of the subset.

More formally, if the length of the chosen subset of rows is k, then the sum of each column should be at most floor(k / 2).

Return an integer array that contains row indices of a good subset sorted in ascending order.

If there are multiple good subsets, you can return any of them. If there are no good subsets, return an empty array.

A subset of rows of the matrix grid is any matrix that can be obtained by deleting some (possibly none or all) rows from grid.

Example 1:

Input: grid = [[0,1,1,0],[0,0,0,1],[1,1,1,1]]
Output: [0,1]
Explanation: We can choose the 0th and 1st rows to create a good subset of rows.
The length of the chosen subset is 2.
- The sum of the 0th column is 0 + 0 = 0, which is at most half of the length of the subset.
- The sum of the 1st column is 1 + 0 = 1, which is at most half of the length of the subset.
- The sum of the 2nd column is 1 + 0 = 1, which is at most half of the length of the subset.
- The sum of the 3rd column is 0 + 1 = 1, which is at most half of the length of the subset.

Example 2:

Input: grid = [[0]]
Output: [0]
Explanation: We can choose the 0th row to create a good subset of rows.
The length of the chosen subset is 1.
- The sum of the 0th column is 0, which is at most half of the length of the subset.

Example 3:

Input: grid = [[1,1,1],[1,1,1]]
Output: []
Explanation: It is impossible to choose any subset of rows to create a good subset.

Constraints:

	m == grid.length
	n == grid[i].length
	1 <= m <= 10^4
	1 <= n <= 5
	grid[i][j] is either 0 or 1.

Hints:
- It can be proven, that if there exists a good subset of rows then there exists a good subset of rows with the size of either 1 or 2.
- To check if there exists a good subset of rows of size 1, we check if there exists a row containing only zeros, 
if it does, we return its index as a good subset.
- To check if there exists a good subset of rows of size 2, we iterate over two bit-masks, check if both are presented in 
the array and if they form a good subset, if they do, return their indices as a good subset.
*/
export function goodSubsetofBinaryMatrix(grid: number[][]): number[] {
    for (let i = 0; i < grid.length; i++) {
        if (grid[i].every((v) => v === 0)) {
            return [i];
        }
    }
    const n = grid[0].length;

    const bitMasks: number[][] = [];
    const backtracking = (i: number, left: number, right: number) => {
        if (i === n) {
            bitMasks.push([left, right]);
            return;
        }

        left <<= 1;
        right <<= 1;

        // left取1
        backtracking(i + 1, left | 1, right | 0);

        // left取0
        backtracking(i + 1, left | 0, right | 1);
        backtracking(i + 1, left | 0, right | 0);
    };
    backtracking(0, 0, 0);

    const gridNumbers = grid.map((row) => parseInt(row.join(''), 2));

    for (let i = 0; i < bitMasks.length; i++) {
        const [left, right] = bitMasks[i];
        const index1 = gridNumbers.indexOf(left);
        const index2 = gridNumbers.indexOf(right);
        if (index1 !== -1 && index2 !== -1 && index1 !== index2) {
            return [index1, index2].sort((a, b) => a - b);
        }
    }

    return [];
}
