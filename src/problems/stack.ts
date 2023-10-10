/* 
https://leetcode.com/problems/basic-calculator-ii/description/
Given a string s which represents an expression, evaluate this expression and return its value. 

The integer division should truncate toward zero.

You may assume that the given expression is always valid. All intermediate results will be in the range of [-231, 231 - 1].

Note: You are not allowed to use any built-in function which evaluates strings as mathematical expressions, such as eval().

1 <= s.length <= 3 * 105
s consists of integers and operators ('+', '-', '*', '/') separated by some number of spaces.
*/
export function calculate(s: string): number {
    const stack: Array<string | number> = [];

    let i = 0;
    let cur = 0;
    while (i < s.length) {
        const char = s[i++];
        if (char === ' ') {
            continue;
        }

        if (char >= '0' && char <= '9') {
            cur = cur * 10 + Number(char);
        } else {
            addNumToStack(stack, cur);
            stack.push(char);
            cur = 0;
        }
    }
    // 最后的数字要加入stack中
    addNumToStack(stack, cur);

    return calculateStack(stack);
}

function addNumToStack(stack: Array<string | number>, cur: number) {
    if (stack.length === 0) {
        stack.push(cur);
        return;
    }

    // 加入数字之前先判断顶部操作符是否*/，是的话直接计算之后将结果放回stack，从而实现*/先于+-计算
    const peek = stack[stack.length - 1];
    if (peek === '*' || peek === '/') {
        const op = stack.pop() as string;
        const left = stack.pop() as number;
        stack.push(op === '*' ? left * cur : Math.trunc(left / cur));
    } else {
        stack.push(cur);
    }
}

function calculateStack(stack: Array<string | number>): number {
    let left = 0;
    let op = '+';
    let right: string | number = 0;

    let i = 0;
    while (i < stack.length) {
        right = stack[i++];
        if (op === '+') {
            left += Number(right);
        } else {
            left -= Number(right);
        }

        op = stack[i++] as string;
    }

    return left;
}

/*
https://leetcode.com/problems/remove-k-digits/description/

Given string num representing a non-negative integer num, and an integer k, 
return the smallest possible integer after removing k digits from num.
*/
export function removeKdigits(num: string, k: number): string {
    if (k >= num.length) {
        return '0';
    }

    // 递增（从高位到低位保持递增可以确保最后的数字是最小的）
    const stack: string[] = [];
    for (let i = 0; i < num.length; i++) {
        const current = num[i];

        while (k > 0 && stack.length > 0 && Number(stack[stack.length - 1]) > Number(current)) {
            stack.pop();
            k--;
        }
        stack.push(current);
    }

    while (k > 0) {
        stack.pop();
        k--;
    }

    return stack.length > 0 ? stack.join('').replace(/^0+(\d+)$/, '$1') : '0';
}
