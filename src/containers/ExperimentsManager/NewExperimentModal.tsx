/* eslint-disable react/prop-types */
import { Form, Input, message, Select, InputNumber, Modal } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import React, { useState, useEffect } from 'react';
import {
  IAlgorithm,
  IExperiment,
  IParameters,
  IEnumParameter,
  INumberParameter
} from '../../types';
import { createExperiment, getAllAlgorithms } from '../../actions/apiRequests';
import { isNumber } from 'util';
import { SelectProps } from 'antd/lib/select';
import { WrappedFormUtils } from 'antd/lib/form/Form';

export interface IPropsNewExperimentModal extends FormComponentProps {
  visible: boolean;
  onClose: () => void;
  experiment?: IFormExperiment;
  editDisabled: boolean;
  datasetId: number;
}

const AlgorithmsSelect = (
  props: {
    editDisabled: boolean;
    onAlgoSelected: (algoParameters: IParameters) => void;
  } & SelectProps<number>
) => {
  const [algorithms, setAlgorithms] = useState<IAlgorithm[]>([]);
  useEffect(() => {
    getAllAlgorithms().then(result => setAlgorithms(result));
  }, []);
  return (
    <Select<number>
      disabled={props.editDisabled}
      onSelect={algId => {
        if (isNumber(algId)) {
          const algorithm = algorithms.find(alg => alg.id === algId);
          if (!algorithm) {
            return;
          }
          props.onAlgoSelected(algorithm.valid_parameters);
        }
      }}
      style={{ width: '100%' }}
      {...props}
    >
      {algorithms.map(algorithm => (
        <Select.Option value={algorithm.id} key={String(algorithm.id)}>
          {algorithm.name}
        </Select.Option>
      ))}
    </Select>
  );
};

const createInputElement = (
  key: string,
  parameter: INumberParameter,
  form: WrappedFormUtils<any>,
  editDisabled: boolean,
  experimentParameters?: IParameters
) => {
  const { getFieldDecorator } = form;
  return getFieldDecorator(key, {
    initialValue: experimentParameters
      ? experimentParameters[key]
      : parameter.required
      ? null
      : parameter.minimum !== undefined
      ? parameter.minimum
      : parameter.default !== undefined
      ? parameter.default
      : 0,
    rules: parameter.required
      ? [{ required: parameter.required, message: `Enter ${key} value` }]
      : []
  })(
    <InputNumber
      disabled={editDisabled}
      min={parameter.minimum}
      max={parameter.maximum}
      step={parameter.type === 'float' ? 0.01 : 1}
    />
  );
};

const createSelectElement = (
  key: string,
  parameter: IEnumParameter,
  form: WrappedFormUtils<any>,
  editDisabled: boolean,
  experimentParameters?: IParameters
) => {
  const { getFieldDecorator } = form;
  return getFieldDecorator(key, {
    initialValue: experimentParameters ? experimentParameters[key] : undefined,
    rules: parameter.required
      ? [{ required: parameter.required, message: `Enter ${key} value` }]
      : []
  })(
    <Select disabled={editDisabled}>
      {parameter.values.map(val => (
        <Select.Option value={val} key={val}>
          {val}
        </Select.Option>
      ))}
    </Select>
  );
};

const ParameterForms = (props: {
  parameters: IParameters;
  form: WrappedFormUtils<any>;
  editDisabled: boolean;
  experimentParameters?: IParameters;
}) => {
  const { form, editDisabled, experimentParameters } = props;
  return (
    <>
      {Object.keys(props.parameters).map(key => {
        const parameter = props.parameters[key];
        return (
          <Form.Item label={key} key={key} hasFeedback={true}>
            {parameter.type === 'enum'
              ? createSelectElement(
                  key,
                  parameter,
                  form,
                  editDisabled,
                  experimentParameters
                )
              : createInputElement(
                  key,
                  parameter,
                  form,
                  editDisabled,
                  experimentParameters
                )}
          </Form.Item>
        );
      })}
    </>
  );
};

const submitExperiment = (
  values: IFormExperiment,
  datasetId: number,
  validParameters: IParameters,
  onClose: () => void
) => {
  const keyList = Object.keys(validParameters);
  const params: IParameters = {};
  keyList.forEach(key => {
    params[key] = (values as any)[key];
  });
  if (!values.name || !values.description || !values.algorithm_id) {
    message.error('Set required Values!');
    return;
  }
  createExperiment({
    dataset_id: datasetId,
    name: values.name,
    description: values.description,
    algorithm_id: values.algorithm_id,
    parameters: params
  });
  onClose();
};

const handleSubmit = (
  form: WrappedFormUtils<any>,
  datasetId: number,
  validParameters: IParameters,
  onClose: () => void
) => {
  form.validateFields((err: Error, values: IFormExperiment) => {
    if (!err) {
      submitExperiment(values, datasetId, validParameters, onClose);
    } else {
      message.error('Set required Values!');
    }
  });
};

export type IFormExperiment = Partial<Omit<IExperiment, 'datasetId'>>;

const NewExperimentModal: React.FunctionComponent<IPropsNewExperimentModal> = props => {
  const [algParams, setAlgParams] = useState<IParameters>({});

  const ExperimentNameEl = props.form.getFieldDecorator('name', {
    initialValue: props.experiment ? props.experiment.name : undefined,
    rules: [{ required: true, message: 'Enter a Experiment Name' }]
  })(<Input disabled={props.editDisabled} placeholder="Experiment Name" />);

  const ExperimentDescEl = props.form.getFieldDecorator('description', {
    initialValue: props.experiment ? props.experiment.description : undefined,
    rules: [{ required: false, message: 'Enter a Experiment Description' }]
  })(
    <Input disabled={props.editDisabled} placeholder="Experiment Description" />
  );
  const AlgorithmsEl = props.form.getFieldDecorator('algorithm_id', {
    initialValue: props.experiment ? props.experiment.algorithm_id : undefined,
    rules: [{ required: true, message: 'Select a Algorithm' }]
  })(
    <AlgorithmsSelect
      editDisabled={props.editDisabled}
      onAlgoSelected={setAlgParams}
    />
  );
  return (
    <Modal
      visible={props.visible}
      onCancel={props.onClose}
      onOk={() =>
        handleSubmit(props.form, props.datasetId, algParams, props.onClose)
      }
      title={
        props.experiment
          ? `Experiment "${props.experiment.name}"`
          : 'Create new Experiment'
      }
    >
      <Form>
        <Form.Item label="Experiment Name" hasFeedback={true}>
          {ExperimentNameEl}
        </Form.Item>
        <Form.Item label="Experiment Description" hasFeedback={true}>
          {ExperimentDescEl}
        </Form.Item>
        <Form.Item label="Algorithm Selection" hasFeedback={true}>
          {AlgorithmsEl}
        </Form.Item>
        <ParameterForms
          parameters={algParams}
          form={props.form}
          editDisabled={props.editDisabled}
          experimentParameters={props.experiment?.parameters}
        />
      </Form>
    </Modal>
  );
};

const NewExperimentModalForm = Form.create<IPropsNewExperimentModal>()(
  NewExperimentModal
);

export { NewExperimentModalForm };
