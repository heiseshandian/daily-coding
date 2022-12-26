/* 
因数只包含2,3,5的数字称之为丑数，1比较特殊，我们也认为是丑数，前面的丑数分别是 1,2,3,4,5,6,8,9,10,12
要求第n个丑数是多少？
 */
export function getNthUglyNumber(n: number): number {
    if (n === 1) {
        return 1;
    }

    const uglyNumbers = [1];

    let i2 = 0;
    let i3 = 0;
    let i5 = 0;
    while (uglyNumbers.length < n) {
        const nextI2 = uglyNumbers[i2] * 2;
        const nextI3 = uglyNumbers[i3] * 3;
        const nextI5 = uglyNumbers[i5] * 5;

        const nextUglyNumber = Math.min(nextI2, nextI3, nextI5);
        uglyNumbers.push(nextUglyNumber);

        if (nextUglyNumber === nextI2) {
            i2++;
        }
        if (nextUglyNumber === nextI3) {
            i3++;
        }
        if (nextUglyNumber === nextI5) {
            i5++;
        }
    }

    return uglyNumbers[uglyNumbers.length - 1];
}
