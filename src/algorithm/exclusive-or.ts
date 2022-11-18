export function getRightOne(num: number) {
    return num & (~num + 1);
}
