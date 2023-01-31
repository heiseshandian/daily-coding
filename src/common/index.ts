export function times<T>(repeatTimes: number, fn: (args?: any) => T): T[] {
    return Array.from(Array(repeatTimes)).map(() => fn());
}

export function swap(arr: any[], a: number, b: number) {
    const temp = arr[a];
    arr[a] = arr[b];
    arr[b] = temp;
}

export function maxCommonFactor(a: number, b: number): number {
    if (a % b === 0) {
        return b;
    }

    return maxCommonFactor(b, a % b);
}

// 打印二进制位
export function printBinary(n: number): string {
    let result: string[] = [];
    for (let i = 0; i < 32; i++) {
        // n & 000...0001
        // n & 000...0010
        // n & 000...0100 与完之后的结果只有某一位不是1结果才是0，否则那一位必然是1
        result.push((n & (1 << i)) === 0 ? '0' : '1');
    }

    return result.reverse().join('');
}
