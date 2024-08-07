import { getCharIndex, swap } from '../common/index';
import { cache } from '../design-pattern/proxy';
/*
https://leetcode.com/problems/construct-k-palindrome-strings/
1400. Construct K Palindrome Strings
Given a string s and an integer k, return true if you can use all the characters in s to construct k palindrome strings or false otherwise.

Example 1:

Input: s = "annabelle", k = 2
Output: true
Explanation: You can construct two palindromes using all characters in s.
Some possible constructions "anna" + "elble", "anbna" + "elle", "anellena" + "b"

Example 2:

Input: s = "leetcode", k = 3
Output: false
Explanation: It is impossible to construct 3 palindromes using all the characters of s.

Example 3:

Input: s = "true", k = 4
Output: true
Explanation: The only possible solution is to put each character in a separate string.

Constraints:

	1 <= s.length <= 10^5
	s consists of lowercase English letters.
	1 <= k <= 10^5
*/
export function canConstruct(s: string, k: number): boolean {
    if (s.length < k) {
        return false;
    }

    const map: Record<string, number> = {};
    for (let i = 0; i < s.length; i++) {
        const prev = map[s[i]] || 0;
        map[s[i]] = prev + 1;
    }

    const oddCount = Object.values(map).filter((times) => times & 1).length;

    return oddCount <= k;
}

/*
https://leetcode.com/problems/palindromic-substrings/description/?envType=daily-question&envId=2024-02-10
647. Palindromic Substrings
Given a string s, return the number of palindromic substrings in it.

A string is a palindrome when it reads the same backward as forward.

A substring is a contiguous sequence of characters within the string.

Example 1:

Input: s = "abc"
Output: 3
Explanation: Three palindromic strings: "a", "b", "c".

Example 2:

Input: s = "aaa"
Output: 6
Explanation: Six palindromic strings: "a", "a", "a", "aa", "aa", "aaa".

Constraints:

	1 <= s.length <= 1000
	s consists of lowercase English letters.

Hints:
- How can we reuse a previously computed palindrome to compute a larger palindrome?
- If “aba” is a palindrome, is “xabax” a palindrome? Similarly is “xabay” a palindrome?
- Complexity based hint:
If we use brute force and check whether for every start and end position a substring is a palindrome we have O(n^2) start - end pairs 
and O(n) palindromic checks. Can we reduce the time for palindromic checks to O(1) by reusing some previous computation?
*/
export function countSubstrings(s: string): number {
    let count = 0;

    for (let center = 0; center < s.length; center++) {
        // odd
        for (
            let start = center, end = center;
            start >= 0 && end < s.length;
            start--, end++
        ) {
            if (s[start] === s[end]) {
                count++;
            } else {
                break;
            }
        }

        // even
        for (
            let start = center, end = center + 1;
            start >= 0 && end < s.length;
            start--, end++
        ) {
            if (s[start] === s[end]) {
                count++;
            } else {
                break;
            }
        }
    }

    return count;
}

/*
https://leetcode.com/problems/remove-colored-pieces-if-both-neighbors-are-the-same-color/description/?utm_source=LCUS&utm_medium=ip_redirect&utm_campaign=transfer2china
2038. Remove Colored Pieces if Both Neighbors are the Same Color
There are n pieces arranged in a line, and each piece is colored either by 'A' or by 'B'. You are given a string colors of length n where colors[i] is the color of the ith piece.

Alice and Bob are playing a game where they take alternating turns removing pieces from the line. In this game, Alice moves first.

	Alice is only allowed to remove a piece colored 'A' if both its neighbors are also colored 'A'. She is not allowed to remove pieces that are colored 'B'.
	Bob is only allowed to remove a piece colored 'B' if both its neighbors are also colored 'B'. He is not allowed to remove pieces that are colored 'A'.
	Alice and Bob cannot remove pieces from the edge of the line.
	If a player cannot make a move on their turn, that player loses and the other player wins.

Assuming Alice and Bob play optimally, return true if Alice wins, or return false if Bob wins.

Example 1:

Input: colors = "AAABABB"
Output: true
Explanation:
AAABABB -> AABABB
Alice moves first.
She removes the second 'A' from the left since that is the only 'A' whose neighbors are both 'A'.

Now it's Bob's turn.
Bob cannot make a move on his turn since there are no 'B's whose neighbors are both 'B'.
Thus, Alice wins, so return true.

Example 2:

Input: colors = "AA"
Output: false
Explanation:
Alice has her turn first.
There are only two 'A's and both are on the edge of the line, so she cannot move on her turn.
Thus, Bob wins, so return false.

Example 3:

Input: colors = "ABBBBBBBAAA"
Output: false
Explanation:
ABBBBBBBAAA -> ABBBBBBBAA
Alice moves first.
Her only option is to remove the second to last 'A' from the right.

ABBBBBBBAA -> ABBBBBBAA
Next is Bob's turn.
He has many options for which 'B' piece to remove. He can pick any.

On Alice's second turn, she has no more pieces that she can remove.
Thus, Bob wins, so return false.

Constraints:

	1 <= colors.length <= 10^5
	colors consists of only the letters 'A' and 'B'

思路分析
- Alice可移动的次数大于Bob则Alice赢，否则Bob赢
*/
export function winnerOfGame(colors: string): boolean {
    const aliceCount = colors
        .split(/B+/)
        .filter((s) => s.length >= 3)
        .reduce((acc, cur) => acc + cur.length - 2, 0);
    const bobCount = colors
        .split(/A+/)
        .filter((s) => s.length >= 3)
        .reduce((acc, cur) => acc + cur.length - 2, 0);

    return aliceCount > bobCount;
}

export function winnerOfGame2(colors: string): boolean {
    let aliceCount = 0;
    let bobCount = 0;

    let continueA = 0;
    let continueB = 0;
    for (let i = 0; i < colors.length; i++) {
        if (colors[i] === 'A') {
            continueA++;

            bobCount += Math.max(0, continueB - 2);
            continueB = 0;
        } else {
            continueB++;

            aliceCount += Math.max(0, continueA - 2);
            continueA = 0;
        }
    }

    aliceCount += Math.max(0, continueA - 2);
    bobCount += Math.max(0, continueB - 2);

    return aliceCount > bobCount;
}

/*
https://leetcode.com/problems/longest-palindromic-subsequence/description/?utm_source=LCUS&utm_medium=ip_redirect&utm_campaign=transfer2china
516. Longest Palindromic Subsequence
Given a string s, find the longest palindromic subsequence's length in s.

A subsequence is a sequence that can be derived from another sequence by deleting some or no elements without changing the order of the remaining elements.

Example 1:

Input: s = "bbbab"
Output: 4
Explanation: One possible longest palindromic subsequence is "bbbb".

Example 2:

Input: s = "cbbd"
Output: 2
Explanation: One possible longest palindromic subsequence is "bb".

Constraints:

	1 <= s.length <= 1000
	s consists only of lowercase English letters.

思路分析：
- 范围内的尝试模型
*/
export function longestPalindromeSubseq(s: string): number {
    const n: number = s.length;
    // dp[i][j] s[i-j] 范围内最长回文串长度
    const dp: number[][] = Array.from({ length: n }, () => Array(n).fill(0));

    // 从下到上-从左到右填表
    for (let i = n - 1; i >= 0; i--) {
        dp[i][i] = 1;

        for (let j = i + 1; j < n; j++) {
            if (s[i] === s[j]) {
                dp[i][j] = dp[i + 1][j - 1] + 2;
            } else {
                dp[i][j] = Math.max(dp[i + 1][j], dp[i][j - 1]);
            }
        }
    }

    return dp[0][n - 1];
}

/*
https://leetcode.com/problems/longest-palindromic-substring/description/
5. Longest Palindromic Substring
Given a string s, return the longest palindromic substring in s.

Example 1:

Input: s = "babad"
Output: "bab"
Explanation: "aba" is also a valid answer.

Example 2:

Input: s = "cbbd"
Output: "bb"

Constraints:

	1 <= s.length <= 1000
	s consist of only digits and English letters.
*/
export function longestPalindrome(s: string): string {
    let max = s[0];
    for (let center = 0; center < s.length; center++) {
        // odd
        let start = center - 1,
            end = center + 1;
        for (; start >= 0 && end < s.length; start--, end++) {
            if (s[start] !== s[end]) {
                break;
            }
        }
        const odd = s.substring(start + 1, end);
        if (max.length < odd.length) {
            max = odd;
        }

        // even
        start = center;
        end = center + 1;
        for (; start >= 0 && end < s.length; start--, end++) {
            if (s[start] !== s[end]) {
                break;
            }
        }
        const even = s.substring(start + 1, end);
        if (max.length < even.length) {
            max = even;
        }
    }

    return max;
}

/*
https://leetcode.com/problems/check-if-one-string-swap-can-make-strings-equal/description/
1790. Check if One String Swap Can Make Strings Equal
You are given two strings s1 and s2 of equal length. A string swap is an operation where you choose two indices in a string (not necessarily different) and swap the characters at these indices.

Return true if it is possible to make both strings equal by performing at most one string swap on exactly one of the strings. Otherwise, return false.

Example 1:

Input: s1 = "bank", s2 = "kanb"
Output: true
Explanation: For example, swap the first character with the last character of s2 to make "bank".

Example 2:

Input: s1 = "attack", s2 = "defend"
Output: false
Explanation: It is impossible to make them equal with one string swap.

Example 3:

Input: s1 = "kelb", s2 = "kelb"
Output: true
Explanation: The two strings are already equal, so no string swap operation is required.

Constraints:

	1 <= s1.length, s2.length <= 100
	s1.length == s2.length
	s1 and s2 consist of only lowercase English letters.
*/
export function areAlmostEqual(s1: string, s2: string): boolean {
    const diff: number[] = [];
    for (let i = 0; i < s1.length; i++) {
        if (s1[i] !== s2[i]) {
            diff.push(i);
        }
    }

    if (diff.length === 0) {
        return true;
    }
    if (diff.length === 2) {
        const [first, last] = diff;
        return s1[first] === s2[last] && s1[last] === s2[first];
    }
    return false;
}

