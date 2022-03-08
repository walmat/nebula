import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import Store from 'electron-store';
import { persistReducer, persistStore, createMigrate } from 'redux-persist';
import createElectronStorage from 'redux-persist-electron-storage';
import rootReducer from '../reducers';
import migrations from '../migrations';

const configureStore = () => {
  // Redux Configuration
  const middleware = [];
  const enhancers = [];

  // Thunk Middleware
  middleware.push(thunk);

  // Apply Middleware & Compose Enhancers
  enhancers.push(applyMiddleware(...middleware));
  const enhancer: any = compose(...enhancers);

  const electronStore = new Store();

  const persistConfig = {
    key: 'root',
    version: 16,
    storage: createElectronStorage({ electronStore }),
    blacklist: ['User'],
    throttle: 1000,
    migrate: createMigrate(migrations as any)
  };
  const persistedReducer = persistReducer(persistConfig as any, rootReducer);
  const store: any = createStore(persistedReducer, undefined, enhancer);
  const persistor = persistStore(store);

  return { store, persistor };
};

export default { configureStore };
