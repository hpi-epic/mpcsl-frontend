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
        Experience Management
      </RadioButton>
    </RadioGroup>
  );
}

export default ViewRadioNavigation;
