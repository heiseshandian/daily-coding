class Node {
    pass = 0;
    end = 0;
    // 仅存储26个小写英文字母
    nextList = Array<Node>(26);
}

export class PrefixTree {
    #root = new Node();

    public add(word: string) {
        let node = this.#root;
        for (let i = 0; i < word.length; i++) {
            const code = getCode(word[i]);
            if (!node.nextList[code]) {
                node.nextList[code] = new Node();
            }

            node.nextList[code].pass++;
            node = node.nextList[code];
        }

        node.end++;
    }

    public search(word: string) {
        let node = this.#root;
        for (let i = 0; i < word.length; i++) {
            const code = getCode(word[i]);
            if (!node.nextList[code]) {
                return 0;
            }

            node = node.nextList[code];
        }

        return node.end;
    }

    // 如果存在多条记录我们只删除其中一条
    public delete(word: string) {
        if (!this.search(word)) {
            return;
        }

        let node = this.#root;
        for (let i = 0; i < word.length; i++) {
            const code = getCode(word[i]);
            node.nextList[code].pass--;
            if (node.nextList[code].pass === 0) {
                // @ts-ignore
                node.nextList[code] = null;
                return;
            }

            node = node.nextList[code];
        }

        node.end--;
    }
}

function getCode(char: string) {
    return char.charCodeAt(0) - 'a'.charCodeAt(0);
}
