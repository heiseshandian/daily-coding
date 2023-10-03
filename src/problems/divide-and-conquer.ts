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
export function diffWaysToCompute(expression: string): number[] {
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
