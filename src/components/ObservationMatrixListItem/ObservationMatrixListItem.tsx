import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Card,
  Progress,
  message,
  Icon,
  Modal,
  Tooltip,
  Descriptions
} from 'antd';
import Axios, { AxiosRequestConfig } from 'axios';
import styles from './ObservationMatrixListItem.module.scss';
import {
  deleteObservationMatrix,
  getObservationMatrixMetadata
} from '../../actions/apiRequests';

const { confirm } = Modal;

interface IObservationMatrixListElement {
  id: number;
  load_query: string;
  name: string;
  description?: string;
  data_source?: string;
  time_created?: string;
  onClick: () => void;
}

interface IObservationMatrixMetadata {
  variables: number;
  load_query: string;
  time_created: number;
  observations: number;
  data_source: string;
  query: string;
  has_ground_truth: boolean;
}

const ObservationMatrixListItem = (props: IObservationMatrixListElement) => {
  const { name, description } = props;
  const [inputRef, setInputRef] = useState<HTMLInputElement>();
  const [uploadProgress, setUploadProgress] = useState<number | undefined>();
  const [metadata, setMetadata] = useState<
    IObservationMatrixMetadata | undefined
  >();
  useEffect(() => {
    getObservationMatrixMetadata(props?.id).then(setMetadata);
  }, [props]);
  const history = useHistory();
  return (
    <Card
      title={
        <>
          {name}
          {metadata?.has_ground_truth ? (
            <Tooltip title="Observation Matrix has Ground Truth Graph">
              <Icon
                type="check-circle"
                theme="twoTone"
                twoToneColor="#52c41a"
              />
            </Tooltip>
          ) : null}
        </>
      }
      hoverable
      className={styles.ObservationMatrixListItem}
      onClick={() => history.push(`/${props.id}/experiments`)}
      actions={[
        <Tooltip key="upload" title="Upload Ground Truth Graph">
          <Icon
            type="upload"
            onClick={e => {
              e.stopPropagation();
              if (inputRef) {
                inputRef.click();
              }
            }}
          />
        </Tooltip>,
        <Tooltip key="details" title="Show Details">
          <Icon
            onClick={e => {
              e.stopPropagation();
              props.onClick();
            }}
            type="info-circle"
          />
        </Tooltip>,
        <Tooltip key="delete" title="Delete Experiment">
          <Icon
            type="delete"
            onClick={e => {
              e?.stopPropagation();
              confirm({
                title: 'Do you want to delete the following Dataset?',
                content: `${props.name} - ${props.description}`,
                onOk() {
                  deleteObservationMatrix(props).catch();
                }
              });
            }}
          />
        </Tooltip>
      ]}
    >
      <div className={styles.ObservationMatrixListItemContent}>
        <Descriptions size="small" column={1}>
          <Descriptions.Item label="Description">
            {description}
          </Descriptions.Item>
          {metadata ? (
            <>
              <Descriptions.Item label="Variables">
                {metadata.variables}
              </Descriptions.Item>
              <Descriptions.Item label="Observations">
                {metadata.observations}
              </Descriptions.Item>
              <Descriptions.Item label="Time created:">
                {new Date(metadata.time_created * 1000).toLocaleString()}
              </Descriptions.Item>
            </>
          ) : null}
        </Descriptions>
        <div style={{ alignSelf: 'flex-end' }}>
          <div style={{ width: 170 }}>
            {uploadProgress ? (
              <Progress percent={uploadProgress} size="small" />
            ) : null}
          </div>

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
        </div>
      </div>
    </Card>
  );
};

export { ObservationMatrixListItem };
