import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import Store from 'electron-store';
import { persistReducer, persistStore, createMigrate } from 'redux-persist';
import createElectronStorage from 'redux-persist-electron-storage';
import { createLogger } from 'redux-logger';
import rootReducer from '../reducers';
import migrations from '../migrations';

const configureStore = () => {
  // Redux Configuration
  const middleware = [];
  const enhancers = [];

  // Thunk Middleware
  middleware.push(thunk);

  // Logging Middleware
  const logger = createLogger({
    level: 'info',
    collapsed: true
  });

  // Skip redux logs in console during the tests
  if (process.env.NODE_ENV !== 'test') {
    middleware.push(logger);
  }

  // If Redux DevTools Extension is installed use it, otherwise use Redux compose
  /* eslint-disable no-underscore-dangle */
  const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : compose;

  // Apply Middleware & Compose Enhancers
  enhancers.push(applyMiddleware(...middleware));
  const enhancer = composeEnhancers(...enhancers);

  const electronStore = new Store();

  const persistConfig = {
    key: 'root',
    version: 16,
    storage: createElectronStorage({ electronStore }),
    debug: true,
    blacklist: ['User'],
    throttle: 1000,
    migrate: createMigrate(migrations as any, { debug: true })
  };
  const persistedReducer = persistReducer(persistConfig as any, rootReducer);

  // Create Store
  const store: any = createStore(persistedReducer, undefined, enhancer);
  const persistor = persistStore(store);

  if ((module as any).hot) {
    // eslint-disable-next-line global-require
    const nextRootReducer = require('../reducers');
    const nextPersistedReducer = persistReducer(
      persistConfig as any,
      nextRootReducer
    );
    (module as any).hot.accept('../reducers', () =>
      store.replaceReducer(nextPersistedReducer)
    );
  }

  return { store, persistor };
};

export default { configureStore };
