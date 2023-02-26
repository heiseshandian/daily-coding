/* 
不基于比较的排序方式

计数排序，基数排序等
*/

// 假设arr中所有数字的顺序是0-200之间
// 直接原地排序
export function countSort(arr: number[]): number[] {
    const buckets = new Array(Math.max(...arr) + 1).fill(0);
    for (let i = 0; i < arr.length; i++) {
        buckets[arr[i]]++;
    }

    let k = 0;
    for (let i = 0; i < buckets.length; i++) {
        while (buckets[i] > 0) {
            arr[k++] = i;
            buckets[i]--;
        }
    }

    return arr;
}