/*
https://leetcode.com/problems/unique-length-3-palindromic-subsequences/description/
1930. Unique Length-3 Palindromic Subsequences
Given a string s, return the number of unique palindromes of length three that are a subsequence of s.

Note that even if there are multiple ways to obtain the same subsequence, it is still only counted once.

A palindrome is a string that reads the same forwards and backwards.

A subsequence of a string is a new string generated from the original string with some characters (can be none) deleted without changing the relative order of the remaining characters.

	For example, "ace" is a subsequence of "abcde".

Example 1:

Input: s = "aabca"
Output: 3
Explanation: The 3 palindromic subsequences of length 3 are:
- "aba" (subsequence of "aabca")
- "aaa" (subsequence of "aabca")
- "aca" (subsequence of "aabca")

Example 2:

Input: s = "adc"
Output: 0
Explanation: There are no palindromic subsequences of length 3 in "adc".

Example 3:

Input: s = "bbcbaba"
Output: 4
Explanation: The 4 palindromic subsequences of length 3 are:
- "bbb" (subsequence of "bbcbaba")
- "bcb" (subsequence of "bbcbaba")
- "bab" (subsequence of "bbcbaba")
- "aba" (subsequence of "bbcbaba")

Constraints:

	3 <= s.length <= 10^5
	s consists of only lowercase English letters.
*/
export function countPalindromicSubsequence(s: string): number {
    const alphas = 'abcdefghijklmnopqrstuvwxyz';

    const countUniqueAlphas = (l: number, r: number): number => {
        let uniqueAlphas = 0;

        for (const alpha of alphas) {
            const index = s.indexOf(alpha, l + 1);
            if (index !== -1 && index < r) {
                uniqueAlphas++;
            }
        }

        return uniqueAlphas;
    };

    let count = 0;
    for (const alpha of alphas) {
        const left = s.indexOf(alpha);
        const right = s.lastIndexOf(alpha);

        if (left < right) {
            count += countUniqueAlphas(left, right);
        }
    }

    return count;
}

/*
https://leetcode.com/problems/word-pattern/description/
290. Word Pattern
Given a pattern and a string s, find if s follows the same pattern.

Here follow means a full match, such that there is a bijection between a letter in pattern and a non-empty word in s.

Example 1:

Input: pattern = "abba", s = "dog cat cat dog"
Output: true

Example 2:

Input: pattern = "abba", s = "dog cat cat fish"
Output: false

Example 3:

Input: pattern = "aaaa", s = "dog cat cat dog"
Output: false

Constraints:

	1 <= pattern.length <= 300
	pattern contains only lower-case English letters.
	1 <= s.length <= 3000
	s contains only lowercase English letters and spaces ' '.
	s does not contain any leading or trailing spaces.
	All the words in s are separated by a single space.
*/
export function wordPattern(pattern: string, s: string): boolean {
    const segments = s.split(' ');
    if (pattern.length !== segments.length) {
        return false;
    }

    const visited: Record<string, string> = {};
    const set = new Set<string>();
    for (let i = 0; i < segments.length; i++) {
        if (visited[pattern[i]] === undefined) {
            if (set.has(segments[i])) {
                return false;
            }
            set.add(segments[i]);
            visited[pattern[i]] = segments[i];
            continue;
        }

        if (visited[pattern[i]] !== segments[i]) {
            return false;
        }
    }

    return true;
}

/*
https://leetcode.com/problems/shortest-common-supersequence/
1092. Shortest Common Supersequence 
Given two strings str1 and str2, return the shortest string that has both str1 and str2 as subsequences. If there are multiple valid strings, return any of them.

A string s is a subsequence of string t if deleting some number of characters from t (possibly 0) results in the string s.

Example 1:

Input: str1 = "abac", str2 = "cab"
Output: "cabac"
Explanation: 
str1 = "abac" is a subsequence of "cabac" because we can delete the first "c".
str2 = "cab" is a subsequence of "cabac" because we can delete the last "ac".
The answer provided is the shortest such string that satisfies these properties.

Example 2:

Input: str1 = "aaaaaaaa", str2 = "aaaaaaaa"
Output: "aaaaaaaa"

Constraints:

	1 <= str1.length, str2.length <= 1000
	str1 and str2 consist of lowercase English letters.
*/
export function shortestCommonSupersequence(
    str1: string,
    str2: string
): string {
    const m = str1.length,
        n = str2.length;
    // dp array to store the length of LCS.
    const dp: number[][] = Array.from({ length: m + 1 }, () =>
        Array(n + 1).fill(0)
    );

    // Populate the dp array with lengths of LCS.
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (str1[i - 1] === str2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }

    // Construct the SCS from the dp array.
    let i = m,
        j = n;
    let scs = '';

    while (i > 0 && j > 0) {
        if (str1[i - 1] === str2[j - 1]) {
            scs = str1[i - 1] + scs;
            i--;
            j--;
        } else if (dp[i - 1][j] > dp[i][j - 1]) {
            scs = str1[i - 1] + scs;
            i--;
        } else {
            scs = str2[j - 1] + scs;
            j--;
        }
    }

    // Add remaining characters from str1 or str2.
    while (i > 0) {
        scs = str1[i - 1] + scs;
        i--;
    }
    while (j > 0) {
        scs = str2[j - 1] + scs;
        j--;
    }

    return scs;
}

// 此方法在某些场景下会产生大量数组操作，数组扩容，可能会非常影响性能，
// leetcode 上会出现 Time Limit Exceeded
export function shortestCommonSupersequence2(
    str1: string,
    str2: string
): string {
    const dp: [i: number, j: number][][][] = new Array(str1.length)
        .fill(0)
        .map((_) => new Array(str2.length).fill([]));

    for (let i = 0; i < str1.length; i++) {
        for (let j = 0; j < str2.length; j++) {
            if (str1[i] === str2[j]) {
                dp[i][j] =
                    i - 1 >= 0 && j - 1 >= 0
                        ? dp[i - 1][j - 1].concat([[i, j]])
                        : [[i, j]];
                continue;
            }

            if (
                i - 1 >= 0 &&
                (j === 0 ||
                    (j - 1 >= 0 && dp[i - 1][j].length >= dp[i][j - 1].length))
            ) {
                dp[i][j] = dp[i - 1][j];
                continue;
            }

            if (
                j - 1 >= 0 &&
                (i === 0 ||
                    (i - 1 >= 0 && dp[i][j - 1].length > dp[i - 1][j].length))
            ) {
                dp[i][j] = dp[i][j - 1];
            }
        }
    }

    let result = '';
    const maxCommonSubsequence = dp[str1.length - 1][str2.length - 1];
    let prevI = 0;
    let prevJ = 0;
    for (let i = 0; i < maxCommonSubsequence.length; i++) {
        const [endI, endJ] = maxCommonSubsequence[i];
        result += str1.slice(prevI, endI);
        result += str2.slice(prevJ, endJ);
        result += str1[endI];
        prevI = endI + 1;
        prevJ = endJ + 1;
    }
    result += str1.slice(prevI);
    result += str2.slice(prevJ);

    return result;
}

/*
https://leetcode.com/problems/longest-common-subsequence/description/
1143. Longest Common Subsequence
Given two strings text1 and text2, return the length of their longest common subsequence. If there is no common subsequence, return 0.

A subsequence of a string is a new string generated from the original string with some characters (can be none) deleted without changing the relative order of the remaining characters.

	For example, "ace" is a subsequence of "abcde".

A common subsequence of two strings is a subsequence that is common to both strings.

Example 1:

Input: text1 = "abcde", text2 = "ace" 
Output: 3  
Explanation: The longest common subsequence is "ace" and its length is 3.

Example 2:

Input: text1 = "abc", text2 = "abc"
Output: 3
Explanation: The longest common subsequence is "abc" and its length is 3.

Example 3:

Input: text1 = "abc", text2 = "def"
Output: 0
Explanation: There is no such common subsequence, so the result is 0.

Constraints:

	1 <= text1.length, text2.length <= 1000
	text1 and text2 consist of only lowercase English characters.
*/
export function longestCommonSubsequence(text1: string, text2: string): number {
    const m = text1.length,
        n = text2.length;
    const dp: number[][] = Array.from({ length: m + 1 }, () =>
        Array(n + 1).fill(0)
    );

    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (text1[i - 1] === text2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }

    return dp[m][n];
}

/*
https://leetcode.com/problems/minimum-genetic-mutation/description/
433. Minimum Genetic Mutation
A gene string can be represented by an 8-character long string, with choices from 'A', 'C', 'G', and 'T'.

Suppose we need to investigate a mutation from a gene string startGene to a gene string endGene where one mutation is defined as one single character changed in the gene string.

	For example, "AACCGGTT" --> "AACCGGTA" is one mutation.

There is also a gene bank bank that records all the valid gene mutations. A gene must be in bank to make it a valid gene string.

Given the two gene strings startGene and endGene and the gene bank bank, return the minimum number of mutations needed to mutate from startGene to endGene. If there is no such a mutation, return -1.

Note that the starting point is assumed to be valid, so it might not be included in the bank.

Example 1:

Input: startGene = "AACCGGTT", endGene = "AACCGGTA", bank = ["AACCGGTA"]
Output: 1

Example 2:

Input: startGene = "AACCGGTT", endGene = "AAACGGTA", bank = ["AACCGGTA","AACCGCTA","AAACGGTA"]
Output: 2

Constraints:

	0 <= bank.length <= 10
	startGene.length == endGene.length == bank[i].length == 8
	startGene, endGene, and bank[i] consist of only the characters ['A', 'C', 'G', 'T'].
*/
export function minMutation(
    startGene: string,
    endGene: string,
    bank: string[]
): number {
    const backSet = new Set(bank);
    if (!backSet.has(endGene)) {
        return -1;
    }

    let steps = 0;
    const genes = new Set([startGene]);
    const addNextGenes = (gene: string) => {
        for (let i = 0; i < gene.length; i++) {
            if (gene[i] !== endGene[i]) {
                const next = gene.slice(0, i) + endGene[i] + gene.slice(i + 1);
                if (backSet.has(next)) {
                    genes.add(next);
                }
            }
        }

        bank.forEach((b) => {
            let count = 0;
            for (let i = 0; i < gene.length; i++) {
                if (gene[i] !== b[i]) {
                    count++;
                }
            }

            if (count === 1) {
                genes.add(b);
            }
        });
    };
    while (true) {
        if (genes.has(endGene)) {
            return steps;
        }

        steps++;
        const clone = new Set(genes);
        clone.forEach((gene) => addNextGenes(gene));

        if (clone.size === genes.size) {
            return -1;
        }
    }
}

