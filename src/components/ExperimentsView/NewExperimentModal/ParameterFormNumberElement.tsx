import { Form, InputNumber } from 'antd';
import React from 'react';
import { INumberParameter, IParameters } from '../../../types/types';

interface Props {
  paramName: string;
  parameter: INumberParameter;
  editDisabled: boolean;
  initialValues?: IParameters;
}

const ParameterFormNumberElement: React.FC<Props> = ({
  paramName,
  parameter,
  editDisabled,
  initialValues: initalValues
}) => (
  <Form.Item
    label={paramName}
    name={paramName}
    hasFeedback={true}
    initialValue={
      initalValues
        ? initalValues[paramName]
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
        ? [
            {
              required: parameter.required,
              message: `Enter ${paramName} value`
            }
          ]
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
