export function times<T>(repeatTimes: number, fn: (args?: any) => T): T[] {
    return Array.from(Array(repeatTimes)).map(() => fn());
}

export function swap(arr: any[], a: number, b: number) {
    const temp = arr[a];
    arr[a] = arr[b];
    arr[b] = temp;
}

export function maxCommonFactor(a: number, b: number): number {
    if (a % b === 0) {
        return b;
    }

    return maxCommonFactor(b, a % b);
}
