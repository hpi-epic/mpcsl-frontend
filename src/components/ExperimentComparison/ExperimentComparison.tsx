import { Col, Row, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import {
  getExperiment,
  getExperimentsForDataset,
  getJobsForExperiment,
  getResultNodes
} from '../../restAPI/apiRequests';
import { IAPIGraphNode } from '../../types/graphTypes';
import { IExperiment, IJob, IExperimentJobs } from '../../types/types';
import { ExperimentComparisonEach } from './ExperimentComparisonEach';
import { ExperimentComparisonGT } from './ExperimentComparisonGT';
import { ExperimentComparisonMenu } from './ExperimentComparisonMenu';

export const ExperimentComparison = ({
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
          const jobs = await getJobsForExperiment(experiment.id);
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
        style={{
          display: 'block',
          marginLeft: 'auto',
          marginRight: 'auto',
          width: '50%',
          marginTop: '10%'
        }}
        size="large"
      />
    );
  }
  return (
    <Row justify="start" style={{ height: '100%' }}>
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
