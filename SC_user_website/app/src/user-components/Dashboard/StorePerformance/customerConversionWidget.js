import React from 'react';
// This is a widget
import Widget from '../../../util/widget';
import WidgetStandardBody from '../../../util/widgetStandardBody';
// used api data utils
import ApiDataUtil from '../../../api/apiDataUtil.js';

/**
* 客流转化分析
* 1. 驻店时长,
* 2. 深访用户,
* 3. 深访率
* 4. 跳出顾客
* 5. 跳出率
*/
const CustomerConversionWidget = React.createClass({
  getBodyData() {
    let result = {};
    result.graph = false; //No graph

    // We have the dw in additional
    let totalDw = this.props.additional.dw;
    let dw = ApiDataUtil.safeDivide(totalDw / 1000, this.props.additional.vluv);

    let longstay = ApiDataUtil.addSpecific(this.props.mega, [], 'longstay');
    let p_longstay = ApiDataUtil.addSpecific(this.props.pMega, [], 'longstay');
    let ls_ratio = ApiDataUtil.safeDivide(longstay - p_longstay, p_longstay, 3);

    let shortstay = ApiDataUtil.addSpecific(this.props.mega, [], 'shortstay');
    let p_shorstay = ApiDataUtil.addSpecific(this.props.pMega, [], 'shortstay');
    let ss_ratio = ApiDataUtil.safeDivide(shortstay - p_shorstay, p_shorstay, 3);

    let inStorePv = ApiDataUtil.addSpecific(this.props.mega, [], 'vpv') - shortstay;
    let p_inStorePv = ApiDataUtil.addSpecific(this.props.pMega, [], 'vpv') - p_shorstay;

    let deep = ApiDataUtil.safeDivide(longstay, inStorePv,3);
    let p_deep = ApiDataUtil.safeDivide(p_longstay, p_inStorePv, 3);
    let deep_ratio = (deep - p_deep);

    let jump = ApiDataUtil.safeDivide(shortstay, ApiDataUtil.addSpecific(this.props.mega, [], 'vpv'), 3);
    let p_jump = ApiDataUtil.safeDivide(p_shorstay, ApiDataUtil.addSpecific(this.props.pMega, [], 'vpv'), 3);
    let jump_ratio = jump - p_jump;

    result.d1 = {
      title: '驻店时长',
      dataset: [
        {
          mainData: {
            number: dw,
            unit: 's',
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
      title: '深访用户',
      dataset: [
        {
          mainData: {
            number: longstay,
            unit: '人数',
            indicator: ls_ratio
          },
          secondaryData: {
            number: 0,
            unit: ''
          }
        }
      ]
    };
    result.d3 = {
      title: '深访率',
      dataset: [
        {
          mainData: {
            number: (deep*100).toFixed(1),
            unit: '%',
            indicator: deep_ratio
          },
          secondaryData: {
            number: 0,
            unit: ''
          }
        }
      ]
    };
    result.d4 = {
      title: '跳出顾客',
      dataset: [
        {
          mainData: {
            number: shortstay,
            unit: '人数',
            indicator: ss_ratio
          },
          secondaryData: {
            number: 0,
            unit: ''
          }
        }
      ]
    };
    result.d5 = {
      title: '跳出率',
      dataset: [
        {
          mainData: {
            number: (jump*100).toFixed(1),
            unit: '%',
            indicator: jump_ratio
          },
          secondaryData: {
            number: 0,
            unit: ''
          }
        }
      ]
    };
    return result;
  },
  render() {
    let head = {
      name: '客流转化分析',
      desc: '这个 widget 展示了包括平均驻店时长等数据'
    }
    let bodyData = this.getBodyData();
    let body = <WidgetStandardBody data={bodyData}/>
    return (
      <Widget body={body} head={head}/>
    )
  }
});

export default CustomerConversionWidget;
