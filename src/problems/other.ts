import { GenericHeap } from '../algorithm/generic-heap';
import { MaxHeap } from '../algorithm/heap';
import { getClosestMinArr } from '../algorithm/monotonous-stack';
import { PrefixTree, PrefixTreeNode } from '../algorithm/prefix-tree';
import { Queue } from '../algorithm/queue';
import { SkipSet } from '../algorithm/skip-set';
import { SlidingWindow } from '../algorithm/sliding-window';
import { Stack } from '../algorithm/stack';
import { UnionSet } from '../algorithm/union-set';
import { getCharIndex, maxCommonFactor, swap } from '../common/index';

/* 
分糖果问题1

给定一个正数数组arr，表示每个小朋友的得分
任何两个相邻的小朋友，如果得分一样，怎么分糖果无所谓，但如果得分不一样，分数大的一定要比分数少的多拿一些糖果
假设所有的小朋友坐成一个环形，返回在不破坏上一条规则的情况下，需要的最少糖果数
*/
export function getMinCandy(arr: number[]): number {
    // 找到局部最小值，局部最小分得的糖果一定是1
    const minIndex = getLocalMinFromCircle(arr);

    // 局部最小卡在两边
    const newArr = arr.slice(minIndex, arr.length).concat(...arr.slice(0, minIndex + 1));

    // 从左侧的坡度来看每个小孩子应该分多少糖果
    const leftCandyArr = [1];
    for (let i = 1; i < newArr.length; i++) {
        // 严格递增糖果才加一，否则直接给一块糖果
        if (newArr[i] > newArr[i - 1]) {
            leftCandyArr.push(leftCandyArr[leftCandyArr.length - 1] + 1);
        } else {
            leftCandyArr.push(1);
        }
    }

    // 从右侧的坡度来看每个小孩子应该分多少糖果
    const rightCandyArr = [1];
    for (let i = newArr.length - 2; i >= 0; i--) {
        if (newArr[i] > newArr[i + 1]) {
            rightCandyArr.push(rightCandyArr[rightCandyArr.length - 1] + 1);
        } else {
            rightCandyArr.push(1);
        }
    }
    rightCandyArr.reverse();

    const forTest = [1];

    // 左右坡度取最大值就是最终的糖果数
    let candy = 0;
    for (let i = 1; i < leftCandyArr.length; i++) {
        forTest.push(Math.max(leftCandyArr[i], rightCandyArr[i]));
        candy += Math.max(leftCandyArr[i], rightCandyArr[i]);
    }

    return candy;
}

// 从环形数组中获取局部最小的位置
// 所谓局部最小指的就是 x 比前后位置的数都要小
function getLocalMinFromCircle(arr: number[]): number {
    let minIndex = -1;
    for (let i = 0; i < arr.length; i++) {
        const prev = i > 0 ? i - 1 : arr.length - 1;
        const next = i < arr.length ? i + 1 : 0;
        if (arr[i] <= arr[prev] && arr[i] <= arr[next]) {
            minIndex = i;
            break;
        }
    }

    return minIndex;
}

/* 
分糖果问题2

给定一个正数数组arr，表示每个小朋友的得分
1）任何两个相邻的小朋友，如果得分一样，怎么分糖果无所谓
2）如果得分不一样，分数大的一定要比分数少的多拿一些糖果

假设所有的小朋友坐成一个环形，返回在不破坏上述规则的情况下，需要的最少糖果数

要求额外空间复杂度为O(1)
*/
export function getMinCandy2(arr: number[]): number {
    // 获取局部最小（局部最小的得糖数一定是1）
    const minIndex = getLocalMinFromCircle(arr);

    // 局部最小卡在两边，把环形问题变成非环形问题
    const newArr = arr.slice(minIndex, arr.length).concat(...arr.slice(0, minIndex + 1));

    let start = 0;
    while (start < newArr.length) {
        // 从start位置往外跳，跳完一个完整上下坡之后返回更新跳过位置的糖果数
        let i = start + 1;
        // 左坡最大值
        let leftMax = 1;
        // 右坡最大值
        let rightMax = 1;

        // 上坡阶段
        while (i < newArr.length && newArr[i] > newArr[i - 1]) {
            leftMax++;
            i++;
        }

        // 下坡阶段
        while (i < newArr.length && newArr[i] < newArr[i - 1]) {
            rightMax++;
            i++;
        }

        // 下坡结束开始往回更新数据
        // 更新左坡
        let k = 0;
        while (k < leftMax - 1) {
            newArr[start + k] = ++k;
        }

        // 更新坡顶
        newArr[start + k] = Math.max(leftMax, rightMax);

        // 更新右坡（坡顶下一个到坡底前一个，因为右坡坡底要算作下一个坡的开始）
        let j = 1;
        while (j < rightMax - 1) {
            newArr[start + k + j] = rightMax - j++;
        }

        // 左右坡都更新完之后跳到下一个坡度的起点（也就是上一个坡的坡底）
        start = start + k + j;
    }

    // 去掉一个局部最小
    return newArr.slice(1).reduce((acc, cur) => acc + cur, 0);
}

/* 
分糖果问题3

给定一个正数数组arr，表示每个小朋友的得分
1）任何两个相邻的小朋友，如果得分一样，分的糖果数必须一样，
2）如果得分不一样，分数大的一定要比分数少的多拿一些糖果

假设所有的小朋友坐成一个环形，返回在不破坏上述规则的情况下，需要的最少糖果数
*/
export function getMinCandy3(arr: number[]): number {
    // 获取局部最小
    const minIndex = getLocalMinFromCircle(arr);

    // 局部最小卡在两边
    const newArr = arr.slice(minIndex, arr.length).concat(...arr.slice(0, minIndex + 1));

    // 从左侧的坡度来看每个小孩子应该分多少糖果
    const leftCandyArr = [1];
    for (let i = 1; i < newArr.length; i++) {
        const lastCandy = leftCandyArr[leftCandyArr.length - 1];
        if (newArr[i] > newArr[i - 1]) {
            // 比左边大，糖果加一
            leftCandyArr.push(lastCandy + 1);
        } else if (newArr[i] === newArr[i - 1]) {
            // 和左边一样，糖果不变
            leftCandyArr.push(lastCandy);
        } else {
            // 比左边小，糖果变成1
            leftCandyArr.push(1);
        }
    }

    // 从右侧的坡度来看每个小孩子应该分多少糖果
    const rightCandyArr = [1];
    for (let i = newArr.length - 2; i >= 0; i--) {
        const lastCandy = rightCandyArr[rightCandyArr.length - 1];
        if (newArr[i] > newArr[i + 1]) {
            rightCandyArr.push(lastCandy + 1);
        } else if (newArr[i] === newArr[i + 1]) {
            rightCandyArr.push(lastCandy);
        } else {
            rightCandyArr.push(1);
        }
    }
    rightCandyArr.reverse();

    let candy = 0;
    // 略过第一个局部最小（预处理的时候两边都加了局部最小，最后结算的时候去掉一个）
    for (let i = 1; i < leftCandyArr.length; i++) {
        candy += Math.max(leftCandyArr[i], rightCandyArr[i]);
    }

    return candy;
}

/* 
分糖果问题4

给定一个正数数组arr，表示每个小朋友的得分
1）任何两个相邻的小朋友，如果得分一样，分的糖果数必须一样，
2）如果得分不一样，分数大的一定要比分数少的多拿一些糖果

假设所有的小朋友坐成一个环形，返回在不破坏上述规则的情况下，需要的最少糖果数

要求额外空间复杂度为O(1)
*/
export function getMinCandy4(arr: number[]): number {
    // 获取局部最小（局部最小的得糖数一定是1）
    const minIndex = getLocalMinFromCircle(arr);

    // 局部最小卡在两边，把环形问题变成非环形问题
    const newArr = arr.slice(minIndex, arr.length).concat(...arr.slice(0, minIndex + 1));

    let start = 0;
    while (start < newArr.length) {
        // 从start位置往外跳，跳完一个完整上下坡之后返回更新跳过位置的糖果数
        let i = start + 1;

        // 左坡最大值，右坡含有的数字（坡顶平台也算作上坡含有的数字）
        let leftMax = 1;
        let leftCount = 1;

        // 右坡最大值，右坡含有的数字（仅下坡，不包含坡顶平台）
        let rightMax = 1;
        let rightCount = 1;

        // 坡顶平台开始结束位置，坡顶含有的数字
        let topStart = start;
        let topEnd: number;
        let topCount = 1;

        // 上坡阶段
        while (i < newArr.length && newArr[i] >= newArr[i - 1]) {
            if (newArr[i] > newArr[i - 1]) {
                leftMax++;
                topStart = i;
            }
            i++;
            leftCount++;
        }

        // 上坡结束更新坡顶平台含有的数字个数
        topEnd = i - 1;
        topCount = topEnd - topStart + 1;

        // 下坡阶段
        while (i < newArr.length && newArr[i] <= newArr[i - 1]) {
            if (newArr[i] < newArr[i - 1]) {
                rightMax++;
            }
            i++;
            rightCount++;
        }

        // 下坡结束开始往回更新数据
        // 更新左坡（不包括坡顶平台）
        let leftCountIndex = 0;
        let leftCandy = 1;
        const endOfLeft = start + leftCount - topCount;
        while (leftCountIndex < leftCount - topCount) {
            let firstIndex = start + leftCountIndex;
            let firstValue = newArr[firstIndex];

            let k = 0;
            while (firstIndex + k < endOfLeft && newArr[firstIndex + k] === firstValue) {
                newArr[firstIndex + k++] = leftCandy;
            }

            leftCandy++;
            leftCountIndex += k;
        }

        // 单独更新坡顶平台
        let topIndex = 0;
        while (topIndex < topCount) {
            newArr[start + leftCountIndex++] = Math.max(leftMax, rightMax);
            topIndex++;
        }

        // 更新右坡（坡顶下一个到坡底前一个，因为右坡坡底要算作下一个坡的开始）
        let rightCountIndex = 0;
        let rightCandy = 1;
        const endOfRight = start + leftCountIndex + rightCount - 2;
        while (rightCountIndex < rightCount - 2) {
            let firstIndex = start + leftCountIndex + rightCountIndex;
            let firstValue = newArr[firstIndex];

            let k = 0;
            while (firstIndex + k < endOfRight && newArr[firstIndex + k] === firstValue) {
                newArr[firstIndex + k++] = rightMax - rightCandy;
            }

            rightCandy++;
            rightCountIndex += k;
        }

        // 左右坡都更新完之后跳到下一个坡度的起点（也就是上一个坡的坡底）
        start = start + leftCountIndex + rightCountIndex;
    }

    // 去掉一个局部最小
    return newArr.slice(1).reduce((acc, cur) => acc + cur, 0);
}

/* 
题目3（来自腾讯）
给定一个正数数组arr，代表每个人的体重。
给定一个正数limit代表船的载重，所有船都是同样的载重量每个人的体重都一定不大于船的载重
要求：
1，可以1个人单独一搜船
2，一艘船如果坐2人，两个人的体重相加需要是偶数，且总体重不能超过船的载重
3，一艘船最多坐2人
返回如果想所有人同时坐船，船的最小数量
*/
export function getMinBoats(arr: number[], limit: number): number {
    arr.sort((a, b) => a - b);

    // 由于奇数和偶数不能同坐一条船所以直接将奇数和偶数分开
    const odd: number[] = [];
    const even: number[] = [];
    for (let i = 0; i < arr.length; i++) {
        if ((arr[i] & 1) === 1) {
            odd.push(arr[i]);
        } else {
            even.push(arr[i]);
        }
    }

    // 先处理奇数
    let left = 0;
    let right = odd.length - 1;
    let oddCount = 0;
    while (left <= right) {
        if (odd[left] + odd[right] <= limit) {
            left++;
            right--;
        } else {
            right--;
        }

        oddCount++;
    }

    // 再处理偶数
    left = 0;
    right = even.length - 1;
    let evenCount = 0;
    while (left <= right) {
        if (even[left] + even[right] <= limit) {
            left++;
            right--;
        } else {
            right--;
        }

        evenCount++;
    }

    return oddCount + evenCount;
}

/* 
（为了题目6的启发题目）题目5
给定一个数组arr，和整数sum 返回累加和等于sum的子数组有多少个？
*/
export function countSubArr(arr: number[], target: number): number {
    if (!arr || arr.length === 0) {
        return 0;
    }

    // 暴力解法，先生成前缀和数组
    const sumArr = [arr[0]];
    for (let i = 1; i < arr.length; i++) {
        sumArr[i] = sumArr[i - 1] + arr[i];
    }

    let count = 0;
    for (let i = 0; i < arr.length; i++) {
        for (let j = i; j < arr.length; j++) {
            const sum = i === 0 ? sumArr[j] : sumArr[j] - sumArr[i - 1];
            if (sum === target) {
                count++;
            }
        }
    }

    return count;
}

export function countSubArr2(arr: number[], target: number): number {
    if (!arr || arr.length === 0) {
        return 0;
    }

    const map: Map<number, number> = new Map();
    let sum = 0;
    let count = 0;
    // 假定子数组必须以i位置结尾，则i以前出现 sum - target的次数就是以i位置结尾且和等于target的个数
    // 假设k位置的和等于 sum - target则k+1到i位置的和必然是target 因为从0到i的和是sum
    // 用map来避免遍历前缀和数组，秒啊
    for (let i = 0; i < arr.length; i++) {
        sum += arr[i];

        const times = map.get(sum - target) || 0;
        count += times;

        const prev = map.get(sum) || 0;
        map.set(sum, prev + 1);
    }

    return count;
}

// 给定正数数组arr，数组元素表示一系列点，给定绳子长度，问绳子最多可以压中几个点
export function getMaxRopePoints(arr: number[], rope: number): number {
    arr.sort((a, b) => a - b);

    // 假定绳子的末尾点在i点上，则arr[i] - rope范围内有几个点就表示以i结尾时绳子最多压中几个点
    let max = 0;
    for (let i = 0; i < arr.length; i++) {
        const target = arr[i] - rope;
        // 在0-i之间找>=target 且离target最近的位置
        let found = 0;
        let left = 0;
        let right = i;
        while (left <= right) {
            const mid = left + ((right - left) >> 1);
            if (arr[mid] === target) {
                found = mid;
                break;
            }

            if (arr[mid] > target) {
                found = mid;
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        }

        max = Math.max(max, i - found + 1);
    }

    return max;
}

export function getMaxRopePoints2(arr: number[], rope: number): number {
    arr.sort((a, b) => a - b);

    // 用滑动窗口来解决
    let left = 0;
    let right = 0;
    let max = 0;
    while (left < arr.length) {
        // right先往右到不能再往右，然后right再加1，此时right-left就是绳子覆盖的点
        while (right < arr.length && arr[right] - arr[left] <= rope) {
            right++;
        }
        max = Math.max(max, right - left++);
    }

    return max;
}

// 要求实现一个含有setAll功能的hash表结构，setAll需要把当前hash表中所有的值都变成给定值，要求时间复杂度是O(1)
export class MapWithSetAll<Key = any, Value = any> {
    setAllTime = -Infinity;
    currentTime = 0;
    all: Value | null = null;
    map: Map<Key, [value: Value, time: number]> = new Map();

    public set(key: Key, value: Value) {
        this.map.set(key, [value, this.currentTime++]);
    }

    public setAll(value: Value) {
        this.all = value;
        this.setAllTime = this.currentTime++;
    }

    public get(key: Key) {
        if (!this.map.has(key)) {
            return undefined;
        }

        const [value, time] = this.map.get(key)!;
        if (time <= this.setAllTime) {
            return this.all;
        }
        return value;
    }
}

// 给定字符串str，求str的最长无重复字符子串长度
export function maxSubstringWithoutRepeatingChar(str: string): number {
    if (!str || str.length === 0) {
        return 0;
    }

    const map: Map<string, number> = new Map();
    map.set(str[0], 0);

    let pre = 1;
    let cur = 1;
    let max = 1;
    for (let i = 1; i < str.length; i++) {
        // 比如说当前来到4位置，若str[4]之前没出现过，则按照上次出现的重复字符来算长度就是4-0+1 也就是 4-(-1)
        // 用 || 语法的时候一定要注意判断前面的值是否能取到0
        // 0 || -1的值最终是-1
        const p1 = i - (map.get(str[i]) ?? -1);
        const p2 = pre + 1;
        cur = Math.min(p1, p2);
        max = Math.max(max, cur);

        pre = cur;
        map.set(str[i], i);
    }

    return max;
}

/* 
题目4
给定一个数组arr，代表每个人的能力值。再给定一个非负数k 
如果两个人能力差值正好为k，那么可以凑在一起比赛一局比赛只有两个人
返回最多可以同时有多少场比赛
*/
export function getMaxGame(arr: number[], k: number): number {
    if (k < 0 || !arr || arr.length < 2) {
        return 0;
    }

    // 一开始所有的数字都没被用过
    const used: boolean[] = new Array(arr.length).fill(false);

    arr.sort((a, b) => a - b);

    let count = 0;
    for (let i = 0; i < arr.length - 1; i++) {
        if (used[i]) {
            continue;
        }

        // 二分法在i+1 - arr.length中找 arr[i]+k
        let left = i + 1;
        let right = arr.length - 1;
        const target = arr[i] + k;
        while (left <= right) {
            const mid = left + ((right - left) >> 1);
            if (arr[mid] === target) {
                count++;
                used[mid] = true;
                break;
            } else if (arr[mid] > target) {
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        }
    }

    return count;
}

export function getMaxGameWindow(arr: number[], k: number): number {
    if (k < 0 || !arr || arr.length < 2) {
        return 0;
    }

    // 一开始所有的数字都没被用过
    const used: boolean[] = new Array(arr.length).fill(false);

    arr.sort((a, b) => a - b);

    let count = 0;
    let left = 0;
    let right = 0;
    while (left < arr.length && right < arr.length) {
        if (used[left]) {
            left++;
            continue;
        }
        if (right === left) {
            right++;
            continue;
        }

        if (arr[right] - arr[left] === k) {
            count++;

            used[right] = true;
            right++;
            left++;
        } else if (arr[right] - arr[left] < k) {
            right++;
        } else {
            left++;
        }
    }

    return count;
}

// 求子数组的最大累加和
export function getMaxSumOfSubArr(arr: number[]): number {
    if (!arr || arr.length === 0) {
        return 0;
    }

    let prev = arr[0];
    let cur = arr[0];
    let max = cur;

    // 子数组以i结尾的前提下所形成的最大累加和是多少，最终答案求一个最大值返回即可
    for (let i = 1; i < arr.length; i++) {
        const cur = Math.max(prev + arr[i], arr[i]);
        max = Math.max(max, cur);
        prev = cur;
    }

    return max;
}

/* 
定义：数组中累加和与最小值的乘积，假设叫做指标A。给定一个正数数组，请返回子数组中，指标A最大的值。
*/
export function getMaxA(arr: number[]): number {
    if (!arr || arr.length === 0) {
        return 0;
    }

    // 前缀和数组，用于优化子数组求和
    const preSumArr = [arr[0]];
    for (let i = 1; i < arr.length; i++) {
        preSumArr[i] = preSumArr[i - 1] + arr[i];
    }

    // 大流程，从左到右，每个数字必须是当前子数组的最小值的情况下所形成的子数组中，累加和最大的指标A一定最大
    // 单调栈结构，左边最近的比它小的与右边最近的比它小的
    const closestMinArr = getClosestMinArr(arr);

    let max = 0;
    for (let i = 0; i < arr.length; i++) {
        let [left, right] = closestMinArr[i];
        if (left === undefined) {
            left = -1;
        }
        if (right === undefined) {
            right = arr.length;
        }

        // left+1 到 right-1就是最长的（也就是sum最大的）以当前数字为最小值的子数组
        const sum = preSumArr[right - 1] - (left === -1 ? 0 : preSumArr[left]);
        max = Math.max(max, sum * arr[i]);
    }

    return max;
}

// 给定一个正数数组arr表示硬币面值，给定target表示目标值，求搞定target最少需要几个硬币（每个硬币只能用一次）
export function getMinCoins(arr: number[], target: number): number {
    if (!arr || arr.length === 0 || target <= 0) {
        return 0;
    }

    return getMinCoinsProcess(arr, 0, target);
}

function getMinCoinsProcess(arr: number[], i: number, rest: number): number {
    if (rest === 0) {
        return 0;
    }

    // 没有硬币且rest不是0，返回-1无法搞定
    if (i === arr.length || rest < 0) {
        return -1;
    }

    // 两种选择，要不要当前硬币
    let p1 = Infinity;
    const next1 = getMinCoinsProcess(arr, i + 1, rest - arr[i]);
    if (next1 !== -1) {
        p1 = next1 + 1;
    }

    let p2 = Infinity;
    const next2 = getMinCoinsProcess(arr, i + 1, rest);
    if (next2 !== -1) {
        p2 = next2;
    }

    // 某一次有可能出现两种决策都失败的情况
    return p1 === Infinity && p2 === Infinity ? -1 : Math.min(p1, p2);
}

export function getMinCoinsDp(arr: number[], target: number): number {
    if (!arr || arr.length === 0 || target <= 0) {
        return 0;
    }

    const dp: number[][] = new Array(arr.length + 1).fill(0).map((_) => new Array(target + 1).fill(0));
    // 第arr.length行
    for (let rest = 1; rest <= target; rest++) {
        dp[arr.length][rest] = -1;
    }

    // 从下到上，从左到右填表
    for (let i = arr.length - 1; i >= 0; i--) {
        for (let rest = 1; rest <= target; rest++) {
            // 两种选择，要不要当前硬币
            let p1 = Infinity;
            const next1 = rest - arr[i] >= 0 ? dp[i + 1][rest - arr[i]] : -1;
            if (next1 !== -1) {
                p1 = next1 + 1;
            }

            let p2 = Infinity;
            const next2 = dp[i + 1][rest];
            if (next2 !== -1) {
                p2 = next2;
            }

            dp[i][rest] = p1 === Infinity && p2 === Infinity ? -1 : Math.min(p1, p2);
        }
    }

    return dp[0][target];
}

// 两个一维表滚动代替二维表
export function getMinCoinsDp2(arr: number[], target: number): number {
    if (!arr || arr.length === 0 || target <= 0) {
        return 0;
    }

    const dp: number[] = new Array(target + 1).fill(0);
    // 第arr.length行
    for (let rest = 1; rest <= target; rest++) {
        dp[rest] = -1;
    }
    let prevDp = dp.slice();

    // 从下到上，从左到右填表
    for (let i = arr.length - 1; i >= 0; i--) {
        for (let rest = 1; rest <= target; rest++) {
            // 两种选择，要不要当前硬币
            let p1 = Infinity;
            const next1 = rest - arr[i] >= 0 ? prevDp[rest - arr[i]] : -1;
            if (next1 !== -1) {
                p1 = next1 + 1;
            }

            let p2 = Infinity;
            const next2 = prevDp[rest];
            if (next2 !== -1) {
                p2 = next2;
            }

            dp[rest] = p1 === Infinity && p2 === Infinity ? -1 : Math.min(p1, p2);
        }
        prevDp = dp.slice();
    }

    return dp[target];
}

/* 
给出一组正整数，你从第一个数向最后一个数方向跳跃，每次至少跳跃1格，每个数的值表示你从这个位置可以跳跃的最大长度。计算如何以最少的跳跃次数跳到最后一个数。
*/
export function getMinJumpSteps(arr: number[]): number {
    if (!arr || arr.length === 0) {
        return 0;
    }
    return jumpStepsProcess(arr, 0);
}

// 从i位置开始跳到最后最少需要多少步
function jumpStepsProcess(arr: number[], i: number): number {
    if (i >= arr.length - 1) {
        return 0;
    }

    let min = Infinity;
    for (let k = 1; k <= arr[i]; k++) {
        min = Math.min(min, 1 + jumpStepsProcess(arr, i + k));
    }

    return min;
}

export function getMinJumpStepsDp(arr: number[]): number {
    if (!arr || arr.length === 0) {
        return 0;
    }

    const dp: number[] = new Array(arr.length);
    dp[arr.length - 1] = 0;

    for (let i = arr.length - 2; i >= 0; i--) {
        let min = Infinity;
        for (let k = 1; k <= arr[i]; k++) {
            min = Math.min(min, 1 + (i + k >= arr.length - 1 ? 0 : dp[i + k]));
        }

        dp[i] = min;
    }

    return dp[0];
}

// 最优解有点类似于马拉车算法中的最右的回文右边界
export function getMinJumpSteps2(arr: number[]): number {
    if (!arr || arr.length === 0) {
        return 0;
    }

    let cur = 0;
    // 一开始没有迈步，初始值设置为0
    let count = 0;
    // count步内能到达的最远位置
    let curMostRight = 0;
    // count+1步能到达的最远位置
    let nextMostRight = arr[0];

    while (cur < arr.length && curMostRight < arr.length) {
        if (cur <= curMostRight) {
            nextMostRight = Math.max(nextMostRight, arr[cur] + cur);
            cur++;
            continue;
        }

        count++;
        curMostRight = nextMostRight;
    }

    return count;
}

/* 
给定两个有序数组arr1和arr2，再给定一个整数k，返回来自arr1和arr2的两个数相加和最大的前k个，两个数必须分别来自两个数组。

【举例】
arr1=【1，2，3，4，5】，arr2=【3，5，7，9，11】，k=4。返回数组【16，15, 14，14】

【要求】
时间复杂度达到0（klogk）
*/
class MaxKNode {
    val: number;
    i: number;
    j: number;

    constructor(val: number, i: number, j: number) {
        this.val = val;
        this.i = i;
        this.j = j;
    }
}

class MaxKNodeHeap {
    heap: GenericHeap<MaxKNode> = new GenericHeap((a, b) => b.val - a.val);
    set: Set<string> = new Set();

    public push(val: number, i: number, j: number) {
        const id = `${i}_${j}`;
        if (this.set.has(id)) {
            return;
        }

        this.set.add(id);
        this.heap.push(new MaxKNode(val, i, j));
    }

    public pop() {
        return this.heap.pop();
    }
}

export function getMaxK(arr1: number[], arr2: number[], k: number): number[] {
    const maxHeap = new MaxKNodeHeap();
    maxHeap.push(arr1[arr1.length - 1] + arr2[arr2.length - 1], arr1.length - 1, arr2.length - 1);

    const result: number[] = [];
    while (result.length < k) {
        const { val, i, j } = maxHeap.pop();
        result.push(val);

        if (i - 1 >= 0) {
            maxHeap.push(arr1[i - 1] + arr2[j], i - 1, j);
        }
        if (j - 1 >= 0) {
            maxHeap.push(arr1[i] + arr2[j - 1], i, j - 1);
        }
    }

    return result;
}

// 给定一个长度大于7的正数数组，返回数组能否分成4部分（切掉的数字不算），并且每部分的累加和相等
export function canSplit4Parts(arr: number[]): boolean {
    // 从第一个位置往后遍历，看某个位置能否作为第一个切割位置
    // 若当前位置可以作为第一个位置，则必存在 前缀和为part1Sum+arr[cur]+part2Sum的位置
    const prefixMap: Map<number, number> = new Map();
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
        sum += arr[i];
        prefixMap.set(sum, i);
    }

    let part1Sum = arr[0];
    for (let cut1 = 1; cut1 < arr.length; cut1++) {
        const tmp = part1Sum + arr[cut1] + part1Sum;
        if (prefixMap.get(tmp) === undefined) {
            part1Sum += arr[cut1];
            continue;
        }

        let cut2 = (prefixMap.get(tmp) as number) + 1;
        const tmp2 = tmp + arr[cut2] + part1Sum;
        if (prefixMap.get(tmp2) === undefined) {
            // 第二个位置不存在说明第一个位置是不可以作为第一刀的
            part1Sum += arr[cut1];
            continue;
        }

        let cut3 = (prefixMap.get(tmp2) as number) + 1;
        const tmp3 = tmp2 + arr[cut3] + part1Sum;
        if (prefixMap.get(tmp3) === undefined) {
            // 第三个位置不存在说明第一个位置是不可以作为第一刀的
            part1Sum += arr[cut1];
            continue;
        }

        // 三个位置都找到了，最后一个sum出现的位置必须是arr.length-1
        return (prefixMap.get(tmp3) as number) === arr.length - 1;
    }

    return false;
}

/* 
如果一个数的因子中只包含2,3,5这三个数字，那么我们说这个数是丑数，1我们认为规定是丑数
那么前面几个丑数是1 2 3 4 5 6 8 9 10 12 15
问第n个丑数是多少？

思想：从前面的丑数乘以2,3,5选出其中最小的作为下一个丑数
*/
export function getNthUglyNumber(n: number): number {
    if (n === 1) {
        return 1;
    }

    const result = [1];
    let i2 = 0;
    let i3 = 0;
    let i5 = 0;

    while (result.length < n) {
        const nextUglyNumberI2 = result[i2] * 2;
        const nextUglyNumberI3 = result[i3] * 3;
        const nextUglyNumberI5 = result[i5] * 5;

        const nextUglyNumber = Math.min(nextUglyNumberI2, nextUglyNumberI3, nextUglyNumberI5);
        result.push(nextUglyNumber);

        if (nextUglyNumber === nextUglyNumberI2) {
            i2++;
        }
        if (nextUglyNumber === nextUglyNumberI3) {
            i3++;
        }
        if (nextUglyNumber === nextUglyNumberI5) {
            i5++;
        }
    }

    return result[n - 1];
}

/* 
给定一个无序数组，只能对其中一个子数组进行排序就能使得整体从小到大排序，问这个子数组的长度是多少

例如
arr:[1,5,3,2,4,6,7]
最小需要排序的子数组是 [5,3,2,4] 所以返回 [5,3,2,4]

分析思路：如果真的排序完毕右边有哪些位置是不需要动的，左边有哪些位置是不需要动的？
右边不需要动的位置 大于等于左边的最大值
左边不需要动的位置 小于等于右边的最小值
*/
export function getMinSubArrThatShouldBeSorted(arr: number[]): number[] {
    if (!arr || arr.length < 2) {
        return [];
    }

    // 找到右边不需要动的位置的前一个位置
    let leftMax = arr[0];
    let right = arr.length - 1;
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] < leftMax) {
            right = i;
        }
        leftMax = Math.max(leftMax, arr[i]);
    }

    // 找到左边不需要动的位置的后一个位置
    let rightMin = arr[arr.length - 1];
    let left = 0;
    for (let i = arr.length - 2; i >= 0; i--) {
        if (arr[i] > rightMin) {
            left = i;
        }
        rightMin = Math.min(rightMin, arr[i]);
    }

    return arr.slice(left, right + 1);
}

