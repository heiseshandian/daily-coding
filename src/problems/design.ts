import { GenericHeap } from '../algorithm/generic-heap';
import { getCharIndex } from '../common';
import { PrefixTreeNode } from '../algorithm/prefix-tree';
/* 
https://leetcode.com/problems/find-median-from-data-stream/description/

The median is the middle value in an ordered integer list. If the size of the list is even, there is no middle value, 
and the median is the mean of the two middle values.

For example, for arr = [2,3,4], the median is 3.
For example, for arr = [2,3], the median is (2 + 3) / 2 = 2.5.
Implement the MedianFinder class:

MedianFinder() initializes the MedianFinder object.
void addNum(int num) adds the integer num from the data stream to the data structure.
double findMedian() returns the median of all elements so far. Answers within 10-5 of the actual answer will be accepted.

Input
["MedianFinder", "addNum", "addNum", "findMedian", "addNum", "findMedian"]
[[], [1], [2], [], [3], []]
Output
[null, null, null, 1.5, null, 2.0]
*/
export interface IMedianFinder {
    addNum: (num: number) => void;
    findMedian: () => number;
}

export class MedianFinder implements IMedianFinder {
    arr: number[] = [];

    addNum(num: number): void {
        if (this.arr.length === 0 || num < this.arr[0]) {
            this.arr.unshift(num);
            return;
        }

        let left = 0;
        let right = this.arr.length - 1;
        let closestMin = left;
        while (left <= right) {
            const mid = left + ((right - left) >> 1);
            if (this.arr[mid] === num) {
                closestMin = mid;
                break;
            }

            if (this.arr[mid] < num) {
                closestMin = mid;
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }

        const len = this.arr.length;
        for (let i = len; i >= closestMin + 1; i--) {
            this.arr[i] = this.arr[i - 1];
        }

        this.arr[closestMin + 1] = num;
    }

    findMedian(): number {
        const len = this.arr.length;
        if (len & 1) {
            return this.arr[len >> 1];
        } else {
            const mid = len >> 1;
            const left = mid - 1;

            return (this.arr[mid] + this.arr[left]) / 2;
        }
    }
}

/* 
将数组分成两部分，左半部分用大顶堆存储，右半部分用小顶堆存储
如果总的数据有奇数个则用右半部分多存储一个
*/
export class MedianFinder2 implements IMedianFinder {
    leftMaxHeap: GenericHeap = new GenericHeap((a, b) => b - a);
    rightMinHeap: GenericHeap = new GenericHeap();

    addNum(num: number) {
        if (this.rightMinHeap.size() === 0) {
            this.rightMinHeap.push(num);
            return;
        }

        const len = this.leftMaxHeap.size() + this.rightMinHeap.size();
        if (len & 1) {
            // num 和 rightMin中较小的一个需要放进leftMaxHeap中
            const rightMin = this.rightMinHeap.peek();
            if (num <= rightMin) {
                this.leftMaxHeap.push(num);
            } else {
                this.rightMinHeap.pop();
                this.rightMinHeap.push(num);
                this.leftMaxHeap.push(rightMin);
            }
        } else {
            // num和leftMax中较大的一个需要放进rightMinHeap中
            const leftMax = this.leftMaxHeap.peek();
            if (num >= leftMax) {
                this.rightMinHeap.push(num);
            } else {
                this.leftMaxHeap.pop();
                this.rightMinHeap.push(leftMax);
                this.leftMaxHeap.push(num);
            }
        }
    }

    findMedian(): number {
        const len = this.leftMaxHeap.size() + this.rightMinHeap.size();
        if (len & 1) {
            return this.rightMinHeap.peek();
        }

        return (this.leftMaxHeap.peek() + this.rightMinHeap.peek()) / 2;
    }
}

/* 
https://leetcode.com/problems/design-add-and-search-words-data-structure/

Design a data structure that supports adding new words and finding if a string matches any previously added string.

Implement the WordDictionary class:

WordDictionary() Initializes the object.
void addWord(word) Adds word to the data structure, it can be matched later.
bool search(word) Returns true if there is any string in the data structure that matches word or false otherwise. 
word may contain dots '.' where dots can be matched with any letter.
*/
export class WordDictionary {
    root: PrefixTreeNode;

    constructor() {
        this.root = new PrefixTreeNode();
    }

    addWord(word: string): void {
        let node = this.root;
        node.pass++;

        for (let i = 0; i < word.length; i++) {
            const index = getCharIndex(word[i]);
            if (!node.nextNodes[index]) {
                node.nextNodes[index] = new PrefixTreeNode();
            }
            node = node.nextNodes[index];
            node.pass++;
        }

        node.end++;
    }

    search(word: string, node = this.root): boolean {
        for (let i = 0; i < word.length; i++) {
            if (word[i] !== '.') {
                const index = getCharIndex(word[i]);
                if (!node.nextNodes[index]) {
                    return false;
                }
                node = node.nextNodes[index];
            } else {
                return node.nextNodes.some((n) =>
                    this.search(word.slice(i + 1), n)
                );
            }
        }

        return node.end !== 0;
    }
}

// 简化信息，不需要记录pass信息
export class WordDictionary2 {
    root: Record<string, any>;

    constructor() {
        this.root = {};
    }

    addWord(word: string): void {
        let node = this.root;

        for (let i = 0; i < word.length; i++) {
            const char = word[i];
            if (!node[char]) {
                node[char] = {};
            }
            node = node[char];
        }

        node['$'] = true;
    }

    search(word: string, node = this.root): boolean {
        for (let i = 0; i < word.length; i++) {
            if (word[i] !== '.') {
                const char = word[i];
                if (!node[char]) {
                    return false;
                }
                node = node[char];
            } else {
                return Object.keys(node)
                    .filter((key) => key !== '$')
                    .some((k) => this.search(word.slice(i + 1), node[k]));
            }
        }

        return Boolean(node['$']);
    }
}

/*
https://leetcode.com/problems/execute-asynchronous-functions-in-parallel/description/
2721. Execute Asynchronous Functions in Parallel
Given an array of asynchronous functions functions, return a new promise promise. Each function in the array accepts no arguments and returns a promise. All the promises should be executed in parallel.

promise resolves:

	When all the promises returned from functions were resolved successfully in parallel. 
    The resolved value of promise should be an array of all the resolved values of promises in the same order 
    as they were in the functions. The promise should resolve when all the asynchronous functions in the array have completed execution in parallel.

promise rejects:

	When any of the promises returned from functions were rejected. 
    promise should also reject with the reason of the first rejection.

Please solve it without using the built-in Promise.all function.

Example 1:

Input: functions = [
  () => new Promise(resolve => setTimeout(() => resolve(5), 200))
]
Output: {"t": 200, "resolved": [5]}
Explanation: 
promiseAll(functions).then(console.log); // [5]

The single function was resolved at 200ms with a value of 5.

Example 2:

Input: functions = [
    () => new Promise(resolve => setTimeout(() => resolve(1), 200)), 
    () => new Promise((resolve, reject) => setTimeout(() => reject("Error"), 100))
]
Output: {"t": 100, "rejected": "Error"}
Explanation: Since one of the promises rejected, the returned promise also rejected with the same error at the same time.

Example 3:

Input: functions = [
    () => new Promise(resolve => setTimeout(() => resolve(4), 50)), 
    () => new Promise(resolve => setTimeout(() => resolve(10), 150)), 
    () => new Promise(resolve => setTimeout(() => resolve(16), 100))
]
Output: {"t": 150, "resolved": [4, 10, 16]}
Explanation: All the promises resolved with a value. The returned promise resolved when the last promise resolved.

Constraints:

	functions is an array of functions that returns promises
	1 <= functions.length <= 10
*/
type Fn<T> = () => Promise<T>;

export function promiseAll<T>(functions: Fn<T>[]): Promise<T[]> {
    let resolveFn: (value: T[] | PromiseLike<T[]>) => void;
    let rejectFn: (reason?: any) => void;

    const result: T[] = new Array(functions.length);
    let successCount = 0;

    functions.forEach((fn, i) => {
        fn()
            .then((val) => {
                result[i] = val;
                successCount++;

                if (successCount === functions.length) {
                    resolveFn(result);
                }
            })
            .catch((reason) => {
                rejectFn(reason);
            });
    });

    return new Promise((resolve, reject) => {
        resolveFn = resolve;
        rejectFn = reject;
    });
}

/*
https://leetcode.com/problems/frequency-tracker/
2671. Frequency Tracker
Design a data structure that keeps track of the values in it and answers some queries regarding their frequencies.

Implement the FrequencyTracker class.

	FrequencyTracker(): Initializes the FrequencyTracker object with an empty array initially.
	void add(int number): Adds number to the data structure.
	void deleteOne(int number): Deletes one occurrence of number from the data structure. The data structure may not contain number, and in this case nothing is deleted.
	bool hasFrequency(int frequency): Returns true if there is a number in the data structure that occurs frequency number of times, otherwise, it returns false.

Example 1:

Input
["FrequencyTracker", "add", "add", "hasFrequency"]
[[], [3], [3], [2]]
Output
[null, null, null, true]

Explanation
FrequencyTracker frequencyTracker = new FrequencyTracker();
frequencyTracker.add(3); // The data structure now contains [3]
frequencyTracker.add(3); // The data structure now contains [3, 3]
frequencyTracker.hasFrequency(2); // Returns true, because 3 occurs twice

Example 2:

Input
["FrequencyTracker", "add", "deleteOne", "hasFrequency"]
[[], [1], [1], [1]]
Output
[null, null, null, false]

Explanation
FrequencyTracker frequencyTracker = new FrequencyTracker();
frequencyTracker.add(1); // The data structure now contains [1]
frequencyTracker.deleteOne(1); // The data structure becomes empty []
frequencyTracker.hasFrequency(1); // Returns false, because the data structure is empty

Example 3:

Input
["FrequencyTracker", "hasFrequency", "add", "hasFrequency"]
[[], [2], [3], [1]]
Output
[null, false, null, true]

Explanation
FrequencyTracker frequencyTracker = new FrequencyTracker();
frequencyTracker.hasFrequency(2); // Returns false, because the data structure is empty
frequencyTracker.add(3); // The data structure now contains [3]
frequencyTracker.hasFrequency(1); // Returns true, because 3 occurs once

Constraints:

	1 <= number <= 10^5
	1 <= frequency <= 10^5
	At most, 2 * 10^5 calls will be made to add, deleteOne, and hasFrequency in total.
*/
export class FrequencyTracker {
    private map: Record<number, number>;
    private freqMap: Record<number, Set<number>>;

