import { GenericHeap } from '../algorithm/generic-heap';
/* 
https://leetcode.com/problems/find-median-from-data-stream/description/

The median is the middle value in an ordered integer list. If the size of the list is even, there is no middle value, 
and the median is the mean of the two middle values.

For example, for arr = [2,3,4], the median is 3.
For example, for arr = [2,3], the median is (2 + 3) / 2 = 2.5.
Implement the MedianFinder class:

MedianFinder() initializes the MedianFinder object.
void addNum(int num) adds the integer num from the data stream to the data structure.
double findMedian() returns the median of all elements so far. Answers within 10-5 of the actual answer will be accepted.

Input
["MedianFinder", "addNum", "addNum", "findMedian", "addNum", "findMedian"]
[[], [1], [2], [], [3], []]
Output
[null, null, null, 1.5, null, 2.0]
*/
export interface IMedianFinder {
    addNum: (num: number) => void;
    findMedian: () => number;
}

export class MedianFinder implements IMedianFinder {
    arr: number[] = [];

    addNum(num: number): void {
        if (this.arr.length === 0 || num < this.arr[0]) {
            this.arr.unshift(num);
            return;
        }

        let left = 0;
        let right = this.arr.length - 1;
        let closestMin = left;
        while (left <= right) {
            const mid = left + ((right - left) >> 1);
            if (this.arr[mid] === num) {
                closestMin = mid;
                break;
            }

            if (this.arr[mid] < num) {
                closestMin = mid;
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }

        const len = this.arr.length;
        for (let i = len; i >= closestMin + 1; i--) {
            this.arr[i] = this.arr[i - 1];
        }

        this.arr[closestMin + 1] = num;
    }

    findMedian(): number {
        const len = this.arr.length;
        if (len & 1) {
            return this.arr[len >> 1];
        } else {
            const mid = len >> 1;
            const left = mid - 1;

            return (this.arr[mid] + this.arr[left]) / 2;
        }
    }
}

/* 
将数组分成两部分，左半部分用大顶堆存储，右半部分用小顶堆存储
如果总的数据有奇数个则用右半部分多存储一个
*/
export class MedianFinder2 implements IMedianFinder {
    leftMaxHeap: GenericHeap = new GenericHeap((a, b) => b - a);
    rightMinHeap: GenericHeap = new GenericHeap();

    addNum(num: number) {
        if (this.rightMinHeap.size() === 0) {
            this.rightMinHeap.push(num);
            return;
        }
        if (this.leftMaxHeap.size() === 0) {
            // rightMin和num中较小者放入leftMaxHeap
            const rightMin = this.rightMinHeap.peek();
            if (num <= rightMin) {
                this.leftMaxHeap.push(num);
            } else {
                this.rightMinHeap.pop();
                this.rightMinHeap.push(num);
                this.leftMaxHeap.push(rightMin);
            }

            return;
        }

        const leftMax = this.leftMaxHeap.peek();
        const rightMin = this.rightMinHeap.peek();
        const len = this.leftMaxHeap.size() + this.rightMinHeap.size();

        if (len & 1) {
            // num 和 rightMin中较小的一个需要放进leftMaxHeap中
            if (num <= rightMin) {
                this.leftMaxHeap.push(num);
            } else {
                this.rightMinHeap.pop();
                this.rightMinHeap.push(num);
                this.leftMaxHeap.push(rightMin);
            }
        } else {
            // num和leftMax中较大的一个需要放进rightMinHeap中
            if (num >= leftMax) {
                this.rightMinHeap.push(num);
            } else {
                this.leftMaxHeap.pop();
                this.rightMinHeap.push(leftMax);
                this.leftMaxHeap.push(num);
            }
        }
    }

    findMedian(): number {
        const len = this.leftMaxHeap.size() + this.rightMinHeap.size();
        if (len & 1) {
            return this.rightMinHeap.peek();
        }

        return (this.leftMaxHeap.peek() + this.rightMinHeap.peek()) / 2;
    }
}
