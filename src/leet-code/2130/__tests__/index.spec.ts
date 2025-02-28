import { ListNode, pairSum, reverseSingleLinkedList } from '../index';

describe('pairSum', () => {
  test('pairSum [4,2,2,3] 7', () => {
    const input = buildSingleLinkedList([4, 2, 2, 3]);
    expect(pairSum(input)).toBe(7);
  });

  test('pairSum [1,100000] 100001', () => {
    const input = buildSingleLinkedList([1, 100000]);
    expect(pairSum(input)).toBe(100001);
  });

  test('pairSum [5,4,2,1] 6', () => {
    const input = buildSingleLinkedList([5, 4, 2, 1]);
    expect(pairSum(input)).toBe(6);
  });

  test('pairSum [7,57,13,31,17,65,32,3,97,22,7,20,69,35,69,75,13,33,50,80,64,71,15,28,2,27,39,48,13,22,84,5,51,46,26,78,56,63] 130', () => {
    const input = buildSingleLinkedList([
      7, 57, 13, 31, 17, 65, 32, 3, 97, 22, 7, 20, 69, 35, 69, 75, 13, 33, 50,
      80, 64, 71, 15, 28, 2, 27, 39, 48, 13, 22, 84, 5, 51, 46, 26, 78, 56, 63,
    ]);

    expect(pairSum(input)).toBe(130);
  });
});

describe('reverseSingleLinkedList', () => {
  test('reverseSingleLinkedList null', () => {
    expect(reverseSingleLinkedList(null)).toBe(null);
  });

  test('reverseSingleLinkedList 1 node', () => {
    const input = buildSingleLinkedList([1]);
    expect(reverseSingleLinkedList(input)).toBe(input);
  });

  test('reverseSingleLinkedList 2 nodes', () => {
    const input = buildSingleLinkedList([1, 2]);
    const expected = buildSingleLinkedList([2, 1]);

    expect(reverseSingleLinkedList(input)).toEqual(expected);
  });

  test('reverseSingleLinkedList 3 nodes', () => {
    const input = buildSingleLinkedList([1, 2, 3]);
    const expected = buildSingleLinkedList([3, 2, 1]);

    expect(reverseSingleLinkedList(input)).toEqual(expected);
  });
});

describe('buildSingleLinkedList', () => {
  test('buildSingleLinkedList 1 node', () => {
    const input = [1];
    const expected = new ListNode(1);

    expect(buildSingleLinkedList(input)).toEqual(expected);
  });

  test('buildSingleLinkedList 2 nodes', () => {
    const input = [1, 2];
    const expected = new ListNode(1, new ListNode(2));

    expect(buildSingleLinkedList(input)).toEqual(expected);
  });

  test('buildSingleLinkedList 3 nodes', () => {
    const input = [1, 2, 3];
    const expected = new ListNode(1, new ListNode(2, new ListNode(3)));

    expect(buildSingleLinkedList(input)).toEqual(expected);
  });
});

function buildSingleLinkedList(arr: number[]) {
  const nodes = arr.map((val) => new ListNode(val));
  nodes.forEach((value, index, array) => {
    value.next = array[index + 1] || null;
  });

  return nodes[0];
}