    private updateFreqMap(prevFreq: number, nextFreq: number, number: number) {
        this.freqMap[prevFreq]?.delete(number);
        if (this.freqMap[prevFreq]?.size === 0) {
            delete this.freqMap[prevFreq];
        }

        (this.freqMap[nextFreq] || (this.freqMap[nextFreq] = new Set())).add(
            number
        );
    }

    constructor() {
        this.map = {};
        this.freqMap = {};
    }

    add(number: number): void {
        const prevFreq = this.map[number] || 0;
        this.map[number] = prevFreq + 1;

        this.updateFreqMap(prevFreq, prevFreq + 1, number);
    }

    deleteOne(number: number): void {
        const prevFreq = this.map[number];
        if (!prevFreq) {
            return;
        }

        this.map[number]--;
        if (this.map[number] === 0) {
            delete this.map[number];
        }

        this.updateFreqMap(prevFreq, prevFreq - 1, number);
    }

    hasFrequency(frequency: number): boolean {
        return this.freqMap[frequency] !== undefined;
    }
}

/*
https://leetcode.com/problems/interval-cancellation/description/
2725. Interval Cancellation
Given a function fn, an array of arguments args, and an interval time t, return a cancel function cancelFn.

After a delay of cancelTimeMs, the returned cancel function cancelFn will be invoked.

setTimeout(cancelFn, cancelTimeMs)

The function fn should be called with args immediately and then called again every t milliseconds until cancelFn is called at cancelTimeMs ms.

Example 1:

Input: fn = (x) => x * 2, args = [4], t = 35
Output: 
[
   {"time": 0, "returned": 8},
   {"time": 35, "returned": 8},
   {"time": 70, "returned": 8},
   {"time": 105, "returned": 8},
   {"time": 140, "returned": 8},
   {"time": 175, "returned": 8}
]
Explanation: 
const cancelTimeMs = 190;
const cancelFn = cancellable((x) => x * 2, [4], 35);
setTimeout(cancelFn, cancelTimeMs);

Every 35ms, fn(4) is called. Until t=190ms, then it is cancelled.
1st fn call is at 0ms. fn(4) returns 8.
2nd fn call is at 35ms. fn(4) returns 8.
3rd fn call is at 70ms. fn(4) returns 8.
4th fn call is at 105ms. fn(4) returns 8.
5th fn call is at 140ms. fn(4) returns 8.
6th fn call is at 175ms. fn(4) returns 8.
Cancelled at 190ms

Example 2:

Input: fn = (x1, x2) => (x1 * x2), args = [2, 5], t = 30
Output: 
[
   {"time": 0, "returned": 10},
   {"time": 30, "returned": 10},
   {"time": 60, "returned": 10},
   {"time": 90, "returned": 10},
   {"time": 120, "returned": 10},
   {"time": 150, "returned": 10}
]
Explanation: 
const cancelTimeMs = 165; 
const cancelFn = cancellable((x1, x2) => (x1 * x2), [2, 5], 30) 
setTimeout(cancelFn, cancelTimeMs)

Every 30ms, fn(2, 5) is called. Until t=165ms, then it is cancelled.
1st fn call is at 0ms 
2nd fn call is at 30ms 
3rd fn call is at 60ms 
4th fn call is at 90ms 
5th fn call is at 120ms 
6th fn call is at 150ms
Cancelled at 165ms

Example 3:

Input: fn = (x1, x2, x3) => (x1 + x2 + x3), args = [5, 1, 3], t = 50
Output: 
[
   {"time": 0, "returned": 9},
   {"time": 50, "returned": 9},
   {"time": 100, "returned": 9},
   {"time": 150, "returned": 9}
]
Explanation: 
const cancelTimeMs = 180;
const cancelFn = cancellable((x1, x2, x3) => (x1 + x2 + x3), [5, 1, 3], 50)
setTimeout(cancelFn, cancelTimeMs)

Every 50ms, fn(5, 1, 3) is called. Until t=180ms, then it is cancelled. 
1st fn call is at 0ms
2nd fn call is at 50ms
3rd fn call is at 100ms
4th fn call is at 150ms
Cancelled at 180ms

Constraints:

	fn is a function
	args is a valid JSON array
	1 <= args.length <= 10
	30 <= t <= 100
	10 <= cancelTimeMs <= 500
*/
type JSONValue =
    | null
    | boolean
    | number
    | string
    | JSONValue[]
    | { [key: string]: JSONValue };
type VoidFn = (...args: JSONValue[]) => void;

export function cancellable(
    fn: VoidFn,
    args: JSONValue[],
    t: number
): Function {
    fn.apply(this, args);

    let interval = setInterval(() => {
        fn.apply(this, args);
    }, t);

    return () => {
        clearInterval(interval);
    };
}

/*
https://leetcode.com/problems/random-pick-index/description/
398. Random Pick Index
Given an integer array nums with possible duplicates, randomly output the index of a given target number. You can assume that 
the given target number must exist in the array.

Implement the Solution class:

	Solution(int[] nums) Initializes the object with the array nums.
	int pick(int target) Picks a random index i from nums where nums[i] == target. If there are multiple valid i's, then each 
    index should have an equal probability of returning.

Example 1:

Input
["Solution", "pick", "pick", "pick"]
[[[1, 2, 3, 3, 3]], [3], [1], [3]]
Output
[null, 4, 0, 2]

Explanation
Solution solution = new Solution([1, 2, 3, 3, 3]);
solution.pick(3); // It should return either index 2, 3, or 4 randomly. Each index should have equal probability of returning.
solution.pick(1); // It should return 0. Since in the array only nums[0] is equal to 1.
solution.pick(3); // It should return either index 2, 3, or 4 randomly. Each index should have equal probability of returning.

Constraints:

	1 <= nums.length <= 10^4
	2^31 <= nums[i] <= 2^31 - 1
	target is an integer from nums.
	At most 104 calls will be made to pick.
*/
export class Solution {
    private numIndexes: Record<number, number[]> = {};

