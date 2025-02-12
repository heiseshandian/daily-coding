// 打印二进制位
export function printBinary(n: number): string {
    let result: string[] = [];
    for (let i = 31; i >= 0; i--) {
        // n & 000...0001
        // n & 000...0010
        // n & 000...0100 与完之后的结果只有某一位不是1结果才是0，否则那一位必然是1
        result.push((n & (1 << i)) === 0 ? '0' : '1');
    }

    return result.join('');
}

export function isEven(n: number) {
    return (n & 1) === 0;
}

export function isOdd(n: number) {
    return (n & 1) === 1;
}

// 统计一个数字的二进制表示中有多少个1
export function countBits(n: number): number {
    let count = 0;
    while (n > 0) {
        n &= n - 1; // Flip the least significant 1 to 0
        count++;
    }

    return count;
}

/*
https://leetcode.com/problems/find-the-k-or-of-an-array/description/
2917. Find the K-or of an Array
You are given an integer array nums, and an integer k. Let's introduce K-or operation by extending the standard bitwise OR. 
In K-or, a bit position in the result is set to 1 if at least k numbers in nums have a 1 in that position.

Return the K-or of nums.

Example 1: 

Input: nums = [7,12,9,8,9,15], k = 4 

Output: 9 

Explanation: 

Represent numbers in binary:

NumberBit 3Bit 2Bit 1Bit 070111121100910018100091001151111Result = 91001

Bit 0 is set in 7, 9, 9, and 15. Bit 3 is set in 12, 9, 8, 9, and 15.
Only bits 0 and 3 qualify. The result is (1001)2 = 9.

Example 2: 

Input: nums = [2,12,1,11,4,5], k = 6 

Output: 0 

Explanation: No bit appears as 1 in all six array numbers, as required for K-or with k = 6. Thus, the result is 0.

Example 3: 

Input: nums = [10,8,5,9,11,6,8], k = 1 

Output: 15 

Explanation:  Since k == 1, the 1-or of the array is equal to the bitwise OR of all its elements. Hence, the answer is 10 OR 8 OR 5 OR 9 OR 11 OR 6 OR 8 = 15.

Constraints:

	1 <= nums.length <= 50
	0 <= nums[i] < 2^31
	1 <= k <= nums.length
*/
export function findKOr(nums: number[], k: number): number {
    const bits: number[] = Array(32).fill(0);
    let result = 0;
    for (let i = 0; i < 32; i++) {
        nums.forEach((v) => {
            bits[i] += (v >> i) & 1;
        });

        result += bits[i] >= k ? 1 << i : 0;
    }

    return result;
}

export function unsetRightMostBit(x: number) {
    return x & (x - 1);
}

export function setRightMostBit(x: number) {
    return x | (x + 1);
}

/*
https://leetcode.com/problems/max-sum-of-a-pair-with-equal-sum-of-digits/description/
2342. Max Sum of a Pair With Equal Sum of Digits
You are given a 0-indexed array nums consisting of positive integers. You can choose two indices i and j, such that i != j, and the sum of digits of the number nums[i] is equal to that of nums[j].

Return the maximum value of nums[i] + nums[j] that you can obtain over all possible indices i and j that satisfy the conditions.

Example 1:

Input: nums = [18,43,36,13,7]
Output: 54
Explanation: The pairs (i, j) that satisfy the conditions are:
- (0, 2), both numbers have a sum of digits equal to 9, and their sum is 18 + 36 = 54.
- (1, 4), both numbers have a sum of digits equal to 7, and their sum is 43 + 7 = 50.
So the maximum sum that we can obtain is 54.

Example 2:

Input: nums = [10,12,19,14]
Output: -1
Explanation: There are no two numbers that satisfy the conditions, so we return -1.

Constraints:

	1 <= nums.length <= 10^5
	1 <= nums[i] <= 10^9
*/
export function maximumSum(nums: number[]): number {
    const digits: Record<number, [first: number, second: number]> = {};
    nums.forEach((v) => {
        const sum = getDigitSum(v);

        if (digits[sum]) {
            const [first, second] = digits[sum];
            if (v >= first) {
                digits[sum] = [v, first];
            } else {
                digits[sum] = [first, Math.max(v, second)];
            }
        } else {
            digits[sum] = [v, 0];
        }
    });

    let max = -1;
    const values = Object.values(digits);
    for (const [first, second] of values) {
        if (second) {
            max = Math.max(max, first + second);
        }
    }

    return max;
}

function getDigitSum(v: number) {
    let sum = 0;
    while (v) {
        sum += v % 10;
        v /= 10;
        v |= 0;
    }

    return sum;
}
