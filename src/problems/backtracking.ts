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
