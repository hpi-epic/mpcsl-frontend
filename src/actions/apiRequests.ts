import { IAPIGraphNode } from './../types/graphTypes';
import { message } from 'antd';
import axios from 'axios';
import {
  IObservationMatrix,
  IExperiment,
  ICreateExperiment,
  IAPIDistribution,
  IAPINodeContext,
  IAlgorithm,
  IAPIConfounders,
  IIDClass,
  IJob,
  IComparisonStatistics,
  JobErrorCode,
  IObservationMatrixMetadata
} from '../types';
import Endpoints from '../constants/api';
import { fromEvent, Observable } from 'rxjs';
import io from 'socket.io-client';

let _socket: undefined | SocketIOClient.Socket;
const socket = () => {
  if (!_socket) {
    _socket = io();
  }
  return _socket;
};

class CachedApiCall<T extends IIDClass> {
  private cachedData: undefined | Promise<T[]>;
  private observable: Observable<IIDClass>;
  private changeObs: Observable<number>;
  constructor(private apiEndpoint: string, subIdentifier: string) {
    this.observable = fromEvent(socket(), subIdentifier);
    this.changeObs = new Observable(observer => {
      this.observable.subscribe(val => {
        this.refetchData().then(() => observer.next(val.id));
      });
    });
  }

  public refetchData = () => {
    this.cachedData = axios
      .get(this.apiEndpoint)
      .then(response => response.data)
      .catch(e => {
        message.error('Network Error');
        throw e;
      });
    return this.cachedData;
  };

  public getAll = async () => {
    if (!this.cachedData) {
      this.refetchData();
    }
    return this.cachedData as Promise<T[]>;
  };

  public getOne = async (id: number) => {
    const data = await this.getAll();
    return data.find(datum => datum.id === id);
  };

  public subscribe = (callback: (id: number) => void) => {
    return this.changeObs.subscribe(callback);
  };
}

type SubJobStatusData = {
  id: number;
  error_code?: JobErrorCode;
};

const JobChangesObservable = fromEvent<SubJobStatusData>(socket(), 'job');

const experimentCache = new CachedApiCall<IExperiment>(
  Endpoints.allExperiments,
  'experiment'
);

const datasetCache = new CachedApiCall<IObservationMatrix>(
  Endpoints.observationMatrices,
  'dataset'
);

export const getObservationMatrices = datasetCache.getAll;

export const getObservationMatrix = datasetCache.getOne;

export const createExperiment = async (experiment: ICreateExperiment) => {
  try {
    await axios.post(Endpoints.allExperiments, experiment);
    message.success(`Successfully created Experiment ${experiment.name}`);
  } catch (e) {
    message.error('Failed to create Experiment');
    throw e;
  }
};

export const getObservationMatrixMetadata = async (
  observationMatrixID: number
): Promise<IObservationMatrixMetadata> => {
  try {
    const response = await axios.get(
      Endpoints.observationMatrixMetadata(observationMatrixID)
    );
    return response.data;
  } catch (e) {
    message.error('Failed to create Observation Matrix Metadata');
    throw e;
  }
};

export const createObservationMatrix = async (
  observationMatrix: Omit<IObservationMatrix, 'id'>
) => {
  try {
    await axios.post(Endpoints.observationMatrices, observationMatrix);
    message.success(
      `Successfully created Observation Matrix ${observationMatrix.name}`
    );
  } catch (e) {
    message.error('Failed to create Observation Matrix');
    throw e;
  }
};

export const getExperiments = experimentCache.getAll;

export const getExperiment = experimentCache.getOne;

export const getComparisonStatistics = async (
  resultOneId: number,
  resultTwoId: number
): Promise<IComparisonStatistics> => {
  try {
    const response = await axios.get(
      Endpoints.resultComparison(resultOneId, resultTwoId)
    );
    return response.data;
  } catch (e) {
    message.error('Failed to fetch Statistics');
    throw e;
  }
};

export const getGTComparisonStatistics = async (
  resultId: number
): Promise<IComparisonStatistics | null> => {
  try {
    const response = await axios.get(Endpoints.gtComparison(resultId));
    return response.data;
  } catch (e) {
    message.error('Failed to fetch Statistics');
    throw e;
  }
};

