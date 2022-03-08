import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import React from 'react';

import TaskCreateDialog from '../TaskCreateDialog';
import { withProviders } from '../../../../../../test/testUtils';

it('should render TaskCreateDialog', async () => {
  const initialState = {
    Settings: {
      toggleCreateTask: true
    }
  };

  const Root = withProviders({
    Component: TaskCreateDialog,
    initialState
  });

  // eslint-disable-next-line
  const { debug, getByTestId, getByText } = render(<Root />);

  // debug();

  expect(getByText('Task Details')).toBeDefined();
});
