import React from 'react';
import {
  XYPlot,
  VerticalGridLines,
  HorizontalGridLines,
  XAxis,
  YAxis,
  VerticalRectSeries,
  Hint,
} from 'react-vis';

import 'react-vis/dist/style.css';
import { IAPIDistributionContinous } from '../../types';

interface IContinousPlotProps {
  data: IAPIDistributionContinous | undefined;
  plotWidth: number;
  plotHeight: number;
}

interface IContinousPlotState {
  value: any;
}

class ContinousPlot extends React.Component<
  IContinousPlotProps,
  IContinousPlotState
> {
  constructor(props: IContinousPlotProps) {
    super(props);

    this.state = { value: undefined };
  }

  public render() {
    const ticks: number[] = [];
    for (let i = 0; i < this.props.data!.bin_edges.length - 1; i++) {
      ticks.push(
        (this.props.data!.bin_edges[i + 1] + this.props.data!.bin_edges[i]) / 2,
      );
    }

    const maxYValue = Math.max(...this.props.data!.bins);
    return (
      <div>
        <XYPlot
          width={this.props.plotWidth}
          height={this.props.plotHeight}
          onMouseLeave={() => this.setState({ value: undefined })}
          xDomain={[
            this.props.data!.bin_edges[0],
            this.props.data!.bin_edges[this.props.data!.bin_edges.length - 1],
          ]}
          yDomain={[0, maxYValue + 0.1 * maxYValue]}
        >
          <VerticalGridLines />
          <HorizontalGridLines />
          <XAxis
            tickValues={ticks}
            tickFormat={(v) => parseFloat(v).toFixed(1)}
            tickLabelAngle={-45}
          />
          <YAxis />
          <VerticalRectSeries
            onNearestX={this.onHover}
            opacity={0.8}
            style={{ stroke: '#fff' }}
            data={this.props.data!.bins.map((value: number, index: number) => {
              return {
                x0: this.props.data!.bin_edges[index],
                x: this.props.data!.bin_edges[index + 1],
                y: value,
                y0: 0,
              };
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

export default ContinousPlot;
