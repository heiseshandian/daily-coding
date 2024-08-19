import { cache } from '../design-pattern/proxy';
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

/*
https://leetcode.com/problems/distribute-candies-among-children-i/description/
2928. Distribute Candies Among Children I
You are given two positive integers n and limit.

Return the total number of ways to distribute n candies among 3 children such that no child gets more than limit candies.

Example 1:

Input: n = 5, limit = 2
Output: 3
Explanation: There are 3 ways to distribute 5 candies such that no child gets more than 2 candies: (1, 2, 2), (2, 1, 2) and (2, 2, 1).

Example 2:

Input: n = 3, limit = 3
Output: 10
Explanation: There are 10 ways to distribute 3 candies such that no child gets more than 3 candies: (0, 0, 3), (0, 1, 2), (0, 2, 1), (0, 3, 0), (1, 0, 2), (1, 1, 1), (1, 2, 0), (2, 0, 1), (2, 1, 0) and (3, 0, 0).

Constraints:

	1 <= n <= 50
	1 <= limit <= 50
*/
export function distributeCandies(n: number, limit: number): number {
    let count = 0;
    let first = 0;
    let second = 0;
    while (first <= limit) {
        second = 0;
        while (second <= limit && second <= n - first) {
            if (n - first - second <= limit) {
                count++;
            }

            second++;
        }

        first++;
    }

    return count;
}

/*
https://leetcode.com/problems/prime-subtraction-operation/
2601. Prime Subtraction Operation
You are given a 0-indexed integer array nums of length n.

You can perform the following operation as many times as you want:

	Pick an index i that you haven’t picked before, and pick a prime p strictly less than nums[i], then subtract p from nums[i].

Return true if you can make nums a strictly increasing array using the above operation and false otherwise.

A strictly increasing array is an array whose each element is strictly greater than its preceding element.

Example 1:

Input: nums = [4,9,6,10]
Output: true
Explanation: In the first operation: Pick i = 0 and p = 3, and then subtract 3 from nums[0], so that nums becomes [1,9,6,10].
In the second operation: i = 1, p = 7, subtract 7 from nums[1], so nums becomes equal to [1,2,6,10].
After the second operation, nums is sorted in strictly increasing order, so the answer is true.

Example 2:

Input: nums = [6,8,11,12]
Output: true
Explanation: Initially nums is sorted in strictly increasing order, so we don't need to make any operations.

Example 3:

Input: nums = [5,8,3]
Output: false
Explanation: It can be proven that there is no way to perform operations to make nums sorted in strictly increasing order, so the answer is false.

Constraints:

	1 <= nums.length <= 1000
	1 <= nums[i] <= 1000
	nums.length == n
*/
export function primeSubOperation(nums: number[]): boolean {
    const primes = getPrimes(Math.max(...nums));
    nums[0] -= getBiggestPrime(primes, nums[0]) || 0;

    let i = 1;
    while (i < nums.length) {
        let p = getBiggestPrime(primes, nums[i]);
        while (p && nums[i] - p <= nums[i - 1]) {
            p = getBiggestPrime(primes, p);
        }
        nums[i] -= p || 0;

        if (nums[i] <= nums[i - 1]) {
            return false;
        }
        i++;
    }

    return true;
}

export function getBiggestPrime(primes: number[], limit: number) {
    let l = 0;
    let r = primes.length - 1;
    let biggest: number | null = null;
    while (l <= r) {
        const mid = l + ((r - l) >> 1);
        if (primes[mid] < limit) {
            biggest = primes[mid];
            l = mid + 1;
        } else {
            r = mid - 1;
        }
    }

    return biggest;
}

export function getPrimes(limit: number): number[] {
    const primes: boolean[] = Array(limit + 1).fill(true);
    primes[0] = false;
    primes[1] = false;

    for (let n = 2; n * n <= limit; n++) {
        if (primes[n]) {
            for (let m = n * n; m <= limit; m += n) {
                primes[m] = false;
            }
        }
    }

    return primes.reduce((acc, val, index) => {
        if (val) acc.push(index);
        return acc;
    }, [] as number[]);
}

