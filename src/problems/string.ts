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
