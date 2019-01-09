import {
  Drawer,
  Form,
  Row,
  Input,
  Button,
  message,
  Select,
  InputNumber,
} from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import React from 'react';
import { IObservationMatrix } from '../../types';
import {
  getObservationMatrices,
  createExperiment,
} from '../../actions/apiRequests';
import { IndepenceTests } from '../../constants/experiment';

export interface IPropsNewExperimentModal extends FormComponentProps {
  visible: boolean;
  onClose: () => void;
  experiment: undefined | IFormExperiment;
  editDisabled: boolean;
}

interface IStateNewExperimentModal {
  hasErrors: boolean;
  observationMatrices: IObservationMatrix[];
}

export interface IFormExperiment {
  name: string;
  description: string;
  alpha: number;
  independence_test: string;
  cores: number;
  observationMatrix_id: number;
}

class NewExperimentModal extends React.Component<
  IPropsNewExperimentModal,
  IStateNewExperimentModal
> {
  public mounted = false;

  constructor(props: IPropsNewExperimentModal) {
    super(props);

    this.state = {
      hasErrors: true,
      observationMatrices: [],
    };
  }

  public componentDidMount = () => {
    this.mounted = true;
    this.fetchObservationMatrices();
    if (this.props.experiment && !this.props.editDisabled) {
      this.hasErrors();
    }
  }

  public componentWillUnmount = () => {
    this.mounted = false;
  }

  public render() {
    const { getFieldDecorator } = this.props.form;

    const observationMatrixSelect = (
      <Select disabled={this.props.editDisabled} onChange={this.hasErrors}>
        {this.state.observationMatrices.map(
          (observationMatrix: IObservationMatrix) => (
            <Select.Option
              value={observationMatrix.id}
              key={String(observationMatrix.id)}
            >
              {observationMatrix.name}
            </Select.Option>
          ),
        )}
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
      rules: [{ required: true, message: 'Enter a Experiment Name' }],
    })(
      <Input disabled={this.props.editDisabled} placeholder='Experiment Name' />,
    );

    const experimentDescEl = getFieldDecorator('description', {
      initialValue: this.props.experiment
        ? this.props.experiment.description
        : undefined,
      rules: [{ required: false, message: 'Enter a Experiment Description' }],
    })(
      <Input
        disabled={this.props.editDisabled}
        placeholder='Experiment Description'
      />,
    );

    const observationMatrixEl = getFieldDecorator('observationMatrix_id', {
      initialValue: this.props.experiment
        ? this.props.experiment.observationMatrix_id
        : undefined,
      rules: [{ required: true, message: 'Select a Observation Matrix' }],
    })(observationMatrixSelect);

    const alphaEl = getFieldDecorator('alpha', {
      initialValue: this.props.experiment
        ? this.props.experiment.alpha
        : undefined,
      rules: [{ required: true, message: 'Enter an Alpha value' }],
    })(
      <InputNumber
        disabled={this.props.editDisabled}
        onChange={this.hasErrors}
        placeholder='0'
      />,
    );

    const independenceTestEl = getFieldDecorator('independence_test', {
      initialValue: this.props.experiment
        ? this.props.experiment.independence_test
        : IndepenceTests.gaussCI,
      rules: [{ required: true, message: 'Select an Indepent Test' }],
    })(independenceTestSelect);

    const coresEl = getFieldDecorator('cores', {
      initialValue: this.props.experiment ? this.props.experiment.cores : 1,
      rules: [{ required: true, message: 'Enter the Number of Cores' }],
    })(
      <InputNumber
        disabled={this.props.editDisabled}
        onChange={this.hasErrors}
        placeholder='0'
        min={0}
        step={1}
      />,
    );

    return (
      <Drawer
        title={
          this.props.experiment
            ? `Experiment "${this.props.experiment.name}"`
            : 'Create new Experiment'
        }
        width={720}
        placement='right'
        onClose={this.props.onClose}
        visible={this.props.visible}
      >
        <Form
          layout='vertical'
          onSubmit={this.handleSubmit}
          onChange={this.hasErrors}
          className='Modal-Form'
        >
          <Row gutter={16}>
            <Form.Item label='Experiment Name' hasFeedback={true}>
              {experimentNameEl}
            </Form.Item>
            <Form.Item label='Experiment Description' hasFeedback={true}>
              {experimentDescEl}
            </Form.Item>
            <Form.Item label='Observation Matrix' hasFeedback={true}>
              {observationMatrixEl}
            </Form.Item>
            <Form.Item label='Alpha' hasFeedback={true}>
              {alphaEl}
            </Form.Item>
            <Form.Item label='Independence Test' hasFeedback={true}>
              {independenceTestEl}
            </Form.Item>
            <Form.Item label='Cores'>{coresEl}</Form.Item>
            <Form.Item>
              <Button
                type='primary'
                htmlType='submit'
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

  private async fetchObservationMatrices() {
    const observationMatrices = await getObservationMatrices();
    if (this.mounted) {
      this.setState({
        observationMatrices,
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
  }

  private hasErrors = () => {
    this.props.form.validateFields((err: Error, values: IFormExperiment) => {
      if (err) {
        this.setState({
          hasErrors: true,
        });
      } else {
        this.setState({
          hasErrors: false,
        });
      }
    });
  }

  private submitExperiment = (values: IFormExperiment) => {
    createExperiment({
      dataset_id: values.observationMatrix_id,
      name: values.name,
      description: values.description,
      parameters: {
        alpha: values.alpha,
        independence_test: values.independence_test,
        cores: values.cores,
      },
    });
    this.props.onClose();
  }
}

export default NewExperimentModal;
