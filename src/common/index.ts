export function times<T>(repeatTimes: number, fn: (args?: any) => T): T[] {
    return Array.from(Array(repeatTimes)).map(() => fn());
}

export function swap(arr: any[], a: number, b: number) {
    const temp = arr[a];
    arr[a] = arr[b];
    arr[b] = temp;
}

// 最大公约数
export function maxCommonFactor(a: number, b: number): number {
    if (a % b === 0) {
        return b;
    }

    return maxCommonFactor(b, a % b);
}

export function flipACoin(): boolean {
    return Math.random() < 0.5;
}

export function getCharIndex(char: string) {
    return char.charCodeAt(0) - 'a'.charCodeAt(0);
}

export function getChar(index: number) {
    return String.fromCharCode(index + 'a'.charCodeAt(0));
}

export const parenthesesComparator = (a: string, b: string) => {
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
            if (a[i] === '(') {
                return -1;
            }
            return 1;
        }
    }

    return 0;
};

// 用于生成随机测试数据
export function generateMatrix(
    row: number,
    col: number,
    left = 1,
    right = 100
): number[][] {
    row = Math.ceil(Math.random() * row);
    col = Math.ceil(Math.random() * col);

    const result = new Array(row).fill(0).map((_) => new Array(col).fill(0));

    for (let i = 0; i < row; i++) {
        for (let j = 0; j < col; j++) {
            result[i][j] = Math.ceil(Math.random() * (right - left)) + left;
        }
    }

    return result;
}

export function generateArray(maxVal: number, maxLen: number): number[] {
    const len = Math.ceil(Math.random() * maxLen);

    const result = new Array(len);
    for (let i = 0; i < len; i++) {
        result[i] = Math.ceil(Math.random() * maxVal);
    }

    return result;
}

export function getClosestMaxOrEqual(
    arr: number[],
    target: number,
    left: number,
    right: number
): number {
    let closestMaxOrEqual = right + 1;
    while (left <= right) {
        const mid = left + ((right - left) >> 1);
        if (arr[mid] < target) {
            left = mid + 1;
        } else {
            closestMaxOrEqual = mid;
            right = mid - 1;
        }
    }

    return closestMaxOrEqual;
}

export function isEven(n: number) {
    return (n & 1) === 0;
}

export function isOdd(n: number) {
    return (n & 1) === 1;
}

// 辗转相除法求 a 和 b 的最大公约数
export function gcd(a: number, b: number) {
    return b === 0 ? a : gcd(b, a % b);
}

// 最小公倍数
export function lcm(a: number, b: number) {
    return (a * b) / gcd(a, b);
}

export function sqrtBigInt(n: bigint) {
    if (n < 0n) {
        throw new Error(
            'Square root of negative numbers is not supported for BigInt.'
        );
    }
    if (n < 2n) {
        return n;
    }

    let left = 1n;
    let right = n;
    let result = 1n;

    while (left <= right) {
        const mid = (left + right) / 2n;
        const midSquared = mid * mid;

        if (midSquared === n) {
            return mid;
        } else if (midSquared < n) {
            left = mid + 1n;
            result = mid;
        } else {
            right = mid - 1n;
        }
    }

    return result;
}
