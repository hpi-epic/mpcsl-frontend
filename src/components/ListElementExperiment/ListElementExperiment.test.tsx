import React from 'react';
import renderer from 'react-test-renderer';
import ListElementExperiment from './ListElementExperiment';

describe('<ListElementExperiment />', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(
        <ListElementExperiment
          title='Test Title'
          status='success'
          statusText='done'
          content='Test Content'
          onDelete={() => undefined}
          onDuplicate={() => undefined}
          onRunStart={() => undefined}
          onExplore={() => undefined}
          onView={() => undefined}
          onShowDetails={() => undefined}
        />,
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
