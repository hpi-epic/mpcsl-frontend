import React from 'react';
import { List, Tooltip, Icon, Col, Row } from 'antd';
import { ID3GraphNode } from '../../types/graphTypes';

import './ExternalFactorsList.css';

export interface IExternalFactorNode extends ID3GraphNode {
  edited: boolean;
}

const ExternalFactorList = (props: {
  externalFactorsNodes: IExternalFactorNode[];
  onExternalFactorClick: (nodeID: string) => void;
}) => {
  return (
    <div
      style={{
        backgroundColor: 'white',
        overflow: 'hidden',
        overflowY: 'scroll',
      }}
    >
      <List
        size='small'
        header={
          <div style={{ padding: '14px', fontWeight: 'bold' }}>
            External Factors
          </div>}
        dataSource={props.externalFactorsNodes}
        renderItem={(item: IExternalFactorNode) => (
          <Tooltip
            placement='topLeft'
            title={item.label}
            overlayStyle={{ paddingLeft: '4px' }}
          >
            <div
              onClick={() => {
                props.onExternalFactorClick(item.id);
              }}
              className='external-factor-list-item'
            >
              <List.Item key={item.id} style={{ paddingLeft: '14px' }}>
                <div style={{ width: '100%' }}>
                  <Row type='flex' justify='space-around' gutter={12}>
                    <Col span={10}>{item.label}</Col>
                    <Col span={2}>
                      {item.edited ? <Icon type='edit' /> : null}
                    </Col>
                  </Row>
                </div>
              </List.Item>
            </div>
          </Tooltip>
        )}
      />
    </div>
  );
};

export default ExternalFactorList;
