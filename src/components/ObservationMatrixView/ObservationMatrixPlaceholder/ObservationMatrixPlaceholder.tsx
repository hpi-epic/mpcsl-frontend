import { AppstoreAddOutlined } from '@ant-design/icons';
import { Dropdown, Menu, Tooltip } from 'antd';
import React, { useState } from 'react';
import style from './ObservationMatrixPlaceholder.module.scss';
import DatasetGenerationModal from '../DatasetGenerationModal/DatasetGenerationModal';
import ExistingDatasetModal from '../ExistingDatasetModal/ExistingDatasetModal';

const ObservationMatrixPlaceholder = () => {
  const [
    existingObservationMatrixModalVisible,
    setExistingObservationMatrixModalVisible
  ] = useState<boolean>(false);
  const onExistingObservationMatrix = () => {
    setExistingObservationMatrixModalVisible(true);
  };
  const [
    newObservationMatrixModalVisible,
    setNewObservationMatrixModalVisible
  ] = useState<boolean>(false);
  const onNewObservationMatrix = () => {
    setNewObservationMatrixModalVisible(true);
  };

  const menu = (
    <Menu>
      <Menu.Item onClick={onNewObservationMatrix}>
        New Observation Matrix
      </Menu.Item>
      <Menu.Item onClick={onExistingObservationMatrix}>
        Existing Observation Matrix
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <div className={style.CreateObservationMatrixPlaceholder}>
        <Tooltip title="Register Observation Matrix">
          <Dropdown
            overlay={menu}
            trigger={['click']}
            placement="bottomCenter"
            arrow
          >
            <AppstoreAddOutlined
              style={{
                fontSize: 40,
                color: 'rgba(0, 0, 0, 0.45)',
                padding: 25
              }}
            />
          </Dropdown>
        </Tooltip>
      </div>

      <ExistingDatasetModal
        visible={existingObservationMatrixModalVisible}
        onClose={() => setExistingObservationMatrixModalVisible(false)}
        observationMatrix={undefined}
      />
      <DatasetGenerationModal
        visible={newObservationMatrixModalVisible}
        onClose={() => setNewObservationMatrixModalVisible(false)}
        observationMatrix={undefined}
      />
    </>
  );
};

export default ObservationMatrixPlaceholder;
