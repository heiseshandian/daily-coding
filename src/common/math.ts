import { gcd } from './index';
/**
 * Generates an array of prime numbers up to a given maximum value using the Sieve of Eratosthenes algorithm.
 *
 * @param max - The maximum value up to which prime numbers are to be generated.
 * @returns An array of prime numbers less than or equal to the given maximum value.
 */
export function sieveOfEratosthenes(max: number): number[] {
  // Initialize an empty array to store prime numbers
  const primes: number[] = [];
  // Create a boolean array "isPrime[0..max]" and initialize
  // all entries as true. A value in isPrime[i] will
  // finally be false if i is Not a prime, else true.
  const isPrime = new Array(max + 1).fill(true);

  // Iterate from 2 to the square root of max
  for (let p = 2; p * p <= max; p++) {
    // If isPrime[p] is not changed, then it is a prime
    if (isPrime[p]) {
      // Update all multiples of p
      for (let i = p * p; i <= max; i += p) {
        isPrime[i] = false;
      }
    }
  }

  // Collect all prime numbers
  for (let p = 2; p <= max; p++) {
    // If p is prime, add it to the primes array
    if (isPrime[p]) {
      primes.push(p);
    }
  }

  // Return the array of prime numbers
  return primes;
}

/*
https://leetcode.com/problems/minimum-number-of-operations-to-make-all-array-elements-equal-to-1/description/
2654. Minimum Number of Operations to Make All Array Elements Equal to 1
You are given a 0-indexed array nums consisiting of positive integers. You can do the following operation on the array any number of times:

	Select an index i such that 0 <= i < n - 1 and replace either of nums[i] or nums[i+1] with their gcd value.

Return the minimum number of operations to make all elements of nums equal to 1. If it is impossible, return -1.

The gcd of two integers is the greatest common divisor of the two integers.

Example 1:

Input: nums = [2,6,3,4]
Output: 4
Explanation: We can do the following operations:
- Choose index i = 2 and replace nums[2] with gcd(3,4) = 1. Now we have nums = [2,6,1,4].
- Choose index i = 1 and replace nums[1] with gcd(6,1) = 1. Now we have nums = [2,1,1,4].
- Choose index i = 0 and replace nums[0] with gcd(2,1) = 1. Now we have nums = [1,1,1,4].
- Choose index i = 2 and replace nums[3] with gcd(1,4) = 1. Now we have nums = [1,1,1,1].

Example 2:

Input: nums = [2,10,6,14]
Output: -1
Explanation: It can be shown that it is impossible to make all the elements equal to 1.

Constraints:

	2 <= nums.length <= 50
	1 <= nums[i] <= 10^6
*/
export function minOperations(nums: number[]): number {
  const n = nums.length;
  const onesCount = nums.filter((v) => v === 1).length;
  if (onesCount > 0) {
    return n - onesCount;
  }

  const min = minSubarrayGCD1(nums);
  if (min === -1) {
    return -1;
  }

  return min + (n - 1);
}

function minSubarrayGCD1(nums: number[]): number {
  const n = nums.length;
  let minLen = Infinity;

  for (let i = 0; i < n; i++) {
    let currGCD = nums[i];
    if (currGCD === 1) return 1;
    for (let j = i + 1; j < n; j++) {
      currGCD = gcd(currGCD, nums[j]);
      if (currGCD === 1) {
        minLen = Math.min(minLen, j - i + 1);
        break;
      }
    }
  }

  return minLen === Infinity ? -1 : minLen;
}
