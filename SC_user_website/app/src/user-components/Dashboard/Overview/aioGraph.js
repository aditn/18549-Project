import React from 'react';
import moment from 'moment';
import _CONST from '../../../constants/RedKnifeConstants';
// Use lineBar graph
import SimpleGraphWrapper from '../../../util/simpleGraphWrapper';
// We need scope
import DateStore from '../../../reflux-stores/dateStore.js';
// And api data util
import ApiDataUtil from '../../../api/apiDataUtil.js';

const AIOGraph = React.createClass({
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
    let dwelltime = {
      newUser: ['newUser'],
      hypoActiveUser: ['hypoActiveUser'],
      activeUser: ['activeUser'],
      hyperActiveUser: ['hyperActiveUser']
    };

    let megaDw = this.props.mega['dw'];

    let modified = megaDw.map(function (e) {
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
  getBandWidthData(xColumn) {
    let bandwidth = ['bandwidth'];
    // The bandwidth data is as date and vpv(inStorePv)
    let raw = this.props.mega['dayPv'];

    let didPush;

    for (let i = 0, l = xColumn.length; i < l; i++) {
      let curDate = xColumn[i];
      didPush = false;
      // Trying to find corresponding date in raw
      for (let j = 0, len = raw.length; j < len; j++) {
        let elem = raw[j];
        if (elem.date == curDate) {
          // Found it
          bandwidth.push(elem.vpv);
          didPush = true;
          break;
        }
      }

      if (!didPush) {
        bandwidth.push(null);
      }
    }
    return bandwidth;
  },
  buildBodyData() {
    let result = {};
    result.options = {
      padding: _CONST.graphPadding,
      // size:{}, dont care, we just want it to fit
      subchart: true, //could be true
      zoom: true, // if true, the graph scrolls
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
        y: '流量(人次)',
        y2: '驻留时间(秒)'
      },
      tooltip: {
        format: {
          value (value, ratio, id) {
            if (Object.keys(_CONST.customerType).indexOf(id) == -1) {
              // Didnt find this id
              return value + '人次';
            } else {
              // Found it, it should be in seconds
              return value + 's';
            }
          }
        }
      }
      // onClick (d){},
    };

    let xColumn = this.getXinDateFormat();
    let bandwidth = this.getBandWidthData(xColumn.slice(1));
    let dwelltime = this.getDwellTimeData(xColumn.slice(1));

    result.data = {
      x: 'x',
      xFormat: '%Y%m%d',
      columns: [
        xColumn, dwelltime.newUser, dwelltime.hypoActiveUser, dwelltime.activeUser, dwelltime.hyperActiveUser, bandwidth
      ],
      type: 'line',
      types: {
        bandwidth: 'bar'
      },
      groups: [
        [
          'newUser', 'hypoActiveUser', 'activeUser', 'hyperActiveUser'
        ]
      ],
      names: {
        newUser: '新顾客',
        hypoActiveUser: '低活跃顾客',
        activeUser: '活跃顾客',
        hyperActiveUser: '高活跃顾客',
        bandwidth: '总流量'
      },
      colors: {
        newUser: _CONST.customerColors.newUser,
        hypoActiveUser: _CONST.customerColors.hypoActiveUser,
        activeUser: _CONST.customerColors.activeUser,
        hyperActiveUser: _CONST.customerColors.hyperActiveUser,
        bandwidth: _CONST.customerColors.extra
      },
      axes: {
        bandwidth: 'y',
        newUser: 'y2',
        hypoActiveUser: 'y2',
        activeUser: 'y2',
        hyperActiveUser: 'y2'
      }
    }
    return result;
  },
  render() {
    let headData = {
      name: 'AIO 流量与平均驻留时间',
      desc: '这个图的线是总流量, 柱体是每类顾客平均驻留时间'
    };
    let bodyData = this.buildBodyData();
    return (
      <SimpleGraphWrapper body={bodyData} head={headData} tagId="AIO-graph" type='lineBar'/>
    );
  }
});

export default AIOGraph;
