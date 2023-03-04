/* 
滑动窗口的移动原则
左边界不超过右边界
左右边界都只能前进不能后退

适合用于解决窗口内的最大值和最小值问题

若要求最大值则双端队列严格保持从大到小
右边界移动时尝试更新双端队列（小于等于的元素全部出队列，因为这些元素再也不可能成为窗口最大值了）
左边界移动时若当前双端队列头部元素已过期（已经不属于窗口）则出队列
*/
type Comparator = (last: number, right: number) => number;

export class SlidingWindow {
    arr: number[];

    left = -1;
    right = -1;

    comparator: Comparator;

    // 双端队列（严格从小到大或者从大到小），默认从大到小，即窗口内最大值
    doubleQueue: number[] = [];

    constructor(arr: number[], comparator: Comparator = (last, right) => right - last) {
        this.arr = arr;
        this.comparator = comparator;
    }

    public moveRight() {
        this.right++;

        while (this.doubleQueue.length !== 0) {
            const last = this.doubleQueue[this.doubleQueue.length - 1];
            if (this.comparator(this.arr[last], this.arr[this.right]) < 0) {
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

    public peek() {
        return this.arr[this.doubleQueue[0]];
    }
}
