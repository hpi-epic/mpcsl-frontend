import React from 'react';
import renderer from 'react-test-renderer';
import GraphViewRadioNavigation from './GraphViewRadioNavigation';
import { Routes } from '../../constants/routes';

const routes = [
  Routes.graphExplorerSelection,
  Routes.graphExplorerAnnotate,
  Routes.graphExplorerCausalExploration
];

describe('<GraphViewRadioNavigation />', () => {
  routes.forEach(route => {
    it(`renders correctly for route ${route}`, () => {
      const tree = renderer
        .create(
          <GraphViewRadioNavigation value={route} onChange={() => undefined} />
        )
        .toJSON();

      expect(tree).toMatchSnapshot();
    });
  });
});
