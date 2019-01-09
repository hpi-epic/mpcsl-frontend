import { IAPIGraphNode, IAPIGraphEdges } from './graphTypes';

export interface IStoreState {
  graph: any;
  selectedGraph: any;
  nodes: string[];
  doFreeze: boolean;
}

export type StoreState = IStoreState | undefined;

export enum Routes {
  manager = '/manager',
  observationMatricesManager = '/manager/observationMatrices',
  experimentManager = '/manager/experiments',
  runtimeManager = '/runtime',
  graphExplorer = '/graph-explorer',
  graphExplorerSelection = '/graph-explorer/selection',
  graphExplorerAnnotate = '/graph-explorer/annotate',
  graphExplorerCausalExploration = '/graph-explorer/causal-exploration',
}

const baseApiUrl = '/api';

export const Endpoints = {
  observationMatrix: baseApiUrl + '/dataset',
  observationMatrices: baseApiUrl + '/datasets',
  experiment: baseApiUrl + '/experiment',
  allExperiments: baseApiUrl + '/experiments',
  job: baseApiUrl + '/job',
  allJobs: '/jobs',
  allResults: baseApiUrl + '/results',
  result: baseApiUrl + '/result',
};

export enum IndepenceTests {
  gaussCI = 'gaussCI',
  disCI = 'disCI',
  binCI = 'binCI',
}

export interface IObservationMatrix {
  id?: number;
  load_query: string;
  name: string;
  description?: string;
}

export interface IExperiment {
  dataset_id: number;
  dataset?: number;
  id?: number;
  name: string;
  description?: string;
  parameters: {
    alpha: number;
    independence_test: string;
    cores: number;
  };
  last_job?: {
    id: number;
    experiment_id: number;
    start_time: string;
    pid: number;
    status: string;
  };
}

export interface ICreateExperiment {
  dataset_id: number;
  name: string;
  description: string;
  parameters: {
    alpha: number;
    independence_test: string;
    cores: number;
  };
}

export interface IJob {
  id: number;
  experiment_id: number;
  start_time: string;
  status: string;
  pid?: number;
}

export interface IAPIMetaResults {
  alhpha: number;
  api_host: string;
  cores: number;
  dataset_id: string;
  fixed_edges: 'FALSE' | 'TRUE';
  fixed_graps: 'FALSE' | 'TRUE';
  help: boolean;
  independence_test: IndepenceTests;
  job_id: string;
}

export interface IAPIResult {
  nodes: IAPIGraphNode[];
  edges: IAPIGraphEdges[];
  meta_results: IAPIMetaResults;
  sepset: any[];
}

export interface IAPIMetaResults {
  alhpha: number;
  api_host: string;
  cores: number;
  dataset_id: string;
  fixed_edges: 'FALSE' | 'TRUE';
  fixed_graps: 'FALSE' | 'TRUE';
  help: boolean;
  independence_test: IndepenceTests;
  job_id: string;
}
