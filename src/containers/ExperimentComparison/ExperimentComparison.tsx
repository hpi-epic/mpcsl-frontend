import React, { useState, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { IExperiment, IJob } from '../../types';
import {
  getExperimentsForDataset,
  getJobsForExperiment,
  getExperiment,
  getResultNodes
} from '../../actions/apiRequests';
import {
  Menu,
  Spin,
  Row,
  Col,
  Descriptions,
  Empty,
  Statistic,
  Card,
  Collapse
} from 'antd';
import { IAPIGraphNode } from '../../types/graphTypes';

interface IExperimentJobs {
  jobs: IJob[];
  experiment: IExperiment;
}

const ExperimentComparisonEach = (props: {
  jobOne: IJob | undefined;
  jobTwo: IJob | undefined;
}) => {
  return <Empty />;
};

const ExperimentComparisonGT = (props: {
  job: IJob | undefined;
  nodes: IAPIGraphNode[] | undefined;
  experiment: IExperiment | undefined;
}) => {
  const { job, nodes, experiment } = props;
  if (job?.result?.ground_truth_statistics) {
    const nodeDict: { [key: number]: string } = {};
    if (nodes) {
      nodes.forEach(node => {
        nodeDict[node.id] = node.name;
      });
    }
    return (
      <Card title={experiment?.name} extra={`Job ${job.id}`}>
        <Statistic
          title={'Graph Edit Distance'}
          value={job.result.ground_truth_statistics.graph_edit_distance}
        />
        <Statistic
          title={'Mean Jaccard Coefficient'}
          value={job.result.ground_truth_statistics.mean_jaccard_coefficient}
          precision={3}
        />
        <Collapse>
          <Collapse.Panel
            header={
              <Statistic
                title={'True Positive Rate'}
                value={
                  job.result.ground_truth_statistics.error_types.true_positives
                    .rate
                }
                precision={3}
              />
            }
            key="1"
          >
            {job.result.ground_truth_statistics.error_types.true_positives.edges.map(
              (edge: number[]) => (
                <span key={Math.random()}>
                  {nodeDict[edge[0]]} --&gt; {nodeDict[edge[1]]}
                  <br />
                </span>
              )
            )}
          </Collapse.Panel>
          <Collapse.Panel
            header={
              <Statistic
                title={'False Positive Rate'}
                value={
                  job.result.ground_truth_statistics.error_types.false_positives
                    .rate
                }
                precision={3}
              />
            }
            key="2"
          >
            {job.result.ground_truth_statistics.error_types.false_positives.edges.map(
              (edge: number[]) => (
                <span key={Math.random()}>
                  {nodeDict[edge[0]]} --&gt; {nodeDict[edge[1]]}
                  <br />
                </span>
              )
            )}
          </Collapse.Panel>
          <Collapse.Panel
            header={
              <Statistic
                title={'True Negative Rate'}
                value={
                  job.result.ground_truth_statistics.error_types.true_negatives
                    .rate
                }
                precision={3}
              />
            }
            key="3"
          >
            {job.result.ground_truth_statistics.error_types.true_negatives.edges.map(
              (edge: number[]) => (
                <span key={Math.random()}>
                  {nodeDict[edge[0]]} --&gt; {nodeDict[edge[1]]}
                  <br />
                </span>
              )
            )}
          </Collapse.Panel>
          <Collapse.Panel
            header={
              <Statistic
                title={'False Negative Rate'}
                value={
                  job.result.ground_truth_statistics.error_types.false_negatives
                    .rate
                }
                precision={3}
              />
            }
            key="4"
          >
            {job.result.ground_truth_statistics.error_types.false_negatives.edges.map(
              (edge: number[]) => (
                <span key={Math.random()}>
                  {nodeDict[edge[0]]} --&gt; {nodeDict[edge[1]]}
                  <br />
                </span>
              )
            )}
          </Collapse.Panel>
        </Collapse>
      </Card>
    );
  } else {
    return <div>Nothing to show</div>;
  }
};

const ExperimentComparisonMenu = (props: {
  experiments: IExperimentJobs[];
  baseJob: IJob | undefined;
  selectItem: (id: number) => void;
}) => {
  return (
    <Menu
      onSelect={(event: any) => props.selectItem(event.key)}
      style={{ height: '100%' }}
    >
      {props.experiments.map(experiment => (
        <Menu.ItemGroup
          key={experiment.experiment.id}
          title={experiment.experiment.name}
        >
          {experiment.jobs.map(job => (
            <Menu.Item
              key={job.result?.id}
              disabled={
                !(job.status === 'done') || job.id === props.baseJob?.id
              }
            >
              {job.result?.id}
            </Menu.Item>
          ))}
        </Menu.ItemGroup>
      ))}
    </Menu>
  );
};

const ExperimentComparison = ({
  match
}: RouteComponentProps<{ datasetId: string; experimentId: string }>) => {
  const [experiments, setExperiments] = useState<
    undefined | IExperimentJobs[]
  >();
  const [experiment, setExperiment] = useState<undefined | IExperiment>();
  const [compareJob, setCompareJob] = useState<undefined | IJob>();
  const [compareExperiment, setCompareExperiment] = useState<
    undefined | IExperiment
  >();
  const [nodes, setNodes] = useState<undefined | IAPIGraphNode[]>();
  useEffect(() => {
    if (match.params.experimentId) {
      getExperiment(parseInt(match.params.experimentId)).then(setExperiment);
    }
  }, [match.params.experimentId]);
  useEffect(() => {
    if (experiment?.last_job?.result?.id) {
      getResultNodes(experiment.last_job.result.id).then(setNodes);
    }
  }, [experiment]);
  useEffect(() => {
    if (match.params.datasetId) {
      const fetchExperiments = async () => {
        const experiments: IExperiment[] = await getExperimentsForDataset(
          parseInt(match.params.datasetId)
        );
        const experimentsJobs: IExperimentJobs[] = [];
        for (const i in experiments) {
          const jobs: IJob[] = await getJobsForExperiment(experiments[i]);
          const experimentJob: IExperimentJobs = {
            experiment: experiments[i],
            jobs: jobs
          };
          experimentsJobs.push(experimentJob);
        }
        return experimentsJobs;
      };
      fetchExperiments().then(setExperiments);
    }
  }, [match.params.datasetId]);
  const setCompareJobId = (id: number) => {
    experiments?.forEach(experiment =>
      experiment.jobs.forEach(job => {
        if (job.id == id) {
          setCompareJob(job);
          setCompareExperiment(experiment.experiment);
        }
      })
    );
  };
  if (experiments && experiment) {
    return (
      <Row type="flex" justify="start">
        <Col span={4}>
          <ExperimentComparisonMenu
            experiments={experiments}
            selectItem={setCompareJobId}
            baseJob={experiment.last_job}
          />
        </Col>
        <Col span={20}>
          <Row>
            <Col span={compareJob ? 12 : 24}>
              <ExperimentComparisonGT
                job={experiment.last_job}
                experiment={experiment}
                nodes={nodes}
              />
            </Col>
            {compareJob ? (
              <Col span={12}>
                <ExperimentComparisonGT
                  job={compareJob}
                  experiment={compareExperiment}
                  nodes={nodes}
                />
              </Col>
            ) : null}
          </Row>
          {compareJob ? (
            <Row>
              <ExperimentComparisonEach
                jobOne={experiment.last_job}
                jobTwo={compareJob}
              />
            </Row>
          ) : null}
        </Col>
      </Row>
    );
  } else {
    return (
      <Spin
        style={{ position: 'absolute', top: '50%', left: '50%' }}
        size="large"
      />
    );
  }
};

export { ExperimentComparison };