/* 
给定一个正数数组 arr，其中所有的值都为整数，以下是最小不可组成和的概念：
把 arr 每个子集内的所有元素加起来会出现很多值，其中最小的记为 min，最大的记为max 在区间【min，max】上，如果有数不可以被arr某一个子集相加得到，那么其中最小的那个数是arr 的最小不可组成和
在区间【min，max】上，如果所有的数都可以被arr的某一个子集相加得到，那么max+1是arr的最小不可组成和
请写函数返回正数数组 arr 的最小不可组成和。

【举例】
arr=【3，2，5】。子集{2】相加产生 2为 min，子集【3，2，5】相加产生 10 为 max。在区间【2，10】上，4、6和9不能被任何子集相加得到，其中4是arr的最小不可组成和。
arr=【1，2，4】。子集【1】相加产生1为min，子集{1，2，4}相加产生7为max。在区间【1，7】上，任何 数都可以被子集相加得到，所以8是 arr 的最小不可组成和。

【进阶】
如果已知正数数组 arr 中肯定有1 这个数，是否能更快地得到最小不可组成和？
*/
export function getMinSumThatCanNotBeComposed(arr: number[]): number {
    const sum = arr.reduce((acc, cur) => acc + cur, 0);

    // 背包问题
    // dp[i][sum] 自由使用i以及以后的数字能否弄出sum
    const dp: boolean[][] = new Array(arr.length + 1).fill(0).map((_) => new Array(sum + 1).fill(false));
    // dp[i][0]=true
    for (let i = 0; i <= arr.length; i++) {
        dp[i][0] = true;
    }

    // 从下到上填表，从左到右，最上面一行从左到右第一个为false的数字就是最小不可组成和，若全都是true则sum+1就是最小不可组成和
    for (let i = arr.length - 1; i >= 0; i--) {
        for (let rest = 1; rest <= sum; rest++) {
            if ((rest - arr[i] >= 0 && dp[i + 1][rest - arr[i]]) || dp[i + 1][rest]) {
                dp[i][rest] = true;
            }
        }
    }

    const min = Math.min(...arr);
    let minSum = sum + 1;
    // 根据不可组成和的定义，我们这里需要从min开始遍历
    for (let rest = min; rest <= sum; rest++) {
        if (dp[0][rest] === false) {
            minSum = rest;
            break;
        }
    }

    return minSum;
}

/* 
进阶问题，如果已知正数数组 arr 中肯定有1 这个数，是否能更快地得到最小不可组成和？ 

分析：从小往外推
1可以搞定 1-1范围内所有的数
再加2就可以搞定 1-(1+2)范围内所有的数
再加4就可以搞定1-(1+2+4)范围内所有的数字 
依次类推，只要前面的范围(range)是连续的，那么后面只要增加一个range+1就可以把整体的范围扩展到
range+range+1
*/
export function getMinSumThatCanNotBeComposed1(arr: number[]): number {
    arr.sort((a, b) => a - b);

    let range = 1;
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] > range + 1) {
            break;
        }

        range += arr[i];
    }

    return range + 1;
}

/* 
给定一个有序的正数数组arr和一个正数range，如果可以自由选择arr中的数字，想累加得到1~range范围上所有的数，返回arr最少还缺几个数。

【举例】
arr = {1,2,3,7},range = 15
想累加得到1~15范围上所有的数，arr还缺14这个数，所以返回1

arr = {1,5,7},range = 15
想累加得到1~15范围止所有的数，arr还缺2和4，所以返回2
*/
export function countLostNumbers(arr: number[], range: number): number {
    let touch = 0;
    let count = 0;

    for (let i = 0; i < arr.length; ) {
        if (touch >= range) {
            break;
        }

        if (arr[i] > touch + 1) {
            touch += touch + 1;
            count++;
        } else {
            // 当前数字被使用了再跳到下一个数字
            touch += arr[i++];
        }
    }

    // 数字用完了还没达到
    while (touch < range) {
        touch += touch + 1;
        count++;
    }

    return count;
}

/* 
给定一个不含有1的正数数组arr，假设其中任意两个数为a和b，如果a和b的最大公约数比1大，那么认为a和b之间有路相连；
如果a和b的最大公约数是1，认为a和b之间没有路相连。那么arr中所有的数字就可以组成一张图，

1，求arr中有多少个连通区域
2，求arr中的最大的连通区域中有多少个数。

分析：连通性问题，用并查集来做
*/

// 简单的包一层，用于支持重复val
class UnionFindNode {
    val: number;
    constructor(val: number) {
        this.val = val;
    }
}

class UnionFind {
    // 用于判断节点是否加入并查集中
    set: Set<UnionFindNode>;
    // 用于维护节点与节点之间的父子关系
    parents: Map<UnionFindNode, UnionFindNode> = new Map();
    // 当且仅当一个节点是一个集合的代表节点时才在sizeMap中有一条记录
    // 用于集合合并时小挂大，查询效率
    sizeMap: Map<UnionFindNode, number> = new Map();

    constructor(nodes: UnionFindNode[]) {
        this.set = new Set(nodes);

        nodes.forEach((node) => {
            this.parents.set(node, node);
            this.sizeMap.set(node, 1);
        });
    }

    public isSameSet(nodeA: UnionFindNode, nodeB: UnionFindNode) {
        if (!this.set.has(nodeA) || !this.set.has(nodeB)) {
            return false;
        }

        return this.findParent(nodeA) === this.findParent(nodeB);
    }

    // 将nodeA和nodeB背后的集合合并在一起
    public union(nodeA: UnionFindNode, nodeB: UnionFindNode) {
        if (!this.set.has(nodeA) || !this.set.has(nodeB)) {
            return;
        }

        const parentA = this.parents.get(nodeA) as UnionFindNode;
        const parentB = this.parents.get(nodeB) as UnionFindNode;
        if (parentA === parentB) {
            return;
        }

        // 小集合挂在大集合的下面
        const sizeA = this.sizeMap.get(parentA) as number;
        const sizeB = this.sizeMap.get(parentB) as number;
        const large = sizeA >= sizeB ? parentA : parentB;
        const small = large === parentA ? parentB : parentA;

        this.parents.set(small, large);
        this.sizeMap.delete(small);
        this.sizeMap.set(large, sizeA + sizeB);
    }

    private findParent(node: UnionFindNode) {
        if (!this.set.has(node)) {
            return;
        }

        let cur = node;
        const nodes: UnionFindNode[] = [];
        while (cur !== this.parents.get(cur)) {
            nodes.push(cur);
            cur = this.parents.get(cur) as UnionFindNode;
        }

        // 节点打平优化下次查找效率
        nodes.forEach((curNode) => {
            this.parents.set(curNode, cur);
        });

        return cur;
    }
}

export function getConnectedRegions(arr: number[]): number[] {
    const nodes = arr.map((val) => new UnionFindNode(val));
    const unionFind = new UnionFind(nodes);

    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const nodeA = nodes[i];
            const nodeB = nodes[j];

            // 已经在一个集合里面直接下一个
            if (unionFind.isSameSet(nodeA, nodeB)) {
                continue;
            }

            // 不在一个集合里面计算下最大公约数
            const k = maxCommonFactor(nodeA.val, nodeB.val);
            if (k !== 1) {
                unionFind.union(nodeA, nodeB);
            }
        }
    }

    let max = -Infinity;
    unionFind.sizeMap.forEach((size) => {
        max = Math.max(max, size);
    });

    return [unionFind.sizeMap.size, max];
}

// 通过找齐一个数代表因子的方式来连接
export function getConnectedRegions2(arr: number[]) {
    // 我们把所有的下标加入并查集中，后面根据因子在某个位置出现过来直接合并下标
    const unionSet = new UnionSet(new Array(arr.length).fill(0).map((_, i) => i));

    const map: Map<number, number> = new Map();
    for (let i = 0; i < arr.length; i++) {
        let k = 1;
        while (k <= Math.floor(Math.sqrt(arr[i]))) {
            // 一旦整除我们就找到关于arr[i]的两个因子（k和arr[i]/k）
            if (arr[i] % k === 0) {
                const prev1 = map.get(k);
                const prev2 = map.get(arr[i] / k);

                // k这个因子之前没出现过，直接加入
                if (prev1 === undefined) {
                    map.set(k, i);
                } else {
                    // 出现过且共同因子大于1则合并两个集合
                    if (k !== 1) {
                        unionSet.union(prev1, i);
                    }
                }

                if (prev2 === undefined) {
                    map.set(arr[i] / k, i);
                } else {
                    unionSet.union(prev2, i);
                }
            }
            k++;
        }
    }

    let max = -Infinity;
    unionSet.sizeMap.forEach((size) => {
        max = Math.max(max, size);
    });

    return [unionSet.sizeMap.size, max];
}

/* 
收买怪兽问题
给定两个数组，arr1[i]和arr2[i]分别表示怪兽的能力和收买所需的钱数

一开始人的能力值是0，花钱收买怪兽之后怪兽的能力值可以叠加到人身上
当人的能力值低于当前怪兽的能力值时必须收买才能过，当人的能力高于或等于当前怪兽的能力值时可收买也可不收买
问通过所有怪兽所需要的最少钱数是多少
*/
export function getMinMoneyOfPassingMonster(arr1: number[], arr2: number[]): number {
    if (arr1.length === 0) {
        return 0;
    }

    return getMinMoneyProcess(arr1, arr2, 0, 0);
}

function getMinMoneyProcess(arr1: number[], arr2: number[], i: number, power: number): number {
    if (i === arr1.length) {
        return 0;
    }

    // 两种选择，收买或者不收买，不收买有条件（power>=arr1[i]）
    if (power < arr1[i]) {
        return arr2[i] + getMinMoneyProcess(arr1, arr2, i + 1, power + arr1[i]);
    }

    return Math.min(
        arr2[i] + getMinMoneyProcess(arr1, arr2, i + 1, power + arr1[i]),
        getMinMoneyProcess(arr1, arr2, i + 1, power)
    );
}

export function getMinMoneyOfPassingMonsterDp(arr1: number[], arr2: number[]): number {
    const maxPower = arr1.reduce((acc, cur) => acc + cur, 0);

    // dp[i][power] 返回值dp[0][0]
    const dp: number[][] = new Array(arr1.length + 1).fill(0).map((_) => new Array(maxPower + 1).fill(0));

    // 从下到上，从右到左填表
    for (let i = arr1.length - 1; i >= 0; i--) {
        for (let power = maxPower; power >= 0; power--) {
            if (power < arr1[i]) {
                dp[i][power] = arr2[i] + dp[i + 1][power + arr1[i]];
            } else {
                dp[i][power] = Math.min(arr2[i] + dp[i + 1][power + arr1[i]], dp[i + 1][power]);
            }
        }
    }

    return dp[0][0];
}

// 数组滚动压缩空间
export function getMinMoneyOfPassingMonsterDp2(arr1: number[], arr2: number[]): number {
    const maxPower = arr1.reduce((acc, cur) => acc + cur, 0);

    // dp[i][power] 返回值dp[0][0]
    const dp: number[] = new Array(maxPower + 1).fill(0);
    let prevDp = dp.slice();

    // 从下到上，从右到左填表
    for (let i = arr1.length - 1; i >= 0; i--) {
        for (let power = maxPower; power >= 0; power--) {
            if (power < arr1[i]) {
                dp[power] = arr2[i] + prevDp[power + arr1[i]];
            } else {
                dp[power] = Math.min(arr2[i] + prevDp[power + arr1[i]], prevDp[power]);
            }
        }

        prevDp = dp.slice();
    }

    return dp[0];
}

// 根据输入状况来判断动态规划方案是否可行
// 假如怪兽的能力值很大，那么maxPower的变化范围就会很大，这时候我们就不太适合用maxPower来做表
export function getMinMoneyOfPassingMonsterDp3(arr1: number[], arr2: number[]): number {
    const maxMoney = arr2.reduce((acc, cur) => {
        acc += cur;
        return acc;
    }, 0);

    // dp[i][j] 通过i号怪兽，严格花j块钱所能达到的最大能力值
    const dp: number[][] = new Array(arr1.length).fill(0).map((_) => new Array(maxMoney + 1).fill(-1));
    dp[0][arr2[0]] = arr1[0];

    // 从上到下从左到右填表
    for (let i = 1; i < arr1.length; i++) {
        for (let j = 1; j < maxMoney; j++) {
            // 不花钱
            const p1 = dp[i - 1][j] >= arr1[i] ? dp[i - 1][j] : -1;
            // 花钱
            const p2 = j - arr2[i] >= 0 && dp[i - 1][j - arr2[i]] !== -1 ? dp[i - 1][j - arr2[i]] + arr1[i] : -1;

            dp[i][j] = Math.max(p1, p2);
        }
    }

    let result = maxMoney;
    for (let j = 1; j <= maxMoney; j++) {
        if (dp[arr1.length - 1][j] !== -1) {
            result = j;
            break;
        }
    }

    return result;
}

export function getMinMoneyOfPassingMonsterDp4(arr1: number[], arr2: number[]): number {
    const maxMoney = arr2.reduce((acc, cur) => acc + cur, 0);

    // dp[i][j] 通过i号怪兽，严格花j块钱所能达到的最大能力值
    const dp: number[] = new Array(maxMoney + 1).fill(-1);
    dp[arr2[0]] = arr1[0];
    let prevDp = dp.slice();

    // 从上到下从左到右填表
    for (let i = 1; i < arr1.length; i++) {
        for (let j = 1; j < maxMoney; j++) {
            // 不花钱
            const p1 = dp[j] >= arr1[i] ? prevDp[j] : -1;
            // 花钱
            const p2 = j - arr2[i] >= 0 && prevDp[j - arr2[i]] !== -1 ? prevDp[j - arr2[i]] + arr1[i] : -1;

            dp[j] = Math.max(p1, p2);
        }
        prevDp = dp.slice();
    }

    let result = maxMoney;
    for (let j = 1; j <= maxMoney; j++) {
        if (dp[j] !== -1) {
            result = j;
            break;
        }
    }

    return result;
}

/* 
先给出可整合数组的定义：如果一个数组在排序之后，每相邻两个数差的绝对值都为1，则该数组为可整合数组。
例如，【5，3，4，6，2】排序之后为【2，3，4，5，6】，符合每相邻两个数差的绝对值 都为 1，所以这个数组为可整合数组。

给定一个整型数组 arr，请返回其中最大可整合子数组的长度。
例如，【5，5，3，2，6，4，3】的最大 可整合子数组为【5，3，2，6，4】，所以返回 5。

启示：如果题目给的判断标准会使得时间复杂度变得极为复杂，那就要想办法找到等价的其他判断方式
如果本问题使用题目给的标准则暴力方法的解时间复杂度就是O(n^3log(n))

可整合数组的等价定义是首先子数组内无重复值，且最大值和最小值的差值等于个数减1，用这样的标准可以使得时间复杂度变为O(n^2)
*/
export function getMaxLenOfComposableSubArr(arr: number[]): number {
    if (arr.length < 2) {
        return 0;
    }

    let left = 0;
    let right = 0;
    let max = arr[0];
    let min = arr[0];
    let result = 0;

    const set: Set<number> = new Set();
    while (left < arr.length) {
        set.clear();

        set.add(arr[left]);
        max = arr[left];
        min = arr[left];
        right = left + 1;

        // left固定，right向右
        while (right < arr.length) {
            // 有重复值必然不是可整合数组，直接break
            if (set.has(arr[right])) {
                left++;
                break;
            }

            max = Math.max(max, arr[right]);
            min = Math.min(min, arr[right]);

            // 无重复值且最大值减去最小值等于个数减1
            if (max - min === right - left) {
                result = Math.max(result, max - min + 1);
            }
            right++;
        }

        // 无重复值说明是right越界后跳出循环的，left向右移动
        if (!set.has(arr[right])) {
            left++;
        }
    }

    return result;
}

/* 
给定一个字符串str，只能在str的后面添加字符，生成一个更长的字符串，更长的字符串需要包含两个str，且两个str开始的位置不能一样。求最少添加多少个字符。比如：
str = "123123"，后面最少添加"123"，变成"123123123123"，其中包含两个str，且两个str开始的位置不一样。所以返回3

// kmp算法
*/
export function getMinStrCount(str: string) {
    // 先求str.length位置的最长前缀和最长后缀匹配长度
    let count = 1;
    let max = 0;
    while (count < str.length) {
        const prefix = str.slice(0, count);
        const suffix = str.slice(str.length - count, str.length);
        if (prefix === suffix) {
            max = count;
        }
        count++;
    }

    return str.length - max;
}

/* 
递归类题目，（压缩字符串，公式求解）统一用递归函数来求解
可以自己用堆栈来做，不过相当于要自己维护栈信息，代码相对来说更不好写一点

已知某个字符串只含有小写字母，压缩之后的字符串str包含数字、大括号和小写字符。请根据str还原出原始字符串并返回。
比如：
3{2{abc}} -> abcabcabcabcabcabc 
3{a}2{bc} -> aaabcbc 
3{a2{c}} -> accaccacc
*/
export function unzipStr(str: string): string {
    const [result] = unzipStrProcess(str, 0);
    return result;
}

// 从start位置开始解析，遇到右括号或者结尾就终止，返回解析后的字符串和终止位置
function unzipStrProcess(str: string, start: number): [result: string, end: number] {
    let result = '';
    let times = 0;

    while (start < str.length) {
        // 遇到右括号就终止
        if (str[start] === '}') {
            break;
        }

        // 遇到左括号就递归调用子函数去获取结果
        if (str[start] === '{') {
            const [subResult, subEnd] = unzipStrProcess(str, start + 1);
            start = subEnd + 1;
            result += times > 0 ? repeat(times, subResult) : subResult;
            times = 0;
        } else {
            const num = parseInt(str[start]);
            if (num >= 0 && num <= 9) {
                times = times * 10 + num;
            } else {
                result += times > 0 ? repeat(times, str[start]) : str[start];
            }
            start++;
        }
    }

    return [result, start];
}

function repeat(times: number, str: string) {
    return new Array(times).fill(str).join('');
}

/* 
给定一个有序数组arr，和一个整数aim，请不重复打印arr中所有累加和为aim的二元组。

分析思路：
left指向0，right指向arr.length-1
[left]+[right] < aim left++
[left]+[right] > aim right--
[left]+[right] === aim left跳过所有相等位置，right跳过所有相等位置
*/
export function getAllTwoTuples(arr: number[], target: number, left: number = 0): number[][] {
    let right = arr.length - 1;
    const result: number[][] = [];

    while (left <= right) {
        if (arr[left] + arr[right] < target) {
            left++;
        } else if (arr[left] + arr[right] > target) {
            right--;
        } else {
            result.push([arr[left], arr[right]]);

            // 相等的组合直接跳过
            const prevLeft = left;
            const prevRight = right;
            while (arr[++left] === arr[prevLeft]) {
                // empty block
            }
            while (arr[--right] === arr[prevRight]) {
                // empty block
            }
        }
    }

    return result;
}

/* 
给定一个有序数组arr，和一个整数aim，请不重复打印arr中所有累加和为aim的三元组。

分析：第一个数固定，右边玩二元组
*/
export function getAllTriples(arr: number[], target: number): number[][] {
    let left = 0;
    const result: number[][] = [];

    while (left < arr.length) {
        const allTwoTuples = getAllTwoTuples(arr, target - arr[left], left + 1);
        if (allTwoTuples.length > 0) {
            result.push(...allTwoTuples.map((val) => [arr[left], ...val]));
        }

        // 跳过所有相同位置
        const prevLeft = left;
        while (arr[++left] === arr[prevLeft]) {
            // empty block
        }
    }

    return result;
}

/* 
给定一个无序数组，要求找出数组中缺失的最小正整数 
例如
[0,-1,3,5,4,2,1] 6
[0,-1,3,6,4,2,1] 5
*/
export function getMinMissingNumber(arr: number[]): number {
    let left = 0;
    let right = arr.length;

    while (left < right) {
        if (arr[left] < left + 1 || arr[left] > right) {
            // 当前数字范围不在 left+1 到 right之间，把left位置的数丢进垃圾区
            swap(arr, left, --right);
        } else if (arr[left] === left + 1) {
            left++;
        } else if (arr[left] === arr[arr[left] - 1]) {
            // 重复出现值也直接丢进垃圾区
            swap(arr, left, --right);
        } else {
            swap(arr, left, arr[left] - 1);
        }
    }

    return left + 1;
}

// 给定一个无序数组，求数组的第k大元素
export function findKthLargest(arr: number[], k: number): number {
    let left = 0;
    let right = arr.length - 1;
    // 平均情况下每次分区只取一半的数字，也就是说总体时间复杂度是
    // n + (n/2) + (n/4) + ...
    // 最终结果不超过2n
    // 从而使得整体时间复杂度是O(n)
    while (left < right) {
        const p = partition(arr, left, right);
        if (p + 1 === k) {
            return arr[p];
        } else if (p + 1 > k) {
            right = p - 1;
        } else {
            left = p + 1;
        }
    }

    return arr[left];
}

function partition(arr: number[], left: number, right: number): number {
    const numBetweenLeftAndRight = Math.ceil(Math.random() * (right - left)) + left;
    swap(arr, numBetweenLeftAndRight, right);

    const prevRight = right;
    const target = arr[right];
    // 大于等于放左边，小于放右边
    while (left < right) {
        if (arr[left] >= target) {
            left++;
        } else {
            swap(arr, left, --right);
        }
    }

    swap(arr, left, prevRight);
    return left;
}

/* 
要求实现一个结构可以不按序接收消息，但是可以按序打印

例：
收到消息的顺序是 4,5,3,2,1
打印的消息：1,2,3,4,5
*/

class MessageNode<V> {
    val: V;
    next: MessageNode<V> | undefined = undefined;

    constructor(val: V) {
        this.val = val;
    }
}

export class MessageBox<V> {
    // 记录所有待打印链表头结点
    headMap: Map<number, MessageNode<V>> = new Map();
    // 记录所有待打印链表尾节点（以空间换时间，不然需要从头结点遍历到尾节点才能知道链表结尾在哪里）
    tailMap: Map<number, MessageNode<V>> = new Map();
    waitPoint = 1;

    public receive(num: number, val: V) {
        if (num < 1) {
            return;
        }

        const node = new MessageNode(val);
        // 构建一个num~num的单链表
        this.headMap.set(num, node);
        this.tailMap.set(num, node);

        // 存在num-1结尾的链表
        if (this.tailMap.has(num - 1)) {
            this.tailMap.get(num - 1)!.next = node;
            this.tailMap.delete(num - 1);
            this.headMap.delete(num);
        }

        // 存在num+1开头的链表
        if (this.headMap.has(num + 1)) {
            node.next = this.headMap.get(num + 1)!;
            this.headMap.delete(num + 1);
            this.tailMap.delete(num);
        }

        if (this.waitPoint === num) {
            this.print();
        }
    }

    private print() {
        let node: MessageNode<V> | undefined = this.headMap.get(this.waitPoint);
        this.headMap.delete(this.waitPoint);

        while (node) {
            console.log(node.val);
            node = node.next;
            this.waitPoint++;
        }

        this.tailMap.delete(this.waitPoint - 1);
    }
}

/* 
给定一系列有序数组，求一个范围使得所有数组都有数字落在这个范围内，返回符合条件的最小的范围
*/
class MinRangeNode {
    val: number;
    arrIndex: number;
    index: number;

    constructor(val: number, arrIndex: number, index: number) {
        this.val = val;
        this.arrIndex = arrIndex;
        this.index = index;
    }
}
export function getMinRange(arr: number[][]): number[] {
    const skipSet = new SkipSet<MinRangeNode>((a, b) => a.val - b.val);

    for (let i = 0; i < arr.length; i++) {
        if (arr[i].length > 0) {
            skipSet.add(new MinRangeNode(arr[i][0], i, 0));
        }
    }

    let min = -Infinity;
    let max = Infinity;
    if (skipSet.isEmpty()) {
        return [];
    }

    while (!skipSet.isEmpty()) {
        const { val: minVal, arrIndex: minArrIndex, index: minIndex } = skipSet.first()!;
        const { val: maxVal } = skipSet.last()!;

        // 找到了一个更小的范围
        if (maxVal - minVal < max - min) {
            min = minVal;
            max = maxVal;
        }

        // 删除最小值
        skipSet.delete(skipSet.first()!);

        // 加入最小值的下一个值
        if (minIndex + 1 < arr[minArrIndex].length) {
            skipSet.add(new MinRangeNode(arr[minArrIndex][minIndex + 1], minArrIndex, minIndex + 1));
        } else {
            break;
        }
    }

    return [min, max];
}

/* 
添加最少字符使字符串整体都是回文字符串
给定一个字符串 str，如果可以在 str 的任意位置添加字符，请返回在添加字符最少的情况下，让 str 整体都是回文字符串的一种结果。

【举例】
str="ABA"。str 本身就是回文串，不需要添加字符，所以返回"ABA"。
str="AB"。可以在'A'之前添加'B'，使 str整体都是回文串，故可以返回"BAB"。也可以在"B'之后添加'A'，使 str整体都是回文串，故也可以返回"ABA"。
总之，只要添加的字符数最少，返回其中一种结果即可。

进阶问题
给定一个字符串 str，再给定 str 的最长回文子序列字符串，请返回在添加 字符最少的情况下，让 str整体都是回文字符串的一种结果。
进阶问题比原问题多了一个参数，请做到时间复杂度比原问题的实现低。

范围尝试模型
*/
// 先求使得str成为回文字符最少需要添加几个字符
function getMinCharCountDp(str: string): number[][] {
    // dp[left][right] 使得从left到right范围上的字符串变成回文最少需要添加几个字符
    const dp: number[][] = new Array(str.length).fill(0).map((_) => new Array(str.length).fill(0));

    // 从下往上，从左往右填表
    for (let left = str.length - 2; left >= 0; left--) {
        for (let right = left + 1; right < str.length; right++) {
            dp[left][right] = Math.min(dp[left + 1][right] + 1, dp[left][right - 1] + 1);
            if (left + 1 === right && str[left] === str[right]) {
                dp[left][right] = 0;
            }
            if (left + 1 <= right - 1 && str[left] === str[right]) {
                dp[left][right] = Math.min(dp[left][right], dp[left + 1][right - 1]);
            }
        }
    }

    return dp;
}

