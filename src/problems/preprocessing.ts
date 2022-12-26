/* 
给定一个长度大于7的数组，问能不能切成4个部分（用数组中的三个数将数组分成四部分，切中的数不计入部分和），且这四个部分的和相同

例：
3,3,9,1,5,8,6,7,1,5 
可以从9,8,7三个地方切开，切出的四个部分和都是6
*/
export function canSplit4Parts(arr: number[]): boolean {
    // 预处理结构，key是数组前i个位置的和，value是第i个位置
    const map: Map<number, number> = new Map();
    let sum = 0;

    for (let i = 0; i < arr.length; i++) {
        sum += arr[i];
        map.set(sum, i);
    }

    let lSum = arr[0];
    for (let i = 1; i < arr.length; i++) {
        const cut1 = i;
        const part1Sum = lSum;
        lSum += arr[i];

        let index = map.get(2 * part1Sum + arr[cut1]);
        if (!index) {
            continue;
        }

        const cut2 = index + 1;
        let index2 = map.get(3 * part1Sum + arr[cut1] + arr[cut2]);
        if (!index2) {
            continue;
        }

        const cut3 = index2 + 1;
        if (sum === 4 * part1Sum + arr[cut1] + arr[cut2] + arr[cut3]) {
            return true;
        }
    }

    return false;
}
