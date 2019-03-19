import React from 'react';
import { List, Tooltip } from 'antd';
import { ID3GraphNode } from '../../types/graphTypes';

import './ExternalFactorsList.css';

const ExternalFactorList = (props: {
  externalFactorsNodes: ID3GraphNode[];
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
        renderItem={(item: ID3GraphNode) => (
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
                {item.label}
              </List.Item>
            </div>
          </Tooltip>
        )}
      />
    </div>
  );
};

export default ExternalFactorList;
