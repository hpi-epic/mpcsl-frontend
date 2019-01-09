import React from 'react';
import { Row, Button, Form, Modal, List, Badge } from 'antd';

import './style.css';
import NewExperimentModal, {
  IPropsNewExperimentModal,
  IFormExperiment,
} from './NewExperimentModal';
import { IExperiment, IJob } from '../../types';

import {
  getExperiments,
  deleteExperiment,
  getJobsForExperiment,
  runExperiment,
  getObservationMatrices,
} from '../../actions/apiRequests';

import ListElementExperiment from '../../components/ListElementExperiment/ListElementExperiment';

import moment from 'moment';

interface IStateExperimentManagement {
  newExperimentModalVisible: boolean;
  experiments: IExperiment[];
  clickedExperiment: IFormExperiment | undefined;
  editExperiment: boolean;
  jobListVisible: boolean;
  noObservationMatricePresent: boolean;
  jobList: IJob[];
}

class ExperimentManagement extends React.Component<
  {},
  IStateExperimentManagement
> {
  public mounted = false;

  private jobBadgeMap: any = {
    running: 'processing',
    done: 'success',
    error: 'error',
    cancelled: 'warning',
  };

  constructor(props: {}) {
    super(props);

    this.state = {
      editExperiment: true,
      newExperimentModalVisible: false,
      experiments: [],
      clickedExperiment: undefined,
      jobListVisible: false,
      noObservationMatricePresent: true,
      jobList: [],
    };
  }

  public componentDidMount = () => {
    this.mounted = true;
    this.fetchExperiments();
    this.fetchObservationMatrices();
  }

  public componentWillUnmount = () => {
    this.mounted = false;
  }

  public render() {
    const ExperimentModal = Form.create<IPropsNewExperimentModal>()(
      NewExperimentModal,
    );
    const ExperimentList = this.state.experiments.map(
      (experiment: IExperiment) => (
        <ListElementExperiment
          key={experiment.id}
          title={experiment.name}
          status={
            experiment.last_job! === null
              ? 'default'
              : this.jobBadgeMap[experiment.last_job!.status]
          }
          statusText={
            experiment.last_job! === null
              ? 'Experiment was not started yet.'
              : experiment.last_job!.status
          }
          content={experiment.description || ''}
          onDelete={() => this.onDeleteExperiment(experiment)}
          onDuplicate={() => this.onDuplicateExperiment(experiment)}
          onExplore={() => this.onExploreExperiment(experiment)}
          onRunStart={() => this.onRunExperiment(experiment)}
          onView={() => this.onExperimentClick(experiment)}
          showAllJobs={() => this.onJobListView(experiment)}
        />
      ),
    );

    return (
      <div className='Content'>
        <Row>
          <div className='Experiment-Controls'>
            <Button
              type='primary'
              onClick={this.onNewExperiment}
              disabled={this.state.noObservationMatricePresent}
            >
              + New Experiment
            </Button>
          </div>
        </Row>
        <Row>{ExperimentList}</Row>
        <ExperimentModal
          visible={this.state.newExperimentModalVisible}
          onClose={this.onClose}
          experiment={this.state.clickedExperiment}
          editDisabled={!this.state.editExperiment}
        />
      </div>
    );
  }

  private async fetchExperiments() {
    const experiments = await getExperiments();
    if (this.mounted) {
      this.setState({ experiments });
    }
  }

  private async fetchObservationMatrices() {
    const observationMatrices = await getObservationMatrices();
    if (observationMatrices.length > 0) {
      this.setState({
        noObservationMatricePresent: false,
      });
    }
  }

  private onNewExperiment = () => {
    this.setState({
      newExperimentModalVisible: true,
      editExperiment: true,
    });
  }

  private onClose = () => {
    this.setState({
      newExperimentModalVisible: false,
      clickedExperiment: undefined,
      editExperiment: true,
      jobListVisible: false,
    });
    this.fetchExperiments();
  }

  private onDeleteExperiment = (experiment: IExperiment) => {
    deleteExperiment(experiment).then(() => {
      this.fetchExperiments();
    });
  }

  private onExperimentClick = (experiment: IExperiment) => {
    this.setState({
      newExperimentModalVisible: true,
      editExperiment: false,
      clickedExperiment: {
        name: experiment.name,
        description: experiment.description || '',
        alpha: experiment.parameters.alpha,
        independence_test: experiment.parameters.independence_test,
        cores: experiment.parameters.cores,
        observationMatrix_id: experiment.dataset_id,
      },
    });
  }

  private async onJobListView(experiment: IExperiment) {
    const jobs = await getJobsForExperiment(experiment);
    Modal.info({
      title: `Job List for Experiment: ${experiment.name}`,
      content: (
        <List
          itemLayout='horizontal'
          className='Job-List'
          dataSource={jobs}
          renderItem={(job: IJob) => (
            <List.Item
              actions={[
                <Button
                  key={1}
                  type='primary'
                  ghost={true}
                  disabled={job.status === 'done' ? false : true}
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
      ),
      onOk() {},
    });
  }

  private onDuplicateExperiment = (experiment: IExperiment) => {
    this.setState({
      newExperimentModalVisible: true,
      editExperiment: true,
      clickedExperiment: {
        name: `${experiment.name} - Copy`,
        description: experiment.description || '',
        alpha: experiment.parameters.alpha,
        independence_test: experiment.parameters.independence_test,
        cores: experiment.parameters.cores,
        observationMatrix_id: experiment.dataset_id,
      },
    });
  }

  private async onRunExperiment(experiment: IExperiment) {
    await runExperiment(experiment);
    this.fetchExperiments();
  }

  private onExploreExperiment = (experiment: IExperiment) => {
    // TODO
  }
}

export default ExperimentManagement;
