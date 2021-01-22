import { Badge, Button, List, Modal } from 'antd';
import moment from 'antd/node_modules/moment';
import * as React from 'react';
import { LazyLog } from 'react-lazylog';
import Endpoints from '../../../restAPI/apiEndpoints';
import { BadgeStatus, IDatasetGenerationJob } from '../../../types/types';

const timeFormat = 'dddd, MMMM Do YYYY, h:mm:ss a';
export interface DatasetGenerationJobListProps {
  jobs: IDatasetGenerationJob[] | undefined;
}

export const DatasetGenerationJobList: React.FC<DatasetGenerationJobListProps> = props => {
  const [logModelVisable, setLogModelVisable] = React.useState<boolean>(false);
  const [selectedJob, setSelectedJob] = React.useState<
    IDatasetGenerationJob | undefined
  >(undefined);

  const showLogModel = (jobIndex: number) => {
    if (props.jobs) {
      setSelectedJob(props.jobs[jobIndex]);
      setLogModelVisable(true);
    }
  };

  return (
    <>
      <List
        dataSource={props.jobs}
        renderItem={(job, index) => {
          const startTime = moment(job.start_time);
          const endTime = moment(job.end_time);
          const executionTime = endTime.diff(startTime) / 1000; // convert ms to s
          return (
            <List.Item
              actions={[
                <Button
                  key={1}
                  type="primary"
                  onClick={() => showLogModel(index)}
                >
                  view logs
                </Button>
              ]}
            >
              <List.Item.Meta
                title={
                  <div>
                    {<h3>{`Job #${job.id} ${job.datasetName}`}</h3>}
                    <Badge status={BadgeStatus[job.status]} text={job.status} />
                  </div>
                }
                description={
                  <div>
                    <i>
                      {` Starting Time: ${moment(job.start_time).format(
                        timeFormat
                      )}`}
                    </i>
                    <br />
                    {job.status === 'done' ? (
                      <>
                        <i>{`Execution Time: ${executionTime.toFixed(3)} s`}</i>
                      </>
                    ) : null}
                  </div>
                }
              />
            </List.Item>
          );
        }}
      />
      {/* Modals */}
      <Modal
        title={`Job #  ${selectedJob?.id}`}
        centered={true}
        width={820}
        footer={null}
        visible={logModelVisable}
        onCancel={() => {
          setLogModelVisable(false);
          setSelectedJob(undefined);
        }}
        destroyOnClose={true}
      >
        <LazyLog
          url={selectedJob ? Endpoints.jobLogs(selectedJob.id) : undefined}
          stream={true}
          follow={true}
          fetchOptions={{
            credentials: 'include'
          }}
          width={772}
          height={500}
          selectableLines={true}
        />
      </Modal>
    </>
  );
};
