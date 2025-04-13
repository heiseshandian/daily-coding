import { cache } from '../design-pattern/proxy';
import { gcd, swap } from '../common/index';
import { sieveOfEratosthenes } from '../common/math';
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
    count += (closestMin + 1) * Math.pow(digits.length, digitsOfN.length - 1);
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
      : mid - min === 2 || max - mid === 2 || mid - min === 1 || max - mid === 1
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

/*
https://leetcode.com/problems/fraction-addition-and-subtraction/description/?envType=daily-question&envId=2024-08-23
592. Fraction Addition and Subtraction
Given a string expression representing an expression of fraction addition and subtraction, return the calculation result in string format.

The final result should be an irreducible fraction. If your final result is an integer, change it to the format of a fraction that has a denominator 1. So in this case, 2 should be converted to 2/1.

Example 1:

Input: expression = "-1/2+1/2"
Output: "0/1"

Example 2:

Input: expression = "-1/2+1/2+1/3"
Output: "1/3"

Example 3:

Input: expression = "1/3-1/2"
Output: "-1/6"

Constraints:

	The input string only contains '0' to '9', '/', '+' and '-'. So does the output.
	Each fraction (input and output) has the format ±numerator/denominator. If the first input fraction or the output is positive, then '+' will be omitted.
	The input only contains valid irreducible fractions, where the numerator and denominator of each fraction will always be in the range [1, 10]. If the denominator is 1, it means this fraction is actually an integer in a fraction format defined above.
	The number of given fractions will be in the range [1, 10].
	The numerator and denominator of the final result are guaranteed to be valid and in the range of 32-bit int.
*/
export function fractionAddition(expression: string): string {
  const segments = expression.match(/^\d+\/\d+|[+-]\d+\/\d+/gm)!;
  let sum = 0;
  let denominator = 1;
  for (const exp of segments) {
    const [num, d] = exp.split('/').map((a) => +a);
    sum = sum * d + num * denominator;
    denominator *= d;
  }

  const g = Math.abs(gcd(sum, denominator));
  return `${sum / g}/${denominator / g}`;
}

/*
https://leetcode.com/problems/sum-of-digits-of-string-after-convert/description/?envType=daily-question&envId=2024-09-03
1945. Sum of Digits of String After Convert
You are given a string s consisting of lowercase English letters, and an integer k.

First, convert s into an integer by replacing each letter with its position in the alphabet (i.e., replace 'a' with 1, 'b' with 2, ..., 'z' with 26). Then, transform the integer by replacing it with the sum of its digits. Repeat the transform operation k times in total.

For example, if s = "zbax" and k = 2, then the resulting integer would be 8 by the following operations:

	Convert: "zbax" ➝ "(26)(2)(1)(24)" ➝ "262124" ➝ 262124
	Transform #1: 262124 ➝ 2 + 6 + 2 + 1 + 2 + 4 ➝ 17
	Transform #2: 17 ➝ 1 + 7 ➝ 8

Return the resulting integer after performing the operations described above.

Example 1:

Input: s = "iiii", k = 1
Output: 36
Explanation: The operations are as follows:
- Convert: "iiii" ➝ "(9)(9)(9)(9)" ➝ "9999" ➝ 9999
- Transform #1: 9999 ➝ 9 + 9 + 9 + 9 ➝ 36
Thus the resulting integer is 36.

Example 2:

Input: s = "leetcode", k = 2
Output: 6
Explanation: The operations are as follows:
- Convert: "leetcode" ➝ "(12)(5)(5)(20)(3)(15)(4)(5)" ➝ "12552031545" ➝ 12552031545
- Transform #1: 12552031545 ➝ 1 + 2 + 5 + 5 + 2 + 0 + 3 + 1 + 5 + 4 + 5 ➝ 33
- Transform #2: 33 ➝ 3 + 3 ➝ 6
Thus the resulting integer is 6.

Example 3:

Input: s = "zbax", k = 2
Output: 8

Constraints:

	1 <= s.length <= 100
	1 <= k <= 10
	s consists of lowercase English letters.
*/
export function getLucky(s: string, k: number): number {
  const alphaMap = 'abcdefghijklmnopqrstuvwxyz'.split('').reduce((s, v, i) => {
    s[v] = i + 1;
    return s;
  }, {});
  let num = '';
  s.split('').forEach((alpha) => {
    num += alphaMap[alpha];
  });

  while (k > 0) {
    let s = 0;
    for (const n of num) {
      s += +n;
    }

    num = s + '';
    k--;
  }

  return +num;
}

