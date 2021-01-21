import { Form, Input } from 'antd';
import React from 'react';
import { IStrParameter } from '../../types/types';

interface Props {
  paramName: string;
  parameter: IStrParameter;
  editDisabled: boolean;
}

const ParameterFormInputElement: React.FC<Props> = ({
  paramName,
  parameter,
  editDisabled
}) => (
  <Form.Item
    name={paramName}
    label={paramName}
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
    <Input
      disabled={editDisabled}
      placeholder="param1=[VALUE1],param2=[VALUE],..."
    />
  </Form.Item>
);

export default ParameterFormInputElement;
