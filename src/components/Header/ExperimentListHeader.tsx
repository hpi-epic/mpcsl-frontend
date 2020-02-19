import { Icon, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import 'react-select/dist/react-select.css';
import 'react-virtualized-select/styles.css';
import 'react-virtualized/styles.css';
import { getObservationMatrixMetadata } from '../../restAPI/apiRequests';
import { NewExperimentButton } from '../ExperimentsView/ExperimentsView';

export const ExperimentsListHeader = (
  props: RouteComponentProps<{ datasetId: string }>
) => {
  const { datasetId } = props.match.params;
  const [isGroundTruth, setIsGroundTruth] = useState<boolean | undefined>();
  useEffect(() => {
    if (datasetId) {
      getObservationMatrixMetadata(parseInt(datasetId)).then(val =>
        setIsGroundTruth(val.has_ground_truth)
      );
    } else {
      setIsGroundTruth(undefined);
    }
  }, [datasetId]);
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {isGroundTruth ? (
        <Tooltip title="Observation Matrix has Ground Truth Graph">
          <Icon
            type="check-circle"
            theme="twoTone"
            style={{ marginRight: 10, fontSize: 20 }}
            twoToneColor="#52c41a"
          />
        </Tooltip>
      ) : null}
      <NewExperimentButton {...props} />
    </div>
  );
};
