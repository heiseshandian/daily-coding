/**
 * 生成指定长度的随机数组
 * @param n 数组长度
 * @param v 数组最大值
 * @returns
 */
export function randomArray(n: number, v: number): number[] {
  const ret: number[] = Array(n);
  for (let i = 0; i < n; i++) {
    ret[i] = Math.floor(Math.random() * v) + 1;
  }

  return ret;
}

/**
 * 测试函数的执行性能
 * @param fn 待测试的函数
 * @param iterations 测试次数
 */
export function benchmark(fn: () => void, iterations: number = 1000): void {
  const start = performance.now();

  for (let i = 0; i < iterations; i++) {
    fn();
  }

  const end = performance.now();
  const totalTime = end - start;
  const averageTime = totalTime / iterations;

  console.log(`Total time: ${totalTime.toFixed(4)} ms`);
  console.log(`Average time per iteration: ${averageTime.toFixed(4)} ms`);
}
