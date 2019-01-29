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

interface IGraphAnnotateDataModalProps {
  visible: boolean;
  data: IAPIDistribution | undefined;
}

class GraphAnnotateDataModal extends React.Component<
  IGraphAnnotateDataModalProps,
  {}
> {
  constructor(props: IGraphAnnotateDataModalProps) {
    super(props);
  }

  public componentDidMount = () => {};

  public componentWillUnmount = () => {};

  public render() {
    if (this.props.visible && this.props.data) {
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
                height={300}
                xDomain={[
                  this.props.data!.bin_edges[0],
                  this.props.data!.bin_edges[
                    this.props.data!.bin_edges.length - 1
                  ],
                ]}
              >
                <VerticalGridLines />
                <HorizontalGridLines />
                <XAxis />
                <YAxis />
                <VerticalRectSeries
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