// 然后根据dp表还原出一种回文字符串
export function getMinPalindrome(str: string): string {
    const dp = getMinCharCountDp(str);

    let left = 0;
    let right = str.length - 1;

    const result: string[] = new Array(str.length + dp[left][right]);
    let i = 0;
    let j = result.length - 1;

    while (left <= right) {
        let curStr: string;

        // 当前值来源于左下角的值，此处不能用 dp[left + 1][right-1] === dp[left][right]来判断当前值来源于左下角的值
        // 因为即使dp[left + 1][right-1] === dp[left][right]也有可能来源于左边或者下面的值
        if (left + 1 <= right - 1 && str[left] === str[right]) {
            curStr = str[left++];
            right--;
        } else if (left + 1 <= right && dp[left + 1][right] + 1 === dp[left][right]) {
            curStr = str[left++];
        } else {
            curStr = str[right--];
        }

        result[i++] = curStr;
        result[j--] = curStr;
    }

    return result.join('');
}

/* 
每个位置都可以走向左、右、上、下四个方向，找到
给定一个整型矩阵nums 其中最长的递增路径

【例子】nums = [ [9,9,4], [6,6,8], [2,1,1] ] 
输出：4 最长的递增路径为：【1，2，6，9】

nums = [[3,4,5], [3,2,6], [2,2,1]]
输出：4 最长的递增路径为：【3，4，5，6】

任意位置都依赖于上下左右四个方向的位置，无法通过常规的方式得到动态规划表，直接用傻缓存法
*/
export function getMaxIncreasingNum(arr: number[][]): number {
    let max = -Infinity;
    const dp: number[][] = new Array(arr.length).fill(0).map((_) => new Array(arr[0].length).fill(undefined));

    for (let row = 0; row < arr.length; row++) {
        for (let col = 0; col < arr[0].length; col++) {
            max = Math.max(max, maxIncreasingProcess(arr, row, col, dp));
        }
    }

    return max;
}

// 从row和col出发走出的最长路径
function maxIncreasingProcess(arr: number[][], row: number, col: number, dp: number[][]): number {
    if (dp[row][col] !== undefined) {
        return dp[row][col];
    }

    // 往上走
    let upNext = 0;
    if (row - 1 >= 0 && arr[row - 1][col] > arr[row][col]) {
        upNext = maxIncreasingProcess(arr, row - 1, col, dp);
    }

    // 往下走
    let downNext = 0;
    if (row + 1 < arr.length && arr[row + 1][col] > arr[row][col]) {
        downNext = maxIncreasingProcess(arr, row + 1, col, dp);
    }

    // 往左走
    let leftNext = 0;
    if (col - 1 >= 0 && arr[row][col - 1] > arr[row][col]) {
        leftNext = maxIncreasingProcess(arr, row, col - 1, dp);
    }

    // 往右走
    let rightNext = 0;
    if (col + 1 < arr[0].length && arr[row][col + 1] > arr[row][col]) {
        rightNext = maxIncreasingProcess(arr, row, col + 1, dp);
    }

    dp[row][col] = Math.max(upNext, downNext, leftNext, rightNext) + 1;
    return dp[row][col];
}

/* 
给定一个整型数组，找到不大于k的最大子数组累加和

分析：
流程设定，求子数组必须以i位置结尾所得到的子数组中sum最接近k且小于k的值 返回全局最大值
要求以i位置结尾所得到的子数组中sum最接近k且小于k的值，就等于求i前面的某个前缀和大于等于 sum[0-i] - k 且距离最近的

比如说i位置是17，sum[0-i] = 1000
k=100
sum[0-14] 是前缀和中大于等于900且离900最近的，那么sum[15-17] 就是以17为结尾的子数组中sum离100最近且小于等于100的

可以将i之前的前缀和存入有序表中，然后用ceil求大于等于某个值且离某个值最近的值
*/
export function getClosestSumK(arr: number[], k: number): number {
    const skipSet = new SkipSet<number>();
    // 此处的0必须加，否则就会漏掉以0结尾的子数组
    skipSet.add(0);

    let max = -Infinity;
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
        sum += arr[i];

        // 找到skipSet中离 sum - k最近的值
        const ceil = skipSet.ceil(sum - k);
        if (ceil !== null && ceil !== undefined) {
            max = Math.max(max, sum - ceil);
        }

        skipSet.add(sum);
    }

    return max;
}

/* 
给定一个整型矩阵nums和一个整数K，找到不大于K的最大子矩阵累加和

分析，先解决子数组的问题，然后将矩阵压缩为数组来解决
*/
export function getClosestSumKOfMatrix(matrix: number[][], k: number): number {
    // 列方向上的前缀和
    const preSum: number[][] = new Array(matrix.length).fill(0).map((_) => new Array(matrix[0].length).fill(0));

    for (let j = 0; j < matrix[0].length; j++) {
        let sum = 0;
        for (let i = 0; i < matrix.length; i++) {
            sum += matrix[i][j];
            preSum[i][j] = sum;
        }
    }

    // 压缩层数
    let count = 1;
    const zeros = new Array(matrix[0].length).fill(0);
    let max = -Infinity;
    while (count <= matrix.length) {
        // 从第0层开始
        let start = 0;
        while (start + count - 1 < matrix.length) {
            let compressed;
            if (start === 0) {
                // 求0-count-1层的列前缀和
                compressed = zeros.map((_, j) => preSum[0 + count - 1][j]);
            } else {
                // 求start到start+count-1层的前缀和
                compressed = zeros.map((_, j) => {
                    return preSum[start + count - 1][j] - preSum[start - 1][j];
                });
            }
            max = Math.max(max, getClosestSumK(compressed, k));

            start += count;
        }

        count++;
    }

    return max;
}

/* 
无向图节点类型如下

class UndirectedGraphNode{
    int label;
    List<UndirectedGraphNode> neighbors;

    UndirectedGraphNode(int x){
        label=x;
    }

    neighbors=new ArrayList<UndirectedGraphNode>(); 
}

由以上的节点结构组成了一张无向图，给定一个出发点node，请你克隆整张图

分析：
1) 遍历一次拿到所有的节点对应的copy节点放入map中
2) 再遍历一次连好所有copy节点
*/
class UndirectedGraphNode {
    label: number;
    neighbors: UndirectedGraphNode[] = [];

    constructor(label: number) {
        this.label = label;
    }
}

export function cloneGraphNodeMap(node: UndirectedGraphNode): UndirectedGraphNode {
    // 先遍历一次复制出所有节点放入map
    const map: Map<UndirectedGraphNode, UndirectedGraphNode> = new Map();

    // 宽度优先遍历
    const queue = new Queue<UndirectedGraphNode>();
    queue.add(node);
    const head = new UndirectedGraphNode(node.label);
    map.set(node, head);

    while (!queue.isEmpty()) {
        const cur = queue.poll() as UndirectedGraphNode;

        cur.neighbors.forEach((neighbor) => {
            if (map.has(neighbor)) {
                return;
            }

            const copy = new UndirectedGraphNode(neighbor.label);
            map.set(neighbor, copy);
            queue.add(neighbor);
        });
    }

    map.forEach((cur) => {
        const copy = map.get(cur) as UndirectedGraphNode;
        copy.neighbors = cur.neighbors.map((neighbor) => map.get(neighbor) as UndirectedGraphNode);
    });

    return map.get(node) as UndirectedGraphNode;
}

/* 
给定一个由字符组成的矩阵board，还有一个字符串数组words，里面有很多字符串（word）。
在board中找word是指，从board某个位置出发，每个位置都可以走向左、右、上、下四个方向，但不能重复经过一个位置。
返回在board中能找到哪些word。

【例子】board=
['o','a','a','n'], 
['e','t','a','e'], 
['i','h','k','r'], 
['i','f','l','v']

words = ["oath","pea","eat","rain"]
输出： 【"eat"，"oath"】

从第2行最右边的'e'出发，向左找到'，再向左找到't'，就搞定了"eat"
从第1行最左边的“o’出发，向右找到’a’，向下找到“，再向下找到”，就搞定了“oath”
*/
export function findWords(board: string[][], words: string[]): string[] {
    const prefixTree = new PrefixTree();
    new Set(words).forEach((word) => {
        prefixTree.add(word);
    });

    const result: Set<string> = new Set();
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[0].length; col++) {
            findWordsProcess(board, row, col, prefixTree.head, '', result);
        }
    }

    return Array.from(result);
}

function findWordsProcess(
    board: string[][],
    row: number,
    col: number,
    node: PrefixTreeNode,
    path: string,
    result: Set<string>
): number {
    const char = board[row][col];
    if (char === '') {
        return 0;
    }

    const index = getCharIndex(char);
    const nextNode = node.nextNodes[index];
    if (!nextNode || nextNode.pass === 0) {
        return 0;
    }
    // 当前字符加入path
    path = path + char;

    // 当前字符走过之后设置为空，避免重复走
    board[row][col] = '';

    let fix = 0;
    if (nextNode.end !== 0) {
        result.add(path);
        nextNode.end--;
        fix++;
    }

    // 尝试上下左右四个方向
    fix += tryNewRowCol(board, row - 1, col, nextNode, path, result);
    fix += tryNewRowCol(board, row + 1, col, nextNode, path, result);
    fix += tryNewRowCol(board, row, col - 1, nextNode, path, result);
    fix += tryNewRowCol(board, row, col + 1, nextNode, path, result);

    // 递归结束之后恢复现场
    board[row][col] = char;
    nextNode.pass -= fix;

    return fix;
}

function tryNewRowCol(
    board: string[][],
    row: number,
    col: number,
    nextNode: PrefixTreeNode,
    path: string,
    result: Set<string>
): number {
    if (row < 0 || row >= board.length || col < 0 || col >= board[0].length) {
        return 0;
    }

    if (nextNode) {
        return findWordsProcess(board, row, col, nextNode, path, result);
    }
    return 0;
}

/* 
有序数组 arr可能经过一次旋转处理，也可能没有，且arr可能存在重复的数。

例如，有序数组【1，2，3，4，5，6，7】，可以旋转处理成【4，5，6，7，1，2，3】等。
给定一个可能旋转过的有序数组 arr，返回arr中的最小值。

所谓数组旋转指的是把左边n个数放在右边

二分未必要全局有序，只要二分之后能够通过某些标准缩小范围就可以了
*/
export function getMinValue(arr: number[]): number {
    let left = 0;
    let right = arr.length - 1;

    // left到right范围上有全局最小值
    while (left < right) {
        if (left === right - 1) {
            break;
        }

        // 如果左边的数组比右边的小，然后left到right范围内又必然存在全局最小，那么left必然是全局最小
        // 因为如果旋转过arr[left]必然大于等于arr[right]
        if (arr[left] < arr[right]) {
            return arr[left];
        }

        // arr[left] >= arr[right] 原数组必然旋转过 全局最小在left+1到right范围内
        left++;
        const mid = left + ((right - left) >> 1);

        // 由于数组必然旋转过，从left到right的变化幅度就是从小到大，再突然变小（全局最小），然后变大
        // 所以如果arr[left] > arr[mid] 则最小值一定在left到mid之间
        if (arr[left] > arr[mid]) {
            right = mid;
            continue;
        }
        if (arr[left] < arr[mid]) {
            left = mid;
            continue;
        }
        if (arr[mid] > arr[right]) {
            left = mid;
            continue;
        }
        if (arr[mid] < arr[right]) {
            right = mid;
            continue;
        }

        // arr[left] === arr[mid] && arr[left] === arr[right]
        while (left < mid) {
            if (arr[left] === arr[mid]) {
                left++;
            } else if (arr[left] < arr[mid]) {
                return arr[left];
            } else {
                right = mid;
                break;
            }
        }
    }

    return Math.min(arr[left], arr[right]);
}

/* 
买卖股票问题

给定数组arr代表一天的价格，问只能做一次交易的情况下如何使得获利最大

分析，i号时间点卖出，则只要求出0-i范围内最小值，两者相减就是i号时间点卖出所能获得的最大收益，全局求个最大值即可
滑动窗口来做
*/
export function getMaxProfit(arr: number[]): number {
    const minSlidingWindow = new SlidingWindow(arr, (last, right) => last - right);
    let max = -Infinity;

    for (let i = 0; i < arr.length; i++) {
        minSlidingWindow.moveRight();
        max = Math.max(arr[i] - minSlidingWindow.peek());
    }

    return max;
}

export function getMaxProfit2(arr: number[]): number {
    let min = Infinity;
    let max = -Infinity;

    for (let i = 0; i < arr.length; i++) {
        min = Math.min(min, arr[i]);
        max = Math.max(arr[i] - min);
    }

    return max;
}

/* 
买卖股票问题2

给定一个数组arr，从左到右表示昨天从早到晚股票的价格。作为一个事后诸葛亮，你想知道如果随便交易，且每次交易只买卖一股，返回能挣到的最大钱数
*/
export function getMaxProfit3(arr: number[]): number {
    let result = 0;
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] > arr[i - 1]) {
            result += arr[i] - arr[i - 1];
        }
    }

    return result;
}

/* 
买卖股票问题2

给定一个数组arr，从左到右表示昨天从早到晚股票的价格。作为一个事后诸葛亮，你想知道如果交易次数不超过k次，且每次交易只买卖一股，返回能挣到的最大钱数
*/
export function getMaxProfit4(arr: number[], k: number): number {
    const dp: Map<string, number> = new Map();

    return getMaxProfit4Process(arr, -1, 0, k, dp);
}

// 当前来到i位置，如果buyIndex不等于-1说明之前已经买入过，当前有两种选择（持有||卖出）
// 如果buyIndex不等于-1则说明之前未买入过，当前也有两种选择（不买入||买入）
// 从各种选择中取最大值
function getMaxProfit4Process(arr: number[], buyIndex: number, i: number, k: number, dp: Map<string, number>): number {
    const id = `${buyIndex}_${i}_${k}`;
    if (dp.has(id)) {
        return dp.get(id) as number;
    }

    if (k === 0 || i === arr.length) {
        return 0;
    }

    // 之前没有买入过，当前可以买入或者不买入
    if (buyIndex === -1) {
        // 买入
        const p1 = -arr[i] + getMaxProfit4Process(arr, i, i + 1, k, dp);
        // 不买入
        const p2 = getMaxProfit4Process(arr, -1, i + 1, k, dp);

        dp.set(id, Math.max(0, p1, p2));
    } else {
        // 持有
        const p1 = getMaxProfit4Process(arr, buyIndex, i + 1, k, dp);
        // 卖出
        const p2 = arr[i] + getMaxProfit4Process(arr, -1, i + 1, k - 1, dp);

        dp.set(id, Math.max(0, p1, p2));
    }

    return dp.get(id) as number;
}

export function getMaxProfit4Dp(arr: number[], k: number): number {
    if (k >= arr.length >> 1) {
        return getMaxProfit3(arr);
    }

    // dp[i][k]
    const dp: number[][] = new Array(arr.length).fill(0).map((_) => new Array(k + 1).fill(0));

    for (let restK = 1; restK <= k; restK++) {
        let prevMax = dp[0][restK - 1] - arr[0];
        for (let i = 1; i < arr.length; i++) {
            // i号不卖出
            const p1 = dp[i - 1][restK];
            // i号卖出（买入时机就有可能是0-i的任意时刻）
            // 通过分析具体的例子可以优化枚举行为
            prevMax = Math.max(prevMax, dp[i][restK - 1] - arr[i]);
            const p2 = arr[i] + prevMax;

            dp[i][restK] = Math.max(p1, p2);
        }
    }

    return dp[arr.length - 1][k];
}

/* 
给定两个字符串S和T，返回S子序列等于T的不同子序列个数有多少个？
如果得到子序列A删除的位置与得到子序列B删除的位置不同，那么认为A和B就是不同的。

【例子】
S="rabbbit",T="rabbit"返回：3

是以下三个S的不同子序列
rabbbit 删除第一个b得到 rabbit
rabbbit 删除第二个b得到 rabbit
rabbbit 删除第三个b得到 rabbit

样本对应模型
*/
export function countSubsequence(s: string, t: string) {
    // dp[i][j] s[0-i]的字符有多少子序列等于t[0-j]
    const dp: number[][] = new Array(s.length).fill(0).map((_) => new Array(t.length).fill(0));

    // 第一列
    for (let i = 0; i < s.length; i++) {
        dp[i][0] = s
            .slice(0, i + 1)
            .split('')
            .filter((char) => char === t[0]).length;
    }

    // 从上到下，从左到右填表
    for (let i = 1; i < s.length; i++) {
        for (let j = 1; j < t.length; j++) {
            dp[i][j] = dp[i - 1][j];
            if (s[i] === t[j]) {
                dp[i][j] += dp[i - 1][j - 1];
            }
        }
    }

    return dp[s.length - 1][t.length - 1];
}

/* 
给定一个只由"0~~9"字符组成的字符串num，和整数target。可以用+、-和*连接，返回num得到target的所有不同方法
Example 1:
Input: num ="123", target = 6 
Output:["1+2+3","1*2*3"]

Example 2:
Input: num="232",target=8 
Output:["2*3+2","2+3*2"]

Example 3:
Input: num="105",target=5 
Output:["1*0+5","10-5"]

Example 4:
Input: num="00", target = 0
Output:["O+O","O-O","O*O"]

Example 5:
Input: num = "3456237490", target = 9191
output:[]
*/
export function getCalculateMethods(str: string, target: number): string[] {
    const set: Set<string> = new Set();
    getCalculateMethodsProcess(str, target, 0, '', set);
    return Array.from(set);
}

function getCalculateMethodsProcess(str: string, target: number, i: number, path: string, set: Set<string>) {
    if (i === str.length) {
        const last = path[path.length - 1];
        if (last === '+' || path === '-' || path === '*') {
            path = path.slice(0, path.length - 1);
        }

        if (checkTarget(path, target)) {
            set.add(path);
        }

        return;
    }

    // 四种选择
    getCalculateMethodsProcess(str, target, i + 1, path + `${str[i]}+`, set);
    getCalculateMethodsProcess(str, target, i + 1, path + `${str[i]}-`, set);
    getCalculateMethodsProcess(str, target, i + 1, path + `${str[i]}*`, set);
    getCalculateMethodsProcess(str, target, i + 1, path + str[i], set);
}

function checkTarget(path: string, target: number): boolean {
    const operands = path.split(/[*+-]/);
    for (let i = 0; i < operands.length; i++) {
        if (operands[i].length >= 2 && operands[i][0] === '0') {
            return false;
        }
    }

    return calculatePath(path) === target;
}

function calculatePath(path: string): number {
    const operators: string[] = [];
    for (let i = 0; i < path.length; i++) {
        if (path[i] === '+' || path[i] === '-') {
            operators.push(path[i]);
        }
    }

    const operands = path.split(/[+-]/);

    return operands.slice(1).reduce((acc, cur) => {
        const num = parseNum(cur);

        const op = operators.shift();
        if (op === '+') {
            acc += num;
        } else {
            acc -= num;
        }

        return acc;
    }, parseNum(operands[0]));
}

function parseNum(num: string): number {
    const shouldCalculate = num.indexOf('*') !== -1;
    if (shouldCalculate) {
        return num.split('*').reduce((acc, cur) => acc * parseInt(cur), 1);
    }

    return parseInt(num);
}

// 在深度优先的过程中就把结果算出来，避免到最后再去计算表达式
export function getCalculateMethods2(str: string, target: number): string[] {
    const result: Set<string> = new Set();

    // 决定第一位数字是多少
    for (let i = 0; i < str.length; i++) {
        const char = str.slice(0, i + 1);
        getCalculateMethods2Dfs(str, target, char, 0, parseInt(char), i + 1, result);

        // 第一位数字为0直接break，比如说00就不是合法的两位数字
        if (str[0] === '0') {
            break;
        }
    }

    return Array.from(result);
}

function getCalculateMethods2Dfs(
    str: string,
    target: number,
    path: string,
    left: number,
    toBeDetermined: number,
    i: number,
    result: Set<string>
) {
    if (i === str.length) {
        if (left + toBeDetermined === target) {
            result.add(path);
        }

        return;
    }

    for (let j = i; j < str.length; j++) {
        const char = str.slice(i, j + 1);
        const num = parseInt(char);

        // 加
        getCalculateMethods2Dfs(str, target, path + `+${char}`, left + toBeDetermined, num, j + 1, result);

        // 减
        getCalculateMethods2Dfs(str, target, path + `-${char}`, left + toBeDetermined, -num, j + 1, result);

        // 乘
        getCalculateMethods2Dfs(str, target, path + `*${char}`, left, toBeDetermined * num, j + 1, result);

        // 第一位数字为0直接break
        if (str[i] === '0') {
            break;
        }
    }
}

/* 
Given an m x n grid of characters board and a string word, return true if word exists in the grid.

The word can be constructed from letters of sequentially adjacent cells, 
where adjacent cells are horizontally or vertically neighboring. 
The same letter cell may not be used more than once.
*/
export function existWord(board: string[][], word: string): boolean {
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[0].length; col++) {
            if (existWordProcess(board, row, col, word, 0)) {
                return true;
            }
        }
    }

    return false;
}

// 此处不可以用ow,col和i组合做记忆化搜索，因为变量不只有row,col和i，existWordProcess运行过程中我们会改变board，进而会影响函数运行结果
function existWordProcess(board: string[][], row: number, col: number, word: string, i: number): boolean {
    const cur = word[i];
    if (i === word.length - 1) {
        return board[row][col] === cur;
    }

    if (board[row][col] !== cur || board[row][col] === '') {
        return false;
    }

    board[row][col] = '';

    const next = word[i + 1];
    // 上下左右尝试
    let p1 = false;
    if (row - 1 >= 0 && board[row - 1][col] === next) {
        p1 = existWordProcess(board, row - 1, col, word, i + 1);
    }

    let p2 = false;
    if (row + 1 < board.length && board[row + 1][col] === next) {
        p2 = existWordProcess(board, row + 1, col, word, i + 1);
    }

    let p3 = false;
    if (col - 1 >= 0 && board[row][col - 1] === next) {
        p3 = existWordProcess(board, row, col - 1, word, i + 1);
    }

    let p4 = false;
    if (col + 1 < board[0].length && board[row][col + 1] === next) {
        p4 = existWordProcess(board, row, col + 1, word, i + 1);
    }

    board[row][col] = cur;

    return p1 || p2 || p3 || p4;
}

/* 
给定一个字符串str，给定一组单词 arr，arr中的单词可以使用无限次，问有多少种方式arr中的单词可以拼出str

例如
str:'aaabc'
arr:['a','aa','bc']

两种方式
a aa bc
aa a bc
*/
export function countJointMethods(str: string, arr: string[]) {
    const set: Set<string> = new Set(arr);

    return countJointMethodsProcess(str, set, 0);
}

function countJointMethodsProcess(str: string, set: Set<string>, i: number): number {
    if (i === str.length) {
        return 1;
    }

    let count = 0;
    for (let j = i; j < str.length; j++) {
        const char = str.slice(i, j + 1);
        if (set.has(char)) {
            count += countJointMethodsProcess(str, set, j + 1);
        }
    }

    return count;
}

export function countJointMethodsDp(str: string, arr: string[]): number {
    const dp: number[] = new Array(str.length + 1).fill(0);
    dp[str.length] = 1;
    const set: Set<string> = new Set(arr);

    // O(n^3) str.slice(i, j + 1) 这个操作也要消耗一个线性时间
    for (let i = str.length - 1; i >= 0; i--) {
        let count = 0;
        for (let j = i; j < str.length; j++) {
            const char = str.slice(i, j + 1);
            if (set.has(char)) {
                count += dp[j + 1];
            }
        }
        dp[i] = count;
    }

    return dp[0];
}

// 用前缀树代替set，优化时间复杂度
export function countJointMethodsDp2(str: string, arr: string[]): number {
    const dp: number[] = new Array(str.length + 1).fill(0);
    dp[str.length] = 1;

    const prefixTree = new PrefixTree();
    arr.forEach((word) => prefixTree.add(word));

    for (let i = str.length - 1; i >= 0; i--) {
        let count = 0;
        let cur = prefixTree.head;

        for (let j = i; j < str.length; j++) {
            // 把之前生成子串的O(n) 操作变成在前缀树上移动一个节点的O(1)操作，秒啊
            const index = getCharIndex(str[j]);
            // 后续没有路直接终止循环
            if (!cur.nextNodes[index]) {
                break;
            }

            if (cur.nextNodes[index].end !== 0) {
                count += dp[j + 1];
            }
            cur = cur.nextNodes[index];
        }

        dp[i] = count;
    }

    return dp[0];
}

/* 
给定一个路径数组 paths，表示一张图。paths[i]==j代表城市 i 连向城市 j，如果paths[i]==i，则表示i城市是首都，
一张图里只会有一个首都且图中除首都指向自己之外不会有环。

例如， paths=【9，1，4，9，0，4，8，9，0，1】，
由数组表示的图可以知道，城市 1 是首都，所以距离为 0，
离首都距离为 1 的城市只有城市 9，
离首都距离为2的城市有城市0、3 和7，
离首都距离为3的城市有城市 4 和 8，
离首都 距离为 4 的城市有城市2、5 和 6。

所以距离为0 的城市有 1 座，
距离为 1 的城市有1座，
距离为2的城市有3座，
距离为3的城市有2座，
距离为4的城市有3 座。

那么统计数组为nums=【1，1，3，2，3，0，0，0，0】，nums【i】=j代表距离为 i 的城市有j座。
要求实现一个 void 类型的函 数，输入一个路径数组 paths，直接在原数组上调整，使之变为 nums 数组，
即 paths=【9，1，4，9，0，4，8，9，0，1】经过这个函数处理后变成[1,1,3,2,3,0,0,0,0,0]。

【要求】
如果 paths 长度为 N，请达到时间复杂度为0（N），额外空间复杂度为0（1）。
*/
export function updatePaths(paths: number[]): void {
    if (!paths || paths.length === 0) {
        return;
    }

    toDistancePaths(paths);

    toCountPaths(paths);
}

// 把原数组变成每座城市到首都的距离数组
function toDistancePaths(paths: number[]): void {
    // 起跳点
    let start = 0;
    let capital: number | undefined = undefined;

    while (start < paths.length) {
        // 跳到首都的位置记录下来
        if (paths[start] === start) {
            capital = start++;
            continue;
        }

        //  已经标记过距离的位置直接跳过
        if (paths[start] < 0) {
            start++;
            continue;
        }

        // 从start位置开始往外跳
        let i = start;
        // 从i位置要跳向的位置
        let next = paths[i];
        // 跳到next位置之前的位置
        let last = i;
        while (i !== paths[i] && paths[i] > -1) {
            next = paths[i];
            // 保留跳的路径信息，将来可以原路返回
            paths[i] = last;

            // 先记录下前一个位置，然后i跳到下一个位置
            last = i;
            i = next;
        }

        // 开始往回跳并更新距离信息，用负数表示
        // i===capital或者paths[i]是负数
        let distance = i === paths[i] ? 0 : paths[i];
        i = last;
        while (i !== start) {
            next = paths[i];
            paths[i] = --distance;
            i = next;
        }
        paths[i] = --distance;

        start++;
    }

    // 循环结束手动将首都到首都的距离更新为0
    paths[capital!] = 0;
}

// 把距离数组变成到首都距离为i的城市有几座的统计数组
function toCountPaths(paths: number[]): void {
    let start = 0;
    while (start < paths.length) {
        // 大于等于0直接跳过（首都只有一个，也就是说paths[0]最终一定是1）
        if (paths[start] >= 0) {
            start++;
            continue;
        }

        let distance = paths[start];
        // start位置上的distance数据用完之后变成统计意义上的0
        // 表示当前还没发现距离首都为start的城市
        // 此处要在循环之前设置，不然可能会导致start这个位置的distance被重复记录
        paths[start++] = 0;

        let nextDistance;
        while (distance < 0) {
            const index = Math.abs(distance);
            // 更新之前先把下一个位置的distance存起来
            nextDistance = paths[index];

            if (nextDistance > 0) {
                // 到首都长度为 Math.abs(paths[i]) 的城市之前已经统计过
                // 现在又发现了一座
                paths[index]++;
            } else {
                // 之前没统计过，现在发现了一座
                paths[index] = 1;
            }

            distance = nextDistance;
        }
    }

    // 最后手动更新距离为0的城市个数（有且仅有首都）
    paths[0] = 1;
}

/* 
给定一个字符串str，str表示一个公式公式里可能有整数、加减乘除符号和左右括号返回公式的计算结果，难点在于括号可能嵌套很多层
str="48*（70-65）-43）+8*1"，返回-1816。
str="3+1*4"，返回7。
str="3+（1*4）"，返回7。

【说明】
1.可以认为给定的字符串一定是正确的公式，即不需要对str做公式有效性检查
2.如果是负数，就需要用括号括起来，比如"4+（-3）"但如果负数作为公式的开头或括号部分的开头，则可以没有括号，比如"-3*4"和"（-3*4）"都是合法的。
3.不用考虑计算过程中会发生溢出的情况。
*/
export function calculateStr(str: string): number {
    const [cur] = calculateStrProcess(str, 0);
    return cur;
}

