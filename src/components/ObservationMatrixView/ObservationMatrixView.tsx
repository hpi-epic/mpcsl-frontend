import React, { useEffect, useState } from 'react';
import {
  getObservationMatrices,
  subscribeToDatasetChanges
} from '../../restAPI/apiRequests';
import { IObservationMatrix } from '../../types/types';
import { ObservationMatrixListItem } from './ObservationMatrixListItem/ObservationMatrixListItem';
import styles from './ObservationMatrixView.module.scss';
import ObservationMatrixModal, {
  IFormObservationMatrix
} from './ObservationMatrixModal/ObservationMatrixModal';
import ObservationMatrixPlaceholder from './ObservationMatrixPlaceholder/ObservationMatrixPlaceholder';

export const ObservationMatrixView = () => {
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
      dataSource: observationMatrix.data_source || '-',
      id: observationMatrix.id
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
      <div className={styles.ObservationMatrixList}>
        {matrices?.map(matrix => (
          <ObservationMatrixListItem
            onClick={() => OnViewObservationMatrix(matrix)}
            key={matrix.id}
            {...matrix}
          />
        ))}
        <ObservationMatrixPlaceholder />
      </div>
      <ObservationMatrixModal
        visible={observationMatrixModalVisible}
        onClose={onClose}
        observationMatrix={currentObservationMatrix}
      />
    </>
  );
};
