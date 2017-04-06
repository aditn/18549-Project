// Dependencies
import React from 'react';
import Reflux from 'reflux';

// Table
import Reactable from '../../../util/reactable';
let RankTable = Reactable.Table;
// API UTIL
import ApiDataUtil from '../../../api/apiDataUtil.js';
// ControlActions
import ControlActions from '../../../reflux-actions/controlActions.js';
import _CONST from '../../../constants/RedKnifeConstants.js';
// Data
import IRDataStore from './IRDataStore.js';
import Widget from '../../../util/widget';

/**
*  Rank table
*  (健康指数排名), TODO: 现在默认入店量, 无权重指数
*
*  客流量, 入店量, 入店人数, 入店率, 新顾客,
*  老顾客, 来访周期, 驻留时长, 深访率, 跳出率
*
*/
const IndicatorRanking = React.createClass({
  mixins: [Reflux.connect(IRDataStore, 'mega')],
  buildRow(obj, day, rank) {
    let standardRow = {
      'ap': '',
      'rank': rank,
      'totalPv': '',
      'inStorePv': '',
      'inStoreUv': '',
      'ipv_ratio': '',
      'newUser': '',
      'oldUser': '',
      'visitPeriod': '',
      'dw': '',
      'deep_ratio': '',
      'jump_ratio': ''
    };

    standardRow.ap = obj.ap;
    // These are the types we take into account
    let types = [
      _CONST.customerType.newUser,
      _CONST.customerType.hypoActiveUser,
      _CONST.customerType.activeUser,
      _CONST.customerType.hypoActiveUser
    ];

    standardRow.totalPv = ApiDataUtil.addSpecific(obj.data, types, 'pv');

    standardRow.inStorePv = ApiDataUtil.addSpecific(obj.data, types, 'vpv') - ApiDataUtil.addSpecific(obj.data, types, 'shortstay');

    standardRow.inStoreUv = ApiDataUtil.addSpecific(obj.data, types, 'vuv');

    standardRow.newUser = ApiDataUtil.addSpecific(obj.data, ['0'], 'vpv') - ApiDataUtil.addSpecific(obj.data, ['0'], 'shortstay');

    standardRow.oldUser = ApiDataUtil.addSpecific(obj.data, [
      '1', '2', '15'
    ], 'vpv') - ApiDataUtil.addSpecific(obj.data, [
      '1', '2', '15'
    ], 'shortstay');

    // Calculate visit period
    // VP = scale / (vpv - shortstay)/vuv
    let denominator = ApiDataUtil.safeDivide(ApiDataUtil.addSpecific(obj.data, types, 'vpv') - ApiDataUtil.addSpecific(obj.data, types, 'shortstay'), ApiDataUtil.addSpecific(obj.data, types, 'vuv'), 5);

    standardRow.visitPeriod = ApiDataUtil.safeDivide(day, denominator, 0);

    let totalDw = ApiDataUtil.addSpecific(obj.data, types, 'dw');
    let vluv = ApiDataUtil.addSpecific(obj.data, types, 'vluv');
    standardRow.dw = ApiDataUtil.safeDivide(totalDw / 1000, vluv);

    standardRow.deep_ratio = ApiDataUtil.safeDivide(ApiDataUtil.addSpecific(obj.data, types, 'longstay'), ApiDataUtil.addSpecific(obj.data, types, 'vpv') - ApiDataUtil.addSpecific(obj.data, types, 'shortstay'), 3);

    standardRow.jump_ratio = ApiDataUtil.safeDivide(ApiDataUtil.addSpecific(obj.data, types, 'shortstay'), ApiDataUtil.addSpecific(obj.data, types, 'vpv'), 3);

    standardRow.ipv_ratio = ApiDataUtil.safeDivide(standardRow.inStorePv, standardRow.totalPv, 3);

    return standardRow;
  },
  buildTableData() {
    let result = [];

    let modified = ApiDataUtil.combineAp(this.state.mega.general);
    let day = this.state.mega.day;
    for (let i = 0, l = modified.length; i < l; i++) {
      // Loop through each object
      let data = modified[i];
      // day is used in calculating visit period
      let row = this.buildRow(data, day, i);

      result.push(row);
    }
    return result;
  },
  render () {
    let tableData = this.buildTableData();
    const translatedColumns = [
      {
        key: 'ap',
        label: '商铺名称'
      }, {
        key: 'rank',
        label: '排名'
      }, {
        key: 'totalPv',
        label: '总 PV'
      }, {
        key: 'inStorePv',
        label: '店内 PV'
      }, {
        key: 'inStoreUv',
        label: '店内 UV'
      }, {
        key: 'ipv_ratio',
        label: '入店率'
      }, {
        key: 'newUser',
        label: '新顾客'
      }, {
        key: 'oldUser',
        label: '老顾客'
      }, {
        key: 'visitPeriod',
        label: '访问周期(天/次)'
      }, {
        key: 'dw',
        label: '驻留时间'
      }, {
        key: 'deep_ratio',
        label: '深访率'
      }, {
        key: 'jump_ratio',
        label: '跳出率'
      }
    ];

    const myHead = {
      name: '趋势排行',
      desc: 'Just a table'
    };

    let myBody = <RankTable columns={translatedColumns} data={tableData} fixedColumns={[
        'ap', 'rank'
      ]} itemsPerPage={10} sortable={true}/>
    return (
      <div className="ui padded grid">
        <div className="row">
          <Widget body={myBody} head={myHead}/>
        </div>
      </div>
    )
  }
});

export default IndicatorRanking;
