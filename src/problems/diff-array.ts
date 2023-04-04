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
