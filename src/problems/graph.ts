import { UnionFind } from '../algorithm/union-find';
import { GenericHeap } from '../algorithm/generic-heap';
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

// https://www.bilibili.com/list/8888480?sort_field=pubtime&spm_id_from=333.999.0.0&oid=364544124&bvid=BV1t94y187zW
export function findCheapestPrice2(
  n: number,
  flights: number[][],
  src: number,
  dst: number,
  k: number
): number {
  let cur: number[] = Array(n).fill(Infinity);
  cur[src] = 0;

  while (k >= 0) {
    k--;

    const next = cur.slice();
    for (const [from, to, price] of flights) {
      if (cur[from] !== Infinity) {
        next[to] = Math.min(next[to], cur[from] + price);
      }
    }
    cur = next;
  }

  return cur[dst] === Infinity ? -1 : cur[dst];
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

/*
https://leetcode.com/problems/maximum-total-importance-of-roads/description/
2285. Maximum Total Importance of Roads
You are given an integer n denoting the number of cities in a country. The cities are numbered from 0 to n - 1.

You are also given a 2D integer array roads where roads[i] = [ai, bi] denotes that there exists a bidirectional road connecting cities ai and bi.

You need to assign each city with an integer value from 1 to n, where each value can only be used once. The importance of a road is then defined as the sum of the values of the two cities it connects.

Return the maximum total importance of all roads possible after assigning the values optimally.

Example 1:

Input: n = 5, roads = [[0,1],[1,2],[2,3],[0,2],[1,3],[2,4]]
Output: 43
Explanation: The figure above shows the country and the assigned values of [2,4,5,3,1].
- The road (0,1) has an importance of 2 + 4 = 6.
- The road (1,2) has an importance of 4 + 5 = 9.
- The road (2,3) has an importance of 5 + 3 = 8.
- The road (0,2) has an importance of 2 + 5 = 7.
- The road (1,3) has an importance of 4 + 3 = 7.
- The road (2,4) has an importance of 5 + 1 = 6.
The total importance of all roads is 6 + 9 + 8 + 7 + 7 + 6 = 43.
It can be shown that we cannot obtain a greater total importance than 43.

Example 2:

Input: n = 5, roads = [[0,3],[2,4],[1,3]]
Output: 20
Explanation: The figure above shows the country and the assigned values of [4,3,2,5,1].
- The road (0,3) has an importance of 4 + 5 = 9.
- The road (2,4) has an importance of 2 + 1 = 3.
- The road (1,3) has an importance of 3 + 5 = 8.
The total importance of all roads is 9 + 3 + 8 = 20.
It can be shown that we cannot obtain a greater total importance than 20.

Constraints:

	2 <= n <= 10^4
	1 <= roads.length <= 10^4
	roads[i].length == 2
	0 <= ai, bi <= n - 1
	ai != bi
	There are no duplicate roads.
*/
export function maximumImportance(n: number, roads: number[][]): number {
  const degrees = Array(n).fill(0);
  roads.forEach(([from, to]) => {
    degrees[from]++;
    degrees[to]++;
  });

  return degrees
    .sort((a, b) => a - b)
    .map((v, i) => v * (i + 1))
    .reduce((s, c) => s + c, 0);
}

/*
https://leetcode.com/problems/all-ancestors-of-a-node-in-a-directed-acyclic-graph/description/?envType=daily-question&envId=2024-06-29
2192. All Ancestors of a Node in a Directed Acyclic Graph
You are given a positive integer n representing the number of nodes of a Directed Acyclic Graph (DAG). The nodes are numbered from 0 to n - 1 (inclusive).

You are also given a 2D integer array edges, where edges[i] = [fromi, toi] denotes that there is a unidirectional edge from fromi to toi in the graph.

Return a list answer, where answer[i] is the list of ancestors of the ith node, sorted in ascending order.

A node u is an ancestor of another node v if u can reach v via a set of edges.

Example 1:

Input: n = 8, edgeList = [[0,3],[0,4],[1,3],[2,4],[2,7],[3,5],[3,6],[3,7],[4,6]]
Output: [[],[],[],[0,1],[0,2],[0,1,3],[0,1,2,3,4],[0,1,2,3]]
Explanation:
The above diagram represents the input graph.
- Nodes 0, 1, and 2 do not have any ancestors.
- Node 3 has two ancestors 0 and 1.
- Node 4 has two ancestors 0 and 2.
- Node 5 has three ancestors 0, 1, and 3.
- Node 6 has five ancestors 0, 1, 2, 3, and 4.
- Node 7 has four ancestors 0, 1, 2, and 3.

Example 2:

Input: n = 5, edgeList = [[0,1],[0,2],[0,3],[0,4],[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]]
Output: [[],[0],[0,1],[0,1,2],[0,1,2,3]]
Explanation:
The above diagram represents the input graph.
- Node 0 does not have any ancestor.
- Node 1 has one ancestor 0.
- Node 2 has two ancestors 0 and 1.
- Node 3 has three ancestors 0, 1, and 2.
- Node 4 has four ancestors 0, 1, 2, and 3.

Constraints:

	1 <= n <= 1000
	0 <= edges.length <= min(2000, n * (n - 1) / 2)
	edges[i].length == 2
	0 <= fromi, toi <= n - 1
	fromi != toi
	There are no duplicate edges.
	The graph is directed and acyclic.
*/
export function getAncestors(n: number, edges: number[][]): number[][] {
  const degrees: number[] = Array(n).fill(0);
  const parents: number[][] = Array.from({ length: n }, () => []);
  const tables: number[][] = Array.from({ length: n }, () => []);
  edges.forEach(([from, to]) => {
    degrees[to]++;
    parents[to].push(from);
    tables[from].push(to);
  });

  const results: number[][] = Array.from({ length: n }, () => []);
  let leafs: number[] = [];
  degrees.forEach((v, i) => {
    if (v === 0) {
      leafs.push(i);
    }
  });

  while (leafs.length) {
    const current: number[] = [];
    leafs.forEach((i) => {
      tables[i].forEach((v) => {
        if (--degrees[v] === 0) {
          current.push(v);
          results[v] = Array.from(
            new Set(
              parents[v].concat(...parents[v].map((index) => results[index]))
            )
          ).sort((a, b) => a - b);
        }
      });

      leafs = current;
    });
  }

  return results;
}

/*
https://leetcode.com/problems/find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance/description/
1334. Find the City With the Smallest Number of Neighbors at a Threshold Distance
There are n cities numbered from 0 to n-1. Given the array edges where edges[i] = [fromi, toi, weighti] represents a bidirectional and weighted edge between cities fromi and toi, and given the integer distanceThreshold.

Return the city with the smallest number of cities that are reachable through some path and whose distance is at most distanceThreshold, If there are multiple such cities, return the city with the greatest number.

Notice that the distance of a path connecting cities i and j is equal to the sum of the edges' weights along that path.

Example 1:

Input: n = 4, edges = [[0,1,3],[1,2,1],[1,3,4],[2,3,1]], distanceThreshold = 4
Output: 3
Explanation: The figure above describes the graph. 
The neighboring cities at a distanceThreshold = 4 for each city are:
City 0 -> [City 1, City 2] 
City 1 -> [City 0, City 2, City 3] 
City 2 -> [City 0, City 1, City 3] 
City 3 -> [City 1, City 2] 
Cities 0 and 3 have 2 neighboring cities at a distanceThreshold = 4, but we have to return city 3 since it has the greatest number.

Example 2:

Input: n = 5, edges = [[0,1,2],[0,4,8],[1,2,3],[1,4,2],[2,3,1],[3,4,1]], distanceThreshold = 2
Output: 0
Explanation: The figure above describes the graph. 
The neighboring cities at a distanceThreshold = 2 for each city are:
City 0 -> [City 1] 
City 1 -> [City 0, City 4] 
City 2 -> [City 3, City 4] 
City 3 -> [City 2, City 4]
City 4 -> [City 1, City 2, City 3] 
The city 0 has 1 neighboring city at a distanceThreshold = 2.

Constraints:

	2 <= n <= 100
	1 <= edges.length <= n * (n - 1) / 2
	edges[i].length == 3
	0 <= fromi < toi < n
	1 <= weighti, distanceThreshold <= 10^4
	All pairs (fromi, toi) are distinct.

Floyd-Warshall algorithm
*/
export function findTheCity(
  n: number,
  edges: number[][],
  distanceThreshold: number
): number {
  const distance = Array.from({ length: n }, () => Array(n).fill(10001));
  for (let i = 0; i < n; i++) {
    distance[i][i] = 0;
  }
  edges.forEach(([f, t, w]) => {
    distance[f][t] = w;
    distance[t][f] = w;
  });

  for (let mid = 0; mid < n; mid++) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        distance[i][j] = Math.min(
          distance[i][j],
          distance[i][mid] + distance[mid][j]
        );
      }
    }
  }

  let min = Infinity;
  let res = -1;
  for (let i = 0; i < n; i++) {
    let count = 0;
    for (let j = 0; j < n; j++) {
      if (distance[i][j] <= distanceThreshold) {
        count++;
      }
    }

    if (min >= count) {
      min = count;
      res = i;
    }
  }

  return res;
}

