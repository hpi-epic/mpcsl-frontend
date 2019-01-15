import React from 'react';
import renderer from 'react-test-renderer';
import GraphNodeList from './GraphNodeList';

describe('<GraphNodeList />', () => {
  it('renders correctly', () => {
    const nodeList = ['node1', 'node2', 'node3'];
    const tree = renderer.create(<GraphNodeList nodes={nodeList} />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
