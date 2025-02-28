import { GenericHeapWithReassign } from '../generic-heap-reassign';
import { times } from '../../common/index';

describe('GenericHeap', () => {
  type Entity = { prop1: number; prop2: number };

  const testData: Array<{ input: Entity[]; expected: Entity[] }> = [
    {
      input: [
        { prop1: 1, prop2: 1 },
        { prop1: 4, prop2: 2 },
        { prop1: 1, prop2: 4 },
      ],
      expected: [
        { prop1: 1, prop2: 4 },
        { prop1: 4, prop2: 2 },
        { prop1: 1, prop2: 1 },
      ],
    },
    {
      input: [
        { prop1: 1, prop2: 1 },
        { prop1: 4, prop2: 2 },
        { prop1: 2, prop2: 5 },
        { prop1: 2, prop2: 3 },
      ],
      expected: [
        { prop1: 2, prop2: 5 },
        { prop1: 2, prop2: 3 },
        { prop1: 4, prop2: 2 },
        { prop1: 1, prop2: 1 },
      ],
    },
  ];

  it.each(testData)('GenericHeap %j', ({ input, expected }) => {
    const heap = new GenericHeapWithReassign(
      (a: Entity, b: Entity) => b.prop2 - a.prop2
    );

    input.forEach((val) => heap.push(val));
    expect(times(input.length, () => heap.pop())).toEqual(expected);
    expect(heap.isEmpty()).toBe(true);
  });

  test('GenericHeap reassign', () => {
    const input = [
      { prop1: 1, prop2: 1 },
      { prop1: 4, prop2: 2 },
      { prop1: 1, prop2: 4 },
      { prop1: 1, prop2: 5 },
    ];
    const expected = [
      { prop1: 1, prop2: 10 },
      { prop1: 1, prop2: 5 },
      { prop1: 1, prop2: 4 },
      { prop1: 4, prop2: 2 },
    ];

    const heap = new GenericHeapWithReassign(
      (a: Entity, b: Entity) => b.prop2 - a.prop2
    );
    input.forEach((val) => heap.push(val));

    input[0].prop2 = 10;
    heap.reassign(input[0]);

    expect(times(input.length, () => heap.pop())).toEqual(expected);
  });
});