/**
 * https://www.luogu.com.cn/problem/P4017
 * # 最大食物链计数

## 题目背景

你知道食物链吗？Delia 生物考试的时候，数食物链条数的题目全都错了，因为她总是重复数了几条或漏掉了几条。于是她来就来求助你，然而你也不会啊！写一个程序来帮帮她吧。

## 题目描述

给你一个食物网，你要求出这个食物网中最大食物链的数量。

（这里的“最大食物链”，指的是**生物学意义上的食物链**，即**最左端是不会捕食其他生物的生产者，最右端是不会被其他生物捕食的消费者**。）

Delia 非常急，所以你只有 $1$ 秒的时间。

由于这个结果可能过大，你只需要输出总数模上 $80112002$ 的结果。

## 输入格式

第一行，两个正整数 $n、m$，表示生物种类 $n$ 和吃与被吃的关系数 $m$。

接下来 $m$ 行，每行两个正整数，表示被吃的生物A和吃A的生物B。

## 输出格式

一行一个整数，为最大食物链数量模上 $80112002$ 的结果。

## 样例 #1

### 样例输入 #1

```
5 7
1 2
1 3
2 3
3 5
2 5
4 5
3 4
```

### 样例输出 #1

```
5
```

## 提示

各测试点满足以下约定：

 ![](https://cdn.luogu.com.cn/upload/pic/12011.png) 

【补充说明】

数据中不会出现环，满足生物学的要求。（感谢 @AKEE ）
 */
export function countLinesOfFoodChain(n: number, edges: number[][]): number {
  const tables: number[][] = Array.from({ length: n + 1 }, () => []);
  const inCount: number[] = Array(n + 1).fill(0);
  edges.forEach(([from, to]) => {
    tables[from].push(to);
    inCount[to]++;
  });

  const queue: number[] = [];
  const lines: number[] = Array(n + 1).fill(0);
  for (let i = 1; i <= n; i++) {
    if (inCount[i] === 0) {
      queue.push(i);
      lines[i] = 1;
    }
  }

  while (queue.length) {
    const first = queue.shift()!;
    tables[first].forEach((to) => {
      inCount[to]--;
      if (inCount[to] === 0) {
        queue.push(to);
      }

      lines[to] = (lines[to] + lines[first]) % 80112002;
    });
  }

  return lines.reduce((s, c, i) => {
    if (tables[i].length === 0) {
      s = (s + c) % 80112002;
    }

    return s;
  });
}

/*
https://leetcode.com/problems/loud-and-rich/description/
851. Loud and Rich
There is a group of n people labeled from 0 to n - 1 where each person has a different amount of money and a different level of quietness.

You are given an array richer where richer[i] = [ai, bi] indicates that ai has more money than bi and an integer array quiet where quiet[i] is the quietness of the ith person. All the given data in richer are logically correct (i.e., the data will not lead you to a situation where x is richer than y and y is richer than x at the same time).

Return an integer array answer where answer[x] = y if y is the least quiet person (that is, the person y with the smallest value of quiet[y]) among all people who definitely have equal to or more money than the person x.

Example 1:

Input: richer = [[1,0],[2,1],[3,1],[3,7],[4,3],[5,3],[6,3]], quiet = [3,2,5,4,6,1,7,0]
Output: [5,5,2,5,4,5,6,7]
Explanation: 
answer[0] = 5.
Person 5 has more money than 3, which has more money than 1, which has more money than 0.
The only person who is quieter (has lower quiet[x]) is person 7, but it is not clear if they have more money than person 0.
answer[7] = 7.
Among all people that definitely have equal to or more money than person 7 (which could be persons 3, 4, 5, 6, or 7), the person who is the quietest (has lower quiet[x]) is person 7.
The other answers can be filled out with similar reasoning.

Example 2:

Input: richer = [], quiet = [0]
Output: [0]

Constraints:

	n == quiet.length
	1 <= n <= 500
	0 <= quiet[i] < n
	All the values of quiet are unique.
	0 <= richer.length <= n * (n - 1) / 2
	0 <= ai, bi < n
	ai != bi
	All the pairs of richer are unique.
	The observations in richer are all logically consistent.
*/
export function loudAndRich(richer: number[][], quiet: number[]): number[] {
  const n = quiet.length;
  const tables: number[][] = Array.from({ length: n }, () => []);
  const inCount: number[] = Array(n).fill(0);
  richer.forEach(([from, to]) => {
    tables[from].push(to);
    inCount[to]++;
  });

  const queue: number[] = [];
  inCount.forEach((v, i) => {
    if (v === 0) {
      queue.push(i);
    }
  });

  const ret: number[] = Array.from({ length: n }, (_, i) => i);
  while (queue.length) {
    const first = queue.shift()!;
    tables[first].forEach((to) => {
      inCount[to]--;
      if (inCount[to] === 0) {
        queue.push(to);
      }

      if (quiet[ret[to]] > quiet[ret[first]]) {
        ret[to] = ret[first];
      }
    });
  }

  return ret;
}

