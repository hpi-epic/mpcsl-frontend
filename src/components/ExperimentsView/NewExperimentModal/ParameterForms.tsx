import React from 'react';
import { IParameters } from '../../../types/types';
import ParameterFormInputElement from './ParameterFormInputElement';
import ParameterFormNumberElement from './ParameterFormNumberElement';
import ParameterFormSelectElement from './ParameterFormSelectElement';

interface Props {
  parameters: IParameters;
  editDisabled: boolean;
  experimentParameters?: IParameters;
}

const ParameterForms: React.FC<Props> = ({
  parameters,
  editDisabled,
  experimentParameters
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
              experimentParameters={experimentParameters}
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
              experimentParameters={experimentParameters}
            />
          );
        default:
          return <div key={key} />;
      }
    })}
  </>
);

export default ParameterForms;
