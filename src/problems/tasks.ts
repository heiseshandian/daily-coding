import { GenericHeap } from '../algorithm/generic-heap';
/*
https://leetcode.com/problems/task-scheduler/description/
621. Task Scheduler
You are given an array of CPU tasks, each represented by letters A to Z, and a cooling time, n. Each cycle or interval allows the completion of one task. Tasks can be completed in any order, but there's a constraint: identical tasks must be separated by at least n intervals due to cooling time.

​Return the minimum number of intervals required to complete all tasks.

Example 1:

Input: tasks = ["A","A","A","B","B","B"], n = 2

Output: 8

Explanation: A possible sequence is: A -> B -> idle -> A -> B -> idle -> A -> B.

After completing task A, you must wait two cycles before doing A again. The same applies to task B. In the 3rd interval, neither A nor B can be done, so you idle. By the 4th cycle, you can do A again as 2 intervals have passed.

Example 2:

Input: tasks = ["A","C","A","B","D","B"], n = 1

Output: 6

Explanation: A possible sequence is: A -> B -> C -> D -> A -> B.

With a cooling interval of 1, you can repeat a task after just one other task.

Example 3:

Input: tasks = ["A","A","A", "B","B","B"], n = 3

Output: 10

Explanation: A possible sequence is: A -> B -> idle -> idle -> A -> B -> idle -> idle -> A -> B.

There are only two types of tasks, A and B, which need to be separated by 3 intervals. This leads to idling twice between repetitions of these tasks.

Constraints:

	1 <= tasks.length <= 10^4
	tasks[i] is an uppercase English letter.
	0 <= n <= 100
*/
export function leastInterval(tasks: string[], n: number): number {
    const map: Record<number, number> = {};
    tasks.forEach((v) => {
        map[v] = (map[v] || 0) + 1;
    });

    const heap = new GenericHeap((a, b) => b - a);
    heap.initHeap(Object.values(map));

    let count = 0;
    let cycle = n + 1;
    while (heap.size() > 0) {
        cycle = n + 1;
        const remainingTasks: number[] = [];
        while (cycle && heap.size() > 0) {
            const peek = heap.pop();
            if (peek - 1 > 0) {
                remainingTasks.push(peek - 1);
            }

            cycle--;
            count++;
        }

        remainingTasks.forEach((t) => {
            heap.push(t);
        });

        if (cycle > 0) {
            count += cycle;
        }
    }
    if (cycle > 0) {
        count -= cycle;
    }

    return count;
}
