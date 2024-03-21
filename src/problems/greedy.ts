import { isEven, isOdd } from '../common';

/* 
https://leetcode.com/problems/non-overlapping-intervals/

Given an array of intervals intervals where intervals[i] = [starti, endi], 
return the minimum number of intervals you need to remove to make the rest of the intervals non-overlapping.
*/
export function eraseOverlapIntervals(intervals: number[][]): number {
    // 按照左边界排序
    intervals.sort(([a], [b]) => a - b);

    let overlapCount = 0;
    for (let i = 1; i < intervals.length; i++) {
        if (intervals[i][0] < intervals[i - 1][1]) {
            overlapCount++;

            // 用于判断intervals[i+1] 与 intervals[i]，intervals[i-1]是否都重叠
            intervals[i][1] = Math.min(intervals[i - 1][1], intervals[i][1]);
        }
    }

    return overlapCount;
}

/* 
https://leetcode.com/problems/longest-palindrome/description/

Given a string s which consists of lowercase or uppercase letters, 
return the length of the longest palindrome that can be built with those letters.

Letters are case sensitive, for example, "Aa" is not considered a palindrome here.
*/
export function longestPalindrome(s: string): number {
    const countMap: Record<string, number> = {};
    for (const char of s) {
        if (!countMap[char]) {
            countMap[char] = 0;
        }
        countMap[char]++;
    }

    let max = 0;
    let hasOdd = false;
    Object.values(countMap).forEach((count) => {
        if (isEven(count)) {
            max += count;
        } else {
            hasOdd = true;
            max += count - 1;
        }
    });

    return hasOdd ? max + 1 : max;
}

export function longestPalindrome2(s: string): number {
    const countMap: Record<string, number> = {};
    for (const char of s) {
        if (!countMap[char]) {
            countMap[char] = 0;
        }
        countMap[char]++;
    }

    const oddCount = Object.values(countMap).filter((count) =>
        isOdd(count)
    ).length;

    return oddCount > 0 ? s.length - oddCount + 1 : s.length;
}

/*
https://leetcode.com/problems/longest-unequal-adjacent-groups-subsequence-i/description/
2900. Longest Unequal Adjacent Groups Subsequence I
You are given a string array words and a binary array groups both of length n, where words[i] is associated with groups[i].

Your task is to select the longest alternating subsequence from words. A subsequence of words is alternating if for any two consecutive strings in the sequence, their corresponding elements in the binary array groups differ. Essentially, you are to choose strings such that adjacent elements have non-matching corresponding bits in the groups array.

Formally, you need to find the longest subsequence of an array of indices [0, 1, ..., n - 1] denoted as [i0, i1, ..., ik-1], such that groups[ij] != groups[ij+1] for each 0 <= j < k - 1 and then find the words corresponding to these indices.

Return the selected subsequence. If there are multiple answers, return any of them.

Note: The elements in words are distinct.

Example 1:

Input: words = ["e","a","b"], groups = [0,0,1]

Output: ["e","b"]

Explanation: A subsequence that can be selected is ["e","b"] because groups[0] != groups[2]. Another subsequence that can be selected is ["a","b"] because groups[1] != groups[2]. It can be demonstrated that the length of the longest subsequence of indices that satisfies the condition is 2.

Example 2:

Input: words = ["a","b","c","d"], groups = [1,0,1,1]

Output: ["a","b","c"]

Explanation: A subsequence that can be selected is ["a","b","c"] because groups[0] != groups[1] and groups[1] != groups[2]. Another subsequence that can be selected is ["a","b","d"] because groups[0] != groups[1] and groups[1] != groups[3]. It can be shown that the length of the longest subsequence of indices that satisfies the condition is 3.

Constraints:

	1 <= n == words.length == groups.length <= 100
	1 <= words[i].length <= 10
	groups[i] is either 0 or 1.
	words consists of distinct strings.
	words[i] consists of lowercase English letters.
*/
export function getLongestSubsequence(
    words: string[],
    groups: number[]
): string[] {
    const indexes: number[] = [0];

    for (let i = 1; i < groups.length; i++) {
        if (groups[i] !== groups[indexes[indexes.length - 1]]) {
            indexes.push(i);
        }
    }

    return indexes.map((i) => words[i]);
}

