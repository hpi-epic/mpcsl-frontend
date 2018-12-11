import React from 'react';
import { Row, Button, Form } from 'antd';

import './style.css';
import NewExperimentModal, { IPropsNewExperimentModal } from './NewExperimentModal';

interface IPropsExperimentManagement {
  newExperimentModalVisible: boolean;
}

class ExperimentManagement extends React.Component<{}, IPropsExperimentManagement> {
  constructor(props: {}) {
    super(props);

    this.state = {
      newExperimentModalVisible: false
    }
  }

  public render() {
    const ExperimentModal = Form.create<IPropsNewExperimentModal>()(NewExperimentModal);
    return (
      <div className='Content'>
        <Row>
          <div className='Experiment-Controls'>
            <Button type='primary' onClick={this.onNewExperiment}>+ New Experiment</Button>
          </div>
        </Row>
        <ExperimentModal visible={this.state.newExperimentModalVisible} onClose={this.onClose}/>
      </div>
    );
  }

  private onNewExperiment = () => {
    this.setState({
      newExperimentModalVisible: true,
    });
  }

  private onClose = () => {
    this.setState({
      newExperimentModalVisible: false,
    });
  }
}

export default ExperimentManagement;