/*
https://leetcode.com/problems/largest-number/description/
179. Largest Number
Given a list of non-negative integers nums, arrange them such that they form the largest number and return it.

Since the result may be very large, so you need to return a string instead of an integer.

Example 1:

Input: nums = [10,2]
Output: "210"

Example 2:

Input: nums = [3,30,34,5,9]
Output: "9534330"

Constraints:

	1 <= nums.length <= 100
	0 <= nums[i] <= 10^9
*/
export function largestNumber(nums: number[]): string {
  return nums
    .sort((a, b) => Number(BigInt(`${b}${a}`) - BigInt(`${a}${b}`)))
    .join('')
    .replace(/^0+/, '0');
}

/*
https://leetcode.com/problems/separate-the-digits-in-an-array/description/
2553. Separate the Digits in an Array
Given an array of positive integers nums, return an array answer that consists of the digits of each integer in nums after separating them in the same order they appear in nums.

To separate the digits of an integer is to get all the digits it has in the same order.

	For example, for the integer 10921, the separation of its digits is [1,0,9,2,1].

Example 1:

Input: nums = [13,25,83,77]
Output: [1,3,2,5,8,3,7,7]
Explanation: 
- The separation of 13 is [1,3].
- The separation of 25 is [2,5].
- The separation of 83 is [8,3].
- The separation of 77 is [7,7].
answer = [1,3,2,5,8,3,7,7]. Note that answer contains the separations in the same order.

Example 2:

Input: nums = [7,1,3,9]
Output: [7,1,3,9]
Explanation: The separation of each integer in nums is itself.
answer = [7,1,3,9].

Constraints:

	1 <= nums.length <= 1000
	1 <= nums[i] <= 10^5
*/
export function separateDigits(nums: number[]): number[] {
  const digits = Array(5);
  let i = digits.length - 1;

  return nums.reduce<number[]>((ret, n) => {
    while (n > 0) {
      digits[i--] = n % 10;
      n /= 10;
      n |= 0;
    }
    while (i < digits.length - 1) {
      ret.push(digits[++i]);
    }

    return ret;
  }, []);
}

/*
https://leetcode.com/problems/maximum-swap/description/
670. Maximum Swap
You are given an integer num. You can swap two digits at most once to get the maximum valued number.

Return the maximum valued number you can get.

Example 1:

Input: num = 2736
Output: 7236
Explanation: Swap the number 2 and the number 7.

Example 2:

Input: num = 9973
Output: 9973
Explanation: No swap.

Constraints:

	0 <= num <= 10^8
*/
export function maximumSwap(num: number): number {
  const digits: number[] = Array(8);
  let i = digits.length - 1;
  while (num > 0) {
    digits[i--] = num % 10;
    num /= 10;
    num |= 0;
  }

  const rightMax: number[] = Array(8);
  rightMax[rightMax.length - 1] = digits.length - 1;
  for (let j = rightMax.length - 2; j > i; j--) {
    rightMax[j] = digits[j] > digits[rightMax[j + 1]] ? j : rightMax[j + 1];
  }

  for (let j = i + 1; j < digits.length; j++) {
    if (digits[j] < digits[rightMax[j]]) {
      swap(digits, j, rightMax[j]);
      break;
    }
  }

  return digits.reduce((s, d) => s * 10 + d, 0);
}

