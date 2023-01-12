/* 
设计一个结构，可以存储key
要求实现插入，删除，随机返回曾经加入的key三种操作，且时间复杂度都是O(1)
*/
export class KeyPool {
    #keyIndexMap: Map<string, number> = new Map();
    #indexKeyMap: Map<number, string> = new Map();
    #size = 0;

    public insert(key: string) {
        if (this.#keyIndexMap.has(key)) {
            return;
        }

        this.#keyIndexMap.set(key, this.#size);
        this.#indexKeyMap.set(this.#size, key);
        this.#size++;
    }

    public delete(key: string) {
        if (!this.#keyIndexMap.has(key)) {
            return;
        }
        const index = this.#keyIndexMap.get(key) as number;
        const lastKey = this.#indexKeyMap.get(this.#size - 1) as string;

        this.#keyIndexMap.set(lastKey, index);
        this.#keyIndexMap.delete(key);
        this.#indexKeyMap.set(index, lastKey);
        this.#indexKeyMap.delete(this.#size - 1);

        this.#size--;
    }

    public getRandom() {
        const index = Math.floor(Math.random() * this.#size);
        return this.#indexKeyMap.get(index);
    }
}
