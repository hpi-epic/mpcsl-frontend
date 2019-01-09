import { Radio } from 'antd';
import { RadioChangeEvent } from 'antd/lib/radio';
import React from 'react';
import { Routes } from '../../constants/routes';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

interface IPropsRadioNavigation {
  value: Routes | string;
  onChange: (e: RadioChangeEvent) => void;
}

function ViewRadioNavigation(props: IPropsRadioNavigation) {
  return (
    <RadioGroup
      buttonStyle='solid'
      value={props.value}
      onChange={props.onChange}
      size='small'
    >
      <RadioButton value={Routes.observationMatricesManager}>
        Observation Matrices Management
      </RadioButton>
      <RadioButton value={Routes.experimentManager}>
        Experiment Management
      </RadioButton>
    </RadioGroup>
  );
}

export default ViewRadioNavigation;
