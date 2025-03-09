import { SlidingWindow } from '../algorithm/sliding-window';
import { getClosestMaxOrEqual } from '../common/index';

/* 
https://leetcode.com/problems/constrained-subsequence-sum/

Given an integer array nums and an integer k, return the maximum sum of a non-empty 
subsequence of that array such that for every two consecutive integers in the subsequence, 
nums[i] and nums[j], where i < j, the condition j - i <= k is satisfied.

A subsequence of an array is obtained by deleting some number of elements (can be zero) from the array, 
leaving the remaining elements in their original order.
*/
export function constrainedSubsetSum(nums: number[], k: number): number {
  // dp[i] 以i为结尾的数组最大的非空子序列的和
  const dp: number[] = new Array(nums.length);
  dp[0] = nums[0];

  let max = dp[0];
  // 使用滑动窗口来加速求解窗口内最大值问题
  const s = new SlidingWindow(dp);
  for (let i = 1; i < nums.length; i++) {
    s.moveRight();
    if (i >= k + 1) {
      s.moveLeft();
    }

    dp[i] = nums[i] + Math.max(0, s.peek());
    max = Math.max(max, dp[i]);
  }

  return max;
}

/* 
https://leetcode.com/problems/repeated-dna-sequences/

The DNA sequence is composed of a series of nucleotides abbreviated as 'A', 'C', 'G', and 'T'.

For example, "ACGAATTCCG" is a DNA sequence.
When studying DNA, it is useful to identify repeated sequences within the DNA.

Given a string s that represents a DNA sequence, return all the 10-letter-long sequences (substrings) that occur more than once in a DNA molecule. 
You may return the answer in any order.

直接从前向后遍历即可，不用先遍历一遍拿到所有的tokens然后再遍历s对比token最后一次出现的下标是否比当前token更早
*/
export function findRepeatedDnaSequences(s: string): string[] {
  if (s.length < 11) {
    return [];
  }

  const dnaSeq = new Set<string>();
  const visited = new Set<string>();
  let start = 0;
  let end = 10;
  // 此处可以取到等于，因为slice不包含end处的字符，end-1是最后一个可以取到的字符
  while (end <= s.length) {
    const dna = s.slice(start, end);
    if (visited.has(dna)) {
      dnaSeq.add(dna);
    }
    visited.add(dna);
    start++;
    end++;
  }

  return Array.from(dnaSeq);
}

/* 
https://leetcode.com/problems/contains-duplicate-ii/

Given an integer array nums and an integer k, return true if there are two distinct 
indices i and j in the array such that nums[i] == nums[j] and abs(i - j) <= k.

Constraints:

1 <= nums.length <= 10^5
-109 <= nums[i] <= 10^9
0 <= k <= 10^5
*/
export function containsNearbyDuplicate(nums: number[], k: number): boolean {
  if (k === 0) {
    return false;
  }

  let left = -1;
  let right = -1;
  const set = new Set<number>();
  while (right < nums.length) {
    if (right - left === k + 1) {
      left++;
      set.delete(nums[left]);
    }

    right++;
    if (set.has(nums[right])) {
      return true;
    }
    set.add(nums[right]);
  }

  return false;
}

/* 
https://leetcode.com/problems/contains-duplicate-iii/

ou are given an integer array nums and two integers indexDiff and valueDiff.

Find a pair of indices (i, j) such that:

i != j,
abs(i - j) <= indexDiff.
abs(nums[i] - nums[j]) <= valueDiff, and
Return true if such pair exists or false otherwise.

Constraints:

2 <= nums.length <= 10^5
-10^9 <= nums[i] <= 10^9
1 <= indexDiff <= nums.length
0 <= valueDiff <= 10^9
*/
export function containsNearbyAlmostDuplicate(
  nums: number[],
  indexDiff: number,
  valueDiff: number
): boolean {
  const window = nums.slice(0, indexDiff + 1).sort((a, b) => a - b);
  for (let i = 1; i < window.length; i++) {
    if (window[i] - window[i - 1] <= valueDiff) {
      return true;
    }
  }

  let left = indexDiff;
  let right = indexDiff;
  while (right < nums.length) {
    // 删除已经出窗口的元素
    const toDelete = getClosestMaxOrEqual(
      window,
      nums[left - indexDiff],
      0,
      window.length - 1
    );
    window.splice(toDelete, 1);

    left++;
    right++;

    const closestMaxOrEqual = getClosestMaxOrEqual(
      window,
      nums[right],
      0,
      window.length - 1
    );
    if (
      (closestMaxOrEqual < window.length &&
        window[closestMaxOrEqual] - nums[right] <= valueDiff) ||
      (closestMaxOrEqual - 1 >= 0 &&
        nums[right] - window[closestMaxOrEqual - 1] <= valueDiff)
    ) {
      return true;
    }
    window.splice(closestMaxOrEqual, 0, nums[right]);
  }

  return false;
}

