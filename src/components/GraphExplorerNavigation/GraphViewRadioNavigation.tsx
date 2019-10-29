import { Radio } from 'antd';
import { RadioChangeEvent } from 'antd/lib/radio';
import React from 'react';
import { Routes } from '../../constants/routes';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

interface IPropsRadioNavigation {
  value: Routes;
  onChange: (e: RadioChangeEvent) => void;
}

function GraphViewRadioNavigation(props: IPropsRadioNavigation) {
  return (
    <RadioGroup
      buttonStyle="solid"
      value={props.value}
      onChange={props.onChange}
      size="small"
    >
      <RadioButton value={Routes.graphExplorerSelection}>Selection</RadioButton>
      <RadioButton value={Routes.graphExplorerAnnotate}>
        Expl. &#38; Valid.
      </RadioButton>
      <RadioButton value={Routes.graphExplorerCausalExploration}>
        Causal Inference
      </RadioButton>
    </RadioGroup>
  );
}

export default GraphViewRadioNavigation;