/*
https://leetcode.com/problems/count-number-of-homogenous-substrings/?envType=daily-question&envId=2024-02-27
1759. Count Number of Homogenous Substrings
Given a string s, return the number of homogenous substrings of s. Since the answer may be too large, return it modulo 10^9 + 7.

A string is homogenous if all the characters of the string are the same.

A substring is a contiguous sequence of characters within a string.

Example 1:

Input: s = "abbcccaa"
Output: 13
Explanation: The homogenous substrings are listed as below:
"a"   appears 3 times.
"aa"  appears 1 time.
"b"   appears 2 times.
"bb"  appears 1 time.
"c"   appears 3 times.
"cc"  appears 2 times.
"ccc" appears 1 time.
3 + 1 + 2 + 1 + 3 + 2 + 1 = 13.

Example 2:

Input: s = "xy"
Output: 2
Explanation: The homogenous substrings are "x" and "y".

Example 3:

Input: s = "zzzzz"
Output: 15

Constraints:

	1 <= s.length <= 10^5
	s consists of lowercase letters.
*/
export function countHomogenous(s: string): number {
    let count = 0;
    let prevIndex = 0;
    const updateCount = (n: number) => {
        count += ((n + 1) * n) / 2;
    };

    for (let i = 1; i < s.length; i++) {
        if (s[prevIndex] !== s[i]) {
            updateCount(i - prevIndex);
            prevIndex = i;
        }
    }
    updateCount(s.length - prevIndex);

    return count % (Math.pow(10, 9) + 7);
}

/*
https://leetcode.com/problems/reverse-substrings-between-each-pair-of-parentheses/description/
1190. Reverse Substrings Between Each Pair of Parentheses
You are given a string s that consists of lower case English letters and brackets.

Reverse the strings in each pair of matching parentheses, starting from the innermost one.

Your result should not contain any brackets.

Example 1:

Input: s = "(abcd)"
Output: "dcba"

Example 2:

Input: s = "(u(love)i)"
Output: "iloveu"
Explanation: The substring "love" is reversed first, then the whole string is reversed.

Example 3:

Input: s = "(ed(et(oc))el)"
Output: "leetcode"
Explanation: First, we reverse the substring "oc", then "etco", and finally, the whole string.

Constraints:

	1 <= s.length <= 2000
	s only contains lower case English characters and parentheses.
	It is guaranteed that all parentheses are balanced.

Hints:
- Find all brackets in the string.
- Does the order of the reverse matter ?
- The order does not matter.
*/
export function reverseParentheses(s: string): string {
    const chars = s.split('');
    const reverse = (l: number, r: number) => {
        while (l < r) {
            swap(chars, l++, r--);
        }
    };

    const stack: number[] = [0];
    for (let i = 1; i < s.length; i++) {
        if (s[i] === '(') {
            stack.push(i);
        } else if (s[i] === ')') {
            const index = stack.pop()!;
            reverse(index + 1, i - 1);
        }
    }

    return chars.filter((v) => v !== '(' && v !== ')').join('');
}

/*
https://leetcode.com/problems/add-strings/
415. Add Strings
Given two non-negative integers, num1 and num2 represented as string, return the sum of num1 and num2 as a string.

You must solve the problem without using any built-in library for handling large integers (such as BigInteger). You must also not convert the inputs to integers directly.

Example 1:

Input: num1 = "11", num2 = "123"
Output: "134"

Example 2:

Input: num1 = "456", num2 = "77"
Output: "533"

Example 3:

Input: num1 = "0", num2 = "0"
Output: "0"

Constraints:

	1 <= num1.length, num2.length <= 10^4
	num1 and num2 consist of only digits.
	num1 and num2 don't have any leading zeros except for the zero itself.
*/
export function addStrings(num1: string, num2: string): string {
    let result = '';
    let carry = 0;
    let end1 = num1.length - 1;
    let end2 = num2.length - 1;
    while (end1 >= 0 && end2 >= 0) {
        const cur = Number(num1[end1--]) + Number(num2[end2--]) + carry;
        result = (cur % 10) + result;
        carry = Math.floor(cur / 10);
    }
    while (end1 >= 0) {
        const cur = Number(num1[end1--]) + carry;
        result = (cur % 10) + result;
        carry = Math.floor(cur / 10);
    }
    while (end2 >= 0) {
        const cur = Number(num2[end2--]) + carry;
        result = (cur % 10) + result;
        carry = Math.floor(cur / 10);
    }
    if (carry) {
        result = carry + result;
    }

    return result;
}

/*
https://leetcode.com/problems/minimum-additions-to-make-valid-string/description/
2645. Minimum Additions to Make Valid String
Given a string word to which you can insert letters "a", "b" or "c" anywhere and any number of times, 
return the minimum number of letters that must be inserted so that word becomes valid.

A string is called valid if it can be formed by concatenating the string "abc" several times.

Example 1:

Input: word = "b"
Output: 2
Explanation: Insert the letter "a" right before "b", and the letter "c" right next to "a" to obtain the valid string "abc".

Example 2:

Input: word = "aaa"
Output: 6
Explanation: Insert letters "b" and "c" next to each "a" to obtain the valid string "abcabcabc".

Example 3:

Input: word = "abc"
Output: 0
Explanation: word is already valid. No modifications are needed. 

Constraints:

	1 <= word.length <= 50
	word consists of letters "a", "b" and "c" only.
*/
export function addMinimum(word: string): number {
    const next = {
        a: new Set(['b', 'c']),
        b: new Set(['c']),
    };

    let min = 0;
    let i = 0;
    while (i < word.length) {
        if (word[i] === 'a' && word[i + 1] === 'b' && word[i + 2] === 'c') {
            i += 3;
        } else if (next[word[i]]?.has(word[i + 1])) {
            min += 1;
            i += 2;
        } else {
            min += 2;
            i++;
        }
    }

    return min;
}

/*
https://leetcode.com/problems/minimum-length-of-string-after-deleting-similar-ends/description/
1750. Minimum Length of String After Deleting Similar Ends
Given a string s consisting only of characters 'a', 'b', and 'c'. You are asked to apply the following algorithm on the string any number of times:

	Pick a non-empty prefix from the string s where all the characters in the prefix are equal.
	Pick a non-empty suffix from the string s where all the characters in this suffix are equal.
	The prefix and the suffix should not intersect at any index.
	The characters from the prefix and suffix must be the same.
	Delete both the prefix and the suffix.

Return the minimum length of s after performing the above operation any number of times (possibly zero times).

Example 1:

Input: s = "ca"
Output: 2
Explanation: You can't remove any characters, so the string stays as is.

Example 2:

Input: s = "cabaabac"
Output: 0
Explanation: An optimal sequence of operations is:
- Take prefix = "c" and suffix = "c" and remove them, s = "abaaba".
- Take prefix = "a" and suffix = "a" and remove them, s = "baab".
- Take prefix = "b" and suffix = "b" and remove them, s = "aa".
- Take prefix = "a" and suffix = "a" and remove them, s = "".

Example 3:

Input: s = "aabccabba"
Output: 3
Explanation: An optimal sequence of operations is:
- Take prefix = "aa" and suffix = "a" and remove them, s = "bccabb".
- Take prefix = "b" and suffix = "bb" and remove them, s = "cca".

Constraints:

	1 <= s.length <= 10^5
	s only consists of characters 'a', 'b', and 'c'.
*/
export function minimumLength(s: string): number {
    let left = 0;
    let right = s.length - 1;
    while (left < right) {
        if (s[left] !== s[right]) {
            return right - left + 1;
        }

        while (left + 1 < right && s[left] === s[left + 1]) {
            left++;
        }
        while (right - 1 > left && s[right] === s[right - 1]) {
            right--;
        }

        left++;
        right--;
    }

    return left === right ? 1 : 0;
}

/*
https://leetcode.com/problems/string-without-aaa-or-bbb/description/
984. String Without AAA or BBB
Given two integers a and b, return any string s such that:

	s has length a + b and contains exactly a 'a' letters, and exactly b 'b' letters,
	The substring 'aaa' does not occur in s, and
	The substring 'bbb' does not occur in s.

Example 1:

Input: a = 1, b = 2
Output: "abb"
Explanation: "abb", "bab" and "bba" are all correct answers.

Example 2:

Input: a = 4, b = 1
Output: "aabaa"

Constraints:

	0 <= a, b <= 100
	It is guaranteed such an s exists for the given a and b.
*/
export function strWithout3a3b(a: number, b: number): string {
    let bigger = Math.max(a, b);
    let smaller = Math.min(a, b);
    const bigChar = a === bigger ? 'a' : 'b';
    const smallChar = bigChar === 'a' ? 'b' : 'a';

    if (bigger - smaller < 3) {
        return (
            `${bigChar}${smallChar}`.repeat(smaller) +
            bigChar.repeat(bigger - smaller)
        );
    }

    const len = Math.min(bigger >> 1, smaller);
    const result = new Array(len).fill(`${bigChar}${bigChar}${smallChar}`);
    if (bigger > len << 1) {
        result.push(bigChar.repeat(bigger - (len << 1)));
    }

    let left = smaller - len;
    let i = 0;
    while (left > 0) {
        result[i++] = `${bigChar}${smallChar}${bigChar}${smallChar}`;
        left--;
    }

    return result.join('');
}

