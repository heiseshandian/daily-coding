import { swap } from '../common';

/* 
n层汉诺塔问题
 */
export function hanoi(n: number): string[] {
    const result: string[] = [];
    hanoiProcess(n, 'left', 'right', 'center', result);
    return result;
}

function hanoiProcess(n: number, from: string, to: string, center: string, path: string[]) {
    if (n === 1) {
        path.push(`1 ${from} > ${to}`);
        return;
    }

    hanoiProcess(n - 1, from, center, to, path);
    path.push(`${n} ${from} > ${to}`);
    hanoiProcess(n - 1, center, to, from, path);
}

/* 从左到右或者从右到左的尝试 */
/* 获取字符串的所有子序列 */
export function subsequence(str: string) {
    const result: string[] = [];
    subsequenceProcess(str, 0, result, '');
    return result;
}

function subsequenceProcess(str: string, index: number, result: string[], currentSubsequence: string) {
    if (index === str.length) {
        result.push(currentSubsequence);
        return;
    }

    subsequenceProcess(str, index + 1, result, currentSubsequence);
    subsequenceProcess(str, index + 1, result, currentSubsequence + str[index]);
}

/* 字符串的全排列问题 */
export function allPermutation(str: string) {
    const result: string[] = [];
    allPermutationProcess(str.split(''), 0, result);
    return result;
}

function allPermutationProcess(strArr: string[], i: number, result: string[]) {
    if (i === strArr.length - 1) {
        result.push(strArr.join(''));
        return;
    }
    for (let j = i; j < strArr.length; j++) {
        swap(strArr, i, j);
        allPermutationProcess(strArr, i + 1, result);
        swap(strArr, i, j);
    }
}

/* 过滤掉重复序列的全排列问题 */
export function allPermutation2(str: string) {
    const result: string[] = [];
    allPermutation2Process(str.split(''), 0, result);
    return result;
}

function allPermutation2Process(strArr: string[], i: number, result: string[]) {
    if (i === strArr.length - 1) {
        result.push(strArr.join(''));
        return;
    }

    const visited = new Map<string, boolean>();
    for (let j = i; j < strArr.length; j++) {
        if (visited.get(strArr[j])) {
            continue;
        }

        visited.set(strArr[j], true);
        swap(strArr, i, j);
        allPermutationProcess(strArr, i + 1, result);
        swap(strArr, i, j);
    }
}

export function bag(weights: number[], values: number[], targetWeight: number) {
    return bagProcess(weights, values, targetWeight, 0);
}

function bagProcess(weights: number[], values: number[], leftWeight: number, index: number): number {
    if (leftWeight < 0) {
        return -1;
    }
    if (index == weights.length) {
        return 0;
    }

    const val1 = bagProcess(weights, values, leftWeight, index + 1);
    let val2 = bagProcess(weights, values, leftWeight - weights[index], index + 1);
    if (val2 !== -1) {
        val2 += values[index];
    }
    return Math.max(val1, val2);
}

/* 范围尝试 */
/* 有一组数字牌 array，array中所有的数字都是正数，有A和B两个玩家，规定只能从剩余牌的头尾拿牌，问A和B能获得的最大分数是多少 */
export function maxPoint(arr: number[]) {
    return Math.max(maxPointF(arr, 0, arr.length - 1), maxPointS(arr, 0, arr.length - 1));
}

// 先手过程
function maxPointF(arr: number[], left: number, right: number): number {
    if (left === right) {
        return arr[left];
    }

    return Math.max(arr[left] + maxPointS(arr, left + 1, right), arr[right] + maxPointS(arr, left, right - 1));
}

// 后手过程
function maxPointS(arr: number[], left: number, right: number): number {
    // 如果只剩下一张牌且是后手，则先手一定会拿走剩下的牌，后手会获得0分
    if (left === right) {
        return 0;
    }

    // 此外后手只能选择先手拿牌之后的最小值
    return Math.min(maxPointF(arr, left + 1, right), maxPointF(arr, left, right - 1));
}

/* n皇后问题，有n个皇后，摆放在N x N的格子上，要求任意两个皇后不同行，不同列且不共斜线，问一共有多少种摆法 */
export function nQueen(n: number): number {
    if (n < 1) {
        return 0;
    }
    return nQueenProcess(0, [], n);
}

