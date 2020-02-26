/* eslint-disable @typescript-eslint/ban-ts-ignore */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
  // @ts-ignore
  Highlight
} from 'react-vis';

import 'react-vis/dist/style.css';
import { IAPIDistributionCategorical } from '../../types/types';

interface ICategoricalPlotProps {
  data: IAPIDistributionCategorical;
  plotWidth: number;
  plotHeight: number;
  selectable: boolean;
  onDataSelection?: (data: { [bin: string]: number }) => void;
  selection?: ISelectedValues;
}

interface ISelectedValues {
  [bin: string]: number;
}

class CategoricalPlot extends React.Component<
  ICategoricalPlotProps,
  { value: any; selectedValues: ISelectedValues }
> {
  constructor(props: ICategoricalPlotProps) {
    super(props);
    let selectedValues = {};

    if (this.props.selection) {
      selectedValues = props.selection as ISelectedValues;
    }

    this.state = {
      value: undefined,
      selectedValues
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
        count: value.y
      };
    });

    return (
      <div>
        <XYPlot
          xType="ordinal"
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
            colorType="literal"
            getColor={d => {
              if (Object.keys(this.state.selectedValues).length === 0) {
                return '#1e96be';
              } else if (d.x in this.state.selectedValues) {
                return '#1e96be';
              } else {
                return '#c7c7c7';
              }
            }}
            onValueClick={(d: any) => {
              if (this.props.selectable) {
                const { selectedValues } = this.state;
                if (d.x in selectedValues) {
                  delete selectedValues[d.x];
                } else {
                  selectedValues[d.x] = d.y;
                }
                this.setState({
                  selectedValues
                });

                if (this.props.onDataSelection) {
                  this.props.onDataSelection(selectedValues);
                }
              }
            }}
          />
          {this.state.value ? <Hint value={this.state.value} /> : false}
        </XYPlot>
      </div>
    );
  }

  private onHover = (value: any) => {
    this.setState({ value });
  };
}

export default CategoricalPlot;
