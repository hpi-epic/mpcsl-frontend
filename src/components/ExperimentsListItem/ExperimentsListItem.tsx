import React, { useState, useEffect } from 'react';
import {
  Select,
  Modal,
  Dropdown,
  Menu,
  Button,
  Card,
  Badge,
  Icon,
  Tooltip,
  InputNumber,
  Form,
  Descriptions
} from 'antd';
import { IExperiment, BadgeStatus, IAlgorithm } from '../../types';
import { useHistory } from 'react-router-dom';
import {
  deleteExperiment,
  getK8SNodes,
  runExperiment,
  getAlgorithm,
  getJobsForExperiment
} from '../../actions/apiRequests';
import styles from './ExperimentsListItem.module.scss';
import { FormComponentProps } from 'antd/lib/form';
const { Option } = Select;
const { confirm } = Modal;

const ExperimentDropdown = (props: {
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

type RunExperimentModalProps = FormComponentProps & {
  experiment: IExperiment;
  visible: boolean;
  onClose: () => void;
};

const RunExperimentModal: React.FunctionComponent<RunExperimentModalProps> = props => {
  const { getFieldDecorator } = props.form;
  const [k8sNodes, setK8sNodes] = useState<undefined | string[]>();
  const [needsGPU, setNeedsGPU] = useState<undefined | boolean>();
  useEffect(() => {
    getK8SNodes()
      .then(setK8sNodes)
      .catch(() => setK8sNodes([]));
  }, []);
  useEffect(() => {
    getAlgorithm(props.experiment.algorithm_id).then(alg =>
      setNeedsGPU(!!alg.needs_gpu)
    );
  }, [props.experiment]);
  return (
    <Modal
      title="Set Execution Parameters"
      visible={props.visible}
      confirmLoading={needsGPU === undefined}
      onOk={() => {
        props.form.validateFields(
          (
            err: Error,
            values: {
              node: string;
              runs: number;
              parallelismMode: 'parallel' | 'sequential';
              enforceCpus: boolean;
              gpus?: number;
            }
          ) => {
            if (!err) {
              runExperiment(
                props.experiment,
                values.node === '_none' ? undefined : values.node,
                values.runs,
                values.parallelismMode === 'parallel',
                needsGPU ? values.gpus : undefined,
                values.enforceCpus
              );
              props.onClose();
            }
          }
        );
      }}
      onCancel={() => props.onClose()}
    >
      <Form layout="vertical">
        <Form.Item label="Select Machine to Start Job">
          {getFieldDecorator('node', { initialValue: '_none' })(
            <Select>
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
          )}
        </Form.Item>
        <Form.Item label="Number of Jobs">
          {getFieldDecorator('runs', { initialValue: 1 })(
            <InputNumber min={1} style={{ width: '100%' }} />
          )}
        </Form.Item>
        <Form.Item label="Run Mode">
          {getFieldDecorator('parallelismMode', { initialValue: 'parallel' })(
            <Select>
              <Option value="parallel">Parallel</Option>
              <Option value="sequential">Sequential</Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item label="Enforce CPU Requests">
          {getFieldDecorator('enforceCpus', { initialValue: 1 })(
            <Select>
              <Option value={1}>Yes</Option>
              <Option value={0}>No</Option>
            </Select>
          )}
        </Form.Item>
        {needsGPU ? (
          <Form.Item label="GPU Count">
            {getFieldDecorator('gpus', { initialValue: 1 })(
              <InputNumber min={1} style={{ width: '100%' }} />
            )}
          </Form.Item>
        ) : null}
      </Form>
    </Modal>
  );
};

const RunExperimentModalForm = Form.create<RunExperimentModalProps>()(
  RunExperimentModal
);

const ExperimentsListItem = (props: {
  experiment: IExperiment;
  onView: (experimentId: number) => void;
  onDuplicate: (experimentId: number) => void;
}) => {
  const {
    id,
    algorithm_id,
    name,
    description,
    last_job,
    execution_time_statistics
  } = props.experiment;
  const [nodeSelectModal, setNodeSelectModal] = useState(false);
  const [algorithm, setAlgorithm] = useState<undefined | IAlgorithm>();
  const [jobCount, setJobCount] = useState<undefined | number>();
  const history = useHistory();
  useEffect(() => {
    getAlgorithm(algorithm_id).then(setAlgorithm);
  }, [algorithm_id]);
  useEffect(() => {
    getJobsForExperiment(id).then(jobs => setJobCount(jobs.length));
  }, [id, last_job]);
  const statusText = last_job ? last_job.status : 'not started';
  return (
    <>
      <RunExperimentModalForm
        onClose={() => setNodeSelectModal(false)}
        visible={nodeSelectModal}
        experiment={props.experiment}
      />
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
        actions={[
          <Tooltip key="run" title="Run Experiment">
            <Icon
              style={{ fontSize: 20 }}
              type="play-circle"
              onClick={e => {
                e.stopPropagation();
                setNodeSelectModal(true);
              }}
            />
          </Tooltip>,
          <Tooltip key="compare" title="Compare Experiment">
            <Icon
              style={{ fontSize: 20 }}
              type="interaction"
              onClick={e => {
                e.stopPropagation();
                if (last_job) {
                  history.push(
                    `/${props.experiment.dataset_id}/experiments/${props.experiment.id}/compare`
                  );
                }
              }}
            />
          </Tooltip>,
          <ExperimentDropdown
            key="dropdown"
            experiment={props.experiment}
            onView={() => props.onView(props.experiment.id)}
            onDuplicate={() => props.onDuplicate(props.experiment.id)}
          />
        ]}
        hoverable
        className={styles.ListItem}
        onClick={() => {
          if (last_job && last_job?.result) {
            history.push(
              `/${props.experiment.dataset_id}/experiments/${props.experiment.id}/jobs/${last_job?.result?.id}`
            );
          }
        }}
      >
        <div className={styles.ListItemContent}>
          <Descriptions size="small" column={2}>
            <Descriptions.Item
              className={styles.Description}
              span={2}
              label="Description"
            >
              <p
                style={{
                  height: 84,
                  overflow: 'hidden',
                  width: 250,
                  overflowWrap: 'break-word'
                }}
              >
                {description}
              </p>
            </Descriptions.Item>
            {algorithm ? (
              <>
                <Descriptions.Item label="Package">
                  {algorithm.package}
                </Descriptions.Item>
                <Descriptions.Item label="Function">
                  {algorithm.function}
                </Descriptions.Item>
              </>
            ) : null}
            {last_job ? (
              <Descriptions.Item span={2} label="Last Job run">
                {new Date(last_job.start_time).toLocaleString('de-DE')}
              </Descriptions.Item>
            ) : null}
            {last_job ? (
              <Descriptions.Item label="Job Count">
                {jobCount ? jobCount : 'Loading...'}
              </Descriptions.Item>
            ) : null}
          </Descriptions>
        </div>
      </Card>
    </>
  );
};

export { ExperimentsListItem };
