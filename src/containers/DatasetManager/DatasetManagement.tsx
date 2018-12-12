import { Button, Row, Form, message } from 'antd';
import React, {Fragment} from 'react';
import { Endpoints, IDataset } from '../../types';
import NewDatasetModal, { IPropsNewDatasetModal, IFormDataset } from './NewDatasetModal';
import ListElementDataset from '../../components/ListElementDataset/ListElementDataset';
import './style.css';
import { getDatasets, deleteDataset } from '../../actions/apiRequests';

interface IStateDatasetManagement {
  datasetModalVisible: boolean;
  datasets: Array<IDataset>,
  viewDataset: undefined | IFormDataset,
}

class DatasetManagement extends React.Component<{}, IStateDatasetManagement> {
  constructor(props: {}) {
    super(props);

    this.state = {
      datasetModalVisible: false,
      datasets: [],
      viewDataset: undefined
    };
  }

  public render() {
    const DatasetModal = Form.create<IPropsNewDatasetModal>()(NewDatasetModal);
    const DatasetList: any = this.state.datasets.map((dataset: IDataset) =>
      (<ListElementDataset title={dataset.name} key={dataset.id} content={'description of dataset'} onDelete={() => this.onDatasetDelete(dataset)} onView={() => this.onDatasetView(dataset)} />));
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
        <DatasetModal visible={this.state.datasetModalVisible} onClose={this.onClose} dataset={this.state.viewDataset}/>
      </div>
    );
  }

  componentDidMount() {
    this.getDatasets();
  }

  private onNewDataset = () => {
    this.setState({
      viewDataset: undefined,
      datasetModalVisible: true,
    });
  }

  private onClose = () => {
    this.setState({
      viewDataset: undefined,
      datasetModalVisible: false,
    });
    this.getDatasets();
  }

  private async getDatasets() {
    const datasets = await getDatasets();
    this.setState({
      datasets: datasets
    });
  };

  private onDatasetDelete = (dataset: IDataset) => {
    deleteDataset(dataset)
      .then(() => {
        this.getDatasets();
      })
  }

  private onDatasetView = (dataset: IDataset) => {
    this.setState({
      viewDataset: { 'datasetName': dataset.name, 'query': dataset.load_query },
      datasetModalVisible: true
    })
  }

}

export default DatasetManagement;
