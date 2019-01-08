import { Button, Card, List } from 'antd';
import React from 'react';
import './ListElementObservationMatrix.css';

interface IPropsListElementObservationMatrix {
  title: string;
  content: string;
  onDelete: () => void;
  onView: () => void;
}

function ListElementObservationMatrix(
  props: IPropsListElementObservationMatrix,
) {
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
          <Button className='List-Buttons' onClick={props.onDelete} type='danger' ghost={true}>
            Delete
          </Button>
          <Button className='List-Buttons' onClick={props.onView} type='primary' ghost={true}>
            View
          </Button>
        </Card>
      </List.Item>
    </div>
  );
}

export default ListElementObservationMatrix;
