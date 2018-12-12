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
      .then((response: AxiosResponse) => {
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

export function createDataset(dataset: IDataset): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    axios.post(Endpoints.allDatasets, dataset)
      .then((response: AxiosResponse) => {
        message.success(`Successfully created Dataset ${dataset.name}`)
        resolve();
      })
      .catch(error => {
        message.error('Failed to create Dataset');
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

export function deleteExperiment(experiment: IExperiment): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    axios.delete(`${Endpoints.experiment}/${experiment.id}`)
      .then((response: AxiosResponse) => {
        message.success(`Successfully deleted Experiment ${experiment.name}!`)
        resolve();
      })
      .catch(error => {
        message.error(`Failed to delete Experiment ${experiment.name}!`)
        reject({
          status: error.response.status,
          message: error.message,
        })
      })
  })
}

export function deleteDataset(dataset: IDataset): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    axios.delete(`${Endpoints.dataset}/${dataset.id}`)
      .then((response: AxiosResponse) => {
        resolve()
        message.success(`Successfully deleted Dataset ${dataset.name}!`);
      })
      .catch(error => {
        message.error(`Failed to delete Dataset ${dataset.name}!`);
        reject({
          status: error.response.status,
          message: error.message,
        })
      })
  })
}
