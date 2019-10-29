import { createStore, applyMiddleware, compose, Store } from 'redux';
import graphExplorer from './reducers';
import thunkMiddleware from 'redux-thunk';
import { StoreState } from './types/index';

export interface IState {
  graphExplorer: StoreState;
}

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store: Store<IState> = createStore(
  graphExplorer,
  composeEnhancers(applyMiddleware(thunkMiddleware))
);

export default store;
