/*
https://leetcode.com/problems/permutation-in-string/description/
567. Permutation in String
Given two strings s1 and s2, return true if s2 contains a permutation of s1, or false otherwise.

In other words, return true if one of s1's permutations is the substring of s2.

Example 1:

Input: s1 = "ab", s2 = "eidbaooo"
Output: true
Explanation: s2 contains one permutation of s1 ("ba").

Example 2:

Input: s1 = "ab", s2 = "eidboaoo"
Output: false

Constraints:

	1 <= s1.length, s2.length <= 10^4
	s1 and s2 consist of lowercase English letters.
*/
export function checkInclusion(s1: string, s2: string): boolean {
  const freqMap = {};
  for (const c of s1) {
    freqMap[c] = (freqMap[c] ?? 0) + 1;
  }

  let i = 0;
  for (; i < s1.length; i++) {
    if (freqMap[s2[i]] !== undefined) {
      freqMap[s2[i]]--;
    }
  }
  while (i <= s2.length) {
    if (Object.keys(freqMap).every((alpha) => freqMap[alpha] === 0)) {
      return true;
    }

    if (freqMap[s2[i - s1.length]] !== undefined) {
      freqMap[s2[i - s1.length]]++;
    }
    if (freqMap[s2[i]] !== undefined) {
      freqMap[s2[i]]--;
    }
    i++;
  }

  return false;
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
