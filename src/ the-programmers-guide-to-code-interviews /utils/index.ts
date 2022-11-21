export function times(repeatTimes: number, fn: Function) {
    Array.from(Array(repeatTimes)).forEach(() => fn());
}
