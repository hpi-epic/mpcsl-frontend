import { Button, Row, Form } from 'antd';
import React from 'react';

import NewDatasetModal, { IPropsNewDatasetModal } from './NewDatasetModal';
import './style.css';

interface IStateDatasetManagement {
  newDatasetModalVisible: boolean;
}

class DatasetManagement extends React.Component<{}, IStateDatasetManagement> {
  constructor(props: {}) {
    super(props);

    this.state = {
      newDatasetModalVisible: false,
    };
  }

  public render() {
    const DatasetModal = Form.create<IPropsNewDatasetModal>()(NewDatasetModal);
    return (
      <div className='Content'>
        <Row>
          <div className='Dataset-Controls'>
            <Button type='primary' onClick={this.onNewDataset}>+ New Dataset</Button>
          </div>
        </Row>
        <DatasetModal visible={this.state.newDatasetModalVisible} onClose={this.onClose}/>
      </div>
    );
  }

  private onNewDataset = () => {
    this.setState({
      newDatasetModalVisible: true,
    });
  }

  private onClose = () => {
    this.setState({
      newDatasetModalVisible: false,
    });
  }
}

export default DatasetManagement;
