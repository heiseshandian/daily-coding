import { UnionSet } from '../algorithm/union-set';
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

/*
https://leetcode.com/problems/find-n-unique-integers-sum-up-to-zero/
1304. Find N Unique Integers Sum up to Zero
Given an integer n, return any array containing n unique integers such that they add up to 0.

Example 1:

Input: n = 5
Output: [-7,-1,1,3,4]
Explanation: These arrays also are accepted [-5,-1,1,2,3] , [-3,-1,2,-2,4].

Example 2:

Input: n = 3
Output: [-1,0,1]

Example 3:

Input: n = 1
Output: [0]

Constraints:

	1 <= n <= 1000
*/
export function sumZero(n: number): number[] {
  const mid = n >> 1;
  const left = new Array(mid).fill(0).map((_, i) => -(i + 1));
  const right = left.map((v) => -v);

  if (n & 1) {
    return left.concat(0).concat(right);
  } else {
    return left.concat(right);
  }
}

export function sumZero2(n: number): number[] {
  const mid = n >> 1;
  const result: number[] = [];
  for (let i = 1; i <= mid; i++) {
    result.push(i, -i);
  }

  if (n & 1) {
    result.push(0);
  }

  return result;
}

/*
https://leetcode.com/problems/greatest-common-divisor-traversal/description/
2709. Greatest Common Divisor Traversal
You are given a 0-indexed integer array nums, and you are allowed to traverse between its indices. You can traverse between index i and index j, i != j, if and only if gcd(nums[i], nums[j]) > 1, where gcd is the greatest common divisor.

Your task is to determine if for every pair of indices i and j in nums, where i < j, there exists a sequence of traversals that can take us from i to j.

Return true if it is possible to traverse between all such pairs of indices, or false otherwise.

Example 1:

Input: nums = [2,3,6]
Output: true
Explanation: In this example, there are 3 possible pairs of indices: (0, 1), (0, 2), and (1, 2).
To go from index 0 to index 1, we can use the sequence of traversals 0 -> 2 -> 1, where we move from index 0 to index 2 because gcd(nums[0], nums[2]) = gcd(2, 6) = 2 > 1, and then move from index 2 to index 1 because gcd(nums[2], nums[1]) = gcd(6, 3) = 3 > 1.
To go from index 0 to index 2, we can just go directly because gcd(nums[0], nums[2]) = gcd(2, 6) = 2 > 1. Likewise, to go from index 1 to index 2, we can just go directly because gcd(nums[1], nums[2]) = gcd(3, 6) = 3 > 1.

Example 2:

Input: nums = [3,9,5]
Output: false
Explanation: No sequence of traversals can take us from index 0 to index 2 in this example. So, we return false.

Example 3:

Input: nums = [4,3,12,8]
Output: true
Explanation: There are 6 possible pairs of indices to traverse between: (0, 1), (0, 2), (0, 3), (1, 2), (1, 3), and (2, 3). A valid sequence of traversals exists for each pair, so we return true.

Constraints:

	1 <= nums.length <= 10^5
	1 <= nums[i] <= 10^5

Hints:
- Create a (prime) factor-numbers list for all the indices.
- Add an edge between the neighbors of the (prime) factor-numbers list. The order of the numbers doesn’t matter. 
We only need edges between 2 neighbors instead of edges for all pairs.
- The problem is now similar to checking if all the numbers (nodes of the graph) are in the same connected component.
- Any algorithm (i.e., BFS, DFS, or Union-Find Set) should work to find or check connected components
*/
export function canTraverseAllPairs(nums: number[]): boolean {
  if (nums.indexOf(1) !== nums.lastIndexOf(1)) {
    return false;
  }

  const deduped = Array.from(new Set(nums));
  const unionSet = new UnionSet();
  const factor2N: Record<number, number> = {};
  const updateFactor2N = (factor: number, n: number) => {
    if (factor2N[factor]) {
      unionSet.union(factor2N[factor], n);
    } else {
      factor2N[factor] = n;
    }
  };

  for (let i = 0; i < deduped.length; i++) {
    unionSet.addNode(deduped[i]);

    let n = deduped[i];
    while (n % 2 === 0) {
      updateFactor2N(2, deduped[i]);
      n >>= 1;
    }

    for (let k = 3; k * k <= n; k += 2) {
      while (n % k === 0) {
        updateFactor2N(k, deduped[i]);
        n /= k;
      }
    }

    if (n > 2) {
      updateFactor2N(n, deduped[i]);
    }
  }

  return unionSet.sizeMap.size === 1;
}

/*
https://leetcode.com/problems/count-largest-group/description/
1399. Count Largest Group
You are given an integer n.

Each number from 1 to n is grouped according to the sum of its digits.

Return the number of groups that have the largest size.

Example 1:

Input: n = 13
Output: 4
Explanation: There are 9 groups in total, they are grouped according sum of its digits of numbers from 1 to 13:
[1,10], [2,11], [3,12], [4,13], [5], [6], [7], [8], [9].
There are 4 groups with largest size.

Example 2:

Input: n = 2
Output: 2
Explanation: There are 2 groups [1], [2] of size 1.

Constraints:

	1 <= n <= 10^4
*/
export function countLargestGroup(n: number): number {
  const map: Record<number, number> = {};
  let max = -Infinity;
  while (n) {
    let cur = n--;
    let sum = 0;
    while (cur) {
      sum += cur % 10;
      cur = Math.floor(cur / 10);
    }

    map[sum] = (map[sum] || 0) + 1;
    max = Math.max(max, map[sum]);
  }

  return Object.values(map).filter((v) => v === max).length;
}

