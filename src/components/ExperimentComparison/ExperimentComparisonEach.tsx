import { Card, Collapse, Empty, Statistic } from 'antd';
import React, { useEffect, useState } from 'react';
import { getComparisonStatistics } from '../../restAPI/apiRequests';
import { IAPIGraphNode } from '../../types/graphTypes';
import { IComparisonStatistics, IJob } from '../../types/types';

export const ExperimentComparisonEach = (props: {
  jobOne: IJob | undefined;
  jobTwo: IJob | undefined;
  nodes: IAPIGraphNode[] | undefined;
}) => {
  const { jobOne, jobTwo, nodes } = props;
  const [comparison, setComparison] = useState<
    undefined | IComparisonStatistics
  >();
  const nodeDict: { [key: number]: string } = {};
  if (nodes) {
    nodes.forEach(node => {
      nodeDict[node.id] = node.name;
    });
  }
  useEffect(() => {
    if (jobOne && jobOne.result && jobTwo && jobTwo.result) {
      getComparisonStatistics(jobOne.result.id, jobTwo.result.id).then(
        setComparison
      );
    }
  }, [jobOne, jobTwo]);
  if (!comparison) {
    return <Empty description="Select a Second Job"></Empty>;
  }
  if (!jobOne?.result || !jobTwo?.result) {
    return <Empty description="No results "></Empty>;
  }
  return (
    <Card
      title={`Job ${jobOne.id} as Ground Truth compared to Job ${jobTwo.id}`}
      extra="Comparison"
    >
      <Statistic
        title={'Graph Edit Distance'}
        value={comparison.graph_edit_distance}
      />
      <Statistic
        title={'Mean Jaccard Coefficient'}
        value={comparison.mean_jaccard_coefficient}
        precision={3}
      />
      <Collapse>
        <Collapse.Panel
          header={
            <Statistic
              title={`Edges in Job ${jobTwo.id} that also exist in Job ${jobOne.id}`}
              prefix="Rate: "
              value={comparison.error_types.true_positives.rate}
              precision={3}
            />
          }
          key="1"
        >
          {comparison.error_types.true_positives.edges.map(edge => (
            <span key={Math.random()}>
              {nodeDict[edge[0]]} --&gt; {nodeDict[edge[1]]}
              <br />
            </span>
          ))}
        </Collapse.Panel>
        <Collapse.Panel
          header={
            <Statistic
              title={`Edges in Job ${jobTwo.id} that do not exist in Job ${jobOne.id}`}
              prefix="Rate: "
              value={comparison.error_types.false_positives.rate}
              precision={3}
            />
          }
          key="2"
        >
          {comparison.error_types.false_positives.edges.map(edge => (
            <span key={Math.random()}>
              {nodeDict[edge[0]]} --&gt; {nodeDict[edge[1]]}
              <br />
            </span>
          ))}
        </Collapse.Panel>
        <Collapse.Panel
          header={
            <Statistic
              title={`Edges not existing in Job ${jobTwo.id} that do not exist in Job ${jobOne.id}`}
              prefix="Rate: "
              value={comparison.error_types.true_negatives.rate}
              precision={3}
            />
          }
          key="3"
        >
          {comparison.error_types.true_negatives.edges.map(edge => (
            <span key={Math.random()}>
              {nodeDict[edge[0]]} --&gt; {nodeDict[edge[1]]}
              <br />
            </span>
          ))}
        </Collapse.Panel>
        <Collapse.Panel
          header={
            <Statistic
              title={`Edges not existing in Job ${jobTwo.id} that do exist in Job ${jobOne.id}`}
              prefix="Rate: "
              value={comparison.error_types.false_negatives.rate}
              precision={3}
            />
          }
          key="4"
        >
          {comparison.error_types.false_negatives.edges.map(edge => (
            <span key={Math.random()}>
              {nodeDict[edge[0]]} --&gt; {nodeDict[edge[1]]}
              <br />
            </span>
          ))}
        </Collapse.Panel>
      </Collapse>
    </Card>
  );
};
