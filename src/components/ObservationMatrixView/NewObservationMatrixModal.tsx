import { Form, Row, Input, message, Select, Modal } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import React from 'react';
import {
  createObservationMatrix,
  getAllAvailableDataSources
} from '../../restAPI/apiRequests';
import TextArea from 'antd/lib/input/TextArea';

export interface IPropsNewObservationMatrixModal extends FormComponentProps {
  visible: boolean;
  onClose: () => void;
  observationMatrix: undefined | IFormObservationMatrix;
}

interface IStateNewObservationMatrixModal {
  dataSources: any[];
}

export interface IFormObservationMatrix {
  observationMatrixName: string;
  observationMatrixDescription: string;
  query: string;
  dataSource: string;
}

class NewObservationMatrixModal extends React.Component<
  IPropsNewObservationMatrixModal,
  IStateNewObservationMatrixModal
> {
  public mounted = false;

  constructor(props: IPropsNewObservationMatrixModal) {
    super(props);

    this.state = {
      dataSources: []
    };
  }

  public componentDidMount = () => {
    this.mounted = true;
    this.getAvailableDataSources();
  };

  public componentWillUnmount = () => {
    this.mounted = false;
  };

  public render() {
    const { getFieldDecorator } = this.props.form;
    let disabled = false;
    if (typeof this.props.observationMatrix !== 'undefined') {
      disabled = true;
    }

    const observationMatrixNameEl = getFieldDecorator('observationMatrixName', {
      initialValue: this.props.observationMatrix
        ? this.props.observationMatrix.observationMatrixName
        : undefined,
      rules: [{ required: true, message: 'Enter a Observation Matrix name' }]
    })(<Input disabled={disabled} placeholder="Observation Matrix Name" />);

    const observationMatrixDescEl = getFieldDecorator(
      'observationMatrixDescription',
      {
        initialValue: this.props.observationMatrix
          ? this.props.observationMatrix.observationMatrixDescription
          : undefined,
        rules: [
          {
            required: false,
            message: 'Enter a Observation Matrix Description'
          }
        ]
      }
    )(
      <Input disabled={disabled} placeholder="Observation Matrix Description" />
    );

    const observationMatrixQueryEl = getFieldDecorator('query', {
      initialValue: this.props.observationMatrix
        ? this.props.observationMatrix.query
        : undefined,
      rules: [{ required: true, message: 'Enter a query' }]
    })(<TextArea rows={4} disabled={disabled} placeholder="Your Query" />);

    const observationMatrixRemoteDBEl = getFieldDecorator('dataSource', {
      initialValue: this.props.observationMatrix
        ? this.props.observationMatrix.dataSource
        : null,
      rules: [{ required: true, message: 'Select a data source (DB)' }]
    })(
      <Select disabled={disabled}>
        {this.state.dataSources.map((val: any) => (
          <Select.Option value={val} key={val}>
            {val}
          </Select.Option>
        ))}
      </Select>
    );

    const title = this.props.observationMatrix
      ? `Observation Matrix “${this.props.observationMatrix.observationMatrixName}“`
      : 'Create new Observation Matrix';

    return (
      <Modal
        title={title}
        onCancel={this.props.onClose}
        onOk={this.handleSubmit}
        visible={this.props.visible}
        okButtonProps={{ disabled: disabled }}
      >
        <Form layout="vertical" className="Modal-Form">
          <Row gutter={16}>
            <Form.Item label="Name">{observationMatrixNameEl}</Form.Item>
            <Form.Item label="Description">{observationMatrixDescEl}</Form.Item>
            <Form.Item label="Data Source">
              {observationMatrixRemoteDBEl}
            </Form.Item>
            <Form.Item label="Query">{observationMatrixQueryEl}</Form.Item>
          </Row>
        </Form>
      </Modal>
    );
  }

  private handleSubmit = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault();
    this.props.form.validateFields(
      (err: Error, values: IFormObservationMatrix) => {
        if (!err) {
          this.submitObservationMatrix(values);
        } else {
          message.error(
            'Set a Observation Matrix Name and Query and select a Data Source from the list.'
          );
        }
      }
    );
  };

  private submitObservationMatrix = (values: IFormObservationMatrix) => {
    createObservationMatrix({
      load_query: values.query,
      name: values.observationMatrixName,
      description: values.observationMatrixDescription,
      data_source: values.dataSource
    })
      .then(() => {
        this.props.onClose();
      })
      .catch(error => {
        if (error.status !== 400) {
          this.props.onClose();
        }
      });
  };

  private async getAvailableDataSources() {
    const dataSources = await getAllAvailableDataSources();
    if (this.mounted) {
      this.setState({
        dataSources
      });
    }
  }
}

export default NewObservationMatrixModal;