    constructor(nums: number[]) {
        nums.forEach((v, i) => {
            if (!this.numIndexes[v]) {
                this.numIndexes[v] = [];
            }

            this.numIndexes[v].push(i);
        });
    }

    pick(target: number): number {
        const indexes = this.numIndexes[target];
        const len = indexes.length;
        if (len === 1) {
            return indexes[0];
        }

        const index = Math.floor(Math.random() * len);
        return indexes[index];
    }
}

/*
https://leetcode.com/problems/calculator-with-method-chaining/description/
2726. Calculator with Method Chaining
Design a Calculator class. The class should provide the mathematical operations of addition, subtraction, multiplication, division, and exponentiation. It should also allow consecutive operations to be performed using method chaining. The Calculator class constructor should accept a number which serves as the initial value of result.

Your Calculator class should have the following methods:

	add - This method adds the given number value to the result and returns the updated Calculator.
	subtract - This method subtracts the given number value from the result and returns the updated Calculator.
	multiply - This method multiplies the result  by the given number value and returns the updated Calculator.
	divide - This method divides the result by the given number value and returns the updated Calculator. If the passed value is 0, an error "Division by zero is not allowed" should be thrown.
	power - This method raises the result to the power of the given number value and returns the updated Calculator.
	getResult - This method returns the result.

Solutions within 10-5 of the actual result are considered correct.

Example 1:

Input: 
actions = ["Calculator", "add", "subtract", "getResult"], 
values = [10, 5, 7]
Output: 8
Explanation: 
new Calculator(10).add(5).subtract(7).getResult() // 10 + 5 - 7 = 8

Example 2:

Input: 
actions = ["Calculator", "multiply", "power", "getResult"], 
values = [2, 5, 2]
Output: 100
Explanation: 
new Calculator(2).multiply(5).power(2).getResult() // (2 * 5) ^ 2 = 100

Example 3:

Input: 
actions = ["Calculator", "divide", "getResult"], 
values = [20, 0]
Output: "Division by zero is not allowed"
Explanation: 
new Calculator(20).divide(0).getResult() // 20 / 0 

The error should be thrown because we cannot divide by zero.

Constraints:

	actions is a valid JSON array of strings
	values is a valid JSON array of numbers
	2 <= actions.length <= 10^4
	1 <= values.length <= 10^4 - 1
	actions[i] is one of "Calculator", "add", "subtract", "multiply", "divide", "power", and "getResult"
	First action is always "Calculator"
	Last action is always "getResult"
*/
export class Calculator {
    val: number;

    constructor(value: number) {
        this.val = value;
    }

    add(value: number): Calculator {
        this.val += value;
        return this;
    }

    subtract(value: number): Calculator {
        this.val -= value;
        return this;
    }

    multiply(value: number): Calculator {
        this.val *= value;
        return this;
    }

    divide(value: number): Calculator {
        if (value === 0) {
            throw new Error('Division by zero is not allowed');
        }

        this.val /= value;
        return this;
    }

    power(value: number): Calculator {
        this.val = Math.pow(this.val, value);
        return this;
    }

    getResult(): number {
        return this.val;
    }
}

/*
https://leetcode.com/problems/design-linked-list/description/?envType=list&envId=o5cftq05
707. Design Linked List
Design your implementation of the linked list. You can choose to use a singly or doubly linked list.
A node in a singly linked list should have two attributes: val and next. val is the value of the current node, and next is a pointer/reference to the next node.
If you want to use the doubly linked list, you will need one more attribute prev to indicate the previous node in the linked list. Assume all nodes in the linked list are 0-indexed.

Implement the MyLinkedList class:

	MyLinkedList() Initializes the MyLinkedList object.
	int get(int index) Get the value of the indexth node in the linked list. If the index is invalid, return -1.
	void addAtHead(int val) Add a node of value val before the first element of the linked list. After the insertion, the new node will be the first node of the linked list.
	void addAtTail(int val) Append a node of value val as the last element of the linked list.
	void addAtIndex(int index, int val) Add a node of value val before the indexth node in the linked list. If index equals the length of the linked list, the node will be appended to the end of the linked list. If index is greater than the length, the node will not be inserted.
	void deleteAtIndex(int index) Delete the indexth node in the linked list, if the index is valid.

Example 1:

Input
["MyLinkedList", "addAtHead", "addAtTail", "addAtIndex", "get", "deleteAtIndex", "get"]
[[], [1], [3], [1, 2], [1], [1], [1]]
Output
[null, null, null, null, 2, null, 3]

Explanation
MyLinkedList myLinkedList = new MyLinkedList();
myLinkedList.addAtHead(1);
myLinkedList.addAtTail(3);
myLinkedList.addAtIndex(1, 2);    // linked list becomes 1->2->3
myLinkedList.get(1);              // return 2
myLinkedList.deleteAtIndex(1);    // now the linked list is 1->3
myLinkedList.get(1);              // return 3

Constraints:

	0 <= index, val <= 1000
	Please do not use the built-in LinkedList library.
	At most 2000 calls will be made to get, addAtHead, addAtTail, addAtIndex and deleteAtIndex.
*/
class MyLinkedListNode {
    val: number;
    next: MyLinkedListNode | null = null;

    constructor(val: number) {
        this.val = val;
    }
}

export class MyLinkedList {
    private head: MyLinkedListNode | null;
    private tail: MyLinkedListNode | null;
    private size: number;

    constructor() {
        this.head = null;
        this.tail = null;
        this.size = 0;
    }

    get(index: number): number {
        let cur = this.head;
        let i = 0;
        while (i < index && cur) {
            cur = cur.next;
            i++;
        }

        return cur?.val ?? -1;
    }

    addAtHead(val: number): void {
        const node = new MyLinkedListNode(val);
        if (!this.head) {
            this.head = node;
            this.tail = node;
            this.size++;
            return;
        }

        node.next = this.head;
        this.head = node;
        this.size++;
    }

    addAtTail(val: number): void {
        const node = new MyLinkedListNode(val);
        if (!this.tail) {
            this.head = node;
            this.tail = node;
            this.size++;
            return;
        }

        this.tail.next = node;
        this.tail = node;
        this.size++;
    }

    addAtIndex(index: number, val: number): void {
        if (index > this.size) {
            return;
        }
        if (index === 0) {
            this.addAtHead(val);
            return;
        }
        if (index === this.size) {
            this.addAtTail(val);
            return;
        }

        const node = new MyLinkedListNode(val);

        let cur = this.head;
        let i = 1;
        while (i < index && cur) {
            cur = cur.next;
            i++;
        }

        const next = cur!.next;
        cur!.next = node;
        node.next = next;
        this.size++;
    }