/*
https://leetcode.com/problems/apply-operations-to-make-sum-of-array-greater-than-or-equal-to-k/description/?envType=list&envId=o5cftq05
3091. Apply Operations to Make Sum of Array Greater Than or Equal to k
You are given a positive integer k. Initially, you have an array nums = [1].

You can perform any of the following operations on the array any number of times (possibly zero):

	Choose any element in the array and increase its value by 1.
	Duplicate any element in the array and add it to the end of the array.

Return the minimum number of operations required to make the sum of elements of the final array greater than or equal to k.

Example 1:

Input: k = 11

Output: 5

Explanation:

We can do the following operations on the array nums = [1]:

	Increase the element by 1 three times. The resulting array is nums = [4].
	Duplicate the element two times. The resulting array is nums = [4,4,4].

The sum of the final array is 4 + 4 + 4 = 12 which is greater than or equal to k = 11.
The total number of operations performed is 3 + 2 = 5.

Example 2:

Input: k = 1

Output: 0

Explanation:

The sum of the original array is already greater than or equal to 1, so no operations are needed.

Constraints:

	1 <= k <= 10^5
*/
export function minOperations(k: number): number {
    const x = Math.floor(Math.sqrt(k));
    if (x * x === k) {
        return (x << 1) - 2;
    }

    if (x * (x + 1) >= k) {
        return (x << 1) - 1;
    }
    return x << 1;
}

/*
https://leetcode.com/problems/total-distance-traveled/description/
2739. Total Distance Traveled
A truck has two fuel tanks. You are given two integers, mainTank representing the fuel present in the main tank in liters and additionalTank representing the fuel present in the additional tank in liters.

The truck has a mileage of 10 km per liter. Whenever 5 liters of fuel get used up in the main tank, if the additional tank has at least 1 liters of fuel, 1 liters of fuel will be transferred from the additional tank to the main tank.

Return the maximum distance which can be traveled.

Note: Injection from the additional tank is not continuous. It happens suddenly and immediately for every 5 liters consumed.

Example 1:

Input: mainTank = 5, additionalTank = 10
Output: 60
Explanation: 
After spending 5 litre of fuel, fuel remaining is (5 - 5 + 1) = 1 litre and distance traveled is 50km.
After spending another 1 litre of fuel, no fuel gets injected in the main tank and the main tank becomes empty.
Total distance traveled is 60km.

Example 2:

Input: mainTank = 1, additionalTank = 2
Output: 10
Explanation: 
After spending 1 litre of fuel, the main tank becomes empty.
Total distance traveled is 10km.

Constraints:

	1 <= mainTank, additionalTank <= 100
*/
export function distanceTraveled(
    mainTank: number,
    additionalTank: number
): number {
    let count = mainTank * 10;
    let total = mainTank;
    let next = Math.min(Math.floor(total / 5), additionalTank);
    let delta = total - next * 5;
    additionalTank -= next;
    while (next > 0 && additionalTank >= 0) {
        count += next * 10;
        total = next + delta;
        next = Math.min(Math.floor(total / 5), additionalTank);
        delta = total - next * 5;
        additionalTank -= next;
    }

    return count;
}

