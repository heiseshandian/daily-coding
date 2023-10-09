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

    const map: Record<string, string[]> = {
        2: 'abc'.split(''),
        3: 'def'.split(''),
        4: 'ghi'.split(''),
        5: 'jkl'.split(''),
        6: 'mno'.split(''),
        7: 'pqrs'.split(''),
        8: 'tuv'.split(''),
        9: 'wxyz'.split(''),
    };

    const result: string[] = [];
    const backtracking = (index: number, path: string[]) => {
        if (index === digits.length) {
            result.push(path.join(''));
            return;
        }

        const alphas = map[digits[index]];
        for (let i = 0; i < alphas.length; i++) {
            path.push(alphas[i]);
            backtracking(index + 1, path);
            path.pop();
        }
    };
    backtracking(0, []);

    return result;
}
