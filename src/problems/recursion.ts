import { GenericHeap } from '../algorithm/generic-heap';
import { maxCommonFactor, swap } from '../common';

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

// 字符串的字串问题
export function getSubstrings(str: string): string[] {
    const result: string[] = [];

    for (let i = 0; i < str.length; i++) {
        for (let j = i; j < str.length; j++) {
            // substring(start,end), end char is not included
            result.push(str.substring(i, j + 1));
        }
    }

    return result;
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

    // 通过分支限界来避免递归函数展开
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

// 背包问题，给定重量和价值数组，以及目标重量，要求在目标重量内选取物品使得总价值最大，返回最大价值
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

export function bagDp(weights: number[], values: number[], targetWeight: number) {
    const dp: number[][] = new Array(targetWeight + 1).fill(0).map((_) => new Array(weights.length + 1).fill(0));

    for (let index = weights.length - 1; index >= 0; index--) {
        for (let leftWeight = 0; leftWeight <= targetWeight; leftWeight++) {
            const val1 = dp[leftWeight][index + 1];
            let val2 = -1;
            if (leftWeight - weights[index] >= 0) {
                val2 = dp[leftWeight - weights[index]][index + 1] + values[index];
            }

            dp[leftWeight][index] = Math.max(val1, val2);
        }
    }

    return dp[targetWeight][0];
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
export function getMaxSumK(arr1: number[], arr2: number[], k: number): number[] | null {
    if (!arr1 || !arr2 || !k || k > arr1.length * arr2.length) {
        return null;
    }

    const result: number[] = [];
    const maxHeap = new GenericHeap<HeapNode>((a, b) => {
        return b.val - a.val;
    });
    const set = new Set();

    const x = arr1.length - 1;
    const y = arr2.length - 1;
    maxHeap.push(new HeapNode(x, y, arr1[x] + arr2[y]));

    while (result.length < k) {
        const { x, y, val } = maxHeap.pop();
        result.push(val);

        if (x - 1 >= 0 && !set.has(getSetId(x - 1, y))) {
            set.add(getSetId(x - 1, y));
            maxHeap.push(new HeapNode(x - 1, y, arr1[x - 1] + arr2[y]));
        }
        if (y - 1 >= 0 && !set.has(getSetId(x, y - 1))) {
            set.add(getSetId(x, y - 1));
            maxHeap.push(new HeapNode(x, y - 1, arr1[x] + arr2[y - 1]));
        }
    }

    return result;
}

function getSetId(x: number, y: number) {
    return `${x}_${y}`;
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

/* 
给定两个数组，arrx 和 arry，长度都是N，表示二维平面上的点，问一条直线最多可以经过平面上的多少个点，返回最多的点数
尝试策略：
假设平面上的点为a,b,c,d,e...
那我们依次考察从a出发的直线最多经过几个点，从b出发的点最多经过几个点

同一直线上的点可能的关系
1 共点（两个点位置相同）
2 共斜率（横线和竖线是特殊共斜率场景）
*/
export function getMaxPoints(arr1: number[], arr2: number[]): number {
    const points: Point[] = [];
    for (let i = 0; i < arr1.length; i++) {
        for (let j = 0; j < arr2.length; j++) {
            points.push(new Point(arr1[i], arr2[j]));
        }
    }

    let max = -Infinity;
    for (let i = 0; i < points.length; i++) {
        let sameXY = 1; //共点（某个点自己）
        let sameXDiffY = 0; //x相同（斜率无穷大）
        const kMap: Map<string, number> = new Map();

        // 里面不必从0开始，因为外层已经考虑过前i个点和后面所有点的斜率关系，假如i,j共线的话那么在前面i轮循环已经计算过了
        for (let j = i + 1; j < points.length; j++) {
            if (points[i].x === points[j].x) {
                if (points[i].y === points[j].y) {
                    sameXY++;
                } else {
                    sameXDiffY++;
                }
            } else {
                const factor = maxCommonFactor(points[i].y - points[j].y, points[i].x - points[j].x);
                // 此处若用数字来表示会有精度丢失，两个点靠的很近的情况下两个斜率可能区分不出来，故而采用分数的最简形式来表示斜率
                const k = `${(points[i].y - points[j].y) / factor}_${(points[i].x - points[j].x) / factor}`;
                const previousCount = kMap.get(k) || 0;
                kMap.set(k, previousCount + 1);
            }
        }

        const currentMax = Math.max(getMaxCount(kMap), sameXDiffY) + sameXY;
        if (max < currentMax) {
            max = currentMax;
        }
    }

    return max;
}

function getMaxCount(kMap: Map<string, number>): number {
    let max = -Infinity;

    for (const [, count] of kMap) {
        if (max < count) {
            max = count;
        }
    }

    return max;
}

class Point {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

export function fullPermutation(str: string): string[] {
    const result: string[] = [];
    fullPermutationProcess(str.split(''), 0, result);
    return result;
}

function fullPermutationProcess(arr: string[], i: number, result: string[]) {
    if (i === arr.length) {
        result.push(arr.join(''));
    }

    for (let k = i; k < arr.length; k++) {
        swap(arr, i, k);
        fullPermutationProcess(arr, i + 1, result);
        swap(arr, i, k);
    }
}

/* 
给定一个正数数组 arr，其中所有的值都为整数，以下是最小不可组成和的概念：
把 arr 每个子集内的所有元素加起来会出现很多值，其中最小的记为 min，最大的记为max 在区间【min，max】上，如果有数不可以被arr某一个子集相加得到，那么其中最小的那个数是arr 的最小不可组成和
在区间【min，max】上，如果所有的数都可以被arr的某一个子集相加得到，那么max+1是arr的最小不可组成和
请写函数返回正数数组 arr 的最小不可组成和。

【举例】
arr=【3，2，5】。子集{2】相加产生2为min，子集（3，2，5】相加产生10为max。在区间【2，10】上，4、6和9不能被任何子集相加得到，其中4是arr的最小不可组成和。
arr=【1，2，4】。子集【1】相加产生1为min，子集【1，2，4】相加产生7为max。在区间【1，7】上，任何 数都可以被子集相加得到，所以8是 arr 的最小不可组成和。

【进阶】
如果已知正数数组 arr 中肯定有1 这个数，是否能更快地得到最小不可组成和？
*/
export function getMinUnavailableSum(arr: number[]): number | null {
    if (!arr || arr.length < 1) {
        return null;
    }

    const max = arr.reduce((sum, cur) => sum + cur, 0);
    // i,j表示用[0...i]位置上的数字自由组合能否组成j
    const dp: boolean[][] = new Array(arr.length).fill(0).map((_) => new Array(max + 1));

    dp[0].fill(false);
    dp[0][arr[0]] = true;

    for (let i = 1; i < arr.length; i++) {
        for (let j = 0; j <= max; j++) {
            if (j - arr[i] > 0) {
                dp[i][j] = dp[i - 1][j - arr[i]] || dp[i - 1][j];
            } else if (j - arr[i] === 0) {
                dp[i][j] = true;
            } else {
                dp[i][j] = dp[i - 1][j];
            }
        }
    }

    const min = Math.min(...arr);
    for (let j = min + 1; j < max; j++) {
        if (dp[arr.length - 1][j] === false) {
            return j;
        }
    }
    return max + 1;
}

// 如果arr中必然有1，则通过排序之后一次遍历的方式就可以得到数组的最小不可组成和
export function getMinUnavailableSum2(arr: number[]): number | null {
    if (!arr || arr.length < 1) {
        return null;
    }
    arr.sort((a, b) => a - b);

    // [0-i]位置的数可以组合出 [0-range]范围的数字
    let range = 1;
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] <= range + 1) {
            range += arr[i];
        } else {
            return range + 1;
        }
    }

    return range + 1;
}

/* 
给定一个有序的正数数组arr和一个正数range，如果可以自由选择arr中的数字，想累加得到 1~range 范围上所有的数，返回arr最少还缺几个数。

【举例】
arr = {1,2,3,7},range = 15
想累加得到1~15 范围上所有的数，arr 还缺 14 这个数，所以返回1 

arr = {1,5,7},range = 15
想累加得到1~15范围止所有的数，arr还缺2和4，所以返回2
*/
export function getMinCount(arr: number[], target: number): number {
    if (!arr || arr.length < 1) {
        return 0;
    }

    let range = 0;
    let count = 0;
    for (let i = 0; i < arr.length; ) {
        if (range >= target) {
            return count;
        }

        if (arr[i] <= range + 1) {
            range += arr[i];
            i++;
        } else {
            range += range + 1;
            count++;
        }
    }

    while (range < target) {
        range += range + 1;
        count++;
    }

    return count;
}

/* 
假设有两个数组，arr1表示能力数组，arr2表示收买所需要的钱，分别表示第i只怪兽的能力以及收买所需要的钱
假设现在有个小人，比如说顺序通过所有怪兽，如果小人当前能力小于怪兽则必须收买才能通过，若小人能力高于怪兽则可以选择
收买或直接通过，问至少需要多少钱才能通过所有怪兽
 */
export function minMoney(arr1: number[], arr2: number[]): number {
    return minMoneyProcess(arr1, arr2, 0, 0);
}

function minMoneyProcess(arr1: number[], arr2: number[], power: number, i: number): number {
    if (i === arr1.length) {
        return 0;
    }

    if (power < arr1[i]) {
        return minMoneyProcess(arr1, arr2, power + arr1[i], i + 1) + arr2[i];
    }
    return Math.min(
        minMoneyProcess(arr1, arr2, power + arr1[i], i + 1) + arr2[i],
        minMoneyProcess(arr1, arr2, power, i + 1)
    );
}

/* 
岛问题
【题目】
一个矩阵中只有0和1两种值，每个位置都可以和自己的上、下、左、右 四个位置相连，如果有一片1连在一起，这个部分叫做一个岛，求一个矩阵中有多少个岛？
【举例】△
001010 
111010 
100100 
000000
这个矩阵中有三个岛

【进阶】
如何设计一个并行算法解决这个问题
*/
export function getIslandCount(arr: number[][]): number {
    let count = 0;

    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[0].length; j++) {
            if (arr[i][j] === 1) {
                count++;
                infect(arr, i, j);
            }
        }
    }

    return count;
}

function infect(arr: number[][], i: number, j: number) {
    if (i < 0 || i > arr.length - 1 || j < 0 || j > arr[0].length - 1 || arr[i][j] !== 1) {
        return;
    }

    arr[i][j] = 2;
    infect(arr, i - 1, j);
    infect(arr, i + 1, j);
    infect(arr, i, j - 1);
    infect(arr, i, j + 1);
}
