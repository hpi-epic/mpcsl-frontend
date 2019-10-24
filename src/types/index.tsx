import { IAPIGraphNode, IAPIGraphEdges, ID3GraphNode } from './graphTypes';
import { IndepenceTests } from '../constants/experiment';
import Graph from '../utils/graph';

export interface IStoreState {
  resultID?: string; // ID of current graph
  selectedGraph: Graph;
  nodes: ID3GraphNode[];
  doFreeze: boolean;
  availableNodes: IAPIGraphNode[];
}

export type StoreState = IStoreState | undefined;

export interface IObservationMatrix {
  id?: number;
  load_query: string;
  name: string;
  description?: string;
  data_source?: string;
  time_created?: string;
}

export interface IExperiment {
  dataset_id: number;
  dataset?: number;
  id?: number;
  name: string;
  description?: string;
  execution_time_statistics?: {[name: string]: number}; 
  algorithm_id: number;
  parameters: { [name: string]: any };
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
  algorithm_id: number;
  parameters: { [name: string]: any };
}

export interface IAlgorithm {
  id: number;
  name: string;
  script_filename: string;
  backend: string;
  description: string;
  valid_parameters: { [name: string]: any };
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
    end_time: string;
    execution_time: number;
    dataset_loading_time: number;
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

interface IAPIDistributionBase {
  dataset: {
    time_created: string;
    id: number;
    description: string | undefined;
    name: string;
    data_source: string | undefined;
    load_query: string | undefined;
  };
  node: {
    result: number;
    name: string;
    result_id: number;
    id: number;
  };
}

export interface IAPIDistributionContinous extends IAPIDistributionBase {
  categorical: false;
  bin_edges: number[];
  bins: number[];
}

interface ICategoricalBin {
  [bin: string]: number;
}

export interface IAPIDistributionCategorical extends IAPIDistributionBase {
  categorical: true;
  bins: ICategoricalBin;
}

export type IAPIDistribution =
  | IAPIDistributionCategorical
  | IAPIDistributionContinous;

export interface IAPINodeContext {
  edges: IAPIGraphEdges[];
  context_nodes: IAPIGraphNode[];
  main_node: IAPIGraphNode;
}

export enum GraphExportFormat {
  GEXF = 'GEXF',
  GraphML = 'GraphML',
  GML = 'GML',
}

export interface IAPIConfounders {
  confounders: string[][];
}
