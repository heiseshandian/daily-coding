import { swap } from '../common/index';
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

    const stack: Array<[index: number]> = [[0]];
    for (let i = 1; i < s.length; i++) {
        if (s[i] === '(') {
            stack.push([i]);
        } else if (s[i] === ')') {
            const [index] = stack.pop()!;
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
