/*
https://leetcode.com/problems/cut-off-trees-for-golf-event/description/
675. Cut Off Trees for Golf Event
You are asked to cut off all the trees in a forest for a golf event. The forest is represented as an m x n matrix. In this matrix:

	0 means the cell cannot be walked through.
	1 represents an empty cell that can be walked through.
	A number greater than 1 represents a tree in a cell that can be walked through, and this number is the tree's height.

In one step, you can walk in any of the four directions: north, east, south, and west. If you are standing in a cell with a tree, you can choose whether to cut it off.

You must cut off the trees in order from shortest to tallest. When you cut off a tree, the value at its cell becomes 1 (an empty cell).

Starting from the point (0, 0), return the minimum steps you need to walk to cut off all the trees. If you cannot cut off all the trees, return -1.

Note: The input is generated such that no two trees have the same height, and there is at least one tree needs to be cut off.

Example 1:

Input: forest = [[1,2,3],[0,0,4],[7,6,5]]
Output: 6
Explanation: Following the path above allows you to cut off the trees from shortest to tallest in 6 steps.

Example 2:

Input: forest = [[1,2,3],[0,0,0],[7,6,5]]
Output: -1
Explanation: The trees in the bottom row cannot be accessed as the middle row is blocked.

Example 3:

Input: forest = [[2,3,4],[0,0,5],[8,7,6]]
Output: 6
Explanation: You can follow the same path as Example 1 to cut off all the trees.
Note that you can cut off the first tree at (0, 0) before making any steps.

Constraints:

	m == forest.length
	n == forest[i].length
	1 <= m, n <= 50
	0 <= forest[i][j] <= 10^9
	Heights of all trees are distinct.
*/
export function cutOffTree(forest: number[][]): number {
    const trees: Array<[height: number, i: number, j: number]> = [];
    for (let i = 0; i < forest.length; i++) {
        for (let j = 0; j < forest[0].length; j++) {
            if (forest[i][j] > 1) {
                trees.push([forest[i][j], i, j]);
            }
        }
    }
    trees.sort(([heightA], [heightB]) => heightA - heightB);

    let i1 = 0;
    let j1 = 0;
    let steps = 0;
    for (let i = 0; i < trees.length; i++) {
        const [, i2, j2] = trees[i];
        const distance = getMinDistance(forest, i1, j1, i2, j2);
        if (distance === Infinity) {
            return -1;
        }
        steps += distance;

        i1 = i2;
        j1 = j2;
    }

    return steps;
}

function getMinDistance(
    forest: number[][],
    i1: number,
    j1: number,
    i2: number,
    j2: number
): number {
    if (i1 === i2 && j1 === j2) {
        return 0;
    }

    const nodes: Array<[i1: number, j1: number]> = [[i1, j1]];
    const visited: boolean[][] = [];
    for (let x = 0; x < forest.length; x++) {
        visited[x] = [];
    }
    visited[i1][j1] = true;

    let distance = 0;
    const directions = [
        [0, 1],
        [0, -1],
        [1, 0],
        [-1, 0],
    ];

    while (nodes.length) {
        const len = nodes.length;
        // 一次访问一层节点比访问一个节点的效率会高一点（常数项时间，量级没差别），
        // 因为倘若某一层中末尾已经到达目标节点则无需将下层节点加入 nodes
        for (let i = 0; i < len; i++) {
            const [i1, j1] = nodes.shift()!;

            if (i1 === i2 && j1 === j2) {
                return distance;
            }

            directions.forEach(([iDelta, jDelta]) => {
                const nextI1 = i1 + iDelta;
                const nextJ1 = j1 + jDelta;
                if (
                    nextI1 >= 0 &&
                    nextI1 < forest.length &&
                    nextJ1 >= 0 &&
                    nextJ1 < forest[0].length &&
                    forest[nextI1][nextJ1] &&
                    !visited[nextI1][nextJ1]
                ) {
                    visited[nextI1][nextJ1] = true;
                    nodes.push([nextI1, nextJ1]);
                }
            });
        }

        distance++;
    }

    return Infinity;
}

