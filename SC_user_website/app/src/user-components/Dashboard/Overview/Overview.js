import React from 'react';
import Reflux from 'reflux';
// OverviewDataStore has all data that Overview uses
import OverviewDataStore from './OverviewDataStore.js';
// Loader
import Loader from '../../../util/loader';
// All components that Overview would display
import AIOGraph from './aioGraph';
import MacDist from './macDist';
import CustomerFlowWidget from '../StorePerformance/customerFlowWidget';
import DotComparision from './dotComparision';

// AIO (流量, 驻留时间)
// Mac 总数 + 地域分布 (maybe pie chart)
// 新老客户分类
// 分布数据
const Overview = React.createClass({
  mixins: [
    Reflux.connect(OverviewDataStore, 'mega')
  ],
  render() {
    return (
      <div className="ui padded grid">
        <div className="row">
          {(this.state.mega.aioGraph.isLoading) ? <Loader/> : <AIOGraph mega={this.state.mega.aioGraph.data}/>}
        </div>
        <div className="row">
          {this.state.mega.macDist.isLoading ? <Loader/> : <MacDist geo={this.state.mega.macDist.data}/>}
        </div>
        <div className="row">
          {this.state.mega.cfwiget.isLoading ? <Loader/> : <CustomerFlowWidget mega={this.state.mega.cfwiget.data}/>}
        </div>
        <div className="row">
          {(this.state.mega.dotCmp.isLoading) ? <Loader/> : <DotComparision mega={this.state.mega.dotCmp.data}/>}
        </div>
      </div>
    )
  }
});

export default Overview;
