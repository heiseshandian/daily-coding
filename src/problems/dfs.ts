import { cache } from '../design-pattern/proxy';
/*
https://leetcode.com/problems/number-of-ways-to-reach-a-position-after-exactly-k-steps/description/
2400. Number of Ways to Reach a Position After Exactly k Steps
You are given two positive integers startPos and endPos. Initially, you are standing at position startPos on an infinite number line. With one step, you can move either one position to the left, or one position to the right.

Given a positive integer k, return the number of different ways to reach the position endPos starting from startPos, such that you perform exactly k steps. Since the answer may be very large, return it modulo 109 + 7.

Two ways are considered different if the order of the steps made is not exactly the same.

Note that the number line includes negative integers.

Example 1:

Input: startPos = 1, endPos = 2, k = 3
Output: 3
Explanation: We can reach position 2 from 1 in exactly 3 steps in three ways:
- 1 -> 2 -> 3 -> 2.
- 1 -> 2 -> 1 -> 2.
- 1 -> 0 -> 1 -> 2.
It can be proven that no other way is possible, so we return 3.

Example 2:

Input: startPos = 2, endPos = 5, k = 10
Output: 0
Explanation: It is impossible to reach position 5 from position 2 in exactly 10 steps.

Constraints:

	1 <= startPos, endPos, k <= 1000
*/
export function numberOfWays(
    startPos: number,
    endPos: number,
    k: number
): number {
    const mod = 1e9 + 7;
    const dfs = cache((distance: number, rest: number) => {
        if (rest === 0) {
            return distance === 0 ? 1 : 0;
        }

        if ((distance & 1) !== (rest & 1) || rest < distance) {
            return 0;
        }

        return (
            ((dfs(distance + 1, rest - 1) % mod) +
                (dfs(Math.abs(distance - 1), rest - 1) % mod)) %
            mod
        );
    });

    return dfs(Math.abs(endPos - startPos), k);
}
