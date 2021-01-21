import { Badge, Button, Space, Table } from 'antd';
import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { getExperimentsForDataset, getJobsForExperiment, subscribeToExperimentChanges } from '../../restAPI/apiRequests';
import { IExperiment, IJob } from '../../types/types';
import { Content } from 'antd/lib/layout/layout';


export const ExperimentsView = ({
  match
}: RouteComponentProps<{ datasetId: string }>) => {

  const datasetId = parseInt(match.params.datasetId, 10);
  const [experiments, setExperiments] = React.useState<undefined | IExperiment[]>();

  const [experimentJobs, setExperimentJobs] = React.useState<{[experimentId: number]: IJob[]}>({}); 
  const [isLoadingExperimentJobs, setIsLoadingExperimentJobs] = React.useState<{[experimentId: number]: boolean}>({});

  React.useEffect(() => {
    if (datasetId) {
      const fetchExperiments = () => {
        getExperimentsForDataset(datasetId)
          .then(setExperiments)
          .catch();
      };
      fetchExperiments();
      const sub = subscribeToExperimentChanges(fetchExperiments);
      return () => sub.unsubscribe();
    }
  }, [datasetId]);

  // If dataset not found return 404 Error
  if (!datasetId) {
    return <h1>404</h1>;
  }

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Description', dataIndex: 'description', key: 'description' }
  ];

  const expandedRowRender = (
    record: IExperiment,
  ) => {
    const columns = [
      { title: "Date", dataIndex: "date", key: "date" },
      { title: "Start", dataIndex: "start_time", key: "start_time" },
      {
        title: "Status",
        key: "state",
        render: () => (
          <span>
            <Badge status="success" />
            Finished
          </span>
        )
      },
      { title: "Upgrade Status", dataIndex: "upgradeNum", key: "upgradeNum" },
      {
        title: 'Action',
        dataIndex: 'operation',
        key: 'operation',
        render: () => (
          <Space size="middle">
            
          </Space>
        ),
      },
    ];

    const data = experimentJobs[record.id];

    return (
      <Table
        loading={isLoadingExperimentJobs[record.id] && !data}
        columns={columns}
        dataSource={experimentJobs[record.id]}
        pagination={false}
      />
    );
  };

 return <Content
  className="site-layout-background"
  style={{
    padding: 24,
    margin: 0,
    minHeight: 280,
  }}
  >
  <Button type="primary">
    Add Experiment
  </Button>
  
 <Table
  rowKey="as"
  className="components-table-demo-nested"
  columns={columns}
  expandable={{   
    expandRowByClick: true,
    expandedRowRender: expandedRowRender,
  }}
  onExpand={(expanded: boolean, record: IExperiment) => {
    
    setIsLoadingExperimentJobs(state => ({
      ...state,
      [record.id]: true
    }))

    getJobsForExperiment(record.id).then((jobs) => {
      setExperimentJobs(state => ({
        ...state,
        [record.id]: jobs
      })
    );

    setIsLoadingExperimentJobs(state => ({
      ...state,
      [record.id]: false
    }))
    
  
    setIsLoadingExperimentJobs({
      [record.id]: true
    });
    })
  }}
  dataSource={experiments}
/>
</Content>
};
