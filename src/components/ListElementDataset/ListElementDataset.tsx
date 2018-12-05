import { Badge, Button, Card, Dropdown, List, Menu } from 'antd';
import { BadgeProps } from 'antd/lib/badge';
import React from 'react';
import './ListElementDataset.css';

interface IPropsListElementDataset {
  title: string;
  content: string;
}

function ListElementDataset(props: IPropsListElementDataset) {

  const cardTitle = (
    <div>
      <h2 className='Card-Title'>{props.title}</h2>
    </div>
  );

  return (
    <div>
      <List.Item>
        <Card className='Card' title={cardTitle}>
          <p className='Card-Content'>{props.content}</p>
          <Button className='List-Buttons'>Delete</Button>
          <Button className='List-Buttons'>View</Button>
        </Card>
      </List.Item>
    </div>
  );
}

export default ListElementDataset;
