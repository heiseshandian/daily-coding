import { cache } from '../design-pattern/proxy';
/* 
https://leetcode.com/problems/combination-sum-iii/

Find all valid combinations of k numbers that sum up to n such that the following conditions are true:

Only numbers 1 through 9 are used.
Each number is used at most once.
Return a list of all possible valid combinations. The list must not contain the same combination twice, 
and the combinations may be returned in any order.
*/
export function combinationSum3(k: number, n: number): number[][] {
    const result: number[][] = [];

    const backtracking = (startNum: number, restN: number, path: number[]) => {
        if (path.length === k && restN === 0) {
            result.push(path.slice());
            return;
        }
        if (path.length >= k) {
            return;
        }

        for (let i = startNum; i < 10; i++) {
            if (restN - i >= 0 && 10 - i >= k - path.length) {
                path.push(i);
                backtracking(i + 1, restN - i, path);
                path.pop();
            }
        }
    };
    backtracking(1, n, []);

    return result;
}

/* 
https://leetcode.com/problems/letter-combinations-of-a-phone-number/

Given a string containing digits from 2-9 inclusive, return all possible letter combinations that the number could represent. 
Return the answer in any order.

A mapping of digits to letters (just like on the telephone buttons) is given below. 
Note that 1 does not map to any letters.
*/
export function letterCombinations(digits: string): string[] {
    if (digits.length === 0) {
        return [];
    }

    const map: Record<string, string> = {
        2: 'abc',
        3: 'def',
        4: 'ghi',
        5: 'jkl',
        6: 'mno',
        7: 'pqrs',
        8: 'tuv',
        9: 'wxyz',
    };

    const result: string[] = [];
    const backtracking = (index: number, path: string) => {
        if (index === digits.length) {
            result.push(path);
            return;
        }

        const alphas = map[digits[index]];
        for (let i = 0; i < alphas.length; i++) {
            backtracking(index + 1, path + alphas[i]);
        }
    };
    backtracking(0, '');

    return result;
}

/* 
https://leetcode.com/problems/generate-parentheses/description/

Given n pairs of parentheses, write a function to generate all combinations of well-formed parentheses.
*/
export function generateParenthesis(n: number): string[] {
    const result: string[] = [];

    const backtracking = (
        leftCount: number,
        rightCount: number,
        path: string
    ) => {
        if (leftCount === n && rightCount === n) {
            result.push(path);
            return;
        }

        if (leftCount < n) {
            backtracking(leftCount + 1, rightCount, path + '(');
        }
        // 此处必须限制右括号的数量小于左括号的数量，否则新增加的右括号将无法被匹配
        if (rightCount < leftCount) {
            backtracking(leftCount, rightCount + 1, path + ')');
        }
    };
    backtracking(0, 0, '');

    return result;
}

/* 
https://leetcode.com/problems/sudoku-solver/

Write a program to solve a Sudoku puzzle by filling the empty cells.

A sudoku solution must satisfy all of the following rules:

Each of the digits 1-9 must occur exactly once in each row.
Each of the digits 1-9 must occur exactly once in each column.
Each of the digits 1-9 must occur exactly once in each of the 9 3x3 sub-boxes of the grid.
The '.' character indicates empty cells.
*/
export function solveSudoku(board: string[][]): void {
    // row[i][num] (i:0-8,num:1-9) row[0][9]=true 表示0行9这个数字已经出现过（也就是说第0行不能再放9了）
    const row: boolean[][] = new Array(9).fill(0).map((_) => new Array(10));
    // 某一列某个数字是否出现过
    const col: boolean[][] = new Array(9).fill(0).map((_) => new Array(10));
    // 某个桶里某个数字是否出现过
    const bucket: boolean[][] = new Array(9).fill(0).map((_) => new Array(10));
    initFlags(board, row, col, bucket);

    const backtracking = (i: number, j: number): boolean => {
        if (i === 9) {
            return true;
        }

        // j到8之后i需要换行，也就是加1
        const nexti = j < 8 ? i : i + 1;
        // j到8之后需要跳到下一行从0开始
        const nextj = j < 8 ? j + 1 : 0;

        // 如果当前位置是数字则直接跳到下一个位置
        if (board[i][j] !== '.') {
            return backtracking(nexti, nextj);
        }
        const bucketId = 3 * parseInt(`${i / 3}`) + parseInt(`${j / 3}`);
        // 否则从1-9开始尝试
        for (let num = 1; num <= 9; num++) {
            if (!row[i][num] && !col[j][num] && !bucket[bucketId][num]) {
                row[i][num] = true;
                col[j][num] = true;
                bucket[bucketId][num] = true;
                board[i][j] = `${num}`;

                // 后续可以成功直接返回
                if (backtracking(nexti, nextj)) {
                    return true;
                }

                // 恢复现场用下一个数字来尝试
                row[i][num] = false;
                col[j][num] = false;
                bucket[bucketId][num] = false;
                board[i][j] = '.';
            }
        }

        return false;
    };

    backtracking(0, 0);
}

