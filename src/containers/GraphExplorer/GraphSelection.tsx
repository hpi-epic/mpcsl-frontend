import React from 'react';
import GraphRenderer from './GraphRenderer';
import { Layout } from 'antd';
import GraphNodeList from '../../components/GraphNodeList';
import { connect } from 'react-redux';
import { IStoreState } from '../../types';
import './GraphSelection.css';


interface IPropsGraphSelection {
  nodes: string[]
}

function GraphSelection(props: IPropsGraphSelection) {
  return (
    <Layout>
      <Layout.Sider className="graphSelectionSider">
        <GraphNodeList nodes={props.nodes} />
      </Layout.Sider>
      <GraphRenderer />
    </Layout>
  );
}

export function mapStateToProps({ nodes }: IStoreState) {
  return {
    nodes
  };
}

export default connect(mapStateToProps)(GraphSelection);