function nQueenProcess(i: number, record: number[], n: number): number {
    if (i === n) {
        return 1;
    }

    let count = 0;
    for (let j = 0; j < n; j++) {
        if (isValid(i, j, record)) {
            record[i] = j;
            count += nQueenProcess(i + 1, record, n);
        }
    }

    return count;
}

function isValid(i: number, j: number, record: number[]): boolean {
    for (let k = 0; k < i; k++) {
        if (j === record[k] || Math.abs(i - k) === Math.abs(j - record[k])) {
            return false;
        }
    }

    return true;
}

export function jump(arr: number[]) {
    return walkProcess(arr, 0);
}

// 从i位置走到最后最少需要多少步
function walkProcess(arr: number[], i: number) {
    if (i >= arr.length - 1) {
        return 0;
    }

    const stepCounts: number[] = [];
    for (let k = 1; k <= arr[i]; k++) {
        const currentStep = walkProcess(arr, i + k) + 1;
        stepCounts.push(currentStep);
    }

    return Math.min(...stepCounts);
}

export function jumpDp(arr: number[]): number {
    const len = arr.length;
    const dp = new Array(len);
    dp[len - 1] = 0;

    for (let i = len - 2; i >= 0; i--) {
        let min = Infinity;
        for (let k = 1; k <= arr[i] && i + k < len; k++) {
            if (min > dp[i + k]) {
                min = dp[i + k];
            }
        }

        dp[i] = Math.min(min + 1);
    }

    return dp[0];
}

export function jumpDp2(arr: number[]): number {
    let step = 0;
    let curMaxRight = 0;
    let nextMaxRight = 0;

    for (let i = 0; i < arr.length; i++) {
        if (curMaxRight < i) {
            step++;
            curMaxRight = nextMaxRight;
        }
        nextMaxRight = Math.max(i + arr[i], nextMaxRight);
    }

    return step;
}

/* 
给定两个有序数组arr1和arr2，在给定整数k，返回arr1和arr2中的两个数相加和最大的前k个数，两个相加数必须分别来自arr1和arr2
例：
arr1:[1,2,3,4,5] arr2:[3,5,7,9,11],k=4
maxK:[16,15,14,14]
*/
export function getMaxSumK(arr1: number[], arr2: number[], k: number): number[] {
    const result: number[] = [];
    const maxHeap = new MaxHeap();

    const x = arr1.length - 1;
    const y = arr2.length - 1;
    maxHeap.add(x, y, arr1[x] + arr2[y]);

    while (result.length < k) {
        const { x, y, val } = maxHeap.poll();
        result.push(val);

        x - 1 >= 0 && maxHeap.add(x - 1, y, arr1[x - 1] + arr2[y]);
        y - 1 >= 0 && maxHeap.add(x, y - 1, arr1[x] + arr2[y - 1]);
    }

    return result;
}

class HeapNode {
    x: number;
    y: number;
    val: number;

    constructor(x: number, y: number, val: number) {
        this.x = x;
        this.y = y;
        this.val = val;
    }
}

class MaxHeap {
    private container: HeapNode[] = [];
    private set: Set<string> = new Set();

    public add(x: number, y: number, val: number) {
        const id = `${x}_${y}`;
        if (this.set.has(id)) {
            return;
        }
        this.set.add(id);

        this.container.push(new HeapNode(x, y, val));
        this.insertHeap(this.container.length - 1);
    }

    private insertHeap(i: number) {
        while (i) {
            const parent = (i - 1) >> 1;
            if (this.container[parent].val >= this.container[i].val) {
                return;
            }

            swap(this.container, parent, i);
            i = parent;
        }
    }

    private heapify(i: number) {
        let left = i * 2 + 1;
        while (left < this.container.length) {
            let right = left + 1;
            let largestIndex =
                right < this.container.length && this.container[right].val >= this.container[left].val ? right : left;
            largestIndex = this.container[i].val >= this.container[largestIndex].val ? i : largestIndex;

            if (largestIndex === i) {
                return;
            }

            swap(this.container, largestIndex, i);
            i = largestIndex;
            left = i * 2 + 1;
        }
    }

    public poll() {
        const result = this.container[0];

        swap(this.container, 0, this.container.length - 1);
        this.container.length--;
        this.heapify(0);

        return result;
    }
}
