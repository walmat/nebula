import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import React from 'react';

import ProxyCreateDialog from '../ProxyCreateDialog';
import { withProviders } from '../../../../../test/testUtils';

it('should render ProxyCreateDialog', async () => {
  const initialState = {
    Settings: {
      toggleCreateProxies: true
    }
  };

  const Root = withProviders({
    Component: ProxyCreateDialog,
    initialState
  });

  // eslint-disable-next-line
  const { debug, getByTestId, getByText } = render(<Root />);

  // debug();

  expect(getByText('Proxy Details')).toBeDefined();
});
