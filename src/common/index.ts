export function times<T>(repeatTimes: number, fn: (args?: any) => T): T[] {
    return Array.from(Array(repeatTimes)).map(() => fn());
}

export function swap(arr: any[], a: number, b: number) {
    const temp = arr[a];
    arr[a] = arr[b];
    arr[b] = temp;
}
