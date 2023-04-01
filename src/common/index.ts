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

// 打印二进制位
export function printBinary(n: number): string {
    let result: string[] = [];
    for (let i = 31; i >= 0; i--) {
        // n & 000...0001
        // n & 000...0010
        // n & 000...0100 与完之后的结果只有某一位不是1结果才是0，否则那一位必然是1
        result.push((n & (1 << i)) === 0 ? '0' : '1');
    }

    return result.join('');
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
export function generateArray(row: number, col: number, left = 1, right = 100): number[][] {
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
