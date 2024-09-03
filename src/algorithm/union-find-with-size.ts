// Simplified version of union find
export class UnionFindWithSize {
    private father: number[];
    public size: number[];

    constructor(n: number) {
        this.father = Array(n);
        this.size = Array(n).fill(1);

        for (let i = 0; i < n; i++) {
            this.father[i] = i;
        }
    }

    public find(i: number) {
        if (i !== this.father[i]) {
            this.father[i] = this.find(this.father[i]);
        }

        return this.father[i];
    }

    public isSameSet(a: number, b: number) {
        return this.find(a) === this.find(b);
    }

    public union(a: number, b: number) {
        const fa = this.find(a);
        const fb = this.find(b);
        if (fa === fb) {
            return;
        }

        const sizeA = this.size[fa];
        const sizeB = this.size[fb];
        const big = sizeA >= sizeB ? fa : fb;
        const small = big === fa ? fb : fa;
        this.father[small] = big;
        this.size[small] = 0;
        this.size[big] = sizeA + sizeB;
    }
}
