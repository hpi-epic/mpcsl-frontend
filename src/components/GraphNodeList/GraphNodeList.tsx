import React from 'react';
import { List, Button, Tooltip } from 'antd';
import { ID3GraphNode } from '../../types/graphTypes';

import './GraphNodeList.css';

interface IPropsGraphNodeList {
  nodes: ID3GraphNode[];
  onNodeClick?: (node: ID3GraphNode) => void;
  onRemoveNode?: (nodeID: ID3GraphNode) => void;
  isSelectionMode: boolean;
}

function GraphNodeList(props: IPropsGraphNodeList) {
  return (
    <List
      header={
        <span style={{ padding: '14px', fontWeight: 'bold' }}>
          Focused Nodes:
        </span>
      }
      size="small"
      className="Node-List-Item"
      dataSource={props.nodes}
      renderItem={(item: ID3GraphNode) => (
        <Tooltip
          placement="topLeft"
          title={item.label}
          overlayStyle={{ paddingLeft: '4px' }}
        >
          <List.Item
            className="Node-List-Item"
            style={{
              paddingLeft: '14px',
              paddingBottom: '4px',
              paddingTop: '4px'
            }}
            key={item.id}
            actions={
              props.isSelectionMode
                ? [
                    <Button
                      key={item.id}
                      onClick={() => props.onRemoveNode!(item)}
                      icon="close"
                    />
                  ]
                : []
            }
          >
            <div onClick={() => props.onNodeClick!(item)}>{item.label}</div>
          </List.Item>
        </Tooltip>
      )}
    />
  );
}

export default GraphNodeList;
