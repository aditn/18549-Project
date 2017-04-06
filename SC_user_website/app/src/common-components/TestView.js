import React from 'react';
import Dropdown from '../util/dropDown.js';

const TestView = React.createClass({
  onChange(newVal) {
    console.log(newVal);
  },
  render() {
    const containerStyle = {
      textAlign: 'center',
      paddingTop: '100px'
    };
    const myDefault = {
      label: 'A bro cannot give another bro a teddy bear',
      name: 'haha'
    };
    const myOptions = [
      {label: 'a bro has to scratch when a bro has to scratch', name: 'xixi'},
      {label: 'bros never use the term "YO"', name: 'hehe'},
      {label: 'Games before dames', name: 'gaga'},
      {label: 'a bro does not put his hands on another bros waist', name: 'coco'},
      {label: 'bros wear their pants above their ass', name: 'yoyo'},
      {label: 'bros dont smell each other on purpose', name: 'jiji'},
    ];
    return (
      <div style={containerStyle}>
        <Dropdown options={myOptions} defaultOption={myDefault} fixedLabel={"当前项目 :"} onChange={this.onChange}/>
      </div>
    );
  },

});

export default TestView;
