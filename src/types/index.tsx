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
  diCI = 'dicCI',
  binCI = 'binCI'
}

export interface IDataset {
  id: number;
  load_query: string,
  name: string
}