/*
https://leetcode.com/problems/split-two-strings-to-make-palindrome/description/
1616. Split Two Strings to Make Palindrome
You are given two strings a and b of the same length. Choose an index and split both strings at the same index, splitting a into two strings: aprefix and asuffix where a = aprefix + asuffix, and splitting b into two strings: bprefix and bsuffix where b = bprefix + bsuffix. Check if aprefix + bsuffix or bprefix + asuffix forms a palindrome.

When you split a string s into sprefix and ssuffix, either ssuffix or sprefix is allowed to be empty. For example, if s = "abc", then "" + "abc", "a" + "bc", "ab" + "c" , and "abc" + "" are valid splits.

Return true if it is possible to form a palindrome string, otherwise return false.

Notice that x + y denotes the concatenation of strings x and y.

Example 1:

Input: a = "x", b = "y"
Output: true
Explaination: If either a or b are palindromes the answer is true since you can split in the following way:
aprefix = "", asuffix = "x"
bprefix = "", bsuffix = "y"
Then, aprefix + bsuffix = "" + "y" = "y", which is a palindrome.

Example 2:

Input: a = "xbdef", b = "xecab"
Output: false

Example 3:

Input: a = "ulacfd", b = "jizalu"
Output: true
Explaination: Split them at index 3:
aprefix = "ula", asuffix = "cfd"
bprefix = "jiz", bsuffix = "alu"
Then, aprefix + bsuffix = "ula" + "alu" = "ulaalu", which is a palindrome.

Constraints:

	1 <= a.length, b.length <= 10^5
	a.length == b.length
	a and b consist of lowercase English letters
*/
export function checkPalindromeFormation(a: string, b: string): boolean {
    return canSplit(a, b) || canSplit(b, a);
}

function isPalindrome(s: string, left: number, right: number) {
    while (left < right) {
        if (s[left++] !== s[right--]) {
            return false;
        }
    }
    return true;
}

function canSplit(prefix: string, suffix: string): boolean {
    let left = 0;
    let right = suffix.length - 1;
    while (left < right) {
        if (prefix[left] !== suffix[right]) {
            break;
        }

        left++;
        right--;
    }

    return (
        isPalindrome(prefix, left, right) || isPalindrome(suffix, left, right)
    );
}

/*
https://leetcode.com/problems/check-if-binary-string-has-at-most-one-segment-of-ones/description/
1784. Check if Binary String Has at Most One Segment of Ones
Given a binary string s ​​​​​without leading zeros, return true​​​ if s contains at most one contiguous segment of ones. Otherwise, return false.

Example 1:

Input: s = "1001"
Output: false
Explanation: The ones do not form a contiguous segment.

Example 2:

Input: s = "110"
Output: true

Constraints:

	1 <= s.length <= 100
	s[i]​​​​ is either '0' or '1'.
	s[0] is '1'.
*/
export function checkOnesSegment(s: string): boolean {
    let hasZero = false;
    for (let i = 1; i < s.length; i++) {
        if (s[i] === '0') {
            hasZero = true;
        }
        if (s[i] === '1' && hasZero) {
            return false;
        }
    }

    return true;
}

/*
https://leetcode.com/problems/thousand-separator/description/
1556. Thousand Separator
Given an integer n, add a dot (".") as the thousands separator and return it in string format.

Example 1:

Input: n = 987
Output: "987"

Example 2:

Input: n = 1234
Output: "1.234"

Constraints:

	0 <= n <= 2^31 - 1
*/
export function thousandSeparator(n: number): string {
    const digits = n.toString().split('');
    for (let i = digits.length - 3; i > 0; i -= 3) {
        digits.splice(i, 0, '.');
    }

    return digits.join('');
}

/*
https://leetcode.com/problems/reconstruct-original-digits-from-english/description/
423. Reconstruct Original Digits from English
Given a string s containing an out-of-order English representation of digits 0-9, return the digits in ascending order.

Example 1:
Input: s = "owoztneoer"
Output: "012"
Example 2:
Input: s = "fviefuro"
Output: "45"

Constraints:

	1 <= s.length <= 10^5
	s[i] is one of the characters ["e","g","f","i","h","o","n","s","r","u","t","w","v","x","z"].
	s is guaranteed to be valid.
*/
type NumberRecord = Record<
    number,
    [char: string, times: Record<string, number>]
>;
export function originalDigits(s: string): string {
    const repeatTimes = getRepeatTimes(s);

    const even: NumberRecord = {
        0: ['z', getRepeatTimes('zero')],
        2: ['w', getRepeatTimes('two')],
        4: ['u', getRepeatTimes('four')],
        6: ['x', getRepeatTimes('six')],
        8: ['g', getRepeatTimes('eight')],
    };
    const odd: NumberRecord = {
        1: ['o', getRepeatTimes('one')],
        3: ['t', getRepeatTimes('three')],
        5: ['f', getRepeatTimes('five')],
        7: ['s', getRepeatTimes('seven')],
    };

    const result: number[] = Array(10).fill(0);
    [even, odd].forEach((v) => {
        Object.keys(v).forEach((n) => {
            const [char, times] = v[n];

            if (repeatTimes[char]) {
                result[n] = repeatTimes[char];

                Object.keys(times).forEach((k) => {
                    repeatTimes[k] -= times[k] * result[n];
                });
            }
        });
    });
    result[9] =
        Object.values(repeatTimes).reduce((acc, cur) => acc + cur) /
        'nine'.length;

    return result.map((v, i) => (v === 0 ? '' : `${i}`.repeat(v))).join('');
}

function getRepeatTimes(s: string) {
    const times: Record<string, number> = {};
    for (let i = 0; i < s.length; i++) {
        times[s[i]] = (times[s[i]] || 0) + 1;
    }

    return times;
}

/*
https://leetcode.com/problems/custom-sort-string/description/
791. Custom Sort String
You are given two strings order and s. All the characters of order are unique and were sorted in some custom order previously.

Permute the characters of s so that they match the order that order was sorted. More specifically, if a character x occurs 
before a character y in order, then x should occur before y in the permuted string.

Return any permutation of s that satisfies this property.

Example 1: 

Input:   order = "cba", s = "abcd" 

Output:   "cbad" 

Explanation:  "a", "b", "c" appear in order, so the order of "a", "b", "c" should be "c", "b", and "a".

Since "d" does not appear in order, it can be at any position in the returned string. "dcba", "cdba", "cbda" are also valid outputs.

Example 2: 

Input:   order = "bcafg", s = "abcd" 

Output:   "bcad" 

Explanation:  The characters "b", "c", and "a" from order dictate the order for the characters in s. 
The character "d" in s does not appear in order, so its position is flexible.

Following the order of appearance in order, "b", "c", and "a" from s should be arranged as "b", "c", "a". "d" can be placed 
at any position since it's not in order. The output "bcad" correctly follows this rule. Other arrangements like "bacd" or "bcda" would also be valid, 
as long as "b", "c", "a" maintain their order.

Constraints:

	1 <= order.length <= 26
	1 <= s.length <= 200
	order and s consist of lowercase English letters.
	All the characters of order are unique.
*/
export function customSortString(order: string, s: string): string {
    return s
        .split('')
        .sort((a, b) => order.indexOf(a) - order.indexOf(b))
        .join('');
}

/*
https://leetcode.com/problems/lexicographically-smallest-string-after-substring-operation/description/
2734. Lexicographically Smallest String After Substring Operation
You are given a string s consisting of only lowercase English letters. In one operation, you can do the following:

	Select any non-empty substring of s, possibly the entire string, then replace each one of its characters with 
    the previous character of the English alphabet. For example, 'b' is converted to 'a', and 'a' is converted to 'z'.

Return the lexicographically smallest string you can obtain after performing the above operation exactly once.

A substring is a contiguous sequence of characters in a string.
A string x is lexicographically smaller than a string y of the same length if x[i] comes before y[i] in alphabetic order for the first position i such that x[i] != y[i].

Example 1:

Input: s = "cbabc"
Output: "baabc"
Explanation: We apply the operation on the substring starting at index 0, and ending at index 1 inclusive. 
It can be proven that the resulting string is the lexicographically smallest. 

Example 2:

Input: s = "acbbc"
Output: "abaab"
Explanation: We apply the operation on the substring starting at index 1, and ending at index 4 inclusive. 
It can be proven that the resulting string is the lexicographically smallest. 

Example 3:

Input: s = "leetcode"
Output: "kddsbncd"
Explanation: We apply the operation on the entire string. 
It can be proven that the resulting string is the lexicographically smallest. 

Constraints:

	1 <= s.length <= 10^5
	s consists of lowercase English letters
*/
export function smallestString(s: string): string {
    let i = 0;
    while (i < s.length) {
        if (s[i] !== 'a') {
            break;
        }

        i++;
    }
    if (i === s.length) {
        return s.slice(0, s.length - 1) + 'z';
    }

    const end = s.indexOf('a', i);
    const convert = (str: string) => {
        return str
            .split('')
            .map((char) => String.fromCharCode(char.charCodeAt(0) - 1))
            .join('');
    };

    if (end === -1) {
        return s.slice(0, i) + convert(s.slice(i));
    }
    return s.slice(0, i) + convert(s.slice(i, end)) + s.slice(end);
}

/*
https://leetcode.com/problems/minimum-moves-to-convert-string/description/
2027. Minimum Moves to Convert String
You are given a string s consisting of n characters which are either 'X' or 'O'.

A move is defined as selecting three consecutive characters of s and converting them to 'O'. Note that if a move is 
applied to the character 'O', it will stay the same.

Return the minimum number of moves required so that all the characters of s are converted to 'O'.

Example 1:

Input: s = "XXX"
Output: 1
Explanation: XXX -> OOO
We select all the 3 characters and convert them in one move.

Example 2:

Input: s = "XXOX"
Output: 2
Explanation: XXOX -> OOOX -> OOOO
We select the first 3 characters in the first move, and convert them to 'O'.
Then we select the last 3 characters and convert them so that the final string contains all 'O's.

Example 3:

Input: s = "OOOO"
Output: 0
Explanation: There are no 'X's in s to convert.

Constraints:

	3 <= s.length <= 1000
	s[i] is either 'X' or 'O'.
*/
export function minimumMoves(s: string): number {
    let i = 0;
    let count = 0;
    while (i < s.length) {
        if (s[i] === 'X') {
            count++;
            i += 3;
        } else {
            i++;
        }
    }

    return count;
}

