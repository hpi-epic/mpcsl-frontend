import React from 'react';
import { IParameters } from '../../types/types';
import ParameterFormInputElement from './ParameterFormInputElement';
import ParameterFormNumberElement from './ParameterFormNumberElement';
import ParameterFormSelectElement from './ParameterFormSelectElement';

interface Props {
  parameters: IParameters;
  editDisabled?: boolean;
  initialValues?: IParameters;
}

const ParameterForms: React.FC<Props> = ({
  parameters,
  editDisabled,
  initialValues: initialValues
}) => (
  <>
    {Object.keys(parameters).map(key => {
      const parameter = parameters[key];
      switch (parameter.type) {
        case 'enum':
          return (
            <ParameterFormSelectElement
              key={key}
              paramName={key}
              editDisabled={editDisabled}
              parameter={parameter}
              initialValues={initialValues}
            />
          );
        case 'str':
          return (
            <ParameterFormInputElement
              key={key}
              paramName={key}
              editDisabled={editDisabled}
              parameter={parameter}
            />
          );
        case 'int':
        case 'float':
          return (
            <ParameterFormNumberElement
              key={key}
              paramName={key}
              editDisabled={editDisabled}
              parameter={parameter}
              initialValues={initialValues}
            />
          );
        default:
          return <div key={key} />;
      }
    })}
  </>
);
ParameterForms.defaultProps = {
  editDisabled: false
};
export default ParameterForms;
