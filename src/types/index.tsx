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

export enum Endpoints {
  dataset = '/dataset',
  allDatasets = '/datasets',
  experiment = '/experiment',
  allExperiments = '/experiments',
  job = '/job',
  allJobs = '/jobs',
  results = '/results'
}

export enum IndepenceTests {
  gaussCI = 'gaussCI',
  disCI = 'disCI',
  binCI = 'binCI'
}

export interface IDataset {
  id: number;
  load_query: string,
  name: string
}

export interface IExperiment {
  dataset_id: number;
  dataset?: number;
  name: string;
  parameters: {
    alpha: number;
    independence_test: string;
    cores: number;
  }
}