export const deleteExperiment = async (experiment: IExperiment) => {
  try {
    await axios.delete(`${Endpoints.experiment}/${experiment.id}`);
    message.success(`Successfully deleted Experiment ${experiment.name}!`);
  } catch (e) {
    message.error(`Failed to delete Experiment ${experiment.name}!`);
    throw e;
  }
};

export const deleteObservationMatrix = async (
  observationMatrix: IObservationMatrix
) => {
  try {
    await axios.delete(
      `${Endpoints.observationMatrix}/${observationMatrix.id}`
    );
    message.success(
      `Successfully deleted Observation Matrix ${observationMatrix.name}!`
    );
  } catch (e) {
    message.error(
      `Failed to delete Observation Matrix ${observationMatrix.name}!`
    );
    throw e;
  }
};

let cachedJobs: {
  [id: string]: IJob[] | undefined;
} = {};

const jobChangesObservable = new Observable<SubJobStatusData>(observer => {
  JobChangesObservable.subscribe(e => {
    for (const id of Object.keys(cachedJobs)) {
      const cache = cachedJobs[id];
      if (cache && cache.some(job => job.id === e.id)) {
        cachedJobs[id] = undefined;
        observer.next(e);
        return;
      }
    }
    cachedJobs = {};
    observer.next(e);
    return;
  });
});

export const subscribeToJobStatusChanges = (
  callback: (value: SubJobStatusData) => void
) => jobChangesObservable.subscribe(callback);

export const getJobsForExperiment = async (
  experimentId: number
): Promise<IJob[]> => {
  const experimentIdStr = experimentId.toString();
  const cache = cachedJobs[experimentIdStr];
  if (cache) {
    return cache;
  }
  try {
    const response = await axios.get<IJob[]>(
      `${Endpoints.experiment}/${experimentIdStr}${Endpoints.allJobs}`
    );
    cachedJobs[experimentIdStr] = response.data;
    return response.data;
  } catch (e) {
    message.error('Failed to fetch Jobs');
    throw e;
  }
};

export const subscribeToDatasetChanges = datasetCache.subscribe;

let cachedExperiments: {
  [id: string]: IExperiment[] | undefined;
} = {};
const experimentChangesObservable = new Observable<number>(observer => {
  experimentCache.subscribe(expId => {
    for (const id of Object.keys(cachedExperiments)) {
      const cache = cachedExperiments[id];
      if (cache && cache.some(exp => exp.id === expId)) {
        cachedExperiments[id] = undefined;
        observer.next(expId);
        return;
      }
    }
    cachedExperiments = {};
    observer.next(expId);
    return;
  });
});

export const subscribeToExperimentChanges = (callback: (id: number) => void) =>
  experimentChangesObservable.subscribe(callback);

export const getExperimentsForDataset = async (
  datasetId: number
): Promise<IExperiment[]> => {
  const cache = cachedExperiments[datasetId];
  if (cache) {
    return cache;
  }
  try {
    const response = await axios.get(Endpoints.datasetExperiments(datasetId));
    cachedExperiments[datasetId] = response.data;
    return response.data;
  } catch (e) {
    message.error('Failed to fetch Experiments');
    throw e;
  }
};

export function runExperiment(
  experiment: IExperiment,
  node?: string,
  runs?: number,
  parallel?: boolean,
  gpus?: number
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    axios
      .post(`${Endpoints.experiment}/${experiment.id}/start`, {
        node,
        runs,
        parallel,
        gpus
      })
      .then(() => {
        resolve();
        message.success('Successfully started Experiment Run!');
      })
      .catch(error => {
        message.error('Failed to start Experiment Run!');
        reject({
          status: error.response.status,
          message: error.message
        });
      });
  });
}

const nodes = axios.get<string[]>(`${Endpoints.k8s}/nodes`);
export const getK8SNodes = async () => (await nodes).data;

export function getResult(resultID: number): Promise<void> {
  return new Promise((resolve, reject) => {
    axios
      .get(`${Endpoints.result}/${resultID}`)
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        message.error(`Failed to fetch Results for Job with ID: ${resultID}`);
        reject({
          status: error.response.status,
          message: error.message
        });
      });
  });
}

