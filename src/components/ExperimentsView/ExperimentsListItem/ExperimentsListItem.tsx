import { Badge, Card, Descriptions, Icon, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  getAlgorithm,
  getJobsForExperiment
} from '../../../restAPI/apiRequests';
import { BadgeStatus, IAlgorithm, IExperiment } from '../../../types/types';
import { ExperimentDropdown } from './ExperimentDropdown';
import styles from './ExperimentsListItem.module.scss';
import { RunExperimentModalForm } from './RunExperimentModal';

export const ExperimentsListItem = (props: {
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
          <Descriptions size="small" column={1}>
            <Descriptions.Item
              className={styles.Description}
              label="Description"
            >
              <p
                style={{
                  height: 58,
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
              <Descriptions.Item label="Last Job run">
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
