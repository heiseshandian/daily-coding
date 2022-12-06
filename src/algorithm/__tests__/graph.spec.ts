import { bfsGraph, dfsGraph, Graph, GraphNode } from '../graph';
import { bfsGraphTestData, dfsGraphTestData } from './graph.testdata';

describe('bfsGraph', () => {
    it.each(bfsGraphTestData)('bfsGraph %j', ({ input, expected }) => {
        const graph = Graph.convertEdgeArrayToGraph(input);

        expect(bfsGraph(graph.nodes.get(1) as GraphNode)!.map(({ id }) => id)).toEqual(expected);
    });
});

describe('dfsGraph', () => {
    it.each(dfsGraphTestData)('dfsGraph %j', ({ input, expected }) => {
        const graph = Graph.convertEdgeArrayToGraph(input);

        expect(dfsGraph(graph.nodes.get(1) as GraphNode)!.map(({ id }) => id)).toEqual(expected);
    });
});
