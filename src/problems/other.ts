import { GenericHeap } from '../algorithm/generic-heap';
import { getClosestMinArr } from '../algorithm/monotonous-stack';
import { SkipSet } from '../algorithm/skip-set';
import { TreeNode } from '../algorithm/tree';
import { UnionSet } from '../algorithm/union-set';
import { getCharIndex, maxCommonFactor, swap } from '../common/index';
import { Queue } from '../algorithm/queue';
import { PrefixTree, PrefixTreeNode } from '../algorithm/prefix-tree';
import { SlidingWindow } from '../algorithm/sliding-window';
import { SingleLinkedList } from '../algorithm/linked-list';
import { Stack } from '../algorithm/stack';
/* 
题目1（来自小红书）
【0，4，7】 ：0表示这里石头没有颜色，如果变红代价是4，如果变蓝代价是7 
【1.XX】 ： 1表示这里石头已经是红，而且不能改颜色，所以后两个数×无意义
【2，XX】 ： 2表示这里石头已经是蓝，而且不能改颜色，所以后两个数×无意义颜色只可能是0、1、2，代价一定>=0

给你一批这样的小数组，要求最后必须所有石头都有颜色，且红色和蓝色一样多，返回最小代价
如果怎么都无法做到所有石头都有颜色、且红色和蓝色一样多，返回-1
*/
export function getMinValueOfColor(arr: number[][]): number {
    if ((arr.length & 1) !== 0) {
        return -1;
    }

    const redCount = arr.filter(([color]) => color === 1).length;
    const blueCount = arr.filter(([color]) => color === 2).length;
    const half = arr.length >> 1;
    if (redCount > half || blueCount > half) {
        return -1;
    }

    const zeros = arr.filter(([color]) => color === 0);
    if (zeros.length === 0) {
        return 0;
    }

    return colorProcess(zeros, 0, half - redCount);
}

// 把i位置及其以后的石头染色，返回最少代价
function colorProcess(zeros: number[][], i: number, restRedCount: number): number {
    if (i === zeros.length) {
        return restRedCount === 0 ? 0 : -1;
    }

    // 如果restRedCount=0 则剩下所有石头都必须染成蓝色
    if (restRedCount === 0) {
        return zeros.slice(i).reduce((acc, [, , blueCost]) => {
            acc = acc + blueCost;
            return acc;
        }, 0);
    }

    const [, redCost, blueCost] = zeros[i];
    // i染成红色
    const next1 = colorProcess(zeros, i + 1, restRedCount - 1);
    let p1 = Infinity;
    if (next1 !== -1) {
        p1 = redCost + colorProcess(zeros, i + 1, restRedCount - 1);
    }

    // i染成蓝色
    const next2 = colorProcess(zeros, i + 1, restRedCount);
    let p2 = Infinity;
    if (next2 !== -1) {
        p2 = blueCost + colorProcess(zeros, i + 1, restRedCount);
    }

    // next1和next2不可能同时是-1，这里只需要返回p1,p2的较小值即可
    return Math.min(p1, p2);
}

export function getMinValueOfColorDp(arr: number[][]): number {
    if ((arr.length & 1) !== 0) {
        return -1;
    }

    const redCount = arr.filter(([color]) => color === 1).length;
    const blueCount = arr.filter(([color]) => color === 2).length;
    const half = arr.length >> 1;
    if (redCount > half || blueCount > half) {
        return -1;
    }

    const zeros = arr.filter(([color]) => color === 0);
    if (zeros.length === 0) {
        return 0;
    }

    // dp[i][restRedCount]
    // i 0-zeros.length
    // restRedCount 0-half
    // 返回dp[0][half-redCount]
    const dp: number[][] = new Array(zeros.length + 1).fill(0).map((_) => new Array(half + 1).fill(0));

    // dp[zeros.length]
    for (let restRedCount = 1; restRedCount <= half; restRedCount++) {
        dp[zeros.length][restRedCount] = -1;
    }

    // 如果restRedCount=0 则剩下所有石头都必须染成蓝色
    for (let i = zeros.length - 1; i >= 0; i--) {
        const [, , blueCost] = zeros[i];
        dp[i][0] = blueCost;
        if (i - 1 >= 0) {
            dp[i][0] += dp[i - 1][0];
        }
    }

    // 从下到上，从左到右填表
    for (let i = zeros.length - 1; i >= 0; i--) {
        for (let restRedCount = 1; restRedCount <= half; restRedCount++) {
            const [, redCost, blueCost] = zeros[i];
            // i染成红色
            const next1 = dp[i + 1][restRedCount - 1];
            let p1 = Infinity;
            if (next1 !== -1) {
                p1 = redCost + dp[i + 1][restRedCount - 1];
            }

            // i染成蓝色
            const next2 = dp[i + 1][restRedCount];
            let p2 = Infinity;
            if (next2 !== -1) {
                p2 = blueCost + dp[i + 1][restRedCount];
            }

            // next1和next2不可能同时是-1，这里只需要返回p1,p2的较小值即可
            dp[i][restRedCount] = Math.min(p1, p2);
        }
    }

    return dp[0][half - redCount];
}

