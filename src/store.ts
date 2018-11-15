import { createStore } from 'redux';
import graphExplorer from './reducers';
import { StoreState } from './types/index';

const store = createStore<StoreState, any, any, any>(graphExplorer);

export default store;
