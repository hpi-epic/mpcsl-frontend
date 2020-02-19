import React from 'react';
import renderer from 'react-test-renderer';
import DataDistributionPlot from './DataDistributionPlot';
import { IAPIDistributionCategorical } from '../../types/types';

describe('<DataDistributinoPlot />', () => {
  it('works for categorical data', () => {
    const categoricalAPIDataDistribution = {
      categorical: true,
      bins: {
        1: 10
      }
    };
    const tree = renderer
      .create(
        <DataDistributionPlot
          plotHeight={100}
          plotWidth={100}
          selectable={true}
          data={
            (categoricalAPIDataDistribution as unknown) as IAPIDistributionCategorical
          }
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('works for continous data', () => {
    const categoricalAPIDataDistribution = {
      categorical: false,
      bin_edges: [1, 2, 3, 4],
      bins: [10, 2, 5, 5]
    };
    const tree = renderer
      .create(
        <DataDistributionPlot
          selectable={true}
          plotHeight={100}
          plotWidth={100}
          data={
            (categoricalAPIDataDistribution as unknown) as IAPIDistributionCategorical
          }
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
