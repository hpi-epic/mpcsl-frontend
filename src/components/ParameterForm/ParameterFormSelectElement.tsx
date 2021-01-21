import { Form, Select } from 'antd';
import React from 'react';
import { IEnumParameter, IParameters } from '../../types/types';

interface Props {
  paramName: string;
  parameter: IEnumParameter;
  editDisabled?: boolean;
  initialValues?: IParameters;
}

const ParameterFormSelectElement: React.FC<Props> = ({
  paramName,
  parameter,
  editDisabled,
  initialValues
}) => (
  <Form.Item
    label={paramName}
    name={paramName}
    hasFeedback={true}
    initialValue={initialValues ? initialValues[paramName] : undefined}
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
