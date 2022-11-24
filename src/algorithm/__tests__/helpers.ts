import { SingleLinkedList, SpecialNode } from '../linked-list';

export function buildSpecialNodes(
    input: Array<{
        val: number;
        next: number | null;
        random: number | null;
    }>
) {
    const nodes = input.map(({ val }) => new SpecialNode(val));
    const val2Node = nodes.reduce<Record<number, SpecialNode>>((acc, node) => {
        acc[node.val] = node;
        return acc;
    }, {});

    nodes.forEach((node, index) => {
        node.next = nodes[index + 1] || null;
        const randomNum = input[index].random;
        node.random = randomNum ? val2Node[randomNum] : null;
    });

    return nodes[0] || null;
}

export function isSingleLinkedListEqual(head1: SingleLinkedList | null, head2: SingleLinkedList | null) {
    return isEqual(head1, head2, (node1: SingleLinkedList, node2: SingleLinkedList) => node1.val === node2.val);
}

export function isSpecialNodeEqual(head1: SpecialNode | null, head2: SpecialNode | null) {
    return isEqual(head1, head2, (node1: SpecialNode, node2: SpecialNode) => {
        return node1.val === node2.val && node1.random?.val === node2.random?.val;
    });
}

function isEqual(
    head1: SingleLinkedList | null,
    head2: SingleLinkedList | null,
    isEqualNode: (node1: any, node2: any) => boolean
) {
    while (head1 && head2) {
        if (!isEqualNode(head1, head2)) {
            return false;
        }

        head1 = head1.next;
        head2 = head2.next;
    }

    return !head1 && !head2;
}
