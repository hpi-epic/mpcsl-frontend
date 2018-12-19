export interface IStoreState {
  graph: any;
  subGraph: any;
}

export type StoreState = IStoreState | undefined;

export enum Routes {
  manager = '/manager',
  graphExplorer = '/graph-explorer',
  observationMatricesManager = '/manager/observationMatrices',
  experimentManager = '/manager/experiments',
  runtimeManager = '/runtime',
}

const baseApiUrl = '/api';

export const Endpoints = {
  observationMatrix: baseApiUrl + '/dataset',
  observationMatrices: baseApiUrl + '/datasets',
  experiment: baseApiUrl + '/experiment',
  allExperiments: baseApiUrl + '/experiments',
  job: baseApiUrl + '/job',
  allJobs: baseApiUrl + '/jobs',
  results: baseApiUrl + '/results',
};

export enum IndepenceTests {
  gaussCI = 'gaussCI',
  diCI = 'dicCI',
  binCI = 'binCI'
};

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
