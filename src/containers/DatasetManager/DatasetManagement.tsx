import { Button, Col, Row } from 'antd';
import React from 'react';

import './style.css';

class DatasetManagement extends React.Component {
  public render() {
    return (
      <div className='Content'>
        <Row>
          <div className='Dataset-Controls'>
            <Button type='primary'>+ New Dataset</Button>
          </div>
        </Row>
      </div>
    );
  }
}

export default DatasetManagement;
