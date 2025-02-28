/* 
单调栈结构，用于求解每个数左边最近的比它大的数与右边最近的比它大的数字（最近的小同理）
*/
type MonotonousStackResult = Array<[number | undefined, number | undefined]>;

export function getClosestMaxArr(arr: number[]): MonotonousStackResult {
  return getClosestMaxOrMinArr(arr, true);
}

export function getClosestMinArr(arr: number[]): MonotonousStackResult {
  return getClosestMaxOrMinArr(arr, false);
}

function getClosestMaxOrMinArr(
  arr: number[],
  isMax = true
): MonotonousStackResult {
  // 单调栈本身从上到下严格从大到小，stack存储的是下标
  const stack: number[][] = [];

  // result也只存储位置信息，不存储具体的值
  const result: MonotonousStackResult = [];

  const generate = (biggerIndex: number | undefined) => {
    if (stack.length === 0) {
      return;
    }

    const top = stack[stack.length - 1];

    let before: number | undefined = undefined;
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

  let i = 0;
  while (i < arr.length) {
    // 如果栈为空则直接放
    if (stack.length === 0) {
      stack.push([i++]);
      continue;
    }

    // 取出当前栈顶元素的最后一个下标
    const top = stack[stack.length - 1];
    const lastIndex = top[top.length - 1];

    const condition = isMax ? arr[i] < arr[lastIndex] : arr[i] > arr[lastIndex];

    if (condition) {
      stack.push([i++]);
    } else if (arr[i] === arr[lastIndex]) {
      // 如果当前值与栈顶元素相等则修改栈顶元素
      top.push(i++);
    } else {
      generate(i);
    }
  }

  // 清算阶段
  while (stack.length > 0) {
    generate(undefined);
  }

  return result;
}
