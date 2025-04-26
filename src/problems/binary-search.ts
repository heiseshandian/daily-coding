import { getClosestMaxOrEqual } from '../common';

/* 
https://leetcode.com/problems/sliding-window-median/

The median is the middle value in an ordered integer list. If the size of the list is even, 
there is no middle value. So the median is the mean of the two middle values.

For examples, if arr = [2,3,4], the median is 3.
For examples, if arr = [1,2,3,4], the median is (2 + 3) / 2 = 2.5.
You are given an integer array nums and an integer k. There is a sliding window of size k which is moving 
from the very left of the array to the very right. You can only see the k numbers in the window. 
Each time the sliding window moves right by one position.

Return the median array for each window in the original array. Answers within 10-5 of the actual value will be accepted.
*/
export function medianSlidingWindow(nums: number[], k: number): number[] {
  const window = nums.slice(0, k).sort((a, b) => a - b);
  const getMedian = () => {
    return (window[k >> 1] + window[(k - 1) >> 1]) / 2;
  };

  const result: number[] = [getMedian()];

  for (let i = k; i < nums.length; i++) {
    const toDelete = nums[i - k];
    if (toDelete === nums[i]) {
      result.push(getMedian());
      continue;
    }

    const toDeletePosition = getClosestMaxOrEqual(window, toDelete, 0, k - 1);
    window.splice(toDeletePosition, 1);

    const toInsertPosition = getClosestMaxOrEqual(window, nums[i], 0, k - 2);
    window.splice(toInsertPosition, 0, nums[i]);

    result.push(getMedian());
  }

  return result;
}

/* 
https://leetcode.com/problems/find-k-closest-elements/description/

Given a sorted integer array arr, two integers k and x, return the k closest integers to x in the array. 
The result should also be sorted in ascending order.

An integer a is closer to x than an integer b if:

|a - x| < |b - x|, or
|a - x| == |b - x| and a < b
*/
export function findClosestElements(
  arr: number[],
  k: number,
  x: number
): number[] {
  const result: number[] = [];
  const closestIndex = getClosestIndex(arr, x);
  result.push(arr[closestIndex]);
  k--;

  let left = closestIndex - 1;
  let right = closestIndex + 1;
  while (k--) {
    if (left < 0) {
      result.push(arr[right++]);
      continue;
    }
    if (right > arr.length - 1) {
      result.unshift(arr[left--]);
      continue;
    }

    if (Math.abs(arr[left] - x) <= Math.abs(arr[right] - x)) {
      result.unshift(arr[left--]);
    } else {
      result.push(arr[right++]);
    }
  }

  return result;
}

function getClosestIndex(arr: number[], x: number): number {
  let left = 0;
  let right = arr.length - 1;
  let closestIndex = 0;
  while (left <= right) {
    const mid = left + ((right - left) >> 1);
    if (arr[mid] === x) {
      return mid;
    }

    if (arr[mid] < x) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }

    if (Math.abs(arr[closestIndex] - x) > Math.abs(arr[mid] - x)) {
      closestIndex = mid;
    }
  }

  if (
    closestIndex > 0 &&
    Math.abs(arr[closestIndex] - x) === Math.abs(arr[closestIndex - 1] - x)
  ) {
    closestIndex--;
  }

  return closestIndex;
}

