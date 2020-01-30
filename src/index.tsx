import 'antd/dist/antd.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import * as serviceWorker from './serviceWorker';

import store from './store';
import { Provider } from 'react-redux';
import { subscribeToJobStatusChanges } from './actions/apiRequests';
import { notification } from 'antd';
import { JobErrorCode } from './types';

const getJobErrorDescription = (errorCode: JobErrorCode): string => {
  switch (errorCode) {
    case JobErrorCode.UNSCHEDULABLE:
      return 'Job could not be scheduled. Maybe there is no machine with enough GPUs available?';
    case JobErrorCode.IMAGE_NOT_FOUND:
      return 'Docker image for job not found. Maybe try again after pushing the executor image.';
    case JobErrorCode.UNKNOWN:
      return 'An unknown error occured. Read the job logs for further info';
  }
};

subscribeToJobStatusChanges(value => {
  if (value.error_code) {
    notification.error({
      message: `Job ${value.id} failed!`,
      description: getJobErrorDescription(value.error_code)
    });
  }
});

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);

serviceWorker.unregister();
