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
        const leftValue = arr[leftIndex];
        const rightValue = arr[rightIndex];
        if (leftValue <= rightValue) {
            leftIndex++;
            temp.push(leftValue);
        } else {
            rightIndex++;
            temp.push(rightValue);
        }
    }

    for (let i = leftIndex; i <= mid; i++) {
        temp.push(arr[i]);
    }

    for (let i = rightIndex; i <= right; i++) {
        temp.push(arr[i]);
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
