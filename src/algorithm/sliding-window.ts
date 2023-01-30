/* 
滑动窗口的移动原则
左边界不超过右边界
左右边界都只能前进不能后退

适合用于解决窗口内的最大值和最小值问题

若要求最大值则双端队列严格保持从大到小
右边界移动时尝试更新双端队列（小于等于的元素全部出队列，因为这些元素再也不可能成为窗口最大值了）
左边界移动时若当前双端队列头部元素已过期（已经不属于窗口）则出队列
*/
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
