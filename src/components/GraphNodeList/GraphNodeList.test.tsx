import React from 'react';
import renderer from 'react-test-renderer';
import GraphNodeList from './GraphNodeList';

describe('<GraphNodeList />', () => {
  it('renders correctly', () => {
    const nodeList = [
      { id: '1', label: 'node1' },
      { id: '2', label: 'node2' },
      { id: '3', label: 'node3' },
    ];
    const tree = renderer
      .create(<GraphNodeList onRemoveNode={() => undefined} nodes={nodeList} />)
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
