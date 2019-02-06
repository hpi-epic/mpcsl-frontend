import React from 'react';
import { Button, List, Badge, Icon, Modal } from 'antd';
import { IExperiment, IJob } from '../../types';
import { LazyLog } from 'react-lazylog';
import { getJobsForExperiment, getExperiment } from '../../actions/apiRequests';
import moment from 'moment';
import { RouteComponentProps } from 'react-router-dom';
import './style.css';

interface IStateJobsManagement {
  modalVisible: boolean;
  jobList: IJob[];
  experiment: IExperiment | undefined;
}

interface IMatchParams {
  experiment_id: string;
}

class ExperimentDetails extends React.Component<
  RouteComponentProps<IMatchParams>,
  IStateJobsManagement
  > {
  public exampleExperimentId = 2;
  private jobBadgeMap: any = {
    running: 'processing',
    done: 'success',
    error: 'error',
    cancelled: 'warning',
  };

  constructor(props: RouteComponentProps<IMatchParams>) {
    super(props);

    this.state = {
      modalVisible: false,
      jobList: [],
      experiment: undefined,
    };
  }

  public componentDidMount = () => {
    this.fetchExperiment(Number(this.props.match.params.experiment_id));
  }

  public render() {
    if (this.state.experiment) {
      return (
        <div className='Content'>
          <Button className='Go-Back-Button' onClick={() => this.onGoBack()} type='primary' ghost={true}>
            <Icon type='left' />
          </Button>
          <h2>
            Experiment: <i>{this.state.experiment.name}</i>
          </h2>
          <List
            itemLayout='horizontal'
            className='Job-List'
            header={<h3>Job List</h3>}
            dataSource={this.state.jobList}
            renderItem={(job: IJob) => (
              <List.Item
                actions={[
                  <Button
                    key={1}
                    type='primary'
                    ghost={true}
                    onClick={() => this.onExploreExperiment(job.result!.id)}
                    disabled={job.status === 'done' ? false : true}
                  >
                    explore
                  </Button>,
                  <Button
                    key={2}
                    type='primary'
                    onClick={() => this.showModal()}
                  >
                    view logs
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
                      <Modal
                        title={`Job #  ${job.id}`}
                        centered
                        width='100'
                        footer={null}
                        visible={this.state.modalVisible}
                        onCancel={this.handleCancel}
                      >
                        <div className='Log'>
                          <LazyLog url={'http://localhost:3000/api/job/' + job.id + '/logs'} stream follow={true} />
                        </div>
                      </Modal>
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
    } else {
      return <span>Nothing to show</span>;
    }
  }
  private showModal = () => {
    this.setState({
      modalVisible: true,
    });
  }

  private handleCancel = (e: any) => {
    console.log(e);
    this.setState({
      modalVisible: false,
    });
  }

  private async fetchJobs(experiment: IExperiment) {
    const jobList = await getJobsForExperiment(experiment);
    this.setState({ jobList });
  }

  private async fetchExperiment(experimentId: number) {
    const experiment = await getExperiment(experimentId);
    this.setState({ experiment });
    this.fetchJobs(this.state.experiment!);
  }

  private onExploreExperiment = (resultId: number) => {
    this.props.history.push(`/graph-explorer/selection/${resultId}`);
  }

  private onGoBack = () => {
    this.props.history.push('/manager/experiments');
  }
}

export default ExperimentDetails;
