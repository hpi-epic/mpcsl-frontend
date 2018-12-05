import { Drawer, Form, Row, Input, Button, message } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import React from 'react';
import axios, { AxiosResponse } from 'axios';
import { Endpoints } from '../../types';

export interface IPropsNewDatasetModal extends FormComponentProps {
  visible: boolean;
  onClose: () => void;
}

interface IFormData {
  datasetName: string;
  query: string;
}

class NewDatasetModal extends React.Component<IPropsNewDatasetModal, {}> {
  public render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Drawer
        title="Create new Dataset"
        width={720}
        placement="right"
        onClose={this.props.onClose}
        visible={this.props.visible}
      >
        <Form layout="vertical" onSubmit={this.handleSubmit}>
          <Row gutter={16}>
            <Form.Item label="Name">
              {getFieldDecorator('datasetName', {
                rules: [{ required: true, message: 'Enter a dataset name' }]
              })(<Input placeholder="Dataset Name" />)}
            </Form.Item>
            <Form.Item label="Query">
              {getFieldDecorator('query', {
                rules: [{ required: true, message: 'Enter a query' }]
              })(<Input.TextArea placeholder="Your Query" autosize={true} />)}
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Row>
        </Form>
      </Drawer>
    );
  }

  private handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    this.props.form.validateFields((err: Error, values: IFormData) => {
      if (!err) {
        this.submitDataset(values);
      } else {
        message.error('Set a Dataset Name and Query!');
      }
    });
  };

  private submitDataset = (values: IFormData) => {
    console.log(process.env.REACT_APP_API);
    axios
      .post(`${Endpoints.allDatasets}`, {
        load_query: values.query,
        name: values.datasetName
      })
      .then((value: AxiosResponse<any>) => {
        message.success('Submitted Dataset Sucessfully!');
      })
      .catch((e: any) => {
        message.error('Failed to submit Dataset!');
      })
  };
}

export default NewDatasetModal;
