import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

const ExperimentComparison = ({
  match
}: RouteComponentProps<{ datasetId: string; experimentId: string }>) => (
  <div>Compare this {match.url}</div>
);

export { ExperimentComparison };