/*
https://leetcode.com/problems/cheapest-flights-within-k-stops/description/?envType=daily-question&envId=2024-02-23
787. Cheapest Flights Within K Stops
There are n cities connected by some number of flights. You are given an array flights where flights[i] = [fromi, toi, pricei] indicates that there is a flight from city fromi to city toi with cost pricei.

You are also given three integers src, dst, and k, return the cheapest price from src to dst with at most k stops. If there is no such route, return -1.

Example 1:

Input: n = 4, flights = [[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]], src = 0, dst = 3, k = 1
Output: 700
Explanation:
The graph is shown above.
The optimal path with at most 1 stop from city 0 to 3 is marked in red and has cost 100 + 600 = 700.
Note that the path through cities [0,1,2,3] is cheaper but is invalid because it uses 2 stops.

Example 2:

Input: n = 3, flights = [[0,1,100],[1,2,100],[0,2,500]], src = 0, dst = 2, k = 1
Output: 200
Explanation:
The graph is shown above.
The optimal path with at most 1 stop from city 0 to 2 is marked in red and has cost 100 + 100 = 200.

Example 3:

Input: n = 3, flights = [[0,1,100],[1,2,100],[0,2,500]], src = 0, dst = 2, k = 0
Output: 500
Explanation:
The graph is shown above.
The optimal path with no stops from city 0 to 2 is marked in red and has cost 500.

Constraints:

	1 <= n <= 100
	0 <= flights.length <= (n * (n - 1) / 2)
	flights[i].length == 3
	0 <= fromi, toi < n
	fromi != toi
	1 <= pricei <= 10^4
	There will not be any multiple flights between two cities.
	0 <= src, dst, k < n
	src != dst
*/
export function findCheapestPrice(
    n: number,
    flights: number[][],
    src: number,
    dst: number,
    k: number
): number {
    // 初始化dp数组，用于保存到达每个节点的当前最低价格
    const dp: number[][] = Array.from({ length: k + 2 }, () =>
        Array(n).fill(Number.MAX_SAFE_INTEGER)
    );
    dp[0][src] = 0;

    // 开始动态规划过程
    for (let i = 1; i <= k + 1; i++) {
        dp[i][src] = 0; // 出发点的成本始终为0
        for (let [from, to, price] of flights) {
            dp[i][to] = Math.min(dp[i][to], dp[i - 1][from] + price);
        }
    }

    // 如果最终目的地的价格没有被更新，返回-1，否则返回最小价格
    return dp[k + 1][dst] === Number.MAX_SAFE_INTEGER ? -1 : dp[k + 1][dst];
}

/*
https://leetcode.com/problems/find-if-path-exists-in-graph/description/?envType=daily-question&envId=2024-04-21
1971. Find if Path Exists in Graph
There is a bi-directional graph with n vertices, where each vertex is labeled from 0 to n - 1 (inclusive). 
The edges in the graph are represented as a 2D integer array edges, where each edges[i] = [ui, vi] denotes a bi-directional 
edge between vertex ui and vertex vi. Every vertex pair is connected by at most one edge, and no vertex has an edge to itself.

You want to determine if there is a valid path that exists from vertex source to vertex destination.

Given edges and the integers n, source, and destination, return true if there is a valid path from source to destination, or false otherwise.

Example 1:

Input: n = 3, edges = [[0,1],[1,2],[2,0]], source = 0, destination = 2
Output: true
Explanation: There are two paths from vertex 0 to vertex 2:
- 0 → 1 → 2
- 0 → 2

Example 2:

Input: n = 6, edges = [[0,1],[0,2],[3,5],[5,4],[4,3]], source = 0, destination = 5
Output: false
Explanation: There is no path from vertex 0 to vertex 5.

Constraints:

	1 <= n <= 10^5
	0 <= edges.length <= 10^5
	edges[i].length == 2
	0 <= ui, vi <= n - 1
	ui != vi
	0 <= source, destination <= n - 1
	There are no duplicate edges.
	There are no self edges.
*/
export function validPath(
    n: number,
    edges: number[][],
    source: number,
    destination: number
): boolean {
    const edgeMap = new Map<number, number[]>();
    edges.forEach(([from, to]) => {
        edgeMap.set(from, (edgeMap.get(from) ?? []).concat(to));
        edgeMap.set(to, (edgeMap.get(to) ?? []).concat(from));
    });

    const visited = Array(n).fill(false);
    const queue = [source];
    while (queue.length > 0) {
        const p = queue.shift()!;
        if (p === destination) {
            return true;
        }

        (edgeMap.get(p) ?? []).forEach((to) => {
            if (!visited[to]) {
                visited[to] = true;
                queue.push(to);
            }
        });
    }

    return false;
}