/*
https://leetcode.com/problems/parallel-courses-iii/description/
2050. Parallel Courses III
You are given an integer n, which indicates that there are n courses labeled from 1 to n. You are also given a 2D integer array relations where relations[j] = [prevCoursej, nextCoursej] denotes that course prevCoursej has to be completed before course nextCoursej (prerequisite relationship). Furthermore, you are given a 0-indexed integer array time where time[i] denotes how many months it takes to complete the (i+1)th course.

You must find the minimum number of months needed to complete all the courses following these rules:

	You may start taking a course at any time if the prerequisites are met.
	Any number of courses can be taken at the same time.

Return the minimum number of months needed to complete all the courses.

Note: The test cases are generated such that it is possible to complete every course (i.e., the graph is a directed acyclic graph).

Example 1:

Input: n = 3, relations = [[1,3],[2,3]], time = [3,2,5]
Output: 8
Explanation: The figure above represents the given graph and the time required to complete each course. 
We start course 1 and course 2 simultaneously at month 0.
Course 1 takes 3 months and course 2 takes 2 months to complete respectively.
Thus, the earliest time we can start course 3 is at month 3, and the total time required is 3 + 5 = 8 months.

Example 2:

Input: n = 5, relations = [[1,5],[2,5],[3,5],[3,4],[4,5]], time = [1,2,3,4,5]
Output: 12
Explanation: The figure above represents the given graph and the time required to complete each course.
You can start courses 1, 2, and 3 at month 0.
You can complete them after 1, 2, and 3 months respectively.
Course 4 can be taken only after course 3 is completed, i.e., after 3 months. It is completed after 3 + 4 = 7 months.
Course 5 can be taken only after courses 1, 2, 3, and 4 have been completed, i.e., after max(1,2,3,7) = 7 months.
Thus, the minimum time needed to complete all the courses is 7 + 5 = 12 months.

Constraints:

	1 <= n <= 10^4
	0 <= relations.length <= min(n * (n - 1) / 2, 5 * 104)
	relations[j].length == 2
	1 <= prevCoursej, nextCoursej <= n
	prevCoursej != nextCoursej
	All the pairs [prevCoursej, nextCoursej] are unique.
	time.length == n
	1 <= time[i] <= 10^4
	The given graph is a directed acyclic graph.
*/
export function minimumTime(
  n: number,
  relations: number[][],
  time: number[]
): number {
  const tables: number[][] = Array.from({ length: n + 1 }, () => []);
  const inCount: number[] = Array(n + 1).fill(0);
  relations.forEach(([prev, next]) => {
    tables[prev].push(next);
    inCount[next]++;
  });

  const queue: number[] = [];
  for (let i = 1; i <= n; i++) {
    if (inCount[i] === 0) {
      queue.push(i);
    }
  }

  const minTimes = time.slice();
  while (queue.length) {
    const first = queue.shift()!;
    tables[first].forEach((next) => {
      inCount[next]--;
      if (inCount[next] === 0) {
        queue.push(next);
      }

      minTimes[next - 1] = Math.max(
        minTimes[next - 1],
        minTimes[first - 1] + time[next - 1]
      );
    });
  }

  return Math.max(...minTimes);
}

/**
 * - https://www.luogu.com.cn/problem/P3366
 * - https://www.bilibili.com/list/8888480?tid=0&sort_field=pubtime&spm_id_from=333.999.0.0&oid=873823296&bvid=BV1sK4y1F7LH
 * - k 算法求最小生成树
 * 
 * # 【模板】最小生成树

## 题目描述

如题，给出一个无向图，求出最小生成树，如果该图不连通，则输出 `orz`。

## 输入格式

第一行包含两个整数 $N,M$，表示该图共有 $N$ 个结点和 $M$ 条无向边。

接下来 $M$ 行每行包含三个整数 $X_i,Y_i,Z_i$，表示有一条长度为 $Z_i$ 的无向边连接结点 $X_i,Y_i$。

## 输出格式

如果该图连通，则输出一个整数表示最小生成树的各边的长度之和。如果该图不连通则输出 `orz`。

## 样例 #1

### 样例输入 #1

```
4 5
1 2 2
1 3 2
1 4 3
2 3 4
3 4 3
```

### 样例输出 #1

```
7
```

## 提示

数据规模：

对于 $20\%$ 的数据，$N\le 5$，$M\le 20$。

对于 $40\%$ 的数据，$N\le 50$，$M\le 2500$。

对于 $70\%$ 的数据，$N\le 500$，$M\le 10^4$。

对于 $100\%$ 的数据：$1\le N\le 5000$，$1\le M\le 2\times 10^5$，$1\le Z_i \le 10^4$。


样例解释：

 ![](https://cdn.luogu.com.cn/upload/pic/2259.png) 

所以最小生成树的总边权为 $2+2+3=7$。
 */
export function minimumSpanningTree(n: number, edges: number[][]) {
  const sorted = edges.sort(
    ([, , weightA], [, , weightB]) => weightA - weightB
  );

  const unionFind = new UnionFind(n + 1);
  let w = 0;
  let count = 0;
  sorted.forEach(([from, to, weight]) => {
    if (!unionFind.isSameSet(from, to)) {
      unionFind.union(from, to);
      w += weight;
      count++;
    }
  });

  return count === n - 1 ? w : 'orz';
}

// https://www.bilibili.com/list/8888480?tid=0&sort_field=pubtime&spm_id_from=333.999.0.0&oid=873823296&bvid=BV1sK4y1F7LH
// Prim 算法求最小生成树
export function minimumSpanningTreeP(n: number, edges: number[][]) {
  const tables: number[][][] = Array.from({ length: n + 1 }, () => []);
  edges.forEach(([from, to, weight]) => {
    tables[from].push([to, weight]);
    tables[to].push([from, weight]);
  });

  const visited = Array(n + 1).fill(false);
  visited[1] = true;
  const heap = new GenericHeap<number[]>((a, b) => a[1] - b[1]);
  tables[1].forEach((v) => {
    heap.push(v);
  });

  let w = 0;
  let count = 1;
  while (!heap.isEmpty()) {
    const [to, weight] = heap.pop();

    if (!visited[to]) {
      visited[to] = true;
      w += weight;
      count++;

      tables[to].forEach(([next, weight]) => {
        if (!visited[next]) {
          heap.push([next, weight]);
        }
      });
    }
  }

  return count === n ? w : 'orz';
}