// 遇到右括号或终止位置结束
function calculateStrProcess(str: string, start: number): [cur: number, end: number] {
    let cur = 0;
    const stack = new Stack<string | number>();

    while (start < str.length && str[start] !== ')') {
        const char = str[start];
        // 数字
        if (char >= '0' && char <= '9') {
            cur = Number(cur) * 10 + Number(char);
            start++;
        } else if ('+-*/'.includes(char)) {
            addNumToStack(stack, cur);
            stack.push(char);
            cur = 0;
            start++;
        } else {
            // 左括号直接递归
            const [subCur, subEnd] = calculateStrProcess(str, start + 1);
            cur = subCur;
            start = subEnd + 1;
        }
    }
    // 最后的数字或者递归回来的数字要加入stack中
    addNumToStack(stack, cur);

    return [calculateStack(stack), start];
}

function calculateStack(stack: Stack<string | number>): number {
    let leftNum = 0;
    let op;
    let rightNum = 0;

    // Stack中只有加减运算，需要从头到尾计算
    while (!stack.isEmpty()) {
        leftNum = stack.popFirst() as number;
        op = stack.popFirst();
        rightNum = stack.popFirst() as number;

        if (op === '+') {
            stack.pushFirst(leftNum + rightNum);
        }
        if (op === '-') {
            stack.pushFirst(leftNum - rightNum);
        }
    }

    return leftNum;
}

function addNumToStack(stack: Stack<string | number>, cur: number) {
    if (stack.isEmpty()) {
        stack.push(cur);
        return;
    }

    // 加入数字之前先判断顶部操作符是否*/，是的话直接计算之后将结果放回stack，从而实现*/先于+-计算
    const op = stack.pop() as number | string;
    if (op === '*' || op === '/') {
        const left = stack.pop() as number;
        stack.push(op === '*' ? left * cur : left / cur);
        return;
    }

    stack.push(op);
    stack.push(cur);
}

/* 
Given a string s that contains parentheses, remove the minimum number of invalid parentheses to make the input string valid.
Return a list of unique strings that are valid with the minimum number of removals. You may return the answer in any order.

Examples
input:()())()
output:["(())()","()()()"]

https://www.bilibili.com/video/BV1RT4y1a7aK?p=69&spm_id_from=pageDriver&vd_source=7b242528b70c1c6d4ee0ca3780b547a5
*/
export function getValidParentheses(str: string): string[] {
    const result: string[] = [];

    removeParentheses(str, 0, 0, result, ['(', ')']);

    return result;
}

function removeParentheses(
    str: string,
    checkIndex: number,
    deleteIndex: number,
    result: string[],
    pair: string[]
): void {
    let count = 0;
    for (let i = checkIndex; i < str.length; i++) {
        // 遇到左括号就加一
        if (str[i] === pair[0]) {
            count++;
        }
        // 遇到右括号就减一
        if (str[i] === pair[1]) {
            count--;
        }

        // 如果count小于0则说明找到一个没有与之匹配的右括号
        // 如果左边所有左括号和右括号都是匹配的则count必然是0
        if (count < 0) {
            // 从deleteIndex往右找，非连续右括号位置都可以作为独立的删除点（连续的右括号只能删除一个，因为删除哪一个得到的最终结果必然一样）
            for (let k = deleteIndex; k < str.length; k++) {
                const prev = k - 1 >= 0 ? str[k - 1] : '';
                // 当前遇到的是非连续的右括号
                if (str[k] === pair[1] && str[k] !== prev) {
                    const newStr = str.slice(0, k) + str.slice(k + 1);
                    removeParentheses(newStr, i, k, result, pair);
                }
            }

            // 由递归去处理后续的非法情况，主函数不继续处理
            return;
        }
    }

    // 再查一次左括号多出来的情况
    const reversed = str.split('').reverse().join('');
    if (pair[0] === '(') {
        removeParentheses(reversed, 0, 0, result, [')', '(']);
    } else {
        // 左右括号都查完之后收集答案
        result.push(reversed);
    }
}

/* 
最长递增子序列问题（不是最长递增子数组）

从左到右的尝试模型，必须以i位置结尾所形成的最长递增子序列是多少
*/
export function getMaxLengthOfIncreasingSubsequence(arr: number[]): number {
    if (!arr || arr.length === 0) {
        return 0;
    }

    // 必须以i位置结尾所形成的最长递增子序列是多少
    const dp: number[] = new Array(arr.length).fill(0);
    dp[0] = 1;

    let max = 1;
    for (let i = 1; i < arr.length; i++) {
        // 找到比当前数字小，且递增子序列长度最长的
        let maxSubsequence = 0;
        for (let k = i - 1; k >= 0; k--) {
            if (arr[i] > arr[k]) {
                maxSubsequence = Math.max(maxSubsequence, dp[k]);
            }
        }

        dp[i] = maxSubsequence + 1;
        max = Math.max(max, dp[i]);
    }

    return max;
}

// 优化时间复杂度到 O(nlogn)
export function getMaxLengthOfIncreasingSubsequence2(arr: number[]): number {
    if (!arr || arr.length === 0) {
        return 0;
    }

    // end[i] 所有长度为i+1的最长子序列中最小结尾数值
    // end[0] 目前所有长度为1的子序列中最小结尾数值是arr[0]
    const end = [arr[0]];

    for (let i = 1; i < arr.length; i++) {
        // 在end中二分查找大于等于arr[i]且最近的数字
        let left = 0;
        let right = end.length - 1;
        let found;
        while (left <= right) {
            const mid = left + ((right - left) >> 1);

            // 找到直接停止
            if (end[mid] === arr[i]) {
                found = mid;
                break;
            }

            if (end[mid] > arr[i]) {
                found = mid;
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        }

        // end数组中没有大于等于arr[i]的数字
        if (found === undefined) {
            end.push(arr[i]);
        } else if (end[found] > arr[i]) {
            end[found] = arr[i];
        }
    }

    return end.length;
}

// 存在多个的时候返回数值最大的那个
export function getLongestIncreasingSubsequence(arr: number[]): number[] {
    if (!arr || arr.length === 0) {
        return [];
    }

    // end[i]:以i结尾的最长递增子序列
    const end: number[][] = [[arr[0]]];
    for (let i = 1; i < arr.length; i++) {
        // 在end中二分查找大于等于arr[i]且最近的数字
        let left = 0;
        let right = end.length - 1;
        let closestMaxOrEqual: number[] | undefined = undefined;
        while (left <= right) {
            const mid = left + ((right - left) >> 1);
            const cur = end[mid];

            // 找到直接停止
            if (cur[cur.length - 1] === arr[i]) {
                closestMaxOrEqual = cur;
                break;
            }

            if (cur[cur.length - 1] > arr[i]) {
                closestMaxOrEqual = cur;
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        }

        if (closestMaxOrEqual === undefined) {
            const last = end[end.length - 1];
            end.push(last.slice().concat(arr[i]));
        } else if (closestMaxOrEqual[closestMaxOrEqual.length - 1] > arr[i]) {
            closestMaxOrEqual[closestMaxOrEqual.length - 1] = arr[i];
        }
    }

    return end[end.length - 1];
}

/* 
定义何为step sum？
比如680， 680＋68＋6=754， 680的step sum叫754 给定一个正数num，判断它是不是某个数的step sum

利用单调性来二分查找
*/
export function isStepSum(num: number) {
    // 如果num是某个数的step sum则这个数一定在1到num之间
    // 二分查找
    let left = 1;
    let right = num;
    while (left <= right) {
        const mid = left + ((right - left) >> 1);
        const stepSum = getStepSum(mid);

        if (stepSum === num) {
            return true;
        }

        if (stepSum < num) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    return false;
}

function getStepSum(n: number): number {
    let result = n;
    while (n > 0) {
        n = Math.floor(n / 10);
        result += n;
    }

    return result;
}

/* 
给定一个整型矩阵map，其中的值只有0和1两种，求其中全是1的所有矩形区域中，最大的矩形区域为1的数量。

例如：
[[1,1,1,0]]
其中，最大的矩形区域有3个1，所以返回3。

再如：
[
    [1,0,1,1],
    [1,1,1,0],
    [1,1,1,1]
]￼
其中，最大的矩形区域有6个1，所以返回6。

技巧总结
单调栈，矩阵压缩
*/
export function getMaxSizeOfAllOnes(matrix: number[][]): number {
    const sumArr: number[] = new Array(matrix[0].length).fill(0);

    let max = -Infinity;
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[0].length; j++) {
            sumArr[j] = matrix[i][j] === 1 ? sumArr[j] + 1 : 0;
        }

        const closestMinArr = getClosestMinArr(sumArr);

        sumArr.forEach((cur, i) => {
            const [leftMin = -1, rightMin = matrix[0].length] = closestMinArr[i];
            max = Math.max(max, cur * (rightMin - leftMin - 1));
        });
    }

    return max;
}

export function getMaxSizeOfAllOnes2(matrix: number[][]): number {
    // sumOfMatrix[i][j] 表示 从0,0到i,j位置形成的矩阵和
    const sumOfMatrix: number[][] = getSumOfMatrix(matrix);

    let max = 0;
    // 枚举所有的起点终点所组成的矩形
    // 如果sum等于矩形内点的个数则说明该矩形内都是1，更新max
    for (let i1 = 0; i1 < matrix.length; i1++) {
        for (let j1 = 0; j1 < matrix[0].length; j1++) {
            for (let i2 = i1; i2 < matrix.length; i2++) {
                for (let j2 = j1; j2 < matrix[0].length; j2++) {
                    const leftCorner = i1 - 1 >= 0 && j1 - 1 >= 0 ? sumOfMatrix[i1 - 1][j1 - 1] : 0;
                    const left = j1 - 1 >= 0 ? sumOfMatrix[i2][j1 - 1] : 0;
                    const top = i1 - 1 >= 0 ? sumOfMatrix[i1 - 1][j2] : 0;

                    const sumOfi1j1i2j2 = sumOfMatrix[i2][j2] + leftCorner - left - top;

                    if (sumOfi1j1i2j2 === (i2 - i1 + 1) * (j2 - j1 + 1)) {
                        max = Math.max(max, sumOfi1j1i2j2);
                    }
                }
            }
        }
    }

    return max;
}

// sumOfMatrix[i][j] 表示 从0,0到i,j位置形成的矩阵和
export function getSumOfMatrix(matrix: number[][]): number[][] {
    const sumOfMatrix: number[][] = new Array(matrix.length).fill(0).map((_) => new Array(matrix[0].length).fill(0));

    sumOfMatrix[0][0] = matrix[0][0];

    // 第0行
    for (let j = 1; j < matrix[0].length; j++) {
        sumOfMatrix[0][j] = sumOfMatrix[0][j - 1] + matrix[0][j];
    }

    // 第0列
    for (let i = 1; i < matrix.length; i++) {
        sumOfMatrix[i][0] = sumOfMatrix[i - 1][0] + matrix[i][0];
    }

    for (let i = 1; i < matrix.length; i++) {
        for (let j = 1; j < matrix[0].length; j++) {
            const leftCorner = sumOfMatrix[i - 1][j - 1];
            const left = sumOfMatrix[i][j - 1];
            const top = sumOfMatrix[i - 1][j];

            sumOfMatrix[i][j] = left + top - leftCorner + matrix[i][j];
        }
    }

    return sumOfMatrix;
}

// 返回i1j1,i2j2所在子矩阵的和
export function getSumOfi1j1i2j2(sumOfMatrix: number[][], i1: number, j1: number, i2: number, j2: number): number {
    const maxOfI = sumOfMatrix.length - 1;
    const maxOfJ = sumOfMatrix[0].length - 1;
    if (
        !isValidIndex(i1, maxOfI) ||
        !isValidIndex(i2, maxOfI) ||
        !isValidIndex(j1, maxOfJ) ||
        !isValidIndex(j2, maxOfJ)
    ) {
        throw new Error('Invalid index');
    }

    const leftCorner = i1 - 1 >= 0 && j1 - 1 >= 0 ? sumOfMatrix[i1 - 1][j1 - 1] : 0;
    const left = j1 - 1 >= 0 ? sumOfMatrix[i2][j1 - 1] : 0;
    const top = i1 - 1 >= 0 ? sumOfMatrix[i1 - 1][j2] : 0;

    const sumOfi1j1i2j2 = sumOfMatrix[i2][j2] + leftCorner - left - top;
    return sumOfi1j1i2j2;
}

function isValidIndex(index: number, max: number): boolean {
    return index >= 0 && index <= max;
}

/* 
Given a string containing just the characters '(' and ')', return the length of the longest valid (well-formed) parentheses 
substring

Example 1:
Input: s = "(()"
Output: 2
Explanation: The longest valid parentheses substring is "()".

Example 2:
Input: s = ")()())"
Output: 4
Explanation: The longest valid parentheses substring is "()()".
*/
export function longestValidParentheses(s: string): number {
    // dp[i]子串必须以i位置结尾的情况下所形成的最长有效parentheses长度
    const dp: number[] = new Array(s.length).fill(0);

    let max = 0;
    for (let i = 1; i < s.length; i++) {
        // 如果当前是左括号，以左括号结尾必然不是合法的子串
        if (s[i] === '(') {
            dp[i] = 0;
            continue;
        }

        if (s[i - 1] === '(') {
            // 当前字符和前一个字符配对，合法子串长度至少为2
            dp[i] = 2;
        } else {
            // 看当前字符与扣除dp[i-1]长度之后的字符是否配对，配对的话 dp[i]就等于dp[i-1]+2
            const leftIndex = i - dp[i - 1] - 1;
            dp[i] = leftIndex >= 0 && s[leftIndex] === '(' ? dp[i - 1] + 2 : 0;
        }

        // dp[i]>0的情况下看合法子串能不能往前扩
        if (dp[i] > 0) {
            let k = i - dp[i];
            dp[i] += k >= 0 ? dp[k] : 0;
        }

        max = Math.max(max, dp[i]);
    }

    return max;
}

export function longestValidParentheses2(s: string): number {
    const arr: number[] = [-1];
    let max = 0;
    for (let i = 0; i < s.length; i++) {
        if (s[i] === '(') {
            arr.push(i);
        } else {
            arr.pop();
            if (arr.length === 0) {
                arr.push(i);
            }
        }

        max = Math.max(max, i - arr[arr.length - 1]);
    }

    return max;
}

/* 
You are given a string s and an array of strings words. All the strings of words are of the same length.

A concatenated substring in s is a substring that contains all the strings of any permutation of words concatenated.

For example, if words = ["ab","cd","ef"], then "abcdef", "abefcd", "cdabef", "cdefab", "efabcd", and "efcdab" are all concatenated strings. 
"acdbef" is not a concatenated substring because it is not the concatenation of any permutation of words.

Return the starting indices of all the concatenated substrings in s. You can return the answer in any order.
*/
export function findSubstring(s: string, words: string[]): number[] {
    const compareString = words.sort().join('');
    const wordLen = words[0].length;
    const len = words.length * wordLen;

    const result: number[] = [];
    for (let i = 0; i <= s.length - len; i++) {
        const first = s.slice(i, i + wordLen);
        if (!words.includes(first)) {
            continue;
        }

        const arr: string[] = [];
        for (let k = 0; k < words.length; k++) {
            arr.push(s.slice(i + k * wordLen, i + k * wordLen + wordLen));
        }
        const substring = arr.sort().join('');
        if (substring === compareString) {
            result.push(i);
        }
    }

    return result;
}

/* 
范围尝试模型

给定一个字符串，长度为奇数，所有偶数位置必然是0或者1，所有奇数位置是 "& | ^" 三个逻辑符号之一
如果通过加小括号使得最终结果是1或0，返回加小括号的方式

例：
0&1&1|1

使得最终结果为1的方法数2种
0&(1&1)|1
0&1&1|1
*/
export function evaluationMethods(str: string, expectedResult: number): number {
    const dp: Map<string, [oneMethods: number, zeroMethods: number]> = new Map();

    const [oneMethods, zeroMethods] = evaluationMethodsProcess(str, 0, str.length - 1, dp);
    return expectedResult === 1 ? oneMethods : zeroMethods;
}

/*  
left，right位置的字符必须是数字，不能是逻辑符号(&|^)
返回left-right范围内形成true和false的方法数
*/
function evaluationMethodsProcess(
    str: string,
    left: number,
    right: number,
    dp: Map<string, [oneMethods: number, zeroMethods: number]>
): [oneMethods: number, zeroMethods: number] {
    const id = `${left}_${right}`;
    if (dp.has(id)) {
        return dp.get(id)!;
    }

    if (left === right) {
        const oneMethods = str[left] === '1' ? 1 : 0;
        const zeroMethods = str[left] === '0' ? 1 : 0;

        dp.set(id, [oneMethods, zeroMethods]);
        return dp.get(id)!;
    }

    let oneMethods = 0;
    let zeroMethods = 0;

    // 遍历所有位置操作符作为最后结合的操作符的情况下得到的方法数，累加起来就是总方法数
    for (let opIndex = left + 1; opIndex < right; opIndex += 2) {
        const [leftTrueMethods, leftFalseMethods] = evaluationMethodsProcess(str, left, opIndex - 1, dp);
        const [rightTrueMethods, rightFalseMethods] = evaluationMethodsProcess(str, opIndex + 1, right, dp);

        const op = str[opIndex];
        if (op === '&') {
            oneMethods += leftTrueMethods * rightTrueMethods;
            zeroMethods +=
                leftTrueMethods * rightFalseMethods +
                rightTrueMethods * leftFalseMethods +
                leftFalseMethods * rightFalseMethods;
        } else if (op === '|') {
            oneMethods +=
                leftTrueMethods * rightTrueMethods +
                leftTrueMethods * rightFalseMethods +
                rightTrueMethods * leftFalseMethods;
            zeroMethods += leftFalseMethods * rightFalseMethods;
        } else {
            oneMethods += rightTrueMethods * leftFalseMethods + leftTrueMethods * rightFalseMethods;
            zeroMethods += leftTrueMethods * rightTrueMethods + leftFalseMethods * rightFalseMethods;
        }
    }

    dp.set(id, [oneMethods, zeroMethods]);
    return dp.get(id)!;
}

/* 
谷歌面试题扩展版面值为1~N的牌组成一组，

每次你从组里等概率的抽出1~N中的一张下次抽会换一个新的组，有无限组

1) 当累加和<a时，你将一直抽牌
2) 当累加和>=a且<b时，你将获胜
3) 当累加和>=b时，你将失败

给定的参数为N，a，b 返回获胜的概率，
*/
export function probabilityOfWinning(n: number, a: number, b: number): number {
    if (n < 1 || a >= b || a < 0 || b < 0) {
        return 0;
    }
    if (n <= b - a) {
        return 1;
    }

    return probabilityOfWinningProcess(0, n, a, b);
}

function probabilityOfWinningProcess(cur: number, n: number, a: number, b: number): number {
    if (cur >= a && cur < b) {
        return 1;
    }
    if (cur >= b) {
        return 0;
    }

    let win = 0;
    for (let i = 1; i <= n; i++) {
        win += probabilityOfWinningProcess(cur + i, n, a, b);
    }

    return win / n;
}

/* 
You have n super washing machines on a line. Initially, each washing machine has some dresses or is empty.

For each move, you could choose any m (1 <= m <= n) washing machines, 
and pass one dress of each washing machine to one of its adjacent washing machines at the same time.

Given an integer array machines representing the number of dresses in each washing machine from left to right on the line, 
return the minimum number of moves to make all the washing machines have the same number of dresses. 
If it is not possible to do it, return -1.

单点最大瓶颈决定整体最大瓶颈
*/
export function findMinMoves(machines: number[]): number {
    const preSumArr = [machines[0]];
    for (let i = 1; i < machines.length; i++) {
        preSumArr[i] = preSumArr[i - 1] + machines[i];
    }
    const sum = preSumArr[preSumArr.length - 1];

    if (sum % machines.length !== 0) {
        return -1;
    }

    const average = sum / machines.length;

    let leftSum = 0;
    let max = -Infinity;
    for (let i = 0; i < machines.length; i++) {
        const rightSum = sum - preSumArr[i];
        const leftMachineCount = i;
        const rightMachineCount = machines.length - leftMachineCount - 1;

        const leftLackCloses = leftSum - leftMachineCount * average;
        const rightLackCloses = rightSum - rightMachineCount * average;

        // 同时为负数说明两边都需要i位置给衣服，而i同时又只能给一件衣服，所以i最小次数就是
        // Math.abs(leftLackCloses) + Math.abs(rightLackCloses)
        if (leftLackCloses < 0 && rightLackCloses < 0) {
            max = Math.max(max, Math.abs(leftLackCloses) + Math.abs(rightLackCloses));
        } else {
            max = Math.max(max, Math.abs(leftLackCloses), Math.abs(rightLackCloses));
        }

        leftSum += machines[i];
    }

    return max;
}

/* 
Given an n x n matrix where each of the rows and columns is sorted in ascending order, return the kth smallest element in the matrix.

Note that it is the kth smallest element in the sorted order, not the kth distinct element.

You must find a solution with a memory complexity better than O(n2).

Example 1:
Input: matrix = [[1,5,9],[10,11,13],[12,13,15]], k = 8
Output: 13
Explanation: The elements in the matrix are [1,5,9,10,11,12,13,13,15], and the 8th smallest number is 13
*/
export function kthSmallest(matrix: number[][], k: number): number {
    let left = matrix[0][0];
    let right = matrix[matrix.length - 1][matrix[0].length - 1];

    while (left <= right) {
        const mid = left + ((right - left) >> 1);

        let count = 0;
        // 从0行最后一个元素开始找
        let row = 0;
        let col = matrix[0].length - 1;
        let found: number | undefined = undefined;
        while (row < matrix.length && col >= 0) {
            const cur = matrix[row][col];
            if (cur <= mid) {
                if (found === undefined) {
                    found = cur;
                } else {
                    // 如果cur离mid更近则更新found
                    found = mid - cur < mid - found ? cur : found;
                }

                // 当前行发现了col+1个小于mid的数字，继续往下找
                count += col + 1;
                row++;
            } else {
                col--;
            }
        }

        if (count === k) {
            return found!;
        }

        if (count > k) {
            right = mid - 1;
        } else {
            left = mid + 1;
        }
    }

    // 此处要返回left，不能返回-1
    // 因为存在某些场景有多个第k小的数字
    // [[1, 2],[1, 2]],k=1 那么通过上面的二分是没法正好找到k个数字的
    return left;
}

/* 
Given a string s, return the number of distinct non-empty subsequences of s. Since the answer may be very large, return it modulo 109 + 7.

A subsequence of a string is a new string that is formed from the original string by deleting some (can be none) of the characters 
without disturbing the relative positions of the remaining characters. (i.e., "ace" is a subsequence of "abcde" while "aec" is not.

Example 1:
Input: s = "abc"
Output: 7
Explanation: The 7 distinct subsequences are "a", "b", "c", "ab", "ac", "bc", and "abc".
*/
export function distinctSubsequenceII(s: string): number {
    const MOD = Math.pow(10, 9) + 7;
    // 以某个字符结尾的新增字符串有多少个
    const map: Map<string, number> = new Map();

    // 空集
    let all = 1;
    for (let i = 0; i < s.length; i++) {
        const char = s[i];
        const newAdd = all;

        // 当前字符之前未出现过
        if (!map.has(char)) {
            all = (all + newAdd) % MOD;
        } else {
            // 上一步的all是取模之后的，于是可能出现all + newAdd - map.get(char)!是个负数的情况，这里我们再加个MOD使得最终结果一定是正数
            all = (all + newAdd - map.get(char)! + MOD) % MOD;
        }

        map.set(char, newAdd);
    }

    // 本题不算空集，减去1
    // 由于all是取模之后的，如果all当前是0则all取模之前的值必然是MOD的倍数，直接取MOD即可
    return (all || MOD) - 1;
}

/* 
You are given an n x n binary matrix grid where 1 represents land and 0 represents water.

An island is a 4-directionally connected group of 1's not connected to any other 1's. There are exactly two islands in grid.

You may change 0's to 1's to connect the two islands to form one island.

Return the smallest number of 0's you must flip to connect the two islands.

Example 1:
Input: grid = [[0,1],[1,0]]
Output: 1

Example 2:
Input: grid = [[0,1,0],[0,0,0],[0,0,1]]
Output: 2

// 大思路，先找出两片岛，然后分别从两片岛广播出去，然后将广播出去的区域相加，得到的点数最小的点就是最短的连接点
*/
type Position = [row: number, col: number];

export function shortestBridge(grid: number[][]): number {
    const distanceGrids = new Array(2)
        .fill(0)
        .map((_) => new Array(grid.length).fill(0).map((_) => new Array(grid[0].length).fill(0)));
    let islandsCount = 0;
    // 存储所有1的位置信息
    let onePositions: Position[] = [];
    const nextPositions: Position[] = [];

    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[0].length; j++) {
            if (grid[i][j] === 1) {
                infect(grid, i, j, onePositions, distanceGrids[islandsCount]);

                let distance = 2;
                while (onePositions.length > 0) {
                    onePositions.forEach(([row, col]) => {
                        nextPositions.push(...broadcast(distanceGrids[islandsCount], row, col, distance));
                    });
                    distance++;

                    onePositions = nextPositions.slice();
                    nextPositions.length = 0;
                }

                islandsCount++;
            }
        }
    }

    let min = Infinity;
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[0].length; j++) {
            min = Math.min(min, distanceGrids[0][i][j] + distanceGrids[1][i][j]);
        }
    }

    return min - 3;
}

function infect(grid: number[][], row: number, col: number, onePositions: Position[], distanceGrid: number[][]) {
    if (row < 0 || row >= grid.length || col < 0 || col >= grid[0].length || grid[row][col] !== 1) {
        return;
    }

    onePositions.push([row, col]);
    distanceGrid[row][col] = 1;
    grid[row][col] = 2;

    // 上下左右四个方向继续
    infect(grid, row - 1, col, onePositions, distanceGrid);
    infect(grid, row + 1, col, onePositions, distanceGrid);
    infect(grid, row, col - 1, onePositions, distanceGrid);
    infect(grid, row, col + 1, onePositions, distanceGrid);
}

// 从某个点扩散出去，并返回扩散得到的点
function broadcast(grid: number[][], row: number, col: number, distance: number): Position[] {
    const result: Position[] = [];

    // 上
    if (row - 1 >= 0 && grid[row - 1][col] === 0) {
        grid[row - 1][col] = distance;
        result.push([row - 1, col]);
    }

    // 下
    if (row + 1 < grid.length && grid[row + 1][col] === 0) {
        grid[row + 1][col] = distance;
        result.push([row + 1, col]);
    }

    // 左
    if (col - 1 >= 0 && grid[row][col - 1] === 0) {
        grid[row][col - 1] = distance;
        result.push([row, col - 1]);
    }

    // 右
    if (col + 1 < grid[0].length && grid[row][col + 1] === 0) {
        grid[row][col + 1] = distance;
        result.push([row, col + 1]);
    }

    return result;
}

/* 
一维接雨水问题

Given n non-negative integers representing an elevation map where the width of each bar is 1, 
compute how much water it can trap after raining.

Input: height = [0,1,0,2,1,0,1,3,2,1,2,1]
Output: 6
Explanation: The above elevation map (black section) is represented by array [0,1,0,2,1,0,1,3,2,1,2,1]. 
In this case, 6 units of rain water (blue section) are being trapped.
*/
export function trap(height: number[]): number {
    if (height.length <= 2) {
        return 0;
    }

    let left = 1;
    let right = height.length - 2;
    let leftMax = height[0];
    let rightMax = height[height.length - 1];
    let sum = 0;
    while (left <= right) {
        if (leftMax < rightMax) {
            sum += Math.max(leftMax - height[left], 0);
            leftMax = Math.max(leftMax, height[left]);
            left++;
        } else if (leftMax === rightMax) {
            sum += Math.max(leftMax - height[left], 0);
            // 避免中间位置算两遍
            if (left !== right) {
                sum += Math.max(rightMax - height[right], 0);
            }

            leftMax = Math.max(leftMax, height[left]);
            rightMax = Math.max(rightMax, height[right]);
            left++;
            right--;
        } else {
            sum += Math.max(rightMax - height[right], 0);
            rightMax = Math.max(rightMax, height[right]);
            right--;
        }
    }

    return sum;
}

