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

        while (
            k > 0 &&
            stack.length > 0 &&
            Number(stack[stack.length - 1]) > Number(current)
        ) {
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

/* 
https://leetcode.com/problems/remove-duplicate-letters/

Given a string s, remove duplicate letters so that every letter appears once and only once. 
You must make sure your result is the smallest in lexicographical order among all possible results.
*/
export function removeDuplicateLetters(s: string): string {
    const countMap: Record<string, number> = {};

    for (let i = 0; i < s.length; i++) {
        const char = s[i];
        if (countMap[char] === undefined) {
            countMap[char] = 0;
        }
        countMap[char]++;
    }

    // 严格递增（a,b,c...）
    const stack: string[] = [];
    const added: Record<string, boolean> = {};

    for (let i = 0; i < s.length; i++) {
        const char = s[i];
        countMap[char]--;

        if (added[char]) {
            continue;
        }

        // 此处要注意 countMap[stack[stack.length - 1]] > 0
        // 因为如果某个字符后面已经没有了那我们是不能将其删除掉的，只能直接留在栈顶
        while (
            stack.length > 0 &&
            stack[stack.length - 1] > char &&
            countMap[stack[stack.length - 1]] > 0
        ) {
            added[stack.pop()!] = false;
        }
        stack.push(char);
        added[char] = true;
    }

    return stack.join('');
}

/* 
https://leetcode.com/problems/create-maximum-number/

You are given two integer arrays nums1 and nums2 of lengths m and n respectively. 
nums1 and nums2 represent the digits of two numbers. You are also given an integer k.

Create the maximum number of length k <= m + n from digits of the two numbers. 
The relative order of the digits from the same array must be preserved.

Return an array of the k digits representing the answer.
*/
export function maxNumber(
    nums1: number[],
    nums2: number[],
    k: number
): number[] {
    let result: number[] = [];

    let start = Math.max(0, k - nums2.length);
    while (start <= nums1.length && start <= k) {
        const left = getMax(nums1, start);
        const right = getMax(nums2, k - start);
        const tmp = merge(left.join(''), right.join(''));

        if (result.join('') < tmp.join('')) {
            result = tmp;
        }
        start++;
    }

    return result;
}

function merge(nums1: string, nums2: string) {
    let i = 0;
    let j = 0;
    const result: number[] = [];

    while (i < nums1.length && j < nums2.length) {
        result.push(
            nums1.substring(i) > nums2.substring(j)
                ? Number(nums1[i++])
                : Number(nums2[j++])
        );
    }
    while (i < nums1.length) {
        result.push(+nums1[i++]);
    }
    while (j < nums2.length) {
        result.push(+nums2[j++]);
    }

    return result;
}

function getMax(nums: number[], k: number) {
    if (nums.length <= k) {
        return nums;
    }

    // 严格从大到小
    const stack: number[] = [];
    for (let i = 0; i < nums.length; i++) {
        const val = nums[i];
        while (
            stack.length > 0 &&
            stack[stack.length - 1] < val &&
            stack.length + nums.length - i - 1 >= k
        ) {
            stack.pop();
        }
        stack.push(val);
    }

    return stack.slice(0, k);
}

/*
https://leetcode.com/problems/valid-parentheses/description/
20. Valid Parentheses
Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:

	Open brackets must be closed by the same type of brackets.
	Open brackets must be closed in the correct order.
	Every close bracket has a corresponding open bracket of the same type.

Example 1:

Input: s = "()"
Output: true

Example 2:

Input: s = "()[]{}"
Output: true

Example 3:

Input: s = "(]"
Output: false

Constraints:

	1 <= s.length <= 10^4
	s consists of parentheses only '()[]{}'.
*/
export function isValid(s: string): boolean {
    const stack: string[] = [];
    const map = {
        '(': ')',
        '[': ']',
        '{': '}',
    };
    let i = 0;
    while (i < s.length) {
        if (map[s[i]]) {
            stack.push(s[i]);
        } else {
            const top = stack.pop()!;
            if (map[top] !== s[i]) {
                return false;
            }
        }

        i++;
    }

    return stack.length === 0;
}

/*
https://leetcode.com/problems/minimum-remove-to-make-valid-parentheses/description/
1249. Minimum Remove to Make Valid Parentheses
Given a string s of '(' , ')' and lowercase English characters.

Your task is to remove the minimum number of parentheses ( '(' or ')', in any positions ) so that the resulting parentheses string is valid and return any valid string.

Formally, a parentheses string is valid if and only if:

	It is the empty string, contains only lowercase characters, or
	It can be written as AB (A concatenated with B), where A and B are valid strings, or
	It can be written as (A), where A is a valid string.

Example 1:

Input: s = "lee(t(c)o)de)"
Output: "lee(t(c)o)de"
Explanation: "lee(t(co)de)" , "lee(t(c)ode)" would also be accepted.

Example 2:

Input: s = "a)b(c)d"
Output: "ab(c)d"

Example 3:

Input: s = "))(("
Output: ""
Explanation: An empty string is also valid.

Constraints:

	1 <= s.length <= 10^5
	s[i] is either'(' , ')', or lowercase English letter.
*/
export function minRemoveToMakeValid(s: string): string {
    const stack: number[] = [];
    let i = 0;
    while (i < s.length) {
        if (s[i] === '(') {
            stack.push(i);
        } else if (s[i] === ')') {
            if (stack.length > 0 && s[stack[stack.length - 1]] === '(') {
                stack.pop();
            } else {
                stack.push(i);
            }
        }

        i++;
    }

    return s
        .split('')
        .filter((_, i) => !stack.includes(i))
        .join('');
}

/**
 * 仅用递归实现一个堆栈的逆序
 */
export function reverseStack(stack: number[]) {
    if (stack.length === 0) {
        return;
    }

    const last = getAndRemoveLastElement(stack);
    reverseStack(stack);
    stack.push(last);
}

function getAndRemoveLastElement(stack: number[]) {
    if (stack.length === 1) {
        return stack.pop();
    }

    const num = stack.pop()!;
    const last = getAndRemoveLastElement(stack);
    stack.push(num);
    return last;
}

/**
 * 仅用递归实现一个栈的排序
 */
export function sortStack(stack: number[]) {
    let depth = getDepth(stack);
    while (depth) {
        const max = getMaxFromStack(stack, depth);
        const times = countRepeatTimes(stack, max, depth);
        down(stack, max, times, depth);
        depth -= times;
    }
}

function getDepth(stack: number[]) {
    if (stack.length === 0) {
        return 0;
    }

    const num = stack.pop()!;
    const d = getDepth(stack) + 1;
    stack.push(num);
    return d;
}

function getMaxFromStack(stack: number[], depth: number) {
    if (depth === 0) {
        return -Infinity;
    }

    const num = stack.pop()!;
    const m = Math.max(num, getMaxFromStack(stack, depth - 1));
    stack.push(num);
    return m;
}

function countRepeatTimes(stack: number[], repeatNum: number, depth: number) {
    if (depth === 0) {
        return 0;
    }

    const n = stack.pop()!;
    const count =
        countRepeatTimes(stack, repeatNum, depth - 1) +
        (n === repeatNum ? 1 : 0);
    stack.push(n);
    return count;
}

function down(stack: number[], max: number, k: number, depth: number) {
    if (depth === 0) {
        for (let i = 0; i < k; i++) {
            stack.push(max);
        }
        return;
    }

    const num = stack.pop()!;
    down(stack, max, k, depth - 1);
    if (num !== max) {
        stack.push(num);
    }
}

/*
https://leetcode.com/problems/maximum-width-ramp/description/
962. Maximum Width Ramp
A ramp in an integer array nums is a pair (i, j) for which i < j and nums[i] <= nums[j]. The width of such a ramp is j - i.

Given an integer array nums, return the maximum width of a ramp in nums. If there is no ramp in nums, return 0.

Example 1:

Input: nums = [6,0,8,2,1,5]
Output: 4
Explanation: The maximum width ramp is achieved at (i, j) = (1, 5): nums[1] = 0 and nums[5] = 5.

Example 2:

Input: nums = [9,8,1,0,1,9,4,0,4,1]
Output: 7
Explanation: The maximum width ramp is achieved at (i, j) = (2, 9): nums[2] = 1 and nums[9] = 1.

Constraints:

	2 <= nums.length <= 10^4
	0 <= nums[i] <= 10^4
*/
export function maxWidthRamp(nums: number[]): number {
    // 严格从大到小
    const stack: number[] = [0];
    nums.forEach((v, i) => {
        const prev = nums[stack[stack.length - 1]];
        if (v < prev) {
            stack.push(i);
        }
    });

    let max = 0;
    for (let i = nums.length - 1; i >= 0; ) {
        if (stack.length === 0) {
            break;
        }

        const prev = nums[stack[stack.length - 1]];
        if (prev <= nums[i]) {
            max = Math.max(max, i - stack[stack.length - 1]);
            stack.pop();
        } else {
            i--;
        }
    }

    return max;
}
