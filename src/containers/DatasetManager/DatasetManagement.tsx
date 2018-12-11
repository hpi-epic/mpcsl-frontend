import { Button, Row, Form, message } from 'antd';
import React, {Fragment} from 'react';
import axios, { AxiosResponse } from 'axios';
import { Endpoints } from '../../types';
import NewDatasetModal, { IPropsNewDatasetModal } from './NewDatasetModal';
import ListElementDataset from '../../components/ListElementDataset/ListElementDataset';
import './style.css';
import { any } from 'prop-types';

interface IStateDatasetManagement {
  newDatasetModalVisible: boolean;
  datasets: any,
}

class DatasetManagement extends React.Component<{}, IStateDatasetManagement> {
  constructor(props: {}) {
    super(props);

    this.state = {
      newDatasetModalVisible: false,
      datasets: [],
    };
  }

  public render() {
    const DatasetModal = Form.create<IPropsNewDatasetModal>()(NewDatasetModal);
    const DatasetList: any = this.state.datasets.map((value: any) =>
       (<ListElementDataset title="test" key={value.id} content={'testContent'} onDelete={this.onDatasetDelete} onView={this.onDatasetView} />));

    return (
      <div className='Content'>
        <Row>
          <div className='Dataset-Controls'>
            <Button type='primary' onClick={this.onNewDataset}>+ New Dataset</Button>
          </div>
        </Row>
        <Row>
          {DatasetList}
        </Row>
        <DatasetModal visible={this.state.newDatasetModalVisible} onClose={this.onClose}/>
      </div>
    );
  }

  componentDidMount() {
    this.getDatasets();
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

  private getDatasets = () => {
    axios
      .get(`${Endpoints.allDatasets}`)
      .then((response: AxiosResponse<any>) => {
        console.log(response);
        this.setState({
          datasets: response.data,
        });
      })
      .catch((e: any) => {
        message.error('Failed to load Datasets!');
      });
  };

  private onDatasetDelete = () => {
    console.log('delete');
  }

  private onDatasetView = () => {
    console.log('view dataset');
  }

}

export default DatasetManagement;
