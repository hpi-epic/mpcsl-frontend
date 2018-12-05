export interface IStoreState {
  graph: any;
  subGraph: any;
}

export type StoreState = IStoreState | undefined;

export enum Routes {
  manager = '/manager',
  graphExplorer = '/graph-explorer',
  datasetManager = '/manager/dataset',
  projectManager = '/manager/',
  runtimeManager = '/runtime',
}
