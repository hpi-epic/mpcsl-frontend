import { IAPIGraphEdges, IAPIGraphNode } from './graphTypes';

export interface IIDClass {
  id: number;
}

export interface ICreateDatasetGenerationJob extends IIDClass {
  datasetName: string;
  kubernetesNode?: string;
  nodes: number;
  samples: number;
  edgeProbability: number;
  edgeValueLowerBound: number;
  edgeValueUpperBound: number;
}

export interface IObservationMatrix extends IIDClass {
  load_query: string;
  name: string;
  description?: string;
  data_source?: string;
  time_created?: string;
}

export interface IObservationMatrixMetadata {
  variables: number;
  time_created: number;
  observations: number;
  data_source: string;
  query: string;
  has_ground_truth: boolean;
}

export type JobStatus = 'running' | 'done' | 'error' | 'cancelled' | 'waiting';

export enum JobErrorCode {
  UNSCHEDULABLE = -1,
  IMAGE_NOT_FOUND = -2,
  UNKNOWN = -127
}

export enum BadgeStatus {
  running = 'processing',
  waiting = 'processing',
  done = 'success',
  error = 'error',
  cancelled = 'warning'
}

export interface IExperiment extends IIDClass {
  dataset_id: number;
  dataset?: number;
  name: string;
  description?: string;
  execution_time_statistics?: { [name: string]: number };
  algorithm_id: number;
  parameters: IParameters;
  last_job?: IJob;
}

export interface ICreateExperiment {
  dataset_id: number;
  name: string;
  description: string;
  algorithm_id: number;
  parameters: { [name: string]: any };
}

interface IRequiredParameter {
  required?: boolean;
}

export interface INumberParameter extends IRequiredParameter {
  type: 'int' | 'float';
  minimum?: number;
  maximum?: number;
  default?: number;
}

export interface IEnumParameter extends IRequiredParameter {
  type: 'enum';
  values: string[];
  default?: string;
}

export interface IStrParameter extends IRequiredParameter {
  type: 'str';
  value: string;
  default?: string;
}

export type IParameter = INumberParameter | IEnumParameter | IStrParameter;

export type IParameters = { [name: string]: IParameter };

export interface IAlgorithm extends IIDClass {
  package: string;
  function: string;
  script_filename: string;
  backend: string;
  description: string;
  valid_parameters: IParameters;
  needs_gpu?: boolean;
}

export interface IErrorType {
  rate: number;
  edges: number[][];
}

export interface IJob extends IIDClass {
  experiment_id: number;
  start_time: string;
  end_time: string;
  status: JobStatus;
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

export interface IComparisonStatistics {
  graph_edit_distance: number;
  mean_jaccard_coefficient: number;
  error_types: {
    false_positives: IErrorType;
    true_positives: IErrorType;
    false_negatives: IErrorType;
    true_negatives: IErrorType;
  };
}

interface IAPIDistributionBase {
  dataset: {
    time_created: string;
    id: number;
    description?: string;
    name: string;
    data_source?: string;
    load_query?: string;
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

export type IAPIAllNodesContext = {
  node_contexts: IAPINodeContext[];
};

export enum GraphExportFormat {
  GEXF = 'GEXF',
  GraphML = 'GraphML',
  GML = 'GML'
}

export interface IStateJobsManagement {
  modalVisible: boolean;
  downloadModalVisible: boolean;
  extraLines: number; // necessary for linux support
  currentJobId?: number;
  jobList: IJob[];
  experiment?: IExperiment;
  format: GraphExportFormat;
  currentResultID?: number;
}

export interface IMatchParams {
  experimentId: string;
  datasetId: string;
}

export type IExperimentJobs = {
  jobs: IJob[];
} & IExperiment;

export interface IAPIConfounders {
  confounders: string[][];
}

export interface IDatasetGenerationJob extends IJob {
  dataset_id: number;
  datasetName: string;
  nodes: number;
  samples: number;
  edgeProbability: number;
  edgeValueLowerBound: number;
  edgeValueUpperBound: number;
}
