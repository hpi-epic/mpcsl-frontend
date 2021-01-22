import { Badge, Button, Space, Table, Tooltip } from 'antd';
import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { getExperimentsForDataset, getJobsForExperiment, subscribeToExperimentChanges } from '../../restAPI/apiRequests';
import { BadgeStatus, IExperiment, IJob } from '../../types/types';
import { Content } from 'antd/lib/layout/layout';
import { DownloadOutlined, FileSearchOutlined, InteractionOutlined, PlayCircleOutlined, PlayCircleTwoTone } from '@ant-design/icons';
import { ExperimentDropdown } from './ExperimentsListItem/ExperimentDropdown';
import { ColumnsType } from 'antd/lib/table';
import { ALIGNMENT_RIGHT } from '@blueprintjs/icons/lib/esm/generated/iconContents';
import { NewExperimentModalForm } from './NewExperimentModal/NewExperimentModal';


export const ExperimentsView = ({
  match
}: RouteComponentProps<{ datasetId: string }>) => {

  const datasetId = parseInt(match.params.datasetId, 10);
  const [experiments, setExperiments] = React.useState<undefined | IExperiment[]>();

  const [experimentJobs, setExperimentJobs] = React.useState<{[experimentId: number]: IJob[]}>({}); 
  const [isLoadingExperimentJobs, setIsLoadingExperimentJobs] = React.useState<{[experimentId: number]: boolean}>({});

  const [addModalVisible, setAddModalVisible] = React.useState(false);

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
    {
      title: "",
      key: "state",
      render: (experiment: IExperiment) => (
        <Badge
          className="Card-Badge"
          text={experiment.last_job ? experiment.last_job.status : 'not started'}
          status={
            experiment.last_job?.status ? BadgeStatus[experiment.last_job.status] : 'default'
          }
        />
      )
    },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    {
      title: '',
      align: "right" as "right",
      key: 'operation',
      render: () => (
        <Space size="middle">
          <Tooltip key="compare" title="Compare Experiment">
            <InteractionOutlined style={{ fontSize: 20 }}/>
          </Tooltip>
          <Tooltip key="run" title="Run Experiment">
            <PlayCircleTwoTone
              style={{ fontSize: 20 }}
              twoToneColor="#87d068"
              onClick={e => {}}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const expandedRowRender = (
    record: IExperiment,
  ) => {
    const columns = [
      {
        title: "",
        key: "state",
        render: (job: IJob) => (
          <Badge
            className="Card-Badge"
            text={job.status}
            status={
              BadgeStatus[job.status]
            }
          />
        )
      },
      { title: "Job ID", dataIndex: "id", key: "id" },
      { title: "Start Time", dataIndex: "start_time", key: "start_time" },
      { title: "End Time", dataIndex: "end_time", key: "end_time" },
      {
        title: '',
        align: "right" as "right",
        key: 'operation',
        render: () => (
          <Space size="middle">
            <Tooltip key="Log" title="View Logs">
              <FileSearchOutlined
              style={{ fontSize: 20 }}/>
            </Tooltip>
            <Tooltip key="run" title="Download graph">
              <DownloadOutlined
                style={{ fontSize: 20 }}
                onClick={e => {}}
              />
            </Tooltip>
            <Button>Explore</Button>
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
    <Button type="primary" style={{ margin: '16px 0', float: "right"}} onClick={() => setAddModalVisible(true)}>
      Add Experiment
    </Button>
    
  <Table
    className="components-table-demo-nested"
    columns={columns}
    expandable={{   
      expandedRowRender: expandedRowRender
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

    <NewExperimentModalForm
        visible={addModalVisible}
        datasetId={datasetId}
        onClose={() => {
          setAddModalVisible(false);
        }}
        //experiment={lastExperiment}
        editDisabled={false}
      />
  </Content>
};
