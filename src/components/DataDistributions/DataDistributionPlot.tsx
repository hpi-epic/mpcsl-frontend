import React from 'react';
import ContinousPlot from './ContinousPlot';
import { IAPIDistribution } from '../../types';
import CategoricalPlot from './CategoricalPlot';

interface IDataDistributionPlotProps {
  plotWidth: number;
  plotHeight: number;
  data: IAPIDistribution;
}

class DataDistributionPlot extends React.Component<
  IDataDistributionPlotProps,
  {}
> {
  public render() {
    if (this.props.data.categorical) {
      return (
        <CategoricalPlot
          data={this.props.data!}
          plotWidth={this.props.plotWidth}
          plotHeight={this.props.plotHeight}
        />
      );
    } else {
      return (
        <ContinousPlot
          data={this.props.data!}
          plotWidth={this.props.plotWidth}
          plotHeight={this.props.plotHeight}
        />
      );
    }
  }
}

export default DataDistributionPlot;
