import {
  SingleLinkedList,
  DoubleLinkedList,
  reverseSingleLinkedList,
  reverseDoubleLinkedList,
  deleteNum,
  getMiddleNode,
  getMiddleNode2,
  getMiddleNode3,
  getMiddleNode4,
  isPalindrome,
  partition,
  deepCloneSpecialNodeList,
  getFirstLoopNode,
  getFirstIntersectNode,
} from '../linked-list';
import {
  buildSpecialNodes,
  isSingleLinkedListEqual,
  isSpecialNodeEqual,
  buildNodes,
} from './helpers';
import {
  deepCloneSpecialNodeListTestData,
  getMiddleNode2TestData,
  getMiddleNode3TestData,
  getMiddleNode4TestData,
  getMiddleNodeTestData,
  isPalindromeTestData,
  partitionTestData,
} from './linked-list.testdata';

describe('SingleLinkedList.from', () => {
  test('return null if input is empty or []', () => {
    expect(SingleLinkedList.from()).toEqual(null);
    expect(SingleLinkedList.from([])).toEqual(null);
  });

  test('return 1>null if input is empty or [1]', () => {
    expect(SingleLinkedList.from([1])).toEqual(new SingleLinkedList(1));
  });

  test('return 1>2>null if input is empty or [1,2]', () => {
    expect(SingleLinkedList.from([1, 2])).toEqual(
      new SingleLinkedList(1, new SingleLinkedList(2))
    );
  });

  test('return 1>2>3>null if input is [1,2,3]', () => {
    expect(SingleLinkedList.from([1, 2, 3])).toEqual(
      new SingleLinkedList(1, new SingleLinkedList(2, new SingleLinkedList(3)))
    );
  });
});

describe('DoubleLinkedList.from', () => {
  test('return null if input is empty or []', () => {
    expect(DoubleLinkedList.from()).toEqual(null);
  });

  test('return 1>null if input is empty or [1]', () => {
    expect(DoubleLinkedList.from([1])).toEqual(new DoubleLinkedList(1));
  });

  test('return 1>2>null if input is empty or [1,2]', () => {
    const [firstNode, secondNode] = [
      new DoubleLinkedList(1),
      new DoubleLinkedList(2),
    ];
    firstNode.next = secondNode;
    secondNode.prev = firstNode;

    expect(DoubleLinkedList.from([1, 2])).toEqual(firstNode);
  });

  test('return 1>2>3>null if input is [1,2,3]', () => {
    const [firstNode, secondNode, thirdNode] = [
      new DoubleLinkedList(1),
      new DoubleLinkedList(2),
      new DoubleLinkedList(3),
    ];
    firstNode.next = secondNode;
    secondNode.next = thirdNode;

    thirdNode.prev = secondNode;
    secondNode.prev = firstNode;

    expect(DoubleLinkedList.from([1, 2, 3])).toEqual(firstNode);
  });
});

describe('reverseSingleLinkedList', () => {
  test('return null if the input is null', () => {
    expect(reverseSingleLinkedList(null)).toBe(null);
  });

  test('return 1 if the input is 1', () => {
    expect(reverseSingleLinkedList(new SingleLinkedList(1))).toEqual(
      new SingleLinkedList(1)
    );
  });

  test('return [2,1] if the input is [1,2]', () => {
    expect(reverseSingleLinkedList(SingleLinkedList.from([1, 2]))).toEqual(
      SingleLinkedList.from([2, 1])
    );
  });

  test('return [3,2,1] if the input is [1,2,3]', () => {
    expect(reverseSingleLinkedList(SingleLinkedList.from([1, 2, 3]))).toEqual(
      SingleLinkedList.from([3, 2, 1])
    );
  });
});

describe('reverseDoubleLinkedList', () => {
  test('return null if the input is null', () => {
    expect(reverseDoubleLinkedList(null)).toBe(null);
  });

  test('return 1 if the input is 1', () => {
    expect(reverseDoubleLinkedList(new DoubleLinkedList(1))).toEqual(
      new DoubleLinkedList(1)
    );
  });

  test('return [2,1] if the input is [1,2]', () => {
    expect(reverseDoubleLinkedList(DoubleLinkedList.from([1, 2]))).toEqual(
      DoubleLinkedList.from([2, 1])
    );
  });

  test('return [3,2,1] if the input is [1,2,3]', () => {
    expect(reverseDoubleLinkedList(DoubleLinkedList.from([1, 2, 3]))).toEqual(
      DoubleLinkedList.from([3, 2, 1])
    );
  });
});

describe('deleteNum', () => {
  test('return null if the input is null', () => {
    expect(deleteNum(null, 1)).toBe(null);
  });

  test('return null if the input is [1],1', () => {
    expect(deleteNum(SingleLinkedList.from([1]), 1)).toBe(null);
  });

  test('return 2 if the input is [1,1,2,1,1,1],1', () => {
    expect(deleteNum(SingleLinkedList.from([1, 1, 2, 1, 1, 1]), 1)).toEqual(
      new SingleLinkedList(2)
    );
  });
});

