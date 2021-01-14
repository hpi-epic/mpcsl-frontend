import { GraphExportFormat } from '../types/types';

const baseApiUrl = '/api';

const Endpoints = {
  k8s: baseApiUrl + '/k8s',
  observationMatrix: baseApiUrl + '/dataset',
  observationMatrixMetadata: (datasetID: number) =>
    `${baseApiUrl}/dataset/${datasetID}/metadata`,
  observationMatrices: baseApiUrl + '/datasets',
  experiment: baseApiUrl + '/experiment',
  allExperiments: baseApiUrl + '/experiments',
  datasetExperiments: (datasetId: number) =>
    `${baseApiUrl}/dataset/${datasetId}/experiments`,
  job: baseApiUrl + '/job',
  jobLogs: (jobId: number) => `${baseApiUrl}/job/${String(jobId)}/logs`,
  allJobs: '/jobs',
  allResults: baseApiUrl + '/results',
  result: baseApiUrl + '/result',
  nodeDistribution: (nodeID: string) => `${baseApiUrl}/node/${nodeID}/marginal`,
  conditionalNodeDistribution: (nodeID: string) =>
    `${baseApiUrl}/node/${nodeID}/conditional`,
  interventionalNodeDistribution: () => `${baseApiUrl}/intervention`,
  resultNodes: (resultID: number) => `${baseApiUrl}/result/${resultID}/nodes`,
  resultComparison: (resultOneId: number, resultTwoId: number) =>
    `${baseApiUrl}/result/${resultOneId}/compare/${resultTwoId}`,
  gtComparison: (resultId: number) =>
    `${baseApiUrl}/result/${resultId}/gtcompare`,
  nodeContext: (nodeID: number, resultID: number) =>
    `${baseApiUrl}/node/${nodeID}/result/${resultID}/context`,
  allNodesContext: (resultID: number) =>
    `${baseApiUrl}/result/${resultID}/context`,
  algorithm: (algorithmId: number) => `${baseApiUrl}/algorithms/${algorithmId}`,
  allAlgorithms: baseApiUrl + '/algorithms',
  resultExport: (resultID: number, format: GraphExportFormat) =>
    `${baseApiUrl}/result/${resultID}/export?format=${format}`,
  datasources: baseApiUrl + '/datasources',
  confounders: (nodeID: string, resultID: string) =>
    `${baseApiUrl}/node/${nodeID}/result/${resultID}/confounders`,
  allDatasetGenerationJobs: baseApiUrl + '/jobs/dataset_generation'
};

export default Endpoints;
