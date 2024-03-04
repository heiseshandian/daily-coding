// https://www.bilibili.com/video/BV1EW411d75F/?spm_id_from=333.337.search-card.all.click&vd_source=7b242528b70c1c6d4ee0ca3780b547a5
export class BITree {
    private biArr: number[];

    constructor(arr: number[]) {
        this.biArr = new Array(arr.length + 1).fill(0);

        arr.forEach((val, i) => {
            this.updateBIT(i, val);
        });
    }

    public updateBIT(i: number, val: number) {
        const n = this.biArr.length - 1;
        i += 1;

        while (i <= n) {
            this.biArr[i] += val;
            i += i & -i;
        }
    }

    public getSum(i: number) {
        let sum = 0;
        i += 1;

        while (i > 0) {
            sum += this.biArr[i];
            i -= i & -i;
        }

        return sum;
    }
}
