import React from 'react';
import _CONST from '../../../constants/RedKnifeConstants';
// has a pie chart, wrapped by simpleGraphWrapper
import SimpleGraphWrapper from '../../../util/simpleGraphWrapper';

const MacDist = React.createClass({
  getBodyData(){
    let myColumns = [];
    // let totalVal = 0;

    for(let i = 0, l = this.props.geo.length; i < l; i++){
      let elem = this.props.geo[i];
      // totalVal += elem.pv;
      // Each elem stands for one part of the pie
      myColumns.push(
        [elem._id,elem.pv]
      );
    }

    // console.log(totalVal)

    let result = {
      data:{
        columns:myColumns,
        type:'pie'
      },
      options:{
        padding: _CONST.graphPadding
      }
    };

    return result;
  },
  render(){
    let headData = {
      name: 'Mac分布(地区)',
      desc: 'A pie chart'
    }
    let bodyData= this.getBodyData();
    return(
        <SimpleGraphWrapper head={headData} body={bodyData} tagId="macdist" type="pie"/>
    );
  }
});

export default MacDist;
