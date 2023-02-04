/* 
单调栈结构，用于求解每个数左边最近的比它大的数与右边最近的比它大的数字（最近的小同理）


*/
export function getClosestMaxArr(arr: number[]): Array<[number | undefined, number | undefined]> {
    // 单调栈本身从上到下严格从大到小，stack存储的是下标
    const stack: number[][] = [];

    // result也只存储位置信息，不存储具体的值
    const result: Array<[number | undefined, number | undefined]> = [];

    const generate = (biggerIndex: number | undefined) => {
        if (stack.length === 0) {
            return;
        }

        const top = stack[stack.length - 1];

        let before = undefined;
        if (stack.length >= 2) {
            const last = stack[stack.length - 2];
            before = last[last.length - 1];
        }

        let k = 0;
        while (k < top.length) {
            const index = top[k];
            result[index] = [before, biggerIndex];
            k++;
        }

        // 生成结束栈顶元素出栈
        stack.length--;
    };

    for (let i = 0; i < arr.length; i++) {
        // 如果栈为空则直接放
        if (stack.length === 0) {
            stack.push([i]);
            continue;
        }

        const top = stack[stack.length - 1];
        const lastIndex = top[top.length - 1];

        // 如果当前值比栈顶元素小则直接放
        if (arr[i] < arr[lastIndex]) {
            stack.push([i]);
        } else if (arr[i] === arr[lastIndex]) {
            // 如果当前值与栈顶元素相等则修改栈顶元素
            top.push(i);
        } else {
            // 如果大于就开始生成信息
            let topLastIndex = lastIndex;
            while (stack.length > 0 && arr[i] > arr[topLastIndex]) {
                generate(i);
                if (stack.length === 0) {
                    break;
                }

                const top = stack[stack.length - 1];
                topLastIndex = top[top?.length - 1];
            }

            stack.push([i]);
        }
    }

    // 清算阶段
    while (stack.length > 0) {
        generate(undefined);
    }

    return result;
}