/*
https://leetcode.com/problems/network-delay-time/description/
743. Network Delay Time
You are given a network of n nodes, labeled from 1 to n. You are also given times, a list of travel times as directed edges times[i] = (ui, vi, wi), where ui is the source node, vi is the target node, and wi is the time it takes for a signal to travel from source to target.

We will send a signal from a given node k. Return the minimum time it takes for all the n nodes to receive the signal. If it is impossible for all the n nodes to receive the signal, return -1.

Example 1:

Input: times = [[2,1,1],[2,3,1],[3,4,1]], n = 4, k = 2
Output: 2

Example 2:

Input: times = [[1,2,1]], n = 2, k = 1
Output: 1

Example 3:

Input: times = [[1,2,1]], n = 2, k = 2
Output: -1

Constraints:

	1 <= k <= n <= 100
	1 <= times.length <= 6000
	times[i].length == 3
	1 <= ui, vi <= n
	ui != vi
	0 <= wi <= 100
	All the pairs (ui, vi) are unique. (i.e., no multiple edges.)
*/
export function networkDelayTime(
  times: number[][],
  n: number,
  k: number
): number {
  const tables: number[][][] = Array.from({ length: n + 1 }, () => []);
  times.forEach(([from, to, weight]) => {
    tables[from].push([to, weight]);
  });

  const distance: number[] = Array(n + 1).fill(Infinity);
  const visited: boolean[] = Array(n + 1).fill(false);
  const heap = new GenericHeap<[p: number, dis: number]>((a, b) => a[1] - b[1]);

  distance[k] = 0;
  heap.push([k, 0]);

  while (heap.size() > 0) {
    const [p, dis] = heap.pop();
    if (!visited[p]) {
      visited[p] = true;

      tables[p].forEach(([next, weight]) => {
        if (!visited[next] && dis + weight < distance[next]) {
          distance[next] = dis + weight;
          heap.push([next, distance[next]]);
        }
      });
    }
  }

  let max = -Infinity;
  for (let i = 1; i <= n; i++) {
    if (distance[i] === Infinity) {
      return -1;
    }
    max = Math.max(max, distance[i]);
  }

  return max;
}

/*
https://leetcode.com/problems/swim-in-rising-water/description/
778. Swim in Rising Water
You are given an n x n integer matrix grid where each value grid[i][j] represents the elevation at that point (i, j).

The rain starts to fall. At time t, the depth of the water everywhere is t. You can swim from a square to another 4-directionally adjacent square if and only if the elevation of both squares individually are at most t. You can swim infinite distances in zero time. Of course, you must stay within the boundaries of the grid during your swim.

Return the least time until you can reach the bottom right square (n - 1, n - 1) if you start at the top left square (0, 0).

Example 1:

Input: grid = [[0,2],[1,3]]
Output: 3
Explanation:
At time 0, you are in grid location (0, 0).
You cannot go anywhere else because 4-directionally adjacent neighbors have a higher elevation than t = 0.
You cannot reach point (1, 1) until time 3.
When the depth of water is 3, we can swim anywhere inside the grid.

Example 2:

Input: grid = [[0,1,2,3,4],[24,23,22,21,5],[12,13,14,15,16],[11,17,18,19,20],[10,9,8,7,6]]
Output: 16
Explanation: The final route is shown.
We need to wait until time 16 so that (0, 0) and (4, 4) are connected.

Constraints:

	n == grid.length
	n == grid[i].length
	1 <= n <= 50
	0 <= grid[i][j] < n2
	Each value grid[i][j] is unique.
*/
export function swimInWater(grid: number[][]): number {
  const n = grid.length;
  const distance: number[][] = Array.from({ length: n }, () =>
    Array(n).fill(Infinity)
  );
  const visited: boolean[][] = Array.from({ length: n }, () =>
    Array(n).fill(false)
  );
  const heap = new GenericHeap<[x: number, y: number, dis: number]>(
    (a, b) => a[2] - b[2]
  );

  distance[0][0] = grid[0][0];
  heap.push([0, 0, grid[0][0]]);

  const moves: number[] = [-1, 0, 1, 0, -1];

  while (heap.size() > 0) {
    const [x, y, dis] = heap.pop();
    if (!visited[x][y]) {
      visited[x][y] = true;

      if (x === n - 1 && y === n - 1) {
        return dis;
      }

      for (let i = 0; i < moves.length - 1; i++) {
        const nX = x + moves[i];
        const nY = y + moves[i + 1];

        if (nX >= 0 && nX < n && nY >= 0 && nY < n && !visited[nX][nY]) {
          const newDis = Math.max(dis, grid[nX][nY]);

          if (distance[nX][nY] > newDis) {
            distance[nX][nY] = newDis;
            heap.push([nX, nY, newDis]);
          }
        }
      }
    }
  }

  return -1;
}

/*
https://leetcode.com/problems/clone-graph/description/
133. Clone Graph
Given a reference of a node in a connected undirected graph.

Return a deep copy (clone) of the graph.

Each node in the graph contains a value (int) and a list (List[Node]) of its neighbors.

class Node {
    public int val;
    public List<Node> neighbors;
}

Test case format:

For simplicity, each node's value is the same as the node's index (1-indexed). For example, the first node with val == 1, the second node with val == 2, and so on. The graph is represented in the test case using an adjacency list.

An adjacency list is a collection of unordered lists used to represent a finite graph. Each list describes the set of neighbors of a node in the graph.

The given node will always be the first node with val = 1. You must return the copy of the given node as a reference to the cloned graph.

Example 1:

Input: adjList = [[2,4],[1,3],[2,4],[1,3]]
Output: [[2,4],[1,3],[2,4],[1,3]]
Explanation: There are 4 nodes in the graph.
1st node (val = 1)'s neighbors are 2nd node (val = 2) and 4th node (val = 4).
2nd node (val = 2)'s neighbors are 1st node (val = 1) and 3rd node (val = 3).
3rd node (val = 3)'s neighbors are 2nd node (val = 2) and 4th node (val = 4).
4th node (val = 4)'s neighbors are 1st node (val = 1) and 3rd node (val = 3).

Example 2:

Input: adjList = [[]]
Output: [[]]
Explanation: Note that the input contains one empty list. The graph consists of only one node with val = 1 and it does not have any neighbors.

Example 3:

Input: adjList = []
Output: []
Explanation: This an empty graph, it does not have any nodes.

Constraints:

	The number of nodes in the graph is in the range [0, 100].
	1 <= Node.val <= 100
	Node.val is unique for each node.
	There are no repeated edges and no self-loops in the graph.
	The Graph is connected and all nodes can be visited starting from the given node.
*/

class _Node {
  val: number;
  neighbors: _Node[];

