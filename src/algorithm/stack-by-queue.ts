import { Queue } from './queue';
export class StackByQueue {
  #pushQueue: Queue;

  #popQueue: Queue;

  constructor() {
    this.#pushQueue = new Queue();
    this.#popQueue = new Queue();
  }

  public push(val: any) {
    this.#pushQueue.add(val);
  }

  public pop() {
    while (this.#pushQueue.size() > 1) {
      this.#popQueue.add(this.#pushQueue.poll());
    }

    const result = this.#pushQueue.poll();
    this.#swap();

    return result;
  }

  public isEmpty() {
    return this.#pushQueue.size() === 0;
  }

  #swap() {
    const temp = this.#pushQueue;
    this.#pushQueue = this.#popQueue;
    this.#popQueue = temp;
  }
}