// 利用贪心策略来算最小代价
export function getMinValueOfColor2(arr: number[][]): number {
    if ((arr.length & 1) === 1) {
        return -1;
    }

    const half = arr.length >> 1;
    let redCount = 0;
    let blueCount = 0;
    const zeros: number[][] = [];
    for (let i = 0; i < arr.length; i++) {
        const [color, redCost, blueCost] = arr[i];
        if (color === 0) {
            zeros.push([redCost, blueCost]);
        } else if (color === 1) {
            redCount++;
        } else {
            blueCount++;
        }
    }

    if (redCount > half || blueCount > half) {
        return -1;
    }
    if (zeros.length === 0) {
        return 0;
    }

    // 把所有无色石头都变成红色，然后从中选择从红变蓝差值最大的变成蓝色，总代价最小
    let cost = zeros.reduce((acc, [redCost]) => {
        acc += redCost;
        return acc;
    }, 0);

    // 按照redCost-blueCost的差值从大到小排序
    zeros.sort(([redCost1, blueCost1], [redCost2, blueCost2]) => {
        return redCost2 - blueCost2 - (redCost1 - blueCost1);
    });

    for (let i = 0; i < half - blueCount; i++) {
        const [redCost, blueCost] = zeros[i];
        cost -= redCost - blueCost;
    }

    return cost;
}

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
    return newArr.slice(1).reduce((acc, cur) => {
        acc += cur;
        return acc;
    }, 0);
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
    return newArr.slice(1).reduce((acc, cur) => {
        acc += cur;
        return acc;
    }, 0);
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
    const odd = [];
    const even = [];
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

// 给定一组非负数字arr，和目标值target，可以随意在每个数字前添加加号或者减号使得整体的和等于target，返回所有符合条件的加减号组合
export function getPlusOrMinusCount(arr: number[], target: number): number {
    return plusOrMinusProcess(arr, 0, target);
}

function plusOrMinusProcess(arr: number[], i: number, rest: number): number {
    if (i === arr.length) {
        return rest === 0 ? 1 : 0;
    }

    // 两种选择
    const p1 = plusOrMinusProcess(arr, i + 1, rest - arr[i]);
    const p2 = plusOrMinusProcess(arr, i + 1, rest + arr[i]);

    return p1 + p2;
}

export function getPlusOrMinusCountDp(arr: number[], target: number): number {
    const sum = arr.reduce((acc, cur) => {
        acc += cur;
        return acc;
    }, 0);

    // 由于所有的数字都会取正或取负，所以所有符合条件的target组合必然等于-target组合，这里我们直接让target变成正数
    target = Math.abs(target);

    // sum的奇偶性必和target一致且target必须小于等于sum
    if ((sum & 1) !== (target & 1) || target > sum) {
        return 0;
    }

    // dp[i][rest]
    // rest的取值范围是-sum到sum，由于-sum到sum是关于0 一一对应的，任意一个 dp[i][rest]都一定等于dp[i][-rest]
    // 因为一旦有一种组合使得和等于rest那么，取反之后必然等于-rest，所以两者的组合数一定相等，这里我们直接让rest的范围从0-sum即可

    // 用两个一维表滚动的方式代替二维表
    const dp: number[] = new Array(sum + 1).fill(0);
    dp[0] = 1;
    let prevDp = dp.slice();

    // 从下到上，从左到右填表
    for (let i = arr.length - 1; i >= 0; i--) {
        for (let rest = 0; rest <= sum; rest++) {
            // 两种选择
            const p1 = Math.abs(rest - arr[i]) <= sum ? prevDp[Math.abs(rest - arr[i])] : 0;
            const p2 = rest + arr[i] <= sum ? prevDp[rest + arr[i]] : 0;

            dp[rest] = p1 + p2;
        }
        prevDp = dp.slice();
    }

    return dp[target];
}

