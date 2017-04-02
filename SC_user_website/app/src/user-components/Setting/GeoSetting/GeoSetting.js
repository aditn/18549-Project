import React from 'react';
import Reflux from 'reflux';
import BindToMixin from 'react-binding';

import ControlActions from '../../../reflux-actions/controlActions.js';
import GeoStore from '../../../reflux-stores/geoStore.js';

const GeoSetting = React.createClass({
  mixins:[
    Reflux.listenTo(GeoStore,'onGeoChange'),
    BindToMixin
  ],
  getInitialState(){
    return {
      curAreaName : '',
      curSelected : '',
      allProvinces : [],
      area:[]
    };
  },
  onGeoChange(newGeo){
    if(newGeo.allProvinces !== undefined && newGeo.allProvinces.length > 0){
      this.setState({
        allProvinces : newGeo.allProvinces
      });
    }
    if(newGeo.area !== undefined && newGeo.area.length > 0){
      this.setState({
        area : newGeo.area
      });
    }
  },
  componentDidMount(){
    let self = this;
    $('#geosetting-select').dropdown({
      onChange(allVal){
        self.setState({
          curSelected : allVal
        });
      }
    });
  },
  buildProvince(){
    let result = this.state.allProvinces || [];
    return result.map((cur,i)=>{
      return (
        <div key={i} className="item" data-value={cur.id}>{cur.name}</div>
      )
    });
  },
  buildExistedSetting(){
    let esetting = this.state.area;
    return esetting.map((cur,i)=>{
      return(
        <div key={i} className="ui label">
          <span style={{color:'black',marginRight:'1rem'}}>{cur.name}</span>
          {cur.provinces.map((p,j)=>{return p.name})}
          <button className="ui icon button">
            <i className="icon delete"></i>
          </button>
        </div>
      )
    });
  },
  findByMatchId(idstr){
    let ids = idstr.split(',');
    let result = [];
    this.state.allProvinces.forEach((p)=>{
      if(ids.indexOf(p.id) != -1){
        result.push(p);
      }
    });
    return result;
  },
  clearAndSubmit(){
    console.log(this.state);
    // This is submit
    let toAdd = this.findByMatchId(this.state.curSelected);

    // This is clear
    this.setState({
      curAreaName: '',
      curSelected: ''
    });
    $('#geosetting-select').dropdown('restore defaults');
  },
  enterAreaName(event,val){
    console.log(val);
    this.setState({
      curAreaName: val
    });
  },
  render(){
    let provinceAsOptions = this.buildProvince();
    let existingSettings = this.buildExistedSetting();
    return(
      <div className="wrapper-container">
        <div className="header wb">
          GEO SETTING
        </div>
        <div className="body wb">
            <div className="ui segment">
              {existingSettings}
            </div>
            <div className="ui segment">

              <div className="ui input">
                <input placeholder="请输入地区名字"
                  valueLink={this.bindToState('curAreaName')}/>
              </div>
              <button className="ui basic button" onClick={this.clearAndSubmit}>添加</button>

              <div id="geosetting-select" className="ui fluid multiple search selection dropdown">
                <input type="hidden" name="province"/>
                <i className="dropdown icon"></i>
                <div className="default text">选择省份</div>
                <div className="menu">
                  {provinceAsOptions}
                </div>
              </div>
            </div>
        </div>
      </div>
    );
  }
});

export default GeoSetting;
