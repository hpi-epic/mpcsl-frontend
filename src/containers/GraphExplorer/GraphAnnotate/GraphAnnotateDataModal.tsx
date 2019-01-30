import React from 'react';
import { Card } from 'antd';
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

interface IGraphAnnotateDataModalProps {
  visible: boolean;
  data: IAPIDistribution | undefined;
}

interface IGraphAnnotateDataModalState {
  crosshairValues: Array<{ x: number; y: number }>;
}

class GraphAnnotateDataModal extends React.Component<
  IGraphAnnotateDataModalProps,
  IGraphAnnotateDataModalState
> {
  constructor(props: IGraphAnnotateDataModalProps) {
    super(props);

    this.state = {
      crosshairValues: [],
    };
  }

  public componentDidMount = () => {};

  public componentWillUnmount = () => {};

  public render() {
    if (this.props.visible && this.props.data) {
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
          <Card
            title={`Node: ${this.props.data!.node.name}`}
            style={{
              width: 300,
              bottom: 0,
              right: 0,
              position: 'fixed',
              margin: '10px',
            }}
          >
            <div>
              <XYPlot
                width={250}
                height={150}
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
                  data={this.props.data.bins.map(
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
          </Card>
        </div>
      );
    } else {
      return false;
    }
  }
}

export default GraphAnnotateDataModal;
