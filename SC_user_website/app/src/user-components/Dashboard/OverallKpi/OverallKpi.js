import React from 'react';
import Reflux from 'reflux';
// load constants
import _CONST from '../../../constants/RedKnifeConstants';
import OverallKpiDataStore from './OverallKpiDataStore.js';
// ControlActions
import ControlActions from '../../../reflux-actions/controlActions.js';
// Loader
import Loader from '../../../util/loader';
// All components
import VisitPeriod from './visitPeriod';
import AverageStall from './averageStall';

// Overall KPI
// 分类用户访问周期
// 阶段内的用户流量及驻留平均值
// 	- 小时/天
// 	- 天/周
// 	- 天/月
const OverallKpi = React.createClass({
  mixins: [Reflux.connect(OverallKpiDataStore, 'mega')],
  render() {
    return (
      <div>
        <div className="ui padded grid">
          <div className="row">
            {this.state.mega.visitPeriod.isLoading ? <Loader/> : <VisitPeriod mega={this.state.mega.visitPeriod.data}/>}
          </div>
          <div className="row">
            {this.state.mega.averageStall.isLoading ? <Loader/> : <AverageStall mega={this.state.mega.averageStall.data}/>}
          </div>
        </div>
      </div>
    )
  }
});

export default OverallKpi;
