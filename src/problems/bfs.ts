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
    if (seas === 0 || seas === m * n) {
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

/*
https://leetcode.com/problems/shortest-path-to-get-all-keys/description/
https://www.bilibili.com/list/8888480?sort_field=pubtime&spm_id_from=333.999.0.0&oid=704553330&bvid=BV1Cm4y1g77W
864. Shortest Path to Get All Keys
You are given an m x n grid grid where:

	'.' is an empty cell.
	'#' is a wall.
	'@' is the starting point.
	Lowercase letters represent keys.
	Uppercase letters represent locks.

You start at the starting point and one move consists of walking one space in one of the four cardinal directions. You cannot walk outside the grid, or walk into a wall.

If you walk over a key, you can pick it up and you cannot walk over a lock unless you have its corresponding key.

For some 1 <= k <= 6, there is exactly one lowercase and one uppercase letter of the first k letters of the English alphabet in the grid. This means that there is exactly one key for each lock, and one lock for each key; and also that the letters used to represent the keys and locks were chosen in the same order as the English alphabet.

Return the lowest number of moves to acquire all keys. If it is impossible, return -1.

Example 1:

Input: grid = ["@.a..","###.#","b.A.B"]
Output: 8
Explanation: Note that the goal is to obtain all the keys not to open all the locks.

Example 2:

Input: grid = ["@..aA","..B#.","....b"]
Output: 6

Example 3:

Input: grid = ["@Aa"]
Output: -1

Constraints:

	m == grid.length
	n == grid[i].length
	1 <= m, n <= 30
	grid[i][j] is either an English letter, '.', '#', or '@'. 
	There is exactly one '@' in the grid.
	The number of keys in the grid is in the range [1, 6].
	Each key in the grid is unique.
	Each key in the grid has a matching lock.
*/
const ALPHA_REG = /[a-zA-Z]/;

export function shortestPathAllKeys(grid: string[]): number {
    const m = grid.length;
    const n = grid[0].length;
    let alphas = 0;

    const queue: Array<[x: number, y: number, status: number]> = [];

    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (ALPHA_REG.test(grid[i][j])) {
                alphas++;
            }

            if (grid[i][j] === '@') {
                queue.push([i, j, 0]);
            }
        }
    }
    const keys = alphas >> 1;
    const keysMap = toStatusMap('abcdef'.split(''));
    const locksMap = toStatusMap('ABCDEF'.split(''));

    const visited: boolean[][][] = Array.from({ length: m }, () =>
        Array.from({ length: n }, () => Array(1 << keys).fill(false))
    );
    const [startX, startY, startStatus] = queue[0];
    visited[startX][startY][startStatus] = true;

    let level = 0;
    const moves: number[] = [-1, 0, 1, 0, -1];
    const target = (1 << keys) - 1;
    while (queue.length) {
        const q = queue.slice();
        queue.length = 0;
        level++;

        for (let i = 0; i < q.length; i++) {
            const [x, y, status] = q[i];
            if (status === target) {
                return level - 1;
            }

            for (let j = 0; j < moves.length - 1; j++) {
                const nX = x + moves[j];
                const nY = y + moves[j + 1];

                if (
                    nX >= 0 &&
                    nX < m &&
                    nY >= 0 &&
                    nY < n &&
                    grid[nX][nY] !== '#'
                ) {
                    const s = status | (keysMap[grid[nX][nY]] ?? 0);
                    const lock = locksMap[grid[nX][nY]] ?? 0;
                    const hasKey = lock & s;
                    if (!visited[nX][nY][s] && (!lock || hasKey)) {
                        visited[nX][nY][s] = true;
                        queue.push([nX, nY, s]);
                    }
                }
            }
        }
    }

    return -1;
}

function toStatusMap(alphas: string[]) {
    return alphas.reduce((acc, cur, i) => {
        acc[cur] = 1 << i;
        return acc;
    }, {});
}

/*
https://leetcode.com/problems/alphabet-board-path/description/
1138. Alphabet Board Path
On an alphabet board, we start at position (0, 0), corresponding to character board[0][0].

Here, board = ["abcde", "fghij", "klmno", "pqrst", "uvwxy", "z"], as shown in the diagram below.

We may make the following moves:

	'U' moves our position up one row, if the position exists on the board;
	'D' moves our position down one row, if the position exists on the board;
	'L' moves our position left one column, if the position exists on the board;
	'R' moves our position right one column, if the position exists on the board;
	'!' adds the character board[r][c] at our current position (r, c) to the answer.

(Here, the only positions that exist on the board are positions with letters on them.)

Return a sequence of moves that makes our answer equal to target in the minimum number of moves.  You may return any path that does so.

Example 1:
Input: target = "leet"
Output: "DDR!UURRR!!DDD!"
Example 2:
Input: target = "code"
Output: "RR!DDRR!UUL!R!"

Constraints:

	1 <= target.length <= 100
	target consists only of English lowercase letters.
*/
export function alphabetBoardPath(target: string): string {
    const board = ['abcde', 'fghij', 'klmno', 'pqrst', 'uvwxy', 'z'];

    const moves: number[] = [-1, 0, 1, 0, -1];
    const directions: string[] = ['U', 'R', 'D', 'L'];

    const bfs = (
        x: number,
        y: number,
        t: string
    ): [x: number, y: number, path: string] => {
        const visited: boolean[][] = Array.from({ length: board.length }, () =>
            Array(board[0].length).fill(false)
        );
        visited[x][y] = true;

        const queue: [x: number, y: number, path: string][] = [[x, y, '']];
        while (queue.length) {
            const [x, y, path] = queue.shift()!;
            if (board[x][y] === t) {
                return [x, y, path];
            }

            for (let i = 0; i < 4; i++) {
                const nextX = x + moves[i];
                const nextY = y + moves[i + 1];
                const direction = directions[i];

                if (
                    nextX >= 0 &&
                    nextX < board.length &&
                    nextY >= 0 &&
                    nextY < board[nextX].length &&
                    !visited[nextX][nextY]
                ) {
                    visited[nextX][nextY] = true;
                    queue.push([nextX, nextY, path + direction]);
                }
            }
        }

        return [0, 0, ''];
    };

    let s = '';
    let [x, y, path] = [0, 0, ''];
    for (let i = 0; i < target.length; i++) {
        [x, y, path] = bfs(x, y, target[i]);
        s += path + '!';
    }

    return s;
}
