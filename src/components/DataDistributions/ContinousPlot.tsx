import React from 'react';
import {
  XYPlot,
  VerticalGridLines,
  HorizontalGridLines,
  XAxis,
  YAxis,
  VerticalRectSeries,
} from 'react-vis';

import 'react-vis/dist/style.css';
import { IAPIDistributionContinous } from '../../types';
import { IDistributionPlotProps } from './DataDistributionPlot';

interface IContinousPlotProps extends IDistributionPlotProps {
  data: IAPIDistributionContinous | undefined;
  plotWidth: number;
  plotHeight: number;
}

interface IContinousPlotState {
  crosshairValues: Array<{ x: number; y: number }>;
}

class ContinousPlot extends React.Component<
  IContinousPlotProps,
  IContinousPlotState
> {
  constructor(props: IContinousPlotProps) {
    super(props);

    this.state = {
      crosshairValues: [],
    };
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
          onMouseLeave={() => this.setState({ crosshairValues: [] })}
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
            onNearestX={(value: any, event: any) => {
              this.props.onHover(
                {
                  x: Number(parseFloat(String(value.x)).toFixed(1)),
                  x0: Number(parseFloat(String(value.x0)).toFixed(1)),
                  y: Number(value.y),
                },
                event,
              );
            }}
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
        </XYPlot>
      </div>
    );
  }
}

export default ContinousPlot;
