import React from 'react';
import {
  XYPlot,
  VerticalGridLines,
  HorizontalGridLines,
  XAxis,
  YAxis,
  VerticalBarSeries,
  Hint,
  // @ts-ignore
  ChartLabel,
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
    this.state = {
      value: undefined,
    };
  }

  public render() {
    let count = 0;
    let data = Object.keys(this.props.data.bins).map((key: string) => {
      count += this.props.data.bins[key];
      return { x: key, y: this.props.data.bins[key] };
    });
    data = data.map((value: { x: string; y: number }) => {
      return {
        x: value.x,
        y: Number(((value.y / count) * 100).toFixed(1)),
        count: value.y,
      };
    });

    return (
      <div>
        <XYPlot
          xType='ordinal'
          width={this.props.plotWidth}
          height={this.props.plotHeight}
          onMouseLeave={() => this.setState({ value: undefined })}
          yDomain={[0, 100]}
        >
          <VerticalGridLines />
          <HorizontalGridLines />
          <XAxis />
          <YAxis tickFormat={(v: string) => `${v}%`} />
          <VerticalBarSeries
            onNearestX={this.onHover}
            opacity={0.8}
            style={{ stroke: '#fff' }}
            data={data}
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