export function getPlusOrMinusCountDp2(arr: number[], target: number): number {
    // 假设存在集合p和集合n，使得p-n等于target，那么集合p和n就是一种符合条件的组合
    // p-n+p+n=target+p+n => p=(target+sum)/2
    // 问题就变成怎么从arr中选数使得最终值为p，也就是一个背包问题
    const sum = arr.reduce((acc, cur) => {
        acc += cur;
        return acc;
    }, 0);

    const p = (target + sum) >> 1;

    // 由于p必然是个整数，所以target和sum的奇偶性必相同
    // 且p必然小于等于sum，所以target也必然小于等于sum
    if ((sum & 1) !== (target & 1) || Math.abs(target) > sum) {
        return 0;
    }

    // 去掉所有的0
    const withoutZeros = arr.filter((val) => val !== 0);
    const zeroCount = arr.length - withoutZeros.length;

    // 用两个一维表滚动的方式代替二维表
    const dp: number[] = new Array(p + 1).fill(0);
    dp[0] = 1;
    let prevDp = dp.slice();

    // 从下到上，从左往右填表
    for (let i = withoutZeros.length - 1; i >= 0; i--) {
        for (let rest = 1; rest <= p; rest++) {
            let p1 = 0;
            if (rest - withoutZeros[i] >= 0) {
                p1 = prevDp[rest - withoutZeros[i]];
            }
            const p2 = prevDp[rest];

            dp[rest] = p1 + p2;
        }
        prevDp = dp.slice();
    }

    return dp[p] * Math.pow(2, zeroCount);
}

/* 
题目4
现有司机N*2人，调度中心会将所有司机平分给A、B两个区域第i个司机去A可得收入为income【i】【0】，第i个司机去B可得收入为income【i】【1】，
返回所有调度方案中能使所有司机总收入最高的方案，是多少钱
*/
export function getMaxMoney(income: number[][]): number {
    // 先让所有人都去A算出一个值
    let count = income.reduce((acc, [aMoney]) => {
        acc += aMoney;
        return acc;
    }, 0);

    // 类似于石头染色问题，把所有income按照 bMoney-aMoney的差值排序，越大的改到B可以获得更大收益
    income.sort(([aMoney1, bMoney1], [aMoney2, bMoney2]) => {
        // 按照bMoney-aMoney从大到小排序
        return bMoney2 - aMoney2 - (bMoney1 - aMoney1);
    });

    // 让一半人从A到B
    const n = income.length >> 1;
    for (let i = 0; i < n; i++) {
        const [aMoney, bMoney] = income[i];
        count += bMoney - aMoney;
    }

    return count;
}

export function getMaxMoney2(income: number[][]): number {
    return getMaxMoney2Process(income, 0, income.length >> 1);
}

function getMaxMoney2Process(income: number[][], i: number, restA: number): number {
    if (i === income.length) {
        return restA === 0 ? 0 : -1;
    }

    if (restA === 0) {
        // 剩下人都必须去B
        return income.slice(i).reduce((acc, [, bMoney]) => {
            acc += bMoney;
            return acc;
        }, 0);
    }

    const [aMoney, bMoney] = income[i];
    // i去A
    let p1 = 0;
    const next1 = getMaxMoney2Process(income, i + 1, restA - 1);
    if (next1 !== -1) {
        p1 = aMoney + next1;
    }

    // i去B
    let p2 = 0;
    const next2 = getMaxMoney2Process(income, i + 1, restA);
    if (next2 !== -1) {
        p2 = bMoney + next2;
    }

    return Math.max(p1, p2);
}

