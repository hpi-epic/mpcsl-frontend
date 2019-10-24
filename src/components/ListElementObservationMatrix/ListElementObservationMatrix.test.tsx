import React from 'react';
import renderer from 'react-test-renderer';
import ListElementObservationMatrix from './ListElementObservationMatrix';

describe('<ListElementObservationMatrix />', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(
        <ListElementObservationMatrix
          title="Test ObservationMatrix"
          content="A Test ObeservationMatrix"
          onDelete={() => undefined}
          onView={() => undefined}
        />
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
