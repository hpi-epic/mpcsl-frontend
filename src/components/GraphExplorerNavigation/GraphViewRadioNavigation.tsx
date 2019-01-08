import { Radio } from 'antd';
import { RadioChangeEvent } from 'antd/lib/radio';
import React from 'react';
import { Routes } from '../../types';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

interface IPropsRadioNavigation {
  value: Routes;
  onChange: (e: RadioChangeEvent) => void;
}

function GraphViewRadioNavigation(props: IPropsRadioNavigation) {
  return (
    <RadioGroup
      buttonStyle='solid'
      value={props.value}
      onChange={props.onChange}
      size='small'
    >
      <RadioButton value={Routes.graphExplorerSelection}>
        Selection
      </RadioButton>
      <RadioButton value={Routes.graphExplorerAnnotate}>
        Annotate
      </RadioButton>
      <RadioButton value={Routes.graphExplorerCausalExploration}>
        Causal Exploration
      </RadioButton>
    </RadioGroup>
  );
}

export default GraphViewRadioNavigation;
