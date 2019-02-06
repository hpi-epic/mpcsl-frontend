import React from 'react';
import { Card, Button, Divider, Table } from 'antd';
import { IAPIDistribution } from '../../../types';

import 'react-vis/dist/style.css';
import './GraphAnnotate.css';

import GraphAnnotateDataPlot from './GraphAnnotateDataPlot';

interface IGraphAnnotateDataModalProps {
  visible: boolean;
  data: IAPIDistribution | undefined;
  onClose: () => void;
}

interface IGraphAnnotateDataModalState {
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
      cardWidth: 300,
      cardHeight: 280,
      plotWidth: 250,
      plotHeight: 150,
      expanded: false,
    };
  }

  public render() {
    if (this.props.visible && this.props.data) {
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
              <GraphAnnotateDataPlot
                data={this.props.data!}
                plotWidth={this.state.plotWidth}
                plotHeight={this.state.plotHeight}
              />
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
