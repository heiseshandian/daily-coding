import { swap } from '../common';

export function quickSort(arr: number[]) {
    if (!arr || arr.length < 2) {
        return;
    }

    recursivePartition(arr, 0, arr.length - 1);
}

function recursivePartition(arr: number[], left: number, right: number) {
    if (left >= right) {
        return;
    }

    const numBetweenLeftAndRight = Math.ceil(Math.random() * (right - left)) + left;
    swap(arr, numBetweenLeftAndRight, right);

    const [leftIndexOfEqual, rightIndexOfEqual] = netherlandsFlags(arr, left, right);
    recursivePartition(arr, left, leftIndexOfEqual - 1);
    recursivePartition(arr, rightIndexOfEqual + 1, right);
}

function netherlandsFlags(
    arr: number[],
    left: number,
    right: number
): [leftIndexOfEqual: number, rightIndexOfEqual: number] {
    let less = left - 1;
    let more = right;

    for (let i = left; i < more; ) {
        if (arr[i] === arr[right]) {
            i++;
        } else if (arr[i] < arr[right]) {
            swap(arr, ++less, i++);
        } else {
            swap(arr, --more, i);
        }
    }

    swap(arr, more, right);

    return [less + 1, more];
}
