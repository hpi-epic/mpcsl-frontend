import { IAPIGraphNode } from './../types/graphTypes';
import { message } from 'antd';
import axios from 'axios';
import {
  IObservationMatrix,
  IExperiment,
  IJob,
  ICreateExperiment,
  IAPIDistribution,
  IAPINodeContext,
  IAlgorithm,
  IAPIConfounders,
  JobStatus
} from '../types';
import Endpoints from '../constants/api';
import { fromEvent } from 'rxjs';
import io from 'socket.io-client';

let _socket: undefined | SocketIOClient.Socket;
const socket = () => {
  if (!_socket) {
    _socket = io();
  }
  return _socket;
};

export function getObservationMatrices(): Promise<IObservationMatrix[]> {
  return new Promise<IObservationMatrix[]>((resolve, reject) => {
    axios
      .get(Endpoints.observationMatrices)
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        message.error('Failed to fetch Observation Matrices');
        reject({
          status: error.response.status,
          message: 'Failed to fetch Observation Matrices'
        });
      });
  });
}

export function createExperiment(experiment: ICreateExperiment): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    axios
      .post(Endpoints.allExperiments, experiment)
      .then(() => {
        message.success(`Successfully created Experiment ${experiment.name}`);
        resolve();
      })
      .catch(error => {
        message.error('Failed to create Experiment');
        reject({
          status: error.response.status,
          message: error.message
        });
      });
  });
}

export function createObservationMatrix(
  observationMatrix: Omit<IObservationMatrix, 'id'>
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    axios
      .post(Endpoints.observationMatrices, observationMatrix)
      .then(() => {
        message.success(
          `Successfully created Observation Matrix ${observationMatrix.name}`
        );
        resolve();
      })
      .catch(error => {
        if (error.response.status === 400) {
          message.error(
            `${error.response.data.message}. Please enter a valid query!`
          );
        } else {
          message.error('Failed to create Observation Matrix');
        }
        reject({
          status: error.response.status,
          message: error.message
        });
      });
  });
}

export function getExperiments(): Promise<IExperiment[]> {
  return new Promise<IExperiment[]>((resolve, reject) => {
    axios
      .get(Endpoints.allExperiments)
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        message.error('Failed to fetch Experiments');
        reject({
          status: error.response.status,
          message: error.message
        });
      });
  });
}

export function getExperiment(experimentId: number): Promise<IExperiment> {
  return new Promise<IExperiment>((resolve, reject) => {
    axios
      .get(`${Endpoints.experiment}/${experimentId}`)
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        message.error(`Failed to fetch Experiment #${experimentId}`);
        reject({
          status: error.response.status,
          message: error.message
        });
      });
  });
}

export function deleteExperiment(experiment: IExperiment): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    axios
      .delete(`${Endpoints.experiment}/${experiment.id}`)
      .then(() => {
        message.success(`Successfully deleted Experiment ${experiment.name}!`);
        resolve();
      })
      .catch(error => {
        message.error(`Failed to delete Experiment ${experiment.name}!`);
        reject({
          status: error.response.status,
          message: error.message
        });
      });
  });
}

export function deleteObservationMatrix(
  observationMatrix: IObservationMatrix
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    axios
      .delete(`${Endpoints.observationMatrix}/${observationMatrix.id}`)
      .then(() => {
        resolve();
        message.success(
          `Successfully deleted Observation Matrix ${observationMatrix.name}!`
        );
      })
      .catch(error => {
        message.error(
          `Failed to delete Observation Matrix ${observationMatrix.name}!`
        );
        reject({
          status: error.response.status,
          message: error.message
        });
      });
  });
}

export function getJobsForExperiment(experiment: IExperiment): Promise<IJob[]> {
  return new Promise<IJob[]>((resolve, reject) => {
    axios
      .get(`${Endpoints.experiment}/${experiment.id}${Endpoints.allJobs}`)
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        message.error('Failed to fetch Jobs');
        reject({
          status: error.response.status,
          message: error.message
        });
      });
  });
}

type SubJobStatusData = {
  id: number;
  status: JobStatus;
};

export const subscribeToJobStatusChanges = () =>
  fromEvent<SubJobStatusData>(socket(), 'job_status');

export function runExperiment(
  experiment: IExperiment,
  node?: string
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    axios
      .post(
        `${Endpoints.experiment}/${experiment.id}/start`,
        node ? { node } : undefined
      )
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
export const getK8SNodes = async () => nodes;

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
  causeNodeID: string,
  effectNodeID: string,
  factorNodeIDs: string[],
  causeCondition: string
): Promise<IAPIDistribution> {
  return new Promise<IAPIDistribution>((resolve, reject) => {
    axios
      .get(
        Endpoints.interventionalNodeDistribution(
          causeNodeID,
          effectNodeID,
          factorNodeIDs,
          causeCondition
        )
      )
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
    const match = window.location.href.match(new RegExp('\\d*$'));
    if (!match || !match[0]) {
      throw Error();
    }
    const resultID = match[0];
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

export function getAllAlgorithms(): Promise<IAlgorithm[]> {
  return new Promise<IAlgorithm[]>((resolve, reject) => {
    axios
      .get(Endpoints.allAlgorithms)
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        message.error('Failed to fetch Algorithms');
        reject({
          status: error.response.status,
          message: error.message
        });
      });
  });
}

export function getAlgorithm(algorithmId: number): Promise<IAlgorithm> {
  return new Promise<IAlgorithm>((resolve, reject) => {
    axios
      .get(Endpoints.algorithm(algorithmId))
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        message.error('Failed to fetch Algorithm');
        reject({
          status: error.response.status,
          message: error.message
        });
      });
  });
}

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
