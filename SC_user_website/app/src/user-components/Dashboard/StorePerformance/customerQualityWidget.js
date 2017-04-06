import React from 'react';
import _CONST from '../../../constants/RedKnifeConstants.js';
import moment from 'moment';
// This is a widget
import Widget from '../../../util/widget';
import WidgetStandardBody from '../../../util/widgetStandardBody';
// used api data utils
import ApiDataUtil from '../../../api/apiDataUtil.js';
// Use C3Chart directly
import C3Chart from '../../../util/c3Chart';
import API_wrap from '../../../api/apiWrapper.js';
// To get dates
import DateStore from '../../../reflux-stores/dateStore.js';

const OCDistPieChart = React.createClass({
  buildPieData(){

    let activeUser = this.props.data.activeUser.vpv;
    let hypoActiveUser = this.props.data.hypoActiveUser.vpv;
    let hyperActiveUser = this.props.data.hyperActiveUser.vpv;

    return {
      columns : [
        ['activeUser',activeUser],
        ['hypoActiveUser',hypoActiveUser],
        ['hyperActiveUser',hyperActiveUser]
      ],
      type:'pie',
      names:{
        'activeUser': '活跃用户',
        'hypoActiveUser' :'低活跃用户',
        'hyperActiveUser' :'高活跃用户'
      },
      colors:{
        hypoActiveUser: _CONST.customerColors.hypoActiveUser,
        activeUser: _CONST.customerColors.activeUser,
        hyperActiveUser: _CONST.customerColors.hyperActiveUser
      },
    }
  },
  render() {
    let graphOptions = {
      labels: true,
      size:{
        width : 200,
        height: 200
      }
    };
    let graphData = this.buildPieData();
    return (
      <C3Chart data={graphData} options={graphOptions} tagId={this.props.tagId}/>
    )
  }
});

const CustomerQualityWidget = React.createClass({
  calculateDays(start,end){
    let duration = moment.duration(end.diff(start));
    let days = duration.asDays();
    return days;
  },
  getBodyData() {
    let ud = this.props.mega.general;
    let dataObj = ApiDataUtil.seperateDataFromUD(ud);

    let p_ud = this.props.mega.previous;
    let p_dataObj = ApiDataUtil.seperateDataFromUD(p_ud);

    // Some calculation
    let newUser = dataObj.newUser.vpv - dataObj.newUser.shortstay;
    let p_newUser = p_dataObj.newUser.vpv - p_dataObj.newUser.shortstay;

    let oldUser = ApiDataUtil.getSumFromObj(dataObj, [
      _CONST.customerType.hypoActiveUser, _CONST.customerType.hyperActiveUser, _CONST.customerType.activeUser
    ]);

    let p_oldUser = ApiDataUtil.getSumFromObj(p_dataObj, [
      _CONST.customerType.hypoActiveUser, _CONST.customerType.hyperActiveUser, _CONST.customerType.activeUser
    ]);

    let total = oldUser.vpv + newUser;
    let p_total = p_oldUser.vpv + p_newUser;

    // 平均来访周期计算方法:
    // 时间段 / ((时间段内的 vpv - shortstay)/vuv)
    let cur_scope = DateStore.getCurrentScope();
    let timePeriod = this.calculateDays(cur_scope.start,cur_scope.end);
    let vuv = ApiDataUtil.addSpecific(ud,[],'vuv');
    let vpvMinusShortstay = ApiDataUtil.addSpecific(ud,[],'vuv') - ApiDataUtil.addSpecific(ud,[],'shortstay');

    let averageVisitPeriod = ApiDataUtil.safeDivide(timePeriod, (ApiDataUtil.safeDivide(vpvMinusShortstay,vuv)));

    let result = {};
    result.graph = <OCDistPieChart data={dataObj} tagId='ocDistPie'/>;
    result.d1 = {
      title: '平均来访周期',
      dataset: [
        {
          mainData: {
            number: averageVisitPeriod,
            unit: '天/次',
            indicator: 0
          },
          secondaryData: {
            number: 0,
            unit: ''
          }
        }
      ]
    };
    result.d2 = {
      title: '新顾客',
      dataset: [
        {
          mainData: {
            number: newUser,
            unit: '人次',
            indicator: (newUser - p_newUser) / p_newUser
          },
          secondaryData: {
            number: (ApiDataUtil.safeDivide(newUser, total, 3) * 100).toFixed(1),
            unit: ' 占比 %'
          }
        }
      ]
    };
    result.d3 = {
      title: '老顾客',
      dataset: [
        {
          mainData: {
            number: oldUser.vpv,
            unit: '人次',
            indicator: (oldUser.vpv - p_oldUser.vpv) / p_oldUser.vpv
          },
          secondaryData: {
            number: (ApiDataUtil.safeDivide(oldUser.vpv, total, 3) * 100).toFixed(1),
            unit: '占比 %'
          }
        }
      ]
    }
    return result;
  },
  render() {
    let head = {
      name: '客流质量',
      desc: '这个 widget 完整的表达了客流质量',
      legend: ''
    };
    let bodyData = this.getBodyData();
    let body = <WidgetStandardBody data={bodyData}/>
    return (
      <Widget body={body} head={head}/>
    )
  }
});

export default CustomerQualityWidget;
