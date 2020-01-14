import React, { useState, useEffect } from 'react';
import { IObservationMatrix } from '../../types';
import {
  getObservationMatrices,
  deleteObservationMatrix
} from '../../actions/apiRequests';
import NewObservationMatrixModal, {
  IPropsNewObservationMatrixModal,
  IFormObservationMatrix
} from '../../containers/ObservationMatricesManager/NewObservationMatrixModal';
import { Card, Button, Popconfirm, Form, Row } from 'antd';
import styles from './ObservationMatrixView.module.scss';
import { useHistory } from 'react-router-dom';

interface IObservationMatrixList {
  onView: (observationMatrix: IObservationMatrix) => void;
}

interface IObservationMatrixListElement {
  id: number;
  load_query: string;
  name: string;
  description?: string;
  data_source?: string;
  time_created?: string;
  onClick: () => void;
}

const ObservationMatrixListItem = (props: IObservationMatrixListElement) => {
  const { name, description } = props;
  const history = useHistory();
  return (
    <Card
      title={name}
      hoverable
      className={styles.ObservationMatrixListItem}
      onClick={() => history.push(`/${props.id}/experiments`)}
    >
      <div className={styles.ObservationMatrixListItemContent}>
        <p>{description}</p>
        <div style={{ alignSelf: 'flex-end' }}>
          <Button
            className={styles.ListButton}
            onClick={e => {
              e.stopPropagation();
              props.onClick();
            }}
            type="primary"
            ghost={true}
          >
            View
          </Button>
          <Popconfirm
            title="Delete Matrix?"
            onConfirm={e => {
              e?.stopPropagation();
              deleteObservationMatrix(props);
            }}
            onCancel={e => e?.stopPropagation()}
          >
            <Button
              icon="delete"
              type="danger"
              className={styles.ListButton}
              ghost={true}
              onClick={e => e.stopPropagation()}
            >
              Delete
            </Button>
          </Popconfirm>
        </div>
      </div>
    </Card>
  );
};

const ObservationMatrixList = (props: IObservationMatrixList) => {
  const [matrices, setMatrices] = useState<undefined | IObservationMatrix[]>();
  useEffect(() => {
    getObservationMatrices()
      .then(setMatrices)
      .catch();
  }, []);
  return matrices ? (
    <div className={styles.ObservationMatrixList}>
      {matrices.map(matrix => (
        <ObservationMatrixListItem
          onClick={() => props.onView(matrix)}
          key={matrix.id}
          {...matrix}
        />
      ))}
    </div>
  ) : null;
};

const ObservationMatrixView = () => {
  const ObservationMatrixModal = Form.create<IPropsNewObservationMatrixModal>()(
    NewObservationMatrixModal
  );
  const [
    observationMatrixModalVisible,
    setObservationMatrixModalVisible
  ] = useState<boolean>(false);
  const [currentObservationMatrix, setCurrentObservationMatrix] = useState<
    undefined | IFormObservationMatrix
  >();
  const onNewObservationMatrix = () => {
    setObservationMatrixModalVisible(true);
    setCurrentObservationMatrix(undefined);
  };
  const onClose = () => {
    setObservationMatrixModalVisible(false);
    setCurrentObservationMatrix(undefined);
  };
  const OnViewObservationMatrix = (observationMatrix: IObservationMatrix) => {
    setCurrentObservationMatrix({
      observationMatrixName: observationMatrix.name,
      observationMatrixDescription: observationMatrix.description || '-',
      query: observationMatrix.load_query,
      dataSource: observationMatrix.data_source || '-'
    });
    setObservationMatrixModalVisible(true);
  };
  return (
    <div className="Content">
      <Row>
        <div className={styles.ObservationMatrixControls}>
          <Button type="primary" onClick={onNewObservationMatrix}>
            + New Observation Matrix
          </Button>
        </div>
      </Row>
      <Row>
        <ObservationMatrixList
          onView={OnViewObservationMatrix}
        ></ObservationMatrixList>
      </Row>
      <ObservationMatrixModal
        visible={observationMatrixModalVisible}
        onClose={onClose}
        observationMatrix={currentObservationMatrix}
      />
    </div>
  );
};

export { ObservationMatrixView };
