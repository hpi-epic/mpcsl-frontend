import React, { useState, useEffect } from 'react';
import { IObservationMatrix } from '../../types';
import {
  getObservationMatrices,
  subscribeToDatasetChanges
} from '../../actions/apiRequests';
import NewObservationMatrixModal, {
  IPropsNewObservationMatrixModal,
  IFormObservationMatrix
} from './NewObservationMatrixModal';
import { Button, Form, Row } from 'antd';
import styles from './ObservationMatrixView.module.scss';
import { ObservationMatrixListItem } from '../../components/ObservationMatrixListItem/ObservationMatrixListItem';

interface IObservationMatrixList {
  onView: (observationMatrix: IObservationMatrix) => void;
}

const ObservationMatrixList = (props: IObservationMatrixList) => {
  const [matrices, setMatrices] = useState<undefined | IObservationMatrix[]>();
  useEffect(() => {
    const fetchDatasets = () => {
      getObservationMatrices()
        .then(setMatrices)
        .catch();
    };
    fetchDatasets();
    const sub = subscribeToDatasetChanges(fetchDatasets);
    return () => sub.unsubscribe();
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
