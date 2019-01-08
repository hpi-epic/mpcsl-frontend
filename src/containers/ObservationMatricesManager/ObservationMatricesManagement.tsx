import { Button, Row, Form } from 'antd';
import React from 'react';
import { IObservationMatrix } from '../../types';
import NewObservationMatrixModal, {
  IPropsNewObservationMatrixModal,
  IFormObservationMatrix,
} from './NewObservationMatrixModal';
import ListElementObservationMatrix from '../../components/ListElementObservationMatrix/ListElementObservationMatrix';
import './style.css';
import {
  getObservationMatrices,
  deleteObservationMatrix,
} from '../../actions/apiRequests';

interface IStateObservationMatricesManagement {
  observationMatrixModalVisible: boolean;
  observationMatrices: IObservationMatrix[];
  currentObservationMatrix: undefined | IFormObservationMatrix;
}

class ObservationMatricesManagement extends React.Component<
  {},
  IStateObservationMatricesManagement
> {
  constructor(props: {}) {
    super(props);

    this.state = {
      observationMatrixModalVisible: false,
      observationMatrices: [],
      currentObservationMatrix: undefined,
    };
  }

  public render() {
    const ObservationMatrixModal = Form.create<
      IPropsNewObservationMatrixModal
    >()(NewObservationMatrixModal);
    const ObservationMatrixList: any = this.state.observationMatrices.map(
      (observationMatrix: IObservationMatrix) => (
        <ListElementObservationMatrix
          title={observationMatrix.name}
          key={observationMatrix.id}
          content={'description of observation matrix'}
          onDelete={() => this.onObservationMatrixDelete(observationMatrix)}
          onView={() => this.onObservationMatrixView(observationMatrix)}
        />
      ),
    );
    return (
      <div className='Content'>
        <Row>
          <div className='ObservationMatrix-Controls'>
            <Button type='primary' onClick={this.onNewObservationMatrix}>
              + New Observation Matrix
            </Button>
          </div>
        </Row>
        <Row>{ObservationMatrixList}</Row>
        <ObservationMatrixModal
          visible={this.state.observationMatrixModalVisible}
          onClose={this.onClose}
          observationMatrix={this.state.currentObservationMatrix}
        />
      </div>
    );
  }

  public componentDidMount() {
    this.fetchObservationMatrices();
  }

  private onNewObservationMatrix = () => {
    this.setState({
      currentObservationMatrix: undefined,
      observationMatrixModalVisible: true,
    });
  }

  private onClose = () => {
    this.setState({
      currentObservationMatrix: undefined,
      observationMatrixModalVisible: false,
    });
    this.fetchObservationMatrices();
  }

  private async fetchObservationMatrices() {
    const observationMatrices = await getObservationMatrices();
    this.setState({
      observationMatrices,
    });
  }

  private onObservationMatrixDelete = (
    observationMatrix: IObservationMatrix,
  ) => {
    deleteObservationMatrix(observationMatrix).then(() => {
      this.fetchObservationMatrices();
    });
  }

  private onObservationMatrixView = (observationMatrix: IObservationMatrix) => {
    this.setState({
      currentObservationMatrix: {
        observationMatrixName: observationMatrix.name,
        query: observationMatrix.load_query,
      },
      observationMatrixModalVisible: true,
    });
  }
}

export default ObservationMatricesManagement;
