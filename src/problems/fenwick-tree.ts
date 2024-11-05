import { FenwickTree } from '../algorithm/fanwick-tree';
/**
 * # 【模板】树状数组 1

## 题目描述

如题，已知一个数列，你需要进行下面两种操作：

- 将某一个数加上 $x$

- 求出某区间每一个数的和

## 输入格式

第一行包含两个正整数 $n,m$，分别表示该数列数字的个数和操作的总个数。   
 
第二行包含 $n$ 个用空格分隔的整数，其中第 $i$ 个数字表示数列第 $i$ 项的初始值。

接下来 $m$ 行每行包含 $3$ 个整数，表示一个操作，具体如下：

- `1 x k`  含义：将第 $x$ 个数加上 $k$

- `2 x y`  含义：输出区间 $[x,y]$ 内每个数的和

## 输出格式

输出包含若干行整数，即为所有操作 $2$ 的结果。

## 样例 #1

### 样例输入 #1

```
5 5
1 5 4 2 3
1 1 3
2 2 5
1 3 -1
1 4 2
2 1 4
```

### 样例输出 #1

```
14
16
```

## 提示

【数据范围】

对于 $30\%$ 的数据，$1 \le n \le 8$，$1\le m \le 10$；   
对于 $70\%$ 的数据，$1\le n,m \le 10^4$；   
对于 $100\%$ 的数据，$1\le n,m \le 5\times 10^5$。

数据保证对于任意时刻，$a$ 的任意子区间（包括长度为 $1$ 和 $n$ 的子区间）和均在 $[-2^{31}, 2^{31})$ 范围内。


样例说明：

 ![](https://cdn.luogu.com.cn/upload/pic/2256.png) 

故输出结果14、16
 */
{
    const readline = require('readline');

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    let n: number | null = null;
    let tree: FenwickTree | null = null;
    const result: number[] = [];

    rl.on('line', function (line: string) {
        const tokens = line.split(' ');

        if (n === null) {
            n = +tokens[0];
        } else if (tree === null) {
            tree = new FenwickTree(n);
            tokens.forEach((v, i) => {
                tree!.update(i + 1, +v);
            });
        } else if (tokens[0] === '1') {
            tree?.update(+tokens[1], +tokens[2]);
        } else {
            result.push(tree.rangeSum(+tokens[1], +tokens[2]));
        }
    }).on('close', function () {
        console.log(result.join('\n'));
    });
}

/**
 * # 【模板】树状数组 2

## 题目描述

如题，已知一个数列，你需要进行下面两种操作：

1. 将某区间每一个数加上 $x$；

2. 求出某一个数的值。

## 输入格式

第一行包含两个整数 $N$、$M$，分别表示该数列数字的个数和操作的总个数。

第二行包含 $N$ 个用空格分隔的整数，其中第 $i$ 个数字表示数列第 $i $ 项的初始值。

接下来 $M$ 行每行包含 $2$ 或 $4$个整数，表示一个操作，具体如下：

操作 $1$： 格式：`1 x y k` 含义：将区间 $[x,y]$ 内每个数加上 $k$；

操作 $2$： 格式：`2 x` 含义：输出第 $x$ 个数的值。

## 输出格式

输出包含若干行整数，即为所有操作 $2$ 的结果。

## 样例 #1

### 样例输入 #1

```
5 5
1 5 4 2 3
1 2 4 2
2 3
1 1 5 -1
1 3 5 7
2 4
```

### 样例输出 #1

```
6
10
```

## 提示

#### 样例 1 解释：

 ![](https://cdn.luogu.com.cn/upload/pic/2258.png) 

故输出结果为 6、10。

---

#### 数据规模与约定

对于 $30\%$ 的数据：$N\le8$，$M\le10$；

对于 $70\%$ 的数据：$N\le 10000$，$M\le10000$；

对于 $100\%$ 的数据：$1 \leq N, M\le 500000$，$1 \leq x, y \leq n$，保证任意时刻序列中任意元素的绝对值都不大于 $2^{30}$。
 */
{
    const readline = require('readline');

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    let n: number | null = null;
    let tree: FenwickTree | null = null;
    const result: number[] = [];

    rl.on('line', function (line: string) {
        const tokens = line.split(' ');

        if (n === null) {
            n = +tokens[0];
        } else if (tree === null) {
            tree = new FenwickTree(n);
            const nums = tokens.map((v) => +v);
            for (let i = nums.length; i > 1; i--) {
                nums[i] = nums[i - 1] - nums[i - 2];
            }
            nums[1] = nums[0];

            for (let i = 1; i < nums.length; i++) {
                tree.update(i, nums[i]);
            }
        } else if (tokens[0] === '1') {
            tree.update(+tokens[1], +tokens[3]);
            tree.update(+tokens[2] + 1, -tokens[3]);
        } else {
            result.push(tree.sum(+tokens[1]));
        }
    }).on('close', function () {
        console.log(result.join('\n'));
    });
}
