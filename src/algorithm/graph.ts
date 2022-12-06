import { Queue } from './queue';
import { Stack } from './stack';
export class Edge {
    weight: number;
    from: GraphNode;
    to: GraphNode;

    constructor(weight: number, from: GraphNode, to: GraphNode) {
        this.weight = weight;
        this.from = from;
        this.to = to;
    }
}

export class GraphNode {
    id: number;
    inEdgeCount: number = 0;
    outEdgeCount: number = 0;
    nextNodes: Array<GraphNode> = [];
    nextEdges: Array<Edge> = [];

    constructor(id: number) {
        this.id = id;
    }
}

export class Graph<T = number> {
    nodes: Map<T, GraphNode> = new Map();
    edges: Set<Edge> = new Set();

    public static convertEdgeArrayToGraph(edgeArray: Array<Array<number>>) {
        const graph = new Graph();

        edgeArray.forEach(([weight, from, to]) => {
            const { nodes, edges } = graph;

            if (!nodes.has(from)) {
                nodes.set(from, new GraphNode(from));
            }
            if (!nodes.has(to)) {
                nodes.set(to, new GraphNode(to));
            }

            const fromNode = nodes.get(from) as GraphNode;
            const toNode = nodes.get(to) as GraphNode;
            const edge = new Edge(weight, fromNode, toNode);

            fromNode.outEdgeCount++;
            fromNode.nextEdges.push(edge);
            fromNode.nextNodes.push(toNode);
            toNode.inEdgeCount++;

            edges.add(edge);
        });

        return graph;
    }
}

export function bfsGraph(node: GraphNode | undefined): GraphNode[] | null {
    if (!node) {
        return null;
    }

    const result: GraphNode[] = [];
    const addedNodes = new Set<GraphNode>();
    const queue = new Queue<GraphNode>();

    queue.add(node);
    addedNodes.add(node);

    while (!queue.isEmpty()) {
        const cur = queue.poll() as GraphNode;
        result.push(cur);

        cur.nextNodes.forEach((node) => {
            if (addedNodes.has(node)) {
                return;
            }

            queue.add(node);
            addedNodes.add(node);
        });
    }

    return result;
}

export function dfsGraph(node: GraphNode): GraphNode[] | null {
    if (!node) {
        return null;
    }

    const result: GraphNode[] = [];
    const addedNodes = new Set<GraphNode>();
    const stack = new Stack<GraphNode>();

    stack.push(node);
    addedNodes.add(node);
    result.push(node);

    while (!stack.isEmpty()) {
        const cur = stack.pop();

        for (const nextNode of cur.nextNodes) {
            if (addedNodes.has(nextNode)) {
                continue;
            }

            addedNodes.add(nextNode);
            stack.push(cur);
            stack.push(nextNode);

            result.push(nextNode);
            break;
        }
    }

    return result;
}

export function miniSpanTreeK(node: GraphNode) {}

export function miniSpanTreeP(node: GraphNode) {}