export function getMaxMoneyDp(income: number[][]): number {
    const half = income.length >> 1;
    // dp[i][restA]
    const dp: number[][] = new Array(income.length + 1).fill(0).map((_) => new Array(half + 1).fill(0));

    for (let restA = 1; restA <= half; restA++) {
        dp[income.length][restA] = -1;
    }

    for (let i = income.length - 1; i >= 0; i--) {
        const [, bMoney] = income[i];
        dp[i][0] = dp[i + 1][0] + bMoney;
    }

    // 从下到上，从左到右填表
    for (let i = income.length - 1; i >= 0; i--) {
        for (let restA = 1; restA <= half; restA++) {
            const [aMoney, bMoney] = income[i];
            // i去A
            let p1 = 0;
            const next1 = dp[i + 1][restA - 1];
            if (next1 !== -1) {
                p1 = aMoney + next1;
            }

            // i去B
            let p2 = 0;
            const next2 = dp[i + 1][restA];
            if (next2 !== -1) {
                p2 = bMoney + next2;
            }

            dp[i][restA] = Math.max(p1, p2);
        }
    }

    return dp[0][half];
}

export function getMaxMoneyDp2(income: number[][]): number {
    const half = income.length >> 1;

    // 两个一维数组滚动代替二维数组
    const dp: number[] = new Array(half + 1).fill(0);
    for (let restA = 1; restA <= half; restA++) {
        dp[restA] = -1;
    }
    let prevDp = dp.slice();

    // 存储第0列的值
    const bMoneySumArr = new Array(income.length + 1).fill(0);
    for (let i = income.length - 1; i >= 0; i--) {
        const [, bMoney] = income[i];
        bMoneySumArr[i] = bMoneySumArr[i + 1] + bMoney;
    }

    // 从下到上，从左到右填表
    for (let i = income.length - 1; i >= 0; i--) {
        for (let restA = 1; restA <= half; restA++) {
            const [aMoney, bMoney] = income[i];
            // i去A
            let p1 = 0;
            const next1 = restA === 1 ? bMoneySumArr[i + 1] : prevDp[restA - 1];
            if (next1 !== -1) {
                p1 = aMoney + next1;
            }

            // i去B
            let p2 = 0;
            const next2 = restA === 1 ? bMoneySumArr[i + 1] : prevDp[restA];
            if (next2 !== -1) {
                p2 = bMoney + next2;
            }

            dp[restA] = Math.max(p1, p2);
        }

        prevDp = dp.slice();
    }

    return dp[half];
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
字符串交错组成问题
给定字符串 str1和str2已经str3
判定str3是否str1和str2的交错组成

str3是str1和str2的交错组成判定规则：
1) str3的长度等于str1.length+str.length
2) str3中存在子序列等于str1且扣除str1之后的子序列等于str2

比如说
str1=abc
str2=123
str3=a12b3c
str4=321abc

str3就是str1和str2的交错组成，但是str4就不是str1和str2的交错组成
*/
// 样本对应模型
export function isInterleave(str1: string, str2: string, str3: string): boolean {
    if (str1.length + str2.length !== str3.length) {
        return false;
    }

    // dp[i][j] str1取前i个字符，str2取前j个字符能否交错组成 str3中 前i+j个字符
    // dp[str1.length][str2.length]就是我们想要的结果
    const dp: boolean[][] = new Array(str1.length + 1).fill(0).map((_) => new Array(str2.length).fill(false));

    // str1取0个字符，str2取0个字符必然可以组成str3取0个字符
    dp[0][0] = true;

    // str1取0个字符
    for (let j = 1; j <= str2.length; j++) {
        // 取j个字符，小标是j-1
        dp[0][j] = dp[0][j - 1] && str2[j - 1] === str3[j - 1];
    }

    // str2取0个字符
    for (let i = 1; i <= str1.length; i++) {
        dp[i][0] = dp[i - 1][0] && str1[i - 1] === str3[i - 1];
    }

    // 从上到下，从左到右填表
    for (let i = 1; i <= str1.length; i++) {
        for (let j = 1; j <= str2.length; j++) {
            // 两种可能str3 第i+j-1个字符来自str1或者str2
            const p1 = str3[i + j - 1] === str1[i - 1] && dp[i - 1][j];
            const p2 = str3[i + j - 1] === str2[j - 1] && dp[i][j - 1];
            dp[i][j] = p1 || p2;
        }
    }

    return dp[str1.length][str2.length];
}

/* 
题目6
如果一个节点×，它左树结构和右树结构完全一样那么我们说以X为头的树是相等树
给定一棵二叉树的头节点head 返回head整棵树上有多少棵相等子树
*/
export function countEqualTree(head: TreeNode | null): number {
    if (!head) {
        return 0;
    }

    let count = 0;
    const countEqualTreeProcess = (node: TreeNode) => {
        // 当前节点
        if (node && isEqualTree(node.left, node.right)) {
            count++;
        }

        if (node.left) {
            countEqualTreeProcess(node.left);
        }
        if (node.right) {
            countEqualTreeProcess(node.right);
        }
    };

    countEqualTreeProcess(head);

    return count;
}