/*
https://leetcode.com/problems/minimum-cost-to-make-all-characters-equal/description/
2712. Minimum Cost to Make All Characters Equal
You are given a 0-indexed binary string s of length n on which you can apply two types of operations:

	Choose an index i and invert all characters from index 0 to index i (both inclusive), with a cost of i + 1
	Choose an index i and invert all characters from index i to index n - 1 (both inclusive), with a cost of n - i

Return the minimum cost to make all characters of the string equal.

Invert a character means if its value is '0' it becomes '1' and vice-versa.

Example 1:

Input: s = "0011"
Output: 2
Explanation: Apply the second operation with i = 2 to obtain s = "0000" for a cost of 2. It can be shown that 2 is the minimum cost to make all characters equal.

Example 2:

Input: s = "010101"
Output: 9
Explanation: Apply the first operation with i = 2 to obtain s = "101101" for a cost of 3.
Apply the first operation with i = 1 to obtain s = "011101" for a cost of 2. 
Apply the first operation with i = 0 to obtain s = "111101" for a cost of 1. 
Apply the second operation with i = 4 to obtain s = "111110" for a cost of 2.
Apply the second operation with i = 5 to obtain s = "111111" for a cost of 1. 
The total cost to make all characters equal is 9. It can be shown that 9 is the minimum cost to make all characters equal.

Constraints:

	1 <= s.length == n <= 10^5
	s[i] is either '0' or '1'
*/
export function minimumCost(s: string): number {
    let left = s.length >> 1;
    let right = left + 1;

    const getLeftCount = (dest: string, flipped: string) => {
        let flip = false;
        let count = 0;
        let l = left;
        while (l >= 0) {
            if ((!flip && s[l] === dest) || (flip && s[l] === flipped)) {
                l--;
            } else {
                count += l + 1;
                flip = !flip;
            }
        }

        return count;
    };
    const getRightCount = (dest: string, flipped: string) => {
        let flip = false;
        let count = 0;
        let r = right;
        while (r < s.length) {
            if ((!flip && s[r] === dest) || (flip && s[r] === flipped)) {
                r++;
            } else {
                count += s.length - r;
                flip = !flip;
            }
        }

        return count;
    };

    return Math.min(
        getLeftCount('0', '1') + getRightCount('0', '1'),
        getLeftCount('1', '0') + getRightCount('1', '0')
    );
}

/*
https://leetcode.com/problems/maximum-score-from-removing-substrings/
1717. Maximum Score From Removing Substrings
You are given a string s and two integers x and y. You can perform two types of operations any number of times.

	Remove substring "ab" and gain x points.

		For example, when removing "ab" from "cabxbae" it becomes "cxbae".

	Remove substring "ba" and gain y points.

		For example, when removing "ba" from "cabxbae" it becomes "cabxe".

Return the maximum points you can gain after applying the above operations on s.

Example 1:

Input: s = "cdbcbbaaabab", x = 4, y = 5
Output: 19
Explanation:
- Remove the "ba" underlined in "cdbcbbaaabab". Now, s = "cdbcbbaaab" and 5 points are added to the score.
- Remove the "ab" underlined in "cdbcbbaaab". Now, s = "cdbcbbaa" and 4 points are added to the score.
- Remove the "ba" underlined in "cdbcbbaa". Now, s = "cdbcba" and 5 points are added to the score.
- Remove the "ba" underlined in "cdbcba". Now, s = "cdbc" and 5 points are added to the score.
Total score = 5 + 4 + 5 + 5 = 19.

Example 2:

Input: s = "aabbaaxybbaabb", x = 5, y = 4
Output: 20

Constraints:

	1 <= s.length <= 10^5
	1 <= x, y <= 10^4
	s consists of lowercase English letters.
*/
export function maximumGain(s: string, x: number, y: number): number {
    const biggerChar = x >= y ? 'ab' : 'ba';
    const smallerChar = biggerChar === 'ab' ? 'ba' : 'ab';
    const bigger = Math.max(x, y);
    const smaller = Math.min(x, y);

    const getPoints = (
        str: string | string[],
        char: string,
        point: number
    ): [points: number, s: string[]] => {
        const stack = [str[0]];
        let i = 1;
        let points = 0;
        while (i < str.length) {
            if (stack.length === 0) {
                stack.push(str[i++]);
                continue;
            }

            while (stack.length > 0) {
                const top = stack.pop()!;

                if (top + str[i] === char) {
                    points += point;
                    i++;
                } else {
                    stack.push(top);
                    stack.push(str[i++]);
                    break;
                }
            }
        }

        return [points, stack];
    };

    const [biggerPoints, rest] = getPoints(s, biggerChar, bigger);
    const [smallerPoints] = getPoints(rest, smallerChar, smaller);

    return biggerPoints + smallerPoints;
}
