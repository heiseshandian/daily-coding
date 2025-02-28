import { cache } from '../design-pattern/proxy';
/**
 * https://www.bilibili.com/list/8888480?sort_field=pubtime&spm_id_from=333.999.0.0&oid=830036986&bvid=BV11u4y1Q7FD
 *
 * 使用对数器打表找规律
 */

/**
 * 描述：买苹果，现有容量为 6 和 8 两种袋子，袋子必须装满，问买 x 个苹果最少需要多少个袋子
 * 若无法恰好装满则返回 -1
 */
export function getMinBags(apples: number): number {
  const dfs = cache((x: number): number => {
    if (x === 0) {
      return 0;
    }
    if (x & 1 || x < 6) {
      return Infinity;
    }

    return Math.min(1 + dfs(x - 6), 1 + dfs(x - 8));
  });
  const bags = dfs(apples);

  return bags === Infinity ? -1 : bags;
}

// 打表观察 getMinBags 的输出，找出规律
function getMinBags2(x: number): number {
  if (x & 1) {
    return -1;
  }

  if (x < 18) {
    if (x === 6 || x === 8) {
      return 1;
    }
    if (x === 12 || x === 14 || x === 16) {
      return 2;
    }
    return -1;
  }

  return Math.floor((x - 18) / 8) + 3;
}

for (let i = 1; i <= 10000; i++) {
  if (getMinBags(i) !== getMinBags2(i)) {
    console.log(i, getMinBags(i), getMinBags2(i));
  }
}
