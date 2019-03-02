import React from 'react';
import { Mosaic } from 'react-mosaic-component';

import 'react-mosaic-component/react-mosaic-component.css';
import GraphRenderer from '../GraphRenderer/GraphRenderer';

import './GraphCausalExplorer.css';

const ELEMENT_MAP: { [viewId: string]: JSX.Element } = {
  a: <div>Left Window</div>,
  b: <GraphRenderer key='test' isSelectionMode={false} />,
  c: <div>Bottom Left Window</div>,
  d: <div>Bottom Right Window</div>,
};

class GraphCausalExplorer extends React.Component {
  public render() {
    return (
      <div style={{ width: '100%', height: '100%', margin: 0 }}>
        <Mosaic<string>
          renderTile={(id) => ELEMENT_MAP[id]}
          initialValue={{
            direction: 'row',
            first: 'a',
            second: {
              direction: 'column',
              first: 'b',
              second: {
                direction: 'row',
                first: 'c',
                second: 'd',
              },
              splitPercentage: 70,
            },
            splitPercentage: 25,
          }}
        />
      </div>
    );
  }
}

export default GraphCausalExplorer;
