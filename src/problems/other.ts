import { GenericHeap } from '../algorithm/generic-heap';
import { getClosestMinArr } from '../algorithm/monotonous-stack';
import { TreeNode } from '../algorithm/tree';
import { swap } from '../common';
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
题目2（来自网易）
给定一个正数数组arr，表示每个小朋友的得分
任何两个相邻的小朋友，如果得分一样，怎么分糖果无所谓，但如果得分不一样，分数大的一定要比分数少的多拿一些糖果
假设所有的小朋友坐成一个环形，返回在不破坏上一条规则的情况下，需要的最少糖果数
*/
export function getMinCandy(arr: number[]): number {
    // 找到局部最小值，局部最小分得的糖果一定是1
    let minIndex = -1;
    for (let i = 0; i < arr.length; i++) {
        const prev = i > 0 ? i - 1 : arr.length - 1;
        const next = i < arr.length ? i + 1 : 0;
        if (arr[i] <= arr[prev] && arr[i] <= arr[next]) {
            minIndex = i;
            break;
        }
    }

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

    // 左右坡度取最大值就是最终的糖果数
    let candy = 0;
    for (let i = 1; i < leftCandyArr.length; i++) {
        candy += Math.max(leftCandyArr[i], rightCandyArr[i]);
    }

    return candy;
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
    let count = 1;
    let mostRight = arr[0];
    let nextMostRight = -Infinity;

    while (cur < arr.length && mostRight < arr.length) {
        if (cur <= mostRight) {
            nextMostRight = Math.max(nextMostRight, arr[cur] + cur);
            cur++;
            continue;
        }

        count++;
        mostRight = nextMostRight;
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
