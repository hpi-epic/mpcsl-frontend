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
import { IObservationMatrix, IAlgorithm } from '../../types';
import {
  getObservationMatrices,
  createExperiment,
  getAllAlgorithms,
} from '../../actions/apiRequests';

export interface IPropsNewExperimentModal extends FormComponentProps {
  visible: boolean;
  onClose: () => void;
  experiment: undefined | IFormExperiment;
  editDisabled: boolean;
}

interface IStateNewExperimentModal {
  observationMatrices: IObservationMatrix[];
  algorithms: IAlgorithm[];
  selectedAlgorithm: IAlgorithm | undefined;
}

export interface IFormExperiment {
  [name: string]: any;
}

class NewExperimentModal extends React.Component<
  IPropsNewExperimentModal,
  IStateNewExperimentModal
> {
  public mounted = false;

  constructor(props: IPropsNewExperimentModal) {
    super(props);

    this.state = {
      observationMatrices: [],
      algorithms: [],
      selectedAlgorithm: undefined,
    };
  }

  public componentDidMount = () => {
    this.mounted = true;
    this.fetchObservationMatrices();
    this.fetchAlgorithms();
  }

  public componentWillUnmount = () => {
    this.mounted = false;
  }

  public render() {
    const { getFieldDecorator } = this.props.form;

    const observationMatrixSelect = (
      <Select disabled={this.props.editDisabled}>
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

    const algorithmsSelect = (
      <Select
        disabled={this.props.editDisabled}
        onSelect={(algId) => this.setSelectedAlgo(algId)}
      >
        {this.state.algorithms.map(
          (algorithm: IAlgorithm) => (
            <Select.Option
              value={algorithm.id}
              key={String(algorithm.id)}
            >
              {algorithm.name}
            </Select.Option>
          ),
        )}
      </Select>
    );

    const experimentNameEl = getFieldDecorator('name', {
      initialValue: this.props.experiment
        ? this.props.experiment.name
        : undefined,
      rules: [{ required: true, message: 'Enter a Experiment Name' }],
    })(
      <Input
        disabled={this.props.editDisabled}
        placeholder='Experiment Name'
      />,
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

    const algorithmsEl = getFieldDecorator('algorithm_id', {
      initialValue: this.props.experiment
        ? this.props.experiment.algorithm_id
        : undefined,
      rules: [{ required: true, message: 'Select a Algorithm' }],
    })(algorithmsSelect);

    return (
      <Drawer
        title={
          this.props.experiment
            ? `Experiment "${this.props.experiment.name}"`
            : 'Create new Experiment'
        }
        width={310}
        placement='right'
        onClose={this.props.onClose}
        visible={this.props.visible}
      >
        <Form
          layout='vertical'
          onSubmit={this.handleSubmit}
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
            <Form.Item label='Algorithm Selection' hasFeedback={true}>
              {algorithmsEl}
            </Form.Item>
            {this.createFormElementForParameters()}
            <Form.Item>
              <Button
                type='primary'
                htmlType='submit'
                disabled={this.props.editDisabled}
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

  private async fetchAlgorithms() {
    const algorithms = await getAllAlgorithms();
    if (this.mounted) {
      this.setState({
        algorithms,
      });
      if (this.props.experiment && this.props.experiment!.algorithm_id) {
        this.setSelectedAlgo(this.props.experiment!.algorithm_id);
      }
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

  private submitExperiment = (values: IFormExperiment) => {
    const keyList = Object.keys(this.state.selectedAlgorithm!.valid_parameters);
    const params: {[name: string]: any} = {};
    keyList.forEach((key: any) => {
      params[key] = values[key];
    });
    createExperiment({
      dataset_id: values.observationMatrix_id,
      name: values.name,
      description: values.description,
      algorithm_id: values.algorithm_id,
      parameters: params,
    });
    this.props.onClose();
  }

  private setSelectedAlgo = (algorithmId: any) => {
    this.state.algorithms.forEach((algorithm: IAlgorithm) => {
      if (algorithm.id === algorithmId) {
        const selectedAlgorithm = algorithm;
        this.setState({
          selectedAlgorithm,
        });
      }
    });
  }

  private createFormElementForParameters = () => {
    if (this.state.selectedAlgorithm !== undefined && this.state.selectedAlgorithm.valid_parameters) {
      return Object.keys(this.state.selectedAlgorithm.valid_parameters).map((key: string) => {
        const parameter = this.state.selectedAlgorithm!.valid_parameters[key];
        return (
          <Form.Item label={key} key={key} hasFeedback={true}>
          {parameter.type === 'enum' ? this.createSelectElement(key, parameter)
          : this.createInputElement(key, parameter)}</Form.Item>
        );
      });
    }
  }

  private createInputElement = (key: string, parameter: any) => {
    const { getFieldDecorator } = this.props.form;
    return getFieldDecorator(key, {
      initialValue: this.props.experiment
        ? this.props.experiment.parameters[key]
        : (parameter.required ? null : (parameter.minimum  !== undefined ? parameter.minimum
          : (parameter.default !== undefined ? parameter.default : 0))),
      rules: [{ required: parameter.required, message: `Enter ${key} value` }],
    })(
    <InputNumber
        disabled={this.props.editDisabled}
        min={parameter.minimum !== undefined ? parameter.minimum : undefined}
        max={parameter.maximum !== undefined ? parameter.maximum : undefined}
        step={parameter.type === 'float' ? 0.01 : 1}
    />,
    );
  }

  private createSelectElement = (key: string, parameter: any) => {
    const { getFieldDecorator } = this.props.form;
    return getFieldDecorator(key, {
      initialValue: this.props.experiment !== undefined
        ? this.props.experiment.parameters[key]
        : undefined,
      rules: [{ required: parameter.required, message: `Enter ${key} value` }],
    })(
    <Select
      disabled={this.props.editDisabled}
    >
      {Object.keys(parameter.values).map(
        (val: any) => (
          <Select.Option
            value={parameter.values[val]}
            key={parameter.values[val]}
          >
          {parameter.values[val]}
          </Select.Option>
        ),
      )}
    </Select>,
    );
  }
}

export default NewExperimentModal;