/*
https://leetcode.com/problems/defanging-an-ip-address/description/
1108. Defanging an IP Address
Given a valid (IPv4) IP address, return a defanged version of that IP address.

A defanged IP address replaces every period "." with "[.]".

Example 1:
Input: address = "1.1.1.1"
Output: "1[.]1[.]1[.]1"
Example 2:
Input: address = "255.100.50.0"
Output: "255[.]100[.]50[.]0"

Constraints:

	The given address is a valid IPv4 address.
*/
export function defangIPaddr(address: string): string {
    return address.replace(/\./g, '[.]');
}

/*
https://leetcode.com/problems/make-three-strings-equal/description/
2937. Make Three Strings Equal
You are given three strings: s1, s2, and s3. In one operation you can choose one of these strings and delete its rightmost character. 
Note that you cannot completely empty a string.

Return the minimum number of operations required to make the strings equal. If it is impossible to make them equal, return -1.

Example 1:

Input: s1 = "abc", s2 = "abb", s3 = "ab"

Output: 2

Explanation: Deleting the rightmost character from both s1 and s2 will result in three equal strings.

Example 2:

Input: s1 = "dac", s2 = "bac", s3 = "cac"

Output: -1

Explanation: Since the first letters of s1 and s2 differ, they cannot be made equal.

Constraints:

	1 <= s1.length, s2.length, s3.length <= 100
	s1, s2 and s3 consist only of lowercase English letters.
*/
export function findMinimumOperations(
    s1: string,
    s2: string,
    s3: string
): number {
    const minLen = Math.min(s1.length, s2.length, s3.length);
    let i = 0;
    while (i < minLen) {
        if (s1[i] === s2[i] && s1[i] === s3[i]) {
            i++;
        } else {
            break;
        }
    }

    return i === 0 ? -1 : s1.length + s2.length + s3.length - i * 3;
}

/*
https://leetcode.com/problems/minimum-string-length-after-removing-substrings/
2696. Minimum String Length After Removing Substrings
You are given a string s consisting only of uppercase English letters.

You can apply some operations to this string where, in one operation, you can remove any occurrence of one of the substrings "AB" or "CD" from s.

Return the minimum possible length of the resulting string that you can obtain.

Note that the string concatenates after removing the substring and could produce new "AB" or "CD" substrings.

Example 1:

Input: s = "ABFCACDB"
Output: 2
Explanation: We can do the following operations:
- Remove the substring "ABFCACDB", so s = "FCACDB".
- Remove the substring "FCACDB", so s = "FCAB".
- Remove the substring "FCAB", so s = "FC".
So the resulting length of the string is 2.
It can be shown that it is the minimum length that we can obtain.

Example 2:

Input: s = "ACBBD"
Output: 5
Explanation: We cannot do any operations on the string so the length remains the same.

Constraints:

	1 <= s.length <= 100
	s consists only of uppercase English letters.
*/
export function minLength(s: string): number {
    const stack = [s[0]];
    let i = 1;
    let min = s.length;
    while (i < s.length) {
        if (
            stack.length &&
            ((stack[stack.length - 1] === 'A' && s[i] === 'B') ||
                (stack[stack.length - 1] === 'C' && s[i] === 'D'))
        ) {
            min -= 2;
            stack.pop();
            i++;
        } else {
            stack.push(s[i++]);
        }
    }

    return min;
}

/*
https://leetcode.com/problems/construct-the-longest-new-string/description/
2745. Construct the Longest New String
You are given three integers x, y, and z.

You have x strings equal to "AA", y strings equal to "BB", and z strings equal to "AB". You want to choose some (possibly all or none) of these strings and concatenate them in some order to form a new string. This new string must not contain "AAA" or "BBB" as a substring.

Return the maximum possible length of the new string.

A substring is a contiguous non-empty sequence of characters within a string.

Example 1:

Input: x = 2, y = 5, z = 1
Output: 12
Explanation: We can concactenate the strings "BB", "AA", "BB", "AA", "BB", and "AB" in that order. Then, our new string is "BBAABBAABBAB". 
That string has length 12, and we can show that it is impossible to construct a string of longer length.

Example 2:

Input: x = 3, y = 2, z = 2
Output: 14
Explanation: We can concactenate the strings "AB", "AB", "AA", "BB", "AA", "BB", and "AA" in that order. Then, our new string is "ABABAABBAABBAA". 
That string has length 14, and we can show that it is impossible to construct a string of longer length.

Constraints:

	1 <= x, y, z <= 50
*/
export function longestString(x: number, y: number, z: number): number {
    const min = Math.min(x, y) << 1;
    return (min + (x === y ? 0 : 1) + z) << 1;
}

/*
https://leetcode.com/problems/remove-adjacent-almost-equal-characters/description/?envType=list&envId=o5cftq05
2957. Remove Adjacent Almost-Equal Characters
You are given a 0-indexed string word.

In one operation, you can pick any index i of word and change word[i] to any lowercase English letter.

Return the minimum number of operations needed to remove all adjacent almost-equal characters from word.

Two characters a and b are almost-equal if a == b or a and b are adjacent in the alphabet.

Example 1:

Input: word = "aaaaa"
Output: 2
Explanation: We can change word into "acaca" which does not have any adjacent almost-equal characters.
It can be shown that the minimum number of operations needed to remove all adjacent almost-equal characters from word is 2.

Example 2:

Input: word = "abddez"
Output: 2
Explanation: We can change word into "ybdoez" which does not have any adjacent almost-equal characters.
It can be shown that the minimum number of operations needed to remove all adjacent almost-equal characters from word is 2.

Example 3:

Input: word = "zyxyxyz"
Output: 3
Explanation: We can change word into "zaxaxaz" which does not have any adjacent almost-equal characters. 
It can be shown that the minimum number of operations needed to remove all adjacent almost-equal characters from word is 3.

Constraints:

	1 <= word.length <= 100
	word consists only of lowercase English letters.
*/
export function removeAlmostEqualCharacters(word: string): number {
    const alphas = 'abcdefghijklmnopqrstuvwxyz'.split('');
    const almostEqualMap: Record<string, string[]> = alphas.reduce(
        (acc, cur, i) => {
            acc[cur] = [
                i === 0 ? undefined : alphas[i - 1],
                cur,
                i === 25 ? undefined : alphas[i + 1],
            ];
            return acc;
        },
        {}
    );

    let count = 0;
    for (let i = 1; i < word.length; ) {
        const equals = almostEqualMap[word[i]];

        if (!equals.includes(word[i - 1])) {
            i++;
        } else {
            count++;
            i += 2;
        }
    }

    return count;
}

/*
https://leetcode.com/problems/count-beautiful-substrings-i/description/?utm_source=LCUS&utm_medium=ip_redirect&utm_campaign=transfer2china
2947. Count Beautiful Substrings I
You are given a string s and a positive integer k.

Let vowels and consonants be the number of vowels and consonants in a string.

A string is beautiful if:

	vowels == consonants.
	(vowels * consonants) % k == 0, in other terms the multiplication of vowels and consonants is divisible by k.

Return the number of non-empty beautiful substrings in the given string s.

A substring is a contiguous sequence of characters in a string.

Vowel letters in English are 'a', 'e', 'i', 'o', and 'u'.

Consonant letters in English are every letter except vowels.

Example 1:

Input: s = "baeyh", k = 2
Output: 2
Explanation: There are 2 beautiful substrings in the given string.
- Substring "baeyh", vowels = 2 (["a",e"]), consonants = 2 (["y","h"]).
You can see that string "aeyh" is beautiful as vowels == consonants and vowels * consonants % k == 0.
- Substring "baeyh", vowels = 2 (["a",e"]), consonants = 2 (["b","y"]). 
You can see that string "baey" is beautiful as vowels == consonants and vowels * consonants % k == 0.
It can be shown that there are only 2 beautiful substrings in the given string.

Example 2:

Input: s = "abba", k = 1
Output: 3
Explanation: There are 3 beautiful substrings in the given string.
- Substring "abba", vowels = 1 (["a"]), consonants = 1 (["b"]). 
- Substring "abba", vowels = 1 (["a"]), consonants = 1 (["b"]).
- Substring "abba", vowels = 2 (["a","a"]), consonants = 2 (["b","b"]).
It can be shown that there are only 3 beautiful substrings in the given string.

Example 3:

Input: s = "bcdf", k = 1
Output: 0
Explanation: There are no beautiful substrings in the given string.

Constraints:

	1 <= s.length <= 1000
	1 <= k <= 1000
	s consists of only English lowercase letters.
*/
export function beautifulSubstrings(s: string, k: number): number {
    const vowels = new Set(['a', 'e', 'i', 'o', 'u']);

    const prefix: number[] = [vowels.has(s[0]) ? 1 : -1];
    for (let i = 1; i < s.length; i++) {
        prefix[i] = prefix[i - 1] + (vowels.has(s[i]) ? 1 : -1);
    }

    let count = 0;
    for (let i = 0; i < s.length; i++) {
        for (let j = i + 1; j < s.length; j += 2) {
            const prev = i === 0 ? 0 : prefix[i - 1];
            if (
                prefix[j] - prev === 0 &&
                Math.pow((j - i + 1) >> 1, 2) % k === 0
            ) {
                count++;
            }
        }
    }

    return count;
}

