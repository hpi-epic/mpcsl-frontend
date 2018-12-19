export interface IStoreState {
  graph: any;
  selectedGraph: any;
  nodes: string[];
}

export type StoreState = IStoreState | undefined;

export enum Routes {
  manager = '/manager',
  graphExplorer = '/graph-explorer',
  graphExplorerSelection = '/graph-explorer/selection',
  graphExplorerAnnotate = '/graph-explorer/annotate',
  graphExplorerCausalExploration = '/graph-explorer/causal-exploration',
  datasetManager = '/manager/dataset',
  projectManager = '/manager/projects',
  runtimeManager = '/runtime'
}

export enum Endpoints {
  dataset = '/dataset',
  allDatasets = '/datasets',
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

export interface IDataset {
  id?: number;
  load_query: string,
  name: string
}

export interface IExperiment {
  dataset_id: number;
  dataset?: number;
  id?: number;
  name: string;
  parameters: {
    alpha: number;
    independence_test: string;
    cores: number;
  }
}