  constructor(val?: number, neighbors?: _Node[]) {
    this.val = val === undefined ? 0 : val;
    this.neighbors = neighbors === undefined ? [] : neighbors;
  }
}

export function cloneGraph(node: _Node | null): _Node | null {
  if (!node) {
    return null;
  }

  const nodes = new Map<number, _Node>();
  const dfs = (n: _Node) => {
    if (nodes.has(n.val)) {
      return;
    }

    const newNode = new _Node(n.val);
    nodes.set(n.val, newNode);

    n.neighbors.forEach((neighbor) => dfs(neighbor));
  };
  dfs(node);

  const visited = new Set<number>();
  const buildConnections = (n: _Node) => {
    if (visited.has(n.val)) {
      return;
    }

    visited.add(n.val);
    const newNode = nodes.get(n.val)!;
    newNode.neighbors = n.neighbors.map((neighbor) => nodes.get(neighbor.val)!);

    n.neighbors.forEach((neighbor) => buildConnections(neighbor));
  };
  buildConnections(node);

  return nodes.get(node.val)!;
}

/*
https://leetcode.com/problems/find-champion-ii/description/
2924. Find Champion II
There are n teams numbered from 0 to n - 1 in a tournament; each team is also a node in a DAG.

You are given the integer n and a 0-indexed 2D integer array edges of length m representing the DAG, where edges[i] = [ui, vi] indicates that there is a directed edge from team ui to team vi in the graph.

A directed edge from a to b in the graph means that team a is stronger than team b and team b is weaker than team a.

Team a will be the champion of the tournament if there is no team b that is stronger than team a.

Return the team that will be the champion of the tournament if there is a unique champion, otherwise, return -1.

Notes

	A cycle is a series of nodes a1, a2, ..., an, an+1 such that node a1 is the same node as node an+1, the nodes a1, a2, ..., an are distinct, and there is a directed edge from the node ai to node ai+1 for every i in the range [1, n].
	A DAG is a directed graph that does not have any cycle.

Example 1:

Input: n = 3, edges = [[0,1],[1,2]]
Output: 0
Explanation: Team 1 is weaker than team 0. Team 2 is weaker than team 1. So the champion is team 0.

Example 2:

Input: n = 4, edges = [[0,2],[1,3],[1,2]]
Output: -1
Explanation: Team 2 is weaker than team 0 and team 1. Team 3 is weaker than team 1. But team 1 and team 0 are not weaker than any other teams. So the answer is -1.

Constraints:

	1 <= n <= 100
	m == edges.length
	0 <= m <= n * (n - 1) / 2
	edges[i].length == 2
	0 <= edge[i][j] <= n - 1
	edges[i][0] != edges[i][1]
	The input is generated such that if team a is stronger than team b, team b is not stronger than team a.
	The input is generated such that if team a is stronger than team b and team b is stronger than team c, then team a is stronger than team c.
*/
export function findChampion(n: number, edges: number[][]): number {
  const degrees: number[] = Array(n).fill(0);
  edges.forEach(([, t]) => {
    degrees[t]++;
  });

  if (degrees.filter((v) => v === 0).length > 1) {
    return -1;
  }

  for (let i = 0; i < degrees.length; i++) {
    if (degrees[i] === 0) {
      return i;
    }
  }
  return -1;
}

/*
https://leetcode.com/problems/shortest-distance-after-road-addition-queries-i/description/
3243. Shortest Distance After Road Addition Queries I
You are given an integer n and a 2D integer array queries.

There are n cities numbered from 0 to n - 1. Initially, there is a unidirectional road from city i to city i + 1 for all 0 <= i < n - 1.

queries[i] = [ui, vi] represents the addition of a new unidirectional road from city ui to city vi. After each query, you need to find the length of the shortest path from city 0 to city n - 1.

Return an array answer where for each i in the range [0, queries.length - 1], answer[i] is the length of the shortest path from city 0 to city n - 1 after processing the first i + 1 queries.

Example 1:

Input: n = 5, queries = [[2,4],[0,2],[0,4]]

Output: [3,2,1]

Explanation: 

After the addition of the road from 2 to 4, the length of the shortest path from 0 to 4 is 3.

After the addition of the road from 0 to 2, the length of the shortest path from 0 to 4 is 2.

After the addition of the road from 0 to 4, the length of the shortest path from 0 to 4 is 1.

Example 2:

Input: n = 4, queries = [[0,3],[0,2]]

Output: [1,1]

Explanation:

After the addition of the road from 0 to 3, the length of the shortest path from 0 to 3 is 1.

After the addition of the road from 0 to 2, the length of the shortest path remains 1.

Constraints:

	3 <= n <= 500
	1 <= queries.length <= 500
	queries[i].length == 2
	0 <= queries[i][0] < queries[i][1] < n
	1 < queries[i][1] - queries[i][0]
	There are no repeated roads among the queries.
*/
export function shortestDistanceAfterQueries(
  n: number,
  queries: number[][]
): number[] {
  const tables: number[][] = Array.from({ length: n }, () => []);
  for (let i = 0; i < n - 1; i++) {
    tables[i].push(i + 1);
  }

  const queue: number[] = Array(n);
  const getMinDistance = (): number => {
    let left = 0;
    let right = 0;
    queue[right++] = 0;
    let level = 0;
    const visited: boolean[] = Array(n).fill(false);

    while (left < right) {
      const prevRight = right;
      while (left < prevRight) {
        const from = queue[left++];
        if (from === n - 1) {
          return level;
        }

        tables[from].forEach((to) => {
          if (!visited[to]) {
            visited[to] = true;
            queue[right++] = to;
          }
        });
      }

      level++;
    }

    return level;
  };

  return queries.map(([f, t]) => {
    tables[f].push(t);
    return getMinDistance();
  });
}

