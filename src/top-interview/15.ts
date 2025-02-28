// 给定一个数组，a,b,c是数组元素（不同位置），a+b+c=0，问数组中有多少不重复的三元组满足 a+b+c=0
export function threeSum(nums: number[]): number[][] {
  const map: Map<number, number> = new Map();
  for (let i = 0; i < nums.length; i++) {
    const prev = map.get(nums[i]) || 0;
    map.set(nums[i], prev + 1);
  }

  const result = [];
  const added: Set<string> = new Set();
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      const a = nums[i];
      const b = nums[j];
      const c = 0 - (a + b);
      const times = map.get(c) || 0;

      if (
        (c !== a && c !== b && times > 0) ||
        (c === a && c !== b && times > 1) ||
        (c !== a && c === b && times > 1) ||
        (c === a && c === b && times > 2)
      ) {
        const sorted = [a, b, c].sort((x, y) => x - y);
        const id = sorted.join();
        if (!added.has(id)) {
          added.add(id);
          result.push(sorted);
        }
      }
    }
  }

  return result;
}

export function threeSum2(nums: number[]): number[][] {
  nums.sort((a, b) => a - b);

  const result: number[][] = [];
  for (let i = 0; i < nums.length; i++) {
    // 跳过重复数字
    if (i > 0 && nums[i] === nums[i - 1]) {
      continue;
    }

    let left = i + 1;
    let right = nums.length - 1;
    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];
      if (sum > 0) {
        right--;
      } else if (sum < 0) {
        left++;
      } else {
        result.push([nums[i], nums[left], nums[right]]);
        left++;
        // 跳过重复数字
        while (left < right && nums[left] === nums[left - 1]) {
          left++;
        }
      }
    }
  }

  return result;
}
