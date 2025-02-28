import { cache } from '../design-pattern/proxy';
import { TreeNode } from '../algorithm/tree';
/* 
分治算法

1. 分解（Divide）：将原问题划分为多个相同或类似的子问题。
2. 解决（Conquer）：递归地解决每个子问题。如果子问题足够小，可以直接求解。
3. 合并（Combine）：将子问题的解合并起来，得到原问题的解。

分治算法的典型应用包括归并排序、快速排序、二分查找等。它通常能够将问题的规模从n降低到log(n)，
从而提高算法的效率。然而，分治算法的实现需要注意合并步骤的正确性和效率，以及递归的终止条件。
*/

/* 
https://leetcode.com/problems/different-ways-to-add-parentheses/description/

Given a string expression of numbers and operators, return all possible results from computing 
all the different possible ways to group numbers and operators. You may return the answer in any order.

The test cases are generated such that the output values fit in a 32-bit 
integer and the number of different results does not exceed 104.
*/
export function diffWaysToCompute(expression: string) {
  if (/^\d+$/.test(expression)) {
    return [+expression];
  }

  const result: number[] = [];

  // 根据最后算哪个符号来划分可能性
  for (let i = 0; i < expression.length; i++) {
    const char = expression[i];
    if (char === '+' || char === '-' || char === '*') {
      // 左右分解
      const left = diffWaysToCompute(expression.slice(0, i));
      const right = diffWaysToCompute(expression.slice(i + 1));

      // 合并
      for (const x of left) {
        for (const y of right) {
          if (char === '+') {
            result.push(x + y);
          } else if (char === '-') {
            result.push(x - y);
          } else {
            result.push(x * y);
          }
        }
      }
    }
  }

  return result;
}

/* 
https://leetcode.com/problems/unique-binary-search-trees-ii/

Given an integer n, return all the structurally unique BST's (binary search trees), 
which has exactly n nodes of unique values from 1 to n. Return the answer in any order.
*/
export function generateTrees(n: number) {
  if (n === 0) {
    return [];
  }

  return recursiveGenerateTrees(1, n);
}

const recursiveGenerateTrees = cache((start: number, end: number) => {
  let result: Array<TreeNode | null> = [];

  if (start > end) {
    result.push(null);
    return result;
  }

  // 根据谁为头结点来划分可能性
  for (let i = start; i <= end; i++) {
    // 左右分解
    let leftTrees = recursiveGenerateTrees(start, i - 1);
    let rightTrees = recursiveGenerateTrees(i + 1, end);

    // 合并
    leftTrees.forEach((left) => {
      rightTrees.forEach((right) => {
        result.push(new TreeNode(i, left, right));
      });
    });
  }

  return result;
});

/* 
https://leetcode.com/problems/partition-array-into-two-arrays-to-minimize-sum-difference/

You are given an integer array nums of 2 * n integers. You need to partition nums into two arrays of length n 
to minimize the absolute difference of the sums of the arrays. To partition nums, put each element of nums into one of the two arrays.

Return the minimum possible absolute difference.

Constraints:
- 1 <= n <= 15
- nums.length == 2 * n

https://www.bilibili.com/video/BV1Rh411J7Dd/?spm_id_from=333.337.search-card.all.click&vd_source=7b242528b70c1c6d4ee0ca3780b547a5
*/
export function minimumDifference(nums: number[]): number {
  const n = nums.length >> 1;
  const firstHalf = nums.slice(0, n);
  const secondHalf = nums.slice(n);

  const sum = nums.reduce((acc, cur) => acc + cur);
  const halfSum = sum / 2;

  const map: Record<number, number[]> = {};
  for (let i = 0; i <= n; i++) {
    map[i] = pickSums(secondHalf, i).sort((a, b) => a - b);
  }

  let minDiff = Infinity;
  for (let i = 0; i <= n; i++) {
    const sums = pickSums(firstHalf, i);

    for (const x of sums) {
      // 二分查找最接近的数字，大于，小于，或者等于
      const target = halfSum - x;
      const arr = map[n - i];
      let left = 0;
      let right = arr.length - 1;

      let closestMin = left;
      let closestMax = right;

      while (left <= right) {
        const mid = left + ((right - left) >> 1);
        if (arr[mid] === target) {
          return 0;
        }

        if (arr[mid] > target) {
          closestMax = mid;
          right = mid - 1;
        } else {
          closestMin = mid;
          left = mid + 1;
        }
      }

      minDiff = Math.min(
        minDiff,
        Math.abs(sum - (x + arr[closestMin]) * 2),
        Math.abs(sum - (x + arr[closestMax]) * 2)
      );
    }
  }

  return minDiff;
}

