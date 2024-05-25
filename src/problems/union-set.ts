import { UnionFind } from '../algorithm/union-find';
import { UnionSet } from '../algorithm/union-set';
/*
https://leetcode.com/problems/minimum-score-of-a-path-between-two-cities/description/?envType=list&envId=mhgl61ev
2492. Minimum Score of a Path Between Two Cities
You are given a positive integer n representing n cities numbered from 1 to n. You are also given a 2D array roads where roads[i] = [ai, bi, distancei] indicates that there is a bidirectional 
road between cities ai and bi with a distance equal to distancei. The cities graph is not necessarily connected.

The score of a path between two cities is defined as the minimum distance of a road in this path.

Return the minimum possible score of a path between cities 1 and n.

Note:

	A path is a sequence of roads between two cities.
	It is allowed for a path to contain the same road multiple times, and you can visit cities 1 and n multiple times along the path.
	The test cases are generated such that there is at least one path between 1 and n.

Example 1:

Input: n = 4, roads = [[1,2,9],[2,3,6],[2,4,5],[1,4,7]]
Output: 5
Explanation: The path from city 1 to 4 with the minimum score is: 1 -> 2 -> 4. The score of this path is min(9,5) = 5.
It can be shown that no other path has less score.

Example 2:

Input: n = 4, roads = [[1,2,2],[1,3,4],[3,4,7]]
Output: 2
Explanation: The path from city 1 to 4 with the minimum score is: 1 -> 2 -> 1 -> 3 -> 4. The score of this path is min(2,2,4,7) = 2.

Constraints:

	2 <= n <= 10^5
	1 <= roads.length <= 10^5
	roads[i].length == 3
	1 <= ai, bi <= n
	ai != bi
	1 <= distancei <= 10^4
	There are no repeated edges.
	There is at least one path between 1 and n.
*/
export function minScore(n: number, roads: number[][]): number {
    const unionSet = new UnionSet(
        Array(n)
            .fill(0)
            .map((_, i) => i + 1)
    );

    roads.forEach(([a, b]) => {
        unionSet.union(a, b);
    });

    let minDistance = Infinity;
    roads.forEach(([a, , distance]) => {
        if (unionSet.isSameSet(1, a) && unionSet.isSameSet(n, a)) {
            minDistance = Math.min(minDistance, distance);
        }
    });

    return minDistance;
}

/*
https://leetcode.com/problems/most-stones-removed-with-same-row-or-column/description/
947. Most Stones Removed with Same Row or Column
On a 2D plane, we place n stones at some integer coordinate points. Each coordinate point may have at most one stone.

A stone can be removed if it shares either the same row or the same column as another stone that has not been removed.

Given an array stones of length n where stones[i] = [xi, yi] represents the location of the ith stone, return the largest possible number of stones that can be removed.

Example 1:

Input: stones = [[0,0],[0,1],[1,0],[1,2],[2,1],[2,2]]
Output: 5
Explanation: One way to remove 5 stones is as follows:
1. Remove stone [2,2] because it shares the same row as [2,1].
2. Remove stone [2,1] because it shares the same column as [0,1].
3. Remove stone [1,2] because it shares the same row as [1,0].
4. Remove stone [1,0] because it shares the same column as [0,0].
5. Remove stone [0,1] because it shares the same row as [0,0].
Stone [0,0] cannot be removed since it does not share a row/column with another stone still on the plane.

Example 2:

Input: stones = [[0,0],[0,2],[1,1],[2,0],[2,2]]
Output: 3
Explanation: One way to make 3 moves is as follows:
1. Remove stone [2,2] because it shares the same row as [2,0].
2. Remove stone [2,0] because it shares the same column as [0,0].
3. Remove stone [0,2] because it shares the same row as [0,0].
Stones [0,0] and [1,1] cannot be removed since they do not share a row/column with another stone still on the plane.

Example 3:

Input: stones = [[0,0]]
Output: 0
Explanation: [0,0] is the only stone on the plane, so you cannot remove it.

Constraints:

	1 <= stones.length <= 1000
	0 <= xi, yi <= 10^4
	No two stones are at the same coordinate point.
*/
export function removeStones(stones: number[][]): number {
    const unionFind = new UnionFind(stones.length);
    const rows = new Map<number, number>();
    const cols = new Map<number, number>();
    let sets = stones.length;

    stones.forEach(([x, y], i) => {
        if (rows.has(x) && !unionFind.isSameSet(rows.get(x)!, i)) {
            unionFind.union(rows.get(x)!, i);
            sets--;
        }
        if (cols.has(y) && !unionFind.isSameSet(cols.get(y)!, i)) {
            unionFind.union(cols.get(y)!, i);
            sets--;
        }

        if (!rows.has(x)) {
            rows.set(x, i);
        }
        if (!cols.has(y)) {
            cols.set(y, i);
        }
    });

    return stones.length - sets;
}
