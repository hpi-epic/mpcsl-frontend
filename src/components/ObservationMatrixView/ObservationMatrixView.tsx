import React, { useEffect, useState } from 'react';
import {
  getAllDatasetGenerationJobs,
  getObservationMatrices,
  subscribeToDatasetChanges,
  subscribeToJobStatusChanges
} from '../../restAPI/apiRequests';
import { IDatasetGenerationJob, IObservationMatrix } from '../../types/types';
import { ObservationMatrixListItem } from './ObservationMatrixListItem/ObservationMatrixListItem';
import styles from './ObservationMatrixView.module.scss';
import ExistingDatasetModal, {
  IFormObservationMatrix
} from './ExistingDatasetModal/ExistingDatasetModal';
import ObservationMatrixPlaceholder from './ObservationMatrixPlaceholder/ObservationMatrixPlaceholder';
import { Spin } from 'antd';

export const ObservationMatrixView = () => {
  const [datasets, setDatasets] = useState<undefined | IObservationMatrix[]>();
  const [datasetGenerationJobs, setDatasetGenerationJobs] = useState<
    undefined | IDatasetGenerationJob[]
  >();

  const [
    observationMatrixModalVisible,
    setObservationMatrixModalVisible
  ] = useState<boolean>(false);
  const [currentObservationMatrix, setCurrentObservationMatrix] = useState<
    undefined | IFormObservationMatrix
  >();

  const onClose = () => {
    setObservationMatrixModalVisible(false);
    setCurrentObservationMatrix(undefined);
  };
  const onViewObservationMatrix = (observationMatrix: IObservationMatrix) => {
    setCurrentObservationMatrix({
      observationMatrixName: observationMatrix.name,
      observationMatrixDescription: observationMatrix.description || '-',
      query: observationMatrix.load_query,
      dataSource: observationMatrix.data_source || '-',
      id: observationMatrix.id
    });
    setObservationMatrixModalVisible(true);
  };

  useEffect(() => {
    const fetchDatasets = () => {
      getObservationMatrices()
        .then(setDatasets)
        .catch();
    };
    const fetchDatasetGenerationJobs = () => {
      console.log('Called');
      getAllDatasetGenerationJobs()
        .then(jobs =>
          jobs.filter(job => job.status == 'running' || job.status == 'waiting')
        ) //TODO move this to api?
        .then(setDatasetGenerationJobs)
        .catch();
    };

    fetchDatasets();
    fetchDatasetGenerationJobs();

    const datasetSub = subscribeToDatasetChanges(fetchDatasets);
    const jobSub = subscribeToJobStatusChanges(fetchDatasetGenerationJobs);

    return () => {
      datasetSub.unsubscribe();
      jobSub.unsubscribe();
    };
  }, []);

  return (
    <>
      <div className={styles.ObservationMatrixList}>
        {datasets?.map(matrix => (
          <ObservationMatrixListItem
            onClick={() => onViewObservationMatrix(matrix)}
            key={`matrix-${matrix.id}`}
            {...matrix}
          />
        ))}
        {datasetGenerationJobs?.map(job => (
          <Spin key={`job-${job.id}`}>
            <ObservationMatrixListItem
              onClick={() => {
                console.log('Empty');
              }} //TODO change this
              id={0} //TODO change this
              load_query={`SELECT * FROM ${job.datasetName}`} //TODO add name
              name={job.datasetName}
              description={`Generating ${job.datasetName}`}
              data_source={'Placeholder datas'}
              time_created={job.start_time}
            />
          </Spin>
        ))}
        <ObservationMatrixPlaceholder key="placeholder" />
      </div>
      <ExistingDatasetModal
        visible={observationMatrixModalVisible}
        onClose={onClose}
        observationMatrix={currentObservationMatrix}
      />
    </>
  );
};
