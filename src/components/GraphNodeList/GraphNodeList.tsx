import React from 'react';
import { List, Button } from 'antd';

import './GraphNodeList.css';

interface IPropsGraphNodeList {
  nodes: string[];
  onRemoveNode: (nodeID: string) => void;
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
      renderItem={(item: string) => (
        <List.Item
          style={{
            paddingLeft: '14px',
            paddingBottom: '4px',
            paddingTop: '4px',
          }}
          actions={[
            <Button
              key={item}
              onClick={() => props.onRemoveNode(item)}
              icon='close'
            />,
          ]}
        >
          {item}
        </List.Item>
      )}
    />
  );
}

export default GraphNodeList;
