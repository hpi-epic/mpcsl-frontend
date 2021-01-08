import { Button, Drawer } from 'antd';
import React, { useEffect, useState } from 'react';
import {
  getAllDatasetGenerationJobs,
  subscribeToJobStatusChanges
} from '../../../restAPI/apiRequests';
import { IDatasetGenerationJob } from '../../../types/types';
import { DatasetGenerationJobList } from '../DatasetGenerationJobList/DatasetGenerationJobList';

export const RunningJobsButton = () => {
  const [jobListDrawerVisable, setjobListDrawerVisable] = useState<boolean>(
    false
  );

  const [datasetGenerationJobs, setDatasetGenerationJobs] = useState<
    undefined | IDatasetGenerationJob[]
  >();

  const showDrawer = () => {
    setjobListDrawerVisable(true);
  };
  const onClose = () => {
    setjobListDrawerVisable(false);
  };

  useEffect(() => {
    const fetchDatasetGenerationJobs = () => {
      console.log('Called');
      getAllDatasetGenerationJobs()
        //.then(jobs => jobs.filter(job => job.status == "running" || job.status == "waiting")) //TODO move this to api?
        .then(setDatasetGenerationJobs)
        .catch();
    };

    fetchDatasetGenerationJobs();
    const jobSub = subscribeToJobStatusChanges(fetchDatasetGenerationJobs);

    return () => {
      jobSub.unsubscribe();
    };
  }, []);

  return (
    <>
      <Button type="primary" onClick={showDrawer}>
        Jobs
      </Button>

      <Drawer
        title="Dataset Generation Jobs"
        placement="right"
        closable={false}
        onClose={onClose}
        width={600}
        visible={jobListDrawerVisable}
      >
        <DatasetGenerationJobList jobs={datasetGenerationJobs} />
      </Drawer>
    </>
  );
};
