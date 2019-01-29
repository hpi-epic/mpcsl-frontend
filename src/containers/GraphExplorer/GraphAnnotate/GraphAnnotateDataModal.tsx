import React from 'react';
import { Card } from 'antd';

interface IGraphAnnotateDataModalProps {
  visible: boolean;
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
    if (this.props.visible) {
      return (
        <div>
          <Card
            title='Data Distribution'
            style={{
              width: 300,
              bottom: 0,
              right: 0,
              position: 'fixed',
              margin: '10px',
            }}
          >
            <p>Card content</p>
            <p>Card content</p>
            <p>Card content</p>
          </Card>
        </div>
      );
    } else {
      return false;
    }
  }
}

export default GraphAnnotateDataModal;
