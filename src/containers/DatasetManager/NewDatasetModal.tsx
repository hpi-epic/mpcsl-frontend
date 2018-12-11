import { Drawer, Form, Row, Input, Button, message } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import React from 'react';
import axios, { AxiosResponse } from 'axios';
import { Endpoints } from '../../types';

export interface IPropsNewDatasetModal extends FormComponentProps {
  visible: boolean;
  onClose: () => void;
  dataset: undefined | IFormDataset;
}

interface IStateNewDatasetModal {
  hasErrors: boolean;
}

export interface IFormDataset {
  datasetName: string;
  query: string;
}

class NewDatasetModal extends React.Component<
  IPropsNewDatasetModal,
  IStateNewDatasetModal
> {
  constructor(props: IPropsNewDatasetModal) {
    super(props);

    this.state = {
      hasErrors: false,
    };
  }

  public render() {
    const { getFieldDecorator } = this.props.form;
    let disabled = false;
    if ( typeof this.props.dataset !== 'undefined' ) {
      disabled = true;
    }

    const datasetNameEl = getFieldDecorator('datasetName', {
      initialValue: this.props.dataset ? this.props.dataset.datasetName : undefined,
      rules: [{ required: true, message: 'Enter a dataset name' }]
    })(<Input disabled={disabled} placeholder="Dataset Name" />);

    const datasetQueryEl = getFieldDecorator('Query', {
      initialValue: this.props.dataset ? this.props.dataset.query : undefined,
      rules: [{ required: true, message: 'Enter a query' }]
    })(<Input disabled={disabled} placeholder="Your Query" />);

    const title = this.props.dataset ? `Dataset “${this.props.dataset.datasetName}“` : 'Create new Dataset';

    return (
      <Drawer
        title={title}
        width={720}
        placement="right"
        onClose={this.props.onClose}
        visible={this.props.visible}
      >
        <Form 
          layout="vertical" 
          onSubmit={this.handleSubmit} 
          onChange={this.hasErrors}
        >
          <Row gutter={16}>
            <Form.Item label="Name">
              {datasetNameEl}
            </Form.Item>
            <Form.Item label="Query">
              {datasetQueryEl}
            </Form.Item>
            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                disabled={this.props.dataset ? true : this.state.hasErrors}
              >
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
    this.props.form.validateFields((err: Error, values: IFormDataset) => {
      if (!err) {
        this.submitDataset(values);
      } else {
        message.error('Set a Dataset Name and Query!');
      }
    });
  };

  private hasErrors = () => {
    this.props.form.validateFields((err: Error, values: IFormDataset) => {
      if(err) {
        this.setState({
          hasErrors: true,
        })
      } else {
        this.setState({
          hasErrors: false,
        })
      }
    });
  };

  private submitDataset = (values: IFormDataset) => {
    axios
      .post(`${Endpoints.allDatasets}`, {
        load_query: values.query,
        name: values.datasetName
      })
      .then((value: AxiosResponse<any>) => {
        message.success('Dataset was sucessfully submitted!');
      })
      .catch((e: any) => {
        message.error('Failed to submit Dataset!');
      });
  };
}

export default NewDatasetModal;
