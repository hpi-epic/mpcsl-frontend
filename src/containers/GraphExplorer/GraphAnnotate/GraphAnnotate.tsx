import React, { useState, useEffect, useCallback } from 'react';

import { GraphRenderer } from '../GraphRenderer/GraphRenderer';
import { GraphNodeList } from '../../../components/GraphNodeList/GraphNodeList';

import { Row, Col } from 'antd';

import { ID3GraphNode } from '../../../types/graphTypes';
import { IAPIDistribution } from '../../../types';
import { getNodeDataDistribution } from '../../../actions/apiRequests';
import GraphDataModal from '../GraphDataModal';
import { GraphSingleton, GraphChanges } from '../../../graph/graph';
import { filter } from 'rxjs/operators';

const GraphAnnotate = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDistribution, setSelectedDistribution] = useState<
    IAPIDistribution | undefined
  >();
  const [nodes, setNodes] = useState(GraphSingleton.nodes);
  const showDataModal = useCallback(
    async (node: ID3GraphNode) => {
      const nodeDistribution = await getNodeDataDistribution(node.id);
      setSelectedDistribution(nodeDistribution);
      setModalVisible(true);
    },
    [setSelectedDistribution, setModalVisible]
  );
  useEffect(() => {
    const sub = GraphSingleton.subject
      .pipe(filter(e => e === GraphChanges.NodesChanged))
      .subscribe(() => setNodes(GraphSingleton.nodes));
    return () => sub.unsubscribe();
  }, []);
  return (
    <Row style={{ height: '100%' }}>
      <Col span={4} style={{ height: 'inherit' }}>
        <GraphNodeList
          nodes={nodes}
          onNodeClick={showDataModal}
          isSelectionMode={false}
        />
      </Col>
      <Col span={20} style={{ height: 'inherit' }}>
        <GraphDataModal
          resizable={true}
          visible={modalVisible}
          data={selectedDistribution}
          onClose={() => setModalVisible(false)}
          position={{ bottom: 0, right: 0, type: 'fixed' }}
        />
        <GraphRenderer
          showMenu={false}
          isSelectionMode={false}
          onNodeClick={showDataModal}
        />
      </Col>
    </Row>
  );
};

export default GraphAnnotate;
