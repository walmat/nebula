import React from 'react';
import { Router } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import { createMemoryHistory } from 'history';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../app/store/reducers';
import Providers from '../app/components/App/Providers';

const configureStore = (history, initialState: object) => {
  const middleware = [];
  const enhancers = [];

  // Thunk Middleware
  middleware.push(thunk);

  // Logging Middleware
  // const logger = createLogger({
  //   level: 'info',
  //   collapsed: true
  // });
  //
  // middleware.push(logger);

  // Apply Middleware & Compose Enhancers
  enhancers.push(applyMiddleware(...middleware));
  const enhancer = compose(...enhancers);

  const store = createStore(rootReducer(), initialState, enhancer);

  return store;
};

type WithProviders = {
  initialState?: object;
  initialEntries?: string[];
  path?: string;
  Component?: React.ComponentType;
  routes?: any[];
  history?: History;
};
export const withProviders = ({
  initialEntries = ['/'],
  path = '/',
  Component,
  initialState,
  routes,
  history
}: WithProviders) => (props: any) => {
  const { routes: providedRoutes } = props;

  const defaultRoutes = [
    {
      name: 'test',
      path,
      component: Component,
      exact: true,
      routes: providedRoutes || []
    }
  ];

  const testRoutes = routes || defaultRoutes;

  const defaultHistory = createMemoryHistory({
    initialEntries
  });

  const testHistory = history || defaultHistory;

  return (
    <Providers store={configureStore(testHistory, initialState)}>
      <Router history={testHistory}>{renderRoutes(testRoutes, props)}</Router>
    </Providers>
  );
};
