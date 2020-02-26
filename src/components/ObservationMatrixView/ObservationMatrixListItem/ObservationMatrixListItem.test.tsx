import React from 'react';
import renderer from 'react-test-renderer';
import { ObservationMatrixListItem } from './ObservationMatrixListItem';
import { MemoryRouter } from 'react-router-dom';

describe('<ListElementExperiment />', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(
        <MemoryRouter>
          <ObservationMatrixListItem
            id={0}
            load_query="SELECT * FROM DUMMY"
            name="test"
            onClick={() => undefined}
          />
        </MemoryRouter>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
