import { AppstoreAddOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import React, { useState } from 'react';
import style from './ObservationMatrixPlaceholder.module.scss';
import NewDatasetGenerationModal from '../NewDatasetGenerationModal/NewDatasetGenerationModal';

const ObservationMatrixPlaceholder = () => {
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
          <AppstoreAddOutlined
            style={{
              fontSize: 40,
              color: 'rgba(0, 0, 0, 0.45)',
              padding: 25
            }}
          />
        </Tooltip>
      </div>
      <NewDatasetGenerationModal
        visible={observationMatrixModalVisible}
        onClose={() => setObservationMatrixModalVisible(false)}
        observationMatrix={undefined}
      />
    </>
  );
};

export default ObservationMatrixPlaceholder;
