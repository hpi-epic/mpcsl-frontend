import { Drawer, Form, Row, Input, Button, message, Select, InputNumber } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import React from 'react';
import { IDataset, IndepenceTests } from '../../types';
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
      hasErrors: true,
      datasets: [],
    };
  }

  public componentDidMount = () => {
    this.getData();
  }

  public render() {
    const { getFieldDecorator } = this.props.form;

    const datasetSelect = (
      <Select>
        {this.state.datasets.map((dataset: IDataset) => (
            <Select.Option value={dataset.id} key={String(dataset.id)}>{dataset.name}</Select.Option>
          )
        )}
      </Select>
    );

    const independenceTestSelect = (
      <Select>
        {Object.keys(IndepenceTests).map((key: any) => (
          <Select.Option value={IndepenceTests[key]} key={key}>{key}</Select.Option>
        ))}
      </Select>
    )

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
            <Form.Item label="Experiment Name">
              {getFieldDecorator('ExperimentName', {
                rules: [{ required: true, message: 'Enter a Experiment Name' }],
              })(<Input placeholder="Experiment Name" />)}
            </Form.Item>
            <Form.Item label="Dataset" hasFeedback={true}>
              {getFieldDecorator('dataset', {
                rules: [{ required: true, message: 'Select a Dataset' }]
              })(datasetSelect)}
            </Form.Item>
            <Form.Item label="Alpha">
              {getFieldDecorator('alphaParameter', {
                rules: [{ required: true, message: 'Enter a Alpha value'}]
              })(<InputNumber placeholder='0' />)}
            </Form.Item>
            <Form.Item label="Independence Test">
              {getFieldDecorator('independenceTest', {
                rules: [{ required: true, message: 'Enter a Independence Test value'}]
              })(independenceTestSelect)}
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
    ;
  };
}

export default NewExperimentModal;
