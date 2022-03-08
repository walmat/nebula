import React from 'react';
import { PersistGate } from 'redux-persist/integration/react';
import { HashRouter } from 'react-router-dom';
import Providers from './Providers';

import App from './App';

type Props = {
  store: any;
  persistor: any;
};

const Root = ({ store, persistor }: Props) => {
  return (
    <Providers store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <HashRouter>
          <App />
        </HashRouter>
      </PersistGate>
    </Providers>
  );
};

export default Root;
