import { Form } from 'antd';
import React, { useEffect, useState } from 'react';
import {
  getObservationMatrices,
  subscribeToDatasetChanges
} from '../../restAPI/apiRequests';
import { IObservationMatrix } from '../../types/types';
import { ObservationMatrixListItem } from './ObservationMatrixListItem/ObservationMatrixListItem';
import NewObservationMatrixModal, {
  IFormObservationMatrix,
  IPropsNewObservationMatrixModal
} from './NewObservationMatrixModal';
import styles from './ObservationMatrixView.module.scss';

export const ObservationMatrixView = () => {
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
