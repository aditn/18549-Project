import React from 'react';
// This is a widget
import Widget from '../../../util/widget';
import WidgetStandardBody from '../../../util/widgetStandardBody';
// used api data utils
import ApiDataUtil from '../../../api/apiDataUtil.js';


/**
* This widget needs
*   1. totalPv (type = 0,1,2,15)
*   2. totalUv (type = 0,1,2,15)
*   3. tpv_ratio
*   4. inStorePv (type = 0,1,2,15)
*   5. inStoreUv (type = 0,1,2,15)
*   6. ipv_ratio
*/
const CustomerFlowWidget = React.createClass({
  getBodyData(){
    // console.log(this.props);
    let result = {};
    result.graph = false;
    /*
     *   1. totalPv (type = 0,1,2,15)
     *   2. totalUv (type = 0,1,2,15)
     *   3. tpv_ratio
     *   4. inStorePv (type = 0,1,2,15)
     *   5. inStoreUv (type = 0,1,2,15)
     *   6. ipv_ratio
     */
    let data = this.props.mega;
    let totalPv = ApiDataUtil.addSpecific(data.general,[],'pv');
    let p_totalPv = ApiDataUtil.addSpecific(data.previous,[],'pv');
    let tpv_ratio = ApiDataUtil.safeDivide(totalPv-p_totalPv,p_totalPv);

    let totalUv = ApiDataUtil.addSpecific(data.general,[],'uv');


    let inStorePv = ApiDataUtil.addSpecific(data.general,[],'vpv');
    let p_inStorePv = ApiDataUtil.addSpecific(data.previous,[],'vpv');

    let inStoreUv = ApiDataUtil.addSpecific(data.general,[],'vuv');
    let ipv_ratio = ApiDataUtil.safeDivide(inStorePv-p_inStorePv,p_inStorePv);

    result.d1 = {
      title:'客流量',
      dataset:[
        {
          mainData:{
            number: totalPv,
            unit: '人次',
            indicator: tpv_ratio,
          },secondaryData:{
            number: totalUv,
            unit: '人数'
          }
        }
      ]
    };
    result.d2 = {
      title:'入店量',
      dataset:[
        {
          mainData:{
            number: inStorePv,
            unit: '人次',
            indicator: ipv_ratio
          },secondaryData:{
            number: inStoreUv,
            unit:'人数'
          }
        }
      ]
    };
    result.d3 = {
      title:'入店率',
      dataset:[
        {
          mainData:{
            number: Math.abs(ApiDataUtil.safeDivide(inStorePv,totalPv,3) * 100).toFixed(1),
            unit: '%',
            indicator: (ApiDataUtil.safeDivide(inStorePv,totalPv,3)
            - ApiDataUtil.safeDivide(p_inStorePv,p_totalPv,3)).toFixed(1)
          },secondaryData:{
            number: 0,
            unit:''
          }
        }
      ]
    };
    return result;
  },
  render(){
    let head = {
      name :'店铺客流',
      desc :'这个 widget 展示了所有店铺的客流量'
    };
    let bodyData = this.getBodyData();
    let body = <WidgetStandardBody data={bodyData}/>
    return(
      <Widget head={head} body={body}/>
    )
  }
});

export default CustomerFlowWidget;
