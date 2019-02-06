import { message } from 'antd';
import axios, { AxiosResponse } from 'axios';
import {
  IObservationMatrix,
  IExperiment,
  IJob,
  ICreateExperiment,
  IAPIDistribution,
} from '../types';
import Endpoints from '../constants/api';

export function getObservationMatrices(): Promise<IObservationMatrix[]> {
  return new Promise<IObservationMatrix[]>((resolve, reject) => {
    axios
      .get(Endpoints.observationMatrices)
      .then((response: AxiosResponse) => {
        resolve(response.data);
      })
      .catch((error) => {
        message.error('Failed to fetch Observation Matrices');
        reject({
          status: error.response.status,
          message: 'Failed to fetch Observation Matrices',
        });
      });
  });
}

export function createExperiment(experiment: ICreateExperiment): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    axios
      .post(Endpoints.allExperiments, experiment)
      .then((response: AxiosResponse) => {
        message.success(`Successfully created Experiment ${experiment.name}`);
        resolve();
      })
      .catch((error) => {
        message.error('Failed to create Experiment');
        reject({
          status: error.response.status,
          message: error.message,
        });
      });
  });
}

export function createObservationMatrix(
  observationMatrix: IObservationMatrix,
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    axios
      .post(Endpoints.observationMatrices, observationMatrix)
      .then((response: AxiosResponse) => {
        message.success(
          `Successfully created Observation Matrix ${observationMatrix.name}`,
        );
        resolve();
      })
      .catch((error) => {
        message.error('Failed to create Observation Matrix');
        reject({
          status: error.response.status,
          message: error.message,
        });
      });
  });
}

export function getExperiments(): Promise<IExperiment[]> {
  return new Promise<IExperiment[]>((resolve, reject) => {
    axios
      .get(Endpoints.allExperiments)
      .then((response: AxiosResponse) => {
        resolve(response.data);
      })
      .catch((error) => {
        message.error('Failed to fetch Experiments');
        reject({
          status: error.response.status,
          message: error.message,
        });
      });
  });
}

export function getExperiment(experimentId: number): Promise<IExperiment> {
  return new Promise<IExperiment>((resolve, reject) => {
    axios
      .get(`${Endpoints.experiment}/${experimentId}`)
      .then((response: AxiosResponse) => {
        resolve(response.data);
      })
      .catch((error) => {
        message.error(`Failed to fetch Experiment #${experimentId}`);
        reject({
          status: error.response.status,
          message: error.message,
        });
      });
  });
}

export function deleteExperiment(experiment: IExperiment): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    axios
      .delete(`${Endpoints.experiment}/${experiment.id}`)
      .then((response: AxiosResponse) => {
        message.success(`Successfully deleted Experiment ${experiment.name}!`);
        resolve();
      })
      .catch((error) => {
        message.error(`Failed to delete Experiment ${experiment.name}!`);
        reject({
          status: error.response.status,
          message: error.message,
        });
      });
  });
}

export function deleteObservationMatrix(
  observationMatrix: IObservationMatrix,
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    axios
      .delete(`${Endpoints.observationMatrix}/${observationMatrix.id}`)
      .then((response: AxiosResponse) => {
        resolve();
        message.success(
          `Successfully deleted Observation Matrix ${observationMatrix.name}!`,
        );
      })
      .catch((error) => {
        message.error(
          `Failed to delete Observation Matrix ${observationMatrix.name}!`,
        );
        reject({
          status: error.response.status,
          message: error.message,
        });
      });
  });
}

export function getJobsForExperiment(experiment: IExperiment): Promise<IJob[]> {
  return new Promise<IJob[]>((resolve, reject) => {
    axios
      .get(`${Endpoints.experiment}/${experiment.id}${Endpoints.allJobs}`)
      .then((response: AxiosResponse) => {
        resolve(response.data);
      })
      .catch((error) => {
        message.error('Failed to fetch Jobs');
        reject({
          status: error.response.status,
          message: error.message,
        });
      });
  });
}

export function runExperiment(experiment: IExperiment): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    axios
      .post(`${Endpoints.experiment}/${experiment.id}/start`)
      .then((response: AxiosResponse) => {
        resolve();
        message.success('Successfully started Experiment Run!');
      })
      .catch((error) => {
        message.error('Failed to start Experiment Run!');
        reject({
          status: error.response.status,
          message: error.message,
        });
      });
  });
}

export function getResult(resultID: number): Promise<void> {
  return new Promise<any>((resolve, reject) => {
    axios
      .get(`${Endpoints.result}/${resultID}`)
      .then((response: AxiosResponse) => {
        resolve(response.data);
      })
      .catch((error) => {
        message.error(`Failed to fetch Results for Job with ID: ${resultID}`);
        reject({
          status: error.response.status,
          message: error.message,
        });
      });
  });
}

export function getNodeDataDistribution(
  nodeID: string,
): Promise<IAPIDistribution> {
  return new Promise<IAPIDistribution>((resolve, reject) => {
    axios
      .get(Endpoints.nodeDistribution(String(nodeID)))
      .then((response: AxiosResponse) => {
        resolve(response.data);
      })
      .catch((error) => {
        message.error('Failed to fetch Node Data Distribution');
        reject({
          status: error.response.status,
          message: 'Failed to fetch Node Data Distribution',
        });
      });
  });
}
