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
        <XYPlot width={this.props.plotWidth} height={this.props.plotHeight}>
          <VerticalGridLines />
          <HorizontalGridLines />
          <XAxis tickLabelAngle={-45} />
          <YAxis />
          <VerticalBarSeries
            opacity={0.8}
            style={{ stroke: '#fff' }}
            data={this.props.data.bins as any[]}
          />
        </XYPlot>
      </div>
    );
  }
}

export default CategoricalPlot;