/*
https://leetcode.com/problems/minimum-obstacle-removal-to-reach-corner/description/
2290. Minimum Obstacle Removal to Reach Corner
You are given a 0-indexed 2D integer array grid of size m x n. Each cell has one of two values:

	0 represents an empty cell,
	1 represents an obstacle that may be removed.

You can move up, down, left, or right from and to an empty cell.

Return the minimum number of obstacles to remove so you can move from the upper left corner (0, 0) to the lower right corner (m - 1, n - 1).

Example 1:

Input: grid = [[0,1,1],[1,1,0],[1,1,0]]
Output: 2
Explanation: We can remove the obstacles at (0, 1) and (0, 2) to create a path from (0, 0) to (2, 2).
It can be shown that we need to remove at least 2 obstacles, so we return 2.
Note that there may be other ways to remove 2 obstacles to create a path.

Example 2:

Input: grid = [[0,1,0,0,0],[0,1,0,1,0],[0,0,0,1,0]]
Output: 0
Explanation: We can move from (0, 0) to (2, 4) without removing any obstacles, so we return 0.

Constraints:

	m == grid.length
	n == grid[i].length
	1 <= m, n <= 10^5
	2 <= m * n <= 10^5
	grid[i][j] is either 0 or 1.
	grid[0][0] == grid[m - 1][n - 1] == 0
*/
export function minimumObstacles(grid: number[][]): number {
  const m = grid.length;
  const n = grid[0].length;

  const distances: number[][] = Array.from({ length: m }, () => Array(n));
  const visited: boolean[][] = Array.from({ length: m }, () =>
    Array(n).fill(false)
  );
  const minHeap = new GenericHeap<[i: number, j: number, distance: number]>(
    (a, b) => a[2] - b[2]
  );

  distances[0][0] = 0;
  minHeap.push([0, 0, 0]);

  const moves: number[] = [-1, 0, 1, 0, -1];
  while (minHeap.size() > 0) {
    const [i, j, prevDistance] = minHeap.pop();
    if (visited[i][j]) {
      continue;
    }
    visited[i][j] = true;

    for (let k = 0; k < moves.length - 1; k++) {
      const nextI = i + moves[k];
      const nextJ = j + moves[k + 1];

      if (
        nextI >= 0 &&
        nextI < m &&
        nextJ >= 0 &&
        nextJ < n &&
        !visited[nextI][nextJ] &&
        (distances[nextI][nextJ] === undefined ||
          prevDistance + grid[nextI][nextJ] < distances[nextI][nextJ])
      ) {
        distances[nextI][nextJ] = prevDistance + grid[nextI][nextJ];
        minHeap.push([nextI, nextJ, distances[nextI][nextJ]]);
      }
    }
  }

  return distances[m - 1][n - 1];
}

/*
https://leetcode.com/problems/maximum-number-of-k-divisible-components/description/
2872. Maximum Number of K-Divisible Components
There is an undirected tree with n nodes labeled from 0 to n - 1. You are given the integer n and a 2D integer array edges of length n - 1, where edges[i] = [ai, bi] indicates that there is an edge between nodes ai and bi in the tree.

You are also given a 0-indexed integer array values of length n, where values[i] is the value associated with the ith node, and an integer k.

A valid split of the tree is obtained by removing any set of edges, possibly empty, from the tree such that the resulting components all have values that are divisible by k, where the value of a connected component is the sum of the values of its nodes.

Return the maximum number of components in any valid split.

Example 1:

Input: n = 5, edges = [[0,2],[1,2],[1,3],[2,4]], values = [1,8,1,4,4], k = 6
Output: 2
Explanation: We remove the edge connecting node 1 with 2. The resulting split is valid because:
- The value of the component containing nodes 1 and 3 is values[1] + values[3] = 12.
- The value of the component containing nodes 0, 2, and 4 is values[0] + values[2] + values[4] = 6.
It can be shown that no other valid split has more than 2 connected components.

Example 2:

Input: n = 7, edges = [[0,1],[0,2],[1,3],[1,4],[2,5],[2,6]], values = [3,0,6,1,5,2,1], k = 3
Output: 3
Explanation: We remove the edge connecting node 0 with 2, and the edge connecting node 0 with 1. The resulting split is valid because:
- The value of the component containing node 0 is values[0] = 3.
- The value of the component containing nodes 2, 5, and 6 is values[2] + values[5] + values[6] = 9.
- The value of the component containing nodes 1, 3, and 4 is values[1] + values[3] + values[4] = 6.
It can be shown that no other valid split has more than 3 connected components.

Constraints:

	1 <= n <= 10^4
	edges.length == n - 1
	edges[i].length == 2
	0 <= ai, bi < n
	values.length == n
	0 <= values[i] <= 10^9
	1 <= k <= 10^9
	Sum of values is divisible by k.
	The input is generated such that edges represents a valid tree.
*/
export function maxKDivisibleComponents(
  n: number,
  edges: number[][],
  values: number[],
  k: number
): number {
  const tables: number[][] = Array.from({ length: n }, () => []);
  const inDegree: number[] = Array(n).fill(0);
  edges.forEach(([from, to]) => {
    tables[from].push(to);
    tables[to].push(from);
    inDegree[to]++;
    inDegree[from]++;
  });

  const zeroInDegreeQueue: number[] = Array(n);
  let left = 0;
  let right = 0;
  inDegree.forEach((v, i) => {
    if (v === 1) {
      zeroInDegreeQueue[right++] = i;
    }
  });
  if (left === right) {
    zeroInDegreeQueue[right++] = 0;
  }

  let count = 0;
  while (left < right) {
    const first = zeroInDegreeQueue[left++];

    let found = false;
    if (values[first] % k === 0) {
      count++;
      found = true;
    }

    tables[first].forEach((next) => {
      inDegree[next]--;
      if (inDegree[next] === 1) {
        zeroInDegreeQueue[right++] = next;
      }

      if (!found) {
        values[next] += values[first];
      }
    });
  }

  return count;
}

/*
https://leetcode.com/problems/minimum-cost-to-make-at-least-one-valid-path-in-a-grid/description/
1368. Minimum Cost to Make at Least One Valid Path in a Grid
Given an m x n grid. Each cell of the grid has a sign pointing to the next cell you should visit if you are currently in this cell. The sign of grid[i][j] can be:

	1 which means go to the cell to the right. (i.e go from grid[i][j] to grid[i][j + 1])
	2 which means go to the cell to the left. (i.e go from grid[i][j] to grid[i][j - 1])
	3 which means go to the lower cell. (i.e go from grid[i][j] to grid[i + 1][j])
	4 which means go to the upper cell. (i.e go from grid[i][j] to grid[i - 1][j])

Notice that there could be some signs on the cells of the grid that point outside the grid.

You will initially start at the upper left cell (0, 0). A valid path in the grid is a path that starts from the upper left cell (0, 0) and ends at the bottom-right cell (m - 1, n - 1) following the signs on the grid. The valid path does not have to be the shortest.

You can modify the sign on a cell with cost = 1. You can modify the sign on a cell one time only.

Return the minimum cost to make the grid have at least one valid path.

Example 1:

Input: grid = [[1,1,1,1],[2,2,2,2],[1,1,1,1],[2,2,2,2]]
Output: 3
Explanation: You will start at point (0, 0).
The path to (3, 3) is as follows. (0, 0) --> (0, 1) --> (0, 2) --> (0, 3) change the arrow to down with cost = 1 --> (1, 3) --> (1, 2) --> (1, 1) --> (1, 0) change the arrow to down with cost = 1 --> (2, 0) --> (2, 1) --> (2, 2) --> (2, 3) change the arrow to down with cost = 1 --> (3, 3)
The total cost = 3.

Example 2:

Input: grid = [[1,1,3],[3,2,2],[1,1,4]]
Output: 0
Explanation: You can follow the path from (0, 0) to (2, 2).

Example 3:

Input: grid = [[1,2],[4,3]]
Output: 1

Constraints:

	m == grid.length
	n == grid[i].length
	1 <= m, n <= 100
	1 <= grid[i][j] <= 4
*/
export function minCost(grid: number[][]): number {
  const m = grid.length;
  const n = grid[0].length;

  const distances: number[][] = Array.from({ length: m }, () => Array(n));
  const visited: boolean[][] = Array.from({ length: m }, () =>
    Array(n).fill(false)
  );
  const minHeap = new GenericHeap<[i: number, j: number, distance: number]>(
    (a, b) => a[2] - b[2]
  );

  distances[0][0] = 0;
  minHeap.push([0, 0, 0]);

  const moves: number[][] = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];

  while (minHeap.size() > 0) {
    const [i, j, prevDistance] = minHeap.pop();
    if (visited[i][j]) {
      continue;
    }
    visited[i][j] = true;

    for (let k = 0; k < moves.length; k++) {
      const nextI = i + moves[k][0];
      const nextJ = j + moves[k][1];

      if (
        nextI >= 0 &&
        nextI < m &&
        nextJ >= 0 &&
        nextJ < n &&
        !visited[nextI][nextJ] &&
        (distances[nextI][nextJ] === undefined ||
          prevDistance + (grid[i][j] !== k + 1 ? 1 : 0) <
            distances[nextI][nextJ])
      ) {
        distances[nextI][nextJ] = prevDistance + (grid[i][j] !== k + 1 ? 1 : 0);
        minHeap.push([nextI, nextJ, distances[nextI][nextJ]]);
      }
    }
  }

  return distances[m - 1][n - 1];
}

