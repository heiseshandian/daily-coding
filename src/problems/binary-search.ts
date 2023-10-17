import { getClosestMaxOrEqual } from '../common';

/* 
https://leetcode.com/problems/sliding-window-median/

The median is the middle value in an ordered integer list. If the size of the list is even, 
there is no middle value. So the median is the mean of the two middle values.

For examples, if arr = [2,3,4], the median is 3.
For examples, if arr = [1,2,3,4], the median is (2 + 3) / 2 = 2.5.
You are given an integer array nums and an integer k. There is a sliding window of size k which is moving 
from the very left of the array to the very right. You can only see the k numbers in the window. 
Each time the sliding window moves right by one position.

Return the median array for each window in the original array. Answers within 10-5 of the actual value will be accepted.
*/
export function medianSlidingWindow(nums: number[], k: number): number[] {
    const window = nums.slice(0, k).sort((a, b) => a - b);
    const getMedian = () => {
        return (window[k >> 1] + window[(k - 1) >> 1]) / 2;
    };

    const result: number[] = [getMedian()];

    for (let i = k; i < nums.length; i++) {
        const toDelete = nums[i - k];
        if (toDelete === nums[i]) {
            result.push(getMedian());
            continue;
        }

        const toDeletePosition = getClosestMaxOrEqual(window, toDelete, 0, k - 1);
        window.splice(toDeletePosition, 1);

        const toInsertPosition = getClosestMaxOrEqual(window, nums[i], 0, k - 2);
        window.splice(toInsertPosition, 0, nums[i]);

        result.push(getMedian());
    }

    return result;
}