// 从数组中选择n个数，返回它们的和
function pickSums(arr: number[], n: number): number[] {
  const result = new Set<number>();

  const backtracking = (index: number, rest: number, sum: number) => {
    if (rest === 0) {
      result.add(sum);
      return;
    }

    for (let i = index; i < arr.length && arr.length - i >= rest; i++) {
      backtracking(i + 1, rest - 1, sum + arr[i]);
    }
  };
  backtracking(0, n, 0);

  return Array.from(result);
}

/* 
https://leetcode.com/problems/closest-subsequence-sum/

You are given an integer array nums and an integer goal.

You want to choose a subsequence of nums such that the sum of its elements is the closest possible to goal. 
That is, if the sum of the subsequence's elements is sum, then you want to minimize the absolute difference abs(sum - goal).

Return the minimum possible value of abs(sum - goal).

Note that a subsequence of an array is an array formed by removing some elements (possibly all or none) of the original array.

Constraints:
1 <= nums.length <= 40
-10^7 <= nums[i] <= 10^7
-10^9 <= goal <= 10^9

2^20大概是10^6级别，那么必然不可能直接从nums中暴力穷举（操作量级要小于10^9）
想着是不是可以一分为二，然后借助二分查找来优化时间复杂度
*/
export function minAbsDifference(nums: number[], goal: number): number {
  const half = nums.length >> 1;
  const sums1 = combinationSums(nums.slice(0, half));
  const sums2 = combinationSums(nums.slice(half)).sort((a, b) => a - b);

  let minDiff = Infinity;
  for (let i = 0; i < sums1.length; i++) {
    const target = goal - sums1[i];

    let left = 0;
    let right = sums2.length - 1;
    let closestMin = left;
    let closestMax = right;
    while (left <= right) {
      const mid = left + ((right - left) >> 1);
      if (sums2[mid] === target) {
        return 0;
      }

      if (sums2[mid] > target) {
        closestMax = mid;
        right = mid - 1;
      } else {
        closestMin = mid;
        left = mid + 1;
      }
    }

    minDiff = Math.min(
      minDiff,
      Math.abs(target - sums2[closestMin]),
      Math.abs(target - sums2[closestMax])
    );
  }

  return minDiff;
}

// 从nums中挑选任意多个数组并返回它们的和
function combinationSums(nums: number[]) {
  const result = new Set<number>();

  const backtracking = (index: number, sum: number) => {
    result.add(sum);
    if (index === nums.length) {
      return;
    }

    backtracking(index + 1, sum);
    backtracking(index + 1, sum + nums[index]);
  };
  backtracking(0, 0);

  return Array.from(result);
}

/* 
https://leetcode.com/problems/split-array-with-same-average/

ou are given an integer array nums.

You should move each element of nums into one of the two arrays A and B such that A and B are non-empty, and average(A) == average(B).

Return true if it is possible to achieve that and false otherwise.

Note that for an array arr, average(arr) is the sum of all the elements of arr over the length of arr.
*/
export function splitArraySameAverage(nums: number[]): boolean {
  const sum = nums.reduce((acc, cur) => acc + cur);
  const average = sum / nums.length;

  const half = nums.length >> 1;
  const firstHalf = nums.slice(0, half);
  const secondHalf = nums.slice(half);

  // 分成两部分，从左半部分中选择i个数字，从右半部分中选择j个数字
  for (let i = 0; i <= half; i++) {
    const sums1 = pickSums(firstHalf, i);
    for (let j = 0; j <= nums.length - half; j++) {
      const count = i + j;
      if (count === 0 || count === nums.length) {
        continue;
      }
      const sums2 = pickSums(secondHalf, j).sort((a, b) => a - b);

      for (let k = 0; k < sums1.length; k++) {
        let left = 0;
        let right = sums2.length - 1;
        while (left <= right) {
          const mid = left + ((right - left) >> 1);
          const cur = (sums2[mid] + sums1[k]) / count;
          if (cur === average) {
            return true;
          }

          if (cur > average) {
            right = mid - 1;
          } else {
            left = mid + 1;
          }
        }
      }
    }
  }

  return false;
}
