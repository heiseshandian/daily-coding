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

/*
https://leetcode.com/problems/minimum-domino-rotations-for-equal-row/description/?envType=daily-question&envId=2025-05-03
1007. Minimum Domino Rotations For Equal Row
In a row of dominoes, tops[i] and bottoms[i] represent the top and bottom halves of the ith domino. (A domino is a tile with two numbers from 1 to 6 - one on each half of the tile.)

We may rotate the ith domino, so that tops[i] and bottoms[i] swap values.

Return the minimum number of rotations so that all the values in tops are the same, or all the values in bottoms are the same.

If it cannot be done, return -1.

Example 1:

Input: tops = [2,1,2,4,2,2], bottoms = [5,2,6,2,3,2]
Output: 2
Explanation: 
The first figure represents the dominoes as given by tops and bottoms: before we do any rotations.
If we rotate the second and fourth dominoes, we can make every value in the top row equal to 2, as indicated by the second figure.

Example 2:

Input: tops = [3,5,1,2,3], bottoms = [3,6,3,3,4]
Output: -1
Explanation: 
In this case, it is not possible to rotate the dominoes to make one row of values equal.

Constraints:

	2 <= tops.length <= 10^4
	bottoms.length == tops.length
	1 <= tops[i], bottoms[i] <= 6
*/
export function minDominoRotations(tops: number[], bottoms: number[]): number {
  const freqMap = new Map<number, number>();
  for (let i = 0; i < tops.length; i++) {
    const top = tops[i];
    const bottom = bottoms[i];
    freqMap.set(top, (freqMap.get(top) ?? 0) + 1);
    freqMap.set(bottom, (freqMap.get(bottom) ?? 0) + 1);
  }

  let max = 0;
  let maxValue = 0;
  freqMap.forEach((value, key) => {
    if (value > max) {
      max = value;
      maxValue = key;
    }
  });
  if (max < tops.length) {
    return -1;
  }

  let t = 0;
  let b = 0;
  for (let i = 0; i < tops.length; i++) {
    if (tops[i] !== maxValue && bottoms[i] !== maxValue) {
      return -1;
    }
    if (tops[i] !== maxValue) {
      t++;
    }
    if (bottoms[i] !== maxValue) {
      b++;
    }
  }

  return Math.min(t, b);
}
