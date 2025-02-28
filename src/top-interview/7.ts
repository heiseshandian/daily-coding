// 整数逆序 [-2^31, 2^31 - 1] 逆序之后超出范围返回0
export function reverseInteger(x: number): number {
  const MAX_VALUE = Math.pow(2, 31) - 1;
  const MIN_VALUE = -Math.pow(2, 31);
  let reversed = 0;
  while (x != 0) {
    const pop = x % 10;
    // js除10取整需要特殊处理
    x = parseInt(`${x / 10}`);

    // Simply because biggest int32 is 2147483647 and least is -2147483648
    if (
      reversed > MAX_VALUE / 10 ||
      (reversed == MAX_VALUE / 10 && pop > MAX_VALUE % 10)
    )
      return 0;
    if (
      reversed < MIN_VALUE / 10 ||
      (reversed == MIN_VALUE / 10 && pop < MIN_VALUE % 10)
    )
      return 0;
    reversed = reversed * 10 + pop;
  }
  return reversed;
}
