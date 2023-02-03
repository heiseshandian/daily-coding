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
    const candy = [];
    for (let i = 1; i < leftCandyArr.length; i++) {
        candy.push(Math.max(leftCandyArr[i], rightCandyArr[i]));
    }

    return candy.reduce((acc, cur) => {
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
