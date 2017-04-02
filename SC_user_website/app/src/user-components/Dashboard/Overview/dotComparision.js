import React from 'react';
import _CONST from '../../../constants/RedKnifeConstants';
// Use scattered garph
import SimpleGraphWrapper from '../../../util/simpleGraphWrapper';
// Uses dropdown
import DropDown from '../../../util/dropDown';
// ApiDataUtil
import ApiDataUtil from '../../../api/apiDataUtil.js';
// use dateStore to get scale in days
import DateStore from '../../../reflux-stores/dateStore.js';

const AxisSelector = React.createClass({
  render() {
    const op = _CONST.dotComparisionOptions;
    return (
      <div>
        <DropDown
          defaultOption={this.props.x}
          fixedLabel={'X 轴 : '}
          onChange={this.props.onXChange}
          options={op}/>
        <DropDown
          defaultOption={this.props.y}
          fixedLabel={'Y 轴 : '}
          onChange={this.props.onYChange} options={op}/>
      </div>
    )
  }
});

const DotComparision = React.createClass({
  getInitialState() {
    return {
      x: _CONST.dotComparisionOptions.totalPv,
      y: _CONST.dotComparisionOptions.inStorePv
    }
  },
  getFnBasedOnOptions(obj) {
    if (typeof(obj) !== 'object') {
      console.error('Non object being passed! : ' + typeof(obj));
      return;
    }
    const op = _CONST.dotComparisionOptions;
    let fn;
    // Define a function based on our current x and y axis
    switch (obj) {
    case(op.totalPv):
      fn = this.getTotalPv;
      break;
    case(op.totalUv):
      fn = this.getTotalUv;
      break;
    case(op.inStorePv):
      fn = this.getInStorePv;
      break;
    case(op.ipv_ratio):
      fn = this.getIpvRatio;
      break;
    case(op.dw):
      fn = this.getDw;
      break;
    case(op.vPeriod):
      fn = this.getVPeriod;
      break;
    case(op.oc):
      fn = this.getOC;
      break;
    case(op.oc_ratio):
      fn = this.getOCRatio;
      break;
    case(op.nc):
      fn = this.getNC;
      break;
    case(op.nc_ratio):
      fn = this.getNCRatio;
      break;
    default:
      break;
    }
    return fn;
  },
  getTotalPv(obj) {
    return ApiDataUtil.addSpecific(obj.data, null, 'pv');
  },
  getTotalUv (obj) {
    return ApiDataUtil.addSpecific(obj.data, null, 'uv');
  },
  getInStorePv (obj) {
    return ApiDataUtil.addSpecific(obj.data, null, 'vpv') - ApiDataUtil.addSpecific(obj.data, null, 'shortstay');
  },
  getIpvRatio (obj) {
     let ipv = this.getInStorePv(obj);
     let pv = this.getTotalPv(obj);
    return (ApiDataUtil.safeDivide(ipv, pv, 4) * 100).toFixed(3);
  },
  getNC (obj) {
    return ApiDataUtil.addSpecific(obj.data, ['0'], 'vpv') - ApiDataUtil.addSpecific(obj.data, ['0'], 'shortstay');
  },
  getOC (obj) {
    return ApiDataUtil.addSpecific(obj.data, [
      '1', '2', '15'
    ], 'vpv') - ApiDataUtil.addSpecific(obj.data, [
      '1', '2', '15'
    ], 'shortstay');
  },
  getNCRatio (obj) {
     let nc = this.getNC(obj);
     let ipv = this.getInStorePv(obj);
    return (ApiDataUtil.safeDivide(nc, ipv, 4) * 100).toFixed(3);
  },
  getOCRatio (obj) {
     let oc = this.getNC(obj);
     let ipv = this.getInStorePv(obj);
    return (ApiDataUtil.safeDivide(oc, ipv, 4) * 100).toFixed(3);
  },
  getDw (obj) {
    // Divided by 1000 makes it into seconds
    return ApiDataUtil.safeDivide(ApiDataUtil.addSpecific(obj.data, null, 'dw') / 1000, ApiDataUtil.addSpecific(obj.data, null, 'vluv'), 3);
  },
  getVPeriod (obj) {
    // vPeriod = timePeriod / ((vpv - shortstay)/vuv)
     let timePeriod = DateStore.getCurrentScaleInDays();
     let vpv = this.getInStorePv(obj);
     let vuv = ApiDataUtil.addSpecific(obj.data, [
      '1', '15', '2'
    ], 'vuv');

     let denominator = ApiDataUtil.safeDivide(vpv, vuv, 4);
    return ApiDataUtil.safeDivide(timePeriod, denominator, 3);
  },
  buildData () {
    // This build data builds both xs and columns
     let result = {
      xs: {},
      columns: []
    };

     let modified = ApiDataUtil.combineAp(this.props.mega);

     let op = _CONST.dotComparisionOptions;
     let x_fn = this.getFnBasedOnOptions(this.state.x);
     let y_fn = this.getFnBasedOnOptions(this.state.y);
    // Now we have the fn
    for ( let i = 0, l = modified.length; i < l; i++) {
       let elem = modified[i];
      // For each set of data, we  calculate the targeted stuff and insert
      if (elem.ap !== undefined) {
        // Ap is defined;
        // This is to build the match for chart data
         let xName = elem.ap + 'x';
        result.xs[elem.ap] = xName;
        // Then get data
         let xAxis = [
          xName, x_fn(elem)
        ];
         let yAxis = [
          elem.ap, y_fn(elem)
        ];
        // Then push
        result.columns.push(xAxis);
        result.columns.push(yAxis);
      }
    }
    return result;
  },
  getBodyData () {
     let result = {};
    result.options = {
      padding: _CONST.graphPadding,
      grid: {
        x: true,
        y: true
      },
      labels: false,
      axisLabel: {
        x: this.state.x.label,
        y: this.state.y.label
      },
      point: {
        r: 6
      },
      tooltip: {
        format: {
          title: (d, a, b) => {
            return 'x轴 : ' + d;
          },
          value: (value, ratio, id) => {
            return 'y轴 : ' + value;
          }
        }
      }
    };

     let r = this.buildData();

    result.data = {
      xs: r.xs,
      columns: r.columns,
      type: 'scatter'
    }
    return result;
  },
  onXChange(newVal) {
    this.setState({
      x: newVal
    });
  },
  onYChange(newVal) {
    this.setState({
      y: newVal
    });
  },
  render() {
     let headData = {
      name: '分布数据',
      desc: '可选数据. 图中每点代表一家店',
      legend:
      <AxisSelector x={this.state.x} y={this.state.y} onXChange={this.onXChange} onYChange={this.onYChange}/>
    }
     let bodyData = this.getBodyData();
    return (
      <SimpleGraphWrapper body={bodyData} head={headData} tagId="dotcmp" type="scatter"/>
    );
  }
});

export default DotComparision;
