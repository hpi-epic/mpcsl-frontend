import React, { useEffect, useState } from 'react';
import { Form, Input, InputNumber, message, Modal, Select } from 'antd';
import {
  createDatasetGenerationJob,
  getAllAvailableDataSources,
  getK8SNodes
} from '../../../restAPI/apiRequests';

const { Option } = Select;

export interface IFormGenerationJob {
  datasetName: string;
  kubernetesNode: string;
  nodes: number;
  samples: number;
  edgeProbability: number;
  edgeValueLowerBound: number;
  edgeValueUpperBound: number;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  observationMatrix?: IFormGenerationJob;
}

const DatasetGenerationModal: React.FC<Props> = ({ visible, onClose }) => {
  const [form] = Form.useForm();
  const [dataSources, setDataSources] = useState<undefined | []>(undefined);
  const [k8sNodes, setK8sNodes] = useState<undefined | string[]>();

  useEffect(() => {
    if (!dataSources) {
      getAllAvailableDataSources()
        .then(dataSources => setDataSources(dataSources))
        .catch(console.error);
    }
    getK8SNodes()
      .then(setK8sNodes)
      .catch(() => setK8sNodes([]));
  });

  const title = 'Generate Dataset';

  const submitObservationMatrix = (values: IFormGenerationJob) => {
    createDatasetGenerationJob({
      datasetName: values.datasetName,
      kubernetesNode: values.kubernetesNode,
      nodes: values.nodes,
      samples: values.samples,
      edgeProbability: values.edgeProbability,
      edgeValueLowerBound: values.edgeValueLowerBound,
      edgeValueUpperBound: values.edgeValueUpperBound
    })
      .then(onClose)
      .catch(error => {
        if (error.status !== 400) {
          onClose();
        }
      });
  };

  const handleCreation = () => {
    form
      .validateFields()
      .then(values => {
        values.kubernetesNode =
          values.kubernetesNode === '_none' ? undefined : values.kubernetesNode;
        return values;
      })
      .then(values => submitObservationMatrix(values as IFormGenerationJob))
      .catch(() =>
        message.error(
          'Set a Observation Matrix Name and Query and select a Data Source from the list.'
        )
      );
  };

  const handleSubmit = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault();
    handleCreation();
  };

  return (
    <Modal
      title={title}
      onCancel={onClose}
      onOk={handleSubmit}
      visible={visible}
      okText={'Create Dataset Generation Job'}
    >
      <Form form={form} layout="vertical" className="Modal-Form">
        <Form.Item
          label="Dataset Name"
          name="datasetName"
          rules={[{ required: true, message: 'Select an unique dataset name' }]}
        >
          <Input placeholder="Dataset name" />
        </Form.Item>

        <Form.Item
          label="Select an enviroment"
          name="kubernetesNode"
          initialValue={'_none'}
          rules={[{ required: true, message: 'Select an enviroment' }]}
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

        <Form.Item
          name="nodes"
          label="Nodes"
          initialValue={5}
          rules={[{ required: true, message: 'Select number of nodes' }]}
        >
          <InputNumber placeholder="Nodes" min={2} step={1} />
        </Form.Item>
        <Form.Item
          name="samples"
          label="Samples"
          initialValue={50}
          rules={[{ required: true, message: 'Select number of samples' }]}
        >
          <InputNumber placeholder="Samples" min={1} step={20} />
        </Form.Item>
        <Form.Item
          name="edgeProbability"
          label="edgeProbability"
          initialValue={0.5}
          rules={[{ required: true, message: 'Select edgeProbability' }]}
        >
          <InputNumber
            placeholder="edgeProbability"
            min={0}
            max={1}
            step={0.05}
          />
        </Form.Item>
        <Form.Item
          name="edgeValueLowerBound"
          label="edgeValueLowerBound"
          initialValue={-1}
          rules={[{ required: true, message: 'Select edgeValueLowerBound' }]}
        >
          <InputNumber placeholder="edgeValueLowerBound" step={0.5} />
        </Form.Item>
        <Form.Item
          name="edgeValueUpperBound"
          label="edgeValueUpperBound"
          initialValue={1}
          rules={[{ required: true, message: 'Select edgeValueUpperBound' }]}
        >
          <InputNumber placeholder="edgeValueUpperBound" step={0.5} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default DatasetGenerationModal;
