import { Badge, Button, Card, Dropdown, List, Menu } from 'antd';
import { BadgeProps } from 'antd/lib/badge';
import React from 'react';
import './ListElement.css';

interface IPropsListElement {
  title: string;
  status: BadgeProps['status'];
  statusText: string;
  content: string;
}

function ListElement(props: IPropsListElement) {
  const menu = (
    <Menu>
      <Menu.Item>
        <a>Edit</a>
      </Menu.Item>
      <Menu.Item>
        <a>Delete</a>
      </Menu.Item>
      <Menu.Item>
        <a>Duplicate</a>
      </Menu.Item>
    </Menu>
  );

  const cardTitle = (
    <div>
      <h2 className='Card-Title'>{props.title}</h2>
      <Badge className='Card-Badge' status={props.status} text={props.statusText} />
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
          <Button className='List-Buttons'>Run</Button>
          <Button className='List-Buttons'>Explore</Button>
        </Card>
      </List.Item>
    </div>
  );
}

export default ListElement;
