import { JobErrorCode } from '../types/types';
import { subscribeToJobStatusChanges } from '../restAPI/apiRequests';
import { notification } from 'antd';

const getJobErrorDescription = (errorCode: JobErrorCode): string => {
  switch (errorCode) {
    case JobErrorCode.UNSCHEDULABLE:
      return 'Job could not be scheduled. Maybe there is no machine with enough GPUs/CPUs available?';
    case JobErrorCode.IMAGE_NOT_FOUND:
      return 'Docker image for job not found. Maybe try again after pushing the executor image.';
    case JobErrorCode.UNKNOWN:
      return 'An unknown error occured. Read the job logs for further info';
  }
};

export const attachErrorHandler = () => {
  subscribeToJobStatusChanges(value => {
    if (value.error_code) {
      notification.error({
        message: `Job ${value.id} failed!`,
        description: getJobErrorDescription(value.error_code)
      });
    }
  });
};
