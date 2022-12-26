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
