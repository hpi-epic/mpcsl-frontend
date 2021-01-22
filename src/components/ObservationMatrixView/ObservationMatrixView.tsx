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
import moment from 'antd/node_modules/moment';

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
        .then(array =>
          array.sort(
            (a, b) =>
              moment(b.time_created)
                .toDate()
                .getTime() -
              moment(a.time_created)
                .toDate()
                .getTime()
          )
        )
        .then(setDatasets)
        .catch();
    };
    const fetchDatasetGenerationJobs = () => {
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
              id={0} // dummy value because we do not have a dataset id yet
              name={job.datasetName}
              description={'Generating ...'}
              loadMetadata={Promise.resolve({
                variables: 0,
                time_created:
                  moment(job.start_time)
                    .toDate()
                    .getTime() / 1000, //TODO rework parsing in ObservationMatrixView
                observations: 0,
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
