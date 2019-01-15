import { IAPIGraphNode, IAPIGraphEdges } from './graphTypes';
import { IndepenceTests } from '../constants/experiment';

export interface IStoreState {
  graph: any;
  selectedGraph: any;
  nodes: string[];
  doFreeze: boolean;
}

export type StoreState = IStoreState | undefined;

export interface IObservationMatrix {
  id?: number;
  load_query: string;
  name: string;
  description?: string;
  remote_db?: string;
  time_created?: string;
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
    result?: {
      id: number;
      job_id: number;
      start_time: string;
      end_time: string;
      meta_results: any;
    };
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
  result?: {
    id: number;
    job_id: number;
    start_time: string;
    end_time: string,
    meta_results: any;
  };
}

export interface IAPIMetaResults {
  alpha: number;
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
