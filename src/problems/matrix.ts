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

/*
https://leetcode.com/problems/transpose-matrix/description/
867. Transpose Matrix
Given a 2D integer array matrix, return the transpose of matrix.

The transpose of a matrix is the matrix flipped over its main diagonal, switching the matrix's row and column indices.

Example 1:

Input: matrix = [[1,2,3],[4,5,6],[7,8,9]]
Output: [[1,4,7],[2,5,8],[3,6,9]]

Example 2:

Input: matrix = [[1,2,3],[4,5,6]]
Output: [[1,4],[2,5],[3,6]]

Constraints:

	m == matrix.length
	n == matrix[i].length
	1 <= m, n <= 1000
	1 <= m * n <= 10^5
	-10^9 <= matrix[i][j] <= 10^9
*/
export function transpose(matrix: number[][]): number[][] {
    const m = matrix.length;
    const n = matrix[0].length;
    const newMatrix = Array.from({ length: n }, () => Array(m));

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < m; j++) {
            newMatrix[i][j] = matrix[j][i];
        }
    }

    return newMatrix;
}

/*
https://leetcode.com/problems/flood-fill/description/
733. Flood Fill
An image is represented by an m x n integer grid image where image[i][j] represents the pixel value of the image.

You are also given three integers sr, sc, and color. You should perform a flood fill on the image starting from the pixel image[sr][sc].

To perform a flood fill, consider the starting pixel, plus any pixels connected 4-directionally to the starting pixel of the same color 
as the starting pixel, plus any pixels connected 4-directionally to those pixels (also with the same color), and so on. 
Replace the color of all of the aforementioned pixels with color.

Return the modified image after performing the flood fill.

Example 1:

Input: image = [[1,1,1],[1,1,0],[1,0,1]], sr = 1, sc = 1, color = 2
Output: [[2,2,2],[2,2,0],[2,0,1]]
Explanation: From the center of the image with position (sr, sc) = (1, 1) (i.e., the red pixel), all pixels connected by a path of 
the same color as the starting pixel (i.e., the blue pixels) are colored with the new color.
Note the bottom corner is not colored 2, because it is not 4-directionally connected to the starting pixel.

Example 2:

Input: image = [[0,0,0],[0,0,0]], sr = 0, sc = 0, color = 0
Output: [[0,0,0],[0,0,0]]
Explanation: The starting pixel is already colored 0, so no changes are made to the image.

Constraints:

	m == image.length
	n == image[i].length
	1 <= m, n <= 50
	0 <= image[i][j], color < 2^16
	0 <= sr < m
	0 <= sc < n
*/
export function floodFill(
    image: number[][],
    sr: number,
    sc: number,
    color: number
): number[][] {
    const prev = image[sr][sc];
    image[sr][sc] = color;

    const m = image.length;
    const n = image[0].length;

    const directions: number[][] = [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
    ];
    const visited: boolean[][] = Array.from({ length: m }, () =>
        Array(n).fill(false)
    );
    const infect = (i: number, j: number) => {
        directions.forEach(([x, y]) => {
            const nextI = i + x;
            const nextJ = j + y;
            if (
                nextI >= 0 &&
                nextI < m &&
                nextJ >= 0 &&
                nextJ < n &&
                image[nextI][nextJ] === prev &&
                !visited[nextI][nextJ]
            ) {
                visited[nextI][nextJ] = true;
                image[nextI][nextJ] = color;
                infect(nextI, nextJ);
            }
        });
    };
    infect(sr, sc);

    return image;
}

