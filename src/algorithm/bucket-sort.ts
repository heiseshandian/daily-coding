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

// 基数排序
// 非负数，十进制
export function baseSort(arr: number[]): number[] {
    let max = Math.max(...arr);
    let count = 0;
    while (max !== 0) {
        count++;

        max = Math.floor(max / 10);
    }

    // 10个桶，桶中的内容先进先出
    const buckets: number[][] = new Array(10).fill(0).map((_) => []);

    let k = 1;
    while (k <= count) {
        const base = Math.pow(10, k);
        const divisor = base / 10;

        // 个位数，十位数，百位数分别入桶出桶
        for (let i = 0; i < arr.length; i++) {
            const cur = Math.floor((arr[i] % base) / divisor);
            buckets[cur].push(arr[i]);
        }

        let j = 0;
        // 出桶
        for (let i = 0; i < buckets.length; i++) {
            while (buckets[i].length > 0) {
                arr[j++] = buckets[i].shift()!;
            }
        }

        k++;
    }

    return arr;
}
