// 从暴力递归到动态规划

/* 
从左往右的尝试模型1
规定1和A对应、2和B对应、3和C对应…那么一个数字字符串比如"111"就可以转化为："AAA"、"KA"和"AK"
给定一个只有数字字符组成的字符串str，返回有多少种转化结果
*/
export function countConversionResult(str: string): number {
    return countProcess(str, 0);
}

// 从i位置开始到最后有多少种转化方式
function countProcess(str: string, i: number): number {
    const num = parseInt(str[i]);
    if (num === 0) {
        return 0;
    }

    if (i === str.length) {
        return 1;
    }

    if (num === 1) {
        let count = 0;
        count += countProcess(str, i + 1);
        if (i + 2 <= str.length) {
            count += countProcess(str, i + 2);
        }
        return count;
    }

    if (num === 2) {
        let count = 0;
        const nextNum = parseInt(str[i + 1]);
        if (nextNum >= 0 && nextNum <= 6 && i + 2 <= str.length) {
            count += countProcess(str, i + 2);
        }
        count += countProcess(str, i + 1);

        return count;
    }

    // 3-9
    return countProcess(str, i + 1);
}

export function countConversionResultDp(str: string): number {
    const dp = [];
    dp[str.length] = 1;

    for (let i = str.length - 1; i >= 0; i--) {
        const num = parseInt(str[i]);
        if (num === 0) {
            dp[i] = 0;
            continue;
        }

        if (num === 1) {
            let count = 0;
            count += dp[i + 1];
            if (i + 2 <= str.length) {
                count += dp[i + 2];
            }
            dp[i] = count;
            continue;
        }

        if (num === 2) {
            let count = 0;
            const nextNum = parseInt(str[i + 1]);
            if (nextNum >= 0 && nextNum <= 6 && i + 2 <= str.length) {
                count += dp[i + 2];
            }
            count += dp[i + 1];

            dp[i] = count;
            continue;
        }

        dp[i] = dp[i + 1];
    }

    return dp[0];
}

// 观察countConversionResultDp可知每个当前值都只依赖于前两个值，可以用3个变量滚动的方式来节省空间
export function countConversionResultDp2(str: string): number {
    let prePrev = 1;
    let prev = 1;
    let cur = 1;

    for (let i = str.length - 1; i >= 0; i--) {
        const num = parseInt(str[i]);
        if (num === 0) {
            cur = 0;
        } else if (num === 1) {
            let count = 0;
            count += prev;
            if (i + 2 <= str.length) {
                count += prePrev;
            }
            cur = count;
        } else if (num === 2) {
            let count = 0;
            const nextNum = parseInt(str[i + 1]);
            if (nextNum >= 0 && nextNum <= 6 && i + 2 <= str.length) {
                count += prePrev;
            }
            count += prev;

            cur = count;
        } else {
            cur = prev;
        }

        // 下一次循环中cur就是prev，prev就是prePrev
        prePrev = prev;
        prev = cur;
    }

    return cur;
}

/* 
从左往右的尝试模型2
给定两个长度都为N的数组weights和values，weights【i】和values【i】分别代表i号物品的重量和价值。
给定一个正数bag，表示一个载重bag的袋子，你装的物品不能超过这个重量。返回你能装下最多的价值是多少？
*/
export function maxValueOfBag(weights: number[], values: number[], bag: number): number {
    return bagProcess(weights, values, 0, bag);
}

function bagProcess(weights: number[], values: number[], i: number, restWeight: number): number {
    // 没有空间或者没有货物能拿到的最大价值是0
    if (i === weights.length) {
        return 0;
    }

    // 两种决策，拿当前物品或者不拿当前物品
    let p1 = 0;
    // 拿当前物品之前需要判断下是否超重
    if (restWeight - weights[i] >= 0) {
        p1 = values[i] + bagProcess(weights, values, i + 1, restWeight - weights[i]);
    }
    const p2 = bagProcess(weights, values, i + 1, restWeight);

    return Math.max(p1, p2);
}

export function maxValueOfBagDp(weights: number[], values: number[], bag: number): number {
    // dp[i][j] 剩余重量为j，自由拿i以及i以后的所有物品所能获得的最大价值
    // i:0-weights.length j:0-bag
    const dp: number[][] = new Array(weights.length + 1).fill(0).map((_) => new Array(bag + 1).fill(0));

    for (let i = weights.length - 1; i >= 0; i--) {
        for (let j = 0; j <= bag; j++) {
            // 两种决策，拿当前物品或者不拿当前物品
            let p1 = 0;
            // 拿当前物品之前需要判断下是否超重
            if (j - weights[i] >= 0) {
                p1 = values[i] + dp[i + 1][j - weights[i]];
            }
            const p2 = dp[i + 1][j];

            dp[i][j] = Math.max(p1, p2);
        }
    }

    return dp[0][bag];
}

