import React from 'react';
import {
  XYPlot,
  VerticalGridLines,
  HorizontalGridLines,
  XAxis,
  YAxis,
  VerticalRectSeries,
  Hint,
  // @ts-ignore
  Highlight,
} from 'react-vis';

import 'react-vis/dist/style.css';
import { IAPIDistributionContinous } from '../../types';

interface IContinousPlotProps {
  data: IAPIDistributionContinous | undefined;
  plotWidth: number;
  plotHeight: number;
  selectable: boolean;
  onDataSelection?: (
    data: { selectionStart: number; selectionEnd: number },
  ) => void;
}

interface IContinousPlotState {
  value: any;
  selectionStart: any;
  selectionEnd: any;
}

class ContinousPlot extends React.Component<
  IContinousPlotProps,
  IContinousPlotState
> {
  constructor(props: IContinousPlotProps) {
    super(props);

    this.state = {
      value: undefined,
      selectionStart: undefined,
      selectionEnd: undefined,
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

    const updateDragState = (area: any) => {
      this.setState({
        selectionStart: area && area.left,
        selectionEnd: area && area.right,
      });
    };

    const updateDragStateEnd = (area: any) => {
      this.setState({
        selectionStart: area && area.left,
        selectionEnd: area && area.right,
      });
      if (this.props.onDataSelection) {
        this.props.onDataSelection({
          selectionStart: area && area.left,
          selectionEnd: area && area.right,
        });
      }
    };

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
            colorType='literal'
            getColor={(d) => {
              if (
                this.state.selectionStart === null ||
                this.state.selectionEnd === null
              ) {
                return '#1e96be';
              }
              const inX =
                d.x >= this.state.selectionStart &&
                d.x <= this.state.selectionEnd;
              const inX0 =
                d.x0 >= this.state.selectionStart &&
                d.x0 <= this.state.selectionEnd;
              const inStart =
                this.state.selectionStart >= d.x0 &&
                this.state.selectionStart <= d.x;
              const inEnd =
                this.state.selectionEnd >= d.x0 &&
                this.state.selectionEnd <= d.x;

              return inStart || inEnd || inX || inX0 ? '#1e96be' : '#1c7c7c7';
            }}
          />
          {this.props.selectable ? (
            <Highlight
              color='#829AE3'
              drag={true}
              enableY={false}
              onDrag={updateDragState}
              onDragEnd={updateDragStateEnd}
            />
          ) : null}
          {this.state.value ? <Hint value={this.state.value} /> : false}
        </XYPlot>
        {this.props.selectable ? (
          <div>
            <b>selectionStart:</b>{' '}
            {`${Math.floor(this.state.selectionStart * 100) / 100},`}
            <b>selectionEnd:</b>{' '}
            {`${Math.floor(this.state.selectionEnd * 100) / 100},`}
          </div>
        ) : null}
      </div>
    );
  }

  private onHover = (value: any) => {
    this.setState({ value });
  }
}

export default ContinousPlot;
