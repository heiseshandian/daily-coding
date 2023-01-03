export function convertStr2Int(s: string): number {
    const MAX_VALUE = Math.pow(2, 31) - 1; // 2147483647
    const MIN_VALUE = -Math.pow(2, 31); // -2147483648
    const MAX_VALUE_DIVIDED_BY_10 = parseInt(`${MAX_VALUE / 10}`);
    const MIN_VALUE_DIVIDED_BY_10 = parseInt(`${MIN_VALUE / 10}`);

    // 跳过空白
    let i = 0;
    while (s[i] === ' ' && i < s.length) {
        i++;
    }
    if (i === s.length) {
        return 0;
    }

    // 判断正负
    let prefix = s[i] === '-' ? -1 : 1;
    let result = 0;
    if (s[i] === '+' || s[i] === '-') {
        i++;
    }

    // 处理数据
    for (; i < s.length; i++) {
        if (/[^0-9]/.test(s[i])) {
            return result;
        }

        const cur = prefix * parseInt(s[i]);
        if (result > MAX_VALUE_DIVIDED_BY_10 || (result == MAX_VALUE_DIVIDED_BY_10 && cur > MAX_VALUE % 10))
            return MAX_VALUE;
        if (result < MIN_VALUE_DIVIDED_BY_10 || (result == MIN_VALUE_DIVIDED_BY_10 && cur < MIN_VALUE % 10))
            return MIN_VALUE;
        result = result * 10 + cur;
    }

    return result;
}
