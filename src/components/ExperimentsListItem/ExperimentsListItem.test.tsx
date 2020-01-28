import React from 'react';
import renderer from 'react-test-renderer';
import { ExperimentsListItem } from './ExperimentsListItem';
import { MemoryRouter } from 'react-router-dom';

describe('<ListElementExperiment />', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(
        <MemoryRouter>
          <ExperimentsListItem
            dataset_id={0}
            id={0}
            name="test"
            algorithm_id={0}
            parameters={{}}
            onDuplicate={() => undefined}
            onView={() => undefined}
          />
        </MemoryRouter>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