function isEqualTree(node1: TreeNode | null, node2: TreeNode | null): boolean {
    if (node1 === null || node2 === null) {
        return node1 === node2;
    }

    if (node1.val !== node2.val) return false;

    return isEqualTree(node1.left, node2.right) && isEqualTree(node1.right, node2.left);
}

export function countEqualTree2(head: TreeNode | null): number {
    if (!head) {
        return 0;
    }

    return countEqualTree2Process(head).num;
}

class EqualTreeInfo {
    // 当前节点的相等子树数目
    num: number;
    // 先序方式遍历得到的序列
    preStr: string;

    constructor(num: number, preStr: string) {
        this.num = num;
        this.preStr = preStr;
    }
}

// 直接用先序遍历字符串来替代递归判断两颗子树是否相等
function countEqualTree2Process(head: TreeNode | null): EqualTreeInfo {
    if (!head) {
        return {
            num: 0,
            preStr: '#',
        };
    }

    const left = countEqualTree2Process(head.left);
    const right = countEqualTree2Process(head.right);

    const num = left.num + right.num + (left.preStr === right.preStr ? 1 : 0);
    const preStr = `${head.val},${left.preStr},${right.preStr}`;

    return {
        num,
        preStr,
    };
}

/* 
字符串的编辑距离问题
可以有插入，删除和替换操作，问使得word1变成word2最少需要多少次操作
举例
word1 = "horse", word2 = "ros"
Output: 3
Explanation: 
horse -> rorse (replace 'h' with 'r')
rorse -> rose (remove 'r')
rose -> ros (remove 'e')

样本对应模型 */
export function getMinEditDistance(word1: string, word2: string) {
    // dp[i][j] word1取前i个字符（下标 0 到 i-1）编辑成 word2取前j个字符（0到j-1）的最小代价
    const dp: number[][] = new Array(word1.length + 1).fill(0).map((_) => new Array(word2.length + 1).fill(0));

    // word1取0个字符
    for (let j = 0; j <= word2.length; j++) {
        dp[0][j] = j;
    }

    // word2取0个字符
    for (let i = 0; i <= word1.length; i++) {
        dp[i][0] = i;
    }

    // 从上到下，从左到右填表
    for (let i = 1; i <= word1.length; i++) {
        for (let j = 1; j <= word2.length; j++) {
            dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i - 1][j - 1] + 1, dp[i][j - 1] + 1);
            if (word1[i - 1] === word2[j - 1]) {
                dp[i][j] = Math.min(dp[i][j], dp[i - 1][j - 1]);
            }
        }
    }

    return dp[word1.length][word2.length];
}

// 两个一维表滚动代替二维表
export function getMinEditDistance2(word1: string, word2: string) {
    // word2只有0个字符
    if (word2.length === 0) {
        return word1.length;
    }

    // dp[i][j] word1取前i个字符（下标 0 到 i-1）编辑成 word2取前j个字符（0到j-1）的最小代价
    const dp: number[] = new Array(word2.length + 1).fill(0);
    // word1取0个字符
    for (let j = 0; j <= word2.length; j++) {
        dp[j] = j;
    }
    let prevDp = dp.slice();

    // 从上到下，从左到右填表
    for (let i = 1; i <= word1.length; i++) {
        for (let j = 1; j <= word2.length; j++) {
            dp[j] = Math.min(prevDp[j] + 1, (j === 1 ? i - 1 : prevDp[j - 1]) + 1, (j === 1 ? i : prevDp[j - 1]) + 1);
            if (word1[i - 1] === word2[j - 1]) {
                dp[j] = Math.min(dp[j], j === 1 ? i - 1 : prevDp[j - 1]);
            }
        }
        prevDp = dp.slice();
    }

    return dp[word2.length];
}

