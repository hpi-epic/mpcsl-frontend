import React from 'react';
import {
  XYPlot,
  VerticalGridLines,
  HorizontalGridLines,
  XAxis,
  YAxis,
  VerticalBarSeries,
} from 'react-vis';

import 'react-vis/dist/style.css';
import { IAPIDistributionCategorical } from '../../types';

interface ICategoricalPlotProps {
  data: IAPIDistributionCategorical;
  plotWidth: number;
  plotHeight: number;
}

class CategoricalPlot extends React.Component<ICategoricalPlotProps, {}> {
  public render() {
    return (
      <div>
        <XYPlot
          xType='ordinal'
          width={this.props.plotWidth}
          height={this.props.plotHeight}
        >
          <VerticalGridLines />
          <HorizontalGridLines />
          <XAxis />
          <YAxis />
          <VerticalBarSeries
            opacity={0.8}
            style={{ stroke: '#fff' }}
            data={Object.keys(this.props.data.bins).map((key: string) => {
              return { x: key, y: this.props.data.bins[key] };
            })}
          />
        </XYPlot>
      </div>
    );
  }
}

export default CategoricalPlot;
