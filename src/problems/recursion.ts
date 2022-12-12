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
