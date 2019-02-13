import React from 'react';
import ContinousPlot from './ContinousPlot';
import { IAPIDistribution } from '../../types';
import CategoricalPlot from './CategoricalPlot';
import { Row } from 'antd';

interface IDataDistributionPlotProps {
  plotWidth: number;
  plotHeight: number;
  data: IAPIDistribution;
}

interface IDataDistributionPlotState {
  hoverData: { x: number; y: number; x0?: number } | undefined;
}

export interface IDistributionPlotProps {
  onHover: (values: { x: number; y: number; x0?: number }, event: any) => void;
}

class DataDistributionPlot extends React.Component<
  IDataDistributionPlotProps,
  IDataDistributionPlotState
> {
  constructor(props: IDataDistributionPlotProps) {
    super(props);

    this.state = {
      hoverData: undefined,
    };
  }

  public render() {
    if (this.props.data.categorical) {
      return (
        <React.Fragment>
          {this.state.hoverData ? (
            <Row>
              {this.state.hoverData!.x} : {this.state.hoverData!.y}
            </Row>
          ) : (
            <Row />
          )}
          <CategoricalPlot
            onHover={this.onHover}
            data={this.props.data!}
            plotWidth={this.props.plotWidth}
            plotHeight={this.props.plotHeight}
          />
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          {this.state.hoverData ? (
            <Row>
              {this.state.hoverData!.x} - {this.state.hoverData!.x0} :
              {this.state.hoverData!.y}
            </Row>
          ) : (
            <Row />
          )}
          <ContinousPlot
            onHover={this.onHover}
            data={this.props.data!}
            plotWidth={this.props.plotWidth}
            plotHeight={this.props.plotHeight}
          />
        </React.Fragment>
      );
    }
  }

  private onHover = (v: { x: number; y: number; x0?: number }, event: any) => {
    this.setState({
      hoverData: v,
    });
  }
}

export default DataDistributionPlot;
