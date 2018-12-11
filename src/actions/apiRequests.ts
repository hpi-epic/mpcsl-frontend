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
