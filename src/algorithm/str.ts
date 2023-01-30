// kmp算法求解index问题
// 利用最长前缀后缀匹配长度数组来加速匹配，时间复杂度O(n)
export function getIndexOf(str1: string, str2: string): number {
    if (str2.length > str1.length) {
        return -1;
    }

    const maxPreSuffixArr = getMaxPreSuffixArr(str2);

    let i = 0;
    let j = 0;
    while (i < str1.length && j < str2.length) {
        if (str1[i] === str2[j]) {
            i++;
            j++;
        } else {
            j = maxPreSuffixArr[j];
            while (j) {
                if (str1[i] === str2[j]) {
                    i++;
                    j++;
                    break;
                }
                j = maxPreSuffixArr[j];
            }
            i++;
        }
    }

    return j === str2.length ? i - str2.length : -1;
}

// 生成每个位置的最长前缀后缀匹配长度数组
function getMaxPreSuffixArr(str: string): number[] {
    if (str.length < 3) {
        return [-1, 0].slice(0, str.length);
    }

    const result = [-1, 0];
    for (let i = 3; i < str.length; ) {
        let k = result[i - 1];
        while (k) {
            if (str[i] === str[k]) {
                result[i++] = k + 1;
                break;
            }
            k = result[k];
        }
        result[i++] = 0;
    }

    return result;
}

// Manacher算法求解最长回文串长度
export function getMaxPalindrome(str: string): string {
    // 扩的过程中最远的回文右边界
    let r = -1;
    // 最远的回文右边界对应的中心点
    let c = -1;
    // 回文半径长度
    const radiusArr: number[] = [];

    const manacherStr = `#${str.split('').join('#')}#`;

    // 以i为中心，left，right分别向两边扩
    const extendR = (i: number, left: number, right: number) => {
        if (left === right) {
            left--;
            right++;
        }

        while (left >= 0 && right < manacherStr.length) {
            if (manacherStr[left] !== manacherStr[right]) {
                break;
            }
            left--;
            right++;
        }

        const newR = right - 1;
        if (newR > r) {
            r = newR;
            c = i;
        }

        radiusArr[i] = (right - left) >> 1;
    };

    let maxStr = '';
    for (let i = 0; i < manacherStr.length; i++) {
        // i在r外部直接暴力扩
        if (i > r) {
            extendR(i, i - 1, i + 1);
        } else {
            const j = i - ((i - c) << 1);
            const l = r - ((r - c) << 1);
            const jl = j - radiusArr[j] + 1;

            if (l < jl) {
                // i关于c的对称点的回文左边界jl在l内
                radiusArr[i] = radiusArr[j];
            } else if (l > jl) {
                // i关于c的对称点的回文左边界jl在l外
                radiusArr[i] = r - i + 1;
            } else {
                // i关于c的对称点的回文左边界jl在l上
                extendR(i, r - ((r - i) << 1), r);
            }
        }

        const newMaxStr = manacherStr.slice(i - radiusArr[i] + 1, i + radiusArr[i]);
        if (maxStr.length < newMaxStr.length) {
            maxStr = newMaxStr;
        }
    }

    let result = '';
    for (let i = 1; i < maxStr.length; i += 2) {
        result += maxStr[i];
    }
    return result;
}
