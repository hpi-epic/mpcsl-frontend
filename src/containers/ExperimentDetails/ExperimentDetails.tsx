import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Button, List, Badge, Modal, Select } from 'antd';
import { LazyLog as _LazyLog } from 'react-lazylog';
import moment from 'moment';
import { IExperiment, IJob, GraphExportFormat, BadgeStatus } from '../../types';
import {
  getJobsForExperiment,
  getExperiment,
  subscribeToJobStatusChanges
} from '../../actions/apiRequests';
import Endpoints from '../../constants/api';
import styles from './ExperimentDetails.module.scss';
import Axios from 'axios';
import { Subscription } from 'rxjs';

const LazyLog: any = _LazyLog;

interface IStateJobsManagement {
  modalVisible: boolean;
  downloadModalVisible: boolean;
  extraLines: number; // necessary for linux support
  currentJobId: number | undefined;
  jobList: IJob[];
  experiment: IExperiment | undefined;
  format: GraphExportFormat;
  currentResultID: number | undefined;
}

interface IMatchParams {
  experimentId: string;
  datasetId: string;
}

class ExperimentDetails extends React.Component<
  RouteComponentProps<IMatchParams>,
  IStateJobsManagement
> {
  public exampleExperimentId = 2;

  constructor(props: RouteComponentProps<IMatchParams>) {
    super(props);

    this.state = {
      modalVisible: false,
      downloadModalVisible: false,
      extraLines: 1,
      currentJobId: undefined,
      jobList: [],
      currentResultID: undefined,
      experiment: undefined,
      format: GraphExportFormat.GEXF
    };
  }

  private sub: Subscription | undefined;

  public componentDidMount = () => {
    this.fetchExperiment(Number(this.props.match.params.experimentId));
    this.sub = subscribeToJobStatusChanges(() => {
      if (this.state.experiment) {
        this.fetchJobs(this.state.experiment);
      }
    });
  };

  public componentWillUnmount() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  public render() {
    if (this.state.experiment) {
      return (
        <div className={styles.Content}>
          <h2>
            Experiment: <i>{this.state.experiment.name}</i>
          </h2>
          <List
            itemLayout="horizontal"
            className={styles.JobList}
            header={<h3>Job List</h3>}
            dataSource={this.state.jobList}
            renderItem={(job: IJob) => (
              <List.Item
                actions={[
                  <Button
                    key={1}
                    type="primary"
                    ghost={true}
                    onClick={() => this.onExploreExperiment(job.result!.id)}
                    disabled={job.status !== 'done'}
                  >
                    explore
                  </Button>,
                  <Button
                    key={2}
                    type="primary"
                    ghost={true}
                    onClick={() => this.showDownloadModal(job.result!.id)}
                    disabled={job.status !== 'done'}
                  >
                    download graph
                  </Button>,
                  <Button
                    key={3}
                    type="primary"
                    onClick={() => this.showModal(job.id)}
                  >
                    view logs
                  </Button>
                ]}
              >
                <List.Item.Meta
                  title={
                    <div>
                      {<h3> Job #{job.id}</h3>}
                      <Badge
                        status={BadgeStatus[job.status]}
                        text={job.status}
                      />
                    </div>
                  }
                  description={
                    <div>
                      <i>
                        {` Starting Time: ${moment(job.start_time).format(
                          'dddd, MMMM Do YYYY, h:mm:ss a'
                        )}`}
                      </i>
                      <br />
                      {job.result ? (
                        <>
                          <i>
                            {'Execution Time: ' +
                              job.result.execution_time.toFixed(3) +
                              's'}
                          </i>
                          <br />
                          <i>
                            {'Dataset Loading Time: ' +
                              job.result.dataset_loading_time.toFixed(3) +
                              's'}
                          </i>
                        </>
                      ) : null}
                    </div>
                  }
                />
              </List.Item>
            )}
          />
          <Modal
            title={`Job #  ${this.state.currentJobId}`}
            centered={true}
            width={820}
            footer={null}
            visible={this.state.modalVisible}
            onCancel={this.handleCancel}
            destroyOnClose={true}
          >
            <LazyLog
              url={
                this.state.currentJobId
                  ? Endpoints.jobLogs(this.state.currentJobId)
                  : undefined
              }
              stream={true}
              follow={true}
              width={772}
              height={500}
              onError={this.handleError}
              selectableLines={true}
              extraLines={this.state.extraLines}
            />
          </Modal>
          <Modal
            title={'Download Graph'}
            centered={true}
            width={820}
            visible={this.state.downloadModalVisible}
            onCancel={this.handleDownloadCancel}
            onOk={this.handleDownload}
          >
            <span>Format:</span>
            <Select
              onChange={(value: any) => this.setState({ format: value })}
              style={{ width: 250 }}
              value={this.state.format}
            >
              {Object.keys(GraphExportFormat).map(key => (
                <Select.Option
                  value={(GraphExportFormat as any)[key]}
                  key={key}
                >
                  {key}
                </Select.Option>
              ))}
            </Select>
          </Modal>
        </div>
      );
    } else {
      return <span>Loading ...</span>;
    }
  }
  private showModal = (jobId: number) => {
    this.setState({
      currentJobId: jobId,
      modalVisible: true
    });
  };
  private handleError = () => {
    this.setState({
      extraLines: 0
    });
  };

  private handleCancel = () => {
    this.setState({
      modalVisible: false,
      extraLines: 1
    });
  };

  private handleDownloadCancel = () => {
    this.setState({
      downloadModalVisible: false
    });
  };

  private handleDownload = () => {
    this.setState({
      downloadModalVisible: false
    });

    Axios.get(
      Endpoints.resultExport(this.state.currentResultID!, this.state.format)
    ).then(response => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `result${this.state.currentResultID}.${this.state.format}`
      );
      document.body.appendChild(link);
      link.click();
    });
  };

  private showDownloadModal = (resultID: number) => {
    this.setState({
      downloadModalVisible: true,
      currentResultID: resultID
    });
  };

  private async fetchJobs(experiment: IExperiment) {
    const jobList = await getJobsForExperiment(experiment.id);
    this.setState({ jobList });
  }

  private async fetchExperiment(experimentId: number) {
    const experiment = await getExperiment(experimentId);
    this.setState({ experiment });
    this.fetchJobs(this.state.experiment!);
  }

  private onExploreExperiment = (resultId: number) => {
    this.props.history.push(
      `/${this.props.match.params.datasetId}/experiments/${this.props.match.params.experimentId}/jobs/${resultId}`
    );
  };

  private onGoBack = (datasetId: string) => {
    this.props.history.push(`/${datasetId}/experiments`);
  };
}

export default ExperimentDetails;
