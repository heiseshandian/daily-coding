import { getClosestMaxOrEqual } from '../common';

/* 
https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/

Given a 1-indexed array of integers numbers that is already sorted in non-decreasing order, 
find two numbers such that they add up to a specific target number. 
Let these two numbers be numbers[index1] and numbers[index2] where 1 <= index1 < index2 < numbers.length.

Return the indices of the two numbers, index1 and index2, added by one as an integer array [index1, index2] of length 2.

The tests are generated such that there is exactly one solution. You may not use the same element twice.

Your solution must use only constant extra space.
*/
export function twoSum(numbers: number[], target: number): number[] {
    let left = 0;
    let right = numbers.length - 1;
    while (left < right) {
        const sum = numbers[left] + numbers[right];
        if (sum === target) {
            return [left + 1, right + 1];
        }

        if (sum > target) {
            right--;
        } else {
            left++;
        }
    }

    return [];
}

/* 
https://leetcode.com/problems/container-with-most-water/description/

You are given an integer array height of length n. There are n vertical lines drawn such 
that the two endpoints of the ith line are (i, 0) and (i, height[i]).

Find two lines that together with the x-axis form a container, such that the container contains the most water.

Return the maximum amount of water a container can store.

Notice that you may not slant the container.
*/
export function maxArea(height: number[]): number {
    let max = 0;

    let left = 0;
    let right = height.length - 1;
    while (left < right) {
        max = Math.max(max, (right - left) * Math.min(height[left], height[right]));

        if (height[left] < height[right]) {
            left++;
        } else {
            right--;
        }
    }

    return max;
}

/* 
https://leetcode.com/problems/boats-to-save-people/

You are given an array people where people[i] is the weight of the ith person, and an infinite number 
of boats where each boat can carry a maximum weight of limit. Each boat carries at most two people 
at the same time, provided the sum of the weight of those people is at most limit.

Return the minimum number of boats to carry every given person.
*/
export function numRescueBoats(people: number[], limit: number): number {
    people.sort((a, b) => a - b);

    let count = 0;
    let closestMaxOrEqual = people.length;
    if (people[people.length - 1] >= limit) {
        closestMaxOrEqual = getClosestMaxOrEqual(people, limit, 0, people.length - 1);
        count += people.length - closestMaxOrEqual;
    }

    let left = 0;
    let right = closestMaxOrEqual - 1;
    while (left <= right) {
        if (people[left] + people[right] <= limit) {
            count++;
            left++;
            right--;
        } else {
            count++;
            right--;
        }
    }

    return count;
}