// 观察maxValueOfBagDp可以看出每一行的值都只依赖于下一行的值，也就是说我们可以用一个数组滚动的方式来弄出最终的值，从而节省空间
// 由于dp[i][j]有可能依赖于前面已经计算过的值所以我们需要用两个数组来滚动，若dp[i][j]严格依赖于二维表中下面的值则可以只用一个数组来滚动
export function maxValueOfBagDp2(weights: number[], values: number[], bag: number): number {
    const dp: number[] = new Array(bag + 1).fill(0);
    let dpPrev: number[] = new Array(bag + 1).fill(0);

    for (let i = weights.length - 1; i >= 0; i--) {
        for (let j = 0; j <= bag; j++) {
            // 两种决策，拿当前物品或者不拿当前物品
            let p1 = 0;
            // 拿当前物品之前需要判断下是否超重
            if (j - weights[i] >= 0) {
                p1 = values[i] + dpPrev[j - weights[i]];
            }
            const p2 = dpPrev[j];

            dp[j] = Math.max(p1, p2);
        }
        dpPrev = dp.slice(0);
    }

    return dp[bag];
}

/* 
范围上尝试的模型

给定一个整型数组arr，代表数值不同的纸牌排成一条线，玩家A和玩家B依次拿走每张纸牌，规定玩家A先拿，玩家B后拿，
但是每个玩家每次只能拿走最左或最右的纸牌，玩家A和玩家B都绝顶聪明。请返回最后获胜者的分数。
*/
export function getMaxPoints(points: number[]): number {
    return Math.max(first(points, 0, points.length - 1), last(points, 0, points.length - 1));
}

// 在left-right上先手拿牌所能获得的最大点数
function first(points: number[], left: number, right: number): number {
    if (left === right) {
        return points[left];
    }

    // 两种选择，拿走left或者拿走right的牌
    const p1 = points[left] + last(points, left + 1, right);
    const p2 = points[right] + last(points, left, right - 1);
    return Math.max(p1, p2);
}

// 在left-right上后手拿牌所能获得的最大点数
function last(points: number[], left: number, right: number): number {
    if (left === right) {
        return 0;
    }

    // 取决于先手的选择，先手拿走left，或先手拿走right
    const p1 = first(points, left + 1, right);
    const p2 = first(points, left, right - 1);

    return Math.min(p1, p2);
}

export function getMaxPointsDp(points: number[]): number {
    const len = points.length;

    // dpFirst[i][j] 在i-j上先手能获得的最大点数
    const dpFirst: number[][] = new Array(len).fill(0).map((_) => new Array(len).fill(0));
    // dpLast[i][j]在i-j上后手能获得的最大点数
    const dpLast: number[][] = new Array(len).fill(0).map((_) => new Array(len).fill(0));

    // left===right dpLast[i][j]=points[left];
    for (let i = 0; i < len; i++) {
        dpFirst[i][i] = points[i];
    }

    for (let left = len - 1; left >= 0; left--) {
        for (let right = left + 1; right < len; right++) {
            // 两种选择，拿走left或者拿走right的牌
            const f1 = points[left] + dpLast[left + 1][right];
            const f2 = points[right] + dpLast[left][right - 1];
            dpFirst[left][right] = Math.max(f1, f2);

            // 取决于先手的选择，先手拿走left，或先手拿走right
            const l1 = dpFirst[left + 1][right];
            const l2 = dpFirst[left][right - 1];
            dpLast[left][right] = Math.min(l1, l2);
        }
    }

    return Math.max(dpFirst[0][len - 1], dpLast[0][len - 1]);
}

// n皇后问题
// 有n个皇后需要摆放到n*n的格子上，要求任何皇后不同行不同列且不同对角线
export function countNQueen(n: number): number {
    // 下标表示行号，值表示列号，queen[0]=1 表示0行1列上摆放了皇后
    const queen: number[] = new Array(n);
    return countNQueenProcess(queen, 0);
}

function countNQueenProcess(queen: number[], i: number): number {
    if (i === queen.length) {
        return 1;
    }

    let count = 0;
    for (let j = 0; j < queen.length; j++) {
        if (isValidPosition(queen, i, j)) {
            // 在i行j列摆放皇后
            queen[i] = j;
            count += countNQueenProcess(queen, i + 1);
        }
    }

    return count;
}

function isValidPosition(queen: number[], i: number, j: number): boolean {
    // 此处lineNum < i 而不是<queen.length 因为后面还没摆放皇后
    for (let lineNum = 0; lineNum < i; lineNum++) {
        if (queen[lineNum] === j || Math.abs(i - lineNum) === Math.abs(j - queen[lineNum])) {
            return false;
        }
    }

    return true;
}

// 利用位运算加速n皇后问题
export function countNQueen2(n: number): number {
    if (n < 1 || n > 32) {
        return 0;
    }

    // limit 右侧有n个1，左侧是0
    const limit = n === 32 ? -1 : (1 << n) - 1;
    return countNQueen2Process(limit, 0, 0, 0);
}

function countNQueen2Process(limit: number, colLimit: number, leftLimit: number, rightLimit: number): number {
    if (colLimit === limit) {
        return 1;
    }

    // pos中所有1的位置是剩下的可以摆放的位置
    let pos = limit & ~(colLimit | leftLimit | rightLimit);
    let count = 0;
    // 尝试所有位置
    while (pos) {
        const mostRightOne = pos & (~pos + 1);
        pos = pos - mostRightOne;

        count += countNQueen2Process(
            limit,
            colLimit | mostRightOne,
            (leftLimit | mostRightOne) << 1,
            // 无符号右移，高位补0
            (rightLimit | mostRightOne) >>> 1
        );
    }

    return count;
}
