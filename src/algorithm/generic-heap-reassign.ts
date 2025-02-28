import { swap } from '../common';

type Comparator<T> = (a: T, b: T) => number;

export class GenericHeapWithReassign<T> {
  #container: Array<T> = [];

  #val2IndexMap: Map<T, number> = new Map();

  /* 关于比较器的约定
    1. 如果返回值小于0 则排在前面
    2. 如果等于0表示两者相等
    3. 如果大于0则排在后面 */
  #comparator: Comparator<T>;

  constructor(comparator: Comparator<T>) {
    this.#comparator = comparator;
  }

  public isEmpty() {
    return this.#container.length === 0;
  }

  public push(val: T) {
    this.#container.push(val);
    this.#val2IndexMap.set(val, this.#container.length - 1);

    this.#insertHeap(this.#container.length - 1);
  }

  public pop() {
    const result = this.#container[0];
    this.#swap(0, this.#container.length - 1);
    this.#container.length--;
    this.#heapify(0);

    this.#val2IndexMap.delete(result);

    return result;
  }

  public reassign(val: T) {
    const i = this.#val2IndexMap.get(val);

    if (i !== undefined) {
      this.#insertHeap(i);
      this.#heapify(i);
    }
  }

  #insertHeap(i: number) {
    while (i) {
      let parent = (i - 1) >> 1;
      if (this.#comparator(this.#container[i], this.#container[parent]) >= 0) {
        break;
      }

      this.#swap(i, parent);
      i = parent;
    }
  }

  #heapify(i: number) {
    let left = 2 * i + 1;
    while (left < this.#container.length) {
      const right = left + 1;
      let minimumIndex =
        right < this.#container.length &&
        this.#comparator(this.#container[right], this.#container[left]) < 0
          ? right
          : left;
      minimumIndex =
        this.#comparator(this.#container[minimumIndex], this.#container[i]) < 0
          ? minimumIndex
          : i;

      if (minimumIndex === i) {
        break;
      }

      this.#swap(i, minimumIndex);
      i = minimumIndex;
      left = 2 * i + 1;
    }
  }

  #swap(i: number, j: number) {
    this.#val2IndexMap.set(this.#container[i], j);
    this.#val2IndexMap.set(this.#container[j], i);

    swap(this.#container, i, j);
  }
}