/*
https://leetcode.com/problems/integer-to-roman/description/?envType=list&envId=o5cftq05
12. Integer to Roman
Roman numerals are represented by seven different symbols: I, V, X, L, C, D and M.

Symbol       Value
I             1
V             5
X             10
L             50
C             100
D             500
M             1000

For example, 2 is written as II in Roman numeral, just two one's added together. 12 is written as XII, which is simply X + II. The number 27 is written as XXVII, which is XX + V + II.

Roman numerals are usually written largest to smallest from left to right. However, the numeral for four is not IIII. Instead, the number four 
is written as IV. Because the one is before the five we subtract it making four. The same principle applies to the number nine, 
which is written as IX. There are six instances where subtraction is used:

	I can be placed before V (5) and X (10) to make 4 and 9. 
	X can be placed before L (50) and C (100) to make 40 and 90. 
	C can be placed before D (500) and M (1000) to make 400 and 900.

Given an integer, convert it to a roman numeral.

Example 1:

Input: num = 3
Output: "III"
Explanation: 3 is represented as 3 ones.

Example 2:

Input: num = 58
Output: "LVIII"
Explanation: L = 50, V = 5, III = 3.

Example 3:

Input: num = 1994
Output: "MCMXCIV"
Explanation: M = 1000, CM = 900, XC = 90 and IV = 4.

Constraints:

	1 <= num <= 3999
*/
export function intToRoman(num: number): string {
    const getRoman = (
        v: number,
        first: string,
        second: string,
        third: string
    ): string => {
        if (v >= 1 && v <= 3) {
            return Array(v).fill(first).join('');
        }
        if (v === 4) {
            return `${first}${second}`;
        }
        if (v === 5) {
            return second;
        }
        if (v >= 6 && v <= 8) {
            return `${second}${Array(v - 5)
                .fill(first)
                .join('')}`;
        }
        if (v === 9) {
            return `${first}${third}`;
        }
        return '';
    };
    const map = {
        0: (v: number) => getRoman(v, 'I', 'V', 'X'),
        1: (v: number) => getRoman(v, 'X', 'L', 'C'),
        2: (v: number) => getRoman(v, 'C', 'D', 'M'),
        3: (v: number) => Array(v).fill('M').join(''),
    };

    const digits = num
        .toString()
        .split('')
        .map((v) => +v);
    const end = digits.length - 1;

    return digits.map((v, i) => map[end - i](v)).join('');
}

/*
https://leetcode.com/problems/integer-break/description/
343. Integer Break
Given an integer n, break it into the sum of k positive integers, where k >= 2, and maximize the product of those integers.

Return the maximum product you can get.

Example 1:

Input: n = 2
Output: 1
Explanation: 2 = 1 + 1, 1 × 1 = 1.

Example 2:

Input: n = 10
Output: 36
Explanation: 10 = 3 + 3 + 4, 3 × 3 × 4 = 36.

Constraints:

	2 <= n <= 58
*/
export function integerBreak(n: number): number {
    if (n < 4) {
        return n - 1;
    }

    let threeCount = Math.floor(n / 3);
    let rest = n % 3;
    if (rest === 1) {
        threeCount--;
        rest = 4;
    }

    const threeProduct = Array(threeCount)
        .fill(3)
        .reduce((acc, cur) => acc * cur, 1);

    return rest === 0 ? threeProduct : threeProduct * rest;
}

/*
https://leetcode.com/problems/excel-sheet-column-title/description/?envType=list&envId=o5cftq05
168. Excel Sheet Column Title
Given an integer columnNumber, return its corresponding column title as it appears in an Excel sheet.

For example:

A -> 1
B -> 2
C -> 3
...
Z -> 26
AA -> 27
AB -> 28 
...

Example 1:

Input: columnNumber = 1
Output: "A"

Example 2:

Input: columnNumber = 28
Output: "AB"

Example 3:

Input: columnNumber = 701
Output: "ZY"

Constraints:

	1 <= columnNumber <= 2^31 - 1
*/
export function convertToTitle(columnNumber: number): string {
    let str: string = '';
    let num: number;

    while (columnNumber > 0) {
        num = (columnNumber - 1) % 26;
        str = String.fromCharCode(num + 65) + str;
        columnNumber = Math.floor((columnNumber - num) / 26);
    }
    return str;
}

/*
https://leetcode.com/problems/pascals-triangle-ii/description/?envType=list&envId=o5cftq05
119. Pascal's Triangle II
Given an integer rowIndex, return the rowIndexth (0-indexed) row of the Pascal's triangle.

In Pascal's triangle, each number is the sum of the two numbers directly above it as shown:

Example 1:
Input: rowIndex = 3
Output: [1,3,3,1]
Example 2:
Input: rowIndex = 0
Output: [1]
Example 3:
Input: rowIndex = 1
Output: [1,1]

Constraints:

	0 <= rowIndex <= 33

Follow up: Could you optimize your algorithm to use only O(rowIndex) extra space?
*/
export function getRow(rowIndex: number): number[] {
    if (rowIndex < 2) {
        return Array(rowIndex + 1).fill(1);
    }

    let i = 1;
    let result = [1, 1];
    while (i < rowIndex) {
        const next = Array(result.length + 1).fill(1);
        let j = 1;
        while (j < next.length - 1) {
            next[j] = result[j - 1] + result[j++];
        }

        result = next;
        i++;
    }

    return result;
}

