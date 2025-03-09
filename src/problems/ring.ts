/*
https://leetcode.com/problems/alternating-groups-ii/description/?envType=daily-question&envId=2025-03-09
3208. Alternating Groups II
There is a circle of red and blue tiles. You are given an array of integers colors and an integer k. The color of tile i is represented by colors[i]:

	colors[i] == 0 means that tile i is red.
	colors[i] == 1 means that tile i is blue.

An alternating group is every k contiguous tiles in the circle with alternating colors (each tile in the group except the first and last one has a different color from its left and right tiles).

Return the number of alternating groups.

Note that since colors represents a circle, the first and the last tiles are considered to be next to each other.

Example 1:

Input: colors = [0,1,0,1,0], k = 3

Output: 3

Explanation:

Alternating groups:

Example 2:

Input: colors = [0,1,0,0,1,0,1], k = 6

Output: 2

Explanation:

Alternating groups:

Example 3:

Input: colors = [1,1,0,1], k = 4

Output: 0

Explanation:

Constraints:

	3 <= colors.length <= 10^5
	0 <= colors[i] <= 1
	3 <= k <= colors.length
*/
export function numberOfAlternatingGroups(colors: number[], k: number): number {
  let repeatedTile = -1;
  for (let i = 0; i < colors.length; i++) {
    if (colors[i] === colors[(i + 1) % colors.length]) {
      repeatedTile = i;
      break;
    }
  }

  if (repeatedTile === -1) {
    return colors.length;
  }

  let alternatives = 1;
  let count = 0;
  for (let i = 0; i < colors.length; i++) {
    let start = (repeatedTile + i) % colors.length;
    let next = (start + 1) % colors.length;

    if (colors[start] !== colors[next]) {
      alternatives++;
    } else {
      alternatives = 1;
    }

    if (alternatives >= k) {
      count++;
    }
  }

  return count;
}

/*
https://leetcode.com/problems/find-the-losers-of-the-circular-game/description/
2682. Find the Losers of the Circular Game
There are n friends that are playing a game. The friends are sitting in a circle and are numbered from 1 to n in clockwise order. 
More formally, moving clockwise from the ith friend brings you to the (i+1)th friend for 1 <= i < n, and moving clockwise from 
the nth friend brings you to the 1st friend.

The rules of the game are as follows:

1st friend receives the ball.

	After that, 1st friend passes it to the friend who is k steps away from them in the clockwise direction.
	After that, the friend who receives the ball should pass it to the friend who is 2 * k steps away from them in the clockwise direction.
	After that, the friend who receives the ball should pass it to the friend who is 3 * k steps away from them in the clockwise direction, and so on and so forth.

In other words, on the ith turn, the friend holding the ball should pass it to the friend who is i * k steps away from them in the clockwise direction.

The game is finished when some friend receives the ball for the second time.

The losers of the game are friends who did not receive the ball in the entire game.

Given the number of friends, n, and an integer k, return the array answer, which contains the losers of the game in the ascending order.

Example 1:

Input: n = 5, k = 2
Output: [4,5]
Explanation: The game goes as follows:
1) Start at 1st friend and pass the ball to the friend who is 2 steps away from them - 3rd friend.
2) 3rd friend passes the ball to the friend who is 4 steps away from them - 2nd friend.
3) 2nd friend passes the ball to the friend who is 6 steps away from them  - 3rd friend.
4) The game ends as 3rd friend receives the ball for the second time.

Example 2:

Input: n = 4, k = 4
Output: [2,3,4]
Explanation: The game goes as follows:
1) Start at the 1st friend and pass the ball to the friend who is 4 steps away from them - 1st friend.
2) The game ends as 1st friend receives the ball for the second time.

Constraints:

	1 <= k <= n <= 50
*/
export function circularGameLosers(n: number, k: number): number[] {
  const visited = new Set<number>();
  visited.add(1);
  let cur = 1;
  let turns = 1;
  while (true) {
    let next = (cur + k * turns++) % n;
    if (next === 0) {
      next = n;
    }

    if (visited.has(next)) {
      break;
    }
    visited.add(next);
    cur = next;
  }

  const losers: number[] = [];
  for (let i = 1; i <= n; i++) {
    if (!visited.has(i)) {
      losers.push(i);
    }
  }

  return losers;
}
