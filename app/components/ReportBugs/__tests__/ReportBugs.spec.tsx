import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import React from 'react';

import ReportBugs from '../index';
import { withProviders } from '../../../../test/testUtils';

const news = [
  {
    _id: '5e4e11261c9d440000d10758',
    id: '277f561b-928a-40d1-af5b-dca9ea765e1c',
    date: 1582174646797,
    message:
      'The time has finally come.. Close your eyes and take a deep breath. Now open them. Welcome to family. Welcome to Omega.',
    type: 'UPDATE'
  }
];

beforeEach(() => {
  fetchMock.resetMocks();
});

it('should render ReportBugs', async () => {
  fetchMock.mockIf(/^https?:\/\/nebula-auth.herokuapp.com.*$/, async req => {
    if (req.url.endsWith('/news')) {
      return {
        body: JSON.stringify(news)
      };
    }
    if (req.url.endsWith('/checkouts')) {
      return {
        body: JSON.stringify([])
      };
    }
    return {
      status: 404,
      body: 'Not Found'
    };
  });

  const Root = withProviders({
    Component: ReportBugs
  });

  // eslint-disable-next-line
  const { debug, getByTestId, getByText } = render(<Root />);

  // debug();

  expect(getByText('OPEN EMAIL CLIENT')).toBeDefined();
});
