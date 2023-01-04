// 求最长公共前缀
export function longestCommonPrefix(strs: string[]): string {
    const min = Math.min(...strs.map((s) => s.length));

    let result = '';
    let i = 0;
    while (i < min) {
        const cur = strs[0][i];
        for (let j = 1; j < strs.length; j++) {
            if (strs[j][i] !== cur) {
                return result;
            }
        }
        result += cur;
        i++;
    }

    return result;
}
