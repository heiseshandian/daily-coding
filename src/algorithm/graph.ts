import { GenericHeap } from './generic-heap';
import { Queue } from './queue';
import { Stack } from './stack';
import { UnionSet } from './union-set';
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

export function topologicalSortGraph(graph: Graph): GraphNode[] {
    const inEdgeCountMap = new Map<GraphNode, number>();
    const zeroInQueue = new Queue<GraphNode>();

    graph.nodes.forEach((node) => {
        inEdgeCountMap.set(node, node.inEdgeCount);
        if (node.inEdgeCount === 0) {
            zeroInQueue.add(node);
        }
    });

    const result: GraphNode[] = [];

    while (!zeroInQueue.isEmpty()) {
        const cur = zeroInQueue.poll() as GraphNode;
        result.push(cur);

        for (const nextNode of cur.nextNodes) {
            inEdgeCountMap.set(nextNode, (inEdgeCountMap.get(nextNode) as number) - 1);
            if (inEdgeCountMap.get(nextNode) === 0) {
                zeroInQueue.add(nextNode);
            }
        }
    }

    return result;
}

export function miniSpanTreeK(graph: Graph): Set<Edge> {
    const minHeap = new GenericHeap<Edge>((a, b) => a.weight - b.weight);
    const unionSet = new UnionSet<GraphNode>();

    graph.edges.forEach((edge) => {
        minHeap.push(edge);
    });
    for (const [, node] of graph.nodes) {
        unionSet.addNode(node);
    }

    const result = new Set<Edge>();
    while (!minHeap.isEmpty()) {
        const edge = minHeap.pop();
        const { from, to } = edge;
        if (!unionSet.isSameSet(from, to)) {
            result.add(edge);
            unionSet.union(from, to);
        }
    }

    return result;
}

export function miniSpanTreeP(graph: Graph): Set<Edge> {
    const minEdgeHeap = new GenericHeap<Edge>((a, b) => a.weight - b.weight);
    const visitedNodes = new Set<GraphNode>();
    const visitedEdges = new Set<Edge>();

    const result = new Set<Edge>();
    // 防止森林
    for (const [, node] of graph.nodes) {
        if (visitedNodes.has(node)) {
            continue;
        }

        visitedNodes.add(node);
        node.nextEdges.forEach((edge) => {
            if (!visitedEdges.has(edge)) {
                visitedEdges.add(edge);
                minEdgeHeap.push(edge);
            }
        });

        while (!minEdgeHeap.isEmpty()) {
            const curMinEdge = minEdgeHeap.pop();
            if (!visitedNodes.has(curMinEdge.to)) {
                visitedNodes.add(curMinEdge.to);
                result.add(curMinEdge);

                curMinEdge.to.nextEdges.forEach((edge) => {
                    if (!visitedEdges.has(edge)) {
                        visitedEdges.add(edge);
                        minEdgeHeap.push(edge);
                    }
                });
            }
        }
    }

    return result;
}

export function dijkstra(node: GraphNode): Map<GraphNode, number> {
    const distanceMap = new Map<GraphNode, number>();
    distanceMap.set(node, 0);
    const selectedNodes = new Set<GraphNode>();

    let minNode = getMinDistanceNodeFromUnselectedNodes(distanceMap, selectedNodes);
    while (minNode) {
        const minDistance = distanceMap.get(minNode) as number;

        minNode.nextEdges.forEach((edge) => {
            const { weight, to } = edge;
            if (!distanceMap.get(to)) {
                distanceMap.set(to, minDistance + weight);
            } else {
                const previousDistance = distanceMap.get(to) as number;
                distanceMap.set(to, Math.min(minDistance + weight, previousDistance));
            }
        });

        selectedNodes.add(minNode);
        minNode = getMinDistanceNodeFromUnselectedNodes(distanceMap, selectedNodes);
    }

    return distanceMap;
}

function getMinDistanceNodeFromUnselectedNodes(
    distanceMap: Map<GraphNode, number>,
    selectedNodes: Set<GraphNode>
): GraphNode | null {
    let minNode = null;
    let minDistance = Infinity;

    for (const [node, distance] of distanceMap) {
        if (selectedNodes.has(node)) {
            continue;
        }

        if (distance < minDistance) {
            minDistance = distance;
            minNode = node;
        }
    }

    return minNode;
}
