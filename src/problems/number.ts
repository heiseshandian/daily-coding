/*
https://leetcode.com/problems/sum-of-square-numbers/
633. Sum of Square Numbers
Given a non-negative integer c, decide whether there're two integers a and b such that a^2 + b^2 = c.

Example 1:

Input: c = 5
Output: true
Explanation: 1 * 1 + 2 * 2 = 5

Example 2:

Input: c = 3
Output: false

Constraints:

	0 <= c <= 2^31 - 1
*/
export function judgeSquareSum(c: number): boolean {
    // 0^2 + 0^2 = 0
    if (c === 0) {
        return true;
    }

    const sqrt = Math.floor(Math.sqrt(c));

    for (let i = sqrt; i >= 1; i--) {
        if (Number.isInteger(Math.sqrt(c - i * i))) {
            return true;
        }
    }

    return false;
}
