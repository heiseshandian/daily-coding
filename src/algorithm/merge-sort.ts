export function mergeSort(arr: number[]) {
    if (!arr || arr.length < 2) {
        return;
    }

    return recursiveMergeSort(arr, 0, arr.length - 1);
}

function recursiveMergeSort(arr: number[], left: number, right: number) {
    if (left === right) {
        return;
    }

    const mid = left + ((right - left) >> 1);
    recursiveMergeSort(arr, left, mid);
    recursiveMergeSort(arr, mid + 1, right);

    merge(arr, left, mid, right);
}

function merge(arr: number[], left: number, mid: number, right: number) {
    const temp = [];

    let leftIndex = left;
    let rightIndex = mid + 1;
    while (leftIndex <= mid && rightIndex <= right) {
        temp.push(arr[leftIndex] <= arr[rightIndex] ? arr[leftIndex++] : arr[rightIndex++]);
    }

    while (leftIndex <= mid) {
        temp.push(arr[leftIndex++]);
    }

    while (rightIndex <= right) {
        temp.push(arr[rightIndex++]);
    }

    for (let i = 0; i < temp.length; i++) {
        arr[left + i] = temp[i];
    }
}

export function mergeSort2(arr: number[]) {
    if (!arr || arr.length < 2) {
        return;
    }

    const len = arr.length;
    for (let k = 2; k <= len * 2; k *= 2) {
        for (let i = 0; i < len; i += k) {
            const left = i;
            const mid = i + (k >> 1) - 1;
            const right = Math.min(len - 1, i + k - 1);
            if (mid >= right) {
                break;
            }

            merge(arr, left, mid, right);
        }
    }
}

/* 
在一个数组中，一个数左边比它小的数的总和叫做数的小和，所有数的小和累加起来叫做数组小和。
比如说：对于数组 [1,3,4,2,5]
1左边比1小的数字：没有
3左边比3小的数字：1
4左边比4小的数字：1,3
2左边比2小的数字：1
5左边比5小的数字：1,3,4,2
所以数组小和就是1+1+3+1+1+3+4+2=16
 */
export function getMinSumOfArray(arr: number[]) {
    let sum = 0;
    for (let i = 1; i < arr.length; i++) {
        for (let j = 0; j < i; j++) {
            if (arr[j] < arr[i]) {
                sum += arr[j];
            }
        }
    }

    return sum;
}

export function getMinSumOfArray2(arr: number[]) {
    if (!arr || arr.length === 1) {
        return 0;
    }

    return recursiveMinSumOfArray(arr, 0, arr.length - 1);
}

function recursiveMinSumOfArray(arr: number[], left: number, right: number): number {
    if (left === right) {
        return 0;
    }

    const mid = left + ((right - left) >> 1);
    const leftSum = recursiveMinSumOfArray(arr, left, mid);
    const rightSum = recursiveMinSumOfArray(arr, mid + 1, right);
    const mergeSum = mergeGetMinSumOfArray(arr, left, mid, right);

    return leftSum + rightSum + mergeSum;
}

function mergeGetMinSumOfArray(arr: number[], left: number, mid: number, right: number) {
    const temp = [];
    let sum = 0;

    let leftIndex = left;
    let rightIndex = mid + 1;
    while (leftIndex <= mid && rightIndex <= right) {
        if (arr[leftIndex] < arr[rightIndex]) {
            sum += arr[leftIndex] * (right - rightIndex + 1);
            temp.push(arr[leftIndex++]);
        } else {
            temp.push(arr[rightIndex++]);
        }
    }

    while (leftIndex <= mid) {
        temp.push(arr[leftIndex++]);
    }

    while (rightIndex <= right) {
        temp.push(arr[rightIndex++]);
    }

    for (let i = 0; i < temp.length; i++) {
        arr[left + i] = temp[i];
    }

    return sum;
}

/* 逆序对问题
给定数组 [4,1,2,3,5,2]
4可以组合的逆序对是 [4,1],[4,2],[4,3],[4,2] 也就是4的右边有多少数比4小
1可以组合的逆序对是 无
2可以组合的逆序对是 无
3可以组合的逆序对是 [3,2]
5可以组合的逆序对是 [5,2]
总的逆序对就是 6
*/
export function getInversionPairCount(arr: number[]) {
    if (!arr || arr.length < 2) {
        return 0;
    }

    let count = 0;
    for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[i] > arr[j]) {
                count++;
            }
        }
    }

    return count;
}

export function getInversionPairCount2(arr: number[]) {
    if (!arr || arr.length < 2) {
        return 0;
    }

    return recursiveGetInversionPairCount(arr, 0, arr.length - 1);
}

function recursiveGetInversionPairCount(arr: number[], left: number, right: number): number {
    if (left === right) {
        return 0;
    }

    const mid = left + ((right - left) >> 1);
    const leftCount = recursiveGetInversionPairCount(arr, left, mid);
    const rightCount = recursiveGetInversionPairCount(arr, mid + 1, right);
    const mergeCount = mergeGetInversionPairCount(arr, left, mid, right);

    return leftCount + rightCount + mergeCount;
}

function mergeGetInversionPairCount(arr: number[], left: number, mid: number, right: number) {
    const temp = [];
    let sum = 0;

    let leftIndex = left;
    let rightIndex = mid + 1;
    while (leftIndex <= mid && rightIndex <= right) {
        if (arr[leftIndex] > arr[rightIndex]) {
            sum += mid - leftIndex + 1;
            temp.push(arr[rightIndex++]);
        } else {
            temp.push(arr[leftIndex++]);
        }
    }

    while (leftIndex <= mid) {
        temp.push(arr[leftIndex++]);
    }

    while (rightIndex <= right) {
        temp.push(arr[rightIndex++]);
    }

    for (let i = 0; i < temp.length; i++) {
        arr[left + i] = temp[i];
    }

    return sum;
}
