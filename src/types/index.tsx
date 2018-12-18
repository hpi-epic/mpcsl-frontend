export interface IStoreState {
  graph: any;
  subGraph: any;
}

export type StoreState = IStoreState | undefined;

export enum Routes {
  manager = '/manager',
  graphExplorer = '/graph-explorer',
  observationMatricesManager = '/manager/observationMatrices',
  projectManager = '/manager/projects',
  experimentManager = '/manager/experiments',
  runtimeManager = '/runtime',
}

export enum Endpoints {
  observationMatrix = '/dataset',
  observationMatrices = '/datasets',
  experiment = '/experiment',
  allExperiments = '/experiments',
  job = '/job',
  allJobs = '/jobs',
  results = '/results',
}

export enum IndepenceTests {
  gaussCI = 'gaussCI',
  diCI = 'dicCI',
  binCI = 'binCI'
}

export interface IObservationMatrix {
  id?: number;
  load_query: string,
  name: string
}

export interface IExperiment {
  observationMatrix_id: number;
  observationMatrix?: number;
  id?: number;
  name: string;
  parameters: {
    alpha: number;
    independence_test: string;
    cores: number;
  }
}
