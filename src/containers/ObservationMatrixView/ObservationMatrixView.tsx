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
import { Button, Form } from 'antd';
import styles from './ObservationMatrixView.module.scss';
import { ObservationMatrixListItem } from '../../components/ObservationMatrixListItem/ObservationMatrixListItem';

interface IObservationMatrixList {
  onView: (observationMatrix: IObservationMatrix) => void;
}

const NewObservationMatrixButton = () => {
  const ObservationMatrixModal = Form.create<IPropsNewObservationMatrixModal>()(
    NewObservationMatrixModal
  );
  const [
    observationMatrixModalVisible,
    setObservationMatrixModalVisible
  ] = useState<boolean>(false);
  const onNewObservationMatrix = () => {
    setObservationMatrixModalVisible(true);
  };
  return (
    <>
      <Button type="primary" onClick={onNewObservationMatrix}>
        + New Observation Matrix
      </Button>
      <ObservationMatrixModal
        visible={observationMatrixModalVisible}
        onClose={() => setObservationMatrixModalVisible(false)}
        observationMatrix={undefined}
      />
    </>
  );
};

const ObservationMatrixView = () => {
  const ObservationMatrixModal = Form.create<IPropsNewObservationMatrixModal>()(
    NewObservationMatrixModal
  );
  const [matrices, setMatrices] = useState<undefined | IObservationMatrix[]>();
  const [
    observationMatrixModalVisible,
    setObservationMatrixModalVisible
  ] = useState<boolean>(false);
  const [currentObservationMatrix, setCurrentObservationMatrix] = useState<
    undefined | IFormObservationMatrix
  >();
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
  return (
    <>
      {matrices ? (
        <div className={styles.ObservationMatrixList}>
          {matrices.map(matrix => (
            <ObservationMatrixListItem
              onClick={() => OnViewObservationMatrix(matrix)}
              key={matrix.id}
              {...matrix}
            />
          ))}
        </div>
      ) : null}
      <ObservationMatrixModal
        visible={observationMatrixModalVisible}
        onClose={onClose}
        observationMatrix={currentObservationMatrix}
      />
    </>
  );
};

export { ObservationMatrixView, NewObservationMatrixButton };
