import React, { useEffect, useState } from 'react';
import { Form, Input, message, Modal, Select } from 'antd';
import {
  createObservationMatrix,
  getAllAvailableDataSources,
  updateObservationMatrix
} from '../../../restAPI/apiRequests';
import TextArea from 'antd/lib/input/TextArea';
import { IObservationMatrix } from '../../../types/types';

export interface IFormObservationMatrix {
  observationMatrixName: string;
  observationMatrixDescription: string;
  query: string;
  dataSource: string;
  id: IObservationMatrix['id'];
}

interface Props {
  visible: boolean;
  onClose: () => void;
  observationMatrix?: IFormObservationMatrix;
}

const ObservationMatrixModal: React.FC<Props> = ({
  visible,
  onClose,
  observationMatrix
}) => {
  const [form] = Form.useForm();
  const [dataSources, setDataSources] = useState<undefined | []>(undefined);

  useEffect(() => {
    if (!dataSources) {
      getAllAvailableDataSources()
        .then(dataSources => setDataSources(dataSources))
        .catch(console.error);
    }
  });

  const disabled = observationMatrix !== undefined;
  const title = observationMatrix
    ? `Observation Matrix “${observationMatrix.observationMatrixName}“`
    : 'Create new Observation Matrix';

  const submitObservationMatrix = (values: IFormObservationMatrix) => {
    createObservationMatrix({
      load_query: values.query,
      name: values.observationMatrixName,
      description: values.observationMatrixDescription,
      data_source: values.dataSource
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
      .then(values => submitObservationMatrix(values as IFormObservationMatrix))
      .catch(() =>
        message.error(
          'Set a Observation Matrix Name and Query and select a Data Source from the list.'
        )
      );
  };

  const handleUpdate = () => {
    if (!observationMatrix) {
      throw new Error(
        'IllegalStateException: The parameter "observationMatrix" must be defined.'
      );
    }
    form
      .validateFields(['observationMatrixDescription'])
      .then(values => {
        const updateOM = {
          id: observationMatrix.id,
          name: observationMatrix.observationMatrixName,
          description: values.observationMatrixDescription
        };
        updateObservationMatrix(updateOM).then(() => onClose());
      })
      .catch(() => message.error('Invalid Observation Matrix Description.'));
  };

  const handleSubmit = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault();
    observationMatrix ? handleUpdate() : handleCreation();
  };

  return (
    <Modal
      title={title}
      onCancel={onClose}
      onOk={handleSubmit}
      visible={visible}
      okText={disabled ? 'Update Observation Matrix Description' : undefined}
    >
      <Form form={form} layout="vertical" className="Modal-Form">
        <Form.Item
          name="observationMatrixName"
          label="Name"
          initialValue={
            observationMatrix
              ? observationMatrix.observationMatrixName
              : undefined
          }
          rules={[
            { required: true, message: 'Enter a Observation Matrix name' },
            {
              max: 16,
              message: 'The name is too long'
            }
          ]}
        >
          <Input disabled={disabled} placeholder="Observation Matrix Name" />
        </Form.Item>

        <Form.Item
          name="observationMatrixDescription"
          label="Description"
          initialValue={
            observationMatrix
              ? observationMatrix.observationMatrixDescription
              : undefined
          }
          rules={[
            {
              required: false,
              message: 'Enter a Observation Matrix Description'
            }
          ]}
        >
          <Input placeholder="Observation Matrix Description" />
        </Form.Item>

        <Form.Item
          name="dataSource"
          label="Data Source"
          initialValue={observationMatrix ? observationMatrix.dataSource : null}
          rules={[{ required: true, message: 'Select a data source (DB)' }]}
        >
          <Select disabled={disabled}>
            {dataSources?.map((val: any) => (
              <Select.Option value={val} key={val}>
                {val}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="query"
          label="Query"
          initialValue={observationMatrix ? observationMatrix.query : undefined}
          rules={[{ required: true, message: 'Enter a query' }]}
        >
          <TextArea rows={4} disabled={disabled} placeholder="Your Query" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ObservationMatrixModal;
