import { cache } from '../design-pattern/proxy';
// 从暴力递归到动态规划

/* 
面试中设计暴力递归过程的原则

1）每一个可变参数的类型，一定不要比int类型更加复杂
2）原则1）可以违反，让类型突破到一维线性结构，那必须是唯一可变参数
3）如果发现原则1）被违反，但不违反原则2），只需要做到记忆化搜索即可
4）可变参数的个数，能少则少
*/

/* 
常见的4种尝试模型

1）从左往右的尝试模型
2）范围上的尝试模型
3) 多样本位置全对应的尝试模型
4）寻找业务限制的尝试模型
*/

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
    const dp: number[] = [];
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
export function maxValueOfBag(
    weights: number[],
    values: number[],
    bag: number
): number {
    return bagProcess(weights, values, 0, bag);
}

function bagProcess(
    weights: number[],
    values: number[],
    i: number,
    restWeight: number
): number {
    // 没有空间或者没有货物能拿到的最大价值是0
    if (i === weights.length) {
        return 0;
    }

    // 两种决策，拿当前物品或者不拿当前物品
    let p1 = 0;
    // 拿当前物品之前需要判断下是否超重
    if (restWeight - weights[i] >= 0) {
        p1 =
            values[i] +
            bagProcess(weights, values, i + 1, restWeight - weights[i]);
    }
    const p2 = bagProcess(weights, values, i + 1, restWeight);

    return Math.max(p1, p2);
}

