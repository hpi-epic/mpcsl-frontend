import React from 'react';
import { ID3GraphNode } from '../../../types/graphTypes';
import { Select, Row, Col } from 'antd';

export const NodeSelection = (props: {
  onNodeSelection: (nodeID: string) => void;
  nodes: ID3GraphNode[];
  placeholder: string;
}) => {
  return (
    <Row
      type='flex'
      align='middle'
      justify='space-around'
      style={{ height: '100%' }}
    >
      <Col span={12}>
        <Select
          showSearch={true}
          placeholder={props.placeholder}
          onChange={(value) => props.onNodeSelection(value.toString())}
          style={{ width: '100%' }}
        >
          {props.nodes.map((node: ID3GraphNode) => (
            <Select.Option key={node.id} value={node.id}>
              {node.label}
            </Select.Option>
          ))}
        </Select>
      </Col>
    </Row>
  );
};
