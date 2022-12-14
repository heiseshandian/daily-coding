import { swap } from '../common';

/* 
n层汉诺塔问题
 */
export function hanoi(n: number): string[] {
    const result: string[] = [];
    process(n, 'left', 'right', 'center', result);
    return result;
}

function process(n: number, from: string, to: string, center: string, path: string[]) {
    if (n === 1) {
        path.push(`1 ${from} > ${to}`);
        return;
    }

    process(n - 1, from, center, to, path);
    path.push(`${n} ${from} > ${to}`);
    process(n - 1, center, to, from, path);
}

/* 获取字符串的所有子序列 */
export function subsequence(str: string) {
    const result: string[] = [];
    process2(str, 0, result, '');
    return result;
}

function process2(str: string, index: number, result: string[], currentSubsequence: string) {
    if (index === str.length) {
        result.push(currentSubsequence);
        return;
    }

    process2(str, index + 1, result, currentSubsequence);
    process2(str, index + 1, result, currentSubsequence + str[index]);
}

/* 字符串的全排列问题 */
export function allPermutation(str: string) {
    const result: string[] = [];
    process3(str.split(''), 0, result);
    return result;
}

function process3(strArr: string[], i: number, result: string[]) {
    if (i === strArr.length - 1) {
        result.push(strArr.join(''));
        return;
    }
    for (let j = i; j < strArr.length; j++) {
        swap(strArr, i, j);
        process3(strArr, i + 1, result);
        swap(strArr, i, j);
    }
}

/* 过滤掉重复序列的全排列问题 */
export function allPermutation2(str: string) {
    const result: string[] = [];
    process4(str.split(''), 0, result);
    return result;
}

function process4(strArr: string[], i: number, result: string[]) {
    if (i === strArr.length - 1) {
        result.push(strArr.join(''));
        return;
    }

    const visited = new Map<string, boolean>();
    for (let j = i; j < strArr.length; j++) {
        if (visited.get(strArr[j])) {
            continue;
        }

        visited.set(strArr[j], true);
        swap(strArr, i, j);
        process3(strArr, i + 1, result);
        swap(strArr, i, j);
    }
}

export function bag(weights: number[], values: number[], targetWeight: number) {
    return process6(weights, values, targetWeight, 0);
}

function process6(weights: number[], values: number[], leftWeight: number, index: number): number {
    if (leftWeight < 0) {
        return -1;
    }
    if (index == weights.length) {
        return 0;
    }

    const val1 = process6(weights, values, leftWeight, index + 1);
    let val2 = process6(weights, values, leftWeight - weights[index], index + 1);
    if (val2 !== -1) {
        val2 += values[index];
    }
    return Math.max(val1, val2);
}
