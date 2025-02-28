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
