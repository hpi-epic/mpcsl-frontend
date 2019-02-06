import React from 'react';
import { IAPIDistribution } from '../../../types';
import {
  XYPlot,
  VerticalGridLines,
  HorizontalGridLines,
  XAxis,
  YAxis,
  VerticalRectSeries,
} from 'react-vis';

import 'react-vis/dist/style.css';
import './GraphAnnotate.css';

interface IGraphAnnotateDataPlotProps {
  data: IAPIDistribution | undefined;
  plotWidth: number;
  plotHeight: number;
}

interface IGraphAnnotateDataPlotState {
  crosshairValues: Array<{ x: number; y: number }>;
}

class GraphAnnotateDataPlot extends React.Component<
  IGraphAnnotateDataPlotProps,
  IGraphAnnotateDataPlotState
  > {
  constructor(props: IGraphAnnotateDataPlotProps) {
    super(props);

    this.state = {
      crosshairValues: [],
    };
  }

  public render() {
    const ticks: number[] = [];
    for (let i = 0; i < this.props.data!.bin_edges.length - 1; i++) {
      ticks.push(
        (this.props.data!.bin_edges[i + 1] + this.props.data!.bin_edges[i]) /
        2,
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
            this.props.data!.bin_edges[
            this.props.data!.bin_edges.length - 1
            ],
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
            onNearestX={(value) =>
              this.setState({
                crosshairValues: [
                  {
                    x: Number(parseFloat(String(value.x)).toFixed(1)),
                    y: Number(value.y),
                  },
                ],
              })
            }
            opacity={0.8}
            style={{ stroke: '#fff' }}
            data={this.props.data!.bins.map(
              (value: number, index: number) => {
                return {
                  x0: this.props.data!.bin_edges[index],
                  x: this.props.data!.bin_edges[index + 1],
                  y: value,
                  y0: 0,
                };
              },
            )}
          />
        </XYPlot>
      </div>
    );
  }
}

export default GraphAnnotateDataPlot;
