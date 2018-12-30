import { Badge, Button, Card, Dropdown, List, Menu } from 'antd';
import { BadgeProps } from 'antd/lib/badge';
import React from 'react';
import './ListElementExperiment.css';

interface IPropsListElementExperiment {
  title: string;
  status?: BadgeProps['status'];
  statusText?: string;
  content: string;
  onDuplicate: (e: React.MouseEvent<HTMLElement>) => void;
  onDelete: (e: React.MouseEvent<HTMLElement>) => void;
  onRunStart: (e: React.MouseEvent<HTMLElement>) => void;
  onExplore: (e: React.MouseEvent<HTMLElement>) => void;
  onView: (e: React.MouseEvent<HTMLElement>) => void;
  showAllJobs: (e: React.MouseEvent<HTMLElement>) => void;
}

function ListElementExperiment(props: IPropsListElementExperiment) {
  const menu = (
    <Menu>
      <Menu.Item>
        <Button className='Dropdown-Button' onClick={props.onDelete}>
          Delete
        </Button>
      </Menu.Item>
      <Menu.Item>
        <Button className='Dropdown-Button' onClick={props.onDuplicate}>
          Duplicate
        </Button>
      </Menu.Item>
      <Menu.Item>
        <Button className='Dropdown-Button' onClick={props.showAllJobs}>
          Jobs
        </Button>
      </Menu.Item>
    </Menu>
  );

  const cardTitle = (
    <div>
      <h2 className='Card-Title'>{props.title}</h2>
      <Badge
        className='Card-Badge'
        status={props.status}
        text={props.statusText}
      />
    </div>
  );

  return (
    <div>
      <List.Item>
        <Card className='Card' title={cardTitle}>
          <p className='Card-Content'>{props.content}</p>
          <Dropdown overlay={menu} placement='bottomLeft'>
            <Button className='List-Buttons' icon='ellipsis' />
          </Dropdown>
          <Button className='List-Buttons' onClick={props.onView}>
            View
          </Button>
          <Button className='List-Buttons' onClick={props.onRunStart}>
            Run
          </Button>
          <Button className='List-Buttons' onClick={props.onExplore}>
            Explore
          </Button>
        </Card>
      </List.Item>
    </div>
  );
}

export default ListElementExperiment;