function initFlags(
    board: string[][],
    row: boolean[][],
    col: boolean[][],
    bucket: boolean[][]
): void {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[0].length; j++) {
            const bucketId = 3 * parseInt(`${i / 3}`) + parseInt(`${j / 3}`);
            if (board[i][j] === '.') {
                continue;
            }

            const num = parseInt(board[i][j]);
            row[i][num] = true;
            col[j][num] = true;
            bucket[bucketId][num] = true;
        }
    }
}

/* 
https://leetcode.com/problems/subsets/

Given an integer array nums of unique elements, return all possible 
subsets (the power set).

The solution set must not contain duplicate subsets. Return the solution in any order.
*/
export function subsets(nums: number[]): number[][] {
    const result: number[][] = [];

    const backtracking = (index: number, path: number[]) => {
        result.push(path.slice());

        if (index === nums.length) {
            return;
        }

        for (let i = index; i < nums.length; i++) {
            path.push(nums[i]);
            backtracking(i + 1, path);
            path.pop();
        }
    };
    backtracking(0, []);

    return result;
}

/* 
https://leetcode.com/problems/subsets-ii/

Given an integer array nums that may contain duplicates, return all possible 
subsets (the power set).

The solution set must not contain duplicate subsets. Return the solution in any order.
*/
export function subsetsWithDup(nums: number[]): number[][] {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
    // 这里我们不在于实际顺序，只需要保证相同的数字在一起即可，而默认的sort算法会将item转化为字符串，然后根据UTF-16 code升序排列
    // 比如说 [4,17] => [17,4] 因为1的utf-16编码比4更小
    nums.sort();

    const result: number[][] = [];

    const backtracking = (index: number, path: number[]) => {
        result.push(path.slice());
        if (index >= nums.length) {
            return;
        }

        const set = new Set<number>();
        for (let i = index; i < nums.length; i++) {
            if (set.has(nums[i])) {
                continue;
            }
            set.add(nums[i]);

            path.push(nums[i]);
            // 这里是i+1，不是index+1，因为某个数字一旦选过后续只能选择i后面的数字，不能选择i前面的数字
            backtracking(i + 1, path);
            path.pop();
        }
    };
    backtracking(0, []);

    return result;
}

/* 
https://leetcode.com/problems/combinations/

Given two integers n and k, return all possible combinations 
of k numbers chosen from the range [1, n].

You may return the answer in any order.
*/
export function combine(n: number, k: number): number[][] {
    const result: number[][] = [];

    const backtracking = (index: number, path: number[]) => {
        if (path.length === k) {
            result.push(path.slice());
            return;
        }
        // 剩余数字不够k - path.length个，直接返回
        if (n - index + 1 < k - path.length) {
            return;
        }

        for (let i = index; i <= n; i++) {
            path.push(i);
            backtracking(i + 1, path);
            path.pop();
        }
    };
    backtracking(1, []);

    return result;
}

