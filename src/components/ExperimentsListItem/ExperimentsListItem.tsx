import React, { useState, useEffect } from 'react';
import { Select, Modal, Dropdown, Menu, Button, Card, Badge } from 'antd';
import { IExperiment, BadgeStatus } from '../../types';
import { useHistory } from 'react-router-dom';
import {
  deleteExperiment,
  getK8SNodes,
  runExperiment
} from '../../actions/apiRequests';
import styles from './ExperimentsListItem.module.scss';
const { Option } = Select;
const { confirm } = Modal;

const ExperimentDropdown = (
  props: IExperiment & { onView: () => void; onDuplicate: () => void }
) => {
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
                  `/${props.dataset_id}/experiments/${props.id}/jobs`
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
                  content: `${props.name} - ${props.description}`,
                  onOk() {
                    deleteExperiment(props).catch();
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
      <Button
        className={styles.ListButton}
        icon="ellipsis"
        onClick={e => e.stopPropagation()}
      />
    </Dropdown>
  );
};

const ExperimentsListItem = (
  props: IExperiment & {
    onView: (experimentId: number) => void;
    onDuplicate: (experimentId: number) => void;
  }
) => {
  const [nodeSelectModal, setNodeSelectModal] = useState(false);
  const [k8sNodes, setK8sNodes] = useState<undefined | string[]>();
  const [selectedNode, setSelectedNode] = useState<undefined | string>();
  const history = useHistory();
  useEffect(() => {
    getK8SNodes()
      .then(setK8sNodes)
      .catch(() => setK8sNodes([]));
  }, []);
  const { name, description, last_job, execution_time_statistics } = props;
  const statusText = last_job ? last_job.status : 'not started';
  return (
    <>
      <Modal
        title="Select Machine to Start Job"
        visible={nodeSelectModal}
        onOk={() => {
          runExperiment(props, selectedNode);
          setNodeSelectModal(false);
        }}
        onCancel={() => setNodeSelectModal(false)}
        bodyStyle={{ display: 'flex' }}
      >
        <Select
          defaultValue="_none"
          onChange={(val: string) =>
            val !== '_none' ? setSelectedNode(val) : setSelectedNode(undefined)
          }
          style={{ flexGrow: 1 }}
        >
          <Option value="_none" style={{ fontStyle: 'italic' }}>
            Default
          </Option>
          {k8sNodes
            ? k8sNodes.map(node => (
                <Option key={node} value={node}>
                  {node}
                </Option>
              ))
            : null}
        </Select>
      </Modal>
      <Card
        title={
          <div style={{ display: 'flex', flexDirection: 'column', height: 50 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p>{name}</p>
              <Badge
                className="Card-Badge"
                text={statusText}
                status={
                  last_job?.status ? BadgeStatus[last_job.status] : 'default'
                }
              />
            </div>
            {execution_time_statistics ? (
              <i style={{ fontWeight: 'lighter', fontSize: '0.8rem' }}>
                Mean Execution Time: {execution_time_statistics.mean.toFixed(3)}
                s
              </i>
            ) : null}
          </div>
        }
        hoverable
        className={styles.ListItem}
        onClick={() => {
          if (props.last_job && props.last_job?.result) {
            history.push(
              `/${props.dataset_id}/experiments/${props.id}/jobs/${props.last_job?.result?.id}`
            );
          }
        }}
      >
        <div className={styles.ListItemContent}>
          <p>{description}</p>
          <div style={{ alignSelf: 'flex-end' }}>
            <Button
              className={styles.ListButton}
              onClick={e => {
                e.stopPropagation();
                setNodeSelectModal(true);
              }}
              type="primary"
              ghost={true}
            >
              Run
            </Button>
            <Button
              className={styles.ListButton}
              disabled={!props.last_job?.result}
              onClick={e => {
                e.stopPropagation();
                history.push(
                  `/${props.dataset_id}/experiments/${props.id}/compare`
                );
              }}
              type="primary"
              ghost={true}
            >
              Compare
            </Button>
            <ExperimentDropdown
              {...props}
              onView={() => props.onView(props.id)}
              onDuplicate={() => props.onDuplicate(props.id)}
            />
          </div>
        </div>
      </Card>
    </>
  );
};

export { ExperimentsListItem };