/*
https://leetcode.com/problems/find-eventual-safe-states/description/
802. Find Eventual Safe States
There is a directed graph of n nodes with each node labeled from 0 to n - 1. The graph is represented by a 0-indexed 2D integer array graph where graph[i] is an integer array of nodes adjacent to node i, meaning there is an edge from node i to each node in graph[i].

A node is a terminal node if there are no outgoing edges. A node is a safe node if every possible path starting from that node leads to a terminal node (or another safe node).

Return an array containing all the safe nodes of the graph. The answer should be sorted in ascending order.

Example 1:

Input: graph = [[1,2],[2,3],[5],[0],[5],[],[]]
Output: [2,4,5,6]
Explanation: The given graph is shown above.
Nodes 5 and 6 are terminal nodes as there are no outgoing edges from either of them.
Every path starting at nodes 2, 4, 5, and 6 all lead to either node 5 or 6.

Example 2:

Input: graph = [[1,2,3,4],[1,2],[3,4],[0,4],[]]
Output: [4]
Explanation:
Only node 4 is a terminal node, and every path starting at node 4 leads to node 4.

Constraints:

	n == graph.length
	1 <= n <= 10^4
	0 <= graph[i].length <= n
	0 <= graph[i][j] <= n - 1
	graph[i] is sorted in a strictly increasing order.
	The graph may contain self-loops.
	The number of edges in the graph will be in the range [1, 4 * 10^4].
*/
export function eventualSafeNodes(graph: number[][]): number[] {
  const n = graph.length;
  const tables: number[][] = Array.from({ length: n }, () => []);
  const inDegree: number[] = Array(n).fill(0);
  graph.forEach((neighbors, i) => {
    //  built the reverse graph since we want to find safe nodes from the terminal nodes
    neighbors.forEach((neighbor) => {
      tables[neighbor].push(i);
      inDegree[i]++;
    });
  });

  const zeroInDegreeQueue: number[] = Array(n);
  let left = 0;
  let right = 0;
  inDegree.forEach((v, i) => {
    if (v === 0) {
      zeroInDegreeQueue[right++] = i;
    }
  });

  const result: number[] = [];
  while (left < right) {
    const first = zeroInDegreeQueue[left++];

    result.push(first);

    tables[first].forEach((next) => {
      inDegree[next]--;
      if (inDegree[next] === 0) {
        zeroInDegreeQueue[right++] = next;
      }
    });
  }

  return result.sort((a, b) => a - b);
}

/*
https://leetcode.com/problems/course-schedule-iv/description/
1462. Course Schedule IV
There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates that you must take course ai first if you want to take course bi.

	For example, the pair [0, 1] indicates that you have to take course 0 before you can take course 1.

Prerequisites can also be indirect. If course a is a prerequisite of course b, and course b is a prerequisite of course c, then course a is a prerequisite of course c.

You are also given an array queries where queries[j] = [uj, vj]. For the jth query, you should answer whether course uj is a prerequisite of course vj or not.

Return a boolean array answer, where answer[j] is the answer to the jth query.

Example 1:

Input: numCourses = 2, prerequisites = [[1,0]], queries = [[0,1],[1,0]]
Output: [false,true]
Explanation: The pair [1, 0] indicates that you have to take course 1 before you can take course 0.
Course 0 is not a prerequisite of course 1, but the opposite is true.

Example 2:

Input: numCourses = 2, prerequisites = [], queries = [[1,0],[0,1]]
Output: [false,false]
Explanation: There are no prerequisites, and each course is independent.

Example 3:

Input: numCourses = 3, prerequisites = [[1,2],[1,0],[2,0]], queries = [[1,0],[1,2]]
Output: [true,true]

Constraints:

	2 <= numCourses <= 100
	0 <= prerequisites.length <= (numCourses * (numCourses - 1) / 2)
	prerequisites[i].length == 2
	0 <= ai, bi <= numCourses - 1
	ai != bi
	All the pairs [ai, bi] are unique.
	The prerequisites graph has no cycles.
	1 <= queries.length <= 10^4
	0 <= ui, vi <= numCourses - 1
	ui != vi
*/
export function checkIfPrerequisite(
  numCourses: number,
  prerequisites: number[][],
  queries: number[][]
): boolean[] {
  const tables: number[][] = Array.from({ length: numCourses }, () => []);
  prerequisites.forEach(([from, to]) => {
    tables[from].push(to);
  });
  const isReachable = Array.from({ length: numCourses }, () =>
    Array(numCourses).fill(false)
  );

  const bfs = (i: number) => {
    const visited: boolean[] = Array(numCourses).fill(false);
    const queue: number[] = Array(numCourses);
    let left = 0;
    let right = 0;
    queue[right++] = i;

    while (left < right) {
      const first = queue[left++];
      visited[first] = true;

      tables[first].forEach((next) => {
        if (!visited[next]) {
          visited[next] = true;
          queue[right++] = next;
          isReachable[i][next] = true;
        }
      });
    }
  };
  for (let i = 0; i < numCourses; i++) {
    bfs(i);
  }

  return queries.map(([from, to]) => isReachable[from][to]);
}

