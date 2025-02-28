import {
  NodeWithRandom,
  copyRandomList,
  reverseBetween,
  rotateRight,
  sortList,
  sortList2,
  oddEvenList,
  detectCycle,
  deleteDuplicates,
  deleteDuplicates2,
  reorderList,
  removeElements,
  removeElements2,
} from '../linked-list';
import {
  copyRandomListTestData,
  deleteDuplicatesTestData,
  detectCycleTestData,
  removeElementsTestData,
  reorderListTestData,
  reverseBetweenTestData,
  rotateRightTestData,
  sortListTestData,
} from './linked-list.testdata';
import { SingleLinkedList } from '../../algorithm/linked-list';
import { oddEvenListTestData } from './linked-list.testdata';
describe('problems/linked-list', () => {
  describe('copyRandomList', () => {
    function convertNodeToList(head: NodeWithRandom | null) {
      const result: Array<[val: number, random: number | null]> = [];

      const map: Map<NodeWithRandom, number> = new Map();
      let cur: NodeWithRandom | null = head;
      let i = 0;
      while (cur) {
        map.set(cur, i++);
        cur = cur.next;
      }

      cur = head;
      while (cur) {
        let random: number | null = null;
        if (cur.random) {
          random = map.get(cur.random)!;
        }

        result.push([cur.val, random]);
        cur = cur.next;
      }

      return result;
    }

    function convertListToNode(
      list: Array<[val: number, random: number | null]>
    ) {
      const nodes = list.map(([val]) => new NodeWithRandom(val));

      // next
      nodes.reduce((prev, next) => {
        prev.next = next;
        return next;
      });

      // random
      nodes.forEach((node, i) => {
        const randomIndex = list[i][1];
        if (randomIndex === null || randomIndex === undefined) {
          return;
        }

        node.random = nodes[randomIndex];
      });

      return nodes[0];
    }

    it.each(copyRandomListTestData)('copyRandomList', ({ input, expected }) => {
      const head = convertListToNode(input);
      expect(convertNodeToList(copyRandomList(head))).toEqual(expected);
    });
  });

  it.each(reverseBetweenTestData)(
    'reverseBetween',
    ({ input: { arr, left, right }, expected }) => {
      const head = SingleLinkedList.from(arr);

      expect(
        SingleLinkedList.toArray(reverseBetween(head, left, right))
      ).toEqual(expected);
    }
  );

  it.each(rotateRightTestData)(
    'rotateRight',
    ({ input: { arr, k }, expected }) => {
      const result = SingleLinkedList.toArray(
        rotateRight(SingleLinkedList.from(arr), k)
      );
      expect(result).toEqual(expected);
    }
  );

  it.each(sortListTestData)('sortList', ({ input, expected }) => {
    const head1 = SingleLinkedList.from(input);
    expect(SingleLinkedList.toArray(sortList(head1))).toEqual(expected);

    const head2 = SingleLinkedList.from(input);
    expect(SingleLinkedList.toArray(sortList2(head2))).toEqual(expected);
  });

  it.each(oddEvenListTestData)('oddEvenList', ({ input, expected }) => {
    const head = SingleLinkedList.from(input);
    const result = SingleLinkedList.toArray(oddEvenList(head));

    expect(result).toEqual(expected);
  });

  it.each(detectCycleTestData)(
    'detectCycle',
    ({ input: { arr, pos }, expected }) => {
      const nodes = arr.map((val) => new SingleLinkedList(val));
      nodes.reduce((prev, cur) => (prev.next = cur));
      if (pos !== -1) {
        nodes[nodes.length - 1].next = nodes[pos];
      }

      expect(detectCycle(nodes[0])?.val).toBe(expected);
    }
  );

  it.each(deleteDuplicatesTestData)(
    'deleteDuplicates',
    ({ input, expected }) => {
      const head = SingleLinkedList.from(input);
      const result = SingleLinkedList.toArray(deleteDuplicates(head));

      const head2 = SingleLinkedList.from(input);
      const result2 = SingleLinkedList.toArray(deleteDuplicates2(head2));

      expect(result).toEqual(expected);
      expect(result2).toEqual(expected);
    }
  );

  it.each(reorderListTestData)('reorderList', ({ input, expected }) => {
    const head = SingleLinkedList.from(input);
    reorderList(head);

    expect(head).toEqual(SingleLinkedList.from(expected));
  });

  it.each(removeElementsTestData)(
    'removeElements',
    ({ input: { arr, val }, expected }) => {
      const head = SingleLinkedList.from(arr);
      const result = SingleLinkedList.toArray(removeElements(head, val));

      const head2 = SingleLinkedList.from(arr);
      const result2 = SingleLinkedList.toArray(removeElements2(head2, val));

      expect(result).toEqual(expected);
      expect(result2).toEqual(expected);
    }
  );
});
