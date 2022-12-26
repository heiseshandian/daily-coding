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

/* 
给定一个无序数组，要求只能给其中一个子数组排序使得数组整体从小到大有序
例：
原数组 [1,5,4,3,2,6,7]
最小需要排序的子数组 [5,4,3,2]
*/
export function getMinArr(arr: number[]): number[] {
    if (!arr || arr.length < 2) {
        return arr;
    }

    let leftMax = arr[0];
    let rightEdge = 0;
    for (let i = 1; i < arr.length; i++) {
        if (leftMax > arr[i]) {
            rightEdge = i;
        }
        leftMax = Math.max(leftMax, arr[i]);
    }

    let rightMin = arr[arr.length - 1];
    let leftEdge = arr.length - 1;
    for (let i = arr.length - 2; i >= 0; i--) {
        if (rightMin < arr[i]) {
            leftEdge = i;
        }
        rightMin = Math.min(rightMin, arr[i]);
    }

    return arr.slice(leftEdge, rightEdge + 1);
}
