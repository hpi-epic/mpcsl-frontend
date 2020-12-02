import React, { useEffect, useState } from 'react';
import { Form, Input, message, Modal } from 'antd';
import {
  createDatasetGenerationJob,
  getAllAvailableDataSources
} from '../../../restAPI/apiRequests';

export interface IFormGenerationJob {
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

const NewDatasetGenerationModal: React.FC<Props> = ({ visible, onClose }) => {
  const [form] = Form.useForm();
  const [dataSources, setDataSources] = useState<undefined | []>(undefined);

  useEffect(() => {
    if (!dataSources) {
      getAllAvailableDataSources()
        .then(dataSources => setDataSources(dataSources))
        .catch(console.error);
    }
  });

  const title = 'Generate Dataset';

  const submitObservationMatrix = (values: IFormGenerationJob) => {
    createDatasetGenerationJob({
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
          name="nodes"
          label="Nodes"
          initialValue={5}
          rules={[{ required: true, message: 'Select number of nodes' }]}
        >
          <Input placeholder="Nodes" />
        </Form.Item>
        <Form.Item
          name="samples"
          label="Samples"
          initialValue={50}
          rules={[{ required: true, message: 'Select number of samples' }]}
        >
          <Input placeholder="Samples" />
        </Form.Item>
        <Form.Item
          name="edgeProbability"
          label="edgeProbability"
          initialValue={0.5}
          rules={[{ required: true, message: 'Select edgeProbability' }]}
        >
          <Input placeholder="edgeProbability" />
        </Form.Item>
        <Form.Item
          name="edgeValueLowerBound"
          label="edgeValueLowerBound"
          initialValue={-1}
          rules={[{ required: true, message: 'Select edgeValueLowerBound' }]}
        >
          <Input placeholder="edgeValueLowerBound" />
        </Form.Item>
        <Form.Item
          name="edgeValueUpperBound"
          label="edgeValueUpperBound"
          initialValue={1}
          rules={[{ required: true, message: 'Select edgeValueUpperBound' }]}
        >
          <Input placeholder="edgeValueUpperBound" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default NewDatasetGenerationModal;
