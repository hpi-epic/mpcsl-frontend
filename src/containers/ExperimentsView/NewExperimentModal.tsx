/* eslint-disable react/prop-types */
import { Form, Input, message, Select, InputNumber, Modal } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import React, { useState, useEffect } from 'react';
import {
  IAlgorithm,
  IExperiment,
  IParameters,
  IEnumParameter,
  INumberParameter,
  IStrParameter
} from '../../types';
import { createExperiment, getAllAlgorithms } from '../../actions/apiRequests';
import { WrappedFormUtils } from 'antd/lib/form/Form';

export interface IPropsNewExperimentModal extends FormComponentProps {
  visible: boolean;
  onClose: () => void;
  experiment?: IFormExperiment;
  editDisabled: boolean;
  datasetId: number;
}

const createInputElement = (
  key: string,
  parameter: IStrParameter,
  form: WrappedFormUtils<any>,
  editDisabled: boolean
) => {
  const { getFieldDecorator } = form;
  return getFieldDecorator(key, {
    rules: parameter.required
      ? [{ required: parameter.required, message: `Enter ${key} value` }]
      : []
  })(
    <Input
      disabled={editDisabled}
      placeholder="param1=[VALUE1],param2=[VALUE],..."
    ></Input>
  );
};

const createNumberInputElement = (
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
      : parameter.default !== undefined
      ? parameter.default
      : parameter.minimum !== undefined
      ? parameter.minimum
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
              : parameter.type === 'str'
              ? createInputElement(key, parameter, form, editDisabled)
              : createNumberInputElement(
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
  if (!values.name || !values.algorithm_id) {
    message.error('Set required Values!');
    return;
  }
  createExperiment({
    dataset_id: datasetId,
    name: values.name,
    description: values.description ? values.description : '',
    algorithm_id: values.algorithm_id,
    parameters: params
  });
  onClose();
};

const handleSubmit = (
  form: WrappedFormUtils<any>,
  datasetId: number,
  validParameters: IParameters,
  onClose: () => void,
  algorithms: IAlgorithm[]
) => {
  form.validateFields((err: Error, values: any) => {
    if (!err) {
      const algorithm = algorithms.find(
        alg =>
          alg.package === values.package_id &&
          alg.function === values.function_id
      );
      if (!algorithm) {
        message.error('Algorithm not found!');
        return;
      }
      submitExperiment(
        { ...values, algorithm_id: algorithm?.id },
        datasetId,
        validParameters,
        onClose
      );
    } else {
      message.error('Set required Values!');
    }
  });
};

export type IFormExperiment = Partial<Omit<IExperiment, 'datasetId'>>;

const NewExperimentModal: React.FunctionComponent<IPropsNewExperimentModal> = props => {
  const [algorithms, setAlgorithms] = useState<IAlgorithm[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<string | undefined>();
  useEffect(() => {
    getAllAlgorithms().then(result => setAlgorithms(result));
  }, []);

  const [packages, setPackages] = useState<string[]>([]);
  useEffect(() => {
    setPackages(Array.from(new Set(algorithms.map(algo => algo.package))));
  }, [algorithms]);

  const [algoFunctions, setAlgoFunctions] = useState<string[]>([]);

  const [algParams, setAlgParams] = useState<IParameters>({});

  useEffect(() => {
    if (props.experiment && props.experiment.parameters) {
      setAlgParams(props.experiment.parameters);
    } else {
      setAlgParams({});
    }
  }, [props.experiment]);
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

  const PackagesEl = props.form.getFieldDecorator('package_id', {
    initialValue: props.experiment ? props.experiment.algorithm_id : undefined,
    rules: [
      { required: true, message: 'Select a Package' },
      {
        validator: (rule: any, value: any, callback: () => void) => {
          if (selectedPackage !== value) {
            const algoFncs = algorithms
              .filter(algo => algo.package === value)
              .map(algo => algo.function);
            setAlgoFunctions(algoFncs);
            props.form.setFieldsValue({ function_id: algoFncs[0] });
            props.form.validateFields(['function_id']);
            setSelectedPackage(value);
          }

          callback();
        }
      }
    ]
  })(
    <Select disabled={props.editDisabled}>
      {packages.map(p => (
        <Select.Option value={p} key={p}>
          {p}
        </Select.Option>
      ))}
    </Select>
  );

  const FunctionsEl = props.form.getFieldDecorator('function_id', {
    rules: [
      { required: true, message: 'Select a Function' },
      {
        validator: (rule: any, value: any, callback: () => void) => {
          const selectedAlgorithm = algorithms.find(
            algo =>
              algo.function === value &&
              algo.package === props.form.getFieldValue('package_id')
          );
          setAlgParams(
            selectedAlgorithm ? selectedAlgorithm.valid_parameters : {}
          );
          callback();
        }
      }
    ]
  })(
    <Select disabled={props.editDisabled}>
      {algoFunctions.map(func => (
        <Select.Option value={func} key={func}>
          {func}
        </Select.Option>
      ))}
    </Select>
  );
  return (
    <Modal
      visible={props.visible}
      onCancel={props.onClose}
      onOk={() =>
        handleSubmit(
          props.form,
          props.datasetId,
          algParams,
          props.onClose,
          algorithms
        )
      }
      okButtonProps={{ disabled: props.editDisabled }}
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
        <Form.Item label="Package Selection" hasFeedback={true}>
          {PackagesEl}
        </Form.Item>
        <Form.Item label="Function Selection" hasFeedback={true}>
          {FunctionsEl}
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
