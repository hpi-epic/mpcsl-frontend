import { Form, Select } from 'antd';
import React from 'react';
import { IEnumParameter, IParameters } from '../../../types/types';

interface Props {
  key: string;
  parameter: IEnumParameter;
  editDisabled: boolean;
  experimentParameters?: IParameters;
}

const ParameterFormSelectElement: React.FC<Props> = ({
  key,
  parameter,
  editDisabled,
  experimentParameters
}) => (
  <Form.Item
    label={key}
    key={key}
    hasFeedback={true}
    initialValue={experimentParameters ? experimentParameters[key] : undefined}
    rules={
      parameter.required
        ? [{ required: parameter.required, message: `Enter ${key} value` }]
        : []
    }
  >
    <Select disabled={editDisabled}>
      {parameter.values.map(val => (
        <Select.Option value={val} key={val}>
          {val}
        </Select.Option>
      ))}
    </Select>
  </Form.Item>
);

export default ParameterFormSelectElement;
