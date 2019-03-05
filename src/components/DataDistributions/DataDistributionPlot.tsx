import React from 'react';
import ContinousPlot from './ContinousPlot';
import { IAPIDistribution } from '../../types';
import CategoricalPlot from './CategoricalPlot';

interface IDataDistributionPlotProps {
  plotWidth: number;
  plotHeight: number;
  data: IAPIDistribution;
  selectable: boolean;
  onDataSelection?: (
    data:
      | { [bin: string]: number }
      | { startSelection: number; endSelection: number },
  ) => void;
}

class DataDistributionPlot extends React.Component<
  IDataDistributionPlotProps,
  {}
> {
  public render() {
    if (this.props.data.categorical) {
      return (
        <CategoricalPlot
          selectable={this.props.selectable}
          data={this.props.data!}
          plotWidth={this.props.plotWidth}
          plotHeight={this.props.plotHeight}
          onDataSelection={
            this.props.onDataSelection ? this.props.onDataSelection : undefined
          }
        />
      );
    } else {
      return (
        <ContinousPlot
          selectable={this.props.selectable}
          data={this.props.data!}
          plotWidth={this.props.plotWidth}
          plotHeight={this.props.plotHeight}
          onDataSelection={
            this.props.onDataSelection ? this.props.onDataSelection : undefined
          }
        />
      );
    }
  }
}

export default DataDistributionPlot;
