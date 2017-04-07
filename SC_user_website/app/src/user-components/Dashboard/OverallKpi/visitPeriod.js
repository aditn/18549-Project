import React from 'react';
import _CONST from '../../../constants/RedKnifeConstants';
// Persented as a widget
import Widget from '../../../util/widget';
import WidgetStandardBody from '../../../util/widgetStandardBody';

// And api data util
import ApiDataUtil from '../../../api/apiDataUtil.js';
// And date store
import DateStore from '../../../reflux-stores/dateStore.js';

const LabelBody = React.createClass({
  propTypes: {
    data: React.PropTypes.array.isRequired
  },
  buildStat() {
    let result = [];
    for (let i = 0, l = this.props.data.length; i < l; i++) {
      let obj = this.props.data[i];
      let customerColor = '#fff';
      // Get color
      switch (obj._id) {
      case _CONST.customerType.activeUser:
        customerColor = _CONST.customerColors.activeUser;
        break;
      case _CONST.customerType.hypoActiveUser:
        customerColor = _CONST.customerColors.hypoActiveUser;
        break;
      case _CONST.customerType.hyperActiveUser:
        customerColor = _CONST.customerColors.hyperActiveUser;
        break;
      default:
        break;
      }
      result.push(<div className="statistic" key={i}>
        <div className="value" style={{color:customerColor}}>
          {obj.period}
          <label style={{fontSize:'1rem',color:'#afafaf'}}>天/次</label>
        </div>
        <div className="label" style={{color:customerColor}}>{obj.name}</div>
      </div>)
    }
    if(result.length <= 0){
      // Nothing was pushed!
      return(
        <div className="empty" style={{width:'100%'}}>
          There's no data!
        </div>
      )
    }
    return result;
  },
  render() {
    let stat = this.buildStat();
    return (
      <div className="ui three statistics" style={{margin:0,padding:'1rem'}}>
        {stat}
      </div>
    );
  }
});

const VisitPeriod = React.createClass({
  buildBodyData() {
    let result = [];

    let ud = this.props.mega;
    let dataObj = ApiDataUtil.seperateDataFromUD(ud);

    let ids = [
      _CONST.customerType.hypoActiveUser, _CONST.customerType.activeUser, _CONST.customerType.hyperActiveUser
    ];

    let day = DateStore.getCurrentScaleInDays();

    for (let k in dataObj) {
      let elem = dataObj[k];
      if (ids.indexOf(elem._id) !== -1) {
        // Count this in
        let denominator = ApiDataUtil.safeDivide(elem.vpv - elem.shortstay, elem.vuv, 4);
        let visitPeriod = ApiDataUtil.safeDivide(day, denominator, 0);

        let name = '';
        switch (elem._id) {
        case _CONST.customerType.activeUser:
          name = "活跃顾客";
          break;
        case _CONST.customerType.hypoActiveUser:
          name = "低活跃顾客";
          break;
        case _CONST.customerType.hyperActiveUser:
          name = "高活跃顾客";
          break;
        default:
          name = "木有找到类别";
          break;
        }
        result.push({
          _id: elem._id,
          name: name,
          period: visitPeriod
        });

      }
    }
    return result.sort(function(left,right){
      return left.period - right.period;
    });
  },
  render() {
    // console.log(this.props);
    let headData = {
      name: '用户访问周期',
      desc: '这个图嘛, 每一个柱都是访问周期 (单位是 天/次)'
    };
    let bodyData = this.buildBodyData();
    let myBody = <LabelBody data={bodyData}/>;
    return (
      <Widget body={myBody} head={headData}/>
    )
  }
});

export default VisitPeriod;
