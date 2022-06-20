import { Form, Input } from 'antd';
import React from 'react';
import { IFunctionStrParameter } from '../../types/types';

interface Props {
  paramName: string;
  parameter: IFunctionStrParameter;
  editDisabled?: boolean;
}

const ParameterFormFunctionInputElement: React.FC<Props> = ({
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
      placeholder="[0.0-1.0],function1 [0.0-1.0],function2 ..."
    />
  </Form.Item>
);

export default ParameterFormFunctionInputElement;
