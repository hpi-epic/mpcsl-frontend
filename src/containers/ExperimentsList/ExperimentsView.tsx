import React, { useEffect, useState } from 'react';
import { useHistory, RouteComponentProps } from 'react-router-dom';
import {
  getExperimentsForDataset,
  getK8SNodes,
  runExperiment,
  subscribeToJobStatusChanges
} from '../../actions/apiRequests';
import { IExperiment, BadgeStatus } from '../../types';
import {
  Card,
  Button,
  Badge,
  Select,
  Modal,
  Menu,
  Dropdown,
  Spin,
  Row,
  Form
} from 'antd';
import styles from './ExperimentsView.module.scss';
import { Subscription } from 'rxjs';
import NewExperimentModal, {
  IPropsNewExperimentModal
} from '../ExperimentsManager/NewExperimentModal';
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
              onClick={e => {
                e.stopPropagation();
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
            <ExperimentDropdown {...props} />
          </div>
        </div>
      </Card>
    </>
  );
};

const ExperimentsList = (props: { datasetId: number }) => {
  const [experiments, setExperiments] = useState<undefined | IExperiment[]>();
  useEffect(() => {
    let sub: Subscription | undefined;
    if (props.datasetId) {
      getExperimentsForDataset(props.datasetId)
        .then(setExperiments)
        .catch();
      const obs = subscribeToJobStatusChanges();
      sub = obs.subscribe(() => {
        getExperimentsForDataset(props.datasetId)
          .then(setExperiments)
          .catch();
      });
    }
    return () => sub?.unsubscribe();
  }, [props.datasetId]);
  if (!props.datasetId) {
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
  return (
    <div className={styles.List}>
      {experiments.map(experiment => (
        <ExperimentsListItem key={experiment.id} {...experiment} />
      ))}
    </div>
  );
};

const ExperimentsView = ({
  match
}: RouteComponentProps<{ datasetId: string }>) => {
  const [modalVisible, setModalVisible] = useState(false);
  const datasetId = parseInt(match.params.datasetId, 10);
  const ExperimentModal = Form.create<IPropsNewExperimentModal>()(
    NewExperimentModal
  );
  return (
    <div className="Content">
      <Row>
        <div className="Experiment-Controls">
          <Button type="primary" onClick={() => setModalVisible(true)}>
            + New Experiment
          </Button>
        </div>
      </Row>
      <Row>
        <ExperimentsList datasetId={datasetId} />
      </Row>
      <ExperimentModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        experiment={undefined}
        editDisabled={false}
      />
    </div>
  );
};

export { ExperimentsView };