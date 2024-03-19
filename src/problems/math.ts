/* 
https://leetcode.com/problems/numbers-at-most-n-given-digit-set/

Given an array of digits which is sorted in non-decreasing order. You can write numbers using each digits[i] 
as many times as we want. For example, if digits = ['1','3','5'], we may write numbers such as '13', '551', and '1351315'.

Return the number of positive integers that can be generated that are less than or equal to a given integer n.
*/
export function atMostNGivenDigitSet(digits: string[], n: number): number {
    if (n === 0) {
        return 0;
    }

    const digitsOfN: number[] = [];
    while (n) {
        digitsOfN.unshift(n % 10);
        n = parseInt(`${n / 10}`);
    }

    // 假设n是个三位数，则两位数和一位数里面数字可以自由选择
    // 两位数和一位数的总和就是 len^2 + len;
    let count = 0;
    let i = digitsOfN.length - 1;
    while (i) {
        count += Math.pow(digits.length, i--);
    }

    count += atNGivenDigitSet(digits, digitsOfN);

    return count;
}

function atNGivenDigitSet(digits: string[], digitsOfN: number[]): number {
    let count = 0;
    const [closestMin, found] = getClosestMinAndFoundFlag(digits, digitsOfN[0]);

    // 首位在digits中，比如说 [1,3,5] 199
    // 那么我们只需要固定第一位，然后看 1xx 有多少种选择即可
    // 交给递归来处理
    if (found) {
        if (digitsOfN.length > 1) {
            count += atNGivenDigitSet(digits, digitsOfN.slice(1));
        } else {
            count += 1;
        }
    }

    // 首位不在digits中，比如说 [1,3,5] 299
    if (closestMin !== null) {
        count +=
            (closestMin + 1) * Math.pow(digits.length, digitsOfN.length - 1);
    }

    return count;
}

function getClosestMinAndFoundFlag(
    digits: string[],
    target: number
): [closestMin: number | null, found: boolean] {
    let left = 0;
    let right = digits.length - 1;
    let closestMin: number | null = null;
    let found = false;
    while (left <= right) {
        const mid = left + ((right - left) >> 1);
        if (+digits[mid] === target) {
            found = true;
            right = mid - 1;
        } else if (+digits[mid] > target) {
            right = mid - 1;
        } else {
            closestMin = mid;
            left = mid + 1;
        }
    }

    return [closestMin, found];
}

/*
https://leetcode.com/problems/moving-stones-until-consecutive/description/
1033. Moving Stones Until Consecutive
There are three stones in different positions on the X-axis. You are given three integers a, b, and c, the positions of the stones.

In one move, you pick up a stone at an endpoint (i.e., either the lowest or highest position stone), 
and move it to an unoccupied position between those endpoints. Formally, let's say the stones are currently at positions x, y, and z with x < y < z. 
You pick up the stone at either position x or position z, and move that stone to an integer position k, with x < k < z and k != y.

The game ends when you cannot make any more moves (i.e., the stones are in three consecutive positions).

Return an integer array answer of length 2 where:

	answer[0] is the minimum number of moves you can play, and
	answer[1] is the maximum number of moves you can play.

Example 1:

Input: a = 1, b = 2, c = 5
Output: [1,2]
Explanation: Move the stone from 5 to 3, or move the stone from 5 to 4 to 3.

Example 2:

Input: a = 4, b = 3, c = 2
Output: [0,0]
Explanation: We cannot make any moves.

Example 3:

Input: a = 3, b = 5, c = 1
Output: [1,2]
Explanation: Move the stone from 1 to 4; or move the stone from 1 to 2 to 4.

Constraints:

	1 <= a, b, c <= 100
	a, b, and c have different values.
*/
export function numMovesStones(a: number, b: number, c: number): number[] {
    let min = Math.min(a, b, c);
    let max = Math.max(a, b, c);
    let mid = a + b + c - min - max;

    const minMoves =
        max - min === 2
            ? 0
            : mid - min === 2 ||
              max - mid === 2 ||
              mid - min === 1 ||
              max - mid === 1
            ? 1
            : 2;
    const maxMoves = max - min - 2;

    return [minMoves, maxMoves];
}

/*
https://leetcode.com/problems/minimum-number-of-groups-to-create-a-valid-assignment/description/
2910. Minimum Number of Groups to Create a Valid Assignment
You are given a collection of numbered balls and instructed to sort them into boxes for a nearly balanced distribution. There are two rules you must follow:

	Balls with the same box must have the same value. But, if you have more than one ball with the same number, you can put them in different boxes.
	The biggest box can only have one more ball than the smallest box.

​Return the fewest number of boxes to sort these balls following these rules.

Example 1: 

Input:   balls = [3,2,3,2,3] 

Output:   2 

Explanation:

We can sort balls into boxes as follows:

	[3,3,3]
	[2,2]

The size difference between the two boxes doesn't exceed one.

Example 2: 

Input:   balls = [10,10,10,3,1,1] 

Output:   4 

Explanation:

We can sort balls into boxes as follows:

	[10]
	[10,10]
	[3]
	[1,1]

You can't use fewer than four boxes while still following the rules. For example, putting all three balls numbered 10 in one box would break the rule about the maximum size difference between boxes.

Constraints:

	1 <= nums.length <= 10^5
	1 <= nums[i] <= 10^9
*/
export function minGroupsForValidAssignment(balls: number[]): number {
    const repeatTimes: Record<number, number> = {};
    balls.forEach((v) => {
        repeatTimes[v] = (repeatTimes[v] || 0) + 1;
    });

    const times = Object.values(repeatTimes).sort((a, b) => a - b);
    const len = times.length;
    let min = times[0];
    let i = 0;
    let count = 0;
    while (i < len) {
        const cur = times[i];
        const t = Math.ceil(cur / (min + 1));
        const rest = t * (min + 1) - cur;

        if (rest > t) {
            const half = cur >> 1;
            min = cur - half < min ? cur - half : min - 1;
            i = 0;
            count = 0;
            continue;
        }

        count += t;
        i++;
    }

    return count;
}
