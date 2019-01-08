import React from 'react';
import { List } from 'antd';

interface IPropsGraphNodeList {
  nodes: string[];
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
      renderItem={(item: string) => (
        <List.Item style={{ padding: '14px' }}>{item}</List.Item>
      )}
    />
  );
}

export default GraphNodeList;
