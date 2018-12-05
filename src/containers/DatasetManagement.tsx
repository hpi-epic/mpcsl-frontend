import React from 'react';
import ListElementDataset from '../components/ListElementDataset/ListElementDataset';

class DatasetManagement extends React.Component {
  public render() {
    return (
      <div>
        <ListElementDataset title={'Dataset #1'} content={'TestContent Dataset'} />
      </div>
    );
  }
}

export default DatasetManagement;