/*
https://leetcode.com/problems/image-smoother/description/
661. Image Smoother
An image smoother is a filter of the size 3 x 3 that can be applied to each cell of an image by rounding down the average of 
the cell and the eight surrounding cells (i.e., the average of the nine cells in the blue smoother). 
If one or more of the surrounding cells of a cell is not present, we do not consider it in the average 
(i.e., the average of the four cells in the red smoother).

Given an m x n integer matrix img representing the grayscale of an image, return the image after applying the smoother on each cell of it.

Example 1:

Input: img = [[1,1,1],[1,0,1],[1,1,1]]
Output: [[0,0,0],[0,0,0],[0,0,0]]
Explanation:
For the points (0,0), (0,2), (2,0), (2,2): floor(3/4) = floor(0.75) = 0
For the points (0,1), (1,0), (1,2), (2,1): floor(5/6) = floor(0.83333333) = 0
For the point (1,1): floor(8/9) = floor(0.88888889) = 0

Example 2:

Input: img = [[100,200,100],[200,50,200],[100,200,100]]
Output: [[137,141,137],[141,138,141],[137,141,137]]
Explanation:
For the points (0,0), (0,2), (2,0), (2,2): floor((100+200+200+50)/4) = floor(137.5) = 137
For the points (0,1), (1,0), (1,2), (2,1): floor((200+200+50+200+100+100)/6) = floor(141.666667) = 141
For the point (1,1): floor((50+200+200+200+200+100+100+100+100)/9) = floor(138.888889) = 138

Constraints:

	m == img.length
	n == img[i].length
	1 <= m, n <= 200
	0 <= img[i][j] <= 255
*/
export function imageSmoother(img: number[][]): number[][] {
    const m = img.length;
    const n = img[0].length;

    const newImg = Array.from({ length: m }, () => Array(n).fill(0));

    const directions = [
        [-1, -1],
        [-1, 0],
        [-1, 1],
        [0, -1],
        [0, 1],
        [1, -1],
        [1, 0],
        [1, 1],
    ];
    const getAverage = (x: number, y: number) => {
        let count = 1;
        let sum = img[x][y];

        directions.forEach(([xDelta, yDelta]) => {
            const nextX = x + xDelta;
            const nextY = y + yDelta;
            if (nextX >= 0 && nextX < m && nextY >= 0 && nextY < n) {
                count++;
                sum += img[nextX][nextY];
            }
        });

        return Math.floor(sum / count);
    };

    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            newImg[i][j] = getAverage(i, j);
        }
    }

    return newImg;
}

/*
https://leetcode.com/problems/matrix-diagonal-sum/description/
1572. Matrix Diagonal Sum
Given a square matrix mat, return the sum of the matrix diagonals.

Only include the sum of all the elements on the primary diagonal and all the elements on the secondary diagonal that are not part of the primary diagonal.

Example 1:

Input: mat = [[1,2,3],
              [4,5,6],
              [7,8,9]]
Output: 25
Explanation: Diagonals sum: 1 + 5 + 9 + 3 + 7 = 25
Notice that element mat[1][1] = 5 is counted only once.

Example 2:

Input: mat = [[1,1,1,1],
              [1,1,1,1],
              [1,1,1,1],
              [1,1,1,1]]
Output: 8

Example 3:

Input: mat = [[5]]
Output: 5

Constraints:

	n == mat.length == mat[i].length
	1 <= n <= 100
	1 <= mat[i][j] <= 100
*/
export function diagonalSum(mat: number[][]): number {
    const n = mat.length;
    let sum = 0;

    let x = 0;
    let y = 0;
    while (x < n) {
        sum += mat[x++][y++];
    }

    x = n - 1;
    y = 0;
    while (y < n) {
        sum += mat[x--][y++];
    }

    if ((n & 1) === 1) {
        const center = n >> 1;
        return sum - mat[center][center];
    }
    return sum;
}

/*
https://leetcode.com/problems/find-a-peak-element-ii/description/?envType=list&envId=o5cftq05
1901. Find a Peak Element II
A peak element in a 2D grid is an element that is strictly greater than all of its adjacent neighbors to the left, right, top, and bottom.

Given a 0-indexed m x n matrix mat where no two adjacent cells are equal, find any peak element mat[i][j] and return the length 2 array [i,j].

You may assume that the entire matrix is surrounded by an outer perimeter with the value -1 in each cell.

You must write an algorithm that runs in O(m log(n)) or O(n log(m)) time.

Example 1:

Input: mat = [[1,4],[3,2]]
Output: [0,1]
Explanation: Both 3 and 4 are peak elements so [1,0] and [0,1] are both acceptable answers.

Example 2:

Input: mat = [[10,20,15],[21,30,14],[7,16,32]]
Output: [1,1]
Explanation: Both 30 and 32 are peak elements so [1,1] and [2,2] are both acceptable answers.

Constraints:

	m == mat.length
	n == mat[i].length
	1 <= m, n <= 500
	1 <= mat[i][j] <= 10^5
	No two adjacent cells are equal.

Hints
- Let's assume that the width of the array is bigger than the height, otherwise, we will split in another direction.
- Split the array into three parts: central column left side and right side.
- Go through the central column and two neighbor columns and look for maximum.
- If it's in the central column - this is our peak.
- If it's on the left side, run this algorithm on subarray left_side + central_column.
- If it's on the right side, run this algorithm on subarray right_side + central_column
*/
export function findPeakGrid(mat: number[][]): number[] {
    const m = mat.length;
    const n = mat[0].length;

    const getMaxIndex = (column: number) => {
        let max = -Infinity;
        let maxIndex = -1;

        for (let i = 0; i < m; i++) {
            if (max < mat[i][column]) {
                max = mat[i][column];
                maxIndex = i;
            }
        }

        return [max, maxIndex];
    };

    let left = 0;
    let right = n - 1;
    while (left <= right) {
        const mid = left + ((right - left) >> 1);
        const [leftMax] = mid - 1 >= 0 ? getMaxIndex(mid - 1) : [-Infinity, -1];
        const [midMax, midMaxIndex] = getMaxIndex(mid);
        const [rightMax] = mid + 1 < n ? getMaxIndex(mid + 1) : [-Infinity, -1];

        const max = Math.max(leftMax, midMax, rightMax);
        if (max === midMax) {
            return [midMaxIndex, mid];
        }

        if (max === leftMax) {
            right = mid - 1;
        } else {
            left = mid + 1;
        }
    }

    return [-1, -1];
}

