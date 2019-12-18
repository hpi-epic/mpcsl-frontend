import React, { useState, useEffect } from 'react';
import { IObservationMatrix } from '../../types';
import {
  getObservationMatrices,
  deleteObservationMatrix
} from '../../actions/apiRequests';
import { Card, Button, Popconfirm } from 'antd';
import styles from './ObservationMatrixList.module.scss';
import { useHistory } from 'react-router-dom';

const ObservationMatrixListItem = (props: IObservationMatrix) => {
  const { name, description } = props;
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

const ObservationMatrixList = () => {
  const [matrices, setMatrices] = useState<undefined | IObservationMatrix[]>();
  useEffect(() => {
    getObservationMatrices()
      .then(setMatrices)
      .catch();
  }, []);
  return matrices ? (
    <div className={styles.ObservationMatrixList}>
      {matrices.map(matrix => (
        <ObservationMatrixListItem key={matrix.id} {...matrix} />
      ))}
    </div>
  ) : null;
};

export { ObservationMatrixList };
