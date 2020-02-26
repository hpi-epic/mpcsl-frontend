import React from 'react';
import { Card, Button, Divider, Table } from 'antd';
import { IAPIDistribution } from '../../types/types';

import 'react-vis/dist/style.css';
import DataDistributionPlot from '../DataDistributions/DataDistributionPlot';

interface IGraphDataModalProps {
  visible: boolean;
  data: IAPIDistribution | undefined;
  onClose: () => void;
  position: { bottom: number; right: number; type: 'fixed' | 'absolute' };
  resizable: boolean;
}

interface IGraphDataModalState {
  cardWidth: number;
  cardHeight: number;
  plotWidth: number;
  plotHeight: number;
  expanded: boolean;
}

class GraphDataModal extends React.Component<
  IGraphDataModalProps,
  IGraphDataModalState
> {
  constructor(props: IGraphDataModalProps) {
    super(props);

    this.state = {
      cardWidth: 300,
      cardHeight: 280,
      plotWidth: 250,
      plotHeight: 150,
      expanded: false
    };
  }

  public render() {
    if (this.props.visible && this.props.data) {
      const columns = [
        {
          title: 'Dataset Name',
          dataIndex: 'datasetname',
          key: 'datasetname'
        },
        {
          title: 'Data Source (DB)',
          dataIndex: 'dataSource',
          key: 'dataSource'
        }
      ];
      const tableData = [
        {
          key: '1',
          datasetname: this.props.data.dataset.name,
          dataSource: this.props.data.dataset.data_source
        }
      ];
      return (
        <div
          style={{
            bottom: this.props.position.bottom,
            right: this.props.position.right,
            position: this.props.position.type,
            margin: '10px'
          }}
        >
          <Card
            title={`Node: ${this.props.data!.node.name}`}
            style={{
              width: this.state.cardWidth,
              height: this.state.cardHeight
            }}
            extra={
              <div>
                {this.props.resizable ? (
                  this.state.expanded ? (
                    <Button
                      onClick={() => this.showLess()}
                      icon="fullscreen-exit"
                    />
                  ) : (
                    <Button onClick={() => this.showMore()} icon="fullscreen" />
                  )
                ) : null}
                <Button
                  onClick={() => {
                    this.showLess();
                    this.props.onClose();
                  }}
                  icon="close"
                />
              </div>
            }
          >
            <div>
              <DataDistributionPlot
                selectable={false}
                plotWidth={this.state.plotWidth}
                plotHeight={this.state.plotHeight}
                data={this.props.data!}
              />
            </div>
            {this.state.expanded ? (
              <div>
                <Divider />
                <Table
                  columns={columns}
                  dataSource={tableData}
                  size="small"
                  pagination={false}
                />
              </div>
            ) : (
              ''
            )}
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
      expanded: true
    });
  };

  private showLess = () => {
    this.setState({
      cardWidth: 300,
      cardHeight: 280,
      plotWidth: 250,
      plotHeight: 150,
      expanded: false
    });
  };
}

export default GraphDataModal;
