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

// 用一个等长的help数组来模拟入桶出桶操作
export function baseSort2(arr: number[]): number[] {
    let max = Math.max(...arr);
    let count = 0;
    while (max !== 0) {
        count++;

        max = Math.floor(max / 10);
    }

    let k = 1;
    while (k <= count) {
        const base = Math.pow(10, k);
        const divisor = base / 10;

        // 统计当前位出现了几次
        // 比如说2:1次，3:2次，4:3次
        const counts = new Array(10).fill(0);
        for (let i = 0; i < arr.length; i++) {
            const cur = Math.floor((arr[i] % base) / divisor);
            counts[cur]++;
        }

        // 统计小于等于当前位的一共有几个数
        // 小于等于2的一个，小于等于3的3个，小于等于4的6个
        const prefixSum = new Array(10).fill(0);
        prefixSum[0] = counts[0];
        for (let i = 1; i < counts.length; i++) {
            prefixSum[i] += prefixSum[i - 1] + counts[i];
        }

        // 从后往前遍历，如果按照入桶出桶的顺序，那么最后一个小于等于3的数字必然排在下标为2的位置
        // （因为小于等于3的一共有3个，而最后一个小于3的数字必然是最后一个入桶的），按照先入先出原则，最后一个小于3的必然最后出桶
        // 又因为小于等于3的数字一共才3个，所以最后出桶的数字必然在下标为2的位置上
        const help = [];
        for (let i = arr.length - 1; i >= 0; i--) {
            const cur = Math.floor((arr[i] % base) / divisor);
            help[--prefixSum[cur]] = arr[i];
        }

        // 最后把模拟出桶的数据copy进原数组即可
        for (let i = 0; i < help.length; i++) {
            arr[i] = help[i];
        }

        k++;
    }

    return arr;
}
