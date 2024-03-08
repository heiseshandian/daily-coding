// 打印二进制位
export function printBinary(n: number): string {
    let result: string[] = [];
    for (let i = 31; i >= 0; i--) {
        // n & 000...0001
        // n & 000...0010
        // n & 000...0100 与完之后的结果只有某一位不是1结果才是0，否则那一位必然是1
        result.push((n & (1 << i)) === 0 ? '0' : '1');
    }

    return result.join('');
}

export function isEven(n: number) {
    return (n & 1) === 0;
}

export function isOdd(n: number) {
    return (n & 1) === 1;
}

// 统计一个数字的二进制表示中有多少个1
export function countBits(n: number): number {
    let bit = 0;
    while (n > 0) {
        if ((n & -n) !== 0) {
            bit++;
        }
        n -= n & -n;
    }

    return bit;
}
