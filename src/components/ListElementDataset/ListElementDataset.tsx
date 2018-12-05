import { Button, Card, List } from 'antd';
import React from 'react';
import './ListElementDataset.css';

interface IPropsListElementDataset {
  title: string;
  content: string;
  onDelete: (e: React.MouseEvent<HTMLElement>) => void;
  onView: (e: React.MouseEvent<HTMLElement>) => void;
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
          <Button
            className='List-Buttons'
            onClick={props.onView}
          >
          View
          </Button>
        </Card>
      </List.Item>
    </div>
  );
}

export default ListElementDataset;