/*
https://leetcode.com/problems/maximum-nesting-depth-of-the-parentheses/description/
1614. Maximum Nesting Depth of the Parentheses
A string is a valid parentheses string (denoted VPS) if it meets one of the following:

	It is an empty string "", or a single character not equal to "(" or ")",
	It can be written as AB (A concatenated with B), where A and B are VPS's, or
	It can be written as (A), where A is a VPS.

We can similarly define the nesting depth depth(S) of any VPS S as follows:

	depth("") = 0
	depth(C) = 0, where C is a string with a single character not equal to "(" or ")".
	depth(A + B) = max(depth(A), depth(B)), where A and B are VPS's.
	depth("(" + A + ")") = 1 + depth(A), where A is a VPS.

For example, "", "()()", and "()(()())" are VPS's (with nesting depths 0, 1, and 2), and ")(" and "(()" are not VPS's.

Given a VPS represented as string s, return the nesting depth of s.

Example 1:

Input: s = "(1+(2*3)+((8)/4))+1"
Output: 3
Explanation: Digit 8 is inside of 3 nested parentheses in the string.

Example 2:

Input: s = "(1)+((2))+(((3)))"
Output: 3

Constraints:

	1 <= s.length <= 100
	s consists of digits 0-9 and characters '+', '-', '*', '/', '(', and ')'.
	It is guaranteed that parentheses expression s is a VPS.
*/
export function maxDepth(s: string): number {
    const stack: string[] = [];
    let max = 0;
    for (let i = 0; i < s.length; i++) {
        if (s[i] === '(') {
            stack.push('(');
            max = Math.max(max, stack.length);
        } else if (s[i] === ')') {
            stack.pop();
        }
    }

    return max;
}

/*
https://leetcode.com/problems/make-the-string-great/description/
1544. Make The String Great
Given a string s of lower and upper case English letters.

A good string is a string which doesn't have two adjacent characters s[i] and s[i + 1] where:

	0 <= i <= s.length - 2
	s[i] is a lower-case letter and s[i + 1] is the same letter but in upper-case or vice-versa.

To make the string good, you can choose two adjacent characters that make the string bad and remove them. You can keep doing this until the string becomes good.

Return the string after making it good. The answer is guaranteed to be unique under the given constraints.

Notice that an empty string is also good.

Example 1:

Input: s = "leEeetcode"
Output: "leetcode"
Explanation: In the first step, either you choose i = 1 or i = 2, both will result "leEeetcode" to be reduced to "leetcode".

Example 2:

Input: s = "abBAcC"
Output: ""
Explanation: We have many possible scenarios, and all lead to the same answer. For example:
"abBAcC" --> "aAcC" --> "cC" --> ""
"abBAcC" --> "abBA" --> "aA" --> ""

Example 3:

Input: s = "s"
Output: "s"

Constraints:

	1 <= s.length <= 100
	s contains only lower and upper case English letters.
*/
export function makeGood(s: string): string {
    const stack: string[] = [s[0]];

    const isMatch = (a: string, b: string): boolean => {
        return a !== b && (a.toUpperCase() === b || b.toUpperCase() === a);
    };

    let i = 1;
    while (i < s.length) {
        if (stack.length > 0 && isMatch(stack[stack.length - 1], s[i])) {
            stack.pop();
        } else {
            stack.push(s[i]);
        }

        i++;
    }

    return stack.join('');
}

/*
https://leetcode.com/problems/find-common-characters/description/?envType=list&envId=o5cftq05
1002. Find Common Characters
Given a string array words, return an array of all characters that show up in all strings within the words (including duplicates). You may return the answer in any order.

Example 1:
Input: words = ["bella","label","roller"]
Output: ["e","l","l"]
Example 2:
Input: words = ["cool","lock","cook"]
Output: ["c","o"]

Constraints:

	1 <= words.length <= 100
	1 <= words[i].length <= 100
	words[i] consists of lowercase English letters.
*/
export function commonChars(words: string[]): string[] {
    const nums = Array.from({ length: words.length }, () => Array(26).fill(0));
    words.forEach((w, i) => {
        for (let j = 0; j < w.length; j++) {
            nums[i][getCharIndex(w[j])]++;
        }
    });

    const result: number[] = [];
    for (let i = 0; i < 26; i++) {
        result[i] = Math.min(...nums.map((v) => v[i]));
    }

    return result.reduce<string[]>((acc, cur, i) => {
        if (cur === 0) {
            return acc;
        }

        return acc.concat(
            Array(cur).fill(String.fromCharCode(i + 'a'.charCodeAt(0)))
        );
    }, []);
}

/*
https://leetcode.com/problems/minimum-add-to-make-parentheses-valid/description/?envType=list&envId=o5cftq05
921. Minimum Add to Make Parentheses Valid
A parentheses string is valid if and only if:

	It is the empty string,
	It can be written as AB (A concatenated with B), where A and B are valid strings, or
	It can be written as (A), where A is a valid string.

You are given a parentheses string s. In one move, you can insert a parenthesis at any position of the string.

	For example, if s = "()))", you can insert an opening parenthesis to be "(()))" or a closing parenthesis to be "())))".

Return the minimum number of moves required to make s valid.

Example 1:

Input: s = "())"
Output: 1

Example 2:

Input: s = "((("
Output: 3

Constraints:

	1 <= s.length <= 1000
	s[i] is either '(' or ')'.
*/
export function minAddToMakeValid(s: string): number {
    let left = 0;
    let count = 0;
    let i = 0;
    while (i < s.length) {
        if (s[i] === '(') {
            left++;
        } else {
            left === 0 ? count++ : left--;
        }

        i++;
    }

    return count + left;
}

/*
https://leetcode.com/problems/sort-vowels-in-a-string/description/?envType=list&envId=o5cftq05
2785. Sort Vowels in a String
Given a 0-indexed string s, permute s to get a new string t such that:

	All consonants remain in their original places. More formally, if there is an index i with 0 <= i < s.length such that s[i] is a consonant, then t[i] = s[i].
	The vowels must be sorted in the nondecreasing order of their ASCII values. More formally, for pairs of indices i, j with 0 <= i < j < s.length 
    such that s[i] and s[j] are vowels, then t[i] must not have a higher ASCII value than t[j].

Return the resulting string.

The vowels are 'a', 'e', 'i', 'o', and 'u', and they can appear in lowercase or uppercase. Consonants comprise all letters that are not vowels.

Example 1:

Input: s = "lEetcOde"
Output: "lEOtcede"
Explanation: 'E', 'O', and 'e' are the vowels in s; 'l', 't', 'c', and 'd' are all consonants. The vowels are sorted according to their ASCII values, and the consonants remain in the same places.

Example 2:

Input: s = "lYmpH"
Output: "lYmpH"
Explanation: There are no vowels in s (all characters in s are consonants), so we return "lYmpH".

Constraints:

	1 <= s.length <= 10^5
	s consists only of letters of the English alphabet in uppercase and lowercase.
*/
export function sortVowels(s: string): string {
    const vowelSet = new Set('aeiouAEIOU'.split(''));
    const chars = s.split('');
    const vowels = chars
        .filter((c) => vowelSet.has(c))
        .sort((a, b) => a.charCodeAt(0) - b.charCodeAt(0));

    let i = 0;
    return chars
        .map((c) => {
            return vowelSet.has(c) ? vowels[i++] : c;
        })
        .join('');
}

/*
https://leetcode.com/problems/number-of-wonderful-substrings/description/?envType=daily-question&envId=2024-04-30
1915. Number of Wonderful Substrings
A wonderful string is a string where at most one letter appears an odd number of times.

	For example, "ccjjc" and "abab" are wonderful, but "ab" is not.

Given a string word that consists of the first ten lowercase English letters ('a' through 'j'), return the number of 
wonderful non-empty substrings in word. If the same substring appears multiple times in word, then count each occurrence separately.

A substring is a contiguous sequence of characters in a string.

Example 1:

Input: word = "aba"
Output: 4
Explanation: The four wonderful substrings are underlined below:
- "aba" -> "a"
- "aba" -> "b"
- "aba" -> "a"
- "aba" -> "aba"

Example 2:

Input: word = "aabb"
Output: 9
Explanation: The nine wonderful substrings are underlined below:
- "aabb" -> "a"
- "aabb" -> "aa"
- "aabb" -> "aab"
- "aabb" -> "aabb"
- "aabb" -> "a"
- "aabb" -> "abb"
- "aabb" -> "b"
- "aabb" -> "bb"
- "aabb" -> "b"

Example 3:

Input: word = "he"
Output: 2
Explanation: The two wonderful substrings are underlined below:
- "he" -> "h"
- "he" -> "e"

Constraints:

	1 <= word.length <= 10^5
	word consists of lowercase English letters from 'a' to 'j'.
*/
export function wonderfulSubstrings(word: string): number {
    const bitMask = {
        a: 0b0000000001,
        b: 0b0000000010,
        c: 0b0000000100,
        d: 0b0000001000,
        e: 0b0000010000,
        f: 0b0000100000,
        g: 0b0001000000,
        h: 0b0010000000,
        i: 0b0100000000,
        j: 0b1000000000,
    };

    const prefix: number[] = [bitMask[word[0]]];
    const freqMap = new Map<number, number>();
    freqMap.set(prefix[0], 1);
    for (let i = 1; i < word.length; i++) {
        prefix[i] = prefix[i - 1] ^ bitMask[word[i]];
        freqMap.set(prefix[i], (freqMap.get(prefix[i]) ?? 0) + 1);
    }

    const expectedXors = Object.values(bitMask).concat(0);
    let count = 0;
    for (let i = 0; i < word.length; i++) {
        const prev = i === 0 ? 0 : prefix[i - 1];
        expectedXors.forEach((xor) => {
            count += freqMap.get(xor ^ prev) ?? 0;
        });

        if (freqMap.get(prefix[i])! > 1) {
            freqMap.set(prefix[i], freqMap.get(prefix[i])! - 1);
        } else {
            freqMap.delete(prefix[i]);
        }
    }

    return count;
}

