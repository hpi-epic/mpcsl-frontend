const baseApiUrl = '/api';

const Endpoints = {
  observationMatrix: baseApiUrl + '/dataset',
  observationMatrices: baseApiUrl + '/datasets',
  experiment: baseApiUrl + '/experiment',
  allExperiments: baseApiUrl + '/experiments',
  job: baseApiUrl + '/job',
  allJobs: '/jobs',
  allResults: baseApiUrl + '/results',
  result: baseApiUrl + '/result',
  nodeDistribution: (nodeID: string) => `${baseApiUrl}/node/${nodeID}/marginal`,
  resultNodes: (resultID: number) => `${baseApiUrl}/result/${resultID}/nodes`,
  nodeContext: (nodeID: number) => `${baseApiUrl}/node/${nodeID}/context`,
};

export default Endpoints;