/*
https://leetcode.com/problems/count-number-of-maximum-bitwise-or-subsets/description/
2044. Count Number of Maximum Bitwise-OR Subsets
Given an integer array nums, find the maximum possible bitwise OR of a subset of nums and return the number of different non-empty subsets with the maximum bitwise OR.

An array a is a subset of an array b if a can be obtained from b by deleting some (possibly zero) elements of b. Two subsets are considered different if the indices of the elements chosen are different.

The bitwise OR of an array a is equal to a[0] OR a[1] OR ... OR a[a.length - 1] (0-indexed).

Example 1:

Input: nums = [3,1]
Output: 2
Explanation: The maximum possible bitwise OR of a subset is 3. There are 2 subsets with a bitwise OR of 3:
- [3]
- [3,1]

Example 2:

Input: nums = [2,2,2]
Output: 7
Explanation: All non-empty subsets of [2,2,2] have a bitwise OR of 2. There are 23 - 1 = 7 total subsets.

Example 3:

Input: nums = [3,2,1,5]
Output: 6
Explanation: The maximum possible bitwise OR of a subset is 7. There are 6 subsets with a bitwise OR of 7:
- [3,5]
- [3,1,5]
- [3,2,5]
- [3,2,1,5]
- [2,5]
- [2,1,5]

Constraints:

	1 <= nums.length <= 16
	1 <= nums[i] <= 10^5
*/
export function countMaxOrSubsets(nums: number[]): number {
  const max = nums.reduce((s, n) => s | n);

  const dfs = (i: number, sum: number) => {
    if (i === nums.length) {
      return sum === max ? 1 : 0;
    }

    return dfs(i + 1, sum | nums[i]) + dfs(i + 1, sum);
  };

  return dfs(0, 0);
}

/*
https://leetcode.com/problems/ugly-number/description/
263. Ugly Number
An ugly number is a positive integer whose prime factors are limited to 2, 3, and 5.

Given an integer n, return true if n is an ugly number.

Example 1:

Input: n = 6
Output: true
Explanation: 6 = 2 × 3

Example 2:

Input: n = 1
Output: true
Explanation: 1 has no prime factors, therefore all of its prime factors are limited to 2, 3, and 5.

Example 3:

Input: n = 14
Output: false
Explanation: 14 is not ugly since it includes the prime factor 7.

Constraints:

	2^31 <= n <= 2^31 - 1
*/
export function isUgly(n: number): boolean {
  if (n <= 0) return false;
  if (n <= 6) return true;

  while (n % 2 === 0) n /= 2;
  while (n % 3 === 0) n /= 3;
  while (n % 5 === 0) n /= 5;

  return n === 1;
}

