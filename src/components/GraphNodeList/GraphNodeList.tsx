import React from 'react';
import { List, Button, Tooltip } from 'antd';
import { ID3GraphNode } from '../../types/graphTypes';

import './GraphNodeList.css';

interface IPropsGraphNodeList {
  nodes: ID3GraphNode[];
  onRemoveNode: (nodeID: ID3GraphNode) => void;
}

function GraphNodeList(props: IPropsGraphNodeList) {
  return (
    <List
      header={
        <span style={{ padding: '14px', fontWeight: 'bold' }}>
          Focused Nodes:
        </span>}
      size='small'
      className='Node-List-Item'
      dataSource={props.nodes}
      renderItem={(item: ID3GraphNode) => (
        <Tooltip placement='topLeft' title={item.label}>
          <List.Item
            className='Node-List-Item'
            style={{
              paddingLeft: '14px',
              paddingBottom: '4px',
              paddingTop: '4px',
            }}
            key={item.id}
            actions={[
              <Button
                key={item.id}
                onClick={() => props.onRemoveNode(item)}
                icon='close'
              />,
            ]}
          >
            {item.label}
          </List.Item>
        </Tooltip>
      )}
    />
  );
}

export default GraphNodeList;
