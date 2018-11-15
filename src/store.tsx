import { createStore } from 'redux';
import graphExplorer from './reducers';
import { StoreState } from './types/index';

const store = createStore<StoreState, any, any, any>(
  graphExplorer,
  // @ts-ignore
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);

export default store;
