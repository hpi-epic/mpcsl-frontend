import { Badge, Button, List, Modal } from 'antd';
import moment from 'antd/node_modules/moment';
import * as React from 'react';
import { LazyLog } from 'react-lazylog';
import Endpoints from '../../../restAPI/apiEndpoints';
import { BadgeStatus, IDatasetGenerationJob } from '../../../types/types';

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
        renderItem={(job, index) => (
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
                  {<h3> Job #{job.id}</h3>}
                  <Badge status={BadgeStatus[job.status]} text={job.status} />
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
      {/* Modals */}
      <Modal
        title={`Job #  ${selectedJob}`}
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
