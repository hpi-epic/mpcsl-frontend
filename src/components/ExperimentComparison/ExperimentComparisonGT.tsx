import { Card, Collapse, Statistic, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { getGTComparisonStatistics } from '../../restAPI/apiRequests';
import { IAPIGraphNode } from '../../types/graphTypes';
import { IComparisonStatistics, IExperiment, IJob } from '../../types/types';
import { NewExperimentModalForm } from '../ExperimentsView/NewExperimentModal/NewExperimentModal';

export const ExperimentComparisonGT = (props: {
  job?: IJob;
  nodes?: IAPIGraphNode[];
  experiment?: IExperiment;
}) => {
  const { job, nodes, experiment } = props;
  const [groundTruthStatistics, setGroundTruthStatistics] = useState<
    IComparisonStatistics | undefined
  >();
  const [modalVisible, setModalVisible] = useState(false);
  useEffect(() => {
    if (job?.result) {
      getGTComparisonStatistics(job.result.id).then(result =>
        setGroundTruthStatistics(result ?? undefined)
      );
    }
  }, [job]);
  if (job && groundTruthStatistics) {
    const nodeDict: { [key: number]: string } = {};
    if (nodes) {
      nodes.forEach(node => {
        nodeDict[node.id] = node.name;
      });
    }
    return (
      <>
        <Card
          title={
            <div>
              {`${experiment?.name} compared to Ground Truth `}
              <Tooltip title="Show Experiment Details">
                <InfoCircleOutlined
                  onClick={e => {
                    e.stopPropagation();
                    setModalVisible(true);
                  }}
                  type="info-circle"
                />
              </Tooltip>
            </div>
          }
          extra={`Job ${job.id}`}
        >
          <Statistic
            title={'Graph Edit Distance'}
            value={groundTruthStatistics.graph_edit_distance}
          />
          <Statistic
            title={'Mean Jaccard Coefficient'}
            value={groundTruthStatistics.mean_jaccard_coefficient}
            precision={3}
          />
          <Collapse>
            <Collapse.Panel
              header={
                <Statistic
                  title={'True Positive Rate'}
                  value={groundTruthStatistics.error_types.true_positives.rate}
                  precision={3}
                />
              }
              key="1"
            >
              {groundTruthStatistics.error_types.true_positives.edges.map(
                edge => (
                  <span key={Math.random()}>
                    {nodeDict[edge[0]]} --&gt; {nodeDict[edge[1]]}
                    <br />
                  </span>
                )
              )}
            </Collapse.Panel>
            <Collapse.Panel
              header={
                <Statistic
                  title={'False Positive Rate'}
                  value={groundTruthStatistics.error_types.false_positives.rate}
                  precision={3}
                />
              }
              key="2"
            >
              {groundTruthStatistics.error_types.false_positives.edges.map(
                edge => (
                  <span key={Math.random()}>
                    {nodeDict[edge[0]]} --&gt; {nodeDict[edge[1]]}
                    <br />
                  </span>
                )
              )}
            </Collapse.Panel>
            <Collapse.Panel
              header={
                <Statistic
                  title={'True Negative Rate'}
                  value={groundTruthStatistics.error_types.true_negatives.rate}
                  precision={3}
                />
              }
              key="3"
            >
              {groundTruthStatistics.error_types.true_negatives.edges.map(
                edge => (
                  <span key={Math.random()}>
                    {nodeDict[edge[0]]} --&gt; {nodeDict[edge[1]]}
                    <br />
                  </span>
                )
              )}
            </Collapse.Panel>
            <Collapse.Panel
              header={
                <Statistic
                  title={'False Negative Rate'}
                  value={groundTruthStatistics.error_types.false_negatives.rate}
                  precision={3}
                />
              }
              key="4"
            >
              {groundTruthStatistics.error_types.false_negatives.edges.map(
                edge => (
                  <span key={Math.random()}>
                    {nodeDict[edge[0]]} --&gt; {nodeDict[edge[1]]}
                    <br />
                  </span>
                )
              )}
            </Collapse.Panel>
          </Collapse>
        </Card>
        <NewExperimentModalForm
          visible={modalVisible}
          datasetId={experiment?.dataset_id || 0}
          onClose={() => {
            setModalVisible(false);
          }}
          experiment={experiment}
          editDisabled={true}
        />
      </>
    );
  } else {
    return null;
  }
};
