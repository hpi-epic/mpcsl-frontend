import { Form, Input } from 'antd';
import React from 'react';
import { IStrParameter } from '../../../types/types';

interface Props {
  key: string;
  parameter: IStrParameter;
  editDisabled: boolean;
}

const ParameterFormInputElement: React.FC<Props> = ({
  key,
  parameter,
  editDisabled
}) => (
  <Form.Item
    key={key}
    rules={
      parameter.required
        ? [{ required: parameter.required, message: `Enter ${key} value` }]
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
