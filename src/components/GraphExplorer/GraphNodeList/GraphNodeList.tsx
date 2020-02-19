import React, { useState, useEffect } from 'react';
import { Tooltip, Icon, Menu, Col, Popconfirm } from 'antd';
import { ID3GraphNode } from '../../../types/graphTypes';
import Select from 'react-virtualized-select';
import { isArray } from 'util';
import { GraphSingleton, GraphChanges } from '../../../graph/graph';
import { useParams } from 'react-router-dom';
import { filter } from 'rxjs/operators';

const GraphExplorerSelect = () => {
  const { resultId } = useParams<{ resultId: string }>();
  const [graphSearch, setGraphSearch] = useState<
    {
      value: number;
      label: string;
    }[]
  >([]);
  useEffect(() => {
    const sub = GraphSingleton.subject
      .pipe(
        filter(
          e =>
            e === GraphChanges.AvailableNodeChanged ||
            e === GraphChanges.NodesChanged
        )
      )
      .subscribe(() => {
        if (GraphSingleton.availableNodes) {
          const result = GraphSingleton.availableNodes
            .filter(
              aNode =>
                !GraphSingleton.nodes.some(
                  node => !node.isContext && node.id === aNode.id.toString()
                )
            )
            .map(node => ({
              value: node.id,
              label: node.name
            }));
          setGraphSearch(result);
        } else {
          setGraphSearch([]);
        }
      });
    return () => sub.unsubscribe();
  }, []);
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-evenly'
      }}
    >
      <span
        style={{
          width: '70%'
        }}
      >
        <Select
          key="a"
          onChange={option =>
            option && !isArray(option) && option.value
              ? GraphSingleton.addNode(option.value, parseInt(resultId))
              : null
          }
          options={
            graphSearch
              ? (graphSearch.filter(n => !!n) as {
                  value: number;
                  label: string;
                }[])
              : []
          }
          onSelectResetsInput={true}
          onBlurResetsInput={false}
          valueKey="value"
          labelKey="label"
          closeOnSelect={false}
          removeSelected={true}
          clearable={true}
          placeholder="Select nodes"
        />
      </span>
      <Tooltip title="Load all nodes">
        <Popconfirm
          title="Are you sure that you want to load all nodes?"
          onConfirm={() => {
            GraphSingleton.addNodes(
              graphSearch.map(node => node.value),
              parseInt(resultId)
            );
          }}
        >
          <Icon
            style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: 20 }}
            type="plus-circle"
          />
        </Popconfirm>
      </Tooltip>
    </div>
  );
};

interface IPropsGraphNodeList {
  nodes: ID3GraphNode[];
  onNodeClick?: (node: ID3GraphNode) => void;
  onRemoveNode?: (nodeID: ID3GraphNode) => void;
  isSelectionMode: boolean;
}

const GraphNodeList = (props: IPropsGraphNodeList) => {
  return (
    <div
      style={{
        backgroundColor: '#001529',
        height: '100%'
      }}
    >
      {props.isSelectionMode ? <GraphExplorerSelect /> : null}
      <Menu theme="dark" selectable={false}>
        <Menu.ItemGroup title="Focused Nodes:">
          {props.nodes
            .filter(node => !node.isContext)
            .map(node => (
              <Menu.Item key={node.id}>
                <Col
                  span={18}
                  style={{ overflow: 'hidden' }}
                  onClick={() =>
                    props.onNodeClick ? props.onNodeClick(node) : undefined
                  }
                >
                  <Tooltip title={node.label}>{node.label}</Tooltip>
                </Col>
                {props.isSelectionMode ? (
                  <Col span={4} offset={2}>
                    <Icon
                      type="close"
                      onClick={() =>
                        props.onRemoveNode
                          ? props.onRemoveNode(node)
                          : undefined
                      }
                    />
                  </Col>
                ) : null}
              </Menu.Item>
            ))}
        </Menu.ItemGroup>
      </Menu>
    </div>
  );
};

export { GraphNodeList };