    deleteAtIndex(index: number): void {
        if (index < 0 || index >= this.size) {
            return;
        }
        if (this.size === 1) {
            this.head = null;
            this.tail = null;
            this.size = 0;
            return;
        }
        if (index === 0) {
            this.head = this.head!.next;
            this.size--;
            return;
        }

        let i = 1;
        let cur = this.head;
        while (i < index && cur) {
            cur = cur.next;
            i++;
        }

        if (index === this.size - 1) {
            this.tail = cur;
        }
        cur!.next = cur!.next!.next;
        this.size--;
    }
}

/*
https://leetcode.com/problems/design-underground-system/description/?envType=list&envId=o5cftq05
1396. Design Underground System
An underground railway system is keeping track of customer travel times between different stations. They are using this data to calculate the average time it takes to travel from one station to another.

Implement the UndergroundSystem class:

	void checkIn(int id, string stationName, int t)

		A customer with a card ID equal to id, checks in at the station stationName at time t.
		A customer can only be checked into one place at a time.

	void checkOut(int id, string stationName, int t)

		A customer with a card ID equal to id, checks out from the station stationName at time t.

	double getAverageTime(string startStation, string endStation)

		Returns the average time it takes to travel from startStation to endStation.
		The average time is computed from all the previous traveling times from startStation to endStation that happened directly, meaning a check in at startStation followed by a check out from endStation.
		The time it takes to travel from startStation to endStation may be different from the time it takes to travel from endStation to startStation.
		There will be at least one customer that has traveled from startStation to endStation before getAverageTime is called.

You may assume all calls to the checkIn and checkOut methods are consistent. If a customer checks in at time t1 then checks out at time t2, then t1 < t2. All events happen in chronological order.

Example 1:

Input
["UndergroundSystem","checkIn","checkIn","checkIn","checkOut","checkOut","checkOut","getAverageTime","getAverageTime","checkIn","getAverageTime","checkOut","getAverageTime"]
[[],[45,"Leyton",3],[32,"Paradise",8],[27,"Leyton",10],[45,"Waterloo",15],[27,"Waterloo",20],[32,"Cambridge",22],["Paradise","Cambridge"],["Leyton","Waterloo"],[10,"Leyton",24],["Leyton","Waterloo"],[10,"Waterloo",38],["Leyton","Waterloo"]]

Output
[null,null,null,null,null,null,null,14.00000,11.00000,null,11.00000,null,12.00000]

Explanation
UndergroundSystem undergroundSystem = new UndergroundSystem();
undergroundSystem.checkIn(45, "Leyton", 3);
undergroundSystem.checkIn(32, "Paradise", 8);
undergroundSystem.checkIn(27, "Leyton", 10);
undergroundSystem.checkOut(45, "Waterloo", 15);  // Customer 45 "Leyton" -> "Waterloo" in 15-3 = 12
undergroundSystem.checkOut(27, "Waterloo", 20);  // Customer 27 "Leyton" -> "Waterloo" in 20-10 = 10
undergroundSystem.checkOut(32, "Cambridge", 22); // Customer 32 "Paradise" -> "Cambridge" in 22-8 = 14
undergroundSystem.getAverageTime("Paradise", "Cambridge"); // return 14.00000. One trip "Paradise" -> "Cambridge", (14) / 1 = 14
undergroundSystem.getAverageTime("Leyton", "Waterloo");    // return 11.00000. Two trips "Leyton" -> "Waterloo", (10 + 12) / 2 = 11
undergroundSystem.checkIn(10, "Leyton", 24);
undergroundSystem.getAverageTime("Leyton", "Waterloo");    // return 11.00000
undergroundSystem.checkOut(10, "Waterloo", 38);  // Customer 10 "Leyton" -> "Waterloo" in 38-24 = 14
undergroundSystem.getAverageTime("Leyton", "Waterloo");    // return 12.00000. Three trips "Leyton" -> "Waterloo", (10 + 12 + 14) / 3 = 12

Example 2:

Input
["UndergroundSystem","checkIn","checkOut","getAverageTime","checkIn","checkOut","getAverageTime","checkIn","checkOut","getAverageTime"]
[[],[10,"Leyton",3],[10,"Paradise",8],["Leyton","Paradise"],[5,"Leyton",10],[5,"Paradise",16],["Leyton","Paradise"],[2,"Leyton",21],[2,"Paradise",30],["Leyton","Paradise"]]

Output
[null,null,null,5.00000,null,null,5.50000,null,null,6.66667]

Explanation
UndergroundSystem undergroundSystem = new UndergroundSystem();
undergroundSystem.checkIn(10, "Leyton", 3);
undergroundSystem.checkOut(10, "Paradise", 8); // Customer 10 "Leyton" -> "Paradise" in 8-3 = 5
undergroundSystem.getAverageTime("Leyton", "Paradise"); // return 5.00000, (5) / 1 = 5
undergroundSystem.checkIn(5, "Leyton", 10);
undergroundSystem.checkOut(5, "Paradise", 16); // Customer 5 "Leyton" -> "Paradise" in 16-10 = 6
undergroundSystem.getAverageTime("Leyton", "Paradise"); // return 5.50000, (5 + 6) / 2 = 5.5
undergroundSystem.checkIn(2, "Leyton", 21);
undergroundSystem.checkOut(2, "Paradise", 30); // Customer 2 "Leyton" -> "Paradise" in 30-21 = 9
undergroundSystem.getAverageTime("Leyton", "Paradise"); // return 6.66667, (5 + 6 + 9) / 3 = 6.66667

Constraints:

	1 <= id, t <= 10^6
	1 <= stationName.length, startStation.length, endStation.length <= 10
	All strings consist of uppercase and lowercase English letters and digits.
	There will be at most 2 * 104 calls in total to checkIn, checkOut, and getAverageTime.
	Answers within 10-5 of the actual value will be accepted.
*/
export class UndergroundSystem {
    private checkMap: Map<number, [stationName: string, t: number]>;
    private durationMap: Map<string, [duration: number, count: number]>;

    constructor() {
        this.checkMap = new Map();
        this.durationMap = new Map();
    }

    checkIn(id: number, stationName: string, t: number): void {
        this.checkMap.set(id, [stationName, t]);
    }

    checkOut(id: number, stationName: string, t: number): void {
        const [startStation, startTime] = this.checkMap.get(id)!;

        const durationId = `${startStation},${stationName}`;
        const [duraation, count] = this.durationMap.get(durationId) ?? [0, 0];
        this.durationMap.set(durationId, [
            duraation + t - startTime,
            count + 1,
        ]);
    }

    getAverageTime(startStation: string, endStation: string): number {
        const id = `${startStation},${endStation}`;
        const [duration, count] = this.durationMap.get(id)!;

        return duration / count;
    }
}

/*
https://leetcode.com/problems/call-function-with-custom-context/description/
2693. Call Function with Custom Context
Enhance all functions to have the callPolyfill method. The method accepts an object obj as it's first parameter and any number of additional arguments. The obj becomes the this context for the function. The additional arguments are passed to the function (that the callPolyfill method belongs on).

For example if you had the function:

function tax(price, taxRate) {
  const totalCost = price * (1 + taxRate);
  console.log(`The cost of ${this.item} is ${totalCost}`);
}

Calling this function like tax(10, 0.1) will log "The cost of undefined is 11". This is because the this context was not defined.

However, calling the function like tax.callPolyfill({item: "salad"}, 10, 0.1) will log "The cost of salad is 11". The this context was appropriately set, and the function logged an appropriate output.

Please solve this without using the built-in Function.call method.

Example 1:

Input:
fn = function add(b) {
  return this.a + b;
}
args = [{"a": 5}, 7]
Output: 12
Explanation:
fn.callPolyfill({"a": 5}, 7); // 12
callPolyfill sets the "this" context to {"a": 5}. 7 is passed as an argument.

Example 2:

Input: 
fn = function tax(price, taxRate) { 
 return `The cost of the ${this.item} is ${price * taxRate}`; 
}
args = [{"item": "burger"}, 10, 1.1]
Output: "The cost of the burger is 11"
Explanation: callPolyfill sets the "this" context to {"item": "burger"}. 10 and 1.1 are passed as additional arguments.

Constraints:

	typeof args[0] == 'object' and args[0] != null
	1 <= args.length <= 100
	2 <= JSON.stringify(args[0]).length <= 10^5
*/
declare global {
    interface Function {
        callPolyfill(
            context: Record<string, JSONValue>,
            ...args: JSONValue[]
        ): JSONValue;
    }
}

Function.prototype.callPolyfill = function (context, ...args): JSONValue {
    const func = this;
    const name = this.name;

    Object.defineProperty(context, name, {
        value: func,
        enumerable: false,
    });

    // @ts-expect-error
    return context[name](...args);
};

/*
https://leetcode.com/problems/allow-one-function-call/description/?envType=list&envId=o5cftq05
2666. Allow One Function Call
Given a function fn, return a new function that is identical to the original function except that it ensures fn is called at most once.

	The first time the returned function is called, it should return the same result as fn.
	Every subsequent time it is called, it should return undefined.

Example 1:

Input: fn = (a,b,c) => (a + b + c), calls = [[1,2,3],[2,3,6]]
Output: [{"calls":1,"value":6}]
Explanation:
const onceFn = once(fn);
onceFn(1, 2, 3); // 6
onceFn(2, 3, 6); // undefined, fn was not called

Example 2:

Input: fn = (a,b,c) => (a * b * c), calls = [[5,7,4],[2,3,6],[4,6,8]]
Output: [{"calls":1,"value":140}]
Explanation:
const onceFn = once(fn);
onceFn(5, 7, 4); // 140
onceFn(2, 3, 6); // undefined, fn was not called
onceFn(4, 6, 8); // undefined, fn was not called

Constraints:

	calls is a valid JSON array
	1 <= calls.length <= 10
	1 <= calls[i].length <= 100
	2 <= JSON.stringify(calls).length <= 1000
*/
type OnceFn = (...args: JSONValue[]) => JSONValue | undefined;

export function once(fn: Function): OnceFn {
    let hasCalled = false;

    return function (...args) {
        if (!hasCalled) {
            hasCalled = true;
            return fn(...args);
        }
        return undefined;
    };
}

/*
https://leetcode.com/problems/array-wrapper/description/
2695. Array Wrapper
Create a class ArrayWrapper that accepts an array of integers in its constructor. This class should have two features:

	When two instances of this class are added together with the + operator, the resulting value is the sum of all the elements in both arrays.
	When the String() function is called on the instance, it will return a comma separated string surrounded by brackets. For example, [1,2,3].

Example 1:

Input: nums = [[1,2],[3,4]], operation = "Add"
Output: 10
Explanation:
const obj1 = new ArrayWrapper([1,2]);
const obj2 = new ArrayWrapper([3,4]);
obj1 + obj2; // 10

Example 2:

Input: nums = [[23,98,42,70]], operation = "String"
Output: "[23,98,42,70]"
Explanation:
const obj = new ArrayWrapper([23,98,42,70]);
String(obj); // "[23,98,42,70]"

Example 3:

Input: nums = [[],[]], operation = "Add"
Output: 0
Explanation:
const obj1 = new ArrayWrapper([]);
const obj2 = new ArrayWrapper([]);
obj1 + obj2; // 0

Constraints:

	0 <= nums.length <= 1000
	0 <= nums[i] <= 1000
	Note: nums is the array passed to the constructor
*/
export class ArrayWrapper {
    private nums: number[];
    private sum: number;

