import { Badge, Button, Card, Dropdown, List, Menu, Modal, Select } from 'antd';
import React, { useState, useEffect } from 'react';
import './ListElementExperiment.css';
import { JobStatus, BadgeStatus } from '../../types';
import { getK8SNodes } from '../../actions/apiRequests';

const { Option } = Select;

interface IPropsListElementExperiment {
  title: string;
  status?: JobStatus;
  statusText?: string;
  content: string;
  executionTimeStatistics?: { [name: string]: number };

  onDuplicate: (e: React.MouseEvent<HTMLElement>) => void;
  onDelete: (e: React.MouseEvent<HTMLElement>) => void;
  onRunStart: (k8sNode?: string) => void;
  onExplore: (e: React.MouseEvent<HTMLElement>) => void;
  onView: (e: React.MouseEvent<HTMLElement>) => void;
  onShowDetails: (e: React.MouseEvent<HTMLElement>) => void;
}

const ListElementExperiment = (props: IPropsListElementExperiment) => {
  const [nodeSelectModal, setNodeSelectModal] = useState(false);
  const [k8sNodes, setK8sNodes] = useState<undefined | string[]>();
  const [selectedNode, setSelectedNode] = useState<undefined | string>();
  useEffect(() => {
    getK8SNodes()
      .then(resp => setK8sNodes(resp.data))
      .catch(() => setK8sNodes([]));
  }, []);

  const menu = (
    <Menu>
      <Menu.Item>
        <Button
          className="Dropdown-Button"
          onClick={props.onShowDetails}
          key="1"
        >
          View Jobs
        </Button>
      </Menu.Item>
      <Menu.Item>
        <Button className="Dropdown-Button" onClick={props.onView} key="1">
          View Settings
        </Button>
      </Menu.Item>
      <Menu.Item>
        <Button className="Dropdown-Button" onClick={props.onDuplicate} key="3">
          Duplicate
        </Button>
      </Menu.Item>
      <Menu.Item>
        <Button
          className="Dropdown-Button"
          onClick={props.onDelete}
          type="danger"
          ghost={true}
          key="4"
        >
          Delete
        </Button>
      </Menu.Item>
    </Menu>
  );
  const cardTitle = (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ lineHeight: 0.2 }}>
        <button className="Card-Title" onClick={props.onShowDetails}>
          {props.title}
        </button>
        <Badge
          className="Card-Badge"
          text={props.statusText}
          status={props.status ? BadgeStatus[props.status] : 'default'}
        />
      </div>
      {props.executionTimeStatistics ? (
        <i style={{ fontWeight: 'lighter', fontSize: '0.8rem' }}>
          Mean Execution Time: {props.executionTimeStatistics.mean.toFixed(3)}s
        </i>
      ) : null}
    </div>
  );

  return (
    <>
      <Modal
        title="Select Machine to Start Job"
        visible={nodeSelectModal}
        onOk={() => {
          props.onRunStart(selectedNode);
          setNodeSelectModal(false);
        }}
        onCancel={() => setNodeSelectModal(false)}
        bodyStyle={{ display: 'flex' }}
      >
        <Select
          defaultValue="_none"
          onChange={(val: string) =>
            val !== '_none' ? setSelectedNode(val) : setSelectedNode(undefined)
          }
          style={{ flexGrow: 1 }}
        >
          <Option value="_none" style={{ fontStyle: 'italic' }}>
            Default
          </Option>
          {k8sNodes
            ? k8sNodes.map(node => (
                <Option key={node} value={node}>
                  {node}
                </Option>
              ))
            : null}
        </Select>
      </Modal>
      <div>
        <List.Item>
          <Card className="Card" title={cardTitle}>
            <p className="Card-Content Experiment-Content">{props.content}</p>
            <div>
              <Dropdown overlay={menu} placement="bottomLeft">
                <Button className="List-Buttons" icon="ellipsis" />
              </Dropdown>
              <Button
                className="List-Buttons"
                onClick={props.onExplore}
                type="primary"
                ghost={true}
                disabled={props.status !== 'done'}
              >
                Explore
              </Button>
              <Button
                className="List-Buttons"
                onClick={() => setNodeSelectModal(true)}
                type="primary"
                ghost={true}
              >
                Run
              </Button>
            </div>
          </Card>
        </List.Item>
      </div>
    </>
  );
};

export default ListElementExperiment;