/*
https://leetcode.com/problems/nth-digit/description/
400. Nth Digit
Given an integer n, return the nth digit of the infinite integer sequence [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, ...].

Example 1:

Input: n = 3
Output: 3

Example 2:

Input: n = 11
Output: 0
Explanation: The 11th digit of the sequence 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, ... is a 0, which is part of the number 10.

Constraints:

	1 <= n <= 2^31 - 1
*/
export function findNthDigit(n: number): number {
  const countDigits = (n: number): number => {
    let end = n;
    let digit = 0;
    let offset = 1;
    while (end > 0) {
      digit++;
      end = Math.floor(end / 10);
      offset *= 10;
    }
    offset /= 10;

    end = n;
    let count = 0;
    while (digit > 0) {
      count += (end - offset + 1) * digit;
      end = offset - 1;
      digit--;
      offset /= 10;
    }

    return count;
  };

  let left = 1;
  let right = n;
  let closest = n;
  while (left <= right) {
    const mid = left + ((right - left) >> 1);
    if (countDigits(mid) >= n) {
      closest = mid;
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }

  n -= countDigits(closest - 1);

  return n === 0 ? closest : +closest.toString().split('')[n - 1];
}

/*
https://leetcode.com/problems/find-the-punishment-number-of-an-integer/description/?envType=daily-question&envId=2025-02-15
2698. Find the Punishment Number of an Integer
Given a positive integer n, return the punishment number of n.

The punishment number of n is defined as the sum of the squares of all integers i such that:

	1 <= i <= n
	The decimal representation of i * i can be partitioned into contiguous substrings such that the sum of the integer values of these substrings equals i.

Example 1:

Input: n = 10
Output: 182
Explanation: There are exactly 3 integers i in the range [1, 10] that satisfy the conditions in the statement:
- 1 since 1 * 1 = 1
- 9 since 9 * 9 = 81 and 81 can be partitioned into 8 and 1 with a sum equal to 8 + 1 == 9.
- 10 since 10 * 10 = 100 and 100 can be partitioned into 10 and 0 with a sum equal to 10 + 0 == 10.
Hence, the punishment number of 10 is 1 + 81 + 100 = 182

Example 2:

Input: n = 37
Output: 1478
Explanation: There are exactly 4 integers i in the range [1, 37] that satisfy the conditions in the statement:
- 1 since 1 * 1 = 1. 
- 9 since 9 * 9 = 81 and 81 can be partitioned into 8 + 1. 
- 10 since 10 * 10 = 100 and 100 can be partitioned into 10 + 0. 
- 36 since 36 * 36 = 1296 and 1296 can be partitioned into 1 + 29 + 6.
Hence, the punishment number of 37 is 1 + 81 + 100 + 1296 = 1478

Constraints:

	1 <= n <= 1000
*/
export function punishmentNumber(n: number): number {
  let sum = 0;

  const split = (num: string, target: number): boolean => {
    if (Number(num) === target) {
      return true;
    }

    for (let i = 1; i < num.length; i++) {
      const left = num.slice(0, i);
      const right = num.slice(i);
      const nextTarget = target - Number(left);
      if (nextTarget >= 0 && split(right, nextTarget)) {
        return true;
      }
    }

    return false;
  };

  for (let i = 1; i <= n; i++) {
    const num = i * i;
    if (split(num.toString(), i)) {
      sum += num;
    }
  }

  return sum;
}

/*
https://leetcode.com/problems/check-if-number-is-a-sum-of-powers-of-three/description/?envType=daily-question&envId=2025-03-04
1780. Check if Number is a Sum of Powers of Three
Given an integer n, return true if it is possible to represent n as the sum of distinct powers of three. Otherwise, return false.

An integer y is a power of three if there exists an integer x such that y == 3x.

Example 1:

Input: n = 12
Output: true
Explanation: 12 = 3^1 + 3^2

Example 2:

Input: n = 91
Output: true
Explanation: 91 = 3^0 + 3^2 + 3^4

Example 3:

Input: n = 21
Output: false

Constraints:

	1 <= n <= 10^7
*/
export function checkPowersOfThree(n: number): boolean {
  while (n > 0) {
    if (n % 3 === 2) {
      return false;
    }
    n = Math.floor(n / 3);
  }

  return true;
}

/*
https://leetcode.com/problems/find-missing-and-repeated-values/description/?envType=daily-question&envId=2025-03-06
2965. Find Missing and Repeated Values
You are given a 0-indexed 2D integer matrix grid of size n * n with values in the range [1, n^2]. Each integer appears exactly once except a which appears twice and b which is missing. The task is to find the repeating and missing numbers a and b.

Return a 0-indexed integer array ans of size 2 where ans[0] equals to a and ans[1] equals to b.

Example 1:

Input: grid = [[1,3],[2,2]]
Output: [2,4]
Explanation: Number 2 is repeated and number 4 is missing so the answer is [2,4].

Example 2:

Input: grid = [[9,1,7],[8,9,2],[3,4,6]]
Output: [9,5]
Explanation: Number 9 is repeated and number 5 is missing so the answer is [9,5].

Constraints:

	2 <= n == grid.length == grid[i].length <= 50
	1 <= grid[i][j] <= n * n
	For all x that 1 <= x <= n * n there is exactly one x that is not equal to any of the grid members.
	For all x that 1 <= x <= n * n there is exactly one x that is equal to exactly two of the grid members.
	For all x that 1 <= x <= n * n except two of them there is exatly one pair of i, j that 0 <= i, j <= n - 1 and grid[i][j] == x.
*/
export function findMissingAndRepeatedValues(grid: number[][]): number[] {
  let sum = 0;
  let squareSum = 0;
  let n = 1;
  let normalSum = 0;
  let normalSquareSum = 0;
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      sum += grid[i][j];
      squareSum += grid[i][j] * grid[i][j];
      normalSum += n;
      normalSquareSum += n * n;
      n++;
    }
  }

  const diff = normalSum - sum;
  const diffSquare = normalSquareSum - squareSum;
  const sumDiff = diffSquare / diff;
  const b = (sumDiff + diff) / 2;
  const a = sumDiff - b;
  return [a, b];
}