/*
https://leetcode.com/problems/maximum-number-of-moves-in-a-grid/description/
2684. Maximum Number of Moves in a Grid
You are given a 0-indexed m x n matrix grid consisting of positive integers.

You can start at any cell in the first column of the matrix, and traverse the grid in the following way:

	From a cell (row, col), you can move to any of the cells: (row - 1, col + 1), (row, col + 1) and (row + 1, col + 1) 
    such that the value of the cell you move to, should be strictly bigger than the value of the current cell.

Return the maximum number of moves that you can perform.

Example 1:

Input: grid = [[2,4,3,5],[5,4,9,3],[3,4,2,11],[10,9,13,15]]
Output: 3
Explanation: We can start at the cell (0, 0) and make the following moves:
- (0, 0) -> (0, 1).
- (0, 1) -> (1, 2).
- (1, 2) -> (2, 3).
It can be shown that it is the maximum number of moves that can be made.

Example 2:

Input: grid = [[3,2,4],[2,1,9],[1,1,7]]
Output: 0
Explanation: Starting from any cell in the first column we cannot perform any moves.

Constraints:

	m == grid.length
	n == grid[i].length
	2 <= m, n <= 1000
	4 <= m * n <= 10^5
	1 <= grid[i][j] <= 10^6
*/
export function maxMoves(grid: number[][]): number {
    const m = grid.length;
    const n = grid[0].length;
    const dp: number[][] = Array.from({ length: m }, () => Array(n).fill(0));

    for (let j = n - 2; j >= 0; j--) {
        for (let i = 0; i < m; i++) {
            if (i - 1 >= 0 && grid[i][j] < grid[i - 1][j + 1]) {
                dp[i][j] = 1 + dp[i - 1][j + 1];
            }
            if (grid[i][j] < grid[i][j + 1]) {
                dp[i][j] = Math.max(dp[i][j], 1 + dp[i][j + 1]);
            }
            if (i + 1 < m && grid[i][j] < grid[i + 1][j + 1]) {
                dp[i][j] = Math.max(dp[i][j], 1 + dp[i + 1][j + 1]);
            }
        }
    }

    let max = 0;
    for (let i = 0; i < m; i++) {
        max = Math.max(max, dp[i][0]);
    }

    return max;
}

/*
https://leetcode.com/problems/island-perimeter/description/?envType=daily-question&envId=2024-04-18
463. Island Perimeter
You are given row x col grid representing a map where grid[i][j] = 1 represents land and grid[i][j] = 0 represents water.

Grid cells are connected horizontally/vertically (not diagonally). The grid is completely surrounded by water, 
and there is exactly one island (i.e., one or more connected land cells).

The island doesn't have "lakes", meaning the water inside isn't connected to the water around the island. 
One cell is a square with side length 1. The grid is rectangular, width and height don't exceed 100. Determine the perimeter of the island.

Example 1:

Input: grid = [[0,1,0,0],[1,1,1,0],[0,1,0,0],[1,1,0,0]]
Output: 16
Explanation: The perimeter is the 16 yellow stripes in the image above.

Example 2:

Input: grid = [[1]]
Output: 4

Example 3:

Input: grid = [[1,0]]
Output: 4

Constraints:

	row == grid.length
	col == grid[i].length
	1 <= row, col <= 100
	grid[i][j] is 0 or 1.
	There is exactly one island in grid.
*/
export function islandPerimeter(grid: number[][]): number {
    let perimeters = 0;

    const m = grid.length;
    const n = grid[0].length;
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (grid[i][j] === 1) {
                perimeters += 4;

                if (j + 1 < n && grid[i][j + 1] === 1) {
                    perimeters -= 2;
                }
                if (i + 1 < m && grid[i + 1][j] === 1) {
                    perimeters -= 2;
                }
            }
        }
    }

    return perimeters;
}