    constructor(nums: number[]) {
        this.nums = nums;
        this.sum = nums.reduce((acc, cur) => acc + cur, 0);
    }

    valueOf(): number {
        return this.sum;
    }

    toString(): string {
        return JSON.stringify(this.nums);
    }
}

/*
https://leetcode.com/problems/event-emitter/description/
2694. Event Emitter
Design an EventEmitter class. This interface is similar (but with some differences) to the one found in Node.js or the Event Target interface of the DOM. The EventEmitter should allow for subscribing to events and emitting them.

Your EventEmitter class should have the following two methods:

	subscribe - This method takes in two arguments: the name of an event as a string and a callback function. This callback function will later be called when the event is emitted.
	An event should be able to have multiple listeners for the same event. When emitting an event with multiple callbacks, each should be called in the order in which they were subscribed. An array of results should be returned. You can assume no callbacks passed to subscribe are referentially identical.
	The subscribe method should also return an object with an unsubscribe method that enables the user to unsubscribe. When it is called, the callback should be removed from the list of subscriptions and undefined should be returned.
	emit - This method takes in two arguments: the name of an event as a string and an optional array of arguments that will be passed to the callback(s). If there are no callbacks subscribed to the given event, return an empty array. Otherwise, return an array of the results of all callback calls in the order they were subscribed.

Example 1:

Input: 
actions = ["EventEmitter", "emit", "subscribe", "subscribe", "emit"], 
values = [[], ["firstEvent", "function cb1() { return 5; }"],  ["firstEvent", "function cb1() { return 6; }"], ["firstEvent"]]
Output: [[],["emitted",[]],["subscribed"],["subscribed"],["emitted",[5,6]]]
Explanation: 
const emitter = new EventEmitter();
emitter.emit("firstEvent"); // [], no callback are subscribed yet
emitter.subscribe("firstEvent", function cb1() { return 5; });
emitter.subscribe("firstEvent", function cb2() { return 6; });
emitter.emit("firstEvent"); // [5, 6], returns the output of cb1 and cb2

Example 2:

Input: 
actions = ["EventEmitter", "subscribe", "emit", "emit"], 
values = [[], ["firstEvent", "function cb1(...args) { return args.join(','); }"], ["firstEvent", [1,2,3]], ["firstEvent", [3,4,6]]]
Output: [[],["subscribed"],["emitted",["1,2,3"]],["emitted",["3,4,6"]]]
Explanation: Note that the emit method should be able to accept an OPTIONAL array of arguments.

const emitter = new EventEmitter();
emitter.subscribe("firstEvent, function cb1(...args) { return args.join(','); });
emitter.emit("firstEvent", [1, 2, 3]); // ["1,2,3"]
emitter.emit("firstEvent", [3, 4, 6]); // ["3,4,6"]

Example 3:

Input: 
actions = ["EventEmitter", "subscribe", "emit", "unsubscribe", "emit"], 
values = [[], ["firstEvent", "(...args) => args.join(',')"], ["firstEvent", [1,2,3]], [0], ["firstEvent", [4,5,6]]]
Output: [[],["subscribed"],["emitted",["1,2,3"]],["unsubscribed",0],["emitted",[]]]
Explanation:
const emitter = new EventEmitter();
const sub = emitter.subscribe("firstEvent", (...args) => args.join(','));
emitter.emit("firstEvent", [1, 2, 3]); // ["1,2,3"]
sub.unsubscribe(); // undefined
emitter.emit("firstEvent", [4, 5, 6]); // [], there are no subscriptions

Example 4:

Input: 
actions = ["EventEmitter", "subscribe", "subscribe", "unsubscribe", "emit"], 
values = [[], ["firstEvent", "x => x + 1"], ["firstEvent", "x => x + 2"], [0], ["firstEvent", [5]]]
Output: [[],["subscribed"],["emitted",["1,2,3"]],["unsubscribed",0],["emitted",[7]]]
Explanation:
const emitter = new EventEmitter();
const sub1 = emitter.subscribe("firstEvent", x => x + 1);
const sub2 = emitter.subscribe("firstEvent", x => x + 2);
sub1.unsubscribe(); // undefined
emitter.emit("firstEvent", [5]); // [7]

Constraints:

	1 <= actions.length <= 10
	values.length === actions.length
	All test cases are valid, e.g. you don't need to handle scenarios when unsubscribing from a non-existing subscription.
	There are only 4 different actions: EventEmitter, emit, subscribe, and unsubscribe.
	The EventEmitter action doesn't take any arguments.
	The emit action takes between either 1 or 2 arguments. The first argument is the name of the event we want to emit, and the 2nd argument is passed to the callback functions.
	The subscribe action takes 2 arguments, where the first one is the event name and the second is the callback function.
	The unsubscribe action takes one argument, which is the 0-indexed order of the subscription made before.
*/

type Callback = (...args: any[]) => any;
type Subscription = {
    unsubscribe: () => void;
};

export class EventEmitter {
    map: Map<string, Set<Callback>> = new Map();

    subscribe(eventName: string, callback: Callback): Subscription {
        const callbacks = this.map.get(eventName) ?? new Set();
        callbacks.add(callback);
        this.map.set(eventName, callbacks);

        return {
            unsubscribe: () => {
                const callbacks = this.map.get(eventName);
                callbacks?.delete(callback);
            },
        };
    }