export function maxValueOfBagDp(
    weights: number[],
    values: number[],
    bag: number
): number {
    // dp[i][j] 剩余重量为j，自由拿i以及i以后的所有物品所能获得的最大价值
    // i:0-weights.length j:0-bag
    const dp: number[][] = new Array(weights.length + 1)
        .fill(0)
        .map((_) => new Array(bag + 1).fill(0));

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
export function maxValueOfBagDp2(
    weights: number[],
    values: number[],
    bag: number
): number {
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
    return Math.max(
        first(points, 0, points.length - 1),
        last(points, 0, points.length - 1)
    );
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
    const dpFirst: number[][] = new Array(len)
        .fill(0)
        .map((_) => new Array(len).fill(0));
    // dpLast[i][j]在i-j上后手能获得的最大点数
    const dpLast: number[][] = new Array(len)
        .fill(0)
        .map((_) => new Array(len).fill(0));

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
        if (
            queen[lineNum] === j ||
            Math.abs(i - lineNum) === Math.abs(j - queen[lineNum])
        ) {
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

function countNQueen2Process(
    limit: number,
    colLimit: number,
    leftLimit: number,
    rightLimit: number
): number {
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

/* 
题目一
假设有排成一行的N个位置，记为1~N， N一定大于或等于2 
开始时机器人在其中的M位置上（M一定是1~N中的一个）
如果机器人来到1位置，那么下一步只能往右来到2位置；
如果机器人来到N位置，那么下一步只能往左来到N-1位置；
如果机器人来到中间位置，那么下一步可以往左走或者往右走；
规定机器人必须走K步，最终能来到P位置（P也是1~N中的一个）的方法有多少种给定四个参数N、M、K、P，返回方法数。
*/
export function countWalkMethods(
    n: number,
    m: number,
    k: number,
    p: number
): number {
    return walkProcess(n, p, k, m);
}

// 目标点为p，i是当前位置，restK是剩余步数，返回一共有多少种走法
function walkProcess(n: number, p: number, restK: number, i: number): number {
    if (restK === 0) {
        return i === p ? 1 : 0;
    }

    // 当前位置是1只能向右走
    if (i === 1) {
        return walkProcess(n, p, restK - 1, i + 1);
    }

    // 当前位置是n只能往左走
    if (i === n) {
        return walkProcess(n, p, restK - 1, i - 1);
    }

    // 向左走或者向右走
    return (
        walkProcess(n, p, restK - 1, i + 1) +
        walkProcess(n, p, restK - 1, i - 1)
    );
}

export function countWalkMethodsDp(
    n: number,
    m: number,
    k: number,
    p: number
): number {
    // dp[restK][i] 表示剩余步数为restK，当前位置为i的情况下，后续有多少种走法
    // restK:0-k 一共k+1个位置
    // i:1-n
    // dp[k][m] 就是我们最终需要返回的值
    const dp: number[][] = new Array(k + 1)
        .fill(0)
        .map((_) => new Array(n + 1).fill(0));
    dp[0][p] = 1;

    for (let restK = 1; restK <= k; restK++) {
        for (let i = 1; i <= n; i++) {
            if (i === 1) {
                dp[restK][i] = dp[restK - 1][i + 1];
            } else if (i === n) {
                dp[restK][i] = dp[restK - 1][i - 1];
            } else {
                dp[restK][i] = dp[restK - 1][i + 1] + dp[restK - 1][i - 1];
            }
        }
    }

    return dp[k][m];
}

// 用两个数组滚动来节省空间
export function countWalkMethodsDp2(
    n: number,
    m: number,
    k: number,
    p: number
): number {
    let prevDp = new Array(n + 1).fill(0);
    prevDp[p] = 1;

    const dp = new Array(n + 1).fill(0);

    for (let restK = 1; restK <= k; restK++) {
        for (let i = 1; i <= n; i++) {
            if (i === 1) {
                dp[i] = prevDp[i + 1];
            } else if (i === n) {
                dp[i] = prevDp[i - 1];
            } else {
                dp[i] = prevDp[i + 1] + prevDp[i - 1];
            }
        }

        prevDp = dp.slice();
    }

    return dp[m];
}

// 给定整数数组arr，arr中的元素表示不同面值的货币，给定target，每种面值的货币可以使用无线多次，问一共有多少种方式可以搞出target
export function countMoney(arr: number[], target: number): number {
    return countMoneyProcess(arr, 0, target);
}

// i以及i位置之后的货币自由选择，凑出rest一共有多少种方式
function countMoneyProcess(arr: number[], i: number, rest: number): number {
    if (i === arr.length && rest !== 0) {
        return 0;
    }
    if (rest === 0) {
        return 1;
    }

    let count = 0;
    for (let j = 0; j <= Math.floor(rest / arr[i]); j++) {
        count += countMoneyProcess(arr, i + 1, rest - arr[i] * j);
    }

    return count;
}

export function countMoneyDp(arr: number[], target: number): number {
    // dp[i][rest] 从i位置开始自由选择，搞定rest有多少种选择方案
    const dp: number[][] = new Array(arr.length + 1)
        .fill(0)
        .map((_) => new Array(target + 1).fill(0));
    for (let i = 0; i <= arr.length; i++) {
        dp[i][0] = 1;
    }

    for (let i = arr.length; i >= 0; i--) {
        for (let rest = 1; rest <= target; rest++) {
            let count = 0;
            for (let j = 0; j <= Math.floor(rest / arr[i]); j++) {
                count += dp[i + 1][rest - arr[i] * j];
            }
            dp[i][rest] = count;
        }
    }

    return dp[0][target];
}

export function countMoneyDp2(arr: number[], target: number): number {
    // dp[i][rest] 从i位置开始自由选择，搞定rest有多少种选择方案
    const dp: number[][] = new Array(arr.length + 1)
        .fill(0)
        .map((_) => new Array(target + 1).fill(0));
    for (let i = 0; i <= arr.length; i++) {
        dp[i][0] = 1;
    }

    for (let i = arr.length - 1; i >= 0; i--) {
        for (let rest = 1; rest <= target; rest++) {
            // 通过画图分析观察优化枚举行为
            dp[i][rest] = dp[i + 1][rest];
            if (rest - arr[i] >= 0) {
                dp[i][rest] += dp[i][rest - arr[i]];
            }
        }
    }

    return dp[0][target];
}

// dp表每个位置的数据都只依赖于下面的数据和本行的数据，可以用两个一维表滚动的方式来优化空间
export function countMoneyDp3(arr: number[], target: number): number {
    const dp: number[] = new Array(target + 1).fill(0);
    dp[0] = 1;
    let preDp = dp.slice();

    for (let i = arr.length - 1; i >= 0; i--) {
        for (let rest = 1; rest <= target; rest++) {
            // 通过画图分析观察优化枚举行为
            dp[rest] = preDp[rest];
            if (rest - arr[i] >= 0) {
                dp[rest] += dp[rest - arr[i]];
            }
        }

        preDp = dp.slice();
    }

    return dp[target];
}

/* 
题目二
给定一个字符串str，给定一个字符串类型的数组arr。
arr里的每一个字符串，代表一张贴纸，你可以把单个字符剪开使用，目的是拼出str来。
返回需要至少多少张贴纸可以完成这个任务。

例子： str= "babac"， arr ={"ba"，"c"，"abcd"}
至少需要两张贴纸"ba"和"abcd"，因为使用这两张贴纸，把每一个字符单独剪开，含有2个a、2个b、1个c。是可以拼出str的。所以返回2。
*/
// 因为字符可以单独剪开使用，所以原串和贴纸串中字符顺序对结果无影响，我们可以用一个长度为26位的数组来代替原串和贴纸
export function getMinMethods(str: string, arr: string[]): number {
    // 假定只有26种字符，strArr[0]=23表示str中有23个a
    const strArr: number[] = convertStr2CountArr(str);

    const handledArr: number[][] = new Array(arr.length).fill(0);
    for (let i = 0; i < arr.length; i++) {
        handledArr[i] = convertStr2CountArr(arr[i]);
    }

    return getMinMethodsProcess(strArr, handledArr, 0);
}

function convertStr2CountArr(str: string): number[] {
    const strArr: number[] = new Array(26).fill(0);
    for (let i = 0; i < str.length; i++) {
        const index = str[i].charCodeAt(0) - 'a'.charCodeAt(0);
        strArr[index] += 1;
    }

    return strArr;
}

// 从i位置自由选择，搞定剩下的字符最少需要多少张贴纸
function getMinMethodsProcess(
    strArr: number[],
    handledArr: number[][],
    i: number
): number {
    // 所有字符已经搞定返回最少需要0张
    if (strArr.every((val) => val === 0)) {
        return 0;
    }
    // 还有字符没搞定，但是已经没有贴纸了，返回-1，后面需要对-1进行处理
    if (i === handledArr.length) {
        return -1;
    }

    // i位置可以选择0张，1张...max
    let max = 0;
    for (let k = 0; k < strArr.length; k++) {
        // 全部用当前贴纸搞定当前字符最少需要几张
        if (handledArr[i][k] !== 0) {
            const curMax = Math.ceil(strArr[k] / handledArr[i][k]);
            max = Math.max(max, curMax);
        }
    }

    // 当前贴纸可以选取0-max张，从中选最小值返回
    let min = Infinity;
    for (let k = 0; k <= max; k++) {
        // 保存现场
        const copy = strArr.slice();
        for (let j = 0; j < strArr.length; j++) {
            strArr[j] = Math.max(0, strArr[j] - handledArr[i][j] * k);
        }
        const next = getMinMethodsProcess(strArr, handledArr, i + 1);
        // 恢复现场
        strArr = copy.slice();

        if (next !== -1) {
            min = Math.min(min, next + k);
        }
    }

    return min === Infinity ? -1 : min;
}

export function getMinMethodsDp(str: string, arr: string[]): number {
    const handledArr: number[][] = new Array(arr.length).fill(0);
    for (let i = 0; i < arr.length; i++) {
        handledArr[i] = convertStr2CountArr(arr[i]);
    }

    const dp: Map<string, number> = new Map();
    dp.set('', 0);

    return getMinMethodsDpProcess(str, handledArr, dp);
}

// 自由使用所有贴纸搞定rest最少需要多少张贴纸，这种尝试模型就比上面的要好一点，因为这种尝试模型只有一个可变参数，可以有效提高缓存结构的命中率，
// 而且所需要的缓存也会少一些
function getMinMethodsDpProcess(
    rest: string,
    handledArr: number[][],
    dp: Map<string, number>
): number {
    if (dp.has(rest)) {
        return dp.get(rest) as number;
    }
    const restArr = convertStr2CountArr(rest);
    let min = Infinity;

    // 自由使用贴纸来搞定rest
    for (let i = 0; i < handledArr.length; i++) {
        // 先从rest第一个字符开始搞定，没有第一个字符的贴纸本轮循环不参与
        // 假如存在一种方案搞定rest则必然需要搞定第一个字符
        if (handledArr[i][rest[0].charCodeAt(0) - 'a'.charCodeAt(0)] === 0) {
            continue;
        }

        let newRest = '';
        for (let k = 0; k < restArr.length; k++) {
            const count = Math.max(0, restArr[k] - handledArr[i][k]);
            const char = String.fromCharCode(k + 'a'.charCodeAt(0));
            newRest += ''.padEnd(count, char);
        }

        const next = getMinMethodsDpProcess(newRest, handledArr, dp);
        if (next !== -1) {
            min = Math.min(min, next + 1);
        }
    }

    dp.set(rest, min === Infinity ? -1 : min);
    return dp.get(rest) as number;
}

// 多样本位置全对应的尝试模型
// 两个字符串的最长公共子序列问题
export function maxCommonSubsequence(str1: string, str2: string): number {
    // 上来就弄一张二维表，然后再赋予这张二维表意义
    // dp[i][j] str1 0-i字符与str2 0-j字符的最长公共子序列长度，dp[str1.length-1][str2.length-1]就是我们最终的返回值
    const dp: number[][] = new Array(str1.length)
        .fill(0)
        .map((_) => new Array(str2.length).fill(0));
    dp[0][0] = str1[0] === str2[0] ? 1 : 0;

    // 第0行的值，一旦出现一个相同字符，后续位置都是1（因为str1此时就一个字符，可能的最长公共子序列长度也就是1）
    for (let j = 1; j < str2.length; j++) {
        dp[0][j] = Math.max(dp[0][j - 1], str2[j] === str1[0] ? 1 : 0);
    }

    // 第0列的值同理
    for (let i = 1; i < str1.length; i++) {
        dp[i][0] = Math.max(dp[i - 1][0], str1[i] === str2[0] ? 1 : 0);
    }

    // 任意位置
    // 1) 最长子序列以i且以j结尾 (str1[i]===str2[j]) dp[i-1][j-1]+1
    // 2) 最长子序列不以i，j结尾 dp[i-1][j-1]
    // 3) 最长子序列以i结尾，不以j结尾 dp[i][j-1]
    // 4) 最长子序列以j结尾不以i结尾 dp[i-1][j]
    for (let i = 1; i < str1.length; i++) {
        for (let j = 1; j < str2.length; j++) {
            // dp[i][j - 1], dp[i - 1][j] 的值不可能比dp[i - 1][j - 1]更小，这里我们直接省略掉dp[i - 1][j - 1]这种情况
            dp[i][j] = Math.max(dp[i][j - 1], dp[i - 1][j]);
            if (str1[i] === str2[j]) {
                dp[i][j] = Math.max(dp[i][j], dp[i - 1][j - 1] + 1);
            }
        }
    }

    return dp[str1.length - 1][str2.length - 1];
}

// 寻找业务限制的尝试模型
/* 
给定一个数组，代表每个人喝完咖啡准备刷杯子的时间
只有一台咖啡机，一次只能洗一个杯子，时间耗费a，
洗完才能洗下一杯每个咖啡杯也可以自己挥发干净，时间耗费b，
咖啡杯可以并行挥发返回让所有咖啡杯变干净的最早完成时间三个参数：int【】arr、int a、int b
*/
export function getCoffeeTime(arr: number[], a: number, b: number): number {
    arr.sort((a1, a2) => a1 - a2);

    return coffeeTimeProcess(arr, a, b, 0, 0);
}

/*  
当前来到i号咖啡杯，咖啡机空闲的时间是freeTime，返回洗完所有杯子所需要的最少时间
假设i号杯子决定放进咖啡机里面洗则nextFreeTime = Math.max(arr[i],freeTime) + a
假设i号杯子决定自己挥发干净则最快干净的时间是 arr[i] + b
 */
function coffeeTimeProcess(
    arr: number[],
    a: number,
    b: number,
    i: number,
    freeTime: number
): number {
    // 没有杯子需要洗了，则咖啡机洗完的时间就是最少时间
    if (i === arr.length) {
        return freeTime;
    }

    // i号杯子自然挥发，自然挥发可并行发生，洗完所有杯子所需时间就是当前时间与后续时间的较大值
    const p1 = Math.max(
        arr[i] + b,
        coffeeTimeProcess(arr, a, b, i + 1, freeTime)
    );

    // i号杯子放进咖啡机里洗，洗完所有杯子所需时间就是nextFreeTime与后续时间的较大值
    const nextFreeTime = Math.max(arr[i], freeTime) + a;
    const p2 = Math.max(
        nextFreeTime,
        coffeeTimeProcess(arr, a, b, i + 1, nextFreeTime)
    );

    return Math.min(p1, p2);
}

export function getCoffeeTimeDp(arr: number[], a: number, b: number): number {
    arr.sort((a1, a2) => a1 - a2);

    const dp: Map<number, Map<number, number>> = new Map();
    return coffeeTimeProcess2(arr, a, b, 0, 0, dp);
}

function coffeeTimeProcess2(
    arr: number[],
    a: number,
    b: number,
    i: number,
    freeTime: number,
    dp: Map<number, Map<number, number>>
): number {
    if (dp.has(i) && dp.get(i)?.has(freeTime)) {
        return dp.get(i)?.get(freeTime) as number;
    }

    // 没有杯子需要洗了，则咖啡机洗完的时间就是最少时间
    if (i === arr.length) {
        return freeTime;
    }

    // i号杯子自然挥发，自然挥发可并行发生，洗完所有杯子所需时间就是当前时间与后续时间的较大值
    const p1 = Math.max(
        arr[i] + b,
        coffeeTimeProcess(arr, a, b, i + 1, freeTime)
    );

    // i号杯子放进咖啡机里洗，洗完所有杯子所需时间就是nextFreeTime与后续时间的较大值
    const nextFreeTime = Math.max(arr[i], freeTime) + a;
    const p2 = Math.max(
        nextFreeTime,
        coffeeTimeProcess(arr, a, b, i + 1, nextFreeTime)
    );

    if (!dp.has(i)) {
        dp.set(i, new Map());
    }
    dp.get(i)?.set(freeTime, Math.min(p1, p2));
    return Math.min(p1, p2);
}

export function getCoffeeTimeDp2(arr: number[], a: number, b: number): number {
    arr.sort((a1, a2) => a1 - a2);

    // 从业务限制中找到freeTime的最大值
    // 很明显，如果所有的咖啡杯都用咖啡机来洗的话freeTime的时间最大
    let maxFreeTime = 0;
    for (let i = 0; i < arr.length; i++) {
        maxFreeTime = Math.max(arr[i], maxFreeTime) + a;
    }

    // dp[i][freeTime] dp[0][0]就是我们需要的返回值
    const dp: number[][] = new Array(arr.length + 1)
        .fill(0)
        .map((_) => new Array(maxFreeTime + 1).fill(0));

    // dp[arr.length][freeTime]=freeTime
    for (let freeTime = 0; freeTime <= maxFreeTime; freeTime++) {
        dp[arr.length][freeTime] = freeTime;
    }

    // 从下到上，从右到左填表
    for (let i = arr.length - 1; i >= 0; i--) {
        for (let freeTime = maxFreeTime; freeTime >= 0; freeTime--) {
            // i号杯子自然挥发，自然挥发可并行发生，洗完所有杯子所需时间就是当前时间与后续时间的较大值
            const p1 = Math.max(arr[i] + b, dp[i + 1][freeTime]);

            // i号杯子放进咖啡机里洗，洗完所有杯子所需时间就是nextFreeTime与后续时间的较大值
            const nextFreeTime = Math.max(arr[i], freeTime) + a;
            const p2 = Math.max(nextFreeTime, dp[i + 1][nextFreeTime]);

            dp[i][freeTime] = Math.min(p1, p2);
        }
    }

    return dp[0][0];
}

// 用两个一维表代替二维表
export function getCoffeeTimeDp3(arr: number[], a: number, b: number): number {
    arr.sort((a1, a2) => a1 - a2);

    // 从业务限制中找到freeTime的最大值
    // 很明显，如果所有的咖啡杯都用咖啡机来洗的话freeTime的时间最大
    let maxFreeTime = 0;
    for (let i = 0; i < arr.length; i++) {
        maxFreeTime = Math.max(arr[i], maxFreeTime) + a;
    }

    // dp[freeTime] dp[0]就是我们需要的返回值
    const dp: number[] = new Array(maxFreeTime + 1).fill(0);
    // dp[freeTime]=freeTime
    for (let freeTime = 0; freeTime <= maxFreeTime; freeTime++) {
        dp[freeTime] = freeTime;
    }
    let prevDp = dp.slice();

    // 从下到上，从右到左填表
    for (let i = arr.length - 1; i >= 0; i--) {
        for (let freeTime = maxFreeTime; freeTime >= 0; freeTime--) {
            // i号杯子自然挥发，自然挥发可并行发生，洗完所有杯子所需时间就是当前时间与后续时间的较大值
            const p1 = Math.max(arr[i] + b, prevDp[freeTime]);

            // i号杯子放进咖啡机里洗，洗完所有杯子所需时间就是nextFreeTime与后续时间的较大值
            const nextFreeTime = Math.max(arr[i], freeTime) + a;
            const p2 = Math.max(nextFreeTime, prevDp[nextFreeTime]);

            dp[freeTime] = Math.min(p1, p2);
        }
        prevDp = dp.slice();
    }

    return dp[0];
}

/*
三维动态规划
需要注意的点：
1）初始值设置（不一定可以直接从递归函数中拿过来，拿过来之前需要分析实际含义）
2）按层来填值
 
有一张9x10的棋盘，假设当前马在（0,0）位置，给定目标点(a,b) 以及目标步数k，问有多少种方式能够到达目标点
*/
export function getHorseMethods(
    maxX: number,
    maxY: number,
    a: number,
    b: number,
    k: number
): number {
    if (k < 0) {
        return 0;
    }

    return getHorseMethodsProcess(maxX, maxY, a, b, 0, 0, k);
}

function getHorseMethodsProcess(
    maxX: number,
    maxY: number,
    a: number,
    b: number,
    curA: number,
    curB: number,
    rest: number
): number {
    // 剩余0步且当前来到了(a,b)位置则找到了一种走法，否则返回0
    if (rest === 0) {
        return curA === a && curB === b ? 1 : 0;
    }

    // 走到了非法位置直接返回0终止递归
    if (curA < 0 || curA > maxX || curB < 0 || curB > maxY) {
        return 0;
    }

    // 8种可能
    let count = 0;
    count +=
        getHorseMethodsProcess(maxX, maxY, a, b, curA + 2, curB + 1, rest - 1) +
        getHorseMethodsProcess(maxX, maxY, a, b, curA + 2, curB - 1, rest - 1) +
        getHorseMethodsProcess(maxX, maxY, a, b, curA - 2, curB + 1, rest - 1) +
        getHorseMethodsProcess(maxX, maxY, a, b, curA - 2, curB - 1, rest - 1) +
        getHorseMethodsProcess(maxX, maxY, a, b, curA + 1, curB + 2, rest - 1) +
        getHorseMethodsProcess(maxX, maxY, a, b, curA - 1, curB + 2, rest - 1) +
        getHorseMethodsProcess(maxX, maxY, a, b, curA + 1, curB - 2, rest - 1) +
        getHorseMethodsProcess(maxX, maxY, a, b, curA - 1, curB - 2, rest - 1);

    return count;
}

export function getHorseMethods2(
    maxX: number,
    maxY: number,
    a: number,
    b: number,
    k: number
): number {
    if (k < 0) {
        return 0;
    }

    return getHorseMethodsProcess2(maxX, maxY, a, b, k);
}

function getHorseMethodsProcess2(
    maxX: number,
    maxY: number,
    curA: number,
    curB: number,
    rest: number
): number {
    // 剩余0步且当前来到了(0,0)位置则找到了一种走法，否则返回0
    if (rest === 0) {
        return curA === 0 && curB === 0 ? 1 : 0;
    }

    // 走到了非法位置直接返回0终止递归
    if (curA < 0 || curA > maxX || curB < 0 || curB > maxY) {
        return 0;
    }

    // 8种可能
    let count = 0;
    count +=
        getHorseMethodsProcess2(maxX, maxY, curA + 2, curB + 1, rest - 1) +
        getHorseMethodsProcess2(maxX, maxY, curA + 2, curB - 1, rest - 1) +
        getHorseMethodsProcess2(maxX, maxY, curA - 2, curB + 1, rest - 1) +
        getHorseMethodsProcess2(maxX, maxY, curA - 2, curB - 1, rest - 1) +
        getHorseMethodsProcess2(maxX, maxY, curA + 1, curB + 2, rest - 1) +
        getHorseMethodsProcess2(maxX, maxY, curA - 1, curB + 2, rest - 1) +
        getHorseMethodsProcess2(maxX, maxY, curA + 1, curB - 2, rest - 1) +
        getHorseMethodsProcess2(maxX, maxY, curA - 1, curB - 2, rest - 1);

    return count;
}

export function getHorseMethodsDp(
    maxX: number,
    maxY: number,
    a: number,
    b: number,
    k: number
): number {
    if (k < 0) {
        return 0;
    }

    // dp[k][a][b]是最终返回值
    const dp: number[][][] = new Array(k + 1)
        .fill(0)
        .map((_) =>
            new Array(maxX + 1).fill(0).map((_) => new Array(maxY + 1).fill(0))
        );

    // 剩余0步且当前来到了(a,b)位置则找到了一种走法，否则返回0
    // if (rest === 0) {
    //     return curA === a && curB === b ? 1 : 0;
    // }
    // 此处不可以直接写dp[0][a][b]=0 因为马是从（0,0）出发的，如果直接写成dp[0][a][b]=1就相当于马是从(a,b)出发的，走了k步之后再回到(a,b)
    dp[0][0][0] = 1;

    const isOutOfScope = (curA: number, curB: number) => {
        return curA < 0 || curA > maxX || curB < 0 || curB > maxY;
    };

    // 从第0层开始往上填写
    for (let rest = 1; rest <= k; rest++) {
        for (let curA = 0; curA <= maxX; curA++) {
            for (let curB = 0; curB <= maxY; curB++) {
                dp[rest][curA][curB] =
                    (isOutOfScope(curA + 2, curB + 1)
                        ? 0
                        : dp[rest - 1][curA + 2][curB + 1]) +
                    (isOutOfScope(curA + 2, curB - 1)
                        ? 0
                        : dp[rest - 1][curA + 2][curB - 1]) +
                    (isOutOfScope(curA - 2, curB + 1)
                        ? 0
                        : dp[rest - 1][curA - 2][curB + 1]) +
                    (isOutOfScope(curA - 2, curB - 1)
                        ? 0
                        : dp[rest - 1][curA - 2][curB - 1]) +
                    (isOutOfScope(curA + 1, curB + 2)
                        ? 0
                        : dp[rest - 1][curA + 1][curB + 2]) +
                    (isOutOfScope(curA - 1, curB + 2)
                        ? 0
                        : dp[rest - 1][curA - 1][curB + 2]) +
                    (isOutOfScope(curA + 1, curB - 2)
                        ? 0
                        : dp[rest - 1][curA + 1][curB - 2]) +
                    (isOutOfScope(curA - 1, curB - 2)
                        ? 0
                        : dp[rest - 1][curA - 1][curB - 2]);
            }
        }
    }

    return dp[k][a][b];
}

export function getHorseMethodsDp2(
    maxX: number,
    maxY: number,
    a: number,
    b: number,
    k: number
): number {
    if (k < 0) {
        return 0;
    }

    // dp[k][a][b]是最终返回值
    const dp: number[][] = new Array(maxX + 1)
        .fill(0)
        .map((_) => new Array(maxY + 1).fill(0));
    dp[0][0] = 1;
    let prevDp = dp.slice().map((arr) => arr.slice());

    const isOutOfScope = (curA: number, curB: number) => {
        return curA < 0 || curA > maxX || curB < 0 || curB > maxY;
    };

    // 从第0层开始往上填写
    for (let rest = 1; rest <= k; rest++) {
        for (let curA = 0; curA <= maxX; curA++) {
            for (let curB = 0; curB <= maxY; curB++) {
                dp[curA][curB] =
                    (isOutOfScope(curA + 2, curB + 1)
                        ? 0
                        : prevDp[curA + 2][curB + 1]) +
                    (isOutOfScope(curA + 2, curB - 1)
                        ? 0
                        : prevDp[curA + 2][curB - 1]) +
                    (isOutOfScope(curA - 2, curB + 1)
                        ? 0
                        : prevDp[curA - 2][curB + 1]) +
                    (isOutOfScope(curA - 2, curB - 1)
                        ? 0
                        : prevDp[curA - 2][curB - 1]) +
                    (isOutOfScope(curA + 1, curB + 2)
                        ? 0
                        : prevDp[curA + 1][curB + 2]) +
                    (isOutOfScope(curA - 1, curB + 2)
                        ? 0
                        : prevDp[curA - 1][curB + 2]) +
                    (isOutOfScope(curA + 1, curB - 2)
                        ? 0
                        : prevDp[curA + 1][curB - 2]) +
                    (isOutOfScope(curA - 1, curB - 2)
                        ? 0
                        : prevDp[curA - 1][curB - 2]);
            }
        }

        prevDp = dp.slice().map((arr) => arr.slice());
    }

    return dp[a][b];
}

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
function colorProcess(
    zeros: number[][],
    i: number,
    restRedCount: number
): number {
    if (i === zeros.length) {
        return restRedCount === 0 ? 0 : -1;
    }

    // 如果restRedCount=0 则剩下所有石头都必须染成蓝色
    if (restRedCount === 0) {
        return zeros
            .slice(i)
            .reduce((acc, [, , blueCost]) => acc + blueCost, 0);
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
    const dp: number[][] = new Array(zeros.length + 1)
        .fill(0)
        .map((_) => new Array(half + 1).fill(0));

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
    let cost = zeros.reduce((acc, [redCost]) => acc + redCost, 0);

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
    const sum = arr.reduce((acc, cur) => acc + cur, 0);

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
            const p1 =
                Math.abs(rest - arr[i]) <= sum
                    ? prevDp[Math.abs(rest - arr[i])]
                    : 0;
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
    const sum = arr.reduce((acc, cur) => acc + cur, 0);

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
    let count = income.reduce((acc, [aMoney]) => acc + aMoney, 0);

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

function getMaxMoney2Process(
    income: number[][],
    i: number,
    restA: number
): number {
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
    const dp: number[][] = new Array(income.length + 1)
        .fill(0)
        .map((_) => new Array(half + 1).fill(0));

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
export function isInterleave(
    str1: string,
    str2: string,
    str3: string
): boolean {
    if (str1.length + str2.length !== str3.length) {
        return false;
    }

    // dp[i][j] str1取前i个字符，str2取前j个字符能否交错组成 str3中 前i+j个字符
    // dp[str1.length][str2.length]就是我们想要的结果
    const dp: boolean[][] = new Array(str1.length + 1)
        .fill(0)
        .map((_) => new Array(str2.length).fill(false));

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
    const dp: number[][] = new Array(word1.length + 1)
        .fill(0)
        .map((_) => new Array(word2.length + 1).fill(0));

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
            dp[i][j] = Math.min(
                dp[i - 1][j] + 1,
                dp[i - 1][j - 1] + 1,
                dp[i][j - 1] + 1
            );
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
            dp[j] = Math.min(
                prevDp[j] + 1,
                (j === 1 ? i - 1 : prevDp[j - 1]) + 1,
                (j === 1 ? i : prevDp[j - 1]) + 1
            );
            if (word1[i - 1] === word2[j - 1]) {
                dp[j] = Math.min(dp[j], j === 1 ? i - 1 : prevDp[j - 1]);
            }
        }
        prevDp = dp.slice();
    }

    return dp[word2.length];
}

/* 
https://leetcode.com/problems/perfect-squares/description/

Given an integer n, return the least number of perfect square numbers that sum to n.

A perfect square is an integer that is the square of an integer; in other words, it is the product of 
some integer with itself. For example, 1, 4, 9, and 16 are perfect squares while 3 and 11 are not.
*/
export function numSquares(n: number): number {
    const squares: number[] = [];
    const square = cache((num: number) => num * num);
    for (let i = 1; square(i) <= n; i++) {
        squares.push(square(i));
    }

    // dp[i] i最少可以由几个平方数组成
    const dp: number[] = new Array(n + 1).fill(Infinity);
    dp[0] = 0;
    dp[1] = 1;

    for (let i = 2; i <= n; i++) {
        for (let j = squares.length - 1; j >= 0; j--) {
            if (i - squares[j] >= 0) {
                dp[i] = Math.min(dp[i], dp[i - squares[j]] + 1);
            }
        }
    }

    return dp[n];
}

export function numSquares2(n: number): number {
    const squares: number[] = [];
    const square = cache((num: number) => num * num);
    for (let i = 1; square(i) <= n; i++) {
        squares.push(square(i));
    }
    if (squares[squares.length - 1] === n) {
        return 1;
    }

    // bfs
    const queue: number[] = [n];
    let level = 0;
    const visited: Set<number> = new Set([n]);
    const squaresSet = new Set(squares);
    while (queue.length > 0) {
        const current = queue.slice();
        queue.length = 0;
        level++;

        for (let i = 0; i < current.length; i++) {
            for (let j = 0; j < squares.length; j++) {
                const delta = current[i] - squares[j];
                if (squaresSet.has(delta)) {
                    return level + 1;
                } else if (delta >= 1 && !visited.has(delta)) {
                    visited.add(delta);

                    queue.push(delta);
                }
            }
        }
    }

    return level;
}

/* 
https://leetcode.com/problems/coin-change/

You are given an integer array coins representing coins of different 
denominations and an integer amount representing a total amount of money.

Return the fewest number of coins that you need to make up that amount. 
If that amount of money cannot be made up by any combination of the coins, return -1.

You may assume that you have an infinite number of each kind of coin.

1 <= coins.length <= 12
1 <= coins[i] <= 2^31 - 1
0 <= amount <= 10^4

Input: coins = [1,2,5], amount = 11
Output: 3
Explanation: 11 = 5 + 5 + 1
*/
export function coinChange(coins: number[], amount: number): number {
    const dp: Map<string, number> = new Map();
    return coinChangeProcess(coins, 0, amount, dp);
}

// i以及i以后的硬币自由选择，搞定rest最少需要多少硬币
function coinChangeProcess(
    coins: number[],
    i: number,
    rest: number,
    dp: Map<string, number>
) {
    if (rest === 0) {
        return 0;
    }
    if (i === coins.length) {
        return -1;
    }

    const id = `${i}_${rest}`;
    if (dp.has(id)) {
        return dp.get(id)!;
    }

    let min = Infinity;
    for (let k = 0; k <= Math.floor(rest / coins[i]); k++) {
        const next = coinChangeProcess(coins, i + 1, rest - k * coins[i], dp);
        if (next !== -1) {
            min = Math.min(min, next + k);
        }
    }

    dp.set(id, min === Infinity ? -1 : min);
    return dp.get(id)!;
}

export function coinChangeDp(coins: number[], amount: number): number {
    // i以及i以后的硬币自由选择，搞定rest最少需要多少硬币
    const dp: number[][] = new Array(coins.length + 1)
        .fill(0)
        .map((_) => new Array(amount + 1).fill(-1));
    for (let i = 0; i <= coins.length; i++) {
        dp[i][0] = 0;
    }

    for (let i = coins.length - 1; i >= 0; i--) {
        for (let rest = 1; rest <= amount; rest++) {
            // 通过具体实例画出依赖格子优化枚举行为
            dp[i][rest] = dp[i + 1][rest];
            if (rest >= coins[i] && dp[i][rest - coins[i]] !== -1) {
                dp[i][rest] =
                    dp[i][rest] === -1
                        ? dp[i][rest - coins[i]] + 1
                        : Math.min(dp[i][rest], dp[i][rest - coins[i]] + 1);
            }
        }
    }

    return dp[0][amount];
}

/* 
https://leetcode.com/problems/minimum-path-sum/description/
Given a m x n grid filled with non-negative numbers, find a path from top left to bottom right, 
which minimizes the sum of all numbers along its path.

Note: You can only move either down or right at any point in time.
*/
export function minPathSum(grid: number[][]): number {
    const m = grid.length;
    const n = grid[0].length;
    // dp[i][j] 从[i][j]出发到右下角的最小sum路径是多少
    const dp: number[][] = new Array(m)
        .fill(0)
        .map((_) => new Array(n).fill(0));
    dp[m - 1][n - 1] = grid[m - 1][n - 1];

    // 最后一行
    for (let j = n - 2; j >= 0; j--) {
        dp[m - 1][j] = dp[m - 1][j + 1] + grid[m - 1][j];
    }

    // 最后一列
    for (let i = m - 2; i >= 0; i--) {
        dp[i][n - 1] = dp[i + 1][n - 1] + grid[i][n - 1];
    }

    for (let i = m - 2; i >= 0; i--) {
        for (let j = n - 2; j >= 0; j--) {
            dp[i][j] = grid[i][j] + Math.min(dp[i][j + 1], dp[i + 1][j]);
        }
    }

    return dp[0][0];
}

/* 
https://leetcode.com/problems/triangle/description/

Given a triangle array, return the minimum path sum from top to bottom.

For each step, you may move to an adjacent number of the row below. More formally, 
if you are on index i on the current row, you may move to either index i or index i + 1 on the next row.

Input: triangle = [[2],[3,4],[6,5,7],[4,1,8,3]]
Output: 11
Explanation: The triangle looks like:
   2
  3 4
 6 5 7
4 1 8 3
The minimum path sum from top to bottom is 2 + 3 + 5 + 1 = 11 (underlined above).
*/
// 从最后一行开始分析，最后一行的最短路径和就是自己，然后倒数第二行，倒数第三行
export function minimumTotal(triangle: number[][]): number {
    // dp[row][i] row行i列的最短路径和
    const dp = new Array(triangle.length + 1)
        .fill(0)
        .map((_) =>
            new Array(triangle[triangle.length - 1].length + 1).fill(0)
        );

    // 从下到上，从左到右填表
    for (let row = triangle.length - 1; row >= 0; row--) {
        for (let i = 0; i < triangle[row].length; i++) {
            dp[row][i] =
                Math.min(dp[row + 1][i], dp[row + 1][i + 1]) + triangle[row][i];
        }
    }

    return dp[0][0];
}

// 空间压缩
export function minimumTotal2(triangle: number[][]): number {
    // dp[row][i] row行i列的最短路径和
    const dp = new Array(triangle[triangle.length - 1].length + 1).fill(0);

    // 从下到上，从左到右填表
    for (let row = triangle.length - 1; row >= 0; row--) {
        for (let i = 0; i < triangle[row].length; i++) {
            dp[i] = Math.min(dp[i], dp[i + 1]) + triangle[row][i];
        }
    }

    return dp[0];
}

// 直接更改原数组
export function minimumTotal3(triangle: number[][]): number {
    for (let i = triangle.length - 2; i >= 0; i--) {
        for (let j = 0; j < triangle[i].length; j++) {
            triangle[i][j] += Math.min(
                triangle[i + 1][j],
                triangle[i + 1][j + 1]
            );
        }
    }

    return triangle[0][0];
}

/* 
https://leetcode.com/problems/partition-array-for-maximum-sum/description/?envType=daily-question&envId=2024-02-03
1043. Partition Array for Maximum Sum
Given an integer array arr, partition the array into (contiguous) subarrays of length at most k. After partitioning, each subarray has their values changed to become the maximum value of that subarray.

Return the largest sum of the given array after partitioning. Test cases are generated so that the answer fits in a 32-bit integer.

Example 1:

Input: arr = [1,15,7,9,2,5,10], k = 3
Output: 84
Explanation: arr becomes [15,15,15,9,10,10,10]

Example 2:

Input: arr = [1,4,1,5,7,3,6,1,9,9,3], k = 4
Output: 83

Example 3:

Input: arr = [1], k = 1
Output: 1

Constraints:

	1 <= arr.length <= 500
	0 <= arr[i] <= 109
	1 <= k <= arr.length
*/
export function maxSumAfterPartitioning(arr: number[], k: number): number {
    // dp[i] arr[0]-arr[i] 范围内的最大和
    const dp: number[] = new Array(arr.length);
    dp[0] = arr[0];

    for (let i = 1; i < arr.length; i++) {
        let max = -Infinity;
        let maxNum = -Infinity;
        for (let j = i; j > i - k && j >= 0; j--) {
            if (arr[j] > maxNum) {
                maxNum = arr[j];
            }

            const prev = j - 1 >= 0 ? dp[j - 1] : 0;
            const cand = prev + maxNum * (i - j + 1);
            if (max < cand) {
                max = cand;
            }
        }
        dp[i] = max;
    }

    return dp[arr.length - 1];
}

/*
https://leetcode.com/problems/longest-non-decreasing-subarray-from-two-arrays/description/
2771. Longest Non-decreasing Subarray From Two Arrays
You are given two 0-indexed integer arrays nums1 and nums2 of length n.

Let's define another 0-indexed integer array, nums3, of length n. For each index i in the range [0, n - 1], you can 
assign either nums1[i] or nums2[i] to nums3[i].

Your task is to maximize the length of the longest non-decreasing subarray in nums3 by choosing its values optimally.

Return an integer representing the length of the longest non-decreasing subarray in nums3.

Note: A subarray is a contiguous non-empty sequence of elements within an array.

Example 1:

Input: nums1 = [2,3,1], nums2 = [1,2,1]
Output: 2
Explanation: One way to construct nums3 is: 
nums3 = [nums1[0], nums2[1], nums2[2]] => [2,2,1]. 
The subarray starting from index 0 and ending at index 1, [2,2], forms a non-decreasing subarray of length 2. 
We can show that 2 is the maximum achievable length.

Example 2:

Input: nums1 = [1,3,2,1], nums2 = [2,2,3,4]
Output: 4
Explanation: One way to construct nums3 is: 
nums3 = [nums1[0], nums2[1], nums2[2], nums2[3]] => [1,2,3,4]. 
The entire array forms a non-decreasing subarray of length 4, making it the maximum achievable length.

Example 3:

Input: nums1 = [1,1], nums2 = [2,2]
Output: 2
Explanation: One way to construct nums3 is: 
nums3 = [nums1[0], nums1[1]] => [1,1]. 
The entire array forms a non-decreasing subarray of length 2, making it the maximum achievable length.

Constraints:

	1 <= nums1.length == nums2.length == n <= 10^5
	1 <= nums1[i], nums2[i] <= 10^9
*/
export function maxNonDecreasingLength(
    nums1: number[],
    nums2: number[]
): number {
    const dp1: number[] = Array(nums1.length).fill(1);
    const dp2: number[] = Array(nums2.length).fill(1);

    let max = 1;
    for (let i = 1; i < nums1.length; i++) {
        if (nums1[i] >= nums1[i - 1]) {
            dp1[i] = dp1[i - 1] + 1;
        }
        if (nums1[i] >= nums2[i - 1]) {
            dp1[i] = Math.max(dp1[i], dp2[i - 1] + 1);
        }
        if (nums2[i] >= nums2[i - 1]) {
            dp2[i] = dp2[i - 1] + 1;
        }
        if (nums2[i] >= nums1[i - 1]) {
            dp2[i] = Math.max(dp2[i], dp1[i - 1] + 1);
        }

        max = Math.max(max, dp1[i], dp2[i]);
    }

    return max;
}

/*
https://leetcode.com/problems/extra-characters-in-a-string/description/?envType=problem-list-v2&envId=o5cftq05
2707. Extra Characters in a String
You are given a 0-indexed string s and a dictionary of words dictionary. You have to break s into one or more non-overlapping substrings such that each substring is present in dictionary. There may be some extra characters in s which are not present in any of the substrings.

Return the minimum number of extra characters left over if you break up s optimally.

Example 1:

Input: s = "leetscode", dictionary = ["leet","code","leetcode"]
Output: 1
Explanation: We can break s in two substrings: "leet" from index 0 to 3 and "code" from index 5 to 8. There is only 1 unused character (at index 4), so we return 1.

Example 2:

Input: s = "sayhelloworld", dictionary = ["hello","world"]
Output: 3
Explanation: We can break s in two substrings: "hello" from index 3 to 7 and "world" from index 8 to 12. The characters at indices 0, 1, 2 are not used in any substring and thus are considered as extra characters. Hence, we return 3.

Constraints:

	1 <= s.length <= 50
	1 <= dictionary.length <= 50
	1 <= dictionary[i].length <= 50
	dictionary[i] and s consists of only lowercase English letters
	dictionary contains distinct words
*/
export function minExtraChar(s: string, dictionary: string[]): number {
    const n = s.length;
    const dp: number[] = Array(n + 1).fill(0);
    const set = new Set(dictionary);

    for (let i = 1; i <= n; i++) {
        dp[i] = dp[i - 1] + (set.has(s[i - 1]) ? 0 : 1);
        for (let j = i - 1; j >= 0; j--) {
            dp[i] = Math.min(
                dp[i],
                dp[j] + (set.has(s.slice(j, i)) ? 0 : i - j + 1)
            );
        }
    }

    return dp[n];
}

/*
https://leetcode.com/problems/maximum-number-of-points-with-cost/description/?envType=daily-question&envId=2024-08-17
1937. Maximum Number of Points with Cost
You are given an m x n integer matrix points (0-indexed). Starting with 0 points, you want to maximize the number of points you can get from the matrix.

To gain points, you must pick one cell in each row. Picking the cell at coordinates (r, c) will add points[r][c] to your score.

However, you will lose points if you pick a cell too far from the cell that you picked in the previous row. For every two adjacent rows r and r + 1 (where 0 <= r < m - 1), picking cells at coordinates (r, c1) and (r + 1, c2) will subtract abs(c1 - c2) from your score.

Return the maximum number of points you can achieve.

abs(x) is defined as:

	x for x >= 0.
	-x for x < 0.

Example 1: 

Input: points = [[1,2,3],[1,5,1],[3,1,1]]
Output: 9
Explanation:
The blue cells denote the optimal cells to pick, which have coordinates (0, 2), (1, 1), and (2, 0).
You add 3 + 5 + 3 = 11 to your score.
However, you must subtract abs(2 - 1) + abs(1 - 0) = 2 from your score.
Your final score is 11 - 2 = 9.

Example 2:

Input: points = [[1,5],[2,3],[4,2]]
Output: 11
Explanation:
The blue cells denote the optimal cells to pick, which have coordinates (0, 1), (1, 1), and (2, 0).
You add 5 + 3 + 4 = 12 to your score.
However, you must subtract abs(1 - 1) + abs(1 - 0) = 1 from your score.
Your final score is 12 - 1 = 11.

Constraints:

	m == points.length
	n == points[r].length
	1 <= m, n <= 10^5
	1 <= m * n <= 10^5
	0 <= points[r][c] <= 10^5
*/
export function maxPoints(points: number[][]): number {
    const m = points.length;
    const n = points[0].length;
    const dp = points[0].slice();

    for (let i = 1; i < m; i++) {
        const leftDp = new Array(n).fill(0);
        const rightDp = new Array(n).fill(0);

        leftDp[0] = dp[0];
        for (let j = 1; j < n; j++) {
            leftDp[j] = Math.max(leftDp[j - 1] - 1, dp[j]);
        }

        rightDp[n - 1] = dp[n - 1];
        for (let j = n - 2; j >= 0; j--) {
            rightDp[j] = Math.max(rightDp[j + 1] - 1, dp[j]);
        }

        for (let j = 0; j < n; j++) {
            dp[j] = points[i][j] + Math.max(leftDp[j], rightDp[j]);
        }
    }

    return Math.max(...dp);
}

/**
 *   王强决定把年终奖用于购物，他把想买的物品分为两类：主件与附件，附件是从属于某个主件的，下表就是一些主件与附件的例子：
 * 主件             附件
 * 电脑             打印机，扫描仪
 * 书柜             图书
 * 书桌             台灯，文具
 * 工作椅             无
 *
 * 如果要买归类为附件的物品，必须先买该附件所属的主件，且每件物品只能购买一次。
 * 每个主件可以有 0 个、 1 个或 2 个附件。附件不再有从属于自己的附件。
 * 王强查到了每件物品的价格（都是 10 元的整数倍），而他只有 N 元的预算。除此之外，
 * 他给每件物品规定了一个重要度，用整数 1 ~ 5 表示。他希望在花费不超过 N 元的前提下，使自己的满意度达到最大。
 *
 * 满意度是指所购买的每件物品的价格与重要度的乘积的总和，假设设第iii件物品的价格为v[i]v[i]v[i]，
 * 重要度为w[i]w[i]w[i]，共选中了kkk件物品，编号依次为j1,j2,...,jkj_1,j_2,...,j_kj1​,j2​,...,jk​，
 * 则满意度为：v[j1]∗w[j1]+v[j2]∗w[j2]+…+v[jk]∗w[jk]v[j_1]*w[j_1]+v[j_2]*w[j_2]+ …
 * +v[j_k]*w[j_k]v[j1​]∗w[j1​]+v[j2​]∗w[j2​]+…+v[jk​]∗w[jk​]。（其中 * 为乘号）
 *
 * 请你帮助王强计算可获得的最大的满意度。
 */
type Goods = Array<[price: number, w: number, belong: number]>;

export function getMaxSatisfaction(money: number, goods: Goods) {
    const follows: number[][] = Array.from({ length: goods.length }, () => []);
    goods.forEach(([, , belong], i) => {
        if (belong !== 0) {
            follows[belong - 1].push(i);
        }
    });

    const dp: number[] = Array(money + 1).fill(0);
    for (let i = 0; i < goods.length; i++) {
        const [price, w, belong] = goods[i];
        if (belong === 0) {
            for (let j = money; j >= price; j--) {
                // 只要当前主件
                dp[j] = Math.max(dp[j], dp[j - price] + price * w);

                const f1 = follows[i].length > 0 ? goods[follows[i][0]] : null;
                const f2 = follows[i].length > 1 ? goods[follows[i][1]] : null;

                // 主件+附件1
                if (f1 !== null && j >= price + f1[0]) {
                    dp[j] = Math.max(
                        dp[j],
                        dp[j - price - f1[0]] + price * w + f1[0] * f1[1]
                    );
                }

                // 主件+附件2
                if (f2 !== null && j >= price + f2[0]) {
                    dp[j] = Math.max(
                        dp[j],
                        dp[j - price - f2[0]] + price * w + f2[0] * f2[1]
                    );
                }

                // 主件+所有附件
                if (f1 !== null && f2 !== null && j >= price + f1[0] + f2[0]) {
                    dp[j] = Math.max(
                        dp[j],
                        dp[j - price - f1[0] - f2[0]] +
                            price * w +
                            f1[0] * f1[1] +
                            f2[0] * f2[1]
                    );
                }
            }
        }
    }

    return dp[money];
}

/*
https://www.nowcoder.com/practice/6d9d69e3898f45169a441632b325c7b4?tpId=37&tags=&title=&difficulty=3&judgeStatus=0&rp=1&sourceUrl=%2Fexam%2Foj%2Fta%3Fpage%3D1%26tpId%3D37%26type%3D37
HJ24 合唱队

描述：
  N 位同学站成一排，音乐老师要请最少的同学出列，使得剩下的 K 位同学排成合唱队形。
  设KK位同学从左到右依次编号为 1，2…，K ，他们的身高分别为T1,T2,…,TKT_1,T_2,…,T_KT1​,T2​,…,TK​ ，若存在i(1≤i≤K)i(1\leq i\leq K)i(1≤i≤K) 使得T1<T2<......<Ti−1<TiT_1<T_2<......<T_{i-1}<T_iT1​<T2​<......<Ti−1​<Ti​ 且 Ti>Ti+1>......>TKT_i>T_{i+1}>......>T_KTi​>Ti+1​>......>TK​，则称这KKK名同学排成了合唱队形。
  通俗来说，能找到一个同学，他的两边的同学身高都依次严格降低的队形就是合唱队形。
  例子：
  123 124 125 123 121 是一个合唱队形
  123 123 124 122不是合唱队形，因为前两名同学身高相等，不符合要求
  123 122 121 122不是合唱队形，因为找不到一个同学，他的两侧同学身高递减。
  你的任务是，已知所有N位同学的身高，计算最少需要几位同学出列，可以使得剩下的同学排成合唱队形。
  注意：不允许改变队列元素的先后顺序 且 不要求最高同学左右人数必须相等
  数据范围： 1≤n≤3000 1≤n≤3000
    
输入描述：
  用例两行数据，第一行是同学的总数 N ，第二行是 N 位同学的身高，以空格隔开

输出描述：
  最少需要几位同学出列

示例：
输入：
  8
  186 186 150 200 160 130 197 200
输出：
  4
*/
export function getMinRemoved(heights: number[]) {
    const n = heights.length;
    // 以 i 结尾的最长递增子序列长度
    const leftDp: number[] = Array(n).fill(1);
    for (let i = 0; i < n; i++) {
        for (let j = i - 1; j >= 0; j--) {
            if (heights[j] < heights[i]) {
                leftDp[i] = Math.max(leftDp[i], leftDp[j] + 1);
            }
        }
    }

    // 以 i 开头的最长递减子序列长度
    const rightDp: number[] = Array(n).fill(1);
    for (let i = n - 1; i >= 0; i--) {
        for (let j = i + 1; j < n; j++) {
            if (heights[j] < heights[i]) {
                rightDp[i] = Math.max(rightDp[i], rightDp[j] + 1);
            }
        }
    }

    let max = 1;
    for (let i = 0; i < n; i++) {
        max = Math.max(max, leftDp[i] + rightDp[i] - 1);
    }

    return n - max;
}

/*
https://leetcode.com/problems/minimum-cost-for-tickets/description/
983. Minimum Cost For Tickets
You have planned some train traveling one year in advance. The days of the year in which you will travel are given as an integer array days. Each day is an integer from 1 to 365.

Train tickets are sold in three different ways:

	a 1-day pass is sold for costs[0] dollars,
	a 7-day pass is sold for costs[1] dollars, and
	a 30-day pass is sold for costs[2] dollars.

The passes allow that many days of consecutive travel.

	For example, if we get a 7-day pass on day 2, then we can travel for 7 days: 2, 3, 4, 5, 6, 7, and 8.

Return the minimum number of dollars you need to travel every day in the given list of days.

Example 1:

Input: days = [1,4,6,7,8,20], costs = [2,7,15]
Output: 11
Explanation: For example, here is one way to buy passes that lets you travel your travel plan:
On day 1, you bought a 1-day pass for costs[0] = $2, which covered day 1.
On day 3, you bought a 7-day pass for costs[1] = $7, which covered days 3, 4, ..., 9.
On day 20, you bought a 1-day pass for costs[0] = $2, which covered day 20.
In total, you spent $11 and covered all the days of your travel.

Example 2:

Input: days = [1,2,3,4,5,6,7,8,9,10,30,31], costs = [2,7,15]
Output: 17
Explanation: For example, here is one way to buy passes that lets you travel your travel plan:
On day 1, you bought a 30-day pass for costs[2] = $15 which covered days 1, 2, ..., 30.
On day 31, you bought a 1-day pass for costs[0] = $2 which covered day 31.
In total, you spent $17 and covered all the days of your travel.

Constraints:

	1 <= days.length <= 365
	1 <= days[i] <= 365
	days is in strictly increasing order.
	costs.length == 3
	1 <= costs[i] <= 1000
*/
export function mincostTickets(days: number[], costs: number[]): number {
    const durations = [1, 7, 30];

    // 搞定 i 以及 i 之后的旅行最少需要多少钱
    const dfs = cache((index: number): number => {
        if (index === days.length) {
            return 0;
        }

        let min = Infinity;
        durations.forEach((v, i) => {
            const target = v + days[index];
            let next = index + 1;
            while (next < days.length && target > days[next]) {
                next++;
            }

            min = Math.min(min, costs[i] + dfs(next));
        });

        return min;
    });

    return dfs(0);
}

export function mincostTickets2(days: number[], costs: number[]): number {
    const durations = [1, 7, 30];

    const dp: number[] = Array(days.length + 1).fill(Infinity);
    dp[days.length] = 0;

    for (let i = days.length - 1; i >= 0; i--) {
        durations.forEach((v, innerI) => {
            const target = v + days[i];
            let next = i + 1;
            while (next < days.length && target > days[next]) {
                next++;
            }
            dp[i] = Math.min(dp[i], dp[next] + costs[innerI]);
        });
    }

    return dp[0];
}

/*
https://leetcode.com/problems/can-i-win/description/?envType=problem-list-v2&envId=dynamic-programming
464. Can I Win
In the "100 game" two players take turns adding, to a running total, any integer from 1 to 10. The player who first causes the running total to reach or exceed 100 wins.

What if we change the game so that players cannot re-use integers?

For example, two players might take turns drawing from a common pool of numbers from 1 to 15 without replacement until they reach a total >= 100.

Given two integers maxChoosableInteger and desiredTotal, return true if the first player to move can force a win, otherwise, return false. Assume both players play optimally.

Example 1:

Input: maxChoosableInteger = 10, desiredTotal = 11
Output: false
Explanation:
No matter which integer the first player choose, the first player will lose.
The first player can choose an integer from 1 up to 10.
If the first player choose 1, the second player can only choose integers from 2 up to 10.
The second player will win by choosing 10 and get a total = 11, which is >= desiredTotal.
Same with other integers chosen by the first player, the second player will always win.

Example 2:

Input: maxChoosableInteger = 10, desiredTotal = 0
Output: true

Example 3:

Input: maxChoosableInteger = 10, desiredTotal = 1
Output: true

Constraints:

	1 <= maxChoosableInteger <= 20
	0 <= desiredTotal <= 300
*/
export function canIWin(
    maxChoosableInteger: number,
    desiredTotal: number
): boolean {
    const sum = ((1 + maxChoosableInteger) * maxChoosableInteger) / 2;
    if (sum < desiredTotal) {
        return false;
    }

    const visited: boolean[] = Array(1 << 20);
    const dfs = (state: number, rest: number): boolean => {
        if (visited[state] !== undefined) {
            return visited[state];
        }

        for (let i = 0; i < maxChoosableInteger; i++) {
            if ((state >> i) & 1) {
                continue;
            }
            if (
                i + 1 >= rest ||
                dfs(state | (1 << i), rest - i - 1) === false
            ) {
                visited[state] = true;
                return true;
            }
        }

        visited[state] = false;
        return false;
    };

    return dfs(0, desiredTotal);
}

/*
https://leetcode.com/problems/maximum-profit-in-job-scheduling/description/
1235. Maximum Profit in Job Scheduling
We have n jobs, where every job is scheduled to be done from startTime[i] to endTime[i], obtaining a profit of profit[i].

You're given the startTime, endTime and profit arrays, return the maximum profit you can take such that there are no two jobs in the subset with overlapping time range.

If you choose a job that ends at time X you will be able to start another job that starts at time X.

Example 1:

Input: startTime = [1,2,3,3], endTime = [3,4,5,6], profit = [50,10,40,70]
Output: 120
Explanation: The subset chosen is the first and fourth job. 
Time range [1-3]+[3-6] , we get profit of 120 = 50 + 70.

Example 2:

Input: startTime = [1,2,3,4,6], endTime = [3,5,10,6,9], profit = [20,20,100,70,60]
Output: 150
Explanation: The subset chosen is the first, fourth and fifth job. 
Profit obtained 150 = 20 + 70 + 60.

Example 3:

Input: startTime = [1,1,1], endTime = [2,3,4], profit = [5,6,4]
Output: 6

Constraints:

	1 <= startTime.length == endTime.length == profit.length <= 10^4
	1 <= startTime[i] < endTime[i] <= 10^9
	1 <= profit[i] <= 10^4
*/
export function jobScheduling(
    startTime: number[],
    endTime: number[],
    profit: number[]
): number {
    const n = startTime.length;
    const jobs: number[][] = startTime
        .map((s, i) => [s, endTime[i], profit[i]])
        .sort((a, b) => a[1] - b[1]);

    const dp: number[] = Array(n);
    dp[0] = jobs[0][2];

    for (let i = 1; i < n; i++) {
        let left = 0;
        let right = i - 1;
        let closest = -1;
        while (left <= right) {
            const mid = left + ((right - left) >> 1);
            if (jobs[mid][1] <= jobs[i][0]) {
                closest = mid;
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }

        dp[i] = Math.max(dp[i - 1], (dp[closest] ?? 0) + jobs[i][2]);
    }

    return dp[n - 1];
}

/*
https://leetcode.com/problems/maximum-energy-boost-from-two-drinks/description/
3259. Maximum Energy Boost From Two Drinks
You are given two integer arrays energyDrinkA and energyDrinkB of the same length n by a futuristic sports scientist. These arrays represent the energy boosts per hour provided by two different energy drinks, A and B, respectively.

You want to maximize your total energy boost by drinking one energy drink per hour. However, if you want to switch from consuming one energy drink to the other, you need to wait for one hour to cleanse your system (meaning you won't get any energy boost in that hour).

Return the maximum total energy boost you can gain in the next n hours.

Note that you can start consuming either of the two energy drinks.

Example 1:

Input: energyDrinkA = [1,3,1], energyDrinkB = [3,1,1]

Output: 5

Explanation:

To gain an energy boost of 5, drink only the energy drink A (or only B).

Example 2:

Input: energyDrinkA = [4,1,1], energyDrinkB = [1,1,3]

Output: 7

Explanation:

To gain an energy boost of 7:

	Drink the energy drink A for the first hour.
	Switch to the energy drink B and we lose the energy boost of the second hour.
	Gain the energy boost of the drink B in the third hour.

Constraints:

	n == energyDrinkA.length == energyDrinkB.length
	3 <= n <= 10^5
	1 <= energyDrinkA[i], energyDrinkB[i] <= 10^5
*/
export function maxEnergyBoost(
    energyDrinkA: number[],
    energyDrinkB: number[]
): number {
    let prevZero = 0;
    let prevA = 0;
    let prevB = 0;

    let nextZero = 0;
    let nextA = 0;
    let nextB = 0;

    for (let i = 1; i <= energyDrinkA.length; i++) {
        nextZero = Math.max(prevA, prevB);
        nextA = Math.max(prevZero, prevA) + energyDrinkA[i - 1];
        nextB = Math.max(prevZero, prevB) + energyDrinkB[i - 1];

        prevZero = nextZero;
        prevA = nextA;
        prevB = nextB;
    }

    return Math.max(nextZero, nextA, nextB);
}

/*
https://leetcode.com/problems/number-of-ways-to-form-a-target-string-given-a-dictionary/description/
1639. Number of Ways to Form a Target String Given a Dictionary
You are given a list of strings of the same length words and a string target.

Your task is to form target using the given words under the following rules:

	target should be formed from left to right.
	To form the ith character (0-indexed) of target, you can choose the kth character of the jth string in words if target[i] = words[j][k].
	Once you use the kth character of the jth string of words, you can no longer use the xth character of any string in words where x <= k. In other words, all characters to the left of or at index k become unusuable for every string.
	Repeat the process until you form the string target.

Notice that you can use multiple characters from the same string in words provided the conditions above are met.

Return the number of ways to form target from words. Since the answer may be too large, return it modulo 109 + 7.

Example 1:

Input: words = ["acca","bbbb","caca"], target = "aba"
Output: 6
Explanation: There are 6 ways to form target.
"aba" -> index 0 ("acca"), index 1 ("bbbb"), index 3 ("caca")
"aba" -> index 0 ("acca"), index 2 ("bbbb"), index 3 ("caca")
"aba" -> index 0 ("acca"), index 1 ("bbbb"), index 3 ("acca")
"aba" -> index 0 ("acca"), index 2 ("bbbb"), index 3 ("acca")
"aba" -> index 1 ("caca"), index 2 ("bbbb"), index 3 ("acca")
"aba" -> index 1 ("caca"), index 2 ("bbbb"), index 3 ("caca")

Example 2:

Input: words = ["abba","baab"], target = "bab"
Output: 4
Explanation: There are 4 ways to form target.
"bab" -> index 0 ("baab"), index 1 ("baab"), index 2 ("abba")
"bab" -> index 0 ("baab"), index 1 ("baab"), index 3 ("baab")
"bab" -> index 0 ("baab"), index 2 ("baab"), index 3 ("baab")
"bab" -> index 1 ("abba"), index 2 ("baab"), index 3 ("baab")

Constraints:

	1 <= words.length <= 1000
	1 <= words[i].length <= 1000
	All strings in words have the same length.
	1 <= target.length <= 1000
	words[i] and target contain only lowercase English letters.
*/
export function numWays(words: string[], target: string): number {
    const n = words[0].length;
    const m = target.length;
    const mod = 1e9 + 7;

    const freqs = Array.from({ length: n }, () => ({}));
    for (let i = 0; i < n; i++) {
        const freq = freqs[i];
        words.forEach((word) => {
            freq[word[i]] = (freq[word[i]] ?? 0) + 1;
        });
    }

    const dp: number[] = Array(m + 1).fill(0);
    dp[m] = 1;

    for (let i = n - 1; i >= 0; i--) {
        for (let j = 0; j < m; j++) {
            if (freqs[i][target[j]]) {
                dp[j] =
                    (((freqs[i][target[j]] * dp[j + 1]) % mod) +
                        (dp[j] % mod)) %
                    mod;
            }
        }
    }

    return dp[0];
}
