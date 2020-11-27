import { CloseOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Col, Menu, Popconfirm, Row, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Select from 'react-virtualized-select';
import { filter } from 'rxjs/operators';
import { isArray } from 'util';
import { GraphChanges, GraphSingleton } from '../../../graph/graph';
import { ID3GraphNode } from '../../../types/graphTypes';
import styles from './GraphNodeList.module.scss';

const SelectElem: any = (options: any) => {
  const { focusOption, key, labelKey, option, selectValue, style } = options;
  const className = [styles.NodeSelect];

  if (option.disabled) {
    className.push(styles.NodeSelectDisabled);
  }

  if (option.className) {
    className.push(option.className);
  }

  return (
    <Tooltip title={option[labelKey]}>
      <div
        key={key}
        style={style}
        className={className.join(' ')}
        title={option.title}
        onClick={option.disabled ? undefined : () => selectValue(option)}
        onMouseEnter={option.disabled ? undefined : () => focusOption(option)}
      >
        {option[labelKey]}
      </div>
    </Tooltip>
  );
};
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
          options={graphSearch ? graphSearch.filter(n => !!n) : []}
          onSelectResetsInput={true}
          onBlurResetsInput={false}
          optionRenderer={SelectElem}
          valueKey="key"
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
          <PlusCircleOutlined
            style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: 20 }}
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
        height: window.innerHeight - 64
      }}
    >
      {props.isSelectionMode ? (
        <div style={{ height: '7%' }}>
          <GraphExplorerSelect />
        </div>
      ) : null}
      <Menu
        theme="dark"
        selectable={false}
        style={{
          overflow: 'scroll',
          height: props.isSelectionMode ? '93%' : '100%'
        }}
      >
        <Menu.ItemGroup title="Focused Nodes:">
          {props.nodes
            .filter(node => !node.isContext)
            .map(node => (
              <Menu.Item key={node.id}>
                <Row
                  style={{ overflow: 'hidden' }}
                  onClick={() =>
                    props.onNodeClick ? props.onNodeClick(node) : undefined
                  }
                >
                  <Col span={18}>
                    <Tooltip title={node.label}>{node.label}</Tooltip>
                  </Col>
                  <Col span={4} offset={2}>
                    {props.isSelectionMode ? (
                      <CloseOutlined
                        onClick={() =>
                          props.onRemoveNode
                            ? props.onRemoveNode(node)
                            : undefined
                        }
                      />
                    ) : null}
                  </Col>
                </Row>
              </Menu.Item>
            ))}
        </Menu.ItemGroup>
      </Menu>
    </div>
  );
};

export { GraphNodeList };
