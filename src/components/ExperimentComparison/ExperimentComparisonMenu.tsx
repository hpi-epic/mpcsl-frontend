import { Menu, Tooltip } from 'antd';
import SubMenu from 'antd/lib/menu/SubMenu';
import React, { useEffect, useState } from 'react';
import { getComparisonStatistics } from '../../restAPI/apiRequests';
import {
  IComparisonStatistics,
  IExperiment,
  IExperimentJobs,
  IJob
} from '../../types/types';

const ExperimentComparisonSubMenuTitle = (props: {
  experiment: IExperiment;
  baseJob: IJob | undefined;
}) => {
  const { experiment, baseJob } = props;
  const [comparison, setComparison] = useState<
    IComparisonStatistics | undefined
  >();
  useEffect(() => {
    if (
      experiment.last_job &&
      experiment.last_job.result &&
      baseJob &&
      baseJob.result
    ) {
      getComparisonStatistics(
        experiment.last_job.result.id,
        baseJob.result.id
      ).then(setComparison);
    }
  }, [experiment, baseJob]);
  if (comparison) {
    return (
      <Tooltip
        title={`${experiment.name} (Graph Edit Distance: ${comparison.graph_edit_distance})`}
      >{`${experiment.name} (GED: ${comparison.graph_edit_distance})`}</Tooltip>
    );
  }
  return <Tooltip title={experiment.name}>{experiment.name}</Tooltip>;
};

export const ExperimentComparisonMenu = (props: {
  experiments: IExperimentJobs[];
  baseJob: IJob | undefined;
  selectItem: (id: string) => void;
}) => {
  return (
    <Menu
      onSelect={event => props.selectItem(event.key.toString())}
      style={{ height: '100%' }}
      mode="inline"
      theme="dark"
    >
      {props.experiments.map(experiment => (
        <SubMenu
          key={experiment.id}
          title={
            <ExperimentComparisonSubMenuTitle
              experiment={experiment}
              baseJob={props.baseJob}
            />
          }
          disabled={experiment.jobs.length === 0}
        >
          {experiment.jobs.map(job => {
            if (job.status !== 'done') {
              return null;
            }
            return (
              <Menu.Item key={job.id} disabled={job.id === props.baseJob?.id}>
                Job {job.id}
              </Menu.Item>
            );
          })}
        </SubMenu>
      ))}
    </Menu>
  );
};
