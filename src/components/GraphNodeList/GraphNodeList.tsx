import React from 'react';
import { List, Tooltip } from 'antd';
import { ID3GraphNode } from '../../types/graphTypes';

import './GraphNodeList.css';

interface IPropsGraphNodeList {
  nodes: ID3GraphNode[];
}

function GraphNodeList(props: IPropsGraphNodeList) {
  return (
    <List
      header={
        <span style={{ padding: '14px', fontWeight: 'bold' }}>
          Focused Nodes:
        </span>}
      size='small'
      dataSource={props.nodes}
      renderItem={(item: ID3GraphNode) => (
        <Tooltip placement='topLeft' title={item.label}>
          <List.Item
            className='Node-List-Item'
            key={item.id}
            style={{ padding: '14px' }}
          >
            {item.label}
          </List.Item>
        </Tooltip>
      )}
    />
  );
}

export default GraphNodeList;
