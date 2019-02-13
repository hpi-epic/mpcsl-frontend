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
import { IDistributionPlotProps } from './DataDistributionPlot';

interface ICategoricalPlotProps extends IDistributionPlotProps {
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
            onNearestX={(value: any, event: any) => {
              this.props.onHover(
                {
                  x: Number(parseFloat(String(value.x)).toFixed(1)),
                  y: Number(value.y),
                },
                event,
              );
            }}
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
