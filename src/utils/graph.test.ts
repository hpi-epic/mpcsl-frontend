import Graph from './graph';
import { ID3GraphNode } from '../types/graphTypes';

describe('Graph', () => {
  it('constructs correctly', () => {
    const graph = new Graph();
    expect(graph).toBeDefined();
  });

  it('addLink() adds a link correctly', () => {
    const graph = new Graph();
    graph.addLink(1, 2);
    expect(graph.links).toEqual([{ source: '1', target: '2' }]);
  });

  it('addUniqueLinks() only adds unique links', () => {
    const nodes: ID3GraphNode[] = [
      { id: '1', label: '1' },
      { id: '2', label: '2' }
    ];
    const links = [{ source: nodes[0], target: nodes[1] }];
    const graph = new Graph(nodes, links);
    graph.addUniqueAPILinks([
      {
        id: 1,
        result: 1,
        result_id: 1,
        from_node_id: 1,
        from_node: 1,
        to_node_id: 2,
        to_node: 2,
        start_time: ''
      }
    ]);

    expect(graph.links).toEqual([{ source: nodes[0], target: nodes[1] }]);
  });

  describe('resetLayout() resets layout', () => {
    const graph = new Graph(
      [
        { id: '1', label: 'a', fx: 1, fy: 1 },
        { id: '2', label: 'b', fx: 1, fy: 1 }
      ],
      [
        { source: '1', target: '2' },
        { source: '2', target: '1' }
      ]
    );

    graph.resetLayout();

    const expectedGraph = new Graph(
      [
        { id: '1', label: 'a', vx: 0, vy: 0 },
        { id: '2', label: 'b', vx: 0, vy: 0 }
      ],
      [
        { source: '1', target: '2' },
        { source: '2', target: '1' }
      ]
    );

    expect(graph).toEqual(expectedGraph);
  });

  it('removeNodeFromFocus() removes Node from Focus', () => {
    const nodes: ID3GraphNode[] = [
      { id: '1', label: 'a', isContext: true, contextOf: { 2: true } },
      { id: '2', label: 'b', isContext: false },
      { id: '3', label: 'c', isContext: false }
    ];

    const graph = new Graph(nodes, [
      { source: nodes[0], target: nodes[1] },
      { source: nodes[1], target: nodes[2] }
    ]);

    const expectedGraph = new Graph(
      [{ id: '3', label: 'c', isContext: false }],
      [{ source: nodes[1], target: nodes[2] }]
    );
    graph.removeNodeFromFocus({
      id: '2',
      label: 'b'
    });

    expect(graph).toEqual(expectedGraph);
  });
});
