"""
https://leetcode.com/problems/maximum-number-of-tasks-you-can-assign/description/
2071. Maximum Number of Tasks You Can Assign
You have n tasks and m workers. Each task has a strength requirement stored in a 0-indexed integer array tasks, with the ith task requiring tasks[i] strength to complete. The strength of each worker is stored in a 0-indexed integer array workers, with the jth worker having workers[j] strength. Each worker can only be assigned to a single task and must have a strength greater than or equal to the task's strength requirement (i.e., workers[j] >= tasks[i]).

Additionally, you have pills magical pills that will increase a worker's strength by strength. You can decide which workers receive the magical pills, however, you may only give each worker at most one magical pill.

Given the 0-indexed integer arrays tasks and workers and the integers pills and strength, return the maximum number of tasks that can be completed.

Example 1:

Input: tasks = [3,2,1], workers = [0,3,3], pills = 1, strength = 1
Output: 3
Explanation:
We can assign the magical pill and tasks as follows:
- Give the magical pill to worker 0.
- Assign worker 0 to task 2 (0 + 1 >= 1)
- Assign worker 1 to task 1 (3 >= 2)
- Assign worker 2 to task 0 (3 >= 3)

Example 2:

Input: tasks = [5,4], workers = [0,0,0], pills = 1, strength = 5
Output: 1
Explanation:
We can assign the magical pill and tasks as follows:
- Give the magical pill to worker 0.
- Assign worker 0 to task 0 (0 + 5 >= 5)

Example 3:

Input: tasks = [10,15,30], workers = [0,10,10,10,10], pills = 3, strength = 10
Output: 2
Explanation:
We can assign the magical pills and tasks as follows:
- Give the magical pill to worker 0 and worker 1.
- Assign worker 0 to task 0 (0 + 10 >= 10)
- Assign worker 1 to task 1 (10 + 10 >= 15)
The last pill is not given because it will not make any worker strong enough for the last task.

Constraints:

	n == tasks.length
	m == workers.length
	1 <= n, m <= 10^4
	0 <= pills <= m
	0 <= tasks[i], workers[j], strength <= 10^9
"""
from typing import List
from collections import deque


class Solution:
    def maxTaskAssign(self, tasks: List[int], workers: List[int], pills: int, strength: int) -> int:
        tasks.sort()
        workers.sort(reverse=True)

        def can_solve(k: int) -> bool:
            w = 0
            p = pills
            q = deque[int]()
            for t in range(k - 1, -1, -1):
                if len(q) == 0 and workers[w] >= tasks[t]:
                    w += 1
                    continue
                if len(q) > 0 and q[0] >= tasks[t]:
                    q.popleft()
                    continue

                while w < k and workers[w] + strength >= tasks[t]:
                    q.append(workers[w])
                    w += 1
                if len(q) > 0 and p > 0:
                    q.pop()
                    p -= 1
                    continue
                return False
            return True

        left, right = 0, min(len(tasks), len(workers))
        closest = 0
        while left <= right:
            mid = (left + right) // 2
            if can_solve(mid):
                closest = mid
                left = mid + 1
            else:
                right = mid - 1

        return closest
