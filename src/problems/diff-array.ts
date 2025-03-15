/* 
https://leetcode.com/problems/car-pooling/description/

There is a car with capacity empty seats. The vehicle only drives east (i.e., it cannot turn around and drive west).

You are given the integer capacity and an array trips where trips[i] = [numPassengersi, fromi, toi] indicates that 
the ith trip has numPassengersi passengers and the locations to pick them up and drop them off are fromi and toi respectively.
 The locations are given as the number of kilometers due east from the car's initial location.

Return true if it is possible to pick up and drop off all passengers for all the given trips, or false otherwise.

Input: trips = [[2,1,5],[3,3,7]], capacity = 4
Output: false

差分数组，用于支持区间操作
*/
export function carPooling(trips: number[][], capacity: number): boolean {
  let max = -Infinity;
  for (let i = 0; i < trips.length; i++) {
    max = Math.max(max, trips[i][2]);
  }

  const diff = new Array(max + 1).fill(0);
  for (let i = 0; i < trips.length; i++) {
    const [p, from, to] = trips[i];
    diff[from] += p;
    // to的时候就已经可以下车了
    diff[to] -= p;
  }

  if (diff[0] > capacity) {
    return false;
  }
  const original: number[] = [diff[0]];
  for (let i = 1; i < diff.length; i++) {
    original[i] = original[i - 1] + diff[i];
    if (original[i] > capacity) {
      return false;
    }
  }

  return true;
}

/*
https://leetcode.com/problems/corporate-flight-bookings/description/
1109. Corporate Flight Bookings
There are n flights that are labeled from 1 to n.

You are given an array of flight bookings bookings, where bookings[i] = [firsti, lasti, seatsi] represents a booking for flights firsti through lasti (inclusive) with seatsi seats reserved for each flight in the range.

Return an array answer of length n, where answer[i] is the total number of seats reserved for flight i.

Example 1:

Input: bookings = [[1,2,10],[2,3,20],[2,5,25]], n = 5
Output: [10,55,45,25,25]
Explanation:
Flight labels:        1   2   3   4   5
Booking 1 reserved:  10  10
Booking 2 reserved:      20  20
Booking 3 reserved:      25  25  25  25
Total seats:         10  55  45  25  25
Hence, answer = [10,55,45,25,25]

Example 2:

Input: bookings = [[1,2,10],[2,2,15]], n = 2
Output: [10,25]
Explanation:
Flight labels:        1   2
Booking 1 reserved:  10  10
Booking 2 reserved:      15
Total seats:         10  25
Hence, answer = [10,25]

Constraints:

    1 <= n <= 10^4
    1 <= bookings.length <= 10^4
    bookings[i].length == 3
    1 <= firsti <= lasti <= n
    1 <= seatsi <= 10^4
*/
export function corpFlightBookings(bookings: number[][], n: number): number[] {
  const result: number[] = Array(n).fill(0);
  bookings.forEach(([start, end, seats]) => {
    result[start - 1] += seats;
    if (end < n) {
      result[end] -= seats;
    }
  });

  for (let i = 1; i < n; i++) {
    result[i] += result[i - 1];
  }

  return result;
}

/*
https://leetcode.com/problems/zero-array-transformation-ii/description/?envType=daily-question&envId=2025-03-13
3356. Zero Array Transformation II
You are given an integer array nums of length n and a 2D array queries where queries[i] = [li, ri, vali].

Each queries[i] represents the following action on nums:

	Decrement the value at each index in the range [li, ri] in nums by at most vali.
	The amount by which each value is decremented can be chosen independently for each index.

A Zero Array is an array with all its elements equal to 0.

Return the minimum possible non-negative value of k, such that after processing the first k queries in sequence, nums becomes a Zero Array. If no such k exists, return -1.

Example 1:

Input: nums = [2,0,2], queries = [[0,2,1],[0,2,1],[1,1,3]]

Output: 2

Explanation:

	For i = 0 (l = 0, r = 2, val = 1):

		Decrement values at indices [0, 1, 2] by [1, 0, 1] respectively.
		The array will become [1, 0, 1].

	For i = 1 (l = 0, r = 2, val = 1):

		Decrement values at indices [0, 1, 2] by [1, 0, 1] respectively.
		The array will become [0, 0, 0], which is a Zero Array. Therefore, the minimum value of k is 2.

Example 2:

Input: nums = [4,3,2,1], queries = [[1,3,2],[0,2,1]]

Output: -1

Explanation:

	For i = 0 (l = 1, r = 3, val = 2):

		Decrement values at indices [1, 2, 3] by [2, 2, 1] respectively.
		The array will become [4, 1, 0, 0].

	For i = 1 (l = 0, r = 2, val = 1):

		Decrement values at indices [0, 1, 2] by [1, 1, 0] respectively.
		The array will become [3, 0, 0, 0], which is not a Zero Array.

Constraints:

	1 <= nums.length <= 10^5
	0 <= nums[i] <= 10^5
	1 <= queries.length <= 10^5
	queries[i].length == 3
	0 <= li <= ri < nums.length
	1 <= vali <= 5
*/
export function minZeroArray(nums: number[], queries: number[][]): number {
  // 检查数组是否已经是零数组
  if (nums.every((num) => num === 0)) {
    return 0;
  }

  const n = nums.length;
  let left = 0;
  let right = queries.length;
  let min = -1;

  while (left <= right) {
    const mid = left + ((right - left) >> 1);
    const diff = buildDifferenceArray(nums);

    for (let i = 0; i < mid; i++) {
      const [l, r, v] = queries[i];
      diff[l] -= v;
      if (r + 1 < n) {
        diff[r + 1] += v;
      }
    }

    let sum = 0;
    for (let i = 0; i < n; i++) {
      sum += diff[i];
      if (sum > 0) {
        break;
      }
    }

    if (sum <= 0) {
      min = mid;
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }

  return min;
}

function buildDifferenceArray(arr: number[]) {
  let n = arr.length;
  let diff = new Array(n).fill(0);
  diff[0] = arr[0];
  for (let i = 1; i < n; i++) {
    diff[i] = arr[i] - arr[i - 1];
  }
  return diff;
}
