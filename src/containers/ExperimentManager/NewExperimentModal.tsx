import { Drawer, Form, Row, Input, Button, message } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import React from 'react';
import axios, { AxiosResponse } from 'axios';
import { Endpoints, IDataset } from '../../types';
import { getDatasets } from '../../actions/apiRequests';

export interface IPropsNewExperimentModal extends FormComponentProps {
  visible: boolean;
  onClose: () => void;
}

interface IStateNewExperimentModal {
  hasErrors: boolean;
  datasets: Array<IDataset>;
}

interface IFormData {
  datasetName: string;
  query: string;
}

class NewExperimentModal extends React.Component<
  IPropsNewExperimentModal,
  IStateNewExperimentModal
> {
  constructor(props: IPropsNewExperimentModal) {
    super(props);

    this.state = {
      hasErrors: false,
      datasets: [],
    };
  }

  public componentDidMount = () => {
    this.getData();
  }

  public render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Drawer
        title="Create new Experiment"
        width={720}
        placement="right"
        onClose={this.props.onClose}
        visible={this.props.visible}
      >
        <Form layout="vertical" onSubmit={this.handleSubmit} onChange={this.hasErrors}>
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
              <Button type="primary" htmlType="submit" disabled={this.state.hasErrors}>
                Submit
              </Button>
            </Form.Item>
          </Row>
        </Form>
      </Drawer>
    );
  }

  private async getData() {
    const datasets = await getDatasets();
    this.setState({
      datasets: datasets
    });
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

  private hasErrors = () => {
    this.props.form.validateFields((err: Error, values: IFormData) => {
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

  private submitDataset = (values: IFormData) => {
    axios
      .post(`${Endpoints.allDatasets}`, {
        load_query: values.query,
        name: values.datasetName
      })
      .then((value: AxiosResponse<any>) => {
        message.success('Experiment was sucessfully submitted!');
      })
      .catch((e: any) => {
        message.error('Failed to submit Experiment!');
      });
  };
}

export default NewExperimentModal;
