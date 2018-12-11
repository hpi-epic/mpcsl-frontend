import { message } from 'antd';
import axios from 'axios';
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