export function trap2(height: number[]): number {
    if (height.length <= 2) {
        return 0;
    }

    const leftMaxArr = [height[0]];
    const rightMaxArr = [height[height.length - 1]];
    for (let i = 1; i < height.length; i++) {
        const prev = leftMaxArr[leftMaxArr.length - 1];
        leftMaxArr.push(Math.max(prev, height[i]));
    }

    for (let i = height.length - 2; i >= 0; i--) {
        const prev = rightMaxArr[rightMaxArr.length - 1];
        rightMaxArr.push(Math.max(prev, height[i]));
    }
    rightMaxArr.reverse();

    let sum = 0;
    for (let i = 1; i < height.length - 1; i++) {
        sum += Math.max(Math.min(leftMaxArr[i - 1], rightMaxArr[i + 1]) - height[i], 0);
    }

    return sum;
}

/* 
二维接雨水问题

Given an m x n integer matrix heightMap representing the height of each unit cell in a 2D elevation map, 
return the volume of water it can trap after raining.

Input: heightMap = [[1,4,3,1,3,2],[3,2,1,3,2,4],[2,3,3,2,3,1]]
Output: 4
Explanation: After the rain, water is trapped between the blocks.
We have two small ponds 1 and 3 units trapped.
The total volume of water trapped is 4.
*/
type RainHeapNode = [val: number, row: number, col: number];

export function trapRainWater(heightMap: number[][]): number {
    const minHeap = new GenericHeap<RainHeapNode>(([a], [b]) => a - b);
    const hasAdded: boolean[][] = new Array(heightMap.length)
        .fill(0)
        .map((_) => new Array(heightMap[0].length).fill(false));

    // 将外边界放入minHeap
    // 第0行（不包括最后一个位置）
    for (let j = 0; j < heightMap[0].length - 1; j++) {
        hasAdded[0][j] = true;
        minHeap.push([heightMap[0][j], 0, j]);
    }

    // 最后一列（不包括最后一个位置）
    for (let i = 0; i < heightMap.length - 1; i++) {
        hasAdded[i][heightMap[0].length - 1] = true;
        minHeap.push([heightMap[i][heightMap[0].length - 1], i, heightMap[0].length - 1]);
    }

    // 最后一行（不包括第一个位置）
    for (let j = 1; j < heightMap[0].length; j++) {
        hasAdded[heightMap.length - 1][j] = true;
        minHeap.push([heightMap[heightMap.length - 1][j], heightMap.length - 1, j]);
    }

    // 第一列（不包括第一个位置）
    for (let i = 1; i < heightMap.length; i++) {
        hasAdded[i][0] = true;
        minHeap.push([heightMap[i][0], i, 0]);
    }

    let water = 0;
    let max = 0;
    while (!minHeap.isEmpty()) {
        const [minVal, row, col] = minHeap.pop();
        if (minVal < max) {
            water += max - minVal;
        } else {
            max = minVal;
        }

        // 上下左右四个方向放入minHeap
        if (row - 1 >= 0 && !hasAdded[row - 1][col]) {
            hasAdded[row - 1][col] = true;
            minHeap.push([heightMap[row - 1][col], row - 1, col]);
        }

        if (row + 1 < heightMap.length && !hasAdded[row + 1][col]) {
            hasAdded[row + 1][col] = true;
            minHeap.push([heightMap[row + 1][col], row + 1, col]);
        }

        if (col - 1 >= 0 && !hasAdded[row][col - 1]) {
            hasAdded[row][col - 1] = true;
            minHeap.push([heightMap[row][col - 1], row, col - 1]);
        }

        if (col + 1 < heightMap[0].length && !hasAdded[row][col + 1]) {
            hasAdded[row][col + 1] = true;
            minHeap.push([heightMap[row][col + 1], row, col + 1]);
        }
    }

    return water;
}

/* 
https://leetcode.com/problems/majority-element/

Given an array nums of size n, return the majority element.
The majority element is the element that appears more than ⌊n / 2⌋ times. 
You may assume that the majority element always exists in the array.

// 如果每次消除两个不同的数字，那么最终留下来的数字必然是水王数（如果水王数一定存在的话）
*/
export function majorityElement(arr: number[]): number {
    let candidate = arr[0];
    let count = 0;

    for (let i = 0; i < arr.length; i++) {
        if (count === 0) {
            candidate = arr[i];
            count = 1;
            continue;
        }

        if (candidate === arr[i]) {
            count++;
        } else {
            count--;
        }
    }

    return candidate;
}

/* 
https://leetcode.com/problems/majority-element-ii/

Given an integer array of size n, find all elements that appear more than ⌊ n/3 ⌋ times.

分析，大于n/3的数最多有2个，所以仿照上面的思路准备两个candidate，一次删除三个不同数字，最后留下来的就是出现次数大于n/3的
*/
export function majorityElement2(nums: number[]): number[] {
    // map最多放2个数字（因为大于n/3的数字最多只有2个）
    const map: Map<number, number> = new Map();

    for (let i = 0; i < nums.length; i++) {
        const cur = nums[i];
        if (map.size < 2) {
            map.set(cur, (map.get(cur) || 0) + 1);
            continue;
        }

        const prevCount = map.get(cur);
        // 统计不为0或者undefined说明候选中有当前数字
        if (prevCount) {
            map.set(cur, prevCount + 1);
        } else {
            // 如果之前没出现过则所有候选减1，且当前数字也丢弃（相当于同时删除3个数字）
            for (let [candidate, count] of map) {
                count--;

                if (count === 0) {
                    map.delete(candidate);
                } else {
                    map.set(candidate, count);
                }
            }
        }
    }

    for (const [candidate] of map) {
        map.set(candidate, 0);
    }

    const target = nums.length / 3;
    const result: number[] = [];

    for (let i = 0; i < nums.length; i++) {
        const cur = nums[i];
        if (map.has(cur)) {
            const count = map.get(cur)! + 1;
            if (count > target) {
                result.push(cur);
                map.delete(cur);
            } else {
                map.set(cur, count);
            }
        }
    }

    return result;
}

/* 
https://leetcode.com/problems/minimum-cost-to-merge-stones/
There are n piles of stones arranged in a row. The ith pile has stones[i] stones.

A move consists of merging exactly k consecutive piles into one pile, and the cost of this move is equal to the total number of stones in these k piles.

Return the minimum cost to merge all piles of stones into one pile. If it is impossible, return -1.

Input: stones = [3,2,4,1], k = 3
Output: -1
Explanation: After any merge operation, there are 2 piles left, and we can't merge anymore.  So the task is impossible.

Input: stones = [3,5,1,2,6], k = 3
Output: 25
Explanation: We start with [3, 5, 1, 2, 6].
We merge [5, 1, 2] for a cost of 8, and we are left with [3, 8, 6].
We merge [3, 8, 6] for a cost of 17, and we are left with [17].
The total cost was 25, and this is the minimum possible.

// 范围尝试模型
*/
export function mergeStones(stones: number[], k: number): number {
    const prefixSum = getPrefixSum(stones);

    // 由于最终要得到1个数，假设合并了x次，那么
    // n-x(k-1)=1
    // 也就是说(n-1)%(k-1)必然等于0
    if ((stones.length - 1) % (k - 1) !== 0) {
        return -1;
    }

    const dp: number[][][] = new Array(stones.length)
        .fill(0)
        .map((_) => new Array(stones.length).fill(0).map((_) => new Array(k).fill(undefined)));

    return mergeStonesProcess(stones, k, 0, stones.length - 1, 1, prefixSum, dp);
}

function getPrefixSum(arr: number[]): number[] {
    const prefixSum = [arr[0]];
    for (let i = 1; i < arr.length; i++) {
        prefixSum[i] = prefixSum[i - 1] + arr[i];
    }

    return prefixSum;
}

// left到right范围上搞出part份，返回最小代价
function mergeStonesProcess(
    stones: number[],
    k: number,
    left: number,
    right: number,
    part: number,
    prefixSum: number[],
    dp: number[][][]
): number {
    if (dp[left][right][part] !== undefined) {
        return dp[left][right][part];
    }

    if (left === right) {
        dp[left][right][part] = part === 1 ? 0 : -1;
        return dp[left][right][part];
    }

    if (part === 1) {
        const sum = prefixSum[right] - (left - 1 >= 0 ? prefixSum[left - 1] : 0);
        dp[left][right][part] = mergeStonesProcess(stones, k, left, right, k, prefixSum, dp) + sum;
        return dp[left][right][part];
    }

    let cost = Infinity;
    // part>1 且范围内不止一个数字
    // n=left+x(k-1)-left+1=x(k-1)+1
    // n-1=x(k-1)
    // i每次自增k-1能够确保left到i能够最终合成一份
    for (let i = left; i < right; i += k - 1) {
        const leftNext = mergeStonesProcess(stones, k, left, i, 1, prefixSum, dp);
        const rightNext = mergeStonesProcess(stones, k, i + 1, right, part - 1, prefixSum, dp);
        if (leftNext !== -1 && rightNext !== -1) {
            // 此处不需要对left-right的数据求和，因为目标就是在left到right上弄出part份，不是弄出一份，所以不需要再加上合并的代价
            cost = Math.min(cost, leftNext + rightNext);
        }
    }

    dp[left][right][part] = cost === Infinity ? -1 : cost;
    return dp[left][right][part];
}

/* 
最小包含子串问题

给定字符串str1 和 str2，问str1中完全包含str2所有字符的最小子串

例如
str1 ppabcdc
str2 ccab

返回5 （abcdc）
*/
export function minWindow(str1: string, str2: string): string {
    const map: Map<string, number> = new Map();
    for (let i = 0; i < str2.length; i++) {
        map.set(str2[i], (map.get(str2[i]) || 0) + 1);
    }
    map.set('all', str2.length);

    // (left,right]
    let left = -1;
    let right = -1;
    let minStr = '';
    while (left <= right && right !== str1.length) {
        // 右边一直往右扩，直到all减为0
        let prevAll = map.get('all') as number;
        while (prevAll > 0 && right !== str1.length) {
            const char = str1[++right];
            if (!map.has(char)) {
                continue;
            }

            const prev = map.get(char) as number;
            map.set(char, prev - 1);
            if (prev > 0) {
                prevAll--;
                map.set('all', prevAll);
            }
        }

        // 左边往右扩，更新minStr
        while (prevAll === 0 && left <= right) {
            const found = str1.slice(left + 1, right + 1);
            if (!minStr) {
                minStr = found;
            } else {
                minStr = found.length < minStr.length ? found : minStr;
            }

            const char = str1[++left];
            if (!map.has(char)) {
                continue;
            }

            const prev = map.get(char) as number;
            map.set(char, prev + 1);
            if (prev === 0) {
                prevAll++;
                map.set('all', prevAll);
            }
        }
    }

    return minStr;
}

/* 
Given an m x n integer matrix matrix, if an element is 0, set its entire row and column to 0's.

You must do it in place.
*/
// 先遍历一次找到所有0的位置，然后把0所在位置的行和列都变成0，空间复杂度O(m*n)
export function setZeroes(matrix: number[][]): void {
    if (!matrix || matrix.length === 0) {
        return;
    }

    let zeroIndexes: Array<[i: number, j: number]> = [];
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[0].length; j++) {
            if (matrix[i][j] === 0) {
                zeroIndexes.push([i, j]);
            }
        }
    }

    zeroIndexes.forEach(([i, j]) => {
        // i行设置为0 [i][0-matrix[0].length]
        let index = 0;
        while (index < matrix[0].length) {
            matrix[i][index++] = 0;
        }

        // j列设置为0 [0-matrix.length][j]
        index = 0;
        while (index < matrix.length) {
            matrix[index++][j] = 0;
        }
    });
}

// 用两个数组，一个数组记录行是否需要变成0，另一个数组记录列是否需要变成0，空间复杂度O(m+n)
export function setZeroes2(matrix: number[][]): void {
    if (!matrix || matrix.length === 0) {
        return;
    }

    // 记录某一行是否需要变成0
    const zeroRows: boolean[] = new Array(matrix.length).fill(false);
    const zeroCols: boolean[] = new Array(matrix[0].length).fill(false);

    // 找到需要变成0的行和列
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[0].length; j++) {
            if (matrix[i][j] === 0) {
                zeroRows[i] = true;
                zeroCols[j] = true;
            }
        }
    }

    // 把行变成0
    for (let row = 0; row < zeroRows.length; row++) {
        if (zeroRows[row] === true) {
            for (let j = 0; j < matrix[0].length; j++) {
                matrix[row][j] = 0;
            }
        }
    }

    // 把列变成0
    for (let col = 0; col < matrix[0].length; col++) {
        if (zeroCols[col] === true) {
            for (let i = 0; i < matrix.length; i++) {
                matrix[i][col] = 0;
            }
        }
    }
}

// 用两个变量记录第0行和第0列是否需要变成0，然后用第0行和第0列来记录剩下的行和列是否需要变成0，空间复杂度O(1)
export function setZeroes3(matrix: number[][]): void {
    let row0 = false;
    let col0 = false;

    // 标记第0行是否需要变成0
    for (let j = 0; j < matrix[0].length; j++) {
        if (matrix[0][j] === 0) {
            row0 = true;
            break;
        }
    }

    // 标记第0列是否需要变成0
    for (let i = 0; i < matrix.length; i++) {
        if (matrix[i][0] === 0) {
            col0 = true;
            break;
        }
    }

    // 用第0行和第0列的位置来标记剩下的行和列是否需要变成0
    for (let i = 1; i < matrix.length; i++) {
        for (let j = 1; j < matrix[0].length; j++) {
            if (matrix[i][j] === 0) {
                // 第j列需要变成0
                matrix[0][j] = 0;
                // 第i行需要变成0
                matrix[i][0] = 0;
            }
        }
    }

    // 遍历第0行处理需要变成0的列
    for (let j = 1; j < matrix[0].length; j++) {
        if (matrix[0][j] === 0) {
            for (let i = 1; i < matrix.length; i++) {
                matrix[i][j] = 0;
            }
        }
    }

    // 遍历第0列处理需要变成0的行
    for (let i = 1; i < matrix.length; i++) {
        if (matrix[i][0] === 0) {
            for (let j = 1; j < matrix[0].length; j++) {
                matrix[i][j] = 0;
            }
        }
    }

    // 处理第0行
    if (row0) {
        for (let j = 0; j < matrix[0].length; j++) {
            matrix[0][j] = 0;
        }
    }

    if (col0) {
        for (let i = 0; i < matrix.length; i++) {
            matrix[i][0] = 0;
        }
    }
}

/* 
Given an integer n, return the number of prime numbers that are strictly less than n.
*/
// 插空法统计素数
export function countPrimes(n: number): number {
    // 要求返回的素数必须小于n
    if (n < 3) {
        return 0;
    }

    // 所有的偶数都不是素数，上来我们直接把count减去一半
    let count = n >> 1;
    // 非素数
    const nonPrime: boolean[] = new Array(n).fill(false);

    // 内层循环是从i*i开始插空的，并且i*i需要小于n，所以外层循环终止条件可以设置为i*i<n
    for (let i = 3; i * i < n; i += 2) {
        if (nonPrime[i]) {
            continue;
        }

        for (let j = i * i; j < n; j += 2 * i) {
            if (!nonPrime[j]) {
                count--;
                nonPrime[j] = true;
            }
        }
    }

    return count;
}

/* 
牛牛和 15 个朋友来玩打土豪分田地的游戏，牛牛决定让你来分田地，地主的田地可以看成是一个矩形，每个位置有一个价值。分割田地的方法是横竖各切三刀，分成16份，
作为领导干部，牛牛总是会选择其中总价值最小的一份田地，作为牛牛最好的朋友，你希望牛牛取得的田地的价值和尽可能大，你知道这个值最大可以是多少吗？

输入描述：
每个输入包含1个测试用例。每个测试用例的第一行包含两个整数n和m（1<=n，m<=75），表示田地的大小，接下来的n行，每行包含 m 个 0-9 之间的数字，表示每块位置的价值。输出描述：
输出一行表示牛牛所能取得的最大的价值。

输入例子：
3332 
3233 
3332 
2323

输出例子：2
*/
export function splitEarth(matrix: number[][]): number {
    const sumOfMatrix = getSumOfMatrix(matrix);
    const maxOfI = matrix.length - 1;
    const maxOfJ = matrix[0].length - 1;

    let maxOfMin = -Infinity;

    // 暴力枚举所有切割位置
    // [0-i1] (i1,i2] (i2,i3] (i3,matrix.length-1]
    // [0-j1] (j1,j2] (j2,j3] (j3,matrix[0].length-1]
    for (let i1 = 0; i1 < matrix.length - 3; i1++) {
        for (let i2 = i1 + 1; i2 < matrix.length - 2; i2++) {
            for (let i3 = i2 + 1; i3 < matrix.length - 1; i3++) {
                for (let j1 = 0; j1 < matrix[0].length - 3; j1++) {
                    for (let j2 = j1 + 1; j2 < matrix[0].length - 2; j2++) {
                        for (let j3 = j2 + 1; j3 < matrix[0].length - 1; j3++) {
                            const allParts = [
                                [0, 0, i1, j1],
                                [0, j1 + 1, i1, j2],
                                [0, j2 + 1, i1, j3],
                                [0, j3 + 1, i1, maxOfJ],

                                [i1 + 1, 0, i2, j1],
                                [i1 + 1, j1 + 1, i2, j2],
                                [i1 + 1, j2 + 1, i2, j3],
                                [i1 + 1, j3 + 1, i2, maxOfJ],

                                [i2 + 1, 0, i3, j1],
                                [i2 + 1, j1 + 1, i3, j2],
                                [i2 + 1, j2 + 1, i3, j3],
                                [i2 + 1, j3 + 1, i3, maxOfJ],

                                [i3 + 1, 0, maxOfI, j1],
                                [i3 + 1, j1 + 1, maxOfI, j2],
                                [i3 + 1, j2 + 1, maxOfI, j3],
                                [i3 + 1, j3 + 1, maxOfI, maxOfJ],
                            ].map(([valI1, valJ1, valI2, valJ2]) =>
                                getSumOfi1j1i2j2(sumOfMatrix, valI1, valJ1, valI2, valJ2)
                            );

                            maxOfMin = Math.max(maxOfMin, Math.min(...allParts));
                        }
                    }
                }
            }
        }
    }

    return maxOfMin;
}

export function splitEarth2(matrix: number[][]): number {
    const sumOfMatrix = getSumOfMatrix(matrix);
    const maxOfI = matrix.length - 1;
    const maxOfJ = matrix[0].length - 1;

    let maxOfMin = -Infinity;

    // 暴力枚举所有竖切位置
    for (let j1 = 0; j1 < matrix[0].length - 3; j1++) {
        for (let j2 = j1 + 1; j2 < matrix[0].length - 2; j2++) {
            for (let j3 = j2 + 1; j3 < matrix[0].length - 1; j3++) {
                const topMaxOfMin = [-Infinity];
                let split = 0;
                for (let i = 1; i <= maxOfI; i++) {
                    // 从split位置往右尝试扩大min的值
                    let k = split;
                    let found = split;
                    let newMin = topMaxOfMin[i - 1];
                    while (k < i) {
                        // [0-k]属于上面，(k-i]属于下面
                        const up = Math.min(
                            getSumOfi1j1i2j2(sumOfMatrix, 0, 0, k, j1),
                            getSumOfi1j1i2j2(sumOfMatrix, 0, j1 + 1, k, j2),
                            getSumOfi1j1i2j2(sumOfMatrix, 0, j2 + 1, k, j3),
                            getSumOfi1j1i2j2(sumOfMatrix, 0, j3 + 1, k, maxOfJ)
                        );
                        const down = Math.min(
                            getSumOfi1j1i2j2(sumOfMatrix, k + 1, 0, i, j1),
                            getSumOfi1j1i2j2(sumOfMatrix, k + 1, j1 + 1, i, j2),
                            getSumOfi1j1i2j2(sumOfMatrix, k + 1, j2 + 1, i, j3),
                            getSumOfi1j1i2j2(sumOfMatrix, k + 1, j3 + 1, i, maxOfJ)
                        );

                        const min = Math.min(up, down);
                        if (min >= newMin) {
                            found = k;
                            newMin = min;
                        }

                        k++;
                    }

                    split = found;
                    topMaxOfMin[i] = newMin;
                }

                const downMaxOfMin = [-Infinity];
                split = maxOfI;
                for (let i = maxOfI - 1; i >= 0; i--) {
                    // 从split位置往左尝试扩大min的值
                    let k = split;
                    let found = split;
                    let newMin = downMaxOfMin[0];

                    while (k > i) {
                        // [k-maxOfI] 属于下面，[i-k)属于上面
                        const up = Math.min(
                            getSumOfi1j1i2j2(sumOfMatrix, i, 0, k - 1, j1),
                            getSumOfi1j1i2j2(sumOfMatrix, i, j1 + 1, k - 1, j2),
                            getSumOfi1j1i2j2(sumOfMatrix, i, j2 + 1, k - 1, j3),
                            getSumOfi1j1i2j2(sumOfMatrix, i, j3 + 1, k - 1, maxOfJ)
                        );
                        const down = Math.min(
                            getSumOfi1j1i2j2(sumOfMatrix, k, 0, maxOfI, j1),
                            getSumOfi1j1i2j2(sumOfMatrix, k, j1 + 1, maxOfI, j2),
                            getSumOfi1j1i2j2(sumOfMatrix, k, j2 + 1, maxOfI, j3),
                            getSumOfi1j1i2j2(sumOfMatrix, k, j3 + 1, maxOfI, maxOfJ)
                        );

                        const min = Math.min(up, down);
                        if (min >= newMin) {
                            found = k;
                            newMin = min;
                        }
                        k--;
                    }

                    split = found;
                    downMaxOfMin.unshift(newMin);
                }

                // 遍历中间一刀
                for (let i = 1; i <= maxOfI - 1; i++) {
                    const topMin = topMaxOfMin[i];
                    const downMin = downMaxOfMin[i + 1];

                    maxOfMin = Math.max(maxOfMin, Math.min(topMin, downMin));
                }
            }
        }
    }

    return maxOfMin;
}

// 将数组切成两部分，使得两部分中较小的值尽可能大（或者说使得较大的值尽可能小）
export function getMaxArrOf2PartsMin(arr: number[]): number[] {
    const leftMaxOfMin = [-Infinity];
    let split = 0;
    const prefixSum = [arr[0]];
    for (let i = 1; i < arr.length; i++) {
        prefixSum[i] = prefixSum[i - 1] + arr[i];

        // 从split位置往右尝试扩大min的值
        // 因为数组都是正数，所以往右的过程中两部分中较小的部分必然是扩大的
        // 具备单调性，所以上一次切割的位置是不回退的
        let k = split;
        let found = split;
        let newMin = leftMaxOfMin[i - 1];
        while (k < i) {
            // [0-k]属于左边，(k-i]属于右边
            const right = prefixSum[i] - prefixSum[k];
            const left = prefixSum[k];
            const min = Math.min(left, right);
            if (min >= newMin) {
                found = k;
                newMin = min;
            }

            k++;
        }

        split = found;
        leftMaxOfMin[i] = newMin;
    }

    return leftMaxOfMin;
}

export function getMaxArrOf2PartsMin2(arr: number[]): number[] {
    const leftMaxOfMin = [-Infinity];
    const prefixSum = [arr[0]];
    for (let i = 1; i < arr.length; i++) {
        prefixSum[i] = prefixSum[i - 1] + arr[i];

        // 暴力枚举所有第一部分和第二部分
        let k = 0;
        let min = -Infinity;
        // 左半部分[0-k] 右半部分(k-i]
        while (k < i) {
            const left = prefixSum[k];
            const right = prefixSum[i] - prefixSum[k];
            min = Math.max(min, Math.min(left, right));

            k++;
        }

        leftMaxOfMin[i] = min;
    }

    return leftMaxOfMin;
}

// 给定一个字符串，返回不包含重复字符的最长子串长度
export function lengthOfLongestSubstring(str: string): number {
    // 某个字符最近一次出现的位置
    const map: Map<string, number> = new Map();
    // dp[i] 以i结尾的子串中不含重复字符的最长子串长度
    const dp: number[] = new Array(str.length).fill(1);
    map.set(str[0], 0);

    let max = 1;
    for (let i = 1; i < str.length; i++) {
        // 两种可能性
        // 1) i位置到上一个i出现的位置
        // 2) dp[i-1] +1
        // 两者取较小值
        const prev = map.get(str[i]);
        dp[i] = Math.min(dp[i - 1] + 1, i - (prev === undefined ? -1 : prev));
        max = Math.max(max, dp[i]);

        map.set(str[i], i);
    }

    return max;
}

export function lengthOfLongestSubstring2(str: string): number {
    // 某个字符最近一次出现的位置
    const map: Map<string, number> = new Map();
    map.set(str[0], 0);
    let cur = 1;

    let max = 1;
    for (let i = 1; i < str.length; i++) {
        // 两种可能性
        // 1) i位置到上一个i出现的位置
        // 2) dp[i-1] +1
        // 两者取较小值
        const prevIndex = map.get(str[i]);
        cur = Math.min(cur + 1, i - (prevIndex === undefined ? -1 : prevIndex));
        max = Math.max(max, cur);

        map.set(str[i], i);
    }

    return max;
}

/* 
给定字符串s，问s中至多包含k个字符的子串中最长的是多少？

分析：窗口的单调性，窗口的范围和包含的字符种类之间有单调关系（窗口越大，包含的子串字符种类只可能更多，不可能更少）
*/
export function lengthOfLongestSubstringKDistinct(str: string, k: number): number {
    const map: Map<string, number> = new Map();

    // (left,right)
    let left = 0;
    let right = 0;
    let max = -Infinity;

    while (left <= right && right < str.length) {
        // 字符小于等于k个的时候right往右滑动，循环结束right会来到第一个违规的字符
        while ((map.size < k || (map.size == k && (map.get(str[right]) || 0) > 0)) && right < str.length) {
            const prev = map.get(str[right]) || 0;
            map.set(str[right++], prev + 1);
        }

        // 左边往右滑统计以left开头的时候子串最多能到多少
        max = Math.max(max, right - left++);

        // left位置的字符出set
        const prev = map.get(str[left]) || 0;
        if (prev <= 1) {
            map.delete(str[left]);
        } else {
            map.set(str[left], prev - 1);
        }
    }

    return max;
}

/* 
给定一个长度len，表示一共有几位
所有字符都是小写（a~z），可以生成长度为1，长度为2，
长度为3...长度为len的所有字符串
如果把所有字符串根据字典序排序，每个字符串都有所在的位置。
给定一个字符串str，给定len，请返回str是总序列中的第几个
比如len=4，字典序的前几个字符串为：
a aaa aaaaa aaab ... aaaz ... azzz b ba baaabzzz ca是这个序列中的第1个，bzzz是这个序列中的第36558个

分析，比如说bzzz
所有以a开头的字符0-2个有 1+26+26^2+26^3
所有以b开头剩下长度为0的字符 1

所有以ba-by开头剩下字符0-2个的有 (1+26+26^2)*25
所有以bz开头剩下长度为0的字符 1

所有以bza-bzy开头字符0-2个有（1+26）*25
所有以bzz开头剩下长度为0的字符 1

所有以bzza-bzzy开头的字符有（1）*25
所有以为bzzz开头剩下长度为0的字符 1也就是字符串bzzz本身
*/
export function stringKth(str: string, len: number): number {
    let result = 0;
    for (let i = 0; i < str.length; i++) {
        result += (str.charCodeAt(i) - 'a'.charCodeAt(0)) * stringKthF(len - i - 1) + 1;
    }

    return result;
}

// 不管以什么开头，剩下0-len所有的可能性
function stringKthF(len: number): number {
    // 一共有26个字母
    let result = 1;
    for (let i = 1, base = 26; i <= len; i++, base *= 26) {
        result += base;
    }

    return result;
}

/* 
把一个01字符串切成多个部分，要求每一部分的0和1比例一样，同时要求尽可能多的划分
比如：01010101
01 01 01 01 01 这是一种切法，0和1比例为 1 ： 1 
0101 0101 也是一种切法，0和1比例为 1：1
两种切法都符合要求，但是那么尽可能多的划分为第一种切法，部分数为4 
比如：00001111
只有一种切法就是00001111整体作为一块，那么尽可能多的划分，部分数为1 
给定一个01字符串str，假设长度为N，要求返回一个长度为N的数组ans
其中ans[i]= stc[0...i] 这个前缀串，要求每一部分的0和1比例一样，同时要求尽可能多的划分下，部分数是多少
输入：str="010100001"
输出：ans=【1，1，1，2，1，2，1，1，3】
*/
export function getMaxPartsArray(str: string): number[] {
    if (!str || str.length === 0) {
        return [];
    }

    const result: number[] = [];
    let zeroCount = 0;
    let oneCount = 0;
    const map: Map<number, Map<number, number>> = new Map();

    for (let i = 0; i < str.length; i++) {
        if (str[i] === '0') {
            zeroCount++;
        } else {
            oneCount++;
        }

        if (zeroCount === 0 || oneCount === 0) {
            // 如果0或1出现的次数为0则之前必然没出现过类似比例
            result[i] = 1;
            continue;
        }

        // 根据最大公约数化简成最简比例
        const factor = maxCommonFactor(zeroCount, oneCount);
        const top = zeroCount / factor;
        const down = oneCount / factor;

        if (map.get(top)?.get(down)) {
            result[i] = map.get(top)?.get(down)! + 1;
        } else {
            result[i] = 1;
        }

        if (!map.has(top)) {
            map.set(top, new Map());
        }
        const prev = map.get(top)?.get(down) || 0;
        map.get(top)?.set(down, prev + 1);
    }

    return result;
}

