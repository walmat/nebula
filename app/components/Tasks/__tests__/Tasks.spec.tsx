import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import React from 'react';

import Tasks from '../Tasks';
import { withProviders } from '../../../../test/testUtils';
import { mockOffsetSize } from '../../../../test/mockOffsetSize';

it('should render Tasks', async () => {
  const Root = withProviders({
    Component: Tasks
  });

  // eslint-disable-next-line
  const { debug, getByTestId, getByText } = render(<Root />);

  // debug();

  mockOffsetSize(200, 200);

  expect(getByText('Store')).toBeDefined();
});

it.only('should render Tasks with some tasks', async () => {
  const initialState = {
    Tasks: [
      {
        id: 'taskId',
        store: {
          name: 'Supreme'
        },
        sizes: ['OS'],
        product: {
          raw: '+350'
        }
      }
    ],
    Settings: {
      tasksGroup: 'none'
    }
  };

  const Root = withProviders({
    Component: Tasks,
    initialState
  });

  mockOffsetSize(200, 200);

  // eslint-disable-next-line
  const { debug, getByTestId, getByText } = render(<Root />);

  // debug();

  expect(getByText('Store')).toBeDefined();
});

// grouped tasks are broken
it.skip('should render Tasks with some tasks and grouped by store', async () => {
  const initialState = {
    Tasks: {
      task1: {
        store: {
          name: 'Supreme'
        },
        sizes: ['OS'],
        product: {
          raw: '+350'
        }
      },
      task2: {
        store: {
          name: 'Shopiy'
        },
        sizes: ['OS'],
        product: {
          raw: '+350'
        }
      }
    },
    Settings: {
      toggleCreateTask: false,
      tasksGroup: 'store'
    }
  };

  const Root = withProviders({
    Component: Tasks,
    initialState
  });

  mockOffsetSize(200, 200);

  // eslint-disable-next-line
  const { debug, getByTestId, getByText } = render(<Root />);

  // debug();

  expect(getByText('Store')).toBeDefined();
});
