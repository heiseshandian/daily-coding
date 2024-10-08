/*
https://leetcode.com/problems/permutation-in-string/description/
567. Permutation in String
Given two strings s1 and s2, return true if s2 contains a permutation of s1, or false otherwise.

In other words, return true if one of s1's permutations is the substring of s2.

Example 1:

Input: s1 = "ab", s2 = "eidbaooo"
Output: true
Explanation: s2 contains one permutation of s1 ("ba").

Example 2:

Input: s1 = "ab", s2 = "eidboaoo"
Output: false

Constraints:

	1 <= s1.length, s2.length <= 10^4
	s1 and s2 consist of lowercase English letters.
*/
export function checkInclusion(s1: string, s2: string): boolean {
    const freqMap = {};
    for (const c of s1) {
        freqMap[c] = (freqMap[c] ?? 0) + 1;
    }

    let i = 0;
    for (; i < s1.length; i++) {
        if (freqMap[s2[i]] !== undefined) {
            freqMap[s2[i]]--;
        }
    }
    while (i <= s2.length) {
        if (Object.keys(freqMap).every((alpha) => freqMap[alpha] === 0)) {
            return true;
        }

        if (freqMap[s2[i - s1.length]] !== undefined) {
            freqMap[s2[i - s1.length]]++;
        }
        if (freqMap[s2[i]] !== undefined) {
            freqMap[s2[i]]--;
        }
        i++;
    }

    return false;
}
