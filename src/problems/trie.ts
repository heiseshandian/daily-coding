/*
https://leetcode.com/problems/short-encoding-of-words/description/
820. Short Encoding of Words
A valid encoding of an array of words is any reference string s and array of indices indices such that:

	words.length == indices.length
	The reference string s ends with the '#' character.
	For each index indices[i], the substring of s starting from indices[i] and up to (but not including) the next '#' character is equal to words[i].

Given an array of words, return the length of the shortest reference string s possible of any valid encoding of words.

Example 1:

Input: words = ["time", "me", "bell"]
Output: 10
Explanation: A valid encoding would be s = "time#bell#" and indices = [0, 2, 5].
words[0] = "time", the substring of s starting from indices[0] = 0 to the next '#' is underlined in "time#bell#"
words[1] = "me", the substring of s starting from indices[1] = 2 to the next '#' is underlined in "time#bell#"
words[2] = "bell", the substring of s starting from indices[2] = 5 to the next '#' is underlined in "time#bell#"

Example 2:

Input: words = ["t"]
Output: 2
Explanation: A valid encoding would be s = "t#" and indices = [0].

Constraints:

	1 <= words.length <= 2000
	1 <= words[i].length <= 7
	words[i] consists of only lowercase letters.
*/
export function minimumLengthEncoding(words: string[]): number {
    const root = new TrieNode();
    words.forEach((w) => {
        insertWord(root, w);
    });

    let ret = 0;
    let height = 0;
    let queue: TrieNode[] = [root];
    while (queue.length) {
        const nextQueue: TrieNode[] = [];
        for (const node of queue) {
            node.children.forEach((n) => nextQueue.push(n));
            if (node.isLeaf) {
                ret += height + 1;
            }
        }

        height++;
        queue = nextQueue;
    }

    return ret;
}

function insertWord(root: TrieNode, word: string) {
    let cur = root;
    const a = 'a'.charCodeAt(0);
    for (let i = word.length - 1; i >= 0; i--) {
        const index = word[i].charCodeAt(0) - a;
        if (!cur.children[index]) {
            cur.isLeaf = false;
            cur.children[index] = new TrieNode();
        }

        cur = cur.children[index];
    }
}

class TrieNode {
    isLeaf = true;
    children: Array<TrieNode> = [];
}
