import { swap } from '../common/index';
/* 
https://leetcode.com/problems/the-skyline-problem/

A city's skyline is the outer contour of the silhouette formed by all the buildings 
in that city when viewed from a distance. Given the locations and heights of all 
the buildings, return the skyline formed by these buildings collectively.

The geometric information of each building is given in the array buildings where 
buildings[i] = [lefti, righti, heighti]:

lefti is the x coordinate of the left edge of the ith building.
righti is the x coordinate of the right edge of the ith building.
heighti is the height of the ith building.
You may assume all buildings are perfect rectangles grounded on an absolutely 
flat surface at height 0.

The skyline should be represented as a list of "key points" sorted by their 
x-coordinate in the form [[x1,y1],[x2,y2],...]. Each key point is the left 
endpoint of some horizontal segment in the skyline except the last point in the list, 
which always has a y-coordinate 0 and is used to mark the skyline's termination where 
the rightmost building ends. 
Any ground between the leftmost and rightmost buildings should be part of the skyline's contour.

Note: There must be no consecutive horizontal lines of equal height in the output skyline. 
For instance, [...,[2 3],[4 5],[7 5],[11 5],[12 7],...] is not acceptable; 
the three lines of height 5 should be merged into one in the final output 
as such: [...,[2 3],[4 5],[12 7],...]

Input: buildings = [[2,9,10],[3,7,15],[5,12,12],[15,20,10],[19,24,8]]
Output: [[2,10],[3,15],[7,12],[12,0],[15,10],[20,8],[24,0]]

思路分析

线性扫描法
1) 扫描到入点时取较高点
2）扫描到出点时取较低点
*/
export function getSkyline(buildings: number[][]): number[][] {
    if (buildings.length === 1) {
        const [l, r, h] = buildings[0];
        return [
            [l, h],
            [r, 0],
        ];
    }

    const events: ScanEvent[] = [];
    buildings.forEach(([l, r, h], i) => {
        // 用正数(h)来表示进入一个building
        events.push([l, h, i]);
        // 用负数(-h)来表示出一个building
        events.push([r, -h, i]);
    });

    events.sort(([x1, h1], [x2, h2]) => {
        /* 
        对于进入事件
        如果x相同我们需要按照高度从大到小排列，因为如果是从小到大的话可能会多加入一些点，比如说有2个进入事件
        [2,2],[2,3]
        按理来说结果里面应该只有[2,3]如果我们从小到大排列的话就会先处理到[2,2]
        2大于当前最大高度0，从而把[2,2]加入结果中，这是不对的

        对于出事件
        如果x相同我们需要按照高度从小到大排列，否则会多加，比如说有2个结束事件
        [2,-1],[2,-2]
        如果先处理[2,-2]，那么会加入[2,1]这个点，但这是不必要的，我们其实只需要加入[2,0]这个点

        又因为我们对出事件已经对高度取反了，所以对取反的结果从大到小排列即可
        */
        if (x1 === x2) {
            return h2 - h1;
        }
        // x是横坐标，从左到右扫描，自然x是从小到大排列
        return x1 - x2;
    });

    const heap = new MaxHeapWithDelete();

    const result: number[][] = [];
    for (let i = 0; i < events.length; i++) {
        let [x, h, id] = events[i];
        const isEntering = h > 0;
        h = Math.abs(h);

        if (isEntering) {
            if (h > heap.max()) {
                // 进入时取较高点
                result.push([x, h]);
            }
            heap.add([h, id]);
        } else {
            heap.remove(id);
            if (h > heap.max()) {
                // 出时取较低点
                result.push([x, heap.max()]);
            }
        }
    }

    return result;
}

type ScanEvent = [x: number, h: number, id: number];

type HeapItem = [h: number, id: number];

class MaxHeapWithDelete {
    arr: HeapItem[] = [];

    // key:id,value:index
    // 用于加速删除某个id
    idToIndexMap: Map<number, number> = new Map();

    public max(): number {
        if (this.arr.length > 0) {
            return this.arr[0][0];
        }
        return 0;
    }

    public add([h, id]: HeapItem) {
        this.arr.push([h, id]);
        this.idToIndexMap.set(id, this.arr.length - 1);

        this.insertHeap();
    }

    private insertHeap() {
        let i = this.arr.length - 1;
        let parent = (i - 1) >> 1;
        // 从下往上
        while (parent >= 0) {
            // 比父节点大就交换
            if (this.arr[i][0] > this.arr[parent][0]) {
                this.swap(i, parent);
                i = parent;
                parent = (i - 1) >> 1;
            } else {
                break;
            }
        }
    }

    public remove(id: number) {
        if (!this.idToIndexMap.has(id)) {
            return;
        }
        const toDeleteIndex = this.idToIndexMap.get(id)!;
        this.swap(toDeleteIndex, this.arr.length - 1);
        this.idToIndexMap.delete(id);

        this.arr.length--;
        this.heapify(toDeleteIndex);
    }

    private heapify(i: number) {
        let left = (i << 1) | 1;
        while (left < this.arr.length) {
            const right = left + 1;
            let biggestIndex =
                right < this.arr.length &&
                this.arr[right][0] > this.arr[left][0]
                    ? right
                    : left;
            biggestIndex =
                this.arr[i][0] >= this.arr[biggestIndex][0] ? i : biggestIndex;
            if (biggestIndex === i) {
                break;
            }

            this.swap(i, biggestIndex);
            i = biggestIndex;
            left = (i << 1) | 1;
        }
    }

    private swap(i: number, j: number) {
        this.idToIndexMap.set(this.arr[i][1], j);
        this.idToIndexMap.set(this.arr[j][1], i);

        swap(this.arr, i, j);
    }
}

/*
https://leetcode.com/problems/determine-if-a-cell-is-reachable-at-a-given-time/description/?envType=problem-list-v2&envId=o5cftq05
2849. Determine if a Cell Is Reachable at a Given Time
You are given four integers sx, sy, fx, fy, and a non-negative integer t.

In an infinite 2D grid, you start at the cell (sx, sy). Each second, you must move to any of its adjacent cells.

Return true if you can reach cell (fx, fy) after exactly t seconds, or false otherwise.

A cell's adjacent cells are the 8 cells around it that share at least one corner with it. You can visit the same cell several times.

Example 1:

Input: sx = 2, sy = 4, fx = 7, fy = 7, t = 6
Output: true
Explanation: Starting at cell (2, 4), we can reach cell (7, 7) in exactly 6 seconds by going through the cells depicted in the picture above. 

Example 2:

Input: sx = 3, sy = 1, fx = 7, fy = 3, t = 3
Output: false
Explanation: Starting at cell (3, 1), it takes at least 4 seconds to reach cell (7, 3) by going through the cells depicted in the picture above. Hence, we cannot reach cell (7, 3) at the third second.

Constraints:

	1 <= sx, sy, fx, fy <= 10^9
	0 <= t <= 10^9
*/
export function isReachableAtTime(
    sx: number,
    sy: number,
    fx: number,
    fy: number,
    t: number
): boolean {
    const distanceX = Math.abs(fx - sx);
    const distanceY = Math.abs(fy - sy);
    const minSeconds =
        Math.min(distanceX, distanceY) + Math.abs(distanceX - distanceY);
    if (t < minSeconds) {
        return false;
    }

    const rest = t - minSeconds;

    if (rest & 1) {
        return Math.max(distanceX, distanceY) > 0 || rest > 2;
    }
    return true;
}
