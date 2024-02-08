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

/*
https://leetcode.com/problems/subtract-the-product-and-sum-of-digits-of-an-integer/description/
1281. Subtract the Product and Sum of Digits of an Integer
Given an integer number n, return the difference between the product of its digits and the sum of its digits.

Example 1:

Input: n = 234
Output: 15 
Explanation: 
Product of digits = 2 * 3 * 4 = 24 
Sum of digits = 2 + 3 + 4 = 9 
Result = 24 - 9 = 15

Example 2:

Input: n = 4421
Output: 21
Explanation: 
Product of digits = 4 * 4 * 2 * 1 = 32 
Sum of digits = 4 + 4 + 2 + 1 = 11 
Result = 32 - 11 = 21

Constraints:

	1 <= n <= 10^5
*/
export function subtractProductAndSum(n: number): number {
    const digits: number[] = [];
    while (n) {
        digits.push(n % 10);
        n = Math.floor(n / 10);
    }

    return (
        digits.reduce((acc, cur) => acc * cur, 1) -
        digits.reduce((acc, cur) => acc + cur)
    );
}
