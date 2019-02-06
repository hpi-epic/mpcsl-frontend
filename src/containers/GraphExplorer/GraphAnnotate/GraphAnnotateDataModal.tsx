import React from 'react';
import { Card, Button, Divider, Table } from 'antd';
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

interface IGraphAnnotateDataModalProps {
  visible: boolean;
  data: IAPIDistribution | undefined;
  onClose: () => void;
}

interface IGraphAnnotateDataModalState {
  crosshairValues: Array<{ x: number; y: number }>;
  cardWidth: number;
  cardHeight: number;
  plotWidth: number;
  plotHeight: number;
  expanded: boolean;
}

class GraphAnnotateDataModal extends React.Component<
  IGraphAnnotateDataModalProps,
  IGraphAnnotateDataModalState
  > {
  constructor(props: IGraphAnnotateDataModalProps) {
    super(props);

    this.state = {
      crosshairValues: [],
      cardWidth: 300,
      cardHeight: 280,
      plotWidth: 250,
      plotHeight: 150,
      expanded: false,
    };
  }

  public componentDidMount = () => { };

  public componentWillUnmount = () => { };

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
      const columns = [{
        title: 'Dataset name',
        dataIndex: 'datasetname',
        key: 'datasetname',
      },
      {
        title: 'Remote DB',
        dataIndex: 'remoteDB',
        key: 'remoteDB',
      }];
      const tableData = [{
        key: '1',
        datasetname: this.props.data.dataset.name,
        remoteDB: this.props.data.dataset.remote_db,
      }];
      return (
        <div>
          <Card
            title={`Node: ${this.props.data!.node.name}`}
            style={{
              width: this.state.cardWidth,
              height: this.state.cardHeight,
              bottom: 0,
              right: 0,
              position: 'fixed',
              margin: '10px',
            }}
            extra={
              <div>
                {this.state.expanded ?
                  <Button
                    onClick={() => this.showLess()}
                    icon='fullscreen-exit'
                  /> :
                  <Button
                    onClick={() => this.showMore()}
                    icon='fullscreen'
                  />}
                <Button
                  onClick={() => { this.showLess(); this.props.onClose(); }}
                  icon='close'
                />
              </div>
            }
          >
            <div>
              <XYPlot
                width={this.state.plotWidth}
                height={this.state.plotHeight}
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
            {this.state.expanded ?
              <div>
                <Divider />
                <Table columns={columns} dataSource={tableData} size='small' pagination={false} />
              </div>
            : ''}
          </Card>
        </div>
      );
    } else {
      return false;
    }
  }

  private showMore = () => {
    this.setState({
      cardWidth: 500,
      cardHeight: 600,
      plotWidth: 450,
      plotHeight: 350,
      expanded: true,
    });
  }

  private showLess = () => {
    this.setState({
      cardWidth: 300,
      cardHeight: 280,
      plotWidth: 250,
      plotHeight: 150,
      expanded: false,
    });
  }
}

export default GraphAnnotateDataModal;
