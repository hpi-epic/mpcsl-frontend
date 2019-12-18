import React, { useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { getExperiments } from '../../actions/apiRequests';
import { IExperiment } from '../../types';

const ExperimentsListItem = (props: IExperiment) => {
  return <p>{props.name}</p>;
};

const ExperimentsList = () => {
  const match = useRouteMatch<{ id: string }>('/:id/experiments');
  const [experiments, setExperiments] = useState<undefined | IExperiment[]>();
  useEffect(() => {
    if (match) {
      getExperiments()
        .then(setExperiments)
        .catch();
    }
  }, [match]);
  if (!match) {
    return <h1>404</h1>;
  }
  if (!experiments) {
    return <p>Error loading experiments</p>;
  }
  return (
    <div>
      {experiments.map(experiment => (
        <ExperimentsListItem key={experiment.id} {...experiment} />
      ))}
    </div>
  );
};

export { ExperimentsList };
