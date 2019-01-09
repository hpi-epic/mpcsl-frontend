import React from 'react';
import { Row, Button, Form, Modal, List, Badge } from 'antd';

import './style.css';

import { IExperiment, IJob } from '../../types';

import {
  getExperiments,
  deleteExperiment,
  getJobsForExperiment,
} from '../../actions/apiRequests';

import ListElementExperiment from '../../components/ListElementExperiment/ListElementExperiment';

import moment from 'moment';

import { RouteComponentProps } from 'react-router-dom';

interface IStateJobsManagement {
  jobList: IJob[];
}

class ExperimentManagement extends React.Component<
  RouteComponentProps,
  IStateJobsManagement
  > {
  public mounted = false;

  constructor(props: RouteComponentProps) {
    super(props);

    this.state = {
      jobList: [],
    };
  }

  public componentDidMount = () => {
    this.mounted = true;
    this.fetchJobs();
  }

  public componentWillUnmount = () => {
    this.mounted = false;
  }

  public render() {
    // const ExperimentList = this.state.experiments.map(
    //   (experiment: IExperiment) => (
    //     <ListElementExperiment
    //       key={experiment.id}
    //       title={experiment.name}
    //       status={
    //         experiment.last_job! === null
    //           ? 'default'
    //           : this.jobBadgeMap[experiment.last_job!.status]
    //       }
    //       statusText={
    //         experiment.last_job! === null
    //           ? 'Experiment was not started yet.'
    //           : experiment.last_job!.status
    //       }
    //       content={experiment.description || ''}
    //       onDelete={() => this.onDeleteExperiment(experiment)}
    //       onDuplicate={() => this.onDuplicateExperiment(experiment)}
    //       onExplore={() => this.onExploreExperiment(experiment.last_job!.result!.id)}
    //       onRunStart={() => this.onRunExperiment(experiment)}
    //       onView={() => this.onExperimentClick(experiment)}
    //       showAllJobs={() => { this.setState({ jobListVisible: true }, () => this.onJobListView(experiment)); }}
    //     />
    //   ),
    // );

    return (
      <div className='Content'>

        {/* <Row>{ExperimentList}</Row> */}
      </div>
    );
  }

  private async fetchJobs() {
    const experiments = await getExperiments();
    if (this.mounted) {
      // this.setState({ experiments });
    }
  }

}

export default ExperimentManagement;
