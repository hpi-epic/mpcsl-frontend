/* eslint-disable react/prop-types */
import { Form, Input, message, Modal, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { IAlgorithm, IExperiment, IParameters } from '../../../types/types';
import {
  createExperiment,
  getAllAlgorithms,
  updateExperiment
} from '../../../restAPI/apiRequests';
import ParameterForms from './ParameterForms';
import { FormInstance } from 'antd/lib/form';

export interface IPropsNewExperimentModal {
  visible: boolean;
  onClose: () => void;
  experiment?: IFormExperiment;
  editDisabled: boolean;
  datasetId: number;
}

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
  form: FormInstance<any>,
  datasetId: number,
  validParameters: IParameters,
  onClose: () => void,
  algorithms: IAlgorithm[],
  update: boolean,
  experiment?: Partial<IExperiment>
) => {
  if (update) {
    if (!experiment || !experiment.id) {
      message.error('Experiment invalid!');
    }
    form
      .validateFields(['description'])
      .then(values => {
        if (experiment && experiment.id) {
          const expUpdate = {
            id: experiment.id,
            name: experiment.name,
            description: values.description
          };
          updateExperiment(expUpdate).then(() => onClose());
        } else {
          throw new Error(
            'InvalidStateException: The experiment needs to be defined.'
          );
        }
      })
      .catch(() => message.error('Description invalid!'));
  } else {
    form
      .validateFields()
      .then(values => {
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
      })
      .catch(() => message.error('Set required Values!'));
  }
};

export type IFormExperiment = Partial<Omit<IExperiment, 'datasetId'>>;

const NewExperimentModalForm: React.FunctionComponent<IPropsNewExperimentModal> = props => {
  const [form] = Form.useForm();

  const [algorithms, setAlgorithms] = useState<IAlgorithm[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<string | undefined>();
  const [packages, setPackages] = useState<string[]>([]);
  const [algoFunctions, setAlgoFunctions] = useState<string[]>([]);
  const [algParams, setAlgParams] = useState<IParameters>({});

  useEffect(() => {
    getAllAlgorithms().then(result => setAlgorithms(result));
  }, []);
  useEffect(() => {
    setPackages(Array.from(new Set(algorithms.map(algo => algo.package))));
  }, [algorithms]);

  useEffect(() => {
    if (props.experiment && props.experiment.parameters) {
      setAlgParams(props.experiment.parameters);
    } else {
      setAlgParams({});
      setSelectedPackage(undefined);
      form.resetFields();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.experiment]);

  useEffect(() => {
    if (props.experiment && props.experiment.algorithm_id && algorithms) {
      const expAlgo = algorithms.find(
        algo => algo.id === props.experiment?.algorithm_id
      );
      if (expAlgo) {
        if (form.getFieldValue('package_id') !== expAlgo.package) {
          form.setFieldsValue({ package_id: expAlgo.package });
          setSelectedPackage(expAlgo.package);
        }
        if (form.getFieldValue('function_id') !== expAlgo.function) {
          form.setFieldsValue({ function_id: expAlgo.function });
          form.validateFields(['function_id']);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.experiment, algorithms]);

  return (
    <Modal
      visible={props.visible}
      onCancel={props.onClose}
      onOk={() =>
        handleSubmit(
          form,
          props.datasetId,
          algParams,
          props.onClose,
          algorithms,
          props.editDisabled,
          props.experiment
        )
      }
      okText={props.editDisabled ? 'Update Description' : undefined}
      title={
        props.experiment
          ? `Experiment "${props.experiment.name}"`
          : 'Create new Experiment'
      }
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Experiment Name"
          hasFeedback={true}
          initialValue={props.experiment ? props.experiment.name : undefined}
          rules={[
            { required: true, message: 'Enter a Experiment Name' },
            {
              max: 16,
              message: 'The name is too long'
            }
          ]}
        >
          <Input disabled={props.editDisabled} placeholder="Experiment Name" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Experiment Description"
          hasFeedback={true}
          initialValue={
            props.experiment ? props.experiment.description : undefined
          }
          rules={[
            { required: false, message: 'Enter a Experiment Description' }
          ]}
        >
          <Input placeholder="Experiment Description" />
        </Form.Item>

        <Form.Item
          name="package_id"
          label="Package Selection"
          hasFeedback={true}
          initialValue={
            props.experiment ? props.experiment.algorithm_id : undefined
          }
          rules={[
            { required: true, message: 'Select a Package' },
            {
              validator: (rule: any, value: any, callback: () => void) => {
                if (selectedPackage !== value) {
                  const algoFncs = algorithms
                    .filter(algo => algo.package === value)
                    .map(algo => algo.function);
                  setAlgoFunctions(algoFncs);
                  form.setFieldsValue({ function_id: algoFncs[0] });
                  form.validateFields(['function_id']);
                  setSelectedPackage(value);
                }

                callback();
              }
            }
          ]}
        >
          <Select disabled={props.editDisabled}>
            {packages.map(p => (
              <Select.Option value={p} key={p}>
                {p}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="function_id"
          label="Function Selection"
          hasFeedback={true}
          rules={[
            { required: true, message: 'Select a Function' },
            {
              validator: (rule: any, value: any, callback: () => void) => {
                const selectedAlgorithm = algorithms.find(
                  algo =>
                    algo.function === value &&
                    algo.package === form.getFieldValue('package_id')
                );
                setAlgParams(
                  selectedAlgorithm ? selectedAlgorithm.valid_parameters : {}
                );
                callback();
              }
            }
          ]}
        >
          <Select disabled={props.editDisabled}>
            {algoFunctions.map(func => (
              <Select.Option value={func} key={func}>
                {func}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <ParameterForms
          parameters={algParams}
          editDisabled={props.editDisabled}
        />
      </Form>
    </Modal>
  );
};

export { NewExperimentModalForm };