describe('getMiddleNode', () => {
  it.each(getMiddleNodeTestData)('getMiddleNode %j', ({ input, expected }) => {
    const head = SingleLinkedList.from(input);

    expect(getMiddleNode(head)?.val).toBe(expected);
  });

  it.each(getMiddleNode2TestData)(
    'getMiddleNode2 %j',
    ({ input, expected }) => {
      const head = SingleLinkedList.from(input);

      expect(getMiddleNode2(head)?.val).toBe(expected);
    }
  );

  it.each(getMiddleNode3TestData)(
    'getMiddleNode3 %j',
    ({ input, expected }) => {
      const head = SingleLinkedList.from(input);

      expect(getMiddleNode3(head)?.val).toBe(expected);
    }
  );

  it.each(getMiddleNode4TestData)(
    'getMiddleNode4 %j',
    ({ input, expected }) => {
      const head = SingleLinkedList.from(input);

      expect(getMiddleNode4(head)?.val).toBe(expected);
    }
  );
});

describe('isPalindromeTestData', () => {
  it.each(isPalindromeTestData)('isPalindrome %j', ({ input, expected }) => {
    const head = SingleLinkedList.from(input);

    expect(isPalindrome(head)).toBe(expected);
    expect(isSingleLinkedListEqual(head, SingleLinkedList.from(input))).toBe(
      true
    );
  });
});

describe('partition', () => {
  it.each(partitionTestData)('partition %j', ({ input, p, expected }) => {
    const head = SingleLinkedList.from(input);

    expect(
      isSingleLinkedListEqual(
        partition(head, p),
        SingleLinkedList.from(expected)
      )
    ).toBe(true);
  });
});

describe('deepCloneSpecialNodeList', () => {
  it.each(deepCloneSpecialNodeListTestData)(
    'deepCloneSpecialNodeList',
    ({ input }) => {
      const head = buildSpecialNodes(input);
      const expectedHead = buildSpecialNodes(input);

      expect(
        isSpecialNodeEqual(deepCloneSpecialNodeList(head), expectedHead)
      ).toBe(true);
    }
  );
});

describe('getFirstLoopNode', () => {
  test('input null output null', () => {
    expect(getFirstLoopNode(null)).toBe(null);
  });

  test('input 1 output null', () => {
    expect(getFirstLoopNode(new SingleLinkedList(1))).toBe(null);
  });

  test('input 1,2 output 1', () => {
    const nodes = [1, 2].map((val) => new SingleLinkedList(val));
    nodes[0].next = nodes[1];
    nodes[1].next = nodes[0];

    expect(getFirstLoopNode(nodes[0])).toBe(nodes[0]);
  });

  test('input 1,2,3,4,5,6,7,8,9,6 output 6', () => {
    const nodes = buildNodes([1, 2, 3, 4, 5, 6, 7, 8, 9, 6]);
    // 设置第一个入环的节点
    nodes[nodes.length - 1].next = nodes[5];

    expect(getFirstLoopNode(nodes[0])).toBe(nodes[5]);
  });

  test('input 1,2,3,4,5,6,7,8,9 output null', () => {
    const nodes = buildNodes([1, 2, 3, 4, 5, 6, 7, 8, 9]);

    expect(getFirstLoopNode(nodes[0])).toBe(null);
  });
});

describe('getFirstIntersectNode', () => {
  test('input null,null output null', () => {
    expect(getFirstIntersectNode(null, null)).toBe(null);
  });

  test('input null,1 output null', () => {
    expect(getFirstIntersectNode(new SingleLinkedList(1), null)).toBe(null);
  });

  test('input 1,null output null', () => {
    expect(getFirstIntersectNode(null, new SingleLinkedList(1))).toBe(null);
  });

  test('input 1,1 output null', () => {
    expect(
      getFirstIntersectNode(new SingleLinkedList(1), new SingleLinkedList(1))
    ).toBe(null);
  });

  test('input [1,2,3,4,5],[0,3,4,5] output 3', () => {
    const nodes1 = buildNodes([1, 2, 3, 4, 5]);
    const nodes2 = buildNodes([0]);
    nodes2[0].next = nodes1[2];

    expect(getFirstIntersectNode(nodes1[0], nodes2[0])).toBe(nodes1[2]);
  });

  test('input [1,2,3,4,5,6,7,8,9,0],[0,3,4] output 5', () => {
    const nodes1 = buildNodes([1, 2, 3, 4, 5, 6, 7, 8, 9, 0]);
    nodes1[nodes1.length - 1].next = nodes1[4];

    const nodes2 = buildNodes([0, 3, 4]);
    nodes2[nodes2.length - 1].next = nodes1[4];

    expect(getFirstIntersectNode(nodes1[0], nodes2[0])).toBe(nodes1[4]);
  });

  test('input [1,2,3,4,5,6,7,8,9,0],[0,3,4] output 5', () => {
    const nodes1 = buildNodes([1, 2, 3, 4, 5, 6, 7, 8, 9, 0]);
    nodes1[nodes1.length - 1].next = nodes1[4];

    const nodes2 = buildNodes([0, 3, 4]);
    nodes2[nodes2.length - 1].next = nodes1[7];

    expect(getFirstIntersectNode(nodes1[0], nodes2[0])).toBe(nodes1[4]);
  });
});
