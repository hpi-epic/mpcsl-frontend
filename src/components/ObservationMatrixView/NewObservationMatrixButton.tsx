import { Button } from 'antd';
import React, { useState } from 'react';
import ExistingDatasetModal from './ExistingDatasetModal/ExistingDatasetModal';

export const NewObservationMatrixButton = () => {
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
      <ExistingDatasetModal
        visible={observationMatrixModalVisible}
        onClose={() => setObservationMatrixModalVisible(false)}
        observationMatrix={undefined}
      />
    </>
  );
};
