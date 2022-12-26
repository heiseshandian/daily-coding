// 给定一个字符串，返回不包含重复字符的最长子串长度
export function lengthOfLongestSubstring(str: string): number {
    const map: Map<string, number> = new Map();
    let max = 0;
    let curCount = 0;

    let i = 0;
    while (i < str.length) {
        const repeatIndex = map.get(str[i]) as number;
        if (repeatIndex !== undefined) {
            max = Math.max(max, curCount);
            map.clear();

            if (repeatIndex + 1 === i) {
                curCount = 1;
                map.set(str[i], i);
                i++;
            } else {
                curCount = 0;
                i = repeatIndex + 1;
            }
        } else {
            map.set(str[i], i);
            curCount++;
            i++;
        }
    }

    return Math.max(max, curCount);
}
