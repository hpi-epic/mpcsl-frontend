import { Badge, Button, Card, Dropdown, List, Menu } from 'antd';
import { BadgeProps } from 'antd/lib/badge';
import React from 'react';
import './ListElementExperiment.css';

interface IPropsListElementExperiment {
  title: string;
  status?: BadgeProps['status'];
  statusText?: string;
  content: string;
  executionTimeStatistics?: { [name: string]: number };

  onDuplicate: (e: React.MouseEvent<HTMLElement>) => void;
  onDelete: (e: React.MouseEvent<HTMLElement>) => void;
  onRunStart: (e: React.MouseEvent<HTMLElement>) => void;
  onExplore: (e: React.MouseEvent<HTMLElement>) => void;
  onView: (e: React.MouseEvent<HTMLElement>) => void;
  onShowDetails: (e: React.MouseEvent<HTMLElement>) => void;
}

function ListElementExperiment(props: IPropsListElementExperiment) {
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
          status={props.status}
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
              disabled={props.status === 'success' ? false : true}
            >
              Explore
            </Button>
            <Button
              className="List-Buttons"
              onClick={props.onRunStart}
              type="primary"
              ghost={true}
            >
              Run
            </Button>
          </div>
        </Card>
      </List.Item>
    </div>
  );
}

export default ListElementExperiment;
