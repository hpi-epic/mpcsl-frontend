import { message } from 'antd';
import axios from 'axios';
import { IDataset, Endpoints } from "../types";

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

export function deleteDataset(datasetId: number): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    axios.delete(Endpoints.dataset + '/' + datasetId)
      .then(() => {
        resolve()
        // message.success('Successfully deleted Dataset');
      })
      .catch((error) => {
        message.error('Failed to delete Dataset');
        reject({
          status: error.response.status,
          message: 'Failed to fetch Datasets',
        })
      })
  })
}
