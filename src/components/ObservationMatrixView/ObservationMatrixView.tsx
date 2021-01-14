import React, { useEffect, useState } from 'react';
import {
  getAllDatasetGenerationJobs,
  getObservationMatrices,
  getObservationMatrixMetadata,
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
          jobs.filter(
            job => job.status === 'running' || job.status === 'waiting'
          )
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
        <ObservationMatrixPlaceholder key="placeholder" />
        {datasetGenerationJobs?.map(job => (
          <Spin key={`job-${job.id}`}>
            <ObservationMatrixListItem
              onClick={() => {
                console.log();
              }} //TODO Change this
              id={0} //TODO can we make this optional?
              name={job.datasetName}
              description={'DUMMY: Generated'} //TODO can we make this optional?
              loadMetadata={Promise.resolve({
                variables: job.nodes,
                time_created: new Date(job.start_time).getMilliseconds(), //TODO fix parsing
                observations: job.samples,
                data_source: 'DATA SOURCE', //TODO can we make this optional?
                query: `GENERATING`, //TODO can we make this optional?
                has_ground_truth: true
              })}
            />
          </Spin>
        ))}
        {datasets?.map(matrix => (
          <ObservationMatrixListItem
            onClick={() => onViewObservationMatrix(matrix)}
            key={`matrix-${matrix.id}`}
            {...matrix}
            loadMetadata={getObservationMatrixMetadata(matrix.id)}
          />
        ))}
      </div>
      <ExistingDatasetModal
        visible={observationMatrixModalVisible}
        onClose={onClose}
        observationMatrix={currentObservationMatrix}
      />
    </>
  );
};
