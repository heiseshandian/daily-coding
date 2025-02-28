// 原地删除有序数组中的重复元素（不用移动元素，直接把元素放在前k个位置上即可）
export function removeDuplicates(nums: number[]): number {
  let prev = 0;

  for (let i = 1; i < nums.length; i++) {
    if (nums[i] !== nums[prev]) {
      prev++;
      nums[prev] = nums[i];
    }
  }

  return prev + 1;
}
