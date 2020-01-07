import React, { useEffect, useState } from 'react';
import { useHistory, RouteComponentProps } from 'react-router-dom';
import {
  getExperimentsForDataset,
  getK8SNodes,
  runExperiment,
  subscribeToJobStatusChanges
} from '../../actions/apiRequests';
import { IExperiment, BadgeStatus } from '../../types';
import { Card, Button, Badge, Select, Modal, Menu, Dropdown, Spin } from 'antd';
import styles from './ExperimentsList.module.scss';
import { Subscription } from 'rxjs';
const { Option } = Select;

const ExperimentDropdown = (props: IExperiment) => {
  console.log(props.id);
  return (
    <Dropdown
      overlay={
        <Menu>
          <Menu.Item>
            <Button
              className={styles.DropdownButton}
              onClick={() => undefined}
              key="1"
            >
              View Settings
            </Button>
          </Menu.Item>
          <Menu.Item>
            <Button
              className={styles.DropdownButton}
              onClick={() => undefined}
              key="3"
            >
              Duplicate
            </Button>
          </Menu.Item>
          <Menu.Item>
            <Button
              className={styles.DropdownButton}
              onClick={() => undefined}
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
      <Button className={styles.ListButton} icon="ellipsis" />
    </Dropdown>
  );
};

const ExperimentsListItem = (props: IExperiment) => {
  const [nodeSelectModal, setNodeSelectModal] = useState(false);
  const [k8sNodes, setK8sNodes] = useState<undefined | string[]>();
  const [selectedNode, setSelectedNode] = useState<undefined | string>();
  const history = useHistory();
  useEffect(() => {
    getK8SNodes()
      .then(resp => setK8sNodes(resp.data))
      .catch(() => setK8sNodes([]));
  }, []);
  const { name, description, last_job, execution_time_statistics } = props;
  const statusText = last_job
    ? last_job.status
    : 'Experiment was not started yet.';
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
          <div style={{ display: 'flex', flexDirection: 'column' }}>
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
        // onClick={() => history.push(`/${props.id}/experiments`)}
      >
        <div className={styles.ListItemContent}>
          <p>{description}</p>
          <div style={{ alignSelf: 'flex-end' }}>
            <Button
              className={styles.ListButton}
              onClick={() => setNodeSelectModal(true)}
              type="primary"
              ghost={true}
            >
              Run
            </Button>
            <Button
              className={styles.ListButton}
              onClick={() =>
                history.push(`${history.location.pathname}/${props.id}/jobs`)
              }
              type="primary"
              ghost={true}
            >
              View Jobs
            </Button>
            <ExperimentDropdown {...props} />
          </div>
        </div>
      </Card>
    </>
  );
};

const ExperimentsList = ({
  match
}: RouteComponentProps<{ datasetId: string }>) => {
  const { datasetId } = match.params;
  const [experiments, setExperiments] = useState<undefined | IExperiment[]>();
  useEffect(() => {
    let sub: Subscription | undefined;
    if (datasetId) {
      getExperimentsForDataset(parseInt(datasetId, 10))
        .then(setExperiments)
        .catch();
      const obs = subscribeToJobStatusChanges();
      sub = obs.subscribe(() => {
        getExperimentsForDataset(parseInt(datasetId, 10))
          .then(setExperiments)
          .catch();
      });
    }
    return () => sub?.unsubscribe();
  }, [datasetId]);
  if (!datasetId) {
    return <h1>404</h1>;
  }
  if (!experiments) {
    return (
      <Spin
        style={{ position: 'absolute', top: '50%', left: '50%' }}
        size="large"
      />
    );
  }
  console.log(`${match?.path}/:experimentId/jobs`);
  return (
    <div className={styles.List}>
      {experiments.map(experiment => (
        <ExperimentsListItem key={experiment.id} {...experiment} />
      ))}
    </div>
  );
};

export { ExperimentsList };