/*
https://leetcode.com/problems/count-numbers-with-unique-digits/description/
357. Count Numbers with Unique Digits
Given an integer n, return the count of all numbers with unique digits, x, where 0 <= x < 10n.

Example 1:

Input: n = 2
Output: 91
Explanation: The answer should be the total numbers in the range of 0 ≤ x < 100, excluding 11,22,33,44,55,66,77,88,99

Example 2:

Input: n = 0
Output: 1

Constraints:

	0 <= n <= 8
*/
export function countNumbersWithUniqueDigits(n: number): number {
    let prev = 1;
    const tmp: number[] = [9, 9, 8, 7, 6, 5, 4, 3];
    for (let i = 1; i <= n; i++) {
        prev = tmp.slice(0, i).reduce((acc, cur) => acc * cur, 1) + prev;
    }

    return prev;
}

/*
https://leetcode.com/problems/pass-the-pillow/description/
2582. Pass the Pillow
There are n people standing in a line labeled from 1 to n. The first person in the line is holding a pillow initially. Every second, the person holding the pillow passes it to the next person standing in the line. Once the pillow reaches the end of the line, the direction changes, and people continue passing the pillow in the opposite direction.

	For example, once the pillow reaches the nth person they pass it to the n - 1th person, then to the n - 2th person and so on.

Given the two positive integers n and time, return the index of the person holding the pillow after time seconds.

Example 1:

Input: n = 4, time = 5
Output: 2
Explanation: People pass the pillow in the following way: 1 -> 2 -> 3 -> 4 -> 3 -> 2.
After five seconds, the 2nd person is holding the pillow.

Example 2:

Input: n = 3, time = 2
Output: 3
Explanation: People pass the pillow in the following way: 1 -> 2 -> 3.
After two seconds, the 3rd person is holding the pillow.

Constraints:

	2 <= n <= 1000
	1 <= time <= 1000
*/
export function passThePillow(n: number, time: number): number {
    const rest = time % (n - 1);
    const f = Math.floor(time / (n - 1));
    return f & 1 ? n - rest : rest + 1;
}

/*
https://leetcode.com/problems/find-the-winner-of-the-circular-game/description/
1823. Find the Winner of the Circular Game
There are n friends that are playing a game. The friends are sitting in a circle and are numbered from 1 to n in clockwise order. More formally, moving clockwise from the ith friend brings you to the (i+1)th friend for 1 <= i < n, and moving clockwise from the nth friend brings you to the 1st friend.

The rules of the game are as follows:

	Start at the 1st friend.
	Count the next k friends in the clockwise direction including the friend you started at. The counting wraps around the circle and may count some friends more than once.
	The last friend you counted leaves the circle and loses the game.
	If there is still more than one friend in the circle, go back to step 2 starting from the friend immediately clockwise of the friend who just lost and repeat.
	Else, the last friend in the circle wins the game.

Given the number of friends, n, and an integer k, return the winner of the game.

Example 1:

Input: n = 5, k = 2
Output: 3
Explanation: Here are the steps of the game:
1) Start at friend 1.
2) Count 2 friends clockwise, which are friends 1 and 2.
3) Friend 2 leaves the circle. Next start is friend 3.
4) Count 2 friends clockwise, which are friends 3 and 4.
5) Friend 4 leaves the circle. Next start is friend 5.
6) Count 2 friends clockwise, which are friends 5 and 1.
7) Friend 1 leaves the circle. Next start is friend 3.
8) Count 2 friends clockwise, which are friends 3 and 5.
9) Friend 5 leaves the circle. Only friend 3 is left, so they are the winner.

Example 2:

Input: n = 6, k = 5
Output: 1
Explanation: The friends leave in this order: 5, 4, 6, 2, 3. The winner is friend 1.

Constraints:

	1 <= k <= n <= 500

Follow up:

Could you solve this problem in linear time with constant space?
*/
export function findTheWinner(n: number, k: number): number {
    const list = Array.from({ length: n }, (_, i) => i + 1);
    let next = 0;
    while (list.length > 1) {
        next = (next + k - 1) % list.length;
        list.splice(next, 1);
        next = next % list.length;
    }

    return list[0];
}