/*
https://leetcode.com/problems/grumpy-bookstore-owner/description/
1052. Grumpy Bookstore Owner
There is a bookstore owner that has a store open for n minutes. Every minute, some number of customers enter the store. You are given an integer array customers of length n where customers[i] is the number of the customer that enters the store at the start of the ith minute and all those customers leave after the end of that minute.

On some minutes, the bookstore owner is grumpy. You are given a binary array grumpy where grumpy[i] is 1 if the bookstore owner is grumpy during the ith minute, and is 0 otherwise.

When the bookstore owner is grumpy, the customers of that minute are not satisfied, otherwise, they are satisfied.

The bookstore owner knows a secret technique to keep themselves not grumpy for minutes consecutive minutes, but can only use it once.

Return the maximum number of customers that can be satisfied throughout the day.

Example 1:

Input: customers = [1,0,1,2,1,1,7,5], grumpy = [0,1,0,1,0,1,0,1], minutes = 3
Output: 16
Explanation: The bookstore owner keeps themselves not grumpy for the last 3 minutes. 
The maximum number of customers that can be satisfied = 1 + 1 + 1 + 1 + 7 + 5 = 16.

Example 2:

Input: customers = [1], grumpy = [0], minutes = 1
Output: 1

Constraints:

	n == customers.length == grumpy.length
	1 <= minutes <= n <= 10^4
	0 <= customers[i] <= 1000
	grumpy[i] is either 0 or 1.
*/
export function maxSatisfied(
  customers: number[],
  grumpy: number[],
  minutes: number
): number {
  const n = customers.length;

  let sum = 0;
  let max = 0;
  let minutesMax = 0;
  let i = 0;
  for (; i < minutes; i++) {
    minutesMax += grumpy[i] === 1 ? customers[i] : 0;
    sum += grumpy[i] === 0 ? customers[i] : 0;
  }
  max = minutesMax;

  for (; i < n; i++) {
    minutesMax -= grumpy[i - minutes] === 1 ? customers[i - minutes] : 0;
    minutesMax += grumpy[i] === 1 ? customers[i] : 0;
    sum += grumpy[i] === 0 ? customers[i] : 0;
    max = Math.max(max, minutesMax);
  }

  return sum + max;
}

/*
https://leetcode.com/problems/continuous-subarrays/description/
2762. Continuous Subarrays
You are given a 0-indexed integer array nums. A subarray of nums is called continuous if:

	Let i, i + 1, ..., j be the indices in the subarray. Then, for each pair of indices i <= i1, i2 <= j, 0 <= |nums[i1] - nums[i2]| <= 2.

Return the total number of continuous subarrays.

A subarray is a contiguous non-empty sequence of elements within an array.

Example 1:

Input: nums = [5,4,2,4]
Output: 8
Explanation: 
Continuous subarray of size 1: [5], [4], [2], [4].
Continuous subarray of size 2: [5,4], [4,2], [2,4].
Continuous subarray of size 3: [4,2,4].
Thereare no subarrys of size 4.
Total continuous subarrays = 4 + 3 + 1 = 8.
It can be shown that there are no more continuous subarrays.

Example 2:

Input: nums = [1,2,3]
Output: 6
Explanation: 
Continuous subarray of size 1: [1], [2], [3].
Continuous subarray of size 2: [1,2], [2,3].
Continuous subarray of size 3: [1,2,3].
Total continuous subarrays = 3 + 2 + 1 = 6.

Constraints:

	1 <= nums.length <= 10^5
	1 <= nums[i] <= 10^9
*/
export function continuousSubarrays(nums: number[]): number {
  const minQ: number[] = [];
  const maxQ: number[] = [];
  let sum = 0;

  let l = 0;
  let r = 0;
  while (r < nums.length) {
    while (minQ.length > 0 && nums[minQ[minQ.length - 1]] >= nums[r]) {
      minQ.pop();
    }
    while (maxQ.length > 0 && nums[maxQ[maxQ.length - 1]] <= nums[r]) {
      maxQ.pop();
    }

    minQ.push(r);
    maxQ.push(r);

    if (nums[maxQ[0]] - nums[minQ[0]] <= 2) {
      sum += r - l + 1;
      r++;
    } else {
      l++;

      if (minQ[0] < l) {
        minQ.shift();
      }
      if (maxQ[0] < l) {
        maxQ.shift();
      }
    }
  }

  return sum;
}

