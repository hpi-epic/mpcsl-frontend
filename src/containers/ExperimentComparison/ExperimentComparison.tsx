import React, { useState, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { IExperiment, IJob, IComparisonStatistics } from '../../types';
import {
  getExperimentsForDataset,
  getJobsForExperiment,
  getExperiment,
  getResultNodes,
  getComparisonStatistics,
  getGTComparisonStatistics
} from '../../actions/apiRequests';
import {
  Menu,
  Spin,
  Row,
  Col,
  Empty,
  Statistic,
  Card,
  Collapse,
  Icon,
  Tooltip
} from 'antd';
import { IAPIGraphNode } from '../../types/graphTypes';
import SubMenu from 'antd/lib/menu/SubMenu';
import { NewExperimentModalForm } from '../ExperimentsView/NewExperimentModal';

type IExperimentJobs = {
  jobs: IJob[];
} & IExperiment;

const ExperimentComparisonEach = (props: {
  jobOne: IJob | undefined;
  jobTwo: IJob | undefined;
  nodes: IAPIGraphNode[] | undefined;
}) => {
  const { jobOne, jobTwo, nodes } = props;
  const [comparison, setComparison] = useState<
    undefined | IComparisonStatistics
  >();
  const nodeDict: { [key: number]: string } = {};
  if (nodes) {
    nodes.forEach(node => {
      nodeDict[node.id] = node.name;
    });
  }
  useEffect(() => {
    if (jobOne && jobOne.result && jobTwo && jobTwo.result) {
      getComparisonStatistics(jobOne.result.id, jobTwo.result.id).then(
        setComparison
      );
    }
  }, [jobOne, jobTwo]);
  if (!comparison) {
    return <Empty description="Select a Second Job"></Empty>;
  }
  if (!jobOne?.result || !jobTwo?.result) {
    return <Empty description="No results "></Empty>;
  }
  return (
    <Card
      title={`Job ${jobOne.id} as Ground Truth compared to Job ${jobTwo.id}`}
      extra="Comparison"
    >
      <Statistic
        title={'Graph Edit Distance'}
        value={comparison.graph_edit_distance}
      />
      <Statistic
        title={'Mean Jaccard Coefficient'}
        value={comparison.mean_jaccard_coefficient}
        precision={3}
      />
      <Collapse>
        <Collapse.Panel
          header={
            <Statistic
              title={`Edges in Job ${jobTwo.id} that also exist in Job ${jobOne.id}`}
              prefix="Rate: "
              value={comparison.error_types.true_positives.rate}
              precision={3}
            />
          }
          key="1"
        >
          {comparison.error_types.true_positives.edges.map(edge => (
            <span key={Math.random()}>
              {nodeDict[edge[0]]} --&gt; {nodeDict[edge[1]]}
              <br />
            </span>
          ))}
        </Collapse.Panel>
        <Collapse.Panel
          header={
            <Statistic
              title={`Edges in Job ${jobTwo.id} that do not exist in Job ${jobOne.id}`}
              prefix="Rate: "
              value={comparison.error_types.false_positives.rate}
              precision={3}
            />
          }
          key="2"
        >
          {comparison.error_types.false_positives.edges.map(edge => (
            <span key={Math.random()}>
              {nodeDict[edge[0]]} --&gt; {nodeDict[edge[1]]}
              <br />
            </span>
          ))}
        </Collapse.Panel>
        <Collapse.Panel
          header={
            <Statistic
              title={`Edges not existing in Job ${jobTwo.id} that do not exist in Job ${jobOne.id}`}
              prefix="Rate: "
              value={comparison.error_types.true_negatives.rate}
              precision={3}
            />
          }
          key="3"
        >
          {comparison.error_types.true_negatives.edges.map(edge => (
            <span key={Math.random()}>
              {nodeDict[edge[0]]} --&gt; {nodeDict[edge[1]]}
              <br />
            </span>
          ))}
        </Collapse.Panel>
        <Collapse.Panel
          header={
            <Statistic
              title={`Edges not existing in Job ${jobTwo.id} that do exist in Job ${jobOne.id}`}
              prefix="Rate: "
              value={comparison.error_types.false_negatives.rate}
              precision={3}
            />
          }
          key="4"
        >
          {comparison.error_types.false_negatives.edges.map(edge => (
            <span key={Math.random()}>
              {nodeDict[edge[0]]} --&gt; {nodeDict[edge[1]]}
              <br />
            </span>
          ))}
        </Collapse.Panel>
      </Collapse>
    </Card>
  );
};

const ExperimentComparisonGT = (props: {
  job?: IJob;
  nodes?: IAPIGraphNode[];
  experiment?: IExperiment;
}) => {
  const { job, nodes, experiment } = props;
  const [groundTruthStatistics, setGroundTruthStatistics] = useState<
    IComparisonStatistics | undefined
  >();
  const [modalVisible, setModalVisible] = useState(false);
  useEffect(() => {
    if (job?.result) {
      getGTComparisonStatistics(job.result.id).then(result =>
        setGroundTruthStatistics(result ?? undefined)
      );
    }
  }, [job]);
  if (job && groundTruthStatistics) {
    const nodeDict: { [key: number]: string } = {};
    if (nodes) {
      nodes.forEach(node => {
        nodeDict[node.id] = node.name;
      });
    }
    return (
      <>
        <Card
          title={
            <div>
              {`${experiment?.name} compared to Ground Truth `}
              <Tooltip title="Show Experiment Details">
                <Icon
                  onClick={e => {
                    e.stopPropagation();
                    setModalVisible(true);
                  }}
                  type="info-circle"
                />
              </Tooltip>
            </div>
          }
          extra={`Job ${job.id}`}
        >
          <Statistic
            title={'Graph Edit Distance'}
            value={groundTruthStatistics.graph_edit_distance}
          />
          <Statistic
            title={'Mean Jaccard Coefficient'}
            value={groundTruthStatistics.mean_jaccard_coefficient}
            precision={3}
          />
          <Collapse>
            <Collapse.Panel
              header={
                <Statistic
                  title={'True Positive Rate'}
                  value={groundTruthStatistics.error_types.true_positives.rate}
                  precision={3}
                />
              }
              key="1"
            >
              {groundTruthStatistics.error_types.true_positives.edges.map(
                edge => (
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
                  value={groundTruthStatistics.error_types.false_positives.rate}
                  precision={3}
                />
              }
              key="2"
            >
              {groundTruthStatistics.error_types.false_positives.edges.map(
                edge => (
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
                  value={groundTruthStatistics.error_types.true_negatives.rate}
                  precision={3}
                />
              }
              key="3"
            >
              {groundTruthStatistics.error_types.true_negatives.edges.map(
                edge => (
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
                  value={groundTruthStatistics.error_types.false_negatives.rate}
                  precision={3}
                />
              }
              key="4"
            >
              {groundTruthStatistics.error_types.false_negatives.edges.map(
                edge => (
                  <span key={Math.random()}>
                    {nodeDict[edge[0]]} --&gt; {nodeDict[edge[1]]}
                    <br />
                  </span>
                )
              )}
            </Collapse.Panel>
          </Collapse>
        </Card>
        <NewExperimentModalForm
          visible={modalVisible}
          datasetId={experiment?.dataset_id || 0}
          onClose={() => {
            setModalVisible(false);
          }}
          experiment={experiment}
          editDisabled={true}
        />
      </>
    );
  } else {
    return null;
  }
};

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

const ExperimentComparisonMenu = (props: {
  experiments: IExperimentJobs[];
  baseJob: IJob | undefined;
  selectItem: (id: string) => void;
}) => {
  return (
    <Menu
      onSelect={event => props.selectItem(event.key)}
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
          onTitleClick={() => console.log('click')}
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
        for (const experiment of experiments) {
          const jobs = await getJobsForExperiment(experiment);
          const experimentJob: IExperimentJobs = {
            ...experiment,
            jobs: jobs
          };
          experimentsJobs.push(experimentJob);
        }
        return experimentsJobs;
      };
      fetchExperiments().then(setExperiments);
    }
  }, [match.params.datasetId]);
  const setCompareJobId = (id: string) => {
    if (!experiments) {
      return;
    }
    const intId = parseInt(id, 10);
    for (const experiment of experiments) {
      const job = experiment.jobs.find(job => job.id === intId);
      if (job) {
        setCompareJob(job);
        setCompareExperiment(experiment);
        return;
      }
    }
  };
  if (!experiments || !experiment) {
    return (
      <Spin
        style={{ position: 'absolute', top: '50%', left: '50%' }}
        size="large"
      />
    );
  }
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
        <Row>
          <ExperimentComparisonEach
            jobOne={experiment.last_job}
            jobTwo={compareJob}
            nodes={nodes}
          />
        </Row>
      </Col>
    </Row>
  );
};

export { ExperimentComparison };
