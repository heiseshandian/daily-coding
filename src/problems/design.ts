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
    next: MyLinkedListNode | null;

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
