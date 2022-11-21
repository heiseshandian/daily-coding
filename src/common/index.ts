export function times<T>(repeatTimes: number, fn: (args?: any) => T): T[] {
    return Array.from(Array(repeatTimes)).map(() => fn());
}
