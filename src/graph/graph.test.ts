import { GraphSingleton } from './graph';
import { ID3GraphNode } from '../types/graphTypes';

describe('Graph', () => {
  it('constructs correctly', () => {
    expect(GraphSingleton).toBeDefined();
  });

  it('addLink() adds a link correctly', () => {
    GraphSingleton.resetGraph();
    (GraphSingleton as any).addLink(1, 2);
    expect(GraphSingleton.links).toEqual([{ source: '1', target: '2' }]);
  });

  it('addUniqueLinks() only adds unique links', () => {
    GraphSingleton.resetGraph();
    const nodes: ID3GraphNode[] = [
      { id: '1', label: '1' },
      { id: '2', label: '2' }
    ];
    const links = [{ source: nodes[0].id, target: nodes[1].id }];
    GraphSingleton.nodes = nodes;
    GraphSingleton.links = links;
    (GraphSingleton as any).addUniqueAPILinks([
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

    expect(GraphSingleton.links).toEqual([
      { source: nodes[0].id, target: nodes[1].id }
    ]);
  });

  describe('resetLayout() resets layout', () => {
    GraphSingleton.resetGraph();
    GraphSingleton.links = [
      { source: '1', target: '2' },
      { source: '2', target: '1' }
    ];
    GraphSingleton.nodes = [
      { id: '1', label: 'a', fx: 1, fy: 1 },
      { id: '2', label: 'b', fx: 1, fy: 1 }
    ];

    GraphSingleton.resetLayout();

    expect(GraphSingleton.nodes).toEqual([
      { id: '1', label: 'a', vx: 0, vy: 0 },
      { id: '2', label: 'b', vx: 0, vy: 0 }
    ]);
  });

  it('removeNodeFromFocus() removes Node from Focus', () => {
    GraphSingleton.resetGraph();
    const nodes: ID3GraphNode[] = [
      { id: '1', label: 'a', isContext: true, contextOf: ['2'] },
      { id: '2', label: 'b', isContext: false },
      { id: '3', label: 'c', isContext: false }
    ];
    GraphSingleton.nodes = nodes;
    GraphSingleton.links = [
      { source: nodes[0].id, target: nodes[1].id },
      { source: nodes[1].id, target: nodes[2].id }
    ];

    GraphSingleton.removeNodeFromFocus({
      id: '2',
      label: 'b'
    });

    expect(GraphSingleton.nodes).toEqual([
      { id: '3', label: 'c', isContext: false }
    ]);
  });
});
