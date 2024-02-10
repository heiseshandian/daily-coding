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