    emit(eventName: string, args: any[] = []): any[] {
        const callbacks = this.map.get(eventName);
        if (!callbacks) {
            return [];
        }

        const results: any[] = [];
        callbacks.forEach((callback) => {
            results.push(callback(...args));
        });
        return results;
    }
}

/*
https://leetcode.com/problems/compact-object/description/
2705. Compact Object
Given an object or array obj, return a compact object.

A compact object is the same as the original object, except with keys containing falsy values removed. 
This operation applies to the object and any nested objects. Arrays are considered objects where the indices are keys. 
A value is considered falsy when Boolean(value) returns false.

You may assume the obj is the output of JSON.parse. In other words, it is valid JSON.

Example 1:

Input: obj = [null, 0, false, 1]
Output: [1]
Explanation: All falsy values have been removed from the array.

Example 2:

Input: obj = {"a": null, "b": [false, 1]}
Output: {"b": [1]}
Explanation: obj["a"] and obj["b"][0] had falsy values and were removed.

Example 3:

Input: obj = [null, 0, 5, [0], [false, 16]]
Output: [5, [], [16]]
Explanation: obj[0], obj[1], obj[3][0], and obj[4][0] were falsy and removed.

Constraints:

	obj is a valid JSON object
	2 <= JSON.stringify(obj).length <= 10^6
*/
type Obj = Record<string, JSONValue> | Array<JSONValue>;
export function compactObject(obj: Obj): Obj {
    // @ts-expect-error
    if (obj === true || typeof obj === 'string' || typeof obj === 'number') {
        return obj;
    }

    if (Array.isArray(obj)) {
        // @ts-expect-error
        return obj
            .filter((v) => Boolean(v))
            .map((v) => compactObject(v as Obj));
    }
    const filteredKeys = Object.keys(obj).filter((k) => Boolean(obj[k]));

    return filteredKeys.reduce((acc, k) => {
        const val = obj[k];
        if (Object.keys(val ?? {}).length > 0) {
            acc[k] = compactObject(val as Obj);
        } else {
            acc[k] = val;
        }

        return acc;
    }, {});
}

/*
https://leetcode.com/problems/function-composition/
2629. Function Composition
Given an array of functions [f1, f2, f3, ..., fn], return a new function fn that is the function composition of the array of functions.

The function composition of [f(x), g(x), h(x)] is fn(x) = f(g(h(x))).

The function composition of an empty list of functions is the identity function f(x) = x.

You may assume each function in the array accepts one integer as input and returns one integer as output.

Example 1:

Input: functions = [x => x + 1, x => x * x, x => 2 * x], x = 4
Output: 65
Explanation:
Evaluating from right to left ...
Starting with x = 4.
2 * (4) = 8
(8) * (8) = 64
(64) + 1 = 65

Example 2:

Input: functions = [x => 10 * x, x => 10 * x, x => 10 * x], x = 1
Output: 1000
Explanation:
Evaluating from right to left ...
10 * (1) = 10
10 * (10) = 100
10 * (100) = 1000

Example 3:

Input: functions = [], x = 42
Output: 42
Explanation:
The composition of zero functions is the identity function

Constraints:

	-1000 <= x <= 1000
	0 <= functions.length <= 1000
	all functions accept and return a single integer
*/
type F = (x: number) => number;
export function compose(functions: F[]): F {
    return function (x) {
        for (let i = functions.length - 1; i >= 0; i--) {
            x = functions[i](x);
        }
        return x;
    };
}

/*
https://leetcode.com/problems/maximum-frequency-stack/description/
895. Maximum Frequency Stack
Design a stack-like data structure to push elements to the stack and pop the most frequent element from the stack.

Implement the FreqStack class:

	FreqStack() constructs an empty frequency stack.
	void push(int val) pushes an integer val onto the top of the stack.
	int pop() removes and returns the most frequent element in the stack.

		If there is a tie for the most frequent element, the element closest to the stack's top is removed and returned.

Example 1:

Input
["FreqStack", "push", "push", "push", "push", "push", "push", "pop", "pop", "pop", "pop"]
[[], [5], [7], [5], [7], [4], [5], [], [], [], []]
Output
[null, null, null, null, null, null, null, 5, 7, 5, 4]

Explanation
FreqStack freqStack = new FreqStack();
freqStack.push(5); // The stack is [5]
freqStack.push(7); // The stack is [5,7]
freqStack.push(5); // The stack is [5,7,5]
freqStack.push(7); // The stack is [5,7,5,7]
freqStack.push(4); // The stack is [5,7,5,7,4]
freqStack.push(5); // The stack is [5,7,5,7,4,5]
freqStack.pop();   // return 5, as 5 is the most frequent. The stack becomes [5,7,5,7,4].
freqStack.pop();   // return 7, as 5 and 7 is the most frequent, but 7 is closest to the top. The stack becomes [5,7,5,4].
freqStack.pop();   // return 5, as 5 is the most frequent. The stack becomes [5,7,4].
freqStack.pop();   // return 4, as 4, 5 and 7 is the most frequent, but 4 is closest to the top. The stack becomes [5,7].

Constraints:

	0 <= val <= 10^9
	At most 2 * 104 calls will be made to push and pop.
	It is guaranteed that there will be at least one element in the stack before calling pop.
*/
export class FreqStack {
    freqMap: Map<number, number>;
    valuesMap: Map<number, number[]>;
    constructor() {
        this.freqMap = new Map();
        this.valuesMap = new Map();
    }

    push(val: number): void {
        const times = (this.freqMap.get(val) ?? 0) + 1;
        this.freqMap.set(val, times);
        if (this.valuesMap.has(times)) {
            this.valuesMap.get(times)?.push(val);
        } else {
            this.valuesMap.set(times, [val]);
        }
    }

    pop(): number {
        const maxTimes = this.valuesMap.size;
        const val = this.valuesMap.get(maxTimes)?.pop()!;
        if (this.valuesMap.get(maxTimes)?.length === 0) {
            this.valuesMap.delete(maxTimes);
        }

        if (this.freqMap.get(val) === 1) {
            this.freqMap.delete(val);
        } else {
            this.freqMap.set(val, this.freqMap.get(val)! - 1);
        }

        return val;
    }
}

/*
https://leetcode.com/problems/generate-fibonacci-sequence/description/
2648. Generate Fibonacci Sequence
Write a generator function that returns a generator object which yields the fibonacci sequence.

The fibonacci sequence is defined by the relation Xn = Xn-1 + Xn-2.

The first few numbers of the series are 0, 1, 1, 2, 3, 5, 8, 13.

Example 1:

Input: callCount = 5
Output: [0,1,1,2,3]
Explanation:
const gen = fibGenerator();
gen.next().value; // 0
gen.next().value; // 1
gen.next().value; // 1
gen.next().value; // 2
gen.next().value; // 3

Example 2:

Input: callCount = 0
Output: []
Explanation: gen.next() is never called so nothing is outputted

Constraints:

	0 <= callCount <= 50
*/
export function* fibGenerator(): Generator<number, any, number> {
    yield 0;
    yield 1;

    let first = 0;
    let second = 1;
    while (true) {
        const cur = first + second;
        first = second;
        second = cur;

        yield cur;
    }
}

/*
https://leetcode.com/problems/counter-ii/description/?envType=problem-list-v2&envId=o5cftq05
2665. Counter II
Write a function createCounter. It should accept an initial integer init. It should return an object with three functions.

The three functions are:

	increment() increases the current value by 1 and then returns it.
	decrement() reduces the current value by 1 and then returns it.
	reset() sets the current value to init and then returns it.

Example 1:

Input: init = 5, calls = ["increment","reset","decrement"]
Output: [6,5,4]
Explanation:
const counter = createCounter(5);
counter.increment(); // 6
counter.reset(); // 5
counter.decrement(); // 4

Example 2:

Input: init = 0, calls = ["increment","increment","decrement","reset","reset"]
Output: [1,2,1,0,0]
Explanation:
const counter = createCounter(0);
counter.increment(); // 1
counter.increment(); // 2
counter.decrement(); // 1
counter.reset(); // 0
counter.reset(); // 0

Constraints:

	-1000 <= init <= 1000
	0 <= calls.length <= 1000
	calls[i] is one of "increment", "decrement" and "reset"
*/
type Counter = {
    increment: () => number;
    decrement: () => number;
    reset: () => number;
};

export function createCounter(init: number): Counter {
    let initial = init;

    return {
        increment() {
            return ++initial;
        },
        decrement() {
            return --initial;
        },
        reset() {
            initial = init;
            return initial;
        },
    };
}

/*
https://leetcode.com/problems/check-if-object-instance-of-class/description/
2618. Check if Object Instance of Class
Write a function that checks if a given value is an instance of a given class or superclass. For this problem, an object is considered an instance of a given class if that object has access to that class's methods.

There are no constraints on the data types that can be passed to the function. For example, the value or the class could be undefined.

Example 1:

Input: func = () => checkIfInstanceOf(new Date(), Date)
Output: true
Explanation: The object returned by the Date constructor is, by definition, an instance of Date.

Example 2:

Input: func = () => { class Animal {}; class Dog extends Animal {}; return checkIfInstanceOf(new Dog(), Animal); }
Output: true
Explanation:
class Animal {};
class Dog extends Animal {};
checkIfInstanceOf(new Dog(), Animal); // true

Dog is a subclass of Animal. Therefore, a Dog object is an instance of both Dog and Animal.

Example 3:

Input: func = () => checkIfInstanceOf(Date, Date)
Output: false
Explanation: A date constructor cannot logically be an instance of itself.

Example 4:

Input: func = () => checkIfInstanceOf(5, Number)
Output: true
Explanation: 5 is a Number. Note that the "instanceof" keyword would return false. However, it is still considered an instance of Number because it accesses the Number methods. For example "toFixed()".
*/
export function checkIfInstanceOf(obj: any, classFunction: any): boolean {
    return (
        obj != null &&
        typeof classFunction === 'function' &&
        Object(obj) instanceof classFunction
    );
}

export function checkIfInstanceOf2(obj: any, classFunction: any) {
    if (obj === null || obj === undefined) {
        return false;
    }

    // Traverse the prototype chain
    let currentProto = Object.getPrototypeOf(obj);
    while (currentProto !== null) {
        if (currentProto.constructor === classFunction) {
            return true;
        }
        currentProto = Object.getPrototypeOf(currentProto);
    }

    return false;
}

/*
https://leetcode.com/problems/array-prototype-last/description/
2619. Array Prototype Last
Write code that enhances all arrays such that you can call the array.last() method on any array and it will return the last element. If there are no elements in the array, it should return -1.

You may assume the array is the output of JSON.parse.

Example 1:

Input: nums = [null, {}, 3]
Output: 3
Explanation: Calling nums.last() should return the last element: 3.

Example 2:

Input: nums = []
Output: -1
Explanation: Because there are no elements, return -1.

Constraints:

	arr is a valid JSON array
	0 <= arr.length <= 1000
*/
export interface Array<T> {
    last(): T | -1;
}

// @ts-expect-error
Array.prototype.last = function () {
    return this.length > 0 ? this[this.length - 1] : -1;
};

/*
https://leetcode.com/problems/sleep/description/
2621. Sleep
Given a positive integer millis, write an asynchronous function that sleeps for millis milliseconds. It can resolve any value.

Example 1:

Input: millis = 100
Output: 100
Explanation: It should return a promise that resolves after 100ms.
let t = Date.now();
sleep(100).then(() => {
  console.log(Date.now() - t); // 100
});

Example 2:

Input: millis = 200
Output: 200
Explanation: It should return a promise that resolves after 200ms.

Constraints:

	1 <= millis <= 1000
*/
export async function sleep(millis: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, millis);
    });
}

