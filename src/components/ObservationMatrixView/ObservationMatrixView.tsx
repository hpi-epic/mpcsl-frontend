import React, { useState, useEffect } from 'react';
import { IObservationMatrix } from '../../types';
import {
  getObservationMatrices,
  deleteObservationMatrix,
  subscribeToDatasetChanges
} from '../../actions/apiRequests';
import NewObservationMatrixModal, {
  IPropsNewObservationMatrixModal,
  IFormObservationMatrix
} from '../../containers/ObservationMatricesManager/NewObservationMatrixModal';
import { Card, Button, Popconfirm, Form, Row, Progress, message } from 'antd';
import styles from './ObservationMatrixView.module.scss';
import { useHistory } from 'react-router-dom';
import Axios, { AxiosRequestConfig } from 'axios';

interface IObservationMatrixList {
  onView: (observationMatrix: IObservationMatrix) => void;
}

interface IObservationMatrixListElement {
  id: number;
  load_query: string;
  name: string;
  description?: string;
  data_source?: string;
  time_created?: string;
  onClick: () => void;
}

const ObservationMatrixListItem = (props: IObservationMatrixListElement) => {
  const { name, description } = props;
  const [inputRef, setInputRef] = useState<HTMLInputElement>();
  const [uploadProgress, setUploadProgress] = useState<number | undefined>();
  const history = useHistory();
  return (
    <Card
      title={name}
      hoverable
      className={styles.ObservationMatrixListItem}
      onClick={() => history.push(`/${props.id}/experiments`)}
    >
      <div className={styles.ObservationMatrixListItemContent}>
        <p>{description}</p>
        <div style={{ alignSelf: 'flex-end' }}>
          <div style={{ width: 170 }}>
            {uploadProgress ? (
              <Progress percent={uploadProgress} size="small" />
            ) : null}
          </div>
          <Button
            className="List-Buttons"
            type="primary"
            ghost={true}
            onClick={e => {
              e.stopPropagation();
              if (inputRef) {
                inputRef.click();
              }
            }}
          >
            Upload Ground Truth Graph
          </Button>
          <input
            style={{ display: 'none' }}
            type="file"
            name="file"
            id="file"
            ref={ref => (ref ? setInputRef(ref) : undefined)}
            accept=".gml"
            onClick={e => e.stopPropagation()}
            onChange={e => {
              const target = e.target;
              const file =
                target.files && target.files.length === 1
                  ? target.files[0]
                  : undefined;
              if (file) {
                const data = new FormData();
                data.append('graph_file', file);

                const config: AxiosRequestConfig = {
                  onUploadProgress: progressEvent =>
                    setUploadProgress(
                      Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                      )
                    )
                };
                Axios.post(`/api/dataset/${props.id}/upload`, data, config)
                  .catch(err => {
                    message.error(err.response.data.message);
                  })
                  .finally(() => {
                    setTimeout(() => setUploadProgress(undefined), 1000);
                    target.value = '';
                  });
              }
            }}
          />
          <Button
            className={styles.ListButton}
            onClick={e => {
              e.stopPropagation();
              props.onClick();
            }}
            type="primary"
            ghost={true}
          >
            View
          </Button>
          <Popconfirm
            title="Delete Matrix?"
            onConfirm={e => {
              e?.stopPropagation();
              deleteObservationMatrix(props);
            }}
            onCancel={e => e?.stopPropagation()}
          >
            <Button
              icon="delete"
              type="danger"
              className={styles.ListButton}
              ghost={true}
              onClick={e => e.stopPropagation()}
            >
              Delete
            </Button>
          </Popconfirm>
        </div>
      </div>
    </Card>
  );
};

const ObservationMatrixList = (props: IObservationMatrixList) => {
  const [matrices, setMatrices] = useState<undefined | IObservationMatrix[]>();
  useEffect(() => {
    const fetchDatasets = () => {
      getObservationMatrices()
        .then(setMatrices)
        .catch();
    };
    fetchDatasets();
    const sub = subscribeToDatasetChanges().subscribe(fetchDatasets);
    return () => sub.unsubscribe();
  }, []);
  return matrices ? (
    <div className={styles.ObservationMatrixList}>
      {matrices.map(matrix => (
        <ObservationMatrixListItem
          onClick={() => props.onView(matrix)}
          key={matrix.id}
          {...matrix}
        />
      ))}
    </div>
  ) : null;
};

const ObservationMatrixView = () => {
  const ObservationMatrixModal = Form.create<IPropsNewObservationMatrixModal>()(
    NewObservationMatrixModal
  );
  const [
    observationMatrixModalVisible,
    setObservationMatrixModalVisible
  ] = useState<boolean>(false);
  const [currentObservationMatrix, setCurrentObservationMatrix] = useState<
    undefined | IFormObservationMatrix
  >();
  const onNewObservationMatrix = () => {
    setObservationMatrixModalVisible(true);
    setCurrentObservationMatrix(undefined);
  };
  const onClose = () => {
    setObservationMatrixModalVisible(false);
    setCurrentObservationMatrix(undefined);
  };
  const OnViewObservationMatrix = (observationMatrix: IObservationMatrix) => {
    setCurrentObservationMatrix({
      observationMatrixName: observationMatrix.name,
      observationMatrixDescription: observationMatrix.description || '-',
      query: observationMatrix.load_query,
      dataSource: observationMatrix.data_source || '-'
    });
    setObservationMatrixModalVisible(true);
  };
  return (
    <div className="Content">
      <Row>
        <div className={styles.ObservationMatrixControls}>
          <Button type="primary" onClick={onNewObservationMatrix}>
            + New Observation Matrix
          </Button>
        </div>
      </Row>
      <Row>
        <ObservationMatrixList
          onView={OnViewObservationMatrix}
        ></ObservationMatrixList>
      </Row>
      <ObservationMatrixModal
        visible={observationMatrixModalVisible}
        onClose={onClose}
        observationMatrix={currentObservationMatrix}
      />
    </div>
  );
};

export { ObservationMatrixView };
