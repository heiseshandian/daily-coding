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
