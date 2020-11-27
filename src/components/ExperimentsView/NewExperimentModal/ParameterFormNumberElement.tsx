import { Form, InputNumber } from 'antd';
import React from 'react';
import { INumberParameter, IParameters } from '../../../types/types';

interface Props {
  key: string;
  parameter: INumberParameter;
  editDisabled: boolean;
  experimentParameters?: IParameters;
}

const ParameterFormNumberElement: React.FC<Props> = ({
  key,
  parameter,
  editDisabled,
  experimentParameters
}) => (
  <Form.Item
    label={key}
    key={key}
    hasFeedback={true}
    initialValue={
      experimentParameters
        ? experimentParameters[key]
        : parameter.required
        ? null
        : parameter.default !== undefined
        ? parameter.default
        : parameter.minimum !== undefined
        ? parameter.minimum
        : 0
    }
    rules={
      parameter.required
        ? [{ required: parameter.required, message: `Enter ${key} value` }]
        : []
    }
  >
    <InputNumber
      disabled={editDisabled}
      min={parameter.minimum}
      max={parameter.maximum}
      step={parameter.type === 'float' ? 0.01 : 1}
    />
  </Form.Item>
);

export default ParameterFormNumberElement;