/*
https://leetcode.com/problems/minimum-recolors-to-get-k-consecutive-black-blocks/description/?envType=daily-question&envId=2025-03-08
2379. Minimum Recolors to Get K Consecutive Black Blocks
You are given a 0-indexed string blocks of length n, where blocks[i] is either 'W' or 'B', representing the color of the ith block. The characters 'W' and 'B' denote the colors white and black, respectively.

You are also given an integer k, which is the desired number of consecutive black blocks.

In one operation, you can recolor a white block such that it becomes a black block.

Return the minimum number of operations needed such that there is at least one occurrence of k consecutive black blocks.

Example 1:

Input: blocks = "WBBWWBBWBW", k = 7
Output: 3
Explanation:
One way to achieve 7 consecutive black blocks is to recolor the 0th, 3rd, and 4th blocks
so that blocks = "BBBBBBBWBW". 
It can be shown that there is no way to achieve 7 consecutive black blocks in less than 3 operations.
Therefore, we return 3.

Example 2:

Input: blocks = "WBWBBBW", k = 2
Output: 0
Explanation:
No changes need to be made, since 2 consecutive black blocks already exist.
Therefore, we return 0.

Constraints:

	n == blocks.length
	1 <= n <= 100
	blocks[i] is either 'W' or 'B'.
	1 <= k <= n
*/
export function minimumRecolors(blocks: string, k: number): number {
  let min = k;
  let left = 0;
  let right = 0;
  let wCount = 0;
  while (right < k) {
    if (blocks[right++] === 'W') {
      wCount++;
    }
  }
  min = wCount;

  while (right < blocks.length) {
    if (blocks[right++] === 'W') {
      wCount++;
    }
    if (blocks[left++] === 'W') {
      wCount--;
    }
    min = Math.min(min, wCount);
  }

  return min;
}

/*
https://leetcode.com/problems/sliding-window-maximum/description/
239. Sliding Window Maximum
You are given an array of integers nums, there is a sliding window of size k which is moving from the very left of the array to the very right. You can only see the k numbers in the window. Each time the sliding window moves right by one position.

Return the max sliding window.

Example 1:

Input: nums = [1,3,-1,-3,5,3,6,7], k = 3
Output: [3,3,5,5,6,7]
Explanation: 
Window position                Max
---------------               -----
[1  3  -1] -3  5  3  6  7       3
 1 [3  -1  -3] 5  3  6  7       3
 1  3 [-1  -3  5] 3  6  7       5
 1  3  -1 [-3  5  3] 6  7       5
 1  3  -1  -3 [5  3  6] 7       6
 1  3  -1  -3  5 [3  6  7]      7

Example 2:

Input: nums = [1], k = 1
Output: [1]

Constraints:

	1 <= nums.length <= 10^5
	-10^4 <= nums[i] <= 10^4
	1 <= k <= nums.length
*/
export function maxSlidingWindow(nums: number[], k: number): number[] {
  const queue: number[] = [];

  const addPositions = (p: number) => {
    while (queue.length > 0 && nums[queue[queue.length - 1]] <= nums[p]) {
      queue.pop();
    }

    queue.push(p);
  };

  let l = 0;
  let r = 0;
  while (r < k) {
    addPositions(r++);
  }

  const result = Array(nums.length - k + 1);
  let i = 0;
  result[i++] = nums[queue[0]];
  while (r < nums.length) {
    addPositions(r++);

    l++;
    if (queue[0] < l) {
      queue.shift();
    }

    result[i++] = nums[queue[0]];
  }

  return result;
}