/*
https://leetcode.com/problems/closest-prime-numbers-in-range/description/?envType=daily-question&envId=2025-03-07
2523. Closest Prime Numbers in Range
Given two positive integers left and right, find the two integers num1 and num2 such that:

	left <= num1 < num2 <= right .
	Both num1 and num2 are prime numbers.
	num2 - num1 is the minimum amongst all other pairs satisfying the above conditions.

Return the positive integer array ans = [num1, num2]. If there are multiple pairs satisfying these conditions, return the one with the smallest num1 value. If no such numbers exist, return [-1, -1].

Example 1:

Input: left = 10, right = 19
Output: [11,13]
Explanation: The prime numbers between 10 and 19 are 11, 13, 17, and 19.
The closest gap between any pair is 2, which can be achieved by [11,13] or [17,19].
Since 11 is smaller than 17, we return the first pair.

Example 2:

Input: left = 4, right = 6
Output: [-1,-1]
Explanation: There exists only one prime number in the given range, so the conditions cannot be satisfied.

Constraints:

	1 <= left <= right <= 10^6
*/
export function closestPrimes(left: number, right: number): number[] {
  const primes = sieveOfEratosthenes(right);
  let i = 0;
  while (primes[i] < left) {
    i++;
  }
  if (primes.length - i < 2) {
    return [-1, -1];
  }

  let minDiff = primes[i + 1] - primes[i];
  let minDiffPair = [primes[i], primes[i + 1]];
  for (let j = i + 1; j < primes.length - 1; j++) {
    const diff = primes[j + 1] - primes[j];
    if (diff < minDiff) {
      minDiff = diff;
      minDiffPair = [primes[j], primes[j + 1]];
    }
  }

  return minDiffPair;
}

/*
https://leetcode.com/problems/count-good-numbers/description/?envType=daily-question&envId=2025-04-13
1922. Count Good Numbers
A digit string is good if the digits (0-indexed) at even indices are even and the digits at odd indices are prime (2, 3, 5, or 7).

	For example, "2582" is good because the digits (2 and 8) at even positions are even and the digits (5 and 2) at odd positions are prime. However, "3245" is not good because 3 is at an even index but is not even.

Given an integer n, return the total number of good digit strings of length n. Since the answer may be large, return it modulo 109 + 7.

A digit string is a string consisting of digits 0 through 9 that may contain leading zeros.

Example 1:

Input: n = 1
Output: 5
Explanation: The good numbers of length 1 are "0", "2", "4", "6", "8".

Example 2:

Input: n = 4
Output: 400

Example 3:

Input: n = 50
Output: 564908303

Constraints:

	1 <= n <= 10^15
*/
export function countGoodNumbers(n: number): number {
  const MOD = 1000000007n;
  const evenCount = Math.ceil(n / 2);
  const oddCount = n - evenCount;

  const pow = (base: bigint, exp: bigint): bigint => {
    if (exp === 0n) return 1n;
    if (exp === 1n) return base % MOD;
    const half = pow(base, exp / 2n);
    if (exp % 2n === 0n) {
      return (half * half) % MOD;
    }
    return (((half * half) % MOD) * base) % MOD;
  };

  const even = pow(5n, BigInt(evenCount));
  const odd = pow(4n, BigInt(oddCount));
  return Number((even * odd) % MOD);
}
