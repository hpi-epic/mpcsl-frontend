import { Button, Form } from 'antd';
import React, { useState } from 'react';
import NewObservationMatrixModal, {
  IPropsNewObservationMatrixModal
} from './NewObservationMatrixModal';

export const NewObservationMatrixButton = () => {
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
