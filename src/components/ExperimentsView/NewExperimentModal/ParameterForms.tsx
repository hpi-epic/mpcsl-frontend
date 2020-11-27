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
      const commonProps = {
        key,
        editDisabled
      };
      switch (parameter.type) {
        case 'enum':
          return (
            <ParameterFormSelectElement
              {...commonProps}
              parameter={parameter}
              experimentParameters={experimentParameters}
            />
          );
        case 'str':
          return (
            <ParameterFormInputElement {...commonProps} parameter={parameter} />
          );
        case 'int':
        case 'float':
          return (
            <ParameterFormNumberElement
              {...commonProps}
              parameter={parameter}
              experimentParameters={experimentParameters}
            />
          );
      }
    })}
  </>
);

export default ParameterForms;
