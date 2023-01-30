export class MaxSlidingWindow {
    arr: number[];

    left = -1;
    right = -1;

    // 双端队列，严格从大到小
    doubleQueue: number[] = [];

    constructor(arr: number[]) {
        this.arr = arr;
    }

    public moveRight() {
        if (this.right + 1 >= this.arr.length) {
            return;
        }
        this.right++;

        while (this.doubleQueue.length !== 0) {
            const last = this.doubleQueue[this.doubleQueue.length - 1];
            if (this.arr[last] > this.arr[this.right]) {
                break;
            }
            this.doubleQueue.length--;
        }
        this.doubleQueue.push(this.right);
    }

    public moveLeft() {
        // 滑动窗口左边界不可以超过右边界
        if (this.left + 1 > this.right) {
            return;
        }
        this.left++;

        if (this.left >= this.doubleQueue[0]) {
            this.doubleQueue.shift();
        }
    }

    public getMax() {
        return this.arr[this.doubleQueue[0]];
    }
}
