import React from 'react';
import {
  XYPlot,
  VerticalGridLines,
  HorizontalGridLines,
  XAxis,
  YAxis,
  VerticalBarSeries,
  Hint,
} from 'react-vis';

import 'react-vis/dist/style.css';
import { IAPIDistributionCategorical } from '../../types';

interface ICategoricalPlotProps {
  data: IAPIDistributionCategorical;
  plotWidth: number;
  plotHeight: number;
}

class CategoricalPlot extends React.Component<
  ICategoricalPlotProps,
  { value: any }
> {
  constructor(props: ICategoricalPlotProps) {
    super(props);
    this.state = { value: undefined };
  }

  public render() {
    return (
      <div>
        <XYPlot
          xType='ordinal'
          width={this.props.plotWidth}
          height={this.props.plotHeight}
          onMouseLeave={() => this.setState({ value: undefined })}
        >
          <VerticalGridLines />
          <HorizontalGridLines />
          <XAxis />
          <YAxis />
          <VerticalBarSeries
            onNearestX={this.onHover}
            opacity={0.8}
            style={{ stroke: '#fff' }}
            data={Object.keys(this.props.data.bins).map((key: string) => {
              return { x: key, y: this.props.data.bins[key] };
            })}
          />
          {this.state.value ? <Hint value={this.state.value} /> : false}
        </XYPlot>
      </div>
    );
  }

  private onHover = (value: any) => {
    this.setState({ value });
  }
}

export default CategoricalPlot;
