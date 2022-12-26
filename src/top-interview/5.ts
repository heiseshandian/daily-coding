// 给定字符串str，求str的最长回文子串
export function longestPalindrome(str: string): string {
    if (str === '') {
        return str;
    }

    let max = 0;
    let maxStr = '';
    let tmpStr = '';

    for (let i = 0; i < str.length; i++) {
        for (let j = i; j < str.length; j++) {
            tmpStr = str.slice(i, j + 1);
            if (isPalindrome(tmpStr)) {
                if (max < tmpStr.length) {
                    max = tmpStr.length;
                    maxStr = tmpStr;
                }
            }
        }
    }

    return maxStr;
}

function isPalindrome(str: string): boolean {
    const len = str.length;
    const mid = Math.ceil(len / 2) - 1;

    for (let i = 0; i <= mid; i++) {
        if (str[i] !== str[len - i - 1]) {
            return false;
        }
    }
    return true;
}

export function longestPalindrome2(str: string): string {
    if (str === '' || str.length === 1) {
        return str;
    }
    const len = str.length;
    let maxStr = '';

    // i,j范围内的字符串是否为回文串
    const dp: boolean[][] = new Array(len).fill(undefined).map((_) => new Array(len).fill(undefined));
    for (let i = len - 1; i >= 0; i--) {
        for (let j = i; j < len; j++) {
            const isEqual = str[i] === str[j];
            dp[i][j] = j + 1 - i <= 3 ? isEqual : dp[i + 1][j - 1] && isEqual;
            if (dp[i][j] && maxStr.length <= j + 1 - i) {
                maxStr = str.slice(i, j + 1);
            }
        }
    }

    return maxStr;
}

export function longestPalindrome3(s: string): string {
    let longestPS = '';

    for (let i = 0; i < s.length; i++) {
        // check odd letter palindromes
        let l = i,
            r = i;
        while (l >= 0 && r < s.length && s[l] == s[r]) {
            if (r - l + 1 > longestPS.length) {
                longestPS = s.slice(l, r + 1);
            }
            r++;
            l--;
        }

        // check even letter palindromes
        l = i;
        r = i + 1;
        while (l >= 0 && r < s.length && s[l] == s[r]) {
            if (r - l + 1 > longestPS.length) {
                longestPS = s.slice(l, r + 1);
            }
            r++;
            l--;
        }
    }
    return longestPS;
}
