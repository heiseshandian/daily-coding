import { NodeWithRandom, copyRandomList } from '../linked-list';
import { copyRandomListTestData } from './linked-list.testdata';
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

        function convertListToNode(list: Array<[val: number, random: number | null]>) {
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
});