// 给定一个字符串str和一个正数k，返回长度为k的子序列中，字典序最大的子序列
export function getSubsequenceWithBiggestDictionarySequence(str: string, k: number): string {
    if (!str || str.length <= k) {
        return str;
    }

    // 搞个单调栈，字母顺序从大到小，当前字符大于栈顶就一直弹出栈顶，否则入栈
    // 如果此时栈中元素-1+剩下的元素正好等于k个则停止
    const stack: string[] = [];

    for (let i = 0; i < str.length; i++) {
        if (stack.length === 0) {
            stack.push(str[i]);
        } else {
            while (stack.length !== 0 && stack.length + str.length - i > k) {
                const top = stack[stack.length - 1];

                if (top < str[i]) {
                    stack.length--;
                } else {
                    stack.push(str[i]);
                    // 找到合适的位置之后就停止内层循环
                    break;
                }
            }

            if (stack.length + str.length - i === k) {
                return stack.join('') + str.slice(i);
            }
        }
    }

    return stack.slice(0, k).join('');
}

/* 
给定一个只由0和1组成的字符串S，假设下标从1开始，规定i位置的字符价值V[i]计算方式如下 :
1 i == 1时，V[i] = 1；
2 i > 1时，如果S[i] != S[i-1]，V[i] = 1；
3 i > 1时，如果S[i] == S[i-1]，V[i] = V[i-1] + 1。
你可以随意删除S中的字符，返回整个S的最大价值，（整个S的最大价值等于每个位置价值累加起来，所以不是简单求0和1的个数取较大就可以了）
字符串长度<=5000。
*/
export function getMaxValueOfS(str: string): number {
    // 这里的初始值lastVal写'0'或者'1'都无所谓，不影响最终结果
    return getMaxValueOfSProcess(str, 0, '0', 0);
}

/* 
当前字符来到i，上一次保留的字符是lastVal，上一次保留字符来到的价值是baseValue
返回i以及以后能获得的最大价值

有点类似于背包问题，不过是加了点限制条件，每个位置的价值依赖于前面做出的选择
*/
function getMaxValueOfSProcess(str: string, i: number, lastVal: string, baseValue: number): number {
    if (str.length === i) {
        return 0;
    }

    const curValue = str[i] === lastVal ? baseValue + 1 : 1;
    // 保留当前字符
    const p1 = getMaxValueOfSProcess(str, i + 1, str[i], curValue);
    // 删除当前字符
    const p2 = getMaxValueOfSProcess(str, i + 1, lastVal, baseValue);

    return Math.max(curValue + p1, p2);
}

/* 
一个子序列的消除规则如下：
1）在某一个子序列中，如果"1"的左边有'0'，那么这两个字符->"01"可以消除
2）在某一个子序列中，如果'3'的左边有'2'，那么这两个字符->"23"可以消除
3）当这个子序列的某个部分消除之后，认为其他字符会自动贴在一起，可以继续寻找消除的机会

比如，某个子序列"0231"，先消除掉"23"，那么剩下的字符贴在一起变成"01"，继续消除就没有字符了
如果某个子序列通过最优良的方式，可以都消掉，那么这样的子序列叫做"全消子序列"
一个只由'0'、'1'、'2'、'3'四种字符组成的字符串str，可以生成很多子序列，返回"全消子序列"的最大长度
字符串str长度<=200

范围尝试模型
*/
export function getMaxRemovableSubsequence(str: string): number {
    return getMaxRemovableSubsequenceProcess(str, 0, str.length - 1);
}

// 返回str从left到right范围上可消除子序列的最大长度
function getMaxRemovableSubsequenceProcess(str: string, left: number, right: number): number {
    // 只有一个字符，不可以消除
    if (left >= right) {
        return 0;
    }

    // 只有两个字符
    if (left === right - 1) {
        return (str[left] === '0' && str[right] === '1') || (str[left] === '2' && str[right] === '3') ? 2 : 0;
    }

    // 第一种可能性，不要left位置的字符
    const p1 = getMaxRemovableSubsequenceProcess(str, left + 1, right);
    // 如果左边是1或者3那么没有可能性2
    if (str[left] === '1' || str[left] === '3') {
        return p1;
    }

    // 第二种可能性，要left位置的字符
    // 如果left位置是0，则与之匹配的字符是1，如果是2则与之匹配的字符是3
    const match = str[left] === '0' ? '1' : '3';
    let p2 = 0;
    for (let i = left + 1; i <= right; i++) {
        // left.....i i+1...right
        if (str[i] === match) {
            p2 = Math.max(
                p2,
                // left+1到i-1
                getMaxRemovableSubsequenceProcess(str, left + 1, i - 1) +
                    // left和i
                    2 +
                    // i+1到right
                    getMaxRemovableSubsequenceProcess(str, i + 1, right)
            );
        }
    }

    return Math.max(p1, p2);
}

/* 
已知数组中无重复值，定义指标A等于 arr[i]-arr[i-1] 的绝对值，问至少交换多少次才能使得整个数组的指标A求和最小

很显然，将数组从大到小或者从小到大排序之后指标A的和必然是最小的，
然后我们将原数组离散化，因为数组中无重复值，所以我们将原数组离散化为 1-N上的点
比如说 [34,2,1,5] 可以离散化为 [4,2,1,3]，原数组的交换次数与离散化后的数组交换次数必然是一模一样的
这样问题就转变成求[4,2,1,3]变有序最少需要几次交换
*/
export function getMinChanges(arr: number[]): number {
    const valIndexMap: Map<number, number> = new Map();
    arr.forEach((val, index) => {
        valIndexMap.set(val, index);
    });

    const copy = arr.slice();
    copy.sort((a, b) => a - b);

    const newArr: number[] = [];
    for (let i = 0; i < copy.length; i++) {
        // 找到i位置的值在原数组中的下标
        const index = valIndexMap.get(copy[i]) as number;
        // 将原数组离散化成1-N之间的数
        newArr[index] = i + 1;
    }

    // 将离散化的数组从小到大排列统计交换次数
    let count1 = 0;
    const copy1 = newArr.slice();
    let i = 0;
    while (i < copy1.length) {
        // [1,2,3,4]
        if (copy1[i] !== i + 1) {
            swap(copy1, i, copy1[i] - 1);
            count1++;
        } else {
            i++;
        }
    }

    // 将离散化的数组从大到小排列统计交换次数
    let count2 = 0;
    const copy2 = newArr.slice();
    i = 0;
    while (i < copy2.length) {
        // [4,3,2,1]
        if (copy2[i] !== copy2.length - i) {
            swap(copy2, i, copy2.length - copy2[i]);
            count2++;
        } else {
            i++;
        }
    }

    return Math.min(count1, count2);
}

/* 
下一个全排列

A permutation of an array of integers is an arrangement of its members into a sequence or linear order.

For example, for arr = [1,2,3], the following are all the permutations of arr: [1,2,3], [1,3,2], [2, 1, 3], [2, 3, 1], [3,1,2], [3,2,1].
The next permutation of an array of integers is the next lexicographically greater permutation of its integer. More formally, 
if all the permutations of the array are sorted in one container according to their lexicographical order, 
then the next permutation of that array is the permutation that follows it in the sorted container. 
If such arrangement is not possible, the array must be rearranged as the lowest possible order (i.e., sorted in ascending order).

For example, the next permutation of arr = [1,2,3] is [1,3,2].
Similarly, the next permutation of arr = [2,3,1] is [3,1,2].
While the next permutation of arr = [3,2,1] is [1,2,3] because [3,2,1] does not have a lexicographical larger rearrangement.
Given an array of integers nums, find the next permutation of nums.

The replacement must be in place and use only constant extra memory.

Examples

Input: nums = [3,2,1]
Output: [1,2,3]

Input: nums = [1,1,5]
Output: [1,5,1]
*/
export function nextPermutation(nums: number[]): void {
    for (let i = nums.length - 1; i > 0; i--) {
        // 找到第一个后面的数比前面大的位置比如说[1,3,2]，3就是这里的i位置
        if (nums[i] > nums[i - 1]) {
            // 然后从i位置往后找比i-1位置大且最近的位置，也就是3后面的2
            let found = i;
            let left = i + 1;
            let right = nums.length - 1;
            while (left <= right) {
                const mid = left + ((right - left) >> 1);
                if (nums[mid] > nums[i - 1]) {
                    // 这里是小于或等于，我们要找大于i-1位置且最远的位置，这就能保证交换之后
                    // 从i到nums.length-1位置一定是降序的（没交换之前一定是降序的，又因为我们找的是离i-1最远的位置，所以这个位置的左边一定大于i-1位置，且右边一定小于i-1位置）
                    if (nums[mid] - nums[i - 1] <= nums[found] - nums[i - 1]) {
                        found = mid;
                    }

                    left = mid + 1;
                } else {
                    right = mid - 1;
                }
            }

            // 把比i-1位置大且值与i-1位置最接近的位置交换
            swap(nums, found, i - 1);

            // 经过上一步交换i-1之后的所有位置都可以从小到大排序了
            const sorted = nums.slice(i).reverse();
            for (let k = i; k < nums.length; k++) {
                nums[k] = sorted[k - i];
            }
            return;
        }
    }

    // 前面都比后面大，说明是全排列最后一个，回到第一个即可
    nums.reverse();
}

/* 
给定一个正数数组，要求返回累加和为sum的最长子数组

由于全部是正数，所以窗口向右的过程中子数组累加和一定会增长，存在单调性，可以用滑动窗口来解决
*/
export function getLengthOfLongestSubArrayWithSumK(arr: number[], k: number): number {
    let left = 0;
    let right = 0;
    let sum = arr[0];
    let found = 0;

    while (right < arr.length) {
        // [left,right]范围内正好累加和等于k
        if (sum === k) {
            found = Math.max(found, right - left + 1);
            sum -= arr[left++];
        } else if (sum < k) {
            right++;
            if (right === arr.length) {
                break;
            }

            sum += arr[right];
        } else {
            sum -= arr[left++];
        }
    }

    return found;
}

/* 
给定一个有正有负的数组，要求返回累加和为sum的最长子数组

与上一题有点类似，但本题不具备单调性，因为不能用滑动窗口来解决，可以用动态规划+预处理结构来解决
*/
export function getLengthOfLongestSubArrayWithSumK2(arr: number[], k: number): number {
    // 出现某个前缀和最早的位置
    const map: Map<number, number> = new Map();
    // 考虑0位置结尾的子串长度
    map.set(0, -1);

    let found = 0;
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
        sum += arr[i];
        const target = sum - k;
        if (map.has(target)) {
            found = Math.max(found, i - map.get(target)!);
        }

        if (!map.has(sum)) {
            map.set(sum, i);
        }
    }

    return found;
}

/* 
最佳聚会地点

给定一个矩阵，矩阵上所有位置的值都是0或者1，假设所有的1要往同一个地方（可以是0也可以是1）聚会，问所有1移动的最小代价是多少
1）所有的1只能横向移动或者纵向移动

举例
[
    [1,0,1]
]
最小距离是2，两个1都往中间走

大思路，先找到最终会汇集到哪一行，然后找到最终会汇集到哪一列，那个位置就是产生最小移动代价的位置
*/
export function getMinDistance(matrix: number[][]): number {
    // 找到每一行有多少个1
    const rowOneCounts = new Array(matrix.length).fill(0);
    // 找到每一列有多少个1
    const colOneCounts = new Array(matrix[0].length).fill(0);

    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[0].length; j++) {
            if (matrix[i][j] === 1) {
                rowOneCounts[i]++;
                colOneCounts[j]++;
            }
        }
    }

    // 先找到横向移动的最小代价
    let left = 0;
    let right = matrix.length - 1;
    let total = 0;
    let sumLeft = rowOneCounts[left];
    let sumRight = rowOneCounts[right];
    while (left < right) {
        // 如果左边小，说明左边所在的行不可能是最终汇聚的行，此时sumLeft所在的行都要向下移动一步
        // 相等的时候两边的移动代价一样，任意移动一边即可
        if (sumLeft < sumRight) {
            total += sumLeft;
            sumLeft += rowOneCounts[++left];
        } else {
            total += sumRight;
            sumRight += rowOneCounts[--right];
        }
    }

    // 同样逻辑找到纵向移动的最小代价
    left = 0;
    right = matrix[0].length - 1;
    sumLeft = colOneCounts[left];
    sumRight = colOneCounts[right];
    while (left < right) {
        // 如果左边小，说明左边所在的行不可能是最终汇聚的行，此时sumLeft所在的行都要向下移动一步
        // 相等的时候两边的移动代价一样，任意移动一边即可
        if (sumLeft < sumRight) {
            total += sumLeft;
            sumLeft += colOneCounts[++left];
        } else {
            total += sumRight;
            sumRight += colOneCounts[--right];
        }
    }

    return total;
}

/*
https://leetcode.com/problems/koko-eating-bananas/description/

Koko loves to eat bananas. There are n piles of bananas, the ith pile has piles[i] bananas. The guards have gone and will come back in h hours.

Koko can decide her bananas-per-hour eating speed of k. Each hour, she chooses some pile of bananas and eats k bananas from that pile.
If the pile has less than k bananas, she eats all of them instead and will not eat any more bananas during this hour.

Koko likes to eat slowly but still wants to finish eating all the bananas before the guards return.

Return the minimum integer k such that she can eat all the bananas within h hours.
*/
export function minEatingSpeed(piles: number[], h: number): number {
    let max = -Infinity;
    for (let i = 0; i < piles.length; i++) {
        max = Math.max(max, piles[i]);
    }

    let left = 1;
    let right = max;
    let found = max;
    while (left <= right) {
        const mid = left + ((right - left) >> 1);
        let sum = 0;
        for (let i = 0; i < piles.length; i++) {
            sum += Math.ceil(piles[i] / mid);
        }

        // 这里是小于等于，等于h的时候还是要继续往下找，因为上面的计算是向上取整的
        if (sum <= h) {
            found = mid;
            right = mid - 1;
        } else {
            left = mid + 1;
        }
    }

    return found;
}

/* 
https://leetcode.com/problems/uncrossed-lines/description/

You are given two integer arrays nums1 and nums2. We write the integers of nums1 and nums2 (in the order they are given) on two separate horizontal lines.

We may draw connecting lines: a straight line connecting two numbers nums1[i] and nums2[j] such that:

nums1[i] == nums2[j], and
the line we draw does not intersect any other connecting (non-horizontal) line.
Note that a connecting line cannot intersect even at the endpoints (i.e., each number can only belong to one connecting line).

Return the maximum number of connecting lines we can draw in this way.

Input: nums1 = [1,4,2], nums2 = [1,2,4]
Output: 2
Explanation: We can draw 2 uncrossed lines as in the diagram.
We cannot draw 3 uncrossed lines, because the line from nums1[1] = 4 to nums2[2] = 4 will intersect the line from nums1[2]=2 to nums2[1]=2.

本质上就是个最长公共子序列问题
*/
export function maxUncrossedLines(nums1: number[], nums2: number[]): number {
    // nums1[0-i] nums2[0-j] 前缀最多能有几组直线
    const dp: number[][] = new Array(nums1.length).fill(0).map((_) => new Array(nums2.length).fill(0));
    dp[0][0] = nums1[0] === nums2[0] ? 1 : 0;

    // 第0行
    for (let j = 1; j < nums2.length; j++) {
        dp[0][j] = dp[0][j - 1] === 1 ? 1 : nums2[j] === nums1[0] ? 1 : 0;
    }

    // 第0列
    for (let i = 1; i < nums1.length; i++) {
        dp[i][0] = dp[i - 1][0] === 1 ? 1 : nums1[i] === nums2[0] ? 1 : 0;
    }

    for (let i = 1; i < nums1.length; i++) {
        for (let j = 1; j < nums2.length; j++) {
            // 可能性整理
            // 1）不要j位置的数字
            // 2）不要j位置的数字
            // 3）i和j位置的数字都不要（这个答案一定不大于上面两个，这里直接省略）
            // 4）i位置的数字和j位置的数字相等
            dp[i][j] = Math.max(dp[i][j - 1], dp[i - 1][j]);
            if (nums1[i] === nums2[j]) {
                dp[i][j] = Math.max(dp[i][j], dp[i - 1][j - 1] + 1);
            }
        }
    }

    return dp[nums1.length - 1][nums2.length - 1];
}

/* 
你的国家有无数个湖泊，所有湖泊一开始都是空的。当第 n 个湖泊下雨前是空的，那么它就会装满水。如果第 n 个湖泊下雨前是 满的 ，这个湖泊会发生 洪水 。你的目标是避免任意一个湖泊发生洪水。

给你一个整数数组 rains ，其中：

rains[i] > 0 表示第 i 天时，第 rains[i] 个湖泊会下雨。
rains[i] == 0 表示第 i 天没有湖泊会下雨，你可以选择 一个 湖泊并 抽干 这个湖泊的水。
请返回一个数组 ans ，满足：

ans.length == rains.length
如果 rains[i] > 0 ，那么ans[i] == -1 。
如果 rains[i] == 0 ，ans[i] 是你第 i 天选择抽干的湖泊。
如果有多种可行解，请返回它们中的 任意一个 。如果没办法阻止洪水，请返回一个 空的数组 。

请注意，如果你选择抽干一个装满水的湖泊，它会变成一个空的湖泊。但如果你选择抽干一个空的湖泊，那么将无事发生。

https://leetcode.cn/problems/avoid-flood-in-the-city

输入：rains = [1,2,0,0,2,1]
输出：[-1,-1,2,1,-1,-1]
解释：第一天后，装满水的湖泊包括 [1]
第二天后，装满水的湖泊包括 [1,2]
第三天后，我们抽干湖泊 2 。所以剩下装满水的湖泊包括 [1]
第四天后，我们抽干湖泊 1 。所以暂时没有装满水的湖泊了。
第五天后，装满水的湖泊包括 [2]。
第六天后，装满水的湖泊包括 [1,2]。
可以看出，这个方案下不会有洪水发生。同时， [-1,-1,1,2,-1,-1] 也是另一个可行的没有洪水的方案。
*/
export function avoidFlood(rains: number[]): number[] {
    const set: Set<number> = new Set();
    const map: Map<number, number[]> = new Map();
    const minHeap = new GenericHeap<[lake: number, nextRainDay: number]>(
        ([, nextRainDayA], [, nextRainDayB]) => nextRainDayA - nextRainDayB
    );

    for (let i = 0; i < rains.length; i++) {
        if (rains[i] !== 0) {
            if (map.has(rains[i])) {
                map.get(rains[i])?.push(i);
            } else {
                map.set(rains[i], [i]);
            }
        }
    }

    const result: number[] = [];
    for (let i = 0; i < rains.length; i++) {
        if (rains[i] !== 0) {
            result[i] = -1;
            if (set.has(rains[i])) {
                return [];
            } else {
                set.add(rains[i]);
            }

            if (map.has(rains[i]) && map.get(rains[i])!.length >= 2) {
                minHeap.push([rains[i], map.get(rains[i])![1]]);
            }
        } else {
            if (!minHeap.isEmpty()) {
                const [lake] = minHeap.pop();
                result[i] = lake;

                set.delete(lake);
                map.get(lake)?.shift();
            }

            // leetcode测试数据要求多余的0需要填充成1
            if (result[i] === undefined) {
                result[i] = 1;
            }
        }
    }

    return result;
}

/* 
https://leetcode.com/problems/rotate-image/

You are given an n x n 2D matrix representing an image, rotate the image by 90 degrees (clockwise).

You have to rotate the image in-place, which means you have to modify the input 2D matrix directly. 
DO NOT allocate another 2D matrix and do the rotation.

分析思路，分层或者分圈来处理矩阵问题
*/
export function rotate(matrix: number[][]): void {
    let x1 = 0;
    let x2 = matrix.length - 1;
    while (x1 < x2) {
        rotateCircle(matrix, x1++, x2--);
    }
}

function rotateCircle(matrix: number[][], x1: number, x2: number) {
    for (let j = x1; j < x2; j++) {
        /*
        A: (x1,j) -> D
        B: (j,x2) -> A
        C: (x2,x2-(j-x1)) ->B
        D: (x2-(j-x1),x1) ->C
        */
        const tmp = matrix[x1][j];
        matrix[x1][j] = matrix[x2 - (j - x1)][x1];
        matrix[x2 - (j - x1)][x1] = matrix[x2][x2 - (j - x1)];
        matrix[x2][x2 - (j - x1)] = matrix[j][x2];
        matrix[j][x2] = tmp;
    }
}

/* 
Given an integer array nums, return the number of reverse pairs in the array.

A reverse pair is a pair (i, j) where:

0 <= i < j < nums.length and
nums[i] > 2 * nums[j].
*/
export function reversePairs(nums: number[]): number {
    return mergeAndCount(nums, 0, nums.length - 1);
}

function mergeAndCount(arr: number[], left: number, right: number): number {
    if (left >= right) {
        return 0;
    }

    const mid = left + ((right - left) >> 1);
    let count = mergeAndCount(arr, left, mid) + mergeAndCount(arr, mid + 1, right);

    let i = left;
    let j = mid + 1;
    // 此处i和j都不回退，虽然是两个循环不过时间复杂度是O(n)，整体时间复杂度还是O(nlogn)
    while (i <= mid) {
        while (j <= right && arr[i] / 2 > arr[j]) {
            j++;
        }

        count += j - mid - 1;
        i++;
    }

    merge(arr, left, mid, right);
    return count;
}

function merge(arr: number[], left: number, mid: number, right: number) {
    let i = left;
    let j = mid + 1;
    const tmp = new Array(right - left + 1);
    let k = 0;

    while (i <= mid && j <= right) {
        tmp[k++] = arr[i] <= arr[j] ? arr[i++] : arr[j++];
    }

    while (i <= mid) {
        tmp[k++] = arr[i++];
    }

    while (j <= right) {
        tmp[k++] = arr[j++];
    }

    for (let k = 0; k < tmp.length; k++) {
        arr[left + k] = tmp[k];
    }
}

/* 
https://leetcode.com/problems/maximum-running-time-of-n-computers/description/
You have n computers. You are given the integer n and a 0-indexed integer array batteries where the ith battery 
can run a computer for batteries[i] minutes. You are interested in running all n computers simultaneously using the given batteries.

Initially, you can insert at most one battery into each computer. After that and at any integer time moment, 
you can remove a battery from a computer and insert another battery any number of times.
The inserted battery can be a totally new battery or a battery from another computer. 
You may assume that the removing and inserting processes take no time.

Note that the batteries cannot be recharged.

Return the maximum number of minutes you can run all the n computers simultaneously.

思路：二分答案
leetcode上测试数据电池比较大，这里使用BigInt来处理大数据
*/
export function maxRunTime(n: number, batteries: number[]): number {
    batteries.sort((a, b) => a - b);
    const prefixSum = [BigInt(batteries[0])];
    for (let i = 1; i < batteries.length; i++) {
        prefixSum[i] = BigInt(prefixSum[i - 1]) + BigInt(batteries[i]);
    }

    const max = prefixSum[prefixSum.length - 1] / BigInt(n);

    let left = BigInt(0);
    let right = max;
    let found = left;
    while (left <= right) {
        const mid = left + (right - left) / BigInt(2);
        if (canRunXMinutes(n, batteries, prefixSum, mid)) {
            found = mid;
            left = mid + BigInt(1);
        } else {
            right = mid - BigInt(1);
        }
    }

    return Number(found);
}

function canRunXMinutes(n: number, batteries: number[], prefixSum: bigint[], minutes: bigint): boolean {
    let longerBatteriesCount = 0;
    let left = 0;
    let right = batteries.length - 1;
    while (left <= right) {
        const mid = left + ((right - left) >> 1);
        if (batteries[mid] >= minutes) {
            longerBatteriesCount = batteries.length - mid;
            right = mid - 1;
        } else {
            left = mid + 1;
        }
    }

    if (longerBatteriesCount >= n) {
        return true;
    }

    const leftComputer = BigInt(n - longerBatteriesCount);
    const leftBatteries = batteries.length - longerBatteriesCount;

    return leftBatteries >= leftComputer && prefixSum[leftBatteries - 1] >= leftComputer * minutes;
}

/* 
来自谷歌
给定一个数组arr，长度为n
表示n个服务员，每个人服务一个人的时间
给定一个正数m，表示有m个人等位
如果你是刚来的人，请问你需要等多久？
假设：m远远大于n，比如n<=1000，m<=10的9次方，该怎么做？
*/
export function leastWaitingTime(arr: number[], m: number): number {
    const minHeap = new GenericHeap<[serviceTime: number, freeTime: number]>(
        ([, freeTimeA], [, freeTimeB]) => freeTimeA - freeTimeB
    );
    for (let i = 0; i < arr.length; i++) {
        minHeap.push([arr[i], 0]);
    }

    while (m--) {
        const [serviceTime, freeTime] = minHeap.pop()!;
        minHeap.push([serviceTime, freeTime + serviceTime]);
    }

    const [, freeTime] = minHeap.pop()!;
    return freeTime;
}

// 由于m很大，从而导致mlogn也会很大，上面的解法就不太能接受了
// 我们可以通过二分答案的方式来加速
export function leastWaitingTime2(arr: number[], m: number): number {
    const min = Math.min(...arr);
    // 所有的人都由效率最高的服务员来服务，min * m 时间之后就可以服务下一个了
    const maxWaitTime = min * m;

    let left = 0;
    let right = maxWaitTime;
    let found = right;
    while (left <= right) {
        const mid = left + ((right - left) >> 1);
        // 这里是m+1，不是m，表示最小的可服务m+1个人的时间，也就是第m+1个人最小的等候时间
        if (maxServicePeople(arr, mid) >= m + 1) {
            found = mid;
            right = mid - 1;
        } else {
            left = mid + 1;
        }
    }

    return found;
}

// 给定服务员和服务分钟数，返回能够服务的最大人数
function maxServicePeople(arr: number[], time: number): number {
    return arr.reduce((acc, cur) => acc + Math.floor(time / cur) + 1, 0);
}

/* 
https://leetcode.com/problems/unique-substrings-in-wraparound-string/

We define the string base to be the infinite wraparound string of "abcdefghijklmnopqrstuvwxyz", so base will look like this:

"...zabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcd....".
Given a string s, return the number of unique non-empty substrings of s are present in base.

Input: s = "zab"
Output: 6
Explanation: There are six substrings ("z", "a", "b", "za", "ab", and "zab") of s in base.

分析，考察s中以不同字符结尾的子串 ...a,...b,...c等
如果我们能分别计算出以不同字符结尾的子串，那么去重之后的结果就是最终结果
然后我们单独看某个字母结尾的子串，只需要统计其中最长的子串长度即可，因为最长的必然包含短的
比如说 xyzayza xyza必然包含了yza，我们只需要根据最长的串来计算以a结尾的子串个数
*/
export function findSubstringInWrapRoundString(s: string): number {
    const counts = new Array(26).fill(0);

    for (let i = s.length - 1; i >= 0; ) {
        // 考察当前字符往左可以扩多长
        let cur = i;
        while (cur - 1 >= 0) {
            const leftIndex = getCharIndex(s[cur - 1]);
            const curIndex = getCharIndex(s[cur]);
            if (leftIndex + 1 === curIndex || leftIndex === curIndex + 25) {
                cur--;
            } else {
                break;
            }
        }

        for (let k = i; k >= cur; k--) {
            const index = getCharIndex(s[k]);
            counts[index] = Math.max(counts[index], k - cur + 1);
        }

        i = cur - 1;
    }

    return counts.reduce((acc, cur) => acc + cur, 0);
}

export function findSubstringInWrapRoundString2(s: string): number {
    const counts = new Array(26).fill(0);

    const index = getCharIndex(s[0]);
    counts[index] = 1;
    let len = 1;

    for (let i = 1; i < s.length; i++) {
        const prevIndex = getCharIndex(s[i - 1]);
        const curIndex = getCharIndex(s[i]);
        if (prevIndex + 1 === curIndex || prevIndex === curIndex + 25) {
            len++;
        } else {
            len = 1;
        }

        counts[curIndex] = Math.max(counts[curIndex], len);
    }

    return counts.reduce((acc, cur) => acc + cur, 0);
}

