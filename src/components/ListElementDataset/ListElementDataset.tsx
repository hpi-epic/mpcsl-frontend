import { Button, Card, List } from 'antd';
import { AnchorButtonProps } from 'antd/lib/button/button';
import React from 'react';
import './ListElementDataset.css';

interface IPropsListElementDataset {
  title: string;
  content: string;
  onDelete: (e: React.MouseEventHandler<HTMLAnchorElement>) => void;
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
        <Card
          className='Card'
          title={cardTitle}
        >
          <p className='Card-Content'>{props.content}</p>
          <Button
            className='List-Buttons'
            onClick={props.onDelete}
          >
          Delete
          </Button>
          <Button className='List-Buttons'>View</Button>
        </Card>
      </List.Item>
    </div>
  );
}

export default ListElementDataset;
