const baseApiUrl = '/api';

const Endpoints = {
  observationMatrix: baseApiUrl + '/dataset',
  observationMatrices: baseApiUrl + '/datasets',
  experiment: baseApiUrl + '/experiment',
  allExperiments: baseApiUrl + '/experiments',
  job: baseApiUrl + '/job',
  jobLogs: (jobId: number) => `${baseApiUrl}/job/${String(jobId)}/logs`,
  allJobs: '/jobs',
  allResults: baseApiUrl + '/results',
  result: baseApiUrl + '/result',
  nodeDistribution: (nodeID: string) => `${baseApiUrl}/node/${nodeID}/marginal`,
  conditionalNodeDistribution: (nodeID: string) =>
    `${baseApiUrl}/node/${nodeID}/conditional`,
  resultNodes: (resultID: number) => `${baseApiUrl}/result/${resultID}/nodes`,
  nodeContext: (nodeID: number) => `${baseApiUrl}/node/${nodeID}/context`,
  allAlgorithms: baseApiUrl + '/algorithms',
  algorithm: (algorithmId: number) => `${baseApiUrl}/algorithms/${algorithmId}`,
};

export default Endpoints;
