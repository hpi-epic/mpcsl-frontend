import React, { useState, useEffect } from 'react';
import { Tooltip, Icon, Menu, Col, Popconfirm } from 'antd';
import { ID3GraphNode, IAPIGraphNode } from '../../types/graphTypes';
import { ThunkDispatch } from 'redux-thunk';
import { connect } from 'react-redux';
import * as actions from '../../actions/graphExplorer';
import { IState } from '../../store';
import Select from 'react-virtualized-select';
import { isArray } from 'util';

interface IPropsGraphNodeList {
  nodes: ID3GraphNode[];
  onNodeClick?: (node: ID3GraphNode) => void;
  onRemoveNode?: (nodeID: ID3GraphNode) => void;
  isSelectionMode: boolean;
}

interface IGraphExplorerProps {
  onAddNode: (nodeID: number) => void;
  availableNodes: IAPIGraphNode[];
  nodes: ID3GraphNode[];
}

const mapStateToProps = (state: IState) => {
  return {
    availableNodes: state.graphExplorer!.availableNodes,
    nodes: state.graphExplorer!.nodes
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<IState, void, actions.GraphExplorerAction>
) => {
  return {
    onAddNode: (nodeID: number) => dispatch(actions.addNode(nodeID))
  };
};

const GraphExplorerSelect = (props: IGraphExplorerProps) => {
  const [graphSearch, setGraphSearch] = useState<
    {
      value: number;
      label: string;
    }[]
  >([]);
  useEffect(() => {
    if (props.availableNodes) {
      const result = props.availableNodes
        .filter(node => !props.nodes.some(n => node.id.toString() === n.id))
        .map(node => ({
          value: node.id,
          label: node.name
        }));
      setGraphSearch(result);
    } else {
      setGraphSearch([]);
    }
  }, [props.availableNodes, props.nodes]);
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
              ? props.onAddNode(option.value)
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
            for (const node of graphSearch) {
              if (node) {
                props.onAddNode(node.value);
              }
            }
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

const GraphExplorerSelectRedux = connect(
  mapStateToProps,
  mapDispatchToProps
)(GraphExplorerSelect);

function GraphNodeList(props: IPropsGraphNodeList) {
  return (
    <div
      style={{
        backgroundColor: '#001529',
        height: '100%'
      }}
    >
      {props.isSelectionMode ? <GraphExplorerSelectRedux /> : null}
      <Menu theme="dark" selectable={false}>
        <Menu.ItemGroup title="Focused Nodes:">
          {props.nodes.map(node => (
            <Menu.Item key={node.id}>
              <Col span={18} style={{ overflow: 'hidden' }}>
                <Tooltip title={node.label}>{node.label}</Tooltip>
              </Col>
              {props.isSelectionMode ? (
                <Col span={4} offset={2}>
                  <Icon
                    type="close"
                    onClick={() => props.onRemoveNode!(node)}
                  />
                </Col>
              ) : null}
            </Menu.Item>
          ))}
        </Menu.ItemGroup>
      </Menu>
    </div>
  );
}

export default GraphNodeList;
