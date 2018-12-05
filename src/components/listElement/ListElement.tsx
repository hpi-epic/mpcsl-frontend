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

class ListElement extends React.Component<IPropsListElement, {}> {

  private menu = (
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

  private cardTitle = (
    <div>
      <h2 className='Card-Title'>{this.props.title}</h2>
      <Badge className='Card-Badge' status={this.props.status} text={this.props.statusText} />
    </div>
  );

  constructor(props: any) {
    super(props);
  }

  public render() {
    return (
      <div>
        <List.Item>
          <Card className='Card' title={this.cardTitle}>
            <p className='Card-Content'>{this.props.content}</p>
            <Dropdown overlay={this.menu} placement='bottomLeft'>
              <Button className='List-Buttons' icon='ellipsis' />
            </Dropdown>
            <Button className='List-Buttons'>Run</Button>
            <Button className='List-Buttons'>Explore</Button>
          </Card>
        </List.Item>
      </div>
    );
  }
}

export default ListElement;