// 逆序二进制位
export function reverseBits(n: number): number {
    // n无符号右移16位之后高16位变成0 原先的高16位移动到低16位
    // n左移16位之后低16位变成0 原先的低16位移动到高位
    // 两者或运算之后高16位和低16位就交换过来了
    n = (n >>> 16) | (n << 16);
    // 高8位和低8位交换
    n = ((n & 0xff00ff00) >>> 8) | ((n & 0x00ff00ff) << 8);
    // 高4位和低4位交换
    n = ((n & 0xf0f0f0f0) >>> 4) | ((n & 0x0f0f0f0f) << 4);
    // 高2位和低2位交换
    n = ((n & 0xcccccccc) >>> 2) | ((n & 0x33333333) << 2);
    // 高1位和低1位交换
    n = ((n & 0xaaaaaaaa) >>> 1) | ((n & 0x55555555) << 1);

    // https://stackoverflow.com/questions/40884030/how-to-declare-an-unsigned-int-variable-in-javascript
    // js中所有整数字面量会被默认当成有符号整数，通过 >>>0这种神奇的方式可以把n变成无符号整数
    return n >>> 0;
}

export function reverseBits2(n: number): number {
    if (!n) return 0;
    let result = 0;
    for (let i = 0; i < 32; i++) {
        result = result * 2 + (n & 1);
        n = n >>> 1;
    }

    return result;
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

    const result = [];
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
    const sum = arr.reduce((acc, cur) => {
        acc += cur;
        return acc;
    }, 0);

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
        const nodes = [];
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
    const maxPower = arr1.reduce((acc, cur) => {
        acc += cur;
        return acc;
    }, 0);

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
    const maxPower = arr1.reduce((acc, cur) => {
        acc += cur;
        return acc;
    }, 0);

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
    const maxMoney = arr2.reduce((acc, cur) => {
        acc += cur;
        return acc;
    }, 0);

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
    const minSlidingWindow = new SlidingWindow(arr, (last, right) => right - last);
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
        if (arr[i] - arr[i - 1] > 0) {
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
        return num.split('*').reduce((acc, cur) => {
            acc *= parseInt(cur);
            return acc;
        }, 1);
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

// zigzag方式打印二叉树
export function zigzagLevelOrder(head: TreeNode): number[][] {
    if (!head) {
        return [];
    }

    const queue = new Queue<TreeNode>();
    queue.add(head);

    let curEnd: TreeNode | null = head;
    let nextEnd: TreeNode | null = null;
    const curLevelValues: number[] = [];
    let shouldReverse = false;

    const result: number[][] = [];

    while (!queue.isEmpty()) {
        let cur = queue.poll() as TreeNode;
        curLevelValues.push(cur.val);

        if (cur.left) {
            queue.add(cur.left);
            nextEnd = cur.left;
        }
        if (cur.right) {
            queue.add(cur.right);
            nextEnd = cur.right;
        }

        // 当前节点是当前层最后一个节点
        if (cur === curEnd) {
            result.push(shouldReverse ? curLevelValues.slice().reverse() : curLevelValues.slice());
            shouldReverse = !shouldReverse;
            curLevelValues.length = 0;
            curEnd = nextEnd;
        }
    }

    return result;
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
Given the head of a singly linked list and two integers left and right where left <= right, 
reverse the nodes of the list from position left to position right, and return the reversed list.
*/
export function reverseBetween(head: SingleLinkedList | null, left: number, right: number): SingleLinkedList | null {
    if (left === right) {
        return head;
    }

    let prevLeft = null;
    let afterRight = null;

    let count = 1;
    let cur = head;
    while (count < left && cur) {
        prevLeft = cur;
        cur = cur.next;
        count++;
    }
    const leftNode = cur;

    let prev = null;
    while (count <= right && cur) {
        const next = cur.next;
        cur.next = prev;
        prev = cur;
        cur = next;

        afterRight = next;
        count++;
    }

    if (prevLeft) {
        prevLeft.next = prev;
        leftNode!.next = afterRight;
        return head;
    } else {
        leftNode!.next = afterRight;
        return prev;
    }
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
You are given the root of a binary tree. We install cameras on the tree nodes where each camera 
at a node can monitor its parent, itself, and its immediate children.

Return the minimum number of cameras needed to monitor all nodes of the tree.

以x为头节点的情况分析
1) x 没有camera 但是被子节点覆盖 noCameraCovered （此情况x的父节点可不放节点，也可放节点）
2) x 没有camera也没有被子节点覆盖 uncovered （此情况x的父节点必须放相机）
3) x 有camera且被覆盖 cameraCovered （此情况x的父节点可不放节点，也可放节点）
*/
export function minCameraCover(root: TreeNode | null): number {
    const { uncovered, noCameraCovered, cameraCovered } = minCameraCoverProcess(root);

    return Math.min(uncovered + 1, noCameraCovered, cameraCovered);
}

class MinCameraInfo {
    // x节点未被覆盖
    uncovered: number;
    // x节点无camera但是被覆盖（有一个子节点放了相机）
    noCameraCovered: number;
    // x节点放置了相机
    cameraCovered: number;

    constructor(uncovered: number, noCameraCovered: number, cameraCovered: number) {
        this.uncovered = uncovered;
        this.noCameraCovered = noCameraCovered;
        this.cameraCovered = cameraCovered;
    }
}

function minCameraCoverProcess(node: TreeNode | null): MinCameraInfo {
    if (!node) {
        // 空节点天然被覆盖，uncovered已经cameraCovered都设置为无效值
        return new MinCameraInfo(Infinity, 0, Infinity);
    }

    const left = minCameraCoverProcess(node.left);
    const right = minCameraCoverProcess(node.right);

    // 父节点必须是uncovered的状态
    // 则左右子节点必不能是uncovered（x的父节点无法再让x的子节点变成covered状态）
    // cameraCovered也不可以，因为一旦子节点上有一个相机，x节点就不可能是uncovered状态
    const uncovered = left.noCameraCovered + right.noCameraCovered;

    // x下方的点都被cover，x也被cover，但是x上无相机
    const noCameraCovered = Math.min(
        // 左右节点都有相机
        left.cameraCovered + right.cameraCovered,
        // 左右节点有一个有相机
        left.noCameraCovered + right.cameraCovered,
        left.cameraCovered + right.noCameraCovered
    );

    // 左边最少相机数+右边最少相机数+当前节点放相机
    const cameraCovered =
        Math.min(left.uncovered, left.noCameraCovered, left.cameraCovered) +
        Math.min(right.uncovered, right.noCameraCovered, right.cameraCovered) +
        1;

    return new MinCameraInfo(uncovered, noCameraCovered, cameraCovered);
}

// 借助贪心策略来优化常数时间
export function minCameraCover2(root: TreeNode | null): number {
    const { status, cameras } = minCameraCoverProcess2(root);

    return status === MinCameraStatus.Uncovered ? cameras + 1 : cameras;
}

enum MinCameraStatus {
    Uncovered,
    NoCameraCovered,
    CameraCovered,
}

class MinCameraInfo2 {
    status: MinCameraStatus;
    cameras: number;

    constructor(status: MinCameraStatus, cameras: number) {
        this.status = status;
        this.cameras = cameras;
    }
}

function minCameraCoverProcess2(node: TreeNode | null): MinCameraInfo2 {
    if (!node) {
        // 空节点必然是无相机且被覆盖，没有其他可能性
        return new MinCameraInfo2(MinCameraStatus.NoCameraCovered, 0);
    }

    const left = minCameraCoverProcess2(node.left);
    const right = minCameraCoverProcess2(node.right);
    const cameras = left.cameras + right.cameras;

    // 如果子节点有一个没被覆盖则x节点必须放相机
    // 此判断条件必须放在前面，因为如果子节点中存在未被覆盖的相机则x节点必须要放相机，没有其他可能性
    if (left.status === MinCameraStatus.Uncovered || right.status === MinCameraStatus.Uncovered) {
        return new MinCameraInfo2(MinCameraStatus.CameraCovered, cameras + 1);
    }

    // 如果子节点中有一个有相机，则x节点必返回无相机但被覆盖
    if (left.status === MinCameraStatus.CameraCovered || right.status === MinCameraStatus.CameraCovered) {
        return new MinCameraInfo2(MinCameraStatus.NoCameraCovered, cameras);
    }

    // 上面两个循环都没进入说明两个子节点都是没相机但是被cover的状态，则x节点必然返回uncovered状态
    return new MinCameraInfo2(MinCameraStatus.Uncovered, cameras);
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

    // end[i]:长度为i+1的子序列中最小结尾数值
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

        const closestMinArr = getClosestMinArr(sumArr).map(([left, right]) => {
            if (left === undefined) {
                left = -1;
            }
            if (right === undefined) {
                right = matrix[0].length;
            }

            return [left, right];
        });

        sumArr.forEach((cur, i) => {
            const [leftMin, rightMin] = closestMinArr[i];
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
    const result = [];

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

    let zeroIndexes = [];
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
