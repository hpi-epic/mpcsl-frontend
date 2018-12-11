import { message } from 'antd';
import axios, { AxiosResponse, AxiosError } from 'axios';
import { IDataset, IExperiment, Endpoints } from "../types";

export function getDatasets(): Promise<Array<IDataset>> {
  return new Promise<Array<IDataset>>((resolve, reject) => {
    axios.get(Endpoints.allDatasets)
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        message.error('Failed to fetch Datasets');
        reject({
          status: error.response.status,
          message: 'Failed to fetch Datasets',
        })
      })
  });
}

export function createExperiment(experiment: IExperiment): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    axios.post(Endpoints.allExperiments, experiment)
      .then(response => {
        message.success(`Successfully created Experiment ${experiment.name}`)
        resolve();
      })
      .catch(error => {
        message.error('Failed to create Experiment');
        reject({
          status: error.response.status,
          message: error.message,

        })
      })
  })
}

export function getExperiments(): Promise<Array<IExperiment>> {
  return new Promise<Array<IExperiment>>((resolve, reject) => {
    axios.get(Endpoints.allExperiments)
      .then((response: AxiosResponse) => {
        resolve(response.data);
      })
      .catch(error => {
        message.error('Failed to fetch Experiments')
        reject({
          status: error.response.status,
          message: error.message,
        })
      })
  })
}

export function deleteExperiment(experiment: IExperiment): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    axios.delete(`${Endpoints.experiment}/${experiment.id}`)
      .then((esponse: AxiosResponse) => {
        message.success(`Experiment ${experiment.name} deleted!`)
        resolve();
      })
      .catch(error => {
        message.error(`Failed to delete ${experiment.name}`)
        reject({
          status: error.response.status,
          message: error.message,
        })
      })
  })
}