/*
https://leetcode.com/problems/find-all-groups-of-farmland/description/
1992. Find All Groups of Farmland
You are given a 0-indexed m x n binary matrix land where a 0 represents a hectare of forested land and a 1 represents a hectare of farmland.

To keep the land organized, there are designated rectangular areas of hectares that consist entirely of farmland. 
These rectangular areas are called groups. No two groups are adjacent, meaning farmland in one group is not four-directionally 
adjacent to another farmland in a different group.

land can be represented by a coordinate system where the top left corner of land is (0, 0) and the bottom right corner of land is (m-1, n-1). 
Find the coordinates of the top left and bottom right corner of each group of farmland. A group of farmland with a top left corner at (r1, c1) 
and a bottom right corner at (r2, c2) is represented by the 4-length array [r1, c1, r2, c2].

Return a 2D array containing the 4-length arrays described above for each group of farmland in land. 
If there are no groups of farmland, return an empty array. You may return the answer in any order.

Example 1:

Input: land = [[1,0,0],[0,1,1],[0,1,1]]
Output: [[0,0,0,0],[1,1,2,2]]
Explanation:
The first group has a top left corner at land[0][0] and a bottom right corner at land[0][0].
The second group has a top left corner at land[1][1] and a bottom right corner at land[2][2].

Example 2:

Input: land = [[1,1],[1,1]]
Output: [[0,0,1,1]]
Explanation:
The first group has a top left corner at land[0][0] and a bottom right corner at land[1][1].

Example 3:

Input: land = [[0]]
Output: []
Explanation:
There are no groups of farmland.

Constraints:

	m == land.length
	n == land[i].length
	1 <= m, n <= 300
	land consists of only 0's and 1's.
	Groups of farmland are rectangular in shape.
*/
export function findFarmland(land: number[][]): number[][] {
    const m = land.length;
    const n = land[0].length;
    const visited: boolean[][] = Array.from({ length: m }, () =>
        Array(n).fill(false)
    );

    const markVisited = (positions: number[]) => {
        const [i1, j1, i2, j2] = positions;
        for (let i = i1; i <= i2; i++) {
            for (let j = j1; j <= j2; j++) {
                visited[i][j] = true;
            }
        }
    };

    const result: number[][] = [];
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (visited[i][j] || land[i][j] === 0) {
                continue;
            }
            visited[i][j] = true;

            const leftTop = [i, j];
            while (j < n && land[i][j] === 1) {
                j++;
            }
            let k = i;
            while (k < m && land[k][j - 1] === 1) {
                k++;
            }

            const cur = leftTop.concat([k - 1, j - 1]);
            markVisited(cur);
            result.push(cur);
        }
    }

    return result;
}

/*
https://leetcode.com/problems/sum-in-a-matrix/description/
2679. Sum in a Matrix
You are given a 0-indexed 2D integer array nums. Initially, your score is 0. Perform the following operations until the matrix becomes empty:

	From each row in the matrix, select the largest number and remove it. In the case of a tie, it does not matter which number is chosen.
	Identify the highest number amongst all those removed in step 1. Add that number to your score.

Return the final score.

Example 1:

Input: nums = [[7,2,1],[6,4,2],[6,5,3],[3,2,1]]
Output: 15
Explanation: In the first operation, we remove 7, 6, 6, and 3. We then add 7 to our score. Next, we remove 2, 4, 5, and 2. 
We add 5 to our score. Lastly, we remove 1, 2, 3, and 1. We add 3 to our score. Thus, our final score is 7 + 5 + 3 = 15.

Example 2:

Input: nums = [[1]]
Output: 1
Explanation: We remove 1 and add it to the answer. We return 1.

Constraints:

	1 <= nums.length <= 300
	1 <= nums[i].length <= 500
	0 <= nums[i][j] <= 10^3
*/
export function matrixSum(nums: number[][]): number {
    nums.forEach((row) => {
        row.sort((a, b) => b - a);
    });

    let score = 0;
    for (let j = 0; j < nums[0].length; j++) {
        let max = -Infinity;
        for (let i = 0; i < nums.length; i++) {
            max = Math.max(max, nums[i][j]);
        }

        score += max;
    }

    return score;
}
