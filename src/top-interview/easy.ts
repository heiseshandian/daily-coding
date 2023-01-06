export function searchInsert(nums: number[], target: number): number {
    let right = nums.length - 1;
    let left = 0;
    let mid = right - ((right - left) >> 1);

    while (left <= right) {
        mid = right - ((right - left) >> 1);
        if (nums[mid] === target) {
            return mid;
        }

        if (nums[mid] > target) {
            right = mid - 1;
        } else {
            left = mid + 1;
        }
    }

    return nums[mid] > target ? mid : mid + 1;
}
