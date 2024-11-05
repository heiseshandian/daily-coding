export class FenwickTree {
    bits: number[];
    n: number;

    constructor(n: number) {
        this.bits = Array(n + 1).fill(0);
        this.n = n;
    }

    // 更新位置 i 的值
    update(i: number, delta: number) {
        while (i <= this.n) {
            this.bits[i] += delta;
            i += i & -i;
        }
    }

    // 查询前缀和，从 1 到 i
    sum(i: number) {
        let s = 0;
        while (i > 0) {
            s += this.bits[i];
            i -= i & -i;
        }

        return s;
    }

    // 查询区间和 [l, r]
    rangeSum(l: number, r: number) {
        return this.sum(r) - this.sum(l - 1);
    }
}
