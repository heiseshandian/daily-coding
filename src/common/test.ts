/**
 * 生成指定长度的随机数组
 *
 * @param n 数组长度
 * @param v 数组最大值
 * @returns
 */
export function randomArray(n: number, v: number): number[] {
    const ret: number[] = Array(n);
    for (let i = 0; i < n; i++) {
        ret[i] = Math.floor(Math.random() * v) + 1;
    }

    return ret;
}
