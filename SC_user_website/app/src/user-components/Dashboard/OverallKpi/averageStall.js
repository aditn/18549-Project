import React from 'react';
import moment from'moment';
import _CONST from '../../../constants/RedKnifeConstants';
// Draw a line chart
import SimpleGraphWrapper from '../../../util/simpleGraphWrapper';
// To get dates
import DateStore from '../../../reflux-stores/dateStore.js';
import ApiDataUtil from '../../../api/apiDataUtil.js';

// AverageStall time can be fetched from dw
const AverageStall = React.createClass({
  getXinDateFormat() {
    let xColumn = ['x'];
    let cur_scope = DateStore.getCurrentScope();

    let start_date = cur_scope.start.clone();
    let end_date = cur_scope.end.clone();

    while (!moment(end_date).isBefore(start_date)) {
      xColumn.push(start_date.format(_CONST.dateFormat));
      start_date.add(1, 'day');
    }
    return xColumn;
  },
  getDwellTimeData(xColumn) {
    const dwelltime = {
      newUser: ['newUser'],
      hypoActiveUser: ['hypoActiveUser'],
      activeUser: ['activeUser'],
      hyperActiveUser: ['hyperActiveUser']
    };

    let megaDw = this.props.mega;

    let modified = megaDw.map((e) => {
      return {
        avg: ApiDataUtil.safeDivide(e.dw / 1000, e.vluv, 0).toString(),
        type: e.type,
        date: e.date
      }
    });

    for (let i = 0, l = xColumn.length; i < l; i++) {
      let curDate = xColumn[i];
      // Now we go and find the data
      let didPush = {
        nu: false,
        au: false,
        hoau: false,
        heau: false
      };
      for (let j = 0, len = modified.length; j < len; j++) {
        let elem = modified[j];
        // If date match
        if (moment(elem.date, _CONST.dateFormat).isSame(moment(curDate, _CONST.dateFormat))) {
          switch (elem.type) {
          case _CONST.customerType.newUser:
            dwelltime.newUser.push(elem.avg);
            didPush.nu = true;
            break;
          case _CONST.customerType.hypoActiveUser:
            dwelltime.hypoActiveUser.push(elem.avg);
            didPush.hoau = true;
            break;
          case _CONST.customerType.activeUser:
            dwelltime.activeUser.push(elem.avg);
            didPush.au = true;
            break;
          case _CONST.customerType.hyperActiveUser:
            dwelltime.hyperActiveUser.push(elem.avg);
            didPush.heau = true;
            break;
          default:
            break;
          }
        }
      }
      if (!didPush.nu) {
        // Didnt find a match date
        dwelltime.newUser.push(null);
      }
      if (!didPush.hoau) {
        dwelltime.hypoActiveUser.push(null);
      }
      if (!didPush.au) {
        dwelltime.activeUser.push(null);
      }
      if (!didPush.heau) {
        dwelltime.hyperActiveUser.push(null);
      }
    }
    return dwelltime;
  },
  buildBodyData() {
    let result = {};
    result.options = {
      padding: _CONST.graphPadding,
      grid: {
        x: true,
        y: true
      }, //The grid makes it look nicer
      labels: false,
      axisLabel: {
        x: {
          type: 'timeseries',
          localtime: true,
          tick: {
            format: '%Y/%m/%d'
          }
        },
        y: '驻留时间(秒)'
      },
      tooltip: {
        format: {
          value (value, ratio, id) {

            return value + 's';
          }
        }
      }
    };

    let xColumn = this.getXinDateFormat();
    let dwelltime = this.getDwellTimeData(xColumn.slice(1));

    result.data = {
      x: 'x',
      xFormat: '%Y%m%d',
      columns: [
        xColumn, dwelltime.newUser, dwelltime.hypoActiveUser, dwelltime.activeUser, dwelltime.hyperActiveUser
      ],
      type: 'line',
      names: {
        newUser: '新顾客',
        hypoActiveUser: '低活跃顾客',
        activeUser: '活跃顾客',
        hyperActiveUser: '高活跃顾客'
      },
      colors:{
        newUser: _CONST.customerColors.newUser,
        hypoActiveUser: _CONST.customerColors.hypoActiveUser,
        activeUser: _CONST.customerColors.activeUser,
        hyperActiveUser: _CONST.customerColors.hyperActiveUser
      },
    }
    return result;
  },
  render () {
    const headData = {
      name: '平均驻留时间',
      desc: '这个图嘛, 表达了每种用户的平均驻留时间.'
    };
    let bodyData = this.buildBodyData();
    return (
      <SimpleGraphWrapper body={bodyData} head={headData} tagId="averageStall" type="line"/>
    )
  }
});

export default AverageStall;
