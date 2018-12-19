import React from 'react';
import { Row, Button, Form, Modal, List, Badge } from 'antd';

import './style.css';
import NewExperimentModal, {
  IPropsNewExperimentModal, IFormExperiment
} from './NewExperimentModal';
import { IExperiment, IJob } from '../../types';
import { getExperiments, deleteExperiment, getJobsForExperiment, deleteJob } from '../../actions/apiRequests';
import ListElementExperiment from '../../components/ListElementExperiment/ListElementExperiment';

interface IStateExperimentManagement {
  newExperimentModalVisible: boolean;
  experiments: Array<IExperiment>;
  clickedExperiment: IFormExperiment | undefined;
  editExperiment: boolean;
  jobListVisible: boolean;
  jobList: Array<IJob>;
}

class ExperimentManagement extends React.Component<
  {},
  IStateExperimentManagement
  > {
  mounted = false;

  constructor(props: {}) {
    super(props);

    this.state = {
      editExperiment: true,
      newExperimentModalVisible: false,
      experiments: [],
      clickedExperiment: undefined,
      jobListVisible: false,
      jobList: [],
    };
  }

  private jobBadgeMap: any = {
    'running': 'processing',
    'done': 'success',
    'error': 'error',
    'cancelled': 'warning'
  }

  public componentDidMount = () => {
    this.mounted = true;
    this.fetchExperiments();
  };

  public componentWillUnmount = () => {
    this.mounted = false;
  }

  public render() {
    const ExperimentModal = Form.create<IPropsNewExperimentModal>()(
      NewExperimentModal
    );
    const ExperimentList = this.state.experiments.map(
      (experiment: IExperiment) => (
        <ListElementExperiment
          key={experiment.id}
          title={experiment.name}
          status={experiment.last_job! === null ? 'default' : this.jobBadgeMap[experiment.last_job!.status]}
          statusText={experiment.last_job! === null ? 'Experiment was not started yet.' : experiment.last_job!.status}
          content='Experiment Description'
          onDelete={() => this.onDeleteExperiment(experiment)}
          onDuplicate={() => this.onDuplicateExperiment(experiment)}
          onExplore={() => this.onExploreExperiment(experiment)}
          onRunStart={() => this.onRunExperiment(experiment)}
          onView={() => this.onExperimentClick(experiment)}
          showAllJobs={() => this.onJobListView(experiment)}
        />
      )
    );

    return (
      <div className="Content">
        <Row>
          <div className="Experiment-Controls">
            <Button type="primary" onClick={this.onNewExperiment}>
              + New Experiment
            </Button>
          </div>
        </Row>
        <Row>
          {ExperimentList}
        </Row>
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

  private onNewExperiment = () => {
    this.setState({
      newExperimentModalVisible: true,
      editExperiment: true
    });
  };

  private onClose = () => {
    this.setState({
      newExperimentModalVisible: false,
      clickedExperiment: undefined,
      editExperiment: true,
      jobListVisible: false,
    });
    this.fetchExperiments();
  };

  private onDeleteExperiment = (experiment: IExperiment) => {
    deleteExperiment(experiment)
      .then(() => {
        this.fetchExperiments();;
      });
  };

  private onExperimentClick = (experiment: IExperiment) => {
    this.setState({
      newExperimentModalVisible: true,
      editExperiment: false,
      clickedExperiment: {
        name: experiment.name,
        alpha: experiment.parameters.alpha,
        independence_test: experiment.parameters.independence_test,
        cores: experiment.parameters.cores,
        observationMatrix_id: experiment.dataset_id,
      }
    })
  }

  private async onJobListView(experiment: IExperiment) {
    const jobs = await getJobsForExperiment(experiment);

    Modal.info({
      title: `Job List for Experiment ${experiment.name}`,
      content: (
        <List
          itemLayout="horizontal"
          className="Job-List"
          dataSource={jobs}
          renderItem={(job: IJob) => (
            <List.Item actions={[<Button onClick={() => this.deleteJob(job)}>delete</Button>]}>
              <List.Item.Meta
                title={<div> <Badge className='Job-Badge' status={this.jobBadgeMap[job.status]} text={job.status} /></div>}
                description={<div>Starting Time: {job.startTime}</div>}
              />
            </List.Item>
          )}
        />
      ),
      onOk() { },
    });
  }

  private async deleteJob(job: IJob) {
    await deleteJob(job);
  }

  private onDuplicateExperiment = (experiment: IExperiment) => {
    this.setState({
      newExperimentModalVisible: true,
      editExperiment: true,
      clickedExperiment: {
        name: `${experiment.name} - Copy`,
        alpha: experiment.parameters.alpha,
        independence_test: experiment.parameters.independence_test,
        cores: experiment.parameters.cores,
        observationMatrix_id: experiment.dataset_id,
      }
    })
  }

  private onRunExperiment = (experiment: IExperiment) => {
    // TODO
    ;
  }

  private onExploreExperiment = (experiment: IExperiment) => {
    // TODO
    ;
  }
}

export default ExperimentManagement;