/*
https://leetcode.com/problems/remove-all-adjacent-duplicates-in-string/
1047. Remove All Adjacent Duplicates In String
You are given a string s consisting of lowercase English letters. A duplicate removal consists of choosing two adjacent and equal letters and removing them.

We repeatedly make duplicate removals on s until we no longer can.

Return the final string after all such duplicate removals have been made. It can be proven that the answer is unique.

Example 1:

Input: s = "abbaca"
Output: "ca"
Explanation: 
For example, in "abbaca" we could remove "bb" since the letters are adjacent and equal, and this is the only possible move.  
The result of this move is that the string is "aaca", of which only "aa" is possible, so the final string is "ca".

Example 2:

Input: s = "azxxzy"
Output: "ay"

Constraints:

	1 <= s.length <= 10^5
	s consists of lowercase English letters.
*/
export function removeDuplicates(s: string): string {
    const stack: string[] = [];

    for (let i = 0; i < s.length; i++) {
        if (stack.length > 0 && stack[stack.length - 1] === s[i]) {
            stack.pop();
        } else {
            stack.push(s[i]);
        }
    }

    return stack.join('');
}

/*
https://leetcode.com/problems/find-the-longest-substring-containing-vowels-in-even-counts/description/?envType=problem-list-v2&envId=o5cftq05
1371. Find the Longest Substring Containing Vowels in Even Counts
Given the string s, return the size of the longest substring containing each vowel an even number of times. That is, 'a', 'e', 'i', 'o', and 'u' must appear an even number of times.

Example 1:

Input: s = "eleetminicoworoep"
Output: 13
Explanation: The longest substring is "leetminicowor" which contains two each of the vowels: e, i and o and zero of the vowels: a and u.

Example 2:

Input: s = "leetcodeisgreat"
Output: 5
Explanation: The longest substring is "leetc" which contains two e's.

Example 3:

Input: s = "bcbcbc"
Output: 6
Explanation: In this case, the given string "bcbcbc" is the longest because all vowels: a, e, i, o and u appear zero times.

Constraints:

	1 <= s.length <= 5 x 10^5
	s contains only lowercase English letters.
*/
export function findTheLongestSubstring(s: string): number {
    // a e i o u
    // 0 0 0 0 0
    const vowels = {
        a: 0,
        e: 1,
        i: 2,
        o: 3,
        u: 4,
    };
    const map = Array(32);
    map[0] = -1;
    let max = 0;
    for (let i = 0, status = 0; i < s.length; i++) {
        const index = vowels[s[i]];
        if (index !== undefined) {
            status ^= 1 << index;
        }

        if (map[status] !== undefined) {
            max = Math.max(max, i - map[status]);
        } else {
            map[status] = i;
        }
    }

    return max;
}

/*
https://leetcode.com/problems/get-equal-substrings-within-budget/description/
1208. Get Equal Substrings Within Budget
You are given two strings s and t of the same length and an integer maxCost.

You want to change s to t. Changing the ith character of s to ith character of t costs |s[i] - t[i]| 
(i.e., the absolute difference between the ASCII values of the characters).

Return the maximum length of a substring of s that can be changed to be the same as the corresponding substring of 
t with a cost less than or equal to maxCost. If there is no substring from s that can be changed to its corresponding substring from t, return 0.

Example 1:

Input: s = "abcd", t = "bcdf", maxCost = 3
Output: 3
Explanation: "abc" of s can change to "bcd".
That costs 3, so the maximum length is 3.

Example 2:

Input: s = "abcd", t = "cdef", maxCost = 3
Output: 1
Explanation: Each character in s costs 2 to change to character in t,  so the maximum length is 1.

Example 3:

Input: s = "abcd", t = "acde", maxCost = 0
Output: 1
Explanation: You cannot make any change, so the maximum length is 1.

Constraints:

    1 <= s.length <= 10^5
    t.length == s.length
    0 <= maxCost <= 10^6
    s and t consist of only lowercase English letters.
*/
export function equalSubstring(s: string, t: string, maxCost: number): number {
    const n = s.length;
    const prefix: number[] = Array(n + 1).fill(0);

    for (let i = 0; i < n; i++) {
        prefix[i + 1] =
            prefix[i] + Math.abs(s[i].charCodeAt(0) - t[i].charCodeAt(0));
    }

    const isValid = (len: number) => {
        let i = 1;
        while (i + len - 1 <= n) {
            if (prefix[i + len - 1] - prefix[i - 1] <= maxCost) {
                return true;
            }

            i++;
        }

        return false;
    };

    let l = 0;
    let r = n;
    let max = 0;
    while (l <= r) {
        const m = l + ((r - l) >> 1);
        if (isValid(m)) {
            max = m;
            l = m + 1;
        } else {
            r = m - 1;
        }
    }

    return max;
}

/*
https://leetcode.com/problems/append-characters-to-string-to-make-subsequence/description/
2486. Append Characters to String to Make Subsequence
You are given two strings s and t consisting of only lowercase English letters.

Return the minimum number of characters that need to be appended to the end of s so that t becomes a subsequence of s.

A subsequence is a string that can be derived from another string by deleting some or no characters without changing the order of the remaining characters.

Example 1:

Input: s = "coaching", t = "coding"
Output: 4
Explanation: Append the characters "ding" to the end of s so that s = "coachingding".
Now, t is a subsequence of s ("coachingding").
It can be shown that appending any 3 characters to the end of s will never make t a subsequence.

Example 2:

Input: s = "abcde", t = "a"
Output: 0
Explanation: t is already a subsequence of s ("abcde").

Example 3:

Input: s = "z", t = "abcde"
Output: 5
Explanation: Append the characters "abcde" to the end of s so that s = "zabcde".
Now, t is a subsequence of s ("zabcde").
It can be shown that appending any 4 characters to the end of s will never make t a subsequence.

Constraints:

	1 <= s.length, t.length <= 10^5
	s and t consist only of lowercase English letters.
*/
export function appendCharacters(s: string, t: string): number {
    let i = 0;
    let j = 0;
    while (i < s.length && j < t.length) {
        if (s[i] === t[j]) {
            i++;
            j++;
        } else {
            i++;
        }
    }

    return t.length - j;
}

/*
https://leetcode.com/problems/longest-ideal-subsequence/description/?envType=daily-question&envId=2024-04-25
2370. Longest Ideal Subsequence
You are given a string s consisting of lowercase letters and an integer k. We call a string t ideal if the following conditions are satisfied:

	t is a subsequence of the string s.
	The absolute difference in the alphabet order of every two adjacent letters in t is less than or equal to k.

Return the length of the longest ideal string.

A subsequence is a string that can be derived from another string by deleting some or no characters without changing the order of the remaining characters.

Note that the alphabet order is not cyclic. For example, the absolute difference in the alphabet order of 'a' and 'z' is 25, not 1.

Example 1:

Input: s = "acfgbd", k = 2
Output: 4
Explanation: The longest ideal string is "acbd". The length of this string is 4, so 4 is returned.
Note that "acfgbd" is not ideal because 'c' and 'f' have a difference of 3 in alphabet order.

Example 2:

Input: s = "abcd", k = 3
Output: 4
Explanation: The longest ideal string is "abcd". The length of this string is 4, so 4 is returned.

Constraints:

	1 <= s.length <= 10^5
	0 <= k <= 25
	s consists of lowercase English letters.
*/
export function longestIdealString(s: string, k: number): number {
    const codeA = 'a'.charCodeAt(0);
    const n = s.length;
    const dp = Array(26).fill(0);
    let max = 1;
    for (let i = 0; i < n; i++) {
        const code = s[i].charCodeAt(0) - codeA;
        let best = 0;
        let diff = Math.max(code - k, 0);
        let m = Math.min(code + k, 25);
        for (; diff <= m; diff++) {
            if (dp[diff] > best) best = dp[diff];
        }

        if (best >= dp[code]) {
            dp[code] = best + 1;
            max = Math.max(max, dp[code]);
        }
    }

    return max;
}

/*
https://leetcode.com/problems/count-number-of-texts/description/?envType=problem-list-v2&envId=o5cftq05
2266. Count Number of Texts
Alice is texting Bob using her phone. The mapping of digits to letters is shown in the figure below.

In order to add a letter, Alice has to press the key of the corresponding digit i times, where i is the position of the letter in the key.

	For example, to add the letter 's', Alice has to press '7' four times. Similarly, to add the letter 'k', Alice has to press '5' twice.
	Note that the digits '0' and '1' do not map to any letters, so Alice does not use them.

However, due to an error in transmission, Bob did not receive Alice's text message but received a string of pressed keys instead.

	For example, when Alice sent the message "bob", Bob received the string "2266622".

Given a string pressedKeys representing the string received by Bob, return the total number of possible text messages Alice could have sent.

Since the answer may be very large, return it modulo 109 + 7.

Example 1:

Input: pressedKeys = "22233"
Output: 8
Explanation:
The possible text messages Alice could have sent are:
"aaadd", "abdd", "badd", "cdd", "aaae", "abe", "bae", and "ce".
Since there are 8 possible messages, we return 8.

Example 2:

Input: pressedKeys = "222222222222222222222222222222222222"
Output: 82876089
Explanation:
There are 2082876103 possible text messages Alice could have sent.
Since we need to return the answer modulo 109 + 7, we return 2082876103 % (109 + 7) = 82876089.

Constraints:

	1 <= pressedKeys.length <= 10^5
	pressedKeys only consists of digits from '2' - '9'.
*/
export function countTexts(pressedKeys: string): number {
    const modulo = 10 ** 9 + 7;

    const isAllEqual = (start: number, end: number): boolean => {
        for (let i = start; i <= end; i++) {
            if (pressedKeys[i] !== pressedKeys[start]) {
                return false;
            }
        }

        return true;
    };

    const dfs = cache((i: number): number => {
        if (i === pressedKeys.length) {
            return 1;
        }

        let ret = 0;

        ret = (ret + dfs(i + 1)) % modulo;

        if (
            i + 1 < pressedKeys.length &&
            pressedKeys[i + 1] === pressedKeys[i]
        ) {
            ret = (ret + dfs(i + 2)) % modulo;
        }

        if (i + 2 < pressedKeys.length && isAllEqual(i, i + 2)) {
            ret = (ret + dfs(i + 3)) % modulo;
        }

        if (
            (pressedKeys[i] === '7' || pressedKeys[i] === '9') &&
            i + 3 < pressedKeys.length &&
            isAllEqual(i, i + 3)
        ) {
            ret = (ret + dfs(i + 4)) % modulo;
        }

        return ret % modulo;
    });

    return dfs(0);
}

