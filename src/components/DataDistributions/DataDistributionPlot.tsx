import React from 'react';
import ContinousPlot from './ContinousPlot';
import { IAPIDistribution } from '../../types/types';
import CategoricalPlot from './CategoricalPlot';

interface IDataDistributionPlotProps {
  plotWidth: number;
  plotHeight: number;
  data: IAPIDistribution;
  selectable: boolean;
  onDataSelection?: (
    data:
      | { [bin: string]: number }
      | { startSelection: number; endSelection: number }
  ) => void;
  selection?: IDataSelection;
}

export type IDataSelection =
  | { [bin: string]: number }
  | { startSelection: number; endSelection: number };

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
          selection={this.props.selection}
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
          selection={
            this.props.selection as {
              startSelection: number;
              endSelection: number;
            }
          }
        />
      );
    }
  }
}

export default DataDistributionPlot;
