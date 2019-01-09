import React from 'react';
import { Button, List, Badge } from 'antd';

import './style.css';

import { IExperiment, IJob } from '../../types';

import { getJobsForExperiment } from '../../actions/apiRequests';

import moment from 'moment';

import { RouteComponentProps } from 'react-router-dom';

interface IStateJobsManagement {
  jobList: IJob[];
}

class ExperimentDetails extends React.Component<
  RouteComponentProps,
  IStateJobsManagement
  > {
  public mounted = false;
  public exampleExperiment = {
    dataset: 2,
    dataset_id: 2,
    id: 1,
    last_job: {
      experiment: 1,
      experiment_id: 1,
      id: 2,
      pid: 272,
      start_time: '2019-01-08T09:57:07.134169+00:00',
      status: 'cancelled',
    },
    name: 'Theresa Zobel',
    parameters: {
      alpha: 1,
      cores: 1,
      independence_test: 'gaussCI',
    },
  }; // TODO: Get Experiment ID from URL

  private jobBadgeMap: any = {
    running: 'processing',
    done: 'success',
    error: 'error',
    cancelled: 'warning',
  };

  constructor(props: RouteComponentProps) {
    super(props);

    this.state = {
      jobList: [],
    };
  }

  public componentDidMount = () => {
    this.mounted = true;
    this.fetchJobs(this.exampleExperiment);
  }

  public componentWillUnmount = () => {
    this.mounted = false;
  }

  public render() {

    return (
    <div className='Content'>
      <h2>Experiment Details for Experiment: {this.exampleExperiment.name}</h2>
      <List
        itemLayout='horizontal'
        className='Job-List'
        dataSource={this.state.jobList}
        renderItem={(job: IJob) => (
          <List.Item
            actions={[
              <Button
                key={1}
                type='primary'
                ghost={true}
                onClick={() => this.onExploreExperiment(job.result!.id)}
              >
                explore
              </Button>,
            ]}
          >
            <List.Item.Meta
              title={
                <div>
                  {<h3> Job #{job.id}</h3>}
                  <Badge
                    className='Job-Badge'
                    status={this.jobBadgeMap[job.status]}
                    text={job.status}
                  />
                </div>
              }
              description={
                <div>
                  <i>
                    {' '}
                    Starting Time:{' '}
                    {moment(job.start_time).format(
                      'dddd, MMMM Do YYYY, h:mm:ss a',
                    )}
                  </i>
                </div>
              }
            />
          </List.Item>
        )}
      />

    </div>
    );
  }

  private async fetchJobs(experiment: IExperiment) {
    const jobList = await getJobsForExperiment(experiment);
    this.setState({ jobList });
  }

  private onExploreExperiment = (resultId: number) => {
    this.props.history.push(`/graph-explorer/selection/${resultId}`);
  }
}

export default ExperimentDetails;