/*
https://leetcode.com/problems/minimum-swaps-to-group-all-1s-together-ii/description/?envType=daily-question&envId=2024-08-02
2134. Minimum Swaps to Group All 1's Together II
A swap is defined as taking two distinct positions in an array and swapping the values in them.

A circular array is defined as an array where we consider the first element and the last element to be adjacent.

Given a binary circular array nums, return the minimum number of swaps required to group all 1's present in the array together at any location.

Example 1:

Input: nums = [0,1,0,1,1,0,0]
Output: 1
Explanation: Here are a few of the ways to group all the 1's together:
[0,0,1,1,1,0,0] using 1 swap.
[0,1,1,1,0,0,0] using 1 swap.
[1,1,0,0,0,0,1] using 2 swaps (using the circular property of the array).
There is no way to group all 1's together with 0 swaps.
Thus, the minimum number of swaps required is 1.

Example 2:

Input: nums = [0,1,1,1,0,0,1,1,0]
Output: 2
Explanation: Here are a few of the ways to group all the 1's together:
[1,1,1,0,0,0,0,1,1] using 2 swaps (using the circular property of the array).
[1,1,1,1,1,0,0,0,0] using 2 swaps.
There is no way to group all 1's together with 0 or 1 swaps.
Thus, the minimum number of swaps required is 2.

Example 3:

Input: nums = [1,1,0,0,1]
Output: 0
Explanation: All the 1's are already grouped together due to the circular property of the array.
Thus, the minimum number of swaps required is 0.

Constraints:

	1 <= nums.length <= 10^5
	nums[i] is either 0 or 1.

Hints:

Our end solution is to create a group of n contiguous ones, where n is the number of ones in the entire array. 
This means we wish to find a slice of the array of size n that has the most ones already contained within it.

Calculate the window size, which is the number of ones in the array. Calculate the number of ones in the first window, 
from 0 to the window size. Then simulate rotating the window through the circular array by removing the previous element 
and adding the next element. We then get the number of ones by subtracting the best window size found from the total number of ones.
*/
export function minSwaps(nums: number[]): number {
  const windowSize = nums.filter((n) => n === 1).length;
  let onesInWindow = nums
    .slice(0, windowSize)
    .reduce((acc, cur) => acc + cur, 0);
  let max = onesInWindow;
  for (let i = 1; i < nums.length; i++) {
    onesInWindow -= nums[i - 1];
    onesInWindow += nums[(i + windowSize - 1) % nums.length];
    max = Math.max(max, onesInWindow);
  }

  return windowSize - max;
}

/*
https://leetcode.com/problems/minimum-number-of-operations-to-make-array-continuous/?envType=daily-question&envId=2024-02-15
2009. Minimum Number of Operations to Make Array Continuous
You are given an integer array nums. In one operation, you can replace any element in nums with any integer.

nums is considered continuous if both of the following conditions are fulfilled:

    All elements in nums are unique.
    The difference between the maximum element and the minimum element in nums equals nums.length - 1.

For example, nums = [4, 2, 5, 3] is continuous, but nums = [1, 2, 3, 5, 6] is not continuous.

Return the minimum number of operations to make nums continuous.

Example 1:

Input: nums = [4,2,5,3]
Output: 0
Explanation: nums is already continuous.

Example 2:

Input: nums = [1,2,3,5,6]
Output: 1
Explanation: One possible solution is to change the last element to 4.
The resulting array is [1,2,3,5,4], which is continuous.

Example 3:

Input: nums = [1,10,100,1000]
Output: 3
Explanation: One possible solution is to:
- Change the second element to 2.
- Change the third element to 3.
- Change the fourth element to 4.
The resulting array is [1,2,3,4], which is continuous.

Constraints:

    1 <= nums.length <= 10^5
    1 <= nums[i] <= 10^9

Hint:
- Sort the array.
- For every index do a binary search to get the possible right end of the window and calculate the possible answer.
*/
export function minOperations(nums: number[]): number {
  nums.sort((a, b) => a - b);

  const dupes: number[] = [];
  let prev = nums[0];
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] === prev) {
      dupes.push(prev);
    } else {
      prev = nums[i];
    }
  }
  const getDupesLen = (leftTarget: number, rightTarget: number): number => {
    let left = 0;
    let right = dupes.length - 1;
    let l: number | null = null;
    while (left <= right) {
      const mid = left + ((right - left) >> 1);
      if (dupes[mid] >= leftTarget) {
        l = mid;
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    }
    if (l === null) {
      return 0;
    }

    left = 0;
    right = dupes.length - 1;
    let r: number | null = null;
    while (left <= right) {
      const mid = left + ((right - left) >> 1);
      if (dupes[mid] <= rightTarget) {
        r = mid;
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
    if (r === null) {
      return 0;
    }

    return r - l + 1;
  };

  let minOps = Infinity;
  for (let i = 0; i < nums.length; i++) {
    let left = 0;
    let right = nums.length - 1;
    let mostEnd = i;
    const target = nums[i] + nums.length - 1;
    while (left <= right) {
      const mid = left + ((right - left) >> 1);
      if (nums[mid] <= target) {
        mostEnd = mid;
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    minOps = Math.min(
      minOps,
      nums.length - (mostEnd - i + 1 - getDupesLen(nums[i], nums[mostEnd]))
    );
  }

  return minOps;
}
