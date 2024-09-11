type Comparator<T = number> = (a: T, b: T) => number;

export class GenericHeap<T = number> {
    container: Array<T> = [];

    /* 关于比较器的约定
    1. 如果返回值小于0 则排在前面
    2. 如果等于0表示两者相等
    3. 如果大于0则排在后面 */
    comparator: Comparator<T>;

    constructor(
        comparator: Comparator<T> = (a, b) => (a as number) - (b as number)
    ) {
        this.comparator = comparator;
    }

    public initHeap(arr: T[]) {
        // 此处用slice是为了避免堆调整时影响到arr
        this.container = arr.slice();

        for (let i = this.container.length - 1; i >= 0; i--) {
            this.heapify(i);
        }
    }

    public size() {
        return this.container.length;
    }

    public isEmpty() {
        return this.container.length === 0;
    }

    public push(val: T) {
        this.container.push(val);

        this.insertHeap(this.container.length - 1);
    }

    public pop() {
        const result = this.container[0];
        this.swap(0, this.container.length - 1);
        this.container.length--;
        this.heapify(0);

        return result;
    }

    public peek() {
        return this.container[0];
    }

    private insertHeap(i: number) {
        while (i) {
            let parent = (i - 1) >> 1;
            if (
                this.comparator(this.container[i], this.container[parent]) >= 0
            ) {
                break;
            }

            this.swap(i, parent);
            i = parent;
        }
    }

    private heapify(i: number) {
        let left = 2 * i + 1;
        while (left < this.container.length) {
            const right = left + 1;
            let minimumIndex =
                right < this.container.length &&
                this.comparator(this.container[right], this.container[left]) < 0
                    ? right
                    : left;
            minimumIndex =
                this.comparator(
                    this.container[minimumIndex],
                    this.container[i]
                ) < 0
                    ? minimumIndex
                    : i;

            if (minimumIndex === i) {
                break;
            }

            this.swap(i, minimumIndex);
            i = minimumIndex;
            left = 2 * i + 1;
        }
    }

    private swap(i: number, j: number) {
        const tmp = this.container[i];
        this.container[i] = this.container[j];
        this.container[j] = tmp;
    }
}
