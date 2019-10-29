import React from 'react';
import renderer from 'react-test-renderer';
import ViewRadioNavigation from './ViewRadioNavigation';
import { Routes } from '../../constants/routes';

const routes = [Routes.observationMatricesManager, Routes.experimentManager];

describe('<ViewRadioNavigation />', () => {
  routes.forEach(route => {
    it(`renders correctly for route ${route}`, () => {
      const tree = renderer
        .create(
          <ViewRadioNavigation value={route} onChange={() => undefined} />
        )
        .toJSON();

      expect(tree).toMatchSnapshot();
    });
  });
});
