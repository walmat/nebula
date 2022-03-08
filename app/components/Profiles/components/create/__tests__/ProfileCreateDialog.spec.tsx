import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import React from 'react';

import ProfileCreateDialog from '../ProfileCreateDialog';
import { withProviders } from '../../../../../../test/testUtils';

it('should render ProfileCreateDialog', async () => {
  const initialState = {
    Settings: {
      toggleCreateProfile: true
    }
  };

  const Root = withProviders({
    Component: ProfileCreateDialog,
    initialState
  });

  // eslint-disable-next-line
  const { debug, getByTestId, getByText } = render(<Root />);

  // debug();

  expect(getByText('Shipping Details')).toBeDefined();
});

it('should render ProfileCreateDialog and go to billing details', async () => {
  const initialState = {
    Settings: {
      toggleCreateProfile: true
    }
  };

  const Root = withProviders({
    Component: ProfileCreateDialog,
    initialState
  });

  // eslint-disable-next-line
  const { debug, getByTestId, getByText } = render(<Root />);

  // debug();

  const nextButton = getByText('Next').closest('button');
  fireEvent.click(nextButton);

  expect(getByText('Billing Details')).toBeDefined();
});

it('should render ProfileCreateDialog and go to payment details', async () => {
  const initialState = {
    Settings: {
      toggleCreateProfile: true
    }
  };

  const Root = withProviders({
    Component: ProfileCreateDialog,
    initialState
  });

  // eslint-disable-next-line
  const { debug, getByTestId, getByText } = render(<Root />);

  // debug();

  const nextButton = getByText('Next').closest('button');

  // go to shipping details
  fireEvent.click(nextButton);

  // go to payment details
  fireEvent.click(nextButton);

  expect(getByText('Payment Details')).toBeDefined();
});
