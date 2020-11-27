import { Form, InputNumber, Modal, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import {
  getAlgorithm,
  getK8SNodes,
  runExperiment
} from '../../../restAPI/apiRequests';
import { IExperiment } from '../../../types/types';

const { Option } = Select;

type IProps = {
  experiment: IExperiment;
  visible: boolean;
  onClose: () => void;
};

export const RunExperimentModalForm: React.FunctionComponent<IProps> = props => {
  const [form] = Form.useForm();

  const [k8sNodes, setK8sNodes] = useState<undefined | string[]>();
  const [needsGPU, setNeedsGPU] = useState<undefined | boolean>();

  useEffect(() => {
    getK8SNodes()
      .then(setK8sNodes)
      .catch(() => setK8sNodes([]));
  }, []);

  useEffect(() => {
    getAlgorithm(props.experiment.algorithm_id).then(alg =>
      setNeedsGPU(!!alg.needs_gpu)
    );
  }, [props.experiment]);

  return (
    <Modal
      title="Set Execution Parameters"
      visible={props.visible}
      confirmLoading={needsGPU === undefined}
      onOk={() => {
        form
          .validateFields()
          .then(values => {
            runExperiment(
              props.experiment,
              values.node === '_none' ? undefined : values.node,
              values.runs,
              values.parallelismMode === 'parallel',
              needsGPU ? values.gpus : undefined,
              values.enforceCpus
            );
            props.onClose();
          })
          .catch(info => {
            console.log('Validation failed:', info);
          });
      }}
      onCancel={() => props.onClose()}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Select Machine to Start Job"
          name="node"
          initialValue={'_none'}
        >
          <Select>
            <Option value="_none" style={{ fontStyle: 'italic' }}>
              Default
            </Option>
            {k8sNodes
              ? k8sNodes.map(node => (
                  <Option key={node} value={node}>
                    {node}
                  </Option>
                ))
              : null}
          </Select>
        </Form.Item>
        <Form.Item label="Number of Jobs" name="runs" initialValue={1}>
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          label="Run Mode"
          name="parallelismMode"
          initialValue={'parallel'}
        >
          <Select>
            <Option value="parallel">Parallel</Option>
            <Option value="sequential">Sequential</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Enforce CPU Requests"
          name="enforceCpus"
          initialValue={1}
        >
          <Select>
            <Option value={1}>Yes</Option>
            <Option value={0}>No</Option>
          </Select>
        </Form.Item>
        {needsGPU ? (
          <Form.Item label="GPU Count" name="gpus" initialValue={1}>
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
        ) : null}
      </Form>
    </Modal>
  );
};
