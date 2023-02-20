// 求一个数的n次方
export function pow(a: number, n: number): number {
    let result = 1;
    let t = a;
    while (n !== 0) {
        if ((n & 1) !== 0) {
            result *= t;
        }
        t *= t;
        n = n >>> 1;
    }

    return result;
}
