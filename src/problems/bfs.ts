/*
https://leetcode.com/problems/as-far-from-land-as-possible/description/
1162. As Far from Land as Possible
Given an n x n grid containing only values 0 and 1, where 0 represents water and 1 represents land, find a water cell such that its distance to the nearest land cell is maximized, and return the distance. If no land or water exists in the grid, return -1.

The distance used in this problem is the Manhattan distance: the distance between two cells (x0, y0) and (x1, y1) is |x0 - x1| + |y0 - y1|.

Example 1:

Input: grid = [[1,0,1],[0,0,0],[1,0,1]]
Output: 2
Explanation: The cell (1, 1) is as far as possible from all the land with distance 2.

Example 2:

Input: grid = [[1,0,0],[0,0,0],[0,0,0]]
Output: 4
Explanation: The cell (2, 2) is as far as possible from all the land with distance 4.

Constraints:

	n == grid.length
	n == grid[i].length
	1 <= n <= 100
	grid[i][j] is 0 or 1
*/
export function maxDistance(grid: number[][]): number {
    const m = grid.length;
    const n = grid[0].length;
    let seas = 0;
    const queue: number[][] = [];
    const visited: boolean[][] = Array.from({ length: m }, () =>
        Array(n).fill(false)
    );

    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (grid[i][j] === 0) {
                seas++;
            } else {
                visited[i][j] = true;
                queue.push([i, j]);
            }
        }
    }
    if (seas === 0 || seas === grid.length * grid[0].length) {
        return -1;
    }

    const moves: number[] = [-1, 0, 1, 0, -1];

    let level = 0;
    while (queue.length) {
        const q = queue.slice();
        queue.length = 0;
        level++;

        q.forEach(([x, y]) => {
            for (let i = 0; i < moves.length - 1; i++) {
                const nextX = x + moves[i];
                const nextY = y + moves[i + 1];

                if (
                    nextX >= 0 &&
                    nextX < m &&
                    nextY >= 0 &&
                    nextY < n &&
                    !visited[nextX][nextY]
                ) {
                    visited[nextX][nextY] = true;
                    queue.push([nextX, nextY]);
                }
            }
        });
    }

    return level - 1;
}
