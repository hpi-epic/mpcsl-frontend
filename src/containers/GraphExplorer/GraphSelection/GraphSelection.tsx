import React, { useEffect, useState } from 'react';
import { Col, Row } from 'antd';
import { useParams } from 'react-router-dom';

import { GraphRenderer } from '../GraphRenderer/GraphRenderer';
import { GraphNodeList } from '../../../components/GraphNodeList/GraphNodeList';

import './GraphSelection.css';
import { GraphSingleton, GraphChanges } from '../../../graph/graph';

interface IMatchParams {
  resultId: string;
}

const GraphSelection = () => {
  const { resultId } = useParams<IMatchParams>();
  const [nodes, setNodes] = useState(GraphSingleton.nodes);
  useEffect(() => {
    GraphSingleton.fetchAvailableNodes(parseInt(resultId));
  }, [resultId]);
  useEffect(() => {
    const sub = GraphSingleton.subscribeToGraphChanges(e => {
      if (e === GraphChanges.NodesChanged) {
        setNodes(GraphSingleton.nodes);
      }
    });
    return () => sub.unsubscribe();
  }, []);
  return (
    <Row style={{ height: '100%' }}>
      <Col span={4} style={{ height: 'inherit' }}>
        <GraphNodeList
          nodes={nodes}
          onRemoveNode={GraphSingleton.removeNodeFromFocus}
          isSelectionMode={true}
        />
      </Col>
      <Col span={20} style={{ height: 'inherit' }}>
        <GraphRenderer showMenu={true} isSelectionMode={true} />
      </Col>
    </Row>
  );
};

export default GraphSelection;
