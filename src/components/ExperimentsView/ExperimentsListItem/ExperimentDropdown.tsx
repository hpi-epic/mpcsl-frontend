import { Button, Dropdown, Icon, Menu, Modal } from 'antd';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { deleteExperiment } from '../../../restAPI/apiRequests';
import { IExperiment } from '../../../types/types';
import styles from './ExperimentsListItem.module.scss';
const { confirm } = Modal;

export const ExperimentDropdown = (props: {
  experiment: IExperiment;
  onView: () => void;
  onDuplicate: () => void;
}) => {
  const history = useHistory();
  return (
    <Dropdown
      overlay={
        <Menu>
          <Menu.Item>
            <Button
              className={styles.DropdownButton}
              onClick={e => {
                e.stopPropagation();
                history.push(
                  `/${props.experiment.dataset_id}/experiments/${props.experiment.id}/jobs`
                );
              }}
              type="primary"
              ghost={true}
            >
              View Jobs
            </Button>
          </Menu.Item>
          <Menu.Item>
            <Button
              className={styles.DropdownButton}
              onClick={e => {
                e.stopPropagation();
                props.onView();
              }}
              key="1"
            >
              View Settings
            </Button>
          </Menu.Item>
          <Menu.Item>
            <Button
              className={styles.DropdownButton}
              onClick={e => {
                e.stopPropagation();
                props.onDuplicate();
              }}
              key="3"
            >
              Duplicate
            </Button>
          </Menu.Item>
          <Menu.Item>
            <Button
              className={styles.DropdownButton}
              onClick={e => {
                e.stopPropagation();
                confirm({
                  title: 'Do you want to delete the following Experiment?',
                  content: `${props.experiment.name} - ${props.experiment.description}`,
                  onOk() {
                    deleteExperiment(props.experiment).catch();
                  }
                });
              }}
              type="danger"
              ghost={true}
              key="4"
            >
              Delete
            </Button>
          </Menu.Item>
        </Menu>
      }
      placement="bottomLeft"
    >
      <Icon type="ellipsis" onClick={e => e.stopPropagation()} />
    </Dropdown>
  );
};