/*
https://leetcode.com/problems/open-the-lock/description/
752. Open the Lock
You have a lock in front of you with 4 circular wheels. Each wheel has 10 slots: '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'. 
The wheels can rotate freely and wrap around: for example we can turn '9' to be '0', or '0' to be '9'. Each move consists of turning 
one wheel one slot.

The lock initially starts at '0000', a string representing the state of the 4 wheels.

You are given a list of deadends dead ends, meaning if the lock displays any of these codes, the wheels of the lock will stop turning and you will be unable to open it.

Given a target representing the value of the wheels that will unlock the lock, return the minimum total number of turns required to open the lock, or -1 if it is impossible.

Example 1:

Input: deadends = ["0201","0101","0102","1212","2002"], target = "0202"
Output: 6
Explanation: 
A sequence of valid moves would be "0000" -> "1000" -> "1100" -> "1200" -> "1201" -> "1202" -> "0202".
Note that a sequence like "0000" -> "0001" -> "0002" -> "0102" -> "0202" would be invalid,
because the wheels of the lock become stuck after the display becomes the dead end "0102".

Example 2:

Input: deadends = ["8888"], target = "0009"
Output: 1
Explanation: We can turn the last wheel in reverse to move from "0000" -> "0009".

Example 3:

Input: deadends = ["8887","8889","8878","8898","8788","8988","7888","9888"], target = "8888"
Output: -1
Explanation: We cannot reach the target without getting stuck.

Constraints:

	1 <= deadends.length <= 500
	deadends[i].length == 4
	target.length == 4
	target will not be in the list deadends.
	target and deadends[i] consist of digits only.
*/
export function openLock(deadends: string[], target: string): number {
    const deadendSet = new Set(deadends);
    if (deadendSet.has('0000')) {
        return -1;
    }

    let queue: string[] = ['0000'];
    const visited = new Set<string>();
    let minStep = 0;
    while (queue.length) {
        const curLevel = queue.slice();
        const nexts: string[] = [];

        for (let i = 0; i < curLevel.length; i++) {
            if (curLevel[i] === target) {
                return minStep;
            }

            getNextNums(curLevel[i], deadendSet).forEach((v) => {
                if (!visited.has(v)) {
                    visited.add(v);
                    nexts.push(v);
                }
            });
        }

        if (nexts.length === 0) {
            return -1;
        }
        queue = nexts;

        minStep++;
    }

    return -1;
}

function getNextNums(char: string, deadendSet: Set<string>): string[] {
    const nexts: string[] = [];

    const len = char.length;
    for (let i = 0; i < len; i++) {
        const before = char[i] === '0' ? '9' : `${Number(char[i]) - 1}`;
        const after = char[i] === '9' ? '0' : `${Number(char[i]) + 1}`;

        [before, after].forEach((v) => {
            const n = char.slice(0, i) + v + char.slice(i + 1);
            if (!deadendSet.has(n)) {
                nexts.push(n);
            }
        });
    }

    return nexts;
}

/*
https://leetcode.com/problems/find-center-of-star-graph/description/
1791. Find Center of Star Graph
There is an undirected star graph consisting of n nodes labeled from 1 to n. A star graph is a graph where there is one center node and exactly n - 1 edges that connect the center node with every other node.

You are given a 2D integer array edges where each edges[i] = [ui, vi] indicates that there is an edge between the nodes ui and vi. Return the center of the given star graph.

Example 1:

Input: edges = [[1,2],[2,3],[4,2]]
Output: 2
Explanation: As shown in the figure above, node 2 is connected to every other node, so 2 is the center.

Example 2:

Input: edges = [[1,2],[5,1],[1,3],[1,4]]
Output: 1

Constraints:

	3 <= n <= 10^5
	edges.length == n - 1
	edges[i].length == 2
	1 <= ui, vi <= n
	ui != vi
	The given edges represent a valid star graph.
*/
export function findCenter(edges: number[][]): number {
    const visited = new Set<number>();
    for (const [from, to] of edges) {
        if (visited.has(from)) {
            return from;
        }
        if (visited.has(to)) {
            return to;
        }

        visited.add(from);
        visited.add(to);
    }

    return -1;
}
