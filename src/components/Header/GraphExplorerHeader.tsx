import { Radio } from 'antd';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import 'react-select/dist/react-select.css';
import 'react-virtualized-select/styles.css';
import 'react-virtualized/styles.css';

export const GraphExplorerHeader = (
  props: RouteComponentProps<{ view: string }>
) => {
  return (
    <div style={{ flexGrow: 10, justifyContent: 'flex-end', display: 'flex' }}>
      <Radio.Group
        value={props.match.params.view}
        onChange={e =>
          props.history.push(
            props.match.url.replace(props.match.params.view, e.target.value)
          )
        }
        buttonStyle="solid"
      >
        <Radio.Button value="selection">Selection</Radio.Button>
        <Radio.Button value="annotation">Annotation</Radio.Button>
        <Radio.Button value="exploration">Exploration</Radio.Button>
      </Radio.Group>
    </div>
  );
};
