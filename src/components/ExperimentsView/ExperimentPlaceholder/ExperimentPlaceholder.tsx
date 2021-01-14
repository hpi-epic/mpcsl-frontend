import { AppstoreAddOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import React from 'react';
import style from './ExperimentPlaceholder.module.scss';

export interface ExperimentPlaceholderProps {
  onClick: () => void;
}

const ExperimentPlaceholder: React.FC<ExperimentPlaceholderProps> = props => {
  return (
    <>
      <div
        className={style.CreateExperimentPlaceholder}
        onClick={() => props.onClick()}
      >
        <Tooltip title="Create new Experiment" />
        <AppstoreAddOutlined
          style={{
            fontSize: 40,
            color: 'rgba(0, 0, 0, 0.45)',
            padding: 25
          }}
        />
      </div>
    </>
  );
};

export default ExperimentPlaceholder;
