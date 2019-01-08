import { Drawer, Form, Row, Input, Button, message } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import React from 'react';
import { createObservationMatrix } from '../../actions/apiRequests';

export interface IPropsNewObservationMatrixModal extends FormComponentProps {
  visible: boolean;
  onClose: () => void;
  observationMatrix: undefined | IFormObservationMatrix;
}

interface IStateNewObservationMatrixModal {
  hasErrors: boolean;
}

export interface IFormObservationMatrix {
  observationMatrixName: string;
  observationMatrixDescription: string;
  query: string;
}

class NewObservationMatrixModal extends React.Component<
  IPropsNewObservationMatrixModal,
  IStateNewObservationMatrixModal
> {
  constructor(props: IPropsNewObservationMatrixModal) {
    super(props);

    this.state = {
      hasErrors: false,
    };
  }

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
      rules: [{ required: true, message: 'Enter a Observation Matrix name' }],
    })(<Input disabled={disabled} placeholder='Observation Matrix Name' />);

    const observationMatrixDescEl = getFieldDecorator('observationMatrixDescription', {
      initialValue: this.props.observationMatrix
        ? this.props.observationMatrix.observationMatrixDescription
        : undefined,
      rules: [{ required: false, message: 'Enter a Observation Matrix Description' }],
    })(<Input disabled={disabled} placeholder='Observation Matrix Description' />);

    const observationMatrixQueryEl = getFieldDecorator('query', {
      initialValue: this.props.observationMatrix
        ? this.props.observationMatrix.query
        : undefined,
      rules: [{ required: true, message: 'Enter a query' }],
    })(<Input disabled={disabled} placeholder='Your Query' />);

    const title = this.props.observationMatrix
      ? `Observation Matrix “${
          this.props.observationMatrix.observationMatrixName
        }“`
      : 'Create new Observation Matrix';

    return (
      <Drawer
        title={title}
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
            <Form.Item label='Name'>{observationMatrixNameEl}</Form.Item>
            <Form.Item label='Description'>{observationMatrixDescEl}</Form.Item>
            <Form.Item label='Query'>{observationMatrixQueryEl}</Form.Item>
            <Form.Item>
              <Button
                type='primary'
                htmlType='submit'
                disabled={
                  this.props.observationMatrix ? true : this.state.hasErrors
                }
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
    this.props.form.validateFields(
      (err: Error, values: IFormObservationMatrix) => {
        if (!err) {
          this.submitObservationMatrix(values);
        } else {
          message.error('Set a Observation Matrix Name and Query!');
        }
      },
    );
  }

  private hasErrors = () => {
    this.props.form.validateFields(
      (err: Error, values: IFormObservationMatrix) => {
        if (err) {
          this.setState({
            hasErrors: true,
          });
        } else {
          this.setState({
            hasErrors: false,
          });
        }
      },
    );
  }

  private submitObservationMatrix = (values: IFormObservationMatrix) => {
    createObservationMatrix({
      load_query: values.query,
      name: values.observationMatrixName,
      description: values.observationMatrixDescription,
    });
    this.props.onClose();
  }
}

export default NewObservationMatrixModal;
