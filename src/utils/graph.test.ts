import { ID3GraphNode } from './../types/graphTypes';
import {
  CIGraph,
  addUniqueLinks,
  addUniqueNodes,
  resetLayout,
  removeNodeFromFocus,
} from './graph';
import { IAPIResult } from '../types';
import { ID3Graph } from '../types/graphTypes';
import { IndepenceTests } from '../constants/experiment';

describe('CIGraph', () => {
  const testD3Graph: ID3Graph = {
    nodes: [{ id: '1', label: 'a' }, { id: '2', label: 'b' }],
    links: [{ source: '1', target: '2' }, { source: '2', target: '1' }],
  };

  it('is created correctly from D3 Graph and converted back', () => {
    const ciGraph = new CIGraph();

    ciGraph.fromD3Graph(testD3Graph);

    expect(ciGraph.toD3Graph()).toEqual(testD3Graph);
  });

  it('is created correctly from API Graph', () => {
    const apiResult: IAPIResult = {
      nodes: [
        {
          id: 1,
          name: 'a',
          result: 1,
          result_id: 1,
        },
        {
          id: 2,
          name: 'b',
          result: 2,
          result_id: 2,
        },
      ],
      edges: [
        {
          id: 1,
          result: 1,
          result_id: 1,
          from_node_id: 1,
          from_node: 1,
          to_node_id: 2,
          to_node: 2,
          start_time: 'time',
        },
        {
          id: 2,
          result: 1,
          result_id: 1,
          from_node_id: 2,
          from_node: 2,
          to_node_id: 1,
          to_node: 1,
          start_time: 'time',
        },
      ],
      sepset: [],
      meta_results: {
        alpha: 1,
        api_host: '1',
        cores: 1,
        dataset_id: '1',
        fixed_edges: 'FALSE',
        fixed_graps: 'FALSE',
        help: false,
        independence_test: IndepenceTests.binCI,
        job_id: '1',
      },
    };
    const ciGraph = new CIGraph();
    ciGraph.fromAPIGraph(apiResult);

    expect(ciGraph.toD3Graph()).toEqual(testD3Graph);
  });

  it('returns Context correctly', () => {
    const ciGraph = new CIGraph();
    ciGraph.fromD3Graph(testD3Graph);

    const expectedGraph = {
      nodes: [{ id: '2', label: 'b' }],
      links: [{ source: '2', target: '1' }, { source: '1', target: '2' }],
    };

    expect(ciGraph.getContext('1')).toEqual(expectedGraph);
  });
});

describe('addUniqueLinks()', () => {
  it('returns unique links', () => {
    const links = [
      {
        source: { id: '1' },
        target: { id: '2' },
      },
      {
        source: { id: '2' },
        target: { id: '1' },
      },
    ];
    const addLinks = [
      { source: '1', target: '2' },
      { source: '3', target: '4' },
    ];

    const uniqueLinks = addUniqueLinks(links, addLinks);
    const linksToExpect = [
      {
        source: { id: '1' },
        target: { id: '2' },
      },
      {
        source: { id: '2' },
        target: { id: '1' },
      },
      { source: '3', target: '4' },
    ];

    expect(uniqueLinks).toEqual(linksToExpect);
  });

  it('is defineable', () => {
    const ciGraph = new CIGraph();
    expect(ciGraph).toBeDefined();
  });
});

describe('addUniqueNodes()', () => {
  const addNodes: ID3GraphNode[] = [
    { id: '3', label: 'c' },
    { id: '1', label: 'a' },
  ];

  it('adds unique Nodes and freezes correctly', () => {
    const nodes: ID3GraphNode[] = [
      { id: '1', label: 'a', x: 1, y: 1 },
      { id: '2', label: 'b', x: 1, y: 1 },
    ];

    const ciGraph: CIGraph = new CIGraph();
    ciGraph.fromD3Graph({
      nodes: [...nodes, { id: '3', label: 'c' }],
      links: [],
    });

    const uniqueNodes: ID3GraphNode[] = addUniqueNodes(
      nodes,
      ciGraph,
      '1',
      addNodes,
      true,
    );

    const expectedNodes: ID3GraphNode[] = [
      { id: '1', label: 'a', x: 1, y: 1, fx: 1, fy: 1, isContext: false },
      { id: '2', label: 'b', x: 1, y: 1, fx: 1, fy: 1 },
      { id: '3', label: 'c', isContext: true, contextOf: { 1: true } },
    ];

    expect(uniqueNodes).toEqual(expectedNodes);
  });

  it('adds unique Nodes correctly without freezing', () => {
    const nodes: ID3GraphNode[] = [
      { id: '1', label: 'a', x: 1, y: 1, isContext: true },
      { id: '2', label: 'b', x: 1, y: 1, isContext: true },
    ];

    const ciGraph: CIGraph = new CIGraph();
    ciGraph.fromD3Graph({
      nodes: [...nodes, { id: '3', label: 'c' }],
      links: [],
    });

    const uniqueNodes: ID3GraphNode[] = addUniqueNodes(
      nodes,
      ciGraph,
      '1',
      addNodes,
      false,
    );

    const expectedNodes: ID3GraphNode[] = [
      { id: '1', label: 'a', x: 1, y: 1, isContext: false },
      { id: '2', label: 'b', x: 1, y: 1, isContext: true },
      { id: '3', label: 'c', isContext: true, contextOf: { 1: true } },
    ];

    expect(uniqueNodes).toEqual(expectedNodes);
  });
});

describe('resetLayout()', () => {
  it('resets Layout correctly', () => {
    const testD3Graph: ID3Graph = {
      nodes: [
        { id: '1', label: 'a', fx: 1, fy: 1 },
        { id: '2', label: 'b', fx: 1, fy: 1 },
      ],
      links: [{ source: '1', target: '2' }, { source: '2', target: '1' }],
    };

    const expectedGraph: ID3Graph = {
      nodes: [
        { id: '1', label: 'a', vx: 0, vy: 0 },
        { id: '2', label: 'b', vx: 0, vy: 0 },
      ],
      links: [{ source: '1', target: '2' }, { source: '2', target: '1' }],
    };

    expect(resetLayout(testD3Graph)).toEqual(expectedGraph);
  });
});

describe('removeNodeFromFocus()', () => {
  it('removes Node correctly', () => {
    const nodes: ID3GraphNode[] = [
      { id: '1', label: 'a', isContext: true, contextOf: { 2: true } },
      { id: '2', label: 'b', isContext: false },
      { id: '3', label: 'c', isContext: false },
    ];

    const testD3Graph = {
      nodes,
      links: [
        { source: nodes[0], target: nodes[1] },
        { source: nodes[1], target: nodes[2] },
      ],
    };

    const expectedGraph = {
      nodes: [{ id: '3', label: 'c', isContext: false }],
      links: [{ source: nodes[1], target: nodes[2] }],
    };
    const returnedGraph = removeNodeFromFocus(
      (testD3Graph as unknown) as ID3Graph,
      {
        id: '2',
        label: 'b',
      },
    );
    expect(returnedGraph).toEqual(expectedGraph);
  });
});