/* 
https://leetcode.com/problems/combination-sum/description/

Given an array of distinct integers candidates and a target integer target, return a list of all unique combinations 
of candidates where the chosen numbers sum to target. You may return the combinations in any order.

The same number may be chosen from candidates an unlimited number of times. Two combinations are unique if the 
frequency
 of at least one of the chosen numbers is different.

The test cases are generated such that the number of unique combinations that sum up to target is less than 150 combinations for the given input.
*/
export function combinationSum(
    candidates: number[],
    target: number
): number[][] {
    const result: number[][] = [];
    const backtracking = (index: number, path: number[], sum: number) => {
        if (sum === target) {
            result.push(path.slice());
            return;
        }
        if (index >= candidates.length) {
            return;
        }

        for (
            let k = 0;
            k <= Math.floor((target - sum) / candidates[index]);
            k++
        ) {
            path.push(...new Array(k).fill(candidates[index]));
            backtracking(index + 1, path, sum + k * candidates[index]);
            path.length -= k;
        }
    };
    backtracking(0, [], 0);

    return result;
}

/*
https://leetcode.com/problems/the-number-of-beautiful-subsets/description/
2597. The Number of Beautiful Subsets
You are given an array nums of positive integers and a positive integer k.

A subset of nums is beautiful if it does not contain two integers with an absolute difference equal to k.

Return the number of non-empty beautiful subsets of the array nums.

A subset of nums is an array that can be obtained by deleting some (possibly none) elements from nums. Two subsets are different if and only if the chosen indices to delete are different.

Example 1:

Input: nums = [2,4,6], k = 2
Output: 4
Explanation: The beautiful subsets of the array nums are: [2], [4], [6], [2, 6].
It can be proved that there are only 4 beautiful subsets in the array [2,4,6].

Example 2:

Input: nums = [1], k = 1
Output: 1
Explanation: The beautiful subset of the array nums is [1].
It can be proved that there is only 1 beautiful subset in the array [1].

Constraints:

	1 <= nums.length <= 20
	1 <= nums[i], k <= 1000

Hints
 - Sort the array nums and create another array cnt of size nums[i].
 - Use backtracking to generate all the beautiful subsets. If cnt[nums[i] - k] is positive, 
 then it is impossible to add nums[i] in the subset, and we just move to the next index. 
 Otherwise, it is also possible to add nums[i] in the subset, in this case, increase cnt[nums[i]], and move to the next index.
*/
export function beautifulSubsets(nums: number[], k: number): number {
    nums.sort((a, b) => a - b);

    let count = 0;
    const backtracking = (i: number, path: number[], countNums: number[]) => {
        if (i === nums.length) {
            if (path.length === 0) {
                return;
            }

            count++;
            return;
        }

        // 取当前数字
        if (!countNums[nums[i] - k]) {
            path.push(nums[i]);
            countNums[nums[i]] = (countNums[nums[i]] || 0) + 1;
            backtracking(i + 1, path, countNums);
            path.pop();
            countNums[nums[i]]--;
        }

        // 不取当前数字
        backtracking(i + 1, path, countNums);
    };
    backtracking(0, [], []);

    return count;
}

/*
https://leetcode.com/problems/maximum-strength-of-a-group/description/
2708. Maximum Strength of a Group
You are given a 0-indexed integer array nums representing the score of students in an exam. The teacher would like 
to form one non-empty group of students with maximal strength, where the strength of a group of students of indices i0, i1, i2, ... , 
ik is defined as nums[i0] * nums[i1] * nums[i2] * ... * nums[ik​].

Return the maximum strength of a group the teacher can create.

Example 1:

Input: nums = [3,-1,-5,2,5,-9]
Output: 1350
Explanation: One way to form a group of maximal strength is to group the students at indices [0,2,3,4,5]. 
Their strength is 3 * (-5) * 2 * 5 * (-9) = 1350, which we can show is optimal.

Example 2:

Input: nums = [-4,-5,-4]
Output: 20
Explanation: Group the students at indices [0, 1] . Then, we’ll have a resulting strength of 20. We cannot achieve greater strength.

Constraints:

	1 <= nums.length <= 13
	-9 <= nums[i] <= 9
*/
export function maxStrength(nums: number[]): number {
    let max = nums[0];

    const backtracking = cache((i: number, product: number | null) => {
        if (product === 0) {
            max = Math.max(max, 0);
            return;
        }
        if (i === nums.length) {
            if (product !== null) {
                max = Math.max(max, product);
            }
            return;
        }

        backtracking(i + 1, product === null ? nums[i] : product * nums[i]);
        backtracking(i + 1, product);
    });
    backtracking(0, null);

    return max;
}