/*
https://leetcode.com/problems/minimum-cost-walk-in-weighted-graph/description/?envType=daily-question&envId=2025-03-20
3108. Minimum Cost Walk in Weighted Graph
There is an undirected weighted graph with n vertices labeled from 0 to n - 1.

You are given the integer n and an array edges, where edges[i] = [ui, vi, wi] indicates that there is an edge between vertices ui and vi with a weight of wi.

A walk on a graph is a sequence of vertices and edges. The walk starts and ends with a vertex, and each edge connects the vertex that comes before it and the vertex that comes after it. It's important to note that a walk may visit the same edge or vertex more than once.

The cost of a walk starting at node u and ending at node v is defined as the bitwise AND of the weights of the edges traversed during the walk. In other words, if the sequence of edge weights encountered during the walk is w0, w1, w2, ..., wk, then the cost is calculated as w0 & w1 & w2 & ... & wk, where & denotes the bitwise AND operator.

You are also given a 2D array query, where query[i] = [si, ti]. For each query, you need to find the minimum cost of the walk starting at vertex si and ending at vertex ti. If there exists no such walk, the answer is -1.

Return the array answer, where answer[i] denotes the minimum cost of a walk for query i.

Example 1:

Input: n = 5, edges = [[0,1,7],[1,3,7],[1,2,1]], query = [[0,3],[3,4]]

Output: [1,-1]

Explanation:

To achieve the cost of 1 in the first query, we need to move on the following edges: 0->1 (weight 7), 1->2 (weight 1), 2->1 (weight 1), 1->3 (weight 7).

In the second query, there is no walk between nodes 3 and 4, so the answer is -1.

Example 2:

Input: n = 3, edges = [[0,2,7],[0,1,15],[1,2,6],[1,2,1]], query = [[1,2]]

Output: [0]

Explanation:

To achieve the cost of 0 in the first query, we need to move on the following edges: 1->2 (weight 1), 2->1 (weight 6), 1->2 (weight 1).

Constraints:

	2 <= n <= 10^5
	0 <= edges.length <= 10^5
	edges[i].length == 3
	0 <= ui, vi <= n - 1
	ui != vi
	0 <= wi <= 10^5
	1 <= query.length <= 10^5
	query[i].length == 2
	0 <= si, ti <= n - 1
	si != ti
*/
class BitwiseUnionFind {
  private father: number[];
  public distances: number[];

  constructor(n: number) {
    this.father = Array(n);

    for (let i = 0; i < n; i++) {
      this.father[i] = i;
    }

    this.distances = Array(n).fill(-1);
  }

  public find(i: number) {
    if (i !== this.father[i]) {
      this.father[i] = this.find(this.father[i]);
    }

    return this.father[i];
  }

  public isSameSet(a: number, b: number) {
    return this.find(a) === this.find(b);
  }

  public union(a: number, b: number, weight: number) {
    const fa = this.find(a);
    const fb = this.find(b);
    if (fa !== fb) {
      this.father[fa] = fb;
    }

    this.distances[fb] &= weight & this.distances[fa];
    this.distances[fa] = this.distances[fb];
  }
}

export function minimumCost(
  n: number,
  edges: number[][],
  query: number[][]
): number[] {
  const unionFind = new BitwiseUnionFind(n);
  edges.forEach(([from, to, weight]) => {
    unionFind.union(from, to, weight);
  });

  return query.map(([from, to]) => {
    if (!unionFind.isSameSet(from, to)) {
      return -1;
    }
    return unionFind.distances[unionFind.find(from)];
  });
}

/*
https://leetcode.com/problems/find-all-possible-recipes-from-given-supplies/description/?envType=daily-question&envId=2025-03-21
2115. Find All Possible Recipes from Given Supplies
You have information about n different recipes. You are given a string array recipes and a 2D string array ingredients. The ith recipe has the name recipes[i], and you can create it if you have all the needed ingredients from ingredients[i]. A recipe can also be an ingredient for other recipes, i.e., ingredients[i] may contain a string that is in recipes.

You are also given a string array supplies containing all the ingredients that you initially have, and you have an infinite supply of all of them.

Return a list of all the recipes that you can create. You may return the answer in any order.

Note that two recipes may contain each other in their ingredients.

Example 1:

Input: recipes = ["bread"], ingredients = [["yeast","flour"]], supplies = ["yeast","flour","corn"]
Output: ["bread"]
Explanation:
We can create "bread" since we have the ingredients "yeast" and "flour".

Example 2:

Input: recipes = ["bread","sandwich"], ingredients = [["yeast","flour"],["bread","meat"]], supplies = ["yeast","flour","meat"]
Output: ["bread","sandwich"]
Explanation:
We can create "bread" since we have the ingredients "yeast" and "flour".
We can create "sandwich" since we have the ingredient "meat" and can create the ingredient "bread".

Example 3:

Input: recipes = ["bread","sandwich","burger"], ingredients = [["yeast","flour"],["bread","meat"],["sandwich","meat","bread"]], supplies = ["yeast","flour","meat"]
Output: ["bread","sandwich","burger"]
Explanation:
We can create "bread" since we have the ingredients "yeast" and "flour".
We can create "sandwich" since we have the ingredient "meat" and can create the ingredient "bread".
We can create "burger" since we have the ingredient "meat" and can create the ingredients "bread" and "sandwich".

Constraints:

	n == recipes.length == ingredients.length
	1 <= n <= 100
	1 <= ingredients[i].length, supplies.length <= 100
	1 <= recipes[i].length, ingredients[i][j].length, supplies[k].length <= 10
	recipes[i], ingredients[i][j], and supplies[k] consist only of lowercase English letters.
	All the values of recipes and supplies combined are unique.
	Each ingredients[i] does not contain any duplicate values.
*/
export function findAllRecipes(
  recipes: string[],
  ingredients: string[][],
  supplies: string[]
): string[] {
  const tables = new Map<string, string[]>();
  const inDegree = new Map<string, number>();
  const suppliesSet = new Set(supplies);
  ingredients.forEach((ingredient, i) => {
    const recipe = recipes[i];

    ingredient.forEach((item) => {
      if (!tables.has(item)) {
        tables.set(item, []);
      }
      tables.get(item)!.push(recipe);
      inDegree.set(recipe, (inDegree.get(recipe) || 0) + 1);
    });
  });

  const queue = Array(recipes.length * 3);
  let left = 0;
  let right = 0;
  supplies.forEach((s) => {
    if (tables.has(s)) {
      queue[right++] = s;
    }
  });

  const result: string[] = [];
  while (left < right) {
    const r = right;
    for (let i = left; i < r; i++) {
      const item = queue[left++];
      if (suppliesSet.has(item)) {
        tables.get(item)?.forEach((recipe) => {
          inDegree.set(recipe, (inDegree.get(recipe) || 0) - 1);
          if (inDegree.get(recipe) === 0) {
            queue[right++] = recipe;
            suppliesSet.add(recipe);
            result.push(recipe);
          }
        });
      }
    }

    if (r === right) {
      break;
    }
  }

  return result;
}