/*
https://leetcode.com/problems/cache-with-time-limit/description/
2622. Cache With Time Limit
Write a class that allows getting and setting key-value pairs, however a time until expiration is associated with each key.

The class has three public methods:

set(key, value, duration): accepts an integer key, an integer value, and a duration in milliseconds. Once the duration has elapsed, the key should be inaccessible. The method should return true if the same un-expired key already exists and false otherwise. Both the value and duration should be overwritten if the key already exists.

get(key): if an un-expired key exists, it should return the associated value. Otherwise it should return -1.

count(): returns the count of un-expired keys.

Example 1:

Input: 
actions = ["TimeLimitedCache", "set", "get", "count", "get"]
values = [[], [1, 42, 100], [1], [], [1]]
timeDelays = [0, 0, 50, 50, 150]
Output: [null, false, 42, 1, -1]
Explanation:
At t=0, the cache is constructed.
At t=0, a key-value pair (1: 42) is added with a time limit of 100ms. The value doesn't exist so false is returned.
At t=50, key=1 is requested and the value of 42 is returned.
At t=50, count() is called and there is one active key in the cache.
At t=100, key=1 expires.
At t=150, get(1) is called but -1 is returned because the cache is empty.

Example 2:

Input: 
actions = ["TimeLimitedCache", "set", "set", "get", "get", "get", "count"]
values = [[], [1, 42, 50], [1, 50, 100], [1], [1], [1], []]
timeDelays = [0, 0, 40, 50, 120, 200, 250]
Output: [null, false, true, 50, 50, -1, 0]
Explanation:
At t=0, the cache is constructed.
At t=0, a key-value pair (1: 42) is added with a time limit of 50ms. The value doesn't exist so false is returned.
At t=40, a key-value pair (1: 50) is added with a time limit of 100ms. A non-expired value already existed so true is returned and the old value was overwritten.
At t=50, get(1) is called which returned 50.
At t=120, get(1) is called which returned 50.
At t=140, key=1 expires.
At t=200, get(1) is called but the cache is empty so -1 is returned.
At t=250, count() returns 0 because the cache is empty.

Constraints:

	0 <= key, value <= 10^9
	0 <= duration <= 1000
	1 <= actions.length <= 100
	actions.length === values.length
	actions.length === timeDelays.length
	0 <= timeDelays[i] <= 1450
	actions[i] is one of "TimeLimitedCache", "set", "get" and "count"
	First action is always "TimeLimitedCache" and must be executed immediately, with a 0-millisecond delay
*/
export class TimeLimitedCache {
    cache: Map<number, [number, number]>;

    constructor() {
        this.cache = new Map();
    }

    set(key: number, value: number, duration: number): boolean {
        if (!this.cache.has(key)) {
            this.cache.set(key, [value, Date.now() + duration]);
            return false;
        }

        const [, expired] = this.cache.get(key)!;
        const flag = expired >= Date.now();
        this.cache.set(key, [value, Date.now() + duration]);
        return flag;
    }

    get(key: number): number {
        if (!this.cache.has(key)) {
            return -1;
        }

        const [prev, expired] = this.cache.get(key)!;
        if (Date.now() > expired) {
            this.cache.delete(key);
            return -1;
        }
        return prev;
    }

    count(): number {
        let sum = 0;
        const now = Date.now();
        for (const [, expired] of this.cache.values()) {
            if (expired >= now) {
                sum++;
            }
        }

        return sum;
    }
}

/*
https://leetcode.com/problems/array-reduce-transformation/description/
2626. Array Reduce Transformation
Given an integer array nums, a reducer function fn, and an initial value init, return the final result obtained by executing the fn function on each element of the array, sequentially, passing in the return value from the calculation on the preceding element.

This result is achieved through the following operations: val = fn(init, nums[0]), val = fn(val, nums[1]), val = fn(val, nums[2]), ... until every element in the array has been processed. The ultimate value of val is then returned.

If the length of the array is 0, the function should return init.

Please solve it without using the built-in Array.reduce method.

Example 1:

Input: 
nums = [1,2,3,4]
fn = function sum(accum, curr) { return accum + curr; }
init = 0
Output: 10
Explanation:
initially, the value is init=0.
(0) + nums[0] = 1
(1) + nums[1] = 3
(3) + nums[2] = 6
(6) + nums[3] = 10
The final answer is 10.

Example 2:

Input: 
nums = [1,2,3,4]
fn = function sum(accum, curr) { return accum + curr * curr; }
init = 100
Output: 130
Explanation:
initially, the value is init=100.
(100) + nums[0] * nums[0] = 101
(101) + nums[1] * nums[1] = 105
(105) + nums[2] * nums[2] = 114
(114) + nums[3] * nums[3] = 130
The final answer is 130.

Example 3:

Input: 
nums = []
fn = function sum(accum, curr) { return 0; }
init = 25
Output: 25
Explanation: For empty arrays, the answer is always init.

Constraints:

	0 <= nums.length <= 1000
	0 <= nums[i] <= 1000
	0 <= init <= 1000
*/
export function reduce(
    nums: number[],
    fn: (accum: number, curr: number) => number,
    init: number
): number {
    let acc = init;
    for (let i = 0; i < nums.length; i++) {
        acc = fn(acc, nums[i]);
    }

    return acc;
}

