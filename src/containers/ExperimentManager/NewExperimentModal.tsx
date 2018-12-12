import {
  Drawer,
  Form,
  Row,
  Input,
  Button,
  message,
  Select,
  InputNumber
} from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import React from 'react';
import { IDataset, IndepenceTests } from '../../types';
import { getDatasets, createExperiment } from '../../actions/apiRequests';

export interface IPropsNewExperimentModal extends FormComponentProps {
  visible: boolean;
  onClose: () => void;
  experiment: undefined | IFormExperiment;
  editDisabled: boolean;
}

interface IStateNewExperimentModal {
  hasErrors: boolean;
  datasets: Array<IDataset>;
}

export interface IFormExperiment {
  name: string;
  alpha: number;
  independence_test: string;
  cores: number;
  dataset_id: number;
}

class NewExperimentModal extends React.Component<
  IPropsNewExperimentModal,
  IStateNewExperimentModal
> {
  mounted = false;

  constructor(props: IPropsNewExperimentModal) {
    super(props);

    this.state = {
      hasErrors: true,
      datasets: []
    };
  }

  public componentDidMount = () => {
    this.mounted = true;
    this.getData();
    if(this.props.experiment && !this.props.editDisabled) {
      this.hasErrors();
    }
  };

  public componentWillUnmount = () => {
    this.mounted = false;
  };

  public render() {
    const { getFieldDecorator } = this.props.form;

    const datasetSelect = (
      <Select disabled={this.props.editDisabled} onChange={this.hasErrors}>
        {this.state.datasets.map((dataset: IDataset) => (
          <Select.Option value={dataset.id} key={String(dataset.id)}>
            {dataset.name}
          </Select.Option>
        ))}
      </Select>
    );

    const independenceTestSelect = (
      <Select disabled={this.props.editDisabled} onChange={this.hasErrors}>
        {Object.keys(IndepenceTests).map((key: any) => (
          <Select.Option value={IndepenceTests[key]} key={IndepenceTests[key]}>
            {IndepenceTests[key]}
          </Select.Option>
        ))}
      </Select>
    );

    const experimentNameEl = getFieldDecorator('name', {
      initialValue: this.props.experiment
        ? this.props.experiment.name
        : undefined,
      rules: [{ required: true, message: 'Enter a Experiment Name'}]
    })(<Input disabled={this.props.editDisabled} placeholder="Experiment Name" />);

    const datasetEl = getFieldDecorator('dataset_id', {
      initialValue: this.props.experiment
        ? this.props.experiment.dataset_id
        : undefined,
      rules: [{ required: true, message: 'Select a Dataset' }]
    })(datasetSelect);

    const alphaEl = getFieldDecorator('alpha', {
      initialValue: this.props.experiment ? this.props.experiment.alpha : undefined,
      rules: [{ required: true, message: 'Enter an Alpha value' }]
    })(<InputNumber disabled={this.props.editDisabled} onChange={this.hasErrors} placeholder="0" />);

    const independenceTestEl = getFieldDecorator('independence_test', {
      initialValue: this.props.experiment
        ? this.props.experiment.independence_test
        : IndepenceTests.gaussCI,
      rules: [{ required: true, message: 'Select an Indepent Test' }]
    })(independenceTestSelect);

    const coresEl = getFieldDecorator('cores', {
      initialValue: this.props.experiment ? this.props.experiment.cores : 1,
      rules: [{ required: true, message: 'Enter the Number of Cores' }]
    })(<InputNumber disabled={this.props.editDisabled} onChange={this.hasErrors} placeholder="0" min={0} step={1} />);

    return (
      <Drawer
        title={
          this.props.experiment
            ? `Experiment "${this.props.experiment.name}"`
            : 'Create new Experiment'
        }
        width={720}
        placement="right"
        onClose={this.props.onClose}
        visible={this.props.visible}
      >
        <Form
          layout="vertical"
          onSubmit={this.handleSubmit}
          onChange={this.hasErrors}
          className="Modal-Form"
        >
          <Row gutter={16}>
            <Form.Item label="Experiment Name" hasFeedback={true}>{experimentNameEl}</Form.Item>
            <Form.Item label="Dataset" hasFeedback={true}>
              {datasetEl}
            </Form.Item>
            <Form.Item label="Alpha" hasFeedback={true}>{alphaEl}</Form.Item>
            <Form.Item label="Independence Test" hasFeedback={true}>
              {independenceTestEl}
            </Form.Item>
            <Form.Item label="Cores">{coresEl}</Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                disabled={this.props.editDisabled ? true : this.state.hasErrors}
              >
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
    if (this.mounted) {
      this.setState({
        datasets: datasets
      });
    }
  }

  private handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    this.props.form.validateFields((err: Error, values: IFormExperiment) => {
      if (!err) {
        this.submitExperiment(values);
      } else {
        message.error('Set a required Values!');
      }
    });
  };

  private hasErrors = () => {
    this.props.form.validateFields((err: Error, values: IFormExperiment) => {
      if (err) {
        this.setState({
          hasErrors: true
        });
      } else {
        this.setState({
          hasErrors: false
        });
      }
    });
  };

  private submitExperiment = (values: IFormExperiment) => {
    createExperiment({
      dataset_id: values.dataset_id,
      name: values.name,
      parameters: {
        alpha: values.alpha,
        independence_test: values.independence_test,
        cores: values.cores
      }
    });
    this.props.onClose();
  };
}

export default NewExperimentModal;
