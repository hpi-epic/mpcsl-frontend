import React from 'react';
import { Card } from 'antd';

class GraphAnnotateDataModal extends React.Component<
  {}, {}
  > {
  constructor(props: {}) {
    super(props);
  }

  public componentDidMount = () => {
  }

  public componentWillUnmount = () => {
  }

  public render() {
    return (
      <div>
        <Card
          title='Data Distribution'
          style={{ width: 300, bottom: 0, right: 0, position: 'fixed', margin: '10px' }}
        >
          <p>Card content</p>
          <p>Card content</p>
          <p>Card content</p>

        </Card>
      </div>
    );
  }

}

export default GraphAnnotateDataModal;