/*
https://leetcode.com/problems/minimum-cost-to-convert-string-i/description/
2976. Minimum Cost to Convert String I
You are given two 0-indexed strings source and target, both of length n and consisting of lowercase English letters. You are also given two 0-indexed character arrays original and changed, and an integer array cost, where cost[i] represents the cost of changing the character original[i] to the character changed[i].

You start with the string source. In one operation, you can pick a character x from the string and change it to the character y at a cost of z if there exists any index j such that cost[j] == z, original[j] == x, and changed[j] == y.

Return the minimum cost to convert the string source to the string target using any number of operations. If it is impossible to convert source to target, return -1.

Note that there may exist indices i, j such that original[j] == original[i] and changed[j] == changed[i].

Example 1:

Input: source = "abcd", target = "acbe", original = ["a","b","c","c","e","d"], changed = ["b","c","b","e","b","e"], cost = [2,5,5,1,2,20]
Output: 28
Explanation: To convert the string "abcd" to string "acbe":
- Change value at index 1 from 'b' to 'c' at a cost of 5.
- Change value at index 2 from 'c' to 'e' at a cost of 1.
- Change value at index 2 from 'e' to 'b' at a cost of 2.
- Change value at index 3 from 'd' to 'e' at a cost of 20.
The total cost incurred is 5 + 1 + 2 + 20 = 28.
It can be shown that this is the minimum possible cost.

Example 2:

Input: source = "aaaa", target = "bbbb", original = ["a","c"], changed = ["c","b"], cost = [1,2]
Output: 12
Explanation: To change the character 'a' to 'b' change the character 'a' to 'c' at a cost of 1, followed by changing the character 'c' to 'b' at a cost of 2, for a total cost of 1 + 2 = 3. To change all occurrences of 'a' to 'b', a total cost of 3 * 4 = 12 is incurred.

Example 3:

Input: source = "abcd", target = "abce", original = ["a"], changed = ["e"], cost = [10000]
Output: -1
Explanation: It is impossible to convert source to target because the value at index 3 cannot be changed from 'd' to 'e'.

Constraints:

	1 <= source.length == target.length <= 10^5
	source, target consist of lowercase English letters.
	1 <= cost.length == original.length == changed.length <= 2000
	original[i], changed[i] are lowercase English letters.
	1 <= cost[i] <= 10^6
	original[i] != changed[i]
*/
export function minimumCost(
    source: string,
    target: string,
    original: string[],
    changed: string[],
    cost: number[]
): number {
    const costs = Array.from({ length: 26 }, () => Array(26).fill(Infinity));
    for (let i = 0; i < 26; i++) {
        costs[i][i] = 0;
    }

    const aCode = 'a'.charCodeAt(0);
    for (let i = 0; i < original.length; i++) {
        const from = original[i].charCodeAt(0) - aCode;
        const to = changed[i].charCodeAt(0) - aCode;
        costs[from][to] = Math.min(costs[from][to], cost[i]);
    }

    for (let mid = 0; mid < 26; mid++) {
        for (let i = 0; i < 26; i++) {
            for (let j = 0; j < 26; j++) {
                costs[i][j] = Math.min(
                    costs[i][j],
                    costs[i][mid] + costs[mid][j]
                );
            }
        }
    }

    let minCost = 0;
    let i = 0;
    const n = source.length;
    while (i < n) {
        if (source[i] === target[i]) {
            i++;
            continue;
        }

        const from = source[i].charCodeAt(0) - aCode;
        const to = target[i].charCodeAt(0) - aCode;
        if (costs[from][to] === Infinity) {
            return -1;
        }

        minCost += costs[from][to];
        i++;
    }

    return minCost;
}

/*
https://leetcode.com/problems/find-and-replace-pattern/description/
890. Find and Replace Pattern
Given a list of strings words and a string pattern, return a list of words[i] that match pattern. You may return the answer in any order.

A word matches the pattern if there exists a permutation of letters p so that after replacing every letter x in the pattern with p(x), we get the desired word.

Recall that a permutation of letters is a bijection from letters to letters: every letter maps to another letter, and no two letters map to the same letter.

Example 1:

Input: words = ["abc","deq","mee","aqq","dkd","ccc"], pattern = "abb"
Output: ["mee","aqq"]
Explanation: "mee" matches the pattern because there is a permutation {a -> m, b -> e, ...}. 
"ccc" does not match the pattern because {a -> c, b -> c, ...} is not a permutation, since a and b map to the same letter.

Example 2:

Input: words = ["a","b","c"], pattern = "a"
Output: ["a","b","c"]

Constraints:

	1 <= pattern.length <= 20
	1 <= words.length <= 50
	words[i].length == pattern.length
	pattern and words[i] are lowercase English letters.
*/
export function findAndReplacePattern(
    words: string[],
    pattern: string
): string[] {
    const n = pattern.length;
    const res: string[] = [];
    words.forEach((w) => {
        const match = {};
        const matched = new Set<string>();
        let i = 0;
        let found = true;
        while (i < n) {
            if (!match[pattern[i]] && !matched.has(w[i])) {
                matched.add(w[i]);
                match[pattern[i]] = w[i];
            } else if (match[pattern[i]] !== w[i]) {
                found = false;
                break;
            }

            i++;
        }

        if (found) {
            res.push(w);
        }
    });

    return res;
}

/*
https://leetcode.com/problems/minimum-deletions-to-make-string-balanced/description/?envType=daily-question&envId=2024-07-30
1653. Minimum Deletions to Make String Balanced
You are given a string s consisting only of characters 'a' and 'b'​​​​.

You can delete any number of characters in s to make s balanced. s is balanced if there is no pair of indices (i,j) such that i < j and s[i] = 'b' and s[j]= 'a'.

Return the minimum number of deletions needed to make s balanced.

Example 1:

Input: s = "aababbab"
Output: 2
Explanation: You can either:
Delete the characters at 0-indexed positions 2 and 6 ("aababbab" -> "aaabbb"), or
Delete the characters at 0-indexed positions 3 and 6 ("aababbab" -> "aabbbb").

Example 2:

Input: s = "bbaaaaabb"
Output: 2
Explanation: The only solution is to delete the first two characters.

Constraints:

	1 <= s.length <= 10^5
	s[i] is 'a' or 'b'​​.
*/
export function minimumDeletions(s: string): number {
    let deletions = 0;
    let counts = 0;
    for (const ch of s) {
        if (ch === 'b') {
            counts += 1;
        } else if (counts > 0) {
            deletions += 1;
            counts -= 1;
        }
    }
    return deletions;
}

/*
https://leetcode.com/problems/minimum-number-of-pushes-to-type-word-ii/description/
3016. Minimum Number of Pushes to Type Word II
You are given a string word containing lowercase English letters.

Telephone keypads have keys mapped with distinct collections of lowercase English letters, which can be used to form words by pushing them. For example, the key 2 is mapped with ["a","b","c"], we need to push the key one time to type "a", two times to type "b", and three times to type "c" .

It is allowed to remap the keys numbered 2 to 9 to distinct collections of letters. The keys can be remapped to any amount of letters, but each letter must be mapped to exactly one key. You need to find the minimum number of times the keys will be pushed to type the string word.

Return the minimum number of pushes needed to type word after remapping the keys.

An example mapping of letters to keys on a telephone keypad is given below. Note that 1, *, #, and 0 do not map to any letters.

Example 1:

Input: word = "abcde"
Output: 5
Explanation: The remapped keypad given in the image provides the minimum cost.
"a" -> one push on key 2
"b" -> one push on key 3
"c" -> one push on key 4
"d" -> one push on key 5
"e" -> one push on key 6
Total cost is 1 + 1 + 1 + 1 + 1 = 5.
It can be shown that no other mapping can provide a lower cost.

Example 2:

Input: word = "xyzxyzxyzxyz"
Output: 12
Explanation: The remapped keypad given in the image provides the minimum cost.
"x" -> one push on key 2
"y" -> one push on key 3
"z" -> one push on key 4
Total cost is 1 * 4 + 1 * 4 + 1 * 4 = 12
It can be shown that no other mapping can provide a lower cost.
Note that the key 9 is not mapped to any letter: it is not necessary to map letters to every key, but to map all the letters.

Example 3:

Input: word = "aabbccddeeffgghhiiiiii"
Output: 24
Explanation: The remapped keypad given in the image provides the minimum cost.
"a" -> one push on key 2
"b" -> one push on key 3
"c" -> one push on key 4
"d" -> one push on key 5
"e" -> one push on key 6
"f" -> one push on key 7
"g" -> one push on key 8
"h" -> two pushes on key 9
"i" -> one push on key 9
Total cost is 1 * 2 + 1 * 2 + 1 * 2 + 1 * 2 + 1 * 2 + 1 * 2 + 1 * 2 + 2 * 2 + 6 * 1 = 24.
It can be shown that no other mapping can provide a lower cost.

Constraints:

	1 <= word.length <= 10^5
	word consists of lowercase English letters.
*/
export function minimumPushes(word: string): number {
    const freqMap: Record<string, number> = {};
    for (const char of word) {
        freqMap[char] = (freqMap[char] || 0) + 1;
    }

    const sorted = Object.values(freqMap).sort((a, b) => b - a);
    let i = 1;
    let count = 0;
    while (i <= sorted.length) {
        count += sorted[i - 1] * Math.ceil(i / 8);
        i++;
    }

    return count;
}