/*
https://leetcode.com/problems/water-bottles/description/
1518. Water Bottles
There are numBottles water bottles that are initially full of water. You can exchange numExchange empty water bottles from the market with one full water bottle.

The operation of drinking a full water bottle turns it into an empty bottle.

Given the two integers numBottles and numExchange, return the maximum number of water bottles you can drink.

Example 1:

Input: numBottles = 9, numExchange = 3
Output: 13
Explanation: You can exchange 3 empty bottles to get 1 full water bottle.
Number of water bottles you can drink: 9 + 3 + 1 = 13.

Example 2:

Input: numBottles = 15, numExchange = 4
Output: 19
Explanation: You can exchange 4 empty bottles to get 1 full water bottle. 
Number of water bottles you can drink: 15 + 3 + 1 = 19.

Constraints:

	1 <= numBottles <= 100
	2 <= numExchange <= 100
*/
export function numWaterBottles(
  numBottles: number,
  numExchange: number
): number {
  let count = numBottles;
  let prev = 0;
  while (numBottles >= numExchange) {
    const newBottles = Math.floor(numBottles / numExchange);
    prev = numBottles - newBottles * numExchange;
    count += newBottles;
    numBottles = newBottles + prev;
  }

  return count;
}

/*
https://leetcode.com/problems/lexicographical-numbers/description/
386. Lexicographical Numbers
Given an integer n, return all the numbers in the range [1, n] sorted in lexicographical order.

You must write an algorithm that runs in O(n) time and uses O(1) extra space. 

Example 1:
Input: n = 13
Output: [1,10,11,12,13,2,3,4,5,6,7,8,9]
Example 2:
Input: n = 2
Output: [1,2]

Constraints:

	1 <= n <= 10^4
*/
export function lexicalOrder(n: number): number[] {
  const result: number[] = [];

  const backtracking = (prev: number) => {
    if (prev > n) {
      return;
    }
    result.push(prev);

    prev *= 10;
    for (let i = prev === 0 ? 1 : 0; i < 10; i++) {
      backtracking(prev + i);
    }
  };
  backtracking(0);

  return result.slice(1);
}

/*
https://leetcode.com/problems/count-elements-with-maximum-frequency/description/
3005. Count Elements With Maximum Frequency
You are given an array nums consisting of positive integers.

Return the total frequencies of elements in nums such that those elements all have the maximum frequency.

The frequency of an element is the number of occurrences of that element in the array.

Example 1:

Input: nums = [1,2,2,3,1,4]
Output: 4
Explanation: The elements 1 and 2 have a frequency of 2 which is the maximum frequency in the array.
So the number of elements in the array with maximum frequency is 4.

Example 2:

Input: nums = [1,2,3,4,5]
Output: 5
Explanation: All elements of the array have a frequency of 1 which is the maximum.
So the number of elements in the array with maximum frequency is 5.

Constraints:

	1 <= nums.length <= 100
	1 <= nums[i] <= 100
*/
export function maxFrequencyElements(nums: number[]): number {
  const map: Record<number, number> = {};
  nums.forEach((v) => {
    map[v] = (map[v] || 0) + 1;
  });

  const repeatTimes = Object.values(map);
  const max = Math.max(...repeatTimes);

  return repeatTimes.reduce((acc, cur) => (cur === max ? acc + cur : acc), 0);
}

/*
https://leetcode.com/problems/valid-triangle-number/
611. Valid Triangle Number
Given an integer array nums, return the number of triplets chosen from the array that can make triangles if we take them as side lengths of a triangle.

Example 1:

Input: nums = [2,2,3,4]
Output: 3
Explanation: Valid combinations are: 
2,3,4 (using the first 2)
2,3,4 (using the second 2)
2,2,3

Example 2:

Input: nums = [4,2,3,4]
Output: 4

Constraints:

	1 <= nums.length <= 1000
	0 <= nums[i] <= 1000
*/
export function triangleNumber(nums: number[]): number {
  nums.sort((a, b) => b - a);

  let count = 0;
  for (let i = 0; i < nums.length - 2; i++) {
    let left = i + 1;
    let right = nums.length - 1;
    while (left < right) {
      if (nums[left] + nums[right] <= nums[i]) {
        right--;
      } else {
        count += right - left;
        left++;
      }
    }
  }

  return count;
}

/*
https://leetcode.com/problems/find-the-pivot-integer/description/?envType=daily-question&envId=2024-03-13
2485. Find the Pivot Integer
Given a positive integer n, find the pivot integer x such that:

	The sum of all elements between 1 and x inclusively equals the sum of all elements between x and n inclusively.

Return the pivot integer x. If no such integer exists, return -1. It is guaranteed that there will be at most one pivot index for the given input.

Example 1:

Input: n = 8
Output: 6
Explanation: 6 is the pivot integer since: 1 + 2 + 3 + 4 + 5 + 6 = 6 + 7 + 8 = 21.

Example 2:

Input: n = 1
Output: 1
Explanation: 1 is the pivot integer since: 1 = 1.

Example 3:

Input: n = 4
Output: -1
Explanation: It can be proved that no such integer exist.

Constraints:

	1 <= n <= 1000
*/
export function pivotInteger(n: number): number {
  const sqrt = Math.sqrt((n * n + n) / 2);
  return Number.isInteger(sqrt) ? sqrt : -1;
}