export function getNodeContext(
  nodeID: number,
  resultID: number
): Promise<IAPINodeContext> {
  return new Promise((resolve, reject) => {
    axios
      .get(Endpoints.nodeContext(nodeID, resultID))
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        message.error(`Failed to fetch Context for Node with ID: ${nodeID}`);
        reject({
          status: error.response.status,
          message: error.message
        });
      });
  });
}

export function getResultNodes(resultID: number): Promise<IAPIGraphNode[]> {
  return new Promise((resolve, reject) => {
    axios
      .get(Endpoints.resultNodes(resultID))
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        message.error(
          `Failed to fetch available Nodes for Result with ID: ${resultID}`
        );
        reject({
          status: error.response.status,
          message: error.message
        });
      });
  });
}

export function getNodeDataDistribution(
  nodeID: string
): Promise<IAPIDistribution> {
  return new Promise<IAPIDistribution>((resolve, reject) => {
    axios
      .get(Endpoints.nodeDistribution(String(nodeID)))
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        message.error('Failed to fetch Node Data Distribution');
        reject({
          status: error.response.status,
          message: 'Failed to fetch Node Data Distribution'
        });
      });
  });
}

export function getConditionalNodeDataDistribution(
  nodeID: string,
  distributions: any
): Promise<IAPIDistribution> {
  return new Promise<IAPIDistribution>((resolve, reject) => {
    axios
      .post(Endpoints.conditionalNodeDistribution(String(nodeID)), {
        conditions: distributions
      })
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        message.error('Failed to fetch Conditional Data Distribution');
        reject({
          status: error.response.status,
          message: 'Failed to fetch Conditional Node Data Distribution'
        });
      });
  });
}

export function getInterventionNodeDataDistribution(
  causeNodeID: number,
  effectNodeID: number,
  factorNodeIDs: number[],
  causeCondition: any
): Promise<IAPIDistribution> {
  return new Promise<IAPIDistribution>((resolve, reject) => {
    axios
      .post(Endpoints.interventionalNodeDistribution(), {
        cause_node_id: causeNodeID,
        effect_node_id: effectNodeID,
        factor_node_ids: factorNodeIDs,
        cause_condition: causeCondition
      })
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        message.error('Failed to fetch Data Distribution after Intervention');
        reject({
          status: error.response.status,
          message: error.message
        });
      });
  });
}

export function getConfounders(nodeID: string): Promise<IAPIConfounders> {
  return new Promise<IAPIConfounders>((resolve, reject) => {
    const match = window.location.href.match(new RegExp('(\\d+)/exploration'));
    if (!match || !match[1]) {
      throw Error();
    }
    const resultID = match[1];
    axios
      .get(Endpoints.confounders(nodeID, resultID))
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        message.error('Failed to fetch confounders');
        reject({
          status: error.response.status,
          message: error.message
        });
      });
  });
}

let algorithms: undefined | Promise<IAlgorithm[]>;

export const getAllAlgorithms = async (): Promise<IAlgorithm[]> => {
  if (algorithms) {
    return algorithms;
  }
  try {
    algorithms = axios
      .get<IAlgorithm[]>(Endpoints.allAlgorithms)
      .then(resp => resp.data);
    return algorithms;
  } catch (e) {
    message.error('Failed to fetch Algorithms');
    throw e;
  }
};

export const getAlgorithm = async (
  algorithmId: number
): Promise<IAlgorithm> => {
  const allAlgorithms = await getAllAlgorithms();
  const alg = allAlgorithms.find(val => val.id === algorithmId);
  if (!alg) {
    message.error('Algorithm not found');
    throw new Error();
  }
  return alg;
};

export function getAllAvailableDataSources(): Promise<[]> {
  return new Promise<[]>((resolve, reject) => {
    axios
      .get(Endpoints.datasources)
      .then(response => {
        resolve(response.data.data_sources);
      })
      .catch(error => {
        message.error('Failed to fetch data sources');
        reject({
          status: error.response.status,
          message: error.message
        });
      });
  });
}
