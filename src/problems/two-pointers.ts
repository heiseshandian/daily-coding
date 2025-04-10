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
    closestMaxOrEqual = getClosestMaxOrEqual(
      people,
      limit,
      0,
      people.length - 1
    );
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

/* 
https://leetcode.com/problems/string-compression/

Given an array of characters chars, compress it using the following algorithm:

Begin with an empty string s. For each group of consecutive repeating characters in chars:

If the group's length is 1, append the character to s.
Otherwise, append the character followed by the group's length.
The compressed string s should not be returned separately, but instead, be stored in the input character array chars. 
Note that group lengths that are 10 or longer will be split into multiple characters in chars.

After you are done modifying the input array, return the new length of the array.

You must write an algorithm that uses only constant extra space.
*/
export function compress(chars: string[]): number {
  // 此处故意从后往前遍历，避免删除元素之后导致索引不对
  let prev = chars.length - 1;
  let next = prev - 1;
  let count = 1;
  const spliceChars = () => {
    chars.splice(next + 2, count - 1, ...`${count}`.split(''));
  };

  while (next >= 0) {
    if (chars[prev] === chars[next]) {
      next--;
      count++;
      continue;
    }

    if (count > 1) {
      spliceChars();
    }
    count = 1;
    prev = next;
    next--;
  }
  if (count > 1) {
    spliceChars();
  }

  return chars.length;
}

/*
https://leetcode.com/problems/heaters/description/
475. Heaters
Winter is coming! During the contest, your first job is to design a standard heater with a fixed warm radius to warm all the houses.

Every house can be warmed, as long as the house is within the heater's warm radius range. 

Given the positions of houses and heaters on a horizontal line, return the minimum radius standard of heaters so that those heaters could cover all houses.

Notice that all the heaters follow your radius standard, and the warm radius will the same.

Example 1:

Input: houses = [1,2,3], heaters = [2]
Output: 1
Explanation: The only heater was placed in the position 2, and if we use the radius 1 standard, then all the houses can be warmed.

Example 2:

Input: houses = [1,2,3,4], heaters = [1,4]
Output: 1
Explanation: The two heaters were placed at positions 1 and 4. We need to use a radius 1 standard, then all the houses can be warmed.

Example 3:

Input: houses = [1,5], heaters = [2]
Output: 3

Constraints:

	1 <= houses.length, heaters.length <= 10^4
	1 <= houses[i], heaters[i] <= 10^9
*/
export function findRadius(houses: number[], heaters: number[]): number {
  houses.sort((a, b) => a - b);
  heaters.sort((a, b) => a - b);

  let l = 0;
  let r = 0;
  let radius = 0;
  while (l < houses.length) {
    while (
      r + 1 < heaters.length &&
      Math.abs(heaters[r + 1] - houses[l]) <= Math.abs(heaters[r] - houses[l])
    ) {
      r++;
    }

    radius = Math.max(radius, Math.abs(heaters[r] - houses[l++]));
  }

  return radius;
}
