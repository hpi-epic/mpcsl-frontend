import React from 'react';
import { Mosaic } from 'react-mosaic-component';

import 'react-mosaic-component/react-mosaic-component.css';
import GraphRenderer from '../GraphRenderer/GraphRenderer';

import './GraphCausalExplorer.css';

class GraphCausalExplorer extends React.Component {
  public render() {
    const elementMap: { [viewId: string]: JSX.Element } = {
      externFactors: <div>Extern Factors</div>,
      externFactorsDistribution: <div>Extern Factors Distribution</div>,
      renderer: (
        <div style={{ overflow: 'hidden' }}>
          <GraphRenderer key='test' isSelectionMode={false} showMenu={false} />
        </div>
      ),
      firstConditionNode: <div>First Condition Node</div>,
      exploreNode: <div>Exploration Node</div>,
    };

    return (
      <div style={{ width: '100%', height: '100%', margin: 0 }}>
        <Mosaic<string>
          renderTile={(id) => elementMap[id]}
          initialValue={{
            direction: 'row',
            first: {
              direction: 'column',
              first: 'externFactors',
              second: 'externFactorsDistribution',
              splitPercentage: 70,
            },
            second: {
              direction: 'column',
              first: 'renderer',
              second: {
                direction: 'row',
                first: 'firstConditionNode',
                second: 'exploreNode',
              },
              splitPercentage: 70,
            },
            splitPercentage: 20,
          }}
        />
      </div>
    );
  }
}

export default GraphCausalExplorer;
