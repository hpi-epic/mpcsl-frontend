import {
  createStore,
  applyMiddleware,
  combineReducers,
  compose,
  Store,
} from 'redux';
import graphExplorer from './reducers';
import thunkMiddleware from 'redux-thunk';
import { StoreState } from './types/index';

export interface IState {
  graphExplorer: StoreState;
}

const store: Store<IState> = createStore(
  graphExplorer,
  compose(
    applyMiddleware(thunkMiddleware),
    // @ts-ignore
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  ),
);

export default store;