/*
https://leetcode.com/problems/arranging-coins/description/
441. Arranging Coins
You have n coins and you want to build a staircase with these coins. The staircase consists of k rows where the ith row has exactly i coins. The last row of the staircase may be incomplete.

Given the integer n, return the number of complete rows of the staircase you will build.

Example 1:

Input: n = 5
Output: 2
Explanation: Because the 3rd row is incomplete, we return 2.

Example 2:

Input: n = 8
Output: 3
Explanation: Because the 4th row is incomplete, we return 3.

Constraints:

	1 <= n <= 2^31 - 1
*/
export function arrangeCoins(n: number): number {
  let left = 1;
  let right = n;
  while (left <= right) {
    const mid = left + ((right - left) >> 1);
    const sum = ((1 + mid) * mid) / 2;
    if (sum <= n && sum + mid + 1 > n) {
      return mid;
    }

    if (sum <= n) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return -1;
}

/*
https://leetcode.com/problems/maximum-candies-allocated-to-k-children/description/?envType=daily-question&envId=2025-03-14
2226. Maximum Candies Allocated to K Children
You are given a 0-indexed integer array candies. Each element in the array denotes a pile of candies of size candies[i]. You can divide each pile into any number of sub piles, but you cannot merge two piles together.

You are also given an integer k. You should allocate piles of candies to k children such that each child gets the same number of candies. Each child can be allocated candies from only one pile of candies and some piles of candies may go unused.

Return the maximum number of candies each child can get.

Example 1:

Input: candies = [5,8,6], k = 3
Output: 5
Explanation: We can divide candies[1] into 2 piles of size 5 and 3, and candies[2] into 2 piles of size 5 and 1. We now have five piles of candies of sizes 5, 5, 3, 5, and 1. We can allocate the 3 piles of size 5 to 3 children. It can be proven that each child cannot receive more than 5 candies.

Example 2:

Input: candies = [2,5], k = 11
Output: 0
Explanation: There are 11 children but only 7 candies in total, so it is impossible to ensure each child receives at least one candy. Thus, each child gets no candy and the answer is 0.

Constraints:

	1 <= candies.length <= 10^5
	1 <= candies[i] <= 10^7
	1 <= k <= 10^12
*/
export function maximumCandies(candies: number[], k: number): number {
  let left = 1;
  let right = Math.max(...candies);
  while (left <= right) {
    const mid = left + ((right - left) >> 1);
    let count = 0;
    for (const pile of candies) {
      count += Math.floor(pile / mid);
    }
    if (count >= k) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return right;
}

/*
https://leetcode.com/problems/minimum-time-to-repair-cars/description/?envType=daily-question&envId=2025-03-16
2594. Minimum Time to Repair Cars
You are given an integer array ranks representing the ranks of some mechanics. ranksi is the rank of the ith mechanic. A mechanic with a rank r can repair n cars in r * n2 minutes.

You are also given an integer cars representing the total number of cars waiting in the garage to be repaired.

Return the minimum time taken to repair all the cars.

Note: All the mechanics can repair the cars simultaneously.

Example 1:

Input: ranks = [4,2,3,1], cars = 10
Output: 16
Explanation: 
- The first mechanic will repair two cars. The time required is 4 * 2 * 2 = 16 minutes.
- The second mechanic will repair two cars. The time required is 2 * 2 * 2 = 8 minutes.
- The third mechanic will repair two cars. The time required is 3 * 2 * 2 = 12 minutes.
- The fourth mechanic will repair four cars. The time required is 1 * 4 * 4 = 16 minutes.
It can be proved that the cars cannot be repaired in less than 16 minutes.​​​​​

Example 2:

Input: ranks = [5,1,8], cars = 6
Output: 16
Explanation: 
- The first mechanic will repair one car. The time required is 5 * 1 * 1 = 5 minutes.
- The second mechanic will repair four cars. The time required is 1 * 4 * 4 = 16 minutes.
- The third mechanic will repair one car. The time required is 8 * 1 * 1 = 8 minutes.
It can be proved that the cars cannot be repaired in less than 16 minutes.​​​​​

Constraints:

	1 <= ranks.length <= 10^5
	1 <= ranks[i] <= 100
	1 <= cars <= 10^6
*/
export function repairCars(ranks: number[], cars: number): number {
  const canRepairCarsWithinMinutes = (minutes: number) =>
    ranks.reduce((s, rank) => s + Math.floor(Math.sqrt(minutes / rank)), 0) >=
    cars;

  let left = 0;
  let right = Math.max(...ranks) * Math.pow(Math.ceil(cars / ranks.length), 2);
  let min = right;
  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);
    if (canRepairCarsWithinMinutes(mid)) {
      min = mid;
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }

  return min;
}

/*
https://leetcode.com/problems/longest-nice-subarray/description/?envType=daily-question&envId=2025-03-18
2401. Longest Nice Subarray
You are given an array nums consisting of positive integers.

We call a subarray of nums nice if the bitwise AND of every pair of elements that are in different positions in the subarray is equal to 0.

Return the length of the longest nice subarray.

A subarray is a contiguous part of an array.

Note that subarrays of length 1 are always considered nice.

Example 1:

Input: nums = [1,3,8,48,10]
Output: 3
Explanation: The longest nice subarray is [3,8,48]. This subarray satisfies the conditions:
- 3 AND 8 = 0.
- 3 AND 48 = 0.
- 8 AND 48 = 0.
It can be proven that no longer nice subarray can be obtained, so we return 3.

Example 2:

Input: nums = [3,1,5,11,13]
Output: 1
Explanation: The length of the longest nice subarray is 1. Any subarray of length 1 can be chosen.

Constraints:

	1 <= nums.length <= 10^5
	1 <= nums[i] <= 10^9
*/
export function longestNiceSubarray(nums: number[]): number {
  const isValid = (len: number) => {
    for (let i = 0; i < nums.length - len + 1; i++) {
      let found = true;

      let bitmask = 0;
      for (let j = i; j < i + len; j++) {
        if ((bitmask & nums[j]) !== 0) {
          found = false;
          break;
        }
        bitmask |= nums[j];
      }

      if (found) {
        return true;
      }
    }

    return false;
  };

  let left = 1;
  let right = 30;
  let closest = left;
  while (left <= right) {
    const mid = left + ((right - left) >> 1);
    if (isValid(mid)) {
      closest = mid;
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return closest;
}

export function longestNiceSubarray2(nums: number[]): number {
  let slidingWindow = 0;
  let left = 0;
  let longestSubArr = 0;

  for (let i = 0; i < nums.length; i++) {
    while ((slidingWindow & nums[i]) !== 0) {
      slidingWindow ^= nums[left++];
    }

    slidingWindow |= nums[i];
    longestSubArr = Math.max(longestSubArr, i - left + 1);
  }

  return longestSubArr;
}

/*
https://leetcode.com/problems/h-index-ii/description/?envType=problem-list-v2&envId=binary-search
275. H-Index II
Given an array of integers citations where citations[i] is the number of citations a researcher received for their ith paper and citations is sorted in non-descending order, return the researcher's h-index.

According to the definition of h-index on Wikipedia: The h-index is defined as the maximum value of h such that the given researcher has published at least h papers that have each been cited at least h times.

You must write an algorithm that runs in logarithmic time.

Example 1:

Input: citations = [0,1,3,5,6]
Output: 3
Explanation: [0,1,3,5,6] means the researcher has 5 papers in total and each of them had received 0, 1, 3, 5, 6 citations respectively.
Since the researcher has 3 papers with at least 3 citations each and the remaining two with no more than 3 citations each, their h-index is 3.

Example 2:

Input: citations = [1,2,100]
Output: 2

Constraints:

	n == citations.length
	1 <= n <= 10^5
	0 <= citations[i] <= 1000
	citations is sorted in ascending order.
*/
export function hIndex(citations: number[]): number {
  const getNumOfAtLeastKCitations = (k: number): number => {
    let left = 0;
    let right = citations.length - 1;
    let closest = citations.length;
    while (left <= right) {
      const mid = left + ((right - left) >> 1);
      if (citations[mid] >= k) {
        closest = mid;
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    }

    return citations.length - closest;
  };

  let left = 0;
  let right = citations.length - 1;
  while (left <= right) {
    const mid = left + ((right - left) >> 1);
    if (getNumOfAtLeastKCitations(mid + 1) >= mid + 1) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return left;
}
