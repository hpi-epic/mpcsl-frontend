import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Card, Descriptions, message, Modal, Progress, Tooltip } from 'antd';
import Axios, { AxiosRequestConfig } from 'axios';
import styles from './ObservationMatrixListItem.module.scss';
import {
  deleteObservationMatrix,
  getObservationMatrixMetadata
} from '../../../restAPI/apiRequests';
import { IObservationMatrixMetadata } from '../../../types/types';
import {
  CheckCircleTwoTone,
  DeleteOutlined,
  InfoCircleOutlined,
  UploadOutlined
} from '@ant-design/icons';

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

const ObservationMatrixListItem: React.FC<IObservationMatrixListElement> = ({
  id,
  load_query,
  name,
  description,
  data_source,
  time_created,
  onClick
}) => {
  const [inputRef, setInputRef] = useState<HTMLInputElement>();
  const [uploadProgress, setUploadProgress] = useState<number | undefined>();
  const [metadata, setMetadata] = useState<
    IObservationMatrixMetadata | undefined
  >();
  useEffect(() => {
    getObservationMatrixMetadata(id).then(setMetadata);
  }, [id, load_query, name, description, data_source, time_created, onClick]);
  const history = useHistory();
  return (
    <Card
      title={
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          {name}
          {metadata?.has_ground_truth ? (
            <Tooltip title="Observation Matrix has Ground Truth Graph">
              <CheckCircleTwoTone
                style={{ fontSize: 20 }}
                type="check-circle"
                twoToneColor="#52c41a"
              />
            </Tooltip>
          ) : null}
        </div>
      }
      hoverable
      className={styles.ObservationMatrixListItem}
      onClick={() => history.push(`/${id}/experiments`)}
      actions={[
        <Tooltip key="upload" title="Upload Ground Truth Graph">
          <UploadOutlined
            style={{ fontSize: 20 }}
            onClick={e => {
              e.stopPropagation();
              if (inputRef) {
                inputRef.click();
              }
            }}
          />
        </Tooltip>,
        <Tooltip key="details" title="Show Details">
          <InfoCircleOutlined
            style={{ fontSize: 20 }}
            onClick={e => {
              e.stopPropagation();
              onClick();
            }}
          />
        </Tooltip>,
        <Tooltip key="delete" title="Delete Observation Matrix">
          <DeleteOutlined
            style={{ fontSize: 20 }}
            onClick={e => {
              e?.stopPropagation();
              confirm({
                title:
                  'Do you want to delete the following Observation Matrix?',
                content: `${name} - ${description}`,
                onOk() {
                  deleteObservationMatrix(id, name).catch();
                }
              });
            }}
          />
        </Tooltip>
      ]}
    >
      <div className={styles.ObservationMatrixListItemContent}>
        <Descriptions size="small" layout="vertical" column={1}>
          <Descriptions.Item className={styles.Description} label="Description">
            <p
              style={{
                marginTop: -10,
                height: 64,
                overflow: 'hidden',
                width: 250,
                color: 'rgba(0,0,0,.65)',
                overflowWrap: 'break-word'
              }}
            >
              {description}
            </p>
          </Descriptions.Item>
        </Descriptions>
        <Descriptions size="small" column={1}>
          {metadata ? (
            <>
              <Descriptions.Item label="Variables">
                {metadata.variables}
              </Descriptions.Item>
              <Descriptions.Item label="Observations">
                {metadata.observations}
              </Descriptions.Item>
              <Descriptions.Item label="Time created">
                {new Date(metadata.time_created * 1000).toLocaleString('de-DE')}
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
                Axios.post(`/api/dataset/${id}/upload`, data, config)
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
