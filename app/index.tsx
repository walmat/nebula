/* eslint global-require: off */

import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import Root from './components/App/Root';
import { configureStore } from './store/configureStore';

import './styles/scss/app.global.scss';

const MOUNT_POINT = document.getElementById('root');
const { store, persistor } = configureStore();

render(
  <AppContainer>
    <Root store={store} persistor={persistor} />
  </AppContainer>,
  MOUNT_POINT
);

if ((module as any).hot) {
  (module as any).hot.accept('./components/App/Root', () => {
    const NextRoot = require('./components/App/Root').default;
    render(
      <AppContainer>
        <NextRoot store={store} persistor={persistor} />
      </AppContainer>,
      MOUNT_POINT
    );
  });
}
