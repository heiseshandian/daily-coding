export function reduce(arr, callback, initialValue) {
    let start = 0;
    if (initialValue === undefined) {
        initialValue = arr[0];
        start = 1;
    }

    let prev = initialValue;
    for (let i = start; i < arr.length; i++) {
        prev = callback(prev, arr[i], i, arr);
    }

    return prev;
}
