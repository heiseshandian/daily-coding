/*
https://leetcode.com/problems/daily-temperatures/description/
739. Daily Temperatures
Given an array of integers temperatures represents the daily temperatures, return an array answer such that answer[i] is the number of days you have to wait after the ith day to get a warmer temperature. If there is no future day for which this is possible, keep answer[i] == 0 instead.

Example 1:
Input: temperatures = [73,74,75,71,69,72,76,73]
Output: [1,1,4,2,1,1,0,0]
Example 2:
Input: temperatures = [30,40,50,60]
Output: [1,1,1,0]
Example 3:
Input: temperatures = [30,60,90]
Output: [1,1,0]

Constraints:

	1 <= temperatures.length <= 10^5
	30 <= temperatures[i] <= 100
*/
export function dailyTemperatures(temperatures: number[]): number[] {
  const ret = Array(temperatures.length).fill(0);
  const stack: number[] = [];
  temperatures.forEach((v, i) => {
    if (stack.length === 0 || v <= temperatures[stack.at(-1)!]) {
      stack.push(i);
      return;
    }

    while (stack.length > 0 && v > temperatures[stack.at(-1)!]) {
      const prev = stack.pop()!;
      ret[prev] = i - prev;
    }
    stack.push(i);
  });

  return ret;
}
