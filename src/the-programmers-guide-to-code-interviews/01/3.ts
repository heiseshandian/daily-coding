/*
 * 一个栈依次压入1、2、3、4、5，那么从栈顶到栈底分别为5、4、3、2、1。将这个栈转置后，
 * 从栈顶到栈底为 1、2、3、4、5，也就是实现栈中元素的逆序，但是只能用递归函数来实现，
 * 不能用其他数据结构。*/

import { Stack } from '../../algorithm/stack';

export function reverseStack(stack: Stack) {
  if (stack.isEmpty()) {
    return;
  }

  const last = getAndRemoveTheLastElement(stack);
  reverseStack(stack);
  stack.push(last);
}

function getAndRemoveTheLastElement(stack: Stack): any {
  const top = stack.pop();

  if (stack.isEmpty()) {
    return top;
  } else {
    const last = getAndRemoveTheLastElement(stack);
    stack.push(top);
    return last;
  }
}
