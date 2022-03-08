import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import React from 'react';

import Sidebar from '../Sidebar';
import { withProviders } from '../../../../test/testUtils';

it('should render Sidebar', async () => {
  const Root = withProviders({
    Component: Sidebar
  });

  // eslint-disable-next-line
  const { debug, getByTestId, getByText } = render(<Root />);

  expect(getByText('Proxies')).toBeDefined();
});
