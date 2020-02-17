import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import {
  getExperimentsForDataset,
  subscribeToExperimentChanges
} from '../../actions/apiRequests';
import { IExperiment } from '../../types';
import { Button, Spin } from 'antd';
import styles from './ExperimentsView.module.scss';
import { Subscription } from 'rxjs';
import { NewExperimentModalForm } from './NewExperimentModal';
import { ExperimentsListItem } from '../../components/ExperimentsListItem/ExperimentsListItem';

const NewExperimentButton = ({
  match
}: RouteComponentProps<{ datasetId: string }>) => {
  const [modalVisible, setModalVisible] = useState(false);
  const datasetId = parseInt(match.params.datasetId, 10);
  return (
    <>
      <Button
        type="primary"
        onClick={() => {
          setModalVisible(true);
        }}
      >
        + New Experiment
      </Button>
      <NewExperimentModalForm
        visible={modalVisible}
        datasetId={datasetId}
        onClose={() => {
          setModalVisible(false);
        }}
        experiment={undefined}
        editDisabled={false}
      />
    </>
  );
};

const ExperimentsView = ({
  match
}: RouteComponentProps<{ datasetId: string }>) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editDisabled, setEditDisabled] = useState(false);
  const [lastExperiment, setLastExperiment] = useState<
    undefined | IExperiment
  >();
  const datasetId = parseInt(match.params.datasetId, 10);
  const [experiments, setExperiments] = useState<undefined | IExperiment[]>();
  useEffect(() => {
    let sub: Subscription | undefined;
    if (datasetId) {
      const fetchExperiments = () => {
        getExperimentsForDataset(datasetId)
          .then(setExperiments)
          .catch();
      };
      fetchExperiments();
      sub = subscribeToExperimentChanges(fetchExperiments);
    }
    return () => sub?.unsubscribe();
  }, [datasetId]);
  if (!datasetId) {
    return <h1>404</h1>;
  }
  if (!experiments) {
    return (
      <Spin
        style={{ position: 'absolute', top: '50%', left: '50%' }}
        size="large"
      />
    );
  }
  return (
    <div className={styles.List}>
      {experiments.map(experiment => (
        <ExperimentsListItem
          key={experiment.id}
          experiment={experiment}
          onView={id => {
            setEditDisabled(true);
            setLastExperiment(experiments.find(exp => exp.id === id));
            setModalVisible(true);
          }}
          onDuplicate={id => {
            setLastExperiment(experiments.find(exp => exp.id === id));
            setEditDisabled(false);
            setModalVisible(true);
          }}
        />
      ))}
      <NewExperimentModalForm
        visible={modalVisible}
        datasetId={datasetId}
        onClose={() => {
          setModalVisible(false);
        }}
        experiment={lastExperiment}
        editDisabled={editDisabled}
      />
    </div>
  );
};

export { ExperimentsView, NewExperimentButton };
