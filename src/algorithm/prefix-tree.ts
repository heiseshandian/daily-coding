import { getCharIndex } from '../common';

export class PrefixTreeNode {
  pass = 0;
  end = 0;

  // 仅存储26个小写英文字母
  nextNodes = Array<PrefixTreeNode>(26);
}

export class PrefixTree {
  head = new PrefixTreeNode();

  public add(word: string) {
    if (!word || word.length === 0) {
      return;
    }

    let node = this.head;
    node.pass++;
    for (let i = 0; i < word.length; i++) {
      const code = getCharIndex(word[i]);
      if (!node.nextNodes[code]) {
        node.nextNodes[code] = new PrefixTreeNode();
      }

      node = node.nextNodes[code];
      node.pass++;
    }

    node.end++;
  }

  public search(word: string) {
    if (!word || word.length === 0) {
      return 0;
    }

    let node = this.head;
    for (let i = 0; i < word.length; i++) {
      const code = getCharIndex(word[i]);
      if (!node.nextNodes[code]) {
        return 0;
      }

      node = node.nextNodes[code];
    }

    return node.end;
  }

  // 如果存在多条记录我们只删除其中一条
  public delete(word: string) {
    if (!this.search(word)) {
      return;
    }

    let node = this.head;
    node.pass--;
    for (let i = 0; i < word.length; i++) {
      const code = getCharIndex(word[i]);
      node.nextNodes[code].pass--;
      if (node.nextNodes[code].pass === 0) {
        // @ts-ignore
        node.nextNodes[code] = null;
        return;
      }

      node = node.nextNodes[code];
    }

    node.end--;
  }

  public prefixCount(prefix: string) {
    if (!prefix || prefix.length === 0) {
      return 0;
    }

    let node = this.head;
    for (let i = 0; i < prefix.length; i++) {
      const code = getCharIndex(prefix[i]);
      if (!node.nextNodes[code]) {
        return 0;
      }

      node = node.nextNodes[code];
    }

    return node.pass;
  }
}
