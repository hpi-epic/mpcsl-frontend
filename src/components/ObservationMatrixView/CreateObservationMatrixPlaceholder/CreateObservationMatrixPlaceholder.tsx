import { Form, Icon, Tooltip } from 'antd';
import React, { useState } from 'react';
import NewObservationMatrixModal, {
  IPropsNewObservationMatrixModal
} from '../NewObservationMatrixModal';
import style from './CreateObservationMatrixPlaceholder.module.scss';

const CreateObservationMatrixPlaceholder = () => {
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
      <div
        className={style.CreateObservationMatrixPlaceholder}
        onClick={onNewObservationMatrix}
      >
        <Tooltip title="Add Observation Matrix">
          <Icon
            style={{
              fontSize: 40,
              color: 'rgba(0, 0, 0, 0.45)',
              padding: 25
            }}
            type="plus"
          />
        </Tooltip>
      </div>
      <ObservationMatrixModal
        visible={observationMatrixModalVisible}
        onClose={() => setObservationMatrixModalVisible(false)}
        observationMatrix={undefined}
      />
    </>
  );
};

export default CreateObservationMatrixPlaceholder;
