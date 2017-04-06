import React from 'react';

const DwLineGraph = React.createClass({
  render() {
    const headData = {
      title: '驻留时间折线图',
      desc: '分类客户的驻留时间图'
    }
    return (
      <SimpleGraphWrapper body={bodyData} head={headData} tagId="DwLineChart"/>
    )
  }
});