/* 
有一个数组，相邻位置的数字不等，返回局部最小的位置

局部最小定义
1) 0位置<1位置 0位置就是局部最小
2) n-1位置<n-2位置 n-1位置就是局部最小
3) i-1位置>i位置 && i位置<i+1位置 则i位置是局部最小
*/
export function getMin(arr: number[]): number {
    if (arr.length === 0) {
        return -1;
    }

    if (arr[0] < arr[1]) {
        return 0;
    }
    if (arr[arr.length - 1] < arr[arr.length - 2]) {
        return arr.length - 1;
    }

    let left = 0;
    let right = arr.length - 1;
    while (left < right) {
        const mid = left + ((right - left) >> 1);

        if (arr[mid] > arr[mid - 1]) {
            right = mid - 1;
        } else if (arr[mid] > arr[mid + 1]) {
            left = mid + 1;
        } else {
            return mid;
        }
    }

    return -1;
}

/* 
https://leetcode.com/problems/letter-tile-possibilities/description/

You have n  tiles, where each tile has one letter tiles[i] printed on it.

Return the number of possible non-empty sequences of letters you can make using the letters printed on those tiles.

Input: tiles = "AAB"
Output: 8
Explanation: The possible sequences are "A", "B", "AA", "AB", "BA", "AAB", "ABA", "BAA".
*/
export function numTilePossibilities(tiles: string): number {
    return numTilePossibilitiesProcess(tiles.split(''), 0);
}

function numTilePossibilitiesProcess(tiles: string[], i: number): number {
    if (i === tiles.length) {
        return 0;
    }

    const set: Set<string> = new Set();
    let count = 0;
    for (let k = i; k < tiles.length; k++) {
        if (!set.has(tiles[k])) {
            set.add(tiles[k]);

            swap(tiles, i, k);
            count += numTilePossibilitiesProcess(tiles, i + 1) + 1;
            swap(tiles, i, k);
        }
    }

    return count;
}

/* 
给定一个数组，求如果排序之后，相邻两数的最大差值。要求时间复杂度0（N），且要求不能用非基于比较的排序。

分析，假设一共有n个数，我们准备n+1个桶，把这n个数放进n+1个桶里面，那么必然有一个桶是空的，这时候下一个非空桶的最小值减去上一个非空桶的
最大值必然大于桶内排序之后的差值（桶内差值最大是桶的容量）
*/
export function getMaxDiff(arr: number[]): number {
    let min = Infinity;
    let max = -Infinity;
    for (let i = 0; i < arr.length; i++) {
        min = Math.min(min, arr[i]);
        max = Math.max(max, arr[i]);
    }
    if (max === min) {
        return 0;
    }

    const getBid = (num: number) => {
        return Math.floor(((num - min) * arr.length) / (max - min));
    };

    const maxBuckets = new Array(arr.length + 1).fill(undefined);
    const minBuckets = new Array(arr.length + 1).fill(undefined);

    for (let i = 0; i < arr.length; i++) {
        const bid = getBid(arr[i]);
        maxBuckets[bid] = maxBuckets[bid] === undefined ? arr[i] : Math.max(maxBuckets[bid], arr[i]);
        minBuckets[bid] = minBuckets[bid] === undefined ? arr[i] : Math.min(minBuckets[bid], arr[i]);
    }

    let maxDiff = -Infinity;
    let lastMax = maxBuckets[0];
    let i = 1;
    while (i < minBuckets.length) {
        if (minBuckets[i] !== undefined) {
            maxDiff = Math.max(maxDiff, minBuckets[i] - lastMax);
            lastMax = maxBuckets[i];
        }
        i++;
    }

    return maxDiff;
}

/* 
小虎去附近的商店买苹果，奸诈的商贩使用了捆绑交易，只提供6个每袋和8个每袋的包装，包装不可拆分。
可是小虎现在只想购买恰好n个苹果，小虎想购买尽量少的袋数方便携带。如果不能购买恰好n个苹果，小虎将不会购买。
输入一个整数n，表示小虎想购买的个苹果，返回最小使用多少袋子。如果无论如何都不能正好装下，返回-1。
*/
export function getMinBags(n: number): number {
    return getMinBagsProcess([6, 8], 0, n);
}

// 剩余重量是rest，i号和以后的袋子随便挑选，返回消费的最少袋子数
function getMinBagsProcess(arr: number[], i: number, rest: number): number {
    if (i === arr.length) {
        return rest === 0 ? 0 : -1;
    }

    let count = Infinity;
    for (let k = 0; k <= Math.floor(rest / arr[i]); k++) {
        const next = getMinBagsProcess(arr, i + 1, rest - k * arr[i]);
        if (next !== -1) {
            count = Math.min(count, next + k);
        }
    }

    return count === Infinity ? -1 : count;
}

export function getMinBagsDp(n: number): number {
    const arr = [6, 8];

    // dp[i][rest]
    // i以及i以后的袋子可以自由选择，返回搞定rest的最少袋子数
    const dp: number[][] = new Array(arr.length + 1).fill(0).map((_) => new Array(n + 1).fill(-1));
    // 最后一行
    dp[arr.length][0] = 0;

    for (let i = arr.length - 1; i >= 0; i--) {
        for (let rest = 0; rest <= n; rest++) {
            let count = Infinity;
            for (let k = 0; k <= Math.floor(rest / arr[i]); k++) {
                const next = dp[i + 1][rest - k * arr[i]];
                if (next !== -1) {
                    count = Math.min(count, next + k);
                }
            }

            dp[i][rest] = count === Infinity ? -1 : count;
        }
    }

    return dp[0][n];
}

export function getMinBagsDp2(n: number): number {
    const arr = [6, 8];

    // dp[i][rest]
    // i以及i以后的袋子可以自由选择，返回搞定rest的最少袋子数
    const dp: number[] = new Array(n + 1).fill(-1);
    // 最后一行
    dp[0] = 0;
    let prevDp = dp.slice();

    for (let i = arr.length - 1; i >= 0; i--) {
        for (let rest = 0; rest <= n; rest++) {
            // 通过观察优化枚举行为
            dp[rest] = prevDp[rest];
            if (rest - arr[i] >= 0 && dp[rest - arr[i]] >= 0) {
                dp[rest] = dp[rest] === -1 ? dp[rest - arr[i]] + 1 : Math.min(dp[rest], dp[rest - arr[i]] + 1);
            }
        }

        prevDp = dp.slice();
    }

    return dp[n];
}

/* 
https://leetcode.com/problems/number-of-submatrices-that-sum-to-target/description/
Given a matrix and a target, return the number of non-empty submatrices that sum to target.

A submatrix x1, y1, x2, y2 is the set of all cells matrix[x][y] with x1 <= x <= x2 and y1 <= y <= y2.

Two submatrices (x1, y1, x2, y2) and (x1', y1', x2', y2') are different if they have some coordinate that is different: for example, if x1 != x1'.

Input: matrix = [[0,1,0],[1,1,1],[0,1,0]], target = 0
Output: 4
Explanation: The four 1x1 submatrices that only contain 0.
*/
export function numSubMatrixSumTarget(matrix: number[][], target: number): number {
    const prefixSum = new Array(matrix.length).fill(0).map((_) => new Array(matrix[0].length).fill(0));

    // 第0行
    for (let j = 0; j < matrix[0].length; j++) {
        prefixSum[0][j] = matrix[0][j];
    }

    for (let j = 0; j < matrix[0].length; j++) {
        for (let i = 1; i < matrix.length; i++) {
            prefixSum[i][j] = prefixSum[i - 1][j] + matrix[i][j];
        }
    }

    let count = 0;
    for (let i1 = 0; i1 < matrix.length; i1++) {
        for (let i2 = i1; i2 < matrix.length; i2++) {
            const sumArr: number[] = [];
            for (let j = 0; j < matrix[0].length; j++) {
                sumArr[j] = prefixSum[i2][j] - (i1 - 1 >= 0 ? prefixSum[i1 - 1][j] : 0);
            }

            count += numSubarraySumTarget(sumArr, target);
        }
    }

    return count;
}

function numSubarraySumTarget(arr: number[], target: number): number {
    // 某个前缀和出现了几次
    const map: Map<number, number> = new Map();
    map.set(0, 1);

    let sum = 0;
    let count = 0;
    for (let i = 0; i < arr.length; i++) {
        sum += arr[i];
        if (map.has(sum - target)) {
            count += map.get(sum - target)!;
        }

        map.set(sum, (map.get(sum) || 0) + 1);
    }

    return count;
}

/* 
https://leetcode.com/problems/flip-columns-for-maximum-number-of-equal-rows/
You are given an m x n binary matrix matrix.

You can choose any number of columns in the matrix and flip every cell in that column (i.e., Change the value of the cell from 0 to 1 or vice versa).

Return the maximum number of rows that have all values equal after some number of flips.

通过分析可知通过翻转可以使得同行都是0或者1的数字有如下特点
1) 两行相等 
比如说 
001
001
那么，一定可以同时翻转00或者同时翻转1来使得同行都是0或者1

2) 两行正好相反
001
110
那么我们可以通过翻转00和1来实现同行都是0或者1

基于上面的分析我们可以构建特征字符串，如果一个字符与前面的字符相等我们用0表示，不等用1表示
001->"001"
110->"001"
001->"001"
001->"001"

那么原问题就变成求特征字符串的出现次数，最多的就是我们想要的答案
*/
export function maxEqualRowsAfterFlips(matrix: number[][]): number {
    const map: Map<string, number> = new Map();

    for (let i = 0; i < matrix.length; i++) {
        let str = '0';
        for (let j = 1; j < matrix[0].length; j++) {
            str += matrix[i][j] === matrix[i][j - 1] ? '0' : '1';
        }
        map.set(str, (map.get(str) || 0) + 1);
    }

    let max = 0;
    for (const [, size] of map) {
        max = Math.max(max, size);
    }

    return max;
}

/* 
https://leetcode.com/problems/is-subsequence/description/

Given two strings s and t, return true if s is a subsequence of t, or false otherwise.

A subsequence of a string is a new string that is formed from the original string by deleting some 
(can be none) of the characters without disturbing the relative positions of the remaining characters. 
(i.e., "ace" is a subsequence of "abcde" while "aec" is not).

本题直接从左到右遍历即可，两个都不回退，不用动态规划
*/
export function isSubsequence(s: string, t: string): boolean {
    if (s.length === 0 || t.length === 0) {
        return t.length >= s.length;
    }

    let sIndex = 0;
    let tIndex = 0;
    while (sIndex < s.length && tIndex < t.length) {
        if (s[sIndex] === t[tIndex]) {
            sIndex++;
        }
        tIndex++;
    }

    return sIndex === s.length;
}

/* 
给定一个N×N的矩阵matrix，在这个矩阵中，只有0和1两种值，返回边框全是1的最大正方形的边长长度。

例如 
0 1 1 1
0 1 0 1
0 1 1 1

边框全是1的最大正方形的边长是3

利用预处理结构优化时间复杂度
*/
export function maxSquareSideLength(matrix: number[][]): number {
    // 某个位置包含自身右侧有多少个连续的1
    const rightOnes = new Array(matrix.length).fill(0).map((_) => new Array(matrix[0].length).fill(0));
    // 某个位置包含自身下侧有多少个连续的1
    const downOnes = new Array(matrix.length).fill(0).map((_) => new Array(matrix[0].length).fill(0));

    for (let i = matrix.length - 1; i >= 0; i--) {
        for (let j = matrix[0].length - 1; j >= 0; j--) {
            const right = j + 1 < matrix[0].length ? rightOnes[i][j + 1] : 0;
            const down = i + 1 < matrix.length ? downOnes[i + 1][j] : 0;

            rightOnes[i][j] = matrix[i][j] === 1 ? right + 1 : 0;
            downOnes[i][j] = matrix[i][j] === 1 ? down + 1 : 0;
        }
    }

    let max = 0;
    // 暴力遍历每个位置能否作为大正方形的左上角
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[0].length; j++) {
            if (matrix[i][j] === 0) {
                continue;
            }

            const top = rightOnes[i][j];
            const left = downOnes[i][j];
            const maxLen = Math.min(top, left);
            // 不考虑只有一个1的场景，边长至少要是2才能组成一个正方形
            if (maxLen < 2) {
                continue;
            }

            for (let len = 2; len <= maxLen; len++) {
                const right = downOnes[i][j + len - 1];
                const down = rightOnes[i + len - 1][j];

                if (right >= len && down >= len) {
                    max = Math.max(max, len);
                }
            }
        }
    }

    return max;
}

/* 
给定一个整型数组arr，返回不包含本位置值的累乘数组。
例如，arr=[2，3，1，4]，返回[12，8，24，6]，即除自己外，其他位置上的累乘。

分析，如果数组中有一个0则只有0位置上是其他位置的乘积，其他位置都是0，如果数组中有不止一个0则
所有位置都是0
*/
export function product(arr: number[]): number[] {
    if (!arr || arr.length === 0) {
        return [];
    }

    let all = 1;
    let zeroCount = 0;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === 0) {
            zeroCount++;
        } else {
            all *= arr[i];
        }
    }

    const result: number[] = [];
    if (zeroCount === 0) {
        for (let i = 0; i < arr.length; i++) {
            result[i] = all / arr[i];
        }
    } else if (zeroCount === 1) {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] === 0) {
                result[i] = all;
            } else {
                result[i] = 0;
            }
        }
    } else {
        for (let i = 0; i < arr.length; i++) {
            result[i] = 0;
        }
    }

    return result;
}

export function product2(arr: number[]): number[] {
    if (!arr || arr.length === 0) {
        return [];
    }

    const result: number[] = [arr[0]];
    for (let i = 1; i < arr.length; i++) {
        result[i] = result[i - 1] * arr[i];
    }

    let tmp = 1;
    for (let i = arr.length - 1; i > 0; i--) {
        result[i] = result[i - 1] * tmp;
        tmp *= arr[i];
    }
    result[0] = tmp;

    return result;
}

/* 
给定数组 arr 和整数 num，共返回有多少个子数组满足如下情况：
max(arr[i..j])-min(arr[i..j])<=num
max（arr【i..j】）表示子数组 arr【i..j】中的最大值，min（arr【i..j】）表示子数组arr【i..j】中的最小值。
【要求】
如果数组长度为 N，请实现时间复杂度为 0（N）的解法。
*/
export function countSubArrays(arr: number[], num: number): number {
    const qMax = new SlidingWindow(arr);
    const qMin = new SlidingWindow(arr, (last, right) => last - right);

    qMax.moveRight();
    qMin.moveRight();

    let count = 0;
    while (qMax.right < arr.length) {
        const max = qMax.peek();
        const min = qMin.peek();

        if (max - min > num) {
            // 必须以left+1开头的情况下有多少个子数组达标
            count += qMax.right - qMax.left - 1;

            qMax.moveLeft();
            qMin.moveLeft();
        } else {
            qMax.moveRight();
            qMin.moveRight();
        }
    }

    // 最后剩下的数字不管怎么组合都是符合要求的，直接按照以每一个left开头来计算总的子数组数
    let k = qMax.right - qMax.left - 1;
    while (k > 0) {
        count += k;
        k--;
    }

    return count;
}

export function countSubArrays2(arr: number[], num: number): number {
    let count = 0;

    for (let i = 0; i < arr.length; i++) {
        let max = arr[i];
        let min = arr[i];

        for (let j = i; j < arr.length; j++) {
            max = Math.max(max, arr[j]);
            min = Math.min(min, arr[j]);

            if (max - min <= num) {
                count++;
            }
        }
    }

    return count;
}

/* 
370003796
给定一个非负整数 N，返回 N！结果的末尾为0 的数量。
例如：3！=6，结果的末尾没有0，则返回0。5！=120，结果的末尾有1个0，返回1。1000000000！，结果的末尾有24999998个0，返回24999998。

分析，每个2和5组合可以得到10，n的阶乘中2的因子必然比5的因子更多，所以问题就转变成就n的阶乘中有多少个5的因子
*/
export function countZeros(n: number): number {
    let count = 0;
    while (n !== 0) {
        count += Math.floor(n / 5);
        n = Math.floor(n / 5);
    }

    return count;
}

/* 
给定一个非负整数 N，如果用二进制数表达 N！的结果，返回最低位的 1 在哪个位置上，认为最右的位置为位置0。
例如：1！=1，最低位的1在0位置上。2！=2，最低位的1在1位置上。100000000！，最低
位的1在999999987位置上。

这道题本质上是在问n的阶乘中有几个2的因子，因为是用2进制来表达数字，每出现一个2的因子都会把最右侧的1往左移动一位
*/
export function getNumOfMostRightOne(n: number): number {
    let count = 0;
    while (n !== 0) {
        count += Math.floor(n / 2);
        n = Math.floor(n / 2);
    }

    return count;
}

export function getNumOfMostRightOne2(n: number): number {
    const num = n;
    let ones = 0;

    while (n !== 0) {
        const mostRightOne = n & (~n + 1);
        ones++;
        n -= mostRightOne;
    }

    return num - ones;
}

/* 
给定一个整型数组 arr，数组中的每个值都为正数，表示完成一幅画作需要的时间，再给定 一个整数 num，
表示画匠的数量，每个画匠只能画连在一起的画作。所有的画家并行工作，请 返回完成所有的画作需要的最少时间。

【举例】
arr=[3,1,4], num=2。
最好的分配方式为第一个画匠画3和1，所需时间为4。第二个画匠画 4，所需时间为4。因为并行工作，所以最少时间为4。
如果分配方式为第一个画匠画3，所需时间为3。第二个画 匠画1和 4，所需的时间为5。那么最少时间为5，显然没有第一种分配方式好。所以返回 4。

arr=[1,1,1,4,3], num=3。
最好的分配方式为第一个画匠画前三个1，所需时间为3。第二个画匠画4，所需时间为 4。第三个画匠画 3，所需时间为 3。返回 4。
*/
export function getMinTimeOfDrawing(arr: number[], num: number): number {
    // dp[i][j] 0-j的画由0-j的画师来负责
    const dp: number[][] = new Array(arr.length).fill(0).map((_) => new Array(num).fill(0));
    // 第0行
    for (let j = 0; j < num; j++) {
        dp[0][j] = arr[0];
    }

    const prefixSum = [arr[0]];
    // 第0列
    for (let i = 1; i < arr.length; i++) {
        dp[i][0] = dp[i - 1][0] + arr[i];
        prefixSum[i] = prefixSum[i - 1] + arr[i];
    }

    // 从上到下，从左到右填表
    for (let i = 1; i < arr.length; i++) {
        for (let j = 1; j < num; j++) {
            // j号画师负责1,2,3,4...画作
            dp[i][j] = Infinity;
            for (let k = i; k >= 0; k--) {
                dp[i][j] = Math.min(
                    dp[i][j],
                    Math.max(prefixSum[i] - (k === 0 ? 0 : prefixSum[k - 1]), k === 0 ? 0 : dp[k - 1][j - 1])
                );
            }
        }
    }

    return dp[arr.length - 1][num - 1];
}

/* 
https://leetcode.com/problems/divide-two-integers/description/

Given two integers dividend and divisor, divide two integers without using multiplication, division, and mod operator.

The integer division should truncate toward zero, which means losing its fractional part. For example, 8.345 would be truncated to 8, 
and -2.7335 would be truncated to -2.

Return the quotient after dividing dividend by divisor.

Note: Assume we are dealing with an environment that could only store integers within the 32-bit signed integer range: [−231, 231 − 1]. 
For this problem, if the quotient is strictly greater than 231 - 1, then return 231 - 1, and if the quotient is strictly less than -231, then return -231.
*/
const MAX_INT = Math.pow(2, 31) - 1;
const MIN_INT = -Math.pow(2, 31);

export function divide(dividend: number, divisor: number): number {
    const pDividend = Math.abs(dividend);
    const pDivisor = Math.abs(divisor);
    if (pDividend < pDivisor) {
        return 0;
    }

    let left = 1;
    let right = pDividend;
    let found = 1;
    while (left <= right) {
        const mid = left + ((right - left) >> 1);
        const tmp = multi(pDivisor, mid);
        if (tmp === pDividend) {
            found = mid;
            break;
        }

        if (tmp > pDividend) {
            right = mid - 1;
        } else {
            left = mid + 1;
            found = mid;
        }
    }

    return (dividend > 0 && divisor > 0) || (dividend < 0 && divisor < 0)
        ? found <= MAX_INT
            ? found
            : MAX_INT
        : -found >= MIN_INT
        ? -found
        : MIN_INT;
}

function multi(a: number, times: number): number {
    if (times === 1) {
        return a;
    }

    const tmp = multi(a, times >>> 1);
    if ((times & 1) === 1) {
        return tmp + tmp + a;
    } else {
        return tmp + tmp;
    }
}

/* 
https://leetcode.com/problems/wildcard-matching/description/

Given an input string (s) and a pattern (p), implement wildcard pattern matching with support for '?' and '*' where:

'?' Matches any single character.
'*' Matches any sequence of characters (including the empty sequence).
The matching should cover the entire input string (not partial).
*/
export function wildcardMatch(s: string, p: string): boolean {
    if (s.length === 0) {
        return isAllAsterisk(p) || p.length === 0;
    }
    if (p.length === 0) {
        return false;
    }

    // dp[i][j] s[0-i]是否与p[0-j]匹配 返回dp[s.length-1][p.length-1]
    const dp: boolean[][] = new Array(s.length).fill(0).map((_) => new Array(p.length).fill(false));
    dp[0][0] = isEqual(s[0], p[0]);

    // 第0行
    for (let j = 1; j < p.length; j++) {
        if (dp[0][j - 1] === false) {
            break;
        }

        dp[0][j] = p[j] === '*' || (isAllAsterisk(p.slice(0, j)) && isEqual(s[0], p[j]));
    }

    // 第0列
    for (let i = 1; i < s.length; i++) {
        if (p[0] === '*') {
            dp[i][0] = true;
        }
    }

    // 此处故意先遍历列再遍历行，用于优化枚举行为
    for (let j = 1; j < p.length; j++) {
        for (let i = 1; i < s.length; i++) {
            if (p[j] !== '*') {
                dp[i][j] = dp[i - 1][j - 1] && isEqual(s[i], p[j]);
            } else {
                // 通过观察优化枚举行为
                dp[i][j] = dp[i][j - 1] || dp[i - 1][j];
            }
        }
    }

    return dp[s.length - 1][p.length - 1];
}

function isEqual(s: string, p: string) {
    return s === p || (s && p === '?') || p === '*';
}

function isAllAsterisk(p: string) {
    return /^\*+$/.test(p);
}

export function wildcardMatch2(s: string, p: string): boolean {
    let i = 0;
    let j = 0;
    let star = -1;
    let match = 0;
    while (i < s.length) {
        if (j < p.length && (p[j] === '?' || p[j] === s[i])) {
            i++;
            j++;
        } else if (j < p.length && p[j] === '*') {
            // *号匹配0个字符
            star = j;
            match = i;
            j++;
        } else if (star !== -1) {
            // *号匹配1到多个字符
            j = star + 1;
            match++;
            i = match;
        } else {
            return false;
        }
    }
    while (j < p.length && p[j] === '*') {
        j++;
    }
    return j === p.length;
}

/* 
用一个整型矩阵matrix表示一个网络，1代表有路，0代表无路，
每一个位置只要不越界，都有上下左右4个方向，求从最左上角到最右下角的最短通路值。

借助队列来做宽度优先遍历
*/
export function minPathValue(matrix: number[][]): number {
    const queue = new Queue<[x: number, y: number]>();
    const map: number[][] = new Array(matrix.length).fill(0).map((_) => new Array(matrix[0].length).fill(0));
    queue.add([0, 0]);
    map[0][0] = 1;

    const add = (x: number, y: number, distance: number) => {
        if (x >= 0 && x < matrix.length && y >= 0 && y < matrix[0].length && map[x][y] === 0 && matrix[x][y] === 1) {
            queue.add([x, y]);
            map[x][y] = distance + 1;
        }
    };

    while (!queue.isEmpty()) {
        const [x, y] = queue.poll()!;
        const distance = map[x][y];

        // 上下左右四个方向入队列
        add(x - 1, y, distance);
        add(x + 1, y, distance);
        add(x, y - 1, distance);
        add(x, y + 1, distance);
    }

    return map[matrix.length - 1][matrix[0].length - 1];
}

/* 
给定两个整数W和K，W代表你拥有的初始资金，K代表你最多可以做K个项目。再给定两个长度为N的正数数组costs[]和profits[]，
代表一共有N个项目，costs[i]和profits[i]分别表示第i号项目的启动资金与做完后的利润
（注意是利润，如果一个项目启动资金为10，利润为4，代表该项目最终的收入为 14）。
你不能并行只能串行地做项目，并且手里拥有的资金大于或等于某个项目的启动资金时，你才能做这个项目。
该如何选择做项目，能让你最终的收益最大？返回最后能获得的最大资金。

举例
w:3
k:2
costs:[5,4,1,2]
profits:[3,5,3,2]

初始资金为3，最多做2个项目，每个项目的启动资金与利润见costs和profits。最优选择为：先做2号项目，
做完之后资金增长到6。然后做1号项目，做完之后资金增长到11。其他的任何选择都不会比这种选择好，所以返回11。
*/
export function maxProfits(costs: number[], profits: number[], w: number, k: number): number {
    const arr: Array<[cost: number, profit: number]> = [];
    for (let i = 0; i < costs.length; i++) {
        arr.push([costs[i], profits[i]]);
    }

    // 按照利润从大到小排列
    arr.sort(([, aProfit], [, bProfit]) => bProfit - aProfit);

    while (k-- > 0) {
        for (let i = 0; i < arr.length; i++) {
            const [cost, profit] = arr[i];
            if (cost <= w) {
                w += profit;
                arr.splice(i, 1);
                break;
            }
        }
    }

    return w;
}

export function maxProfits2(costs: number[], profits: number[], w: number, k: number): number {
    const minCostHeap = new GenericHeap<[cost: number, profit: number]>(([aCost], [bCost]) => aCost - bCost);
    const maxProfitHeap = new GenericHeap<[cost: number, profit: number]>(
        ([, aProfit], [, bProfit]) => bProfit - aProfit
    );

    for (let i = 0; i < costs.length; i++) {
        minCostHeap.push([costs[i], profits[i]]);
    }

    while (k-- > 0) {
        while (!minCostHeap.isEmpty() && minCostHeap.peek()[0] <= w) {
            maxProfitHeap.push(minCostHeap.pop());
        }

        if (!maxProfitHeap.isEmpty()) {
            w += maxProfitHeap.pop()[1];
        } else {
            return w;
        }
    }

    return w;
}

/* 
【题目】
给定一个正数数组arr，arr的累加和代表金条的总长度，arr的每个数代表金条要分成的长度。规定长度为K的金条一次只能分成两块，费用为K个铜板。返回把金条分出arr中的每个数字需要的最小代价。
【举例】
arr={10，30，20}，金条总长度为60。
如果先分成40和20两块，将花费60个铜板，再把长度为40的金条分成10和30两块，将花费40个铜板，总花费为100个铜板；
如果先分成10和50两块，将花费60个铜板，再把长度为50的金条分成20和30两块，将花费50个铜板，总花费为110个铜板；
如果先分成30和30两块，将花费60个铜板，再把其中一根长度为30的金条分成10和20两块，将花费30个铜板，总花费为90个铜板。所以返回最低花费为90。
【要求】
如果arr长度为N，时间复杂度为O（NlogN）。*/
export function minCostOfCuttingGold(arr: number[]): number {
    let sum = arr.reduce((acc, cur) => acc + cur, 0);
    const maxHeap = new MaxHeap(arr);

    let result = 0;
    while (maxHeap.size() > 1) {
        result += sum;
        sum -= maxHeap.pop();
    }

    return result;
}

export function minCostOfCuttingGold2(arr: number[]): number {
    const minHeap = new GenericHeap();
    minHeap.initHeap(arr);

    let result = 0;
    while (minHeap.size() > 1) {
        const tmp = minHeap.pop() + minHeap.pop();
        result += tmp;
        minHeap.push(tmp);
    }

    return result;
}

