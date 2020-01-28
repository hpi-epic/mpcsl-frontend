import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Card, Progress, Button, message, Popconfirm } from 'antd';
import Axios, { AxiosRequestConfig } from 'axios';
import styles from './ObservationMatrixListItem.module.scss';
import { deleteObservationMatrix } from '../../actions/apiRequests';

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
        <p className={styles.Description}>{description}</p>
        <div style={{ alignSelf: 'flex-end' }}>
          <div style={{ width: 170 }}>
            {uploadProgress ? (
              <Progress percent={uploadProgress} size="small" />
            ) : null}
          </div>
          <Button
            className={styles.ListButton}
            type="primary"
            ghost={true}
            onClick={e => {
              e.stopPropagation();
              if (inputRef) {
                inputRef.click();
              }
            }}
          >
            Upload Ground Truth
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

export { ObservationMatrixListItem };
