import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import {
  getExperimentsForDataset,
  subscribeToJobStatusChanges,
  subscribeToExperimentChanges
} from '../../actions/apiRequests';
import { IExperiment } from '../../types';
import { Button, Spin, Row } from 'antd';
import styles from './ExperimentsView.module.scss';
import { Subscription } from 'rxjs';
import { NewExperimentModalForm } from './NewExperimentModal';
import { ExperimentsListItem } from '../../components/ExperimentsListItem/ExperimentsListItem';

const ExperimentsList = (props: {
  datasetId: number;
  onView: (experiment: IExperiment | undefined) => void;
  onDuplicate: (experiment: IExperiment | undefined) => void;
}) => {
  const [experiments, setExperiments] = useState<undefined | IExperiment[]>();
  useEffect(() => {
    let subs: Subscription[] | undefined;
    if (props.datasetId) {
      const fetchExperiments = () => {
        getExperimentsForDataset(props.datasetId)
          .then(setExperiments)
          .catch();
      };
      fetchExperiments();
      subs = [
        subscribeToJobStatusChanges(fetchExperiments),
        subscribeToExperimentChanges(fetchExperiments)
      ];
    }
    return () => subs?.forEach(sub => sub.unsubscribe());
  }, [props.datasetId]);
  if (!props.datasetId) {
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
          {...experiment}
          onView={id => props.onView(experiments.find(exp => exp.id === id))}
          onDuplicate={id =>
            props.onDuplicate(experiments.find(exp => exp.id === id))
          }
        />
      ))}
    </div>
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
  return (
    <div className="Content">
      <Row>
        <div className={styles.ExperimentControls}>
          <Button
            type="primary"
            onClick={() => {
              setEditDisabled(false);
              setLastExperiment(undefined);
              setModalVisible(true);
            }}
          >
            + New Experiment
          </Button>
        </div>
      </Row>
      <Row>
        <ExperimentsList
          datasetId={datasetId}
          onView={experiment => {
            setEditDisabled(true);
            setLastExperiment(experiment);
            setModalVisible(true);
          }}
          onDuplicate={experiment => {
            setLastExperiment(experiment);
            setEditDisabled(false);
            setModalVisible(true);
          }}
        />
      </Row>
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

export { ExperimentsView };
