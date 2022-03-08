import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import React from 'react';

import Harvesters from '../Harvesters';
import { withProviders } from '../../../../test/testUtils';

it('should render Harvesters', async () => {
  const Root = withProviders({
    Component: Harvesters
  });

  // eslint-disable-next-line
  const { debug, getByTestId, getByText } = render(<Root />);

  // debug();

  expect(getByText('No Harvesters')).toBeDefined();
});