/*
https://leetcode.com/problems/promise-time-limit/description/
2637. Promise Time Limit
Given an asynchronous function fn and a time t in milliseconds, return a new time limited version of the input function. fn takes arguments provided to the time limited function.

The time limited function should follow these rules:

	If the fn completes within the time limit of t milliseconds, the time limited function should resolve with the result.
	If the execution of the fn exceeds the time limit, the time limited function should reject with the string "Time Limit Exceeded".

Example 1:

Input: 
fn = async (n) => { 
  await new Promise(res => setTimeout(res, 100)); 
  return n * n; 
}
inputs = [5]
t = 50
Output: {"rejected":"Time Limit Exceeded","time":50}
Explanation:
const limited = timeLimit(fn, t)
const start = performance.now()
let result;
try {
   const res = await limited(...inputs)
   result = {"resolved": res, "time": Math.floor(performance.now() - start)};
} catch (err) {
   result = {"rejected": err, "time": Math.floor(performance.now() - start)};
}
console.log(result) // Output

The provided function is set to resolve after 100ms. However, the time limit is set to 50ms. It rejects at t=50ms because the time limit was reached.

Example 2:

Input: 
fn = async (n) => { 
  await new Promise(res => setTimeout(res, 100)); 
  return n * n; 
}
inputs = [5]
t = 150
Output: {"resolved":25,"time":100}
Explanation:
The function resolved 5 * 5 = 25 at t=100ms. The time limit is never reached.

Example 3:

Input: 
fn = async (a, b) => { 
  await new Promise(res => setTimeout(res, 120)); 
  return a + b; 
}
inputs = [5,10]
t = 150
Output: {"resolved":15,"time":120}
Explanation:
​​​​The function resolved 5 + 10 = 15 at t=120ms. The time limit is never reached.

Example 4:

Input: 
fn = async () => { 
  throw "Error";
}
inputs = []
t = 1000
Output: {"rejected":"Error","time":0}
Explanation:
The function immediately throws an error.

Constraints:

	0 <= inputs.length <= 10
	0 <= t <= 1000
	fn returns a promise
*/
type AsyncFn = (...params: any[]) => Promise<any>;

export function timeLimit(fn: AsyncFn, t: number): AsyncFn {
    return async function (...args) {
        return new Promise((resolve, reject) => {
            fn(...args)
                .then(resolve)
                .catch(reject);

            setTimeout(() => {
                reject('Time Limit Exceeded');
            }, t);
        });
    };
}

/*
https://leetcode.com/problems/kth-largest-element-in-a-stream/description/?envType=daily-question&envId=2024-08-12
703. Kth Largest Element in a Stream
Design a class to find the kth largest element in a stream. Note that it is the kth largest element in the sorted order, not the kth distinct element.

Implement KthLargest class:

	KthLargest(int k, int[] nums) Initializes the object with the integer k and the stream of integers nums.
	int add(int val) Appends the integer val to the stream and returns the element representing the kth largest element in the stream.

Example 1:

Input
["KthLargest", "add", "add", "add", "add", "add"]
[[3, [4, 5, 8, 2]], [3], [5], [10], [9], [4]]
Output
[null, 4, 5, 5, 8, 8]

Explanation
KthLargest kthLargest = new KthLargest(3, [4, 5, 8, 2]);
kthLargest.add(3);   // return 4
kthLargest.add(5);   // return 5
kthLargest.add(10);  // return 5
kthLargest.add(9);   // return 8
kthLargest.add(4);   // return 8

Constraints:

	1 <= k <= 10^4
	0 <= nums.length <= 10^4
	-10^4 <= nums[i] <= 10^4
	-10^4 <= val <= 10^4
	At most 104 calls will be made to add.
	It is guaranteed that there will be at least k elements in the array when you search for the kth element.
*/
export class KthLargest {
    heap: GenericHeap<number>;
    k: number;

    constructor(k: number, nums: number[]) {
        this.k = k;

        this.heap = new GenericHeap((a, b) => a - b);
        const len = Math.min(k, nums.length);
        for (let i = 0; i < len; i++) {
            this.heap.push(nums[i]);
        }

        for (let i = len; i < nums.length; i++) {
            if (this.heap.peek() < nums[i]) {
                this.heap.pop();
                this.heap.push(nums[i]);
            }
        }
    }

    add(val: number): number {
        if (this.heap.size() < this.k) {
            this.heap.push(val);
            return this.heap.peek();
        }

        if (this.heap.peek() < val) {
            this.heap.pop();
            this.heap.push(val);
        }
        return this.heap.peek();
    }
}

/*
https://leetcode.com/problems/range-sum-query-immutable/description/
303. Range Sum Query - Immutable
Given an integer array nums, handle multiple queries of the following type:

	Calculate the sum of the elements of nums between indices left and right inclusive where left <= right.

Implement the NumArray class:

	NumArray(int[] nums) Initializes the object with the integer array nums.
	int sumRange(int left, int right) Returns the sum of the elements of nums between indices left and right inclusive (i.e. nums[left] + nums[left + 1] + ... + nums[right]).

Example 1:

Input
["NumArray", "sumRange", "sumRange", "sumRange"]
[[[-2, 0, 3, -5, 2, -1]], [0, 2], [2, 5], [0, 5]]
Output
[null, 1, -1, -3]

Explanation
NumArray numArray = new NumArray([-2, 0, 3, -5, 2, -1]);
numArray.sumRange(0, 2); // return (-2) + 0 + 3 = 1
numArray.sumRange(2, 5); // return 3 + (-5) + 2 + (-1) = -1
numArray.sumRange(0, 5); // return (-2) + 0 + 3 + (-5) + 2 + (-1) = -3

Constraints:

	1 <= nums.length <= 10^4
	-10^5 <= nums[i] <= 10^5
	0 <= left <= right < nums.length
	At most 104 calls will be made to sumRange.
*/
export class NumArray {
    prefix: number[];

    constructor(nums: number[]) {
        const n = nums.length;
        this.prefix = Array(n);
        this.prefix[0] = nums[0];

        for (let i = 1; i < n; i++) {
            this.prefix[i] = this.prefix[i - 1] + nums[i];
        }
    }

    sumRange(left: number, right: number): number {
        const before = left === 0 ? 0 : this.prefix[left - 1];
        return this.prefix[right] - before;
    }
}

/*
https://leetcode.com/problems/my-calendar-i/description/?envType=daily-question&envId=2024-09-26
729. My Calendar I
You are implementing a program to use as your calendar. We can add a new event if adding the event will not cause a double booking.

A double booking happens when two events have some non-empty intersection (i.e., some moment is common to both events.).

The event can be represented as a pair of integers start and end that represents a booking on the half-open interval [start, end), the range of real numbers x such that start <= x < end.

Implement the MyCalendar class:

	MyCalendar() Initializes the calendar object.
	boolean book(int start, int end) Returns true if the event can be added to the calendar successfully without causing a double booking. Otherwise, return false and do not add the event to the calendar.

Example 1:

Input
["MyCalendar", "book", "book", "book"]
[[], [10, 20], [15, 25], [20, 30]]
Output
[null, true, false, true]

Explanation
MyCalendar myCalendar = new MyCalendar();
myCalendar.book(10, 20); // return True
myCalendar.book(15, 25); // return False, It can not be booked because time 15 is already booked by another event.
myCalendar.book(20, 30); // return True, The event can be booked, as the first event takes every time less than 20, but not including 20.

Constraints:

	0 <= start < end <= 10^9
	At most 1000 calls will be made to book.
*/
export class MyCalendar {
    private booked: number[][];

    constructor() {
        this.booked = [];
    }

    book(start: number, end: number): boolean {
        const { booked } = this;
        let left = 0;
        let right = booked.length - 1;
        let closest = -1;
        while (left <= right) {
            const mid = left + ((right - left) >> 1);
            if (booked[mid][1] <= start) {
                closest = mid;
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }

        if (closest === -1) {
            if (
                booked.length === 0 ||
                (booked.length > 0 && booked[0][0] >= end)
            ) {
                booked.unshift([start, end]);
                return true;
            }
            return false;
        }
        if (booked.length === closest + 1) {
            booked.push([start, end]);
            return true;
        }
        if (booked[closest + 1][0] < end) {
            return false;
        }
        booked.splice(closest + 1, 0, [start, end]);
        return true;
    }
}