/*
https://leetcode.com/problems/integer-to-english-words/description/?envType=daily-question&envId=2024-08-07
273. Integer to English Words
Convert a non-negative integer num to its English words representation.

Example 1:

Input: num = 123
Output: "One Hundred Twenty Three"

Example 2:

Input: num = 12345
Output: "Twelve Thousand Three Hundred Forty Five"

Example 3:

Input: num = 1234567
Output: "One Million Two Hundred Thirty Four Thousand Five Hundred Sixty Seven"

Constraints:

	0 <= num <= 2^31 - 1
*/
export function numberToWords(num: number): string {
    if (num === 0) {
        return 'Zero';
    }

    const singleDigits: string[] = [
        '',
        'One',
        'Two',
        'Three',
        'Four',
        'Five',
        'Six',
        'Seven',
        'Eight',
        'Nine',
    ];
    const twoDigits: string[] = [
        '',
        'Eleven',
        'Twelve',
        'Thirteen',
        'Fourteen',
        'Fifteen',
        'Sixteen',
        'Seventeen',
        'Eighteen',
        'Nineteen',
    ];
    const tenDigits: string[] = [
        '',
        'Ten',
        'Twenty',
        'Thirty',
        'Forty',
        'Fifty',
        'Sixty',
        'Seventy',
        'Eighty',
        'Ninety',
    ];
    const units: string[] = ['', 'Thousand', 'Million', 'Billion'];

    const segments = num.toLocaleString().split(',');
    const last = segments.length - 1;

    return segments
        .map((n, i) => {
            const unit = units[last - i];
            const [first, second, third] = n.padStart(3, '0');
            let str = '';
            if (first !== '0') {
                str += `${singleDigits[first]} Hundred `;
            }

            if (second === '1' && third >= '1' && third <= '9') {
                str += `${twoDigits[third]} `;
            } else {
                if (second !== '0') {
                    str += `${tenDigits[second]} `;
                }
                if (third !== '0') {
                    str += `${singleDigits[third]} `;
                }
            }

            if (str && unit) {
                str += unit;
            }

            return str.trim();
        })
        .filter((s) => s !== '')
        .join(' ');
}

/*
https://leetcode.com/problems/2-keys-keyboard/description/
650. 2 Keys Keyboard
There is only one character 'A' on the screen of a notepad. You can perform one of two operations on this notepad for each step:

	Copy All: You can copy all the characters present on the screen (a partial copy is not allowed).
	Paste: You can paste the characters which are copied last time.

Given an integer n, return the minimum number of operations to get the character 'A' exactly n times on the screen.

Example 1:

Input: n = 3
Output: 3
Explanation: Initially, we have one character 'A'.
In step 1, we use Copy All operation.
In step 2, we use Paste operation to get 'AA'.
In step 3, we use Paste operation to get 'AAA'.

Example 2:

Input: n = 1
Output: 0

Constraints:

	1 <= n <= 1000
*/
export const minSteps = cache((n: number): number => {
    if (n < 2) {
        return 0;
    }

    const factors = getFactors(n);
    if (factors.length === 1) {
        return n;
    }

    let min = Infinity;
    let groupSize: number;
    for (const f of factors) {
        groupSize = n / f;
        min = Math.min(
            min,
            minSteps(f) + (groupSize > 1 ? groupSize : groupSize - 1)
        );
    }

    return min;
});

function getFactors(n: number): number[] {
    let i = Math.floor(Math.sqrt(n));
    const res: number[] = [1];
    while (i > 1) {
        if (n % i === 0) {
            res.push(i);
            res.push(n / i);
        }

        i--;
    }

    return res;
}