/* 
https://leetcode.com/problems/group-anagrams/

Given an array of strings strs, group the anagrams together. You can return the answer in any order.

An Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.

Input: strs = ["eat","tea","tan","ate","nat","bat"]
Output: [["bat"],["nat","tan"],["ate","eat","tea"]]
*/
export function groupAnagrams(strs: string[]): string[][] {
    const map = new Map<string, string[]>();
    for (const str of strs) {
        const sorted = str.split('').sort().join('');
        if (!map.has(sorted)) map.set(sorted, []);
        map.get(sorted)?.push(str);
    }
    return [...map.values()];
}

/* 
https://leetcode.com/problems/combination-sum/

Given an array of distinct integers candidates and a target integer target, return a list of all unique combinations of candidates 
where the chosen numbers sum to target. You may return the combinations in any order.

The same number may be chosen from candidates an unlimited number of times. Two combinations are unique if the 
frequency
 of at least one of the chosen numbers is different.

The test cases are generated such that the number of unique combinations that sum up to target is less than 150 combinations for the given input.
*/
export function combinationSum(candidates: number[], target: number): number[][] {
    const result: number[][] = [];
    combinationSumProcess(candidates, 0, target, [], result);
    return result;
}

function combinationSumProcess(candidates: number[], i: number, rest: number, tmp: number[], result: number[][]) {
    if (rest === 0) {
        result.push(tmp);
        return;
    }

    for (let k = 0; k <= Math.floor(rest / candidates[i]); k++) {
        combinationSumProcess(
            candidates,
            i + 1,
            rest - k * candidates[i],
            tmp.concat(new Array(k).fill(candidates[i])),
            result
        );
    }
}

/* 
https://leetcode.com/problems/course-schedule/description/

There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. 
You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates 
that you must take course bi first if you want to take course ai.

For example, the pair [0, 1], indicates that to take course 0 you have to first take course 1.
Return true if you can finish all courses. Otherwise, return false.

Input: numCourses = 2, prerequisites = [[1,0],[0,1]]
Output: false
Explanation: There are a total of 2 courses to take. 
To take course 1 you should have finished course 0, and to take course 0 you should also have finished course 1. So it is impossible.
*/
class CourseNode {
    id: number;
    nextNodes: CourseNode[] = [];
    // 入度
    inEdgeCount: number = 0;

    constructor(id: number) {
        this.id = id;
    }
}

export function canFinishAllCourses(numCourses: number, prerequisites: number[][]): boolean {
    const courseToNodes: CourseNode[] = [];

    for (const [first, last] of prerequisites) {
        const firstNode = courseToNodes[first] || (courseToNodes[first] = new CourseNode(first));
        const lastNode = courseToNodes[last] || (courseToNodes[last] = new CourseNode(last));

        lastNode.nextNodes.push(firstNode);
        firstNode.inEdgeCount++;
    }

    const nodes: CourseNode[] = [];
    for (let i = 0; i < numCourses; i++) {
        if (courseToNodes[i]) {
            nodes.push(courseToNodes[i]);
        }
    }

    return canTopSort(nodes);
}

function canTopSort(nodes: CourseNode[]): boolean {
    // 入度为0的节点
    const zeroInEdgeQueue: CourseNode[] = [];
    const inEdgeMap: Map<CourseNode, number> = new Map();

    for (const node of nodes) {
        if (node.inEdgeCount === 0) {
            zeroInEdgeQueue.push(node);
        }

        inEdgeMap.set(node, node.inEdgeCount);
    }

    while (zeroInEdgeQueue.length > 0) {
        const { nextNodes } = zeroInEdgeQueue.shift()!;

        // 消除head的影响（nextNodes的入度都减1）
        for (const next of nextNodes) {
            inEdgeMap.set(next, (inEdgeMap.get(next) || 0) - 1);
            if ((inEdgeMap.get(next) || 0) <= 0) {
                zeroInEdgeQueue.push(next);
            }
        }
    }

    for (const [, inEdgeCount] of inEdgeMap) {
        if (inEdgeCount > 0) {
            return false;
        }
    }
    return true;
}

export function canFinishAllCourses2(numCourses: number, prerequisites: number[][]): boolean {
    const courseToNodes: CourseNode[] = [];

    for (const [first, last] of prerequisites) {
        const firstNode = courseToNodes[first] || (courseToNodes[first] = new CourseNode(first));
        const lastNode = courseToNodes[last] || (courseToNodes[last] = new CourseNode(last));

        lastNode.nextNodes.push(firstNode);
    }

    const checked: Set<number> = new Set();
    for (let i = 0; i < numCourses; i++) {
        if (courseToNodes[i] && hasCircle(courseToNodes[i], courseToNodes, checked)) {
            return false;
        }
    }
    return true;
}

// 使用深度优先遍历来判断某条路径上是否存在环（不可使用宽度优先遍历，因为我们是要检测某条路上是否存在环，而不是检测图本身是否存在环）
function hasCircle(node: CourseNode, courseToNodes: CourseNode[], checked: Set<number>): boolean {
    if (checked.has(node.id)) {
        return false;
    }

    const stack: number[] = [];
    stack.push(node.id);

    const visitedId: Set<number> = new Set();
    const currentStackSet: Set<number> = new Set();
    currentStackSet.add(node.id);
    visitedId.add(node.id);

    while (stack.length > 0) {
        const topId = stack.pop()!;
        checked.add(topId);
        currentStackSet.delete(topId);

        for (const child of courseToNodes[topId].nextNodes) {
            if (currentStackSet.has(child.id) || child.id === topId) {
                return true;
            }

            if (visitedId.has(child.id)) {
                continue;
            }
            visitedId.add(child.id);
            stack.push(topId);
            stack.push(child.id);
            currentStackSet.add(topId);
            currentStackSet.add(child.id);
            break;
        }
    }

    return false;
}

export function canFinishAllCourses3(prerequisites: number[][]): boolean {
    const idToDeps: Map<number, Set<number>> = new Map();

    prerequisites.forEach(([first, last]) => {
        if (idToDeps.has(last)) {
            idToDeps.get(last)!.add(first);
        } else {
            idToDeps.set(last, new Set([first]));
        }
    });

    const checked: Set<number> = new Set();
    const hasCircle = (id: number, visiting: Set<number>) => {
        if (checked.has(id)) {
            return false;
        }
        if (visiting.has(id)) {
            return true;
        }
        visiting.add(id);

        if (idToDeps.has(id)) {
            for (const child of idToDeps.get(id)!) {
                if (hasCircle(child, visiting)) {
                    return true;
                }
            }
        }

        checked.add(id);
        return false;
    };

    for (const id of idToDeps.keys()) {
        if (hasCircle(id, new Set())) {
            return false;
        }
    }
    return true;
}

/* 
There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. 
You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates that you must take course bi first if you want to take course ai.

For example, the pair [0, 1], indicates that to take course 0 you have to first take course 1.
Return the ordering of courses you should take to finish all courses. If there are many valid answers, 
return any of them. If it is impossible to finish all courses, return an empty array.
*/
export function findOrder(numCourses: number, prerequisites: number[][]): number[] {
    const nodes: CourseNode[] = [];
    for (let i = 0; i < prerequisites.length; i++) {
        const [cur, prev] = prerequisites[i];
        const curNode = nodes[cur] || (nodes[cur] = new CourseNode(cur));
        const prevNode = nodes[prev] || (nodes[prev] = new CourseNode(prev));
        curNode.nextNodes.push(prevNode);
        prevNode.inEdgeCount++;
    }

    return topologicalSort(numCourses, nodes);
}

function topologicalSort(numCourses: number, nodes: CourseNode[]): number[] {
    // 下标代表节点，值代表节点的入度
    const inMap: number[] = [];
    // 下标代表节点，值代表节点入度
    const zeroInQueue: number[] = [];
    const result: number[] = [];
    for (let i = 0; i < numCourses; i++) {
        if (!nodes[i]) {
            // 没有依赖的直接放入result数组
            result.push(i);
            continue;
        }
        inMap[i] = nodes[i].inEdgeCount;
        if (nodes[i].inEdgeCount === 0) {
            zeroInQueue.push(i);
        }
    }

    // 没有入度为0的点且有依赖，说明必然存在互相依赖
    if (zeroInQueue.length === 0 && inMap.length > 0) {
        return [];
    }

    while (zeroInQueue.length > 0) {
        const topId = zeroInQueue.shift()!;
        result.unshift(topId);
        const node = nodes[topId];
        if (!node) {
            continue;
        }

        // 消除top的影响
        node.nextNodes.forEach(({ id }) => {
            inMap[id]--;
            if (inMap[id] === 0) {
                zeroInQueue.push(id);
            }
        });
    }

    if (result.length !== numCourses) {
        return [];
    }
    return result;
}

/* 
https://leetcode.com/problems/longest-increasing-path-in-a-matrix/description/

Given an m x n integers matrix, return the length of the longest increasing path in matrix.

From each cell, you can either move in four directions: left, right, up, or down. 
You may not move diagonally or move outside the boundary (i.e., wrap-around is not allowed).
*/
export function longestIncreasingPath(matrix: number[][]): number {
    let max = 1;

    const dp = {};
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[0].length; j++) {
            max = Math.max(max, longestIncreasingPathProcess(matrix, i, j, dp));
        }
    }

    return max;
}

// 从i，j出发走出的最长递增序列长度
function longestIncreasingPathProcess(matrix: number[][], i: number, j: number, dp: Record<string, number>) {
    const id = `${i}_${j}`;
    if (dp[id]) {
        return dp[id];
    }

    const val = matrix[i][j];

    // 上下左右四个方向尝试
    let max = 1;
    if (i - 1 >= 0 && matrix[i - 1][j] > val) {
        max = Math.max(max, longestIncreasingPathProcess(matrix, i - 1, j, dp) + 1);
    }
    if (i + 1 < matrix.length && matrix[i + 1][j] > val) {
        max = Math.max(max, longestIncreasingPathProcess(matrix, i + 1, j, dp) + 1);
    }
    if (j - 1 >= 0 && matrix[i][j - 1] > val) {
        max = Math.max(max, longestIncreasingPathProcess(matrix, i, j - 1, dp) + 1);
    }
    if (j + 1 < matrix[0].length && matrix[i][j + 1] > val) {
        max = Math.max(max, longestIncreasingPathProcess(matrix, i, j + 1, dp) + 1);
    }

    dp[id] = max;
    return max;
}

/* 
https://leetcode.com/problems/word-ladder/description/

Word Ladder
A transformation sequence from word beginWord to word endWord using a dictionary 
wordList is a sequence of words beginWord -> s1 -> s2 -> ... -> sk such that:

Every adjacent pair of words differs by a single letter.
Every si for 1 <= i <= k is in wordList. Note that beginWord does not need to be in wordList.
sk == endWord
Given two words, beginWord and endWord, and a dictionary wordList, return the number of words 
in the shortest transformation sequence from beginWord to endWord, or 0 if no such sequence exists.
*/
// 暴力解法
// TODO:思考下能否用前缀树进行优化
export function ladderLength(beginWord: string, endWord: string, wordList: string[]): number {
    if (!wordList.includes(endWord)) {
        return 0;
    }

    const queue: string[][][] = [[getNextWords(beginWord, wordList)]];
    let count = 1;
    while (queue.length > 0) {
        count++;
        const nextWordsList = queue.shift()!;
        for (let i = 0; i < nextWordsList.length; i++) {
            const nextWords = nextWordsList[i];
            if (nextWords.includes(endWord)) {
                return count;
            }
        }

        const words = nextWordsList.reduce((acc, cur) => {
            for (let i = 0; i < cur.length; i++) {
                const word = cur[i];
                const nextWords = getNextWords(word, wordList);
                if (nextWords.length !== 0) {
                    acc.push(nextWords);
                }
            }

            return acc;
        }, [] as string[][]);

        if (words.length > 0) {
            queue.push(words);
        }
    }

    return 0;
}

function getNextWords(beginWord: string, wordList: string[]): string[] {
    const result: string[] = [];
    for (let i = wordList.length - 1; i >= 0; i--) {
        if (isValidNextWord(beginWord, wordList[i])) {
            result.push(wordList[i]);
            wordList.splice(i, 1);
        }
    }

    return result;
}

function isValidNextWord(beginWord: string, nextWord: string): boolean {
    let diffCount = 0;
    for (let i = 0; i < beginWord.length; i++) {
        if (beginWord[i] !== nextWord[i]) {
            diffCount++;
            if (diffCount > 1) {
                break;
            }
        }
    }

    return diffCount === 1;
}

// 使用set的暴力解法
export function ladderLength2(beginWord: string, endWord: string, wordList: string[]): number {
    const wordSet = new Set(wordList);
    if (!wordSet.has(endWord)) {
        return 0;
    }
    const A_CHAR_CODE = 'a'.charCodeAt(0);

    let beginSet = new Set([beginWord]);
    let endSet = new Set([endWord]);
    let step = 1;
    while (beginSet.size > 0) {
        step++;
        const nextSet: Set<string> = new Set();
        for (const word of beginSet) {
            for (let i = 0; i < word.length; i++) {
                // 暴力尝试每一个可能得后续单词
                for (let j = 0; j < 26; j++) {
                    const nextWord = word.slice(0, i) + String.fromCharCode(A_CHAR_CODE + j) + word.slice(i + 1);
                    if (endSet.has(nextWord)) {
                        return step;
                    }
                    if (wordSet.has(nextWord)) {
                        nextSet.add(nextWord);
                        wordSet.delete(nextWord);
                    }
                }
            }
        }
        beginSet = nextSet;
        if (beginSet.size > endSet.size) {
            [beginSet, endSet] = [endSet, beginSet];
        }
    }
    return 0;
}

/* 
https://leetcode.com/problems/longest-consecutive-sequence/description/
Given an unsorted array of integers nums, return the length of the longest consecutive elements sequence.

You must write an algorithm that runs in O(n) time.

Input: nums = [0,3,7,2,5,8,4,6,0,1]
Output: 9
*/
export function longestConsecutive(nums: number[]): number {
    const set = new Set(nums);

    let max = 0;
    // 此处看似有两层循环，但实际上内层while对于所有的数字只会执行一次
    // 因为外层做了判断 !set.has(num - 1) 只有那些可以作为连续序列起点的最小值才会进入内层循环，其他的会直接跳过
    // 所以整体的时间复杂度还是O(n)
    for (let num of set) {
        if (!set.has(num - 1)) {
            let smallest = num;

            while (set.has(smallest + 1)) {
                smallest++;
            }

            max = Math.max(max, smallest - num + 1);
        }
    }

    return max;
}

/* 
https://leetcode.com/problems/surrounded-regions/description/
Given an m x n matrix board containing 'X' and 'O', capture all regions that are 4-directionally surrounded by 'X'.

A region is captured by flipping all 'O's into 'X's in that surrounded region.
*/
/**
 Do not return anything, modify board in-place instead.
 */
export function flipNonEdgeOToX(board: string[][]): void {
    // 保护边界以及与边界相连的"O"
    for (let j = 0; j < board[0].length; j++) {
        protectEdgeOs(board, 0, j);
    }
    for (let j = 0; j < board[0].length; j++) {
        protectEdgeOs(board, board.length - 1, j);
    }
    for (let i = 0; i < board.length; i++) {
        protectEdgeOs(board, i, 0);
    }
    for (let i = 0; i < board.length; i++) {
        protectEdgeOs(board, i, board[0].length - 1);
    }

    // 将其他位置的O变成X
    for (let i = 1; i < board.length; i++) {
        for (let j = 1; j < board[0].length; j++) {
            if (board[i][j] === 'O') {
                board[i][j] = 'X';
            }
        }
    }

    // 还原边界的O
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[0].length; j++) {
            if (board[i][j] === 'O_Edge') {
                board[i][j] = 'O';
            }
        }
    }
}

function protectEdgeOs(board: string[][], i: number, j: number) {
    if (board[i][j] !== 'O') {
        return;
    }

    board[i][j] = 'O_Edge';

    // 上下左右四个方向探测
    if (i - 1 >= 0 && board[i - 1][j] === 'O') {
        protectEdgeOs(board, i - 1, j);
    }
    if (i + 1 < board.length && board[i + 1][j] === 'O') {
        protectEdgeOs(board, i + 1, j);
    }
    if (j - 1 >= 0 && board[i][j - 1] === 'O') {
        protectEdgeOs(board, i, j - 1);
    }
    if (j + 1 < board[0].length && board[i][j + 1] === 'O') {
        protectEdgeOs(board, i, j + 1);
    }
}

/* 
https://leetcode.com/problems/palindrome-partitioning/description/

Given a string s, partition s such that every substring of the partition is a palindrome. 
Return all possible palindrome partitioning of s.

Input: s = "aab"
Output: [["a","a","b"],["aa","b"]]
*/
export function partitionPalindrome(s: string): string[][] {
    const result: string[][] = [];
    partitionPalindromeProcess(s, 0, [], result);
    return result;
}

function partitionPalindromeProcess(s: string, prevCut: number, path: string[], result: string[][]) {
    if (prevCut === s.length) {
        // 这里需要解构下，不然递归函数向上返回的时候path会被清空
        result.push([...path]);
        return;
    }

    for (let nextCut = prevCut + 1; nextCut <= s.length; nextCut++) {
        const t = s.slice(prevCut, nextCut);
        if (isPalindrome(t)) {
            // 直接复用path
            path.push(t);
            partitionPalindromeProcess(s, nextCut, path, result);
            // 恢复环境
            path.pop();
        }
    }
}

function isPalindrome(s: string) {
    let left = 0;
    let right = s.length - 1;
    while (left < right) {
        if (s[left++] !== s[right--]) {
            return false;
        }
    }

    return true;
}

/* 
https://leetcode.com/problems/gas-station/description/
There are n gas stations along a circular route, where the amount of gas at the ith station is gas[i].

You have a car with an unlimited gas tank and it costs cost[i] of gas to travel from the ith station to its next (i + 1)th station. 
You begin the journey with an empty tank at one of the gas stations.

Given two integer arrays gas and cost, return the starting gas station's index if you can travel around the circuit 
once in the clockwise direction, otherwise return -1. If there exists a solution, it is guaranteed to be unique

Input: gas = [1,2,3,4,5], cost = [3,4,5,1,2]
Output: 3
Explanation:
Start at station 3 (index 3) and fill up with 4 unit of gas. Your tank = 0 + 4 = 4
Travel to station 4. Your tank = 4 - 1 + 5 = 8
Travel to station 0. Your tank = 8 - 2 + 1 = 7
Travel to station 1. Your tank = 7 - 3 + 2 = 6
Travel to station 2. Your tank = 6 - 4 + 3 = 5
Travel to station 3. The cost is 5. Your gas is just enough to travel back to station 3.
Therefore, return 3 as the starting index.

Constraints:
n == gas.length == cost.length
1 <= n <= 105
0 <= gas[i], cost[i] <= 104
*/
// 暴力解法，遍历每一个开始位置
export function canCompleteCircuit(gas: number[], cost: number[]): number {
    const starts: number[] = [];
    // 获取可能的开始位置
    for (let i = 0; i < gas.length; i++) {
        if (gas[i] >= cost[i]) {
            starts.push(i);
        }
    }

    if (starts.length === 0) {
        return -1;
    }

    // 枚举每一个开始位置
    for (let i = 0; i < starts.length; i++) {
        const start = starts[i];

        let cur = start;
        let prev = gas[cur];
        let next = (cur + 1) % gas.length;
        while (next !== start) {
            if (prev < cost[cur]) {
                break;
            }
            prev = prev - cost[cur] + gas[next];

            cur = (cur + 1) % gas.length;
            next = (next + 1) % gas.length;
        }

        if (next === start && prev >= cost[cur]) {
            return start;
        }
    }

    return -1;
}

/* 
常见的时间复杂度优化思路

1）根据数据量猜测时间复杂度（10^5）可能需要一个O(nlogn)甚至是O(n)的解法
2）对于暴力尝试过程中已经失败的路径能否为下一次尝试加速，
    a) 比如说分析已经尝试过的路径是否已经不可能，可以直接从未尝试过的地方继续尝试
    b) 或者是在尝试的过程中记录一些信息，为下次尝试加速，类似kmp和manacher算法

本题采取的优化策略就是分析得知已经尝试的位置不可能在作为起点位置
假设我们可以从i-j,到j+1的时候油量变为负数，那么假设i-j之间的k点，那么从k点出发
必然也无法到达j+1点，因为如果从i出发的话到k点的初始油量必然大于等于0，如果从k点出发初始油量
已经是0，且从i触发无法到达j+1，那么从初始油量更少的k点出发必然也无法到达j+1，所有我们下次起点可直接从j+1开始
整体时间复杂度O(n)
*/
export function canCompleteCircuit2(gas: number[], cost: number[]): number {
    const len = gas.length;

    let i = 0;
    while (i < len) {
        let j = 0;
        let prev = 0;
        while (j < len) {
            const k = (i + j) % len;
            prev += gas[k] - cost[k];
            if (prev < 0) {
                break;
            }
            j++;
        }

        if (j === len) {
            return i;
        }
        i = i + j + 1;
    }

    return -1;
}

export function canCompleteCircuit3(gas: number[], cost: number[]): number {
    let start = 0;
    let tank = 0;
    let sum = 0;
    for (let i = 0; i < gas.length; i++) {
        tank += gas[i] - cost[i];
        sum += gas[i] - cost[i];
        if (tank < 0) {
            start = i + 1;
            tank = 0;
        }
    }

    // 如果sum小于0则必然不能完成环绕旅行，反之如果>=0则必然存在一个起点使得从这个起点出发可以完成旅行
    // 而经过上面的循环start是唯一可能的起点
    return sum < 0 ? -1 : start;
}

/* 
https://leetcode.com/problems/word-break/description/
Given a string s and a dictionary of strings wordDict, return true if s can be segmented 
into a space-separated sequence of one or more dictionary words.

Note that the same word in the dictionary may be reused multiple times in the segmentation.

Input: s = "leetcode", wordDict = ["leet","code"]
Output: true
Explanation: Return true because "leetcode" can be segmented as "leet code".
*/
export function wordBreak(s: string, wordDict: string[]): boolean {
    const set: Set<string> = new Set();
    for (let i = 0; i < wordDict.length; i++) {
        set.add(wordDict[i]);
    }

    const dp: boolean[] = new Array(s.length).fill(undefined);

    return wordBreakProcess(s, 0, set, dp);
}

function wordBreakProcess(s: string, i: number, set: Set<string>, dp: boolean[]): boolean {
    if (dp[i] !== undefined) {
        return dp[i];
    }

    if (i === s.length) {
        dp[i] = true;
        return dp[i];
    }

    let result = false;
    for (let k = 1; k <= 20; k++) {
        const word = s.slice(i, i + k);
        if (set.has(word)) {
            result = result || wordBreakProcess(s, i + k, set, dp);
        }
    }

    dp[i] = result;
    return dp[i];
}

/* 
https://leetcode.com/problems/find-the-duplicate-number/description/

Given an array of integers nums containing n + 1 integers where each integer is in the range [1, n] inclusive.

There is only one repeated number in nums, return this repeated number.

You must solve the problem without modifying the array nums and uses only constant extra space.

分析，把数组看成一个链表
假设有数组[ia,ib,ic,id]
ia的next指向索引为ia的节点

举个例子 [1,3,4,2,2]
链表 1->3->2->4->2 
因为有重复元素，所以必然有多个节点指向同一个元素，
也就是说在我们想象的链表中存在环，使用快慢指针法即可解决
*/
export function findDuplicate(nums: number[]): number {
    let slow = nums[0];
    let fast = nums[nums[0]];
    while (slow != fast) {
        slow = nums[slow];
        fast = nums[nums[fast]];
    }
    fast = 0;
    while (fast != slow) {
        fast = nums[fast];
        slow = nums[slow];
    }
    return slow;
}

/* 
https://leetcode.com/problems/count-of-smaller-numbers-after-self/description/

Given an integer array nums, return an integer array counts where counts[i] is the number of smaller elements to the right of nums[i].

Input: nums = [5,2,6,1]
Output: [2,1,1,0]
Explanation:
To the right of 5 there are 2 smaller elements (2 and 1).
To the right of 2 there is only 1 smaller element (1).
To the right of 6 there is 1 smaller element (1).
To the right of 1 there is 0 smaller element.
*/
export function countSmaller(arr: number[]): number[] {
    const mergeSort = (left: number, right: number) => {
        if (left === right) {
            return;
        }

        const mid = left + ((right - left) >> 1);
        mergeSort(left, mid);
        mergeSort(mid + 1, right);
        merge(left, mid, right);
    };

    const pos: number[] = new Array(arr.length);
    for (let i = 0; i < arr.length; i++) {
        pos[i] = i;
    }

    const result: number[] = new Array(arr.length).fill(0);
    const merge = (left: number, mid: number, right: number) => {
        let i = left;
        let j = mid + 1;
        const tmp: number[] = [];
        const tmpPos: number[] = [];

        while (i <= mid && j <= right) {
            if (arr[i] > arr[j]) {
                result[pos[i]] += right - j + 1;
                tmpPos.push(pos[i]);
                tmp.push(arr[i++]);
            } else {
                tmpPos.push(pos[j]);
                tmp.push(arr[j++]);
            }
        }

        while (i <= mid) {
            tmpPos.push(pos[i]);
            tmp.push(arr[i++]);
        }

        while (j <= right) {
            tmpPos.push(pos[j]);
            tmp.push(arr[j++]);
        }

        for (let i = 0; i < tmp.length; i++) {
            arr[i + left] = tmp[i];
            pos[i + left] = tmpPos[i];
        }
    };

    mergeSort(0, arr.length - 1);

    return result;
}

/* 
https://leetcode.com/problems/wiggle-sort-ii/description/

Given an integer array nums, reorder it such that nums[0] < nums[1] > nums[2] < nums[3]....

You may assume the input array always has a valid answer.

Input: nums = [1,5,1,1,6,4]
Output: [1,6,1,5,1,4]
Explanation: [1,4,1,5,1,6] is also accepted.
*/
export function wiggleSort(nums: number[]): void {
    /* 
    此处需要从大到小排序，small中的最大值需要被bigger的最大值卡到第一位
    如果从小到大排序的话可能会出现最后相等的情况，比如说
    1,2,2,3
    按照小大小大交叉之后是
    1,2,2,3
    2,2是不符合条件的
    如果从大到小的话
    2,3,2,1
    */
    nums.sort((a, b) => b - a);

    const half = nums.length >> 1;
    const bigger = nums.slice(0, half);
    const small = nums.slice(half);
    let k = 0;

    for (let i = 0; i < nums.length - 1; i += 2) {
        nums[i] = small[k];
        nums[i + 1] = bigger[k++];
    }
}

/* 
https://leetcode.com/problems/increasing-triplet-subsequence/description/

Given an integer array nums, return true if there exists a triple of indices (i, j, k) such 
that i < j < k and nums[i] < nums[j] < nums[k]. If no such indices exists, return false.
*/
export function increasingTriplet(nums: number[]): boolean {
    if (nums.length < 3) {
        return false;
    }

    // end[i] 长度为i+1的最长递增子序列中最小结尾数值
    const end: number[] = [nums[0]];
    for (let i = 1; i < nums.length; i++) {
        let left = 0;
        let right = end.length - 1;
        let found: number | undefined = undefined;
        while (left <= right) {
            const mid = left + ((right - left) >> 1);
            if (end[mid] === nums[i]) {
                found = mid;
                break;
            }

            if (end[mid] > nums[i]) {
                found = mid;
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        }

        if (found === undefined) {
            end.push(nums[i]);
        } else {
            end[found] = nums[i];
        }

        if (end.length >= 3) {
            return true;
        }
    }

    return false;
}

export function increasingTriplet2(nums: number[]): boolean {
    let first = Infinity;
    let second = Infinity;
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] <= first) {
            first = nums[i];
        } else if (nums[i] <= second) {
            second = nums[i];
        } else {
            return true;
        }
    }

    return false;
}

/* 
https://leetcode.com/problems/4sum-ii/description/
Given four integer arrays nums1, nums2, nums3, and nums4 all of length n, return the number of tuples (i, j, k, l) such that:

0 <= i, j, k, l < n
nums1[i] + nums2[j] + nums3[k] + nums4[l] == 0
*/
export function fourSumCount(nums1: number[], nums2: number[], nums3: number[], nums4: number[]): number {
    const map: Map<number, number> = new Map();
    for (let i = 0; i < nums1.length; i++) {
        for (let j = 0; j < nums2.length; j++) {
            const tmp = nums1[i] + nums2[j];
            map.set(tmp, (map.get(tmp) || 0) + 1);
        }
    }

    let count = 0;
    for (let i = 0; i < nums3.length; i++) {
        for (let j = 0; j < nums4.length; j++) {
            const diff = 0 - nums3[i] - nums4[j];
            if (map.has(diff)) {
                count += map.get(diff)!;
            }
        }
    }

    return count;
}
