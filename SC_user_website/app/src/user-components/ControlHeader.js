// Dependencies
import React from 'react';
import Reflux from 'reflux';
import {Link} from 'react-router';
import cx from 'classnames';
// Connection points
import ControlActions from '../reflux-actions/controlActions';
import DateStore from '../reflux-stores/dateStore';
import ProjectStore from '../reflux-stores/projectStore.js';
// Componnents
import Dropdown from '../util/dropDown';
import DatePicker from 'react-datepicker';

// Load constants
import _CONST from '../constants/RedKnifeConstants';
import {GeoSelector} from '../util/geoSelector';

const HeaderNavItem = React.createClass({
  propTypes: {
    link: React.PropTypes.string,
    text: React.PropTypes.string
  },
  render() {
    return (
      <Link className="item" to={this.props.link}>
        {this.props.text}
      </Link>
    );
  }
});

const ProjectSelector = React.createClass({
  mixins: [Reflux.listenTo(ProjectStore, 'onProjectStoreDataUpdate')],
  getInitialState() {
    return {
      cur_project: {
        name: '',
        label: ''
      },
      allProjects: []// Inited to be empty
    };
  },
  _onProjectChange(newProj) {
    ControlActions.curProjectChange(newProj);
    this.setState({
      cur_project: newProj
    });
  },
  onProjectStoreDataUpdate(data) {
    if (data.cur_project.name === undefined || data.cur_project.name === '') {
      // No cur_project, set cur project
      if (data.allProjects !== undefined && data.allProjects.length >= 1) {
        ControlActions.curProjectChange(data.allProjects[0]);
      }
    }
    this.setState({
      cur_project: data.cur_project,
      allProjects: data.allProjects
    });
  },
  render() {
    // console.log(this.state.cur_project);
    return (
      <Dropdown
        defaultOption = {this.state.cur_project}
        fixedLabel = "当前项目: "
        onChange = {this._onProjectChange}
        options = {this.state.allProjects}/>
    );
  }
});

const ScaleSelector = React.createClass({
  mixins: [
    Reflux.connect(DateStore, 'cur_date')
  ],
  _scaleChange(newScale) {
    ControlActions.scaleChange(newScale);
  },
  render() {
    return (
      <Dropdown
         defaultOption={this.state.cur_date.cur_scale}
         fixedLabel="周期: "
         onChange={this._scaleChange}
         options={_CONST.scaleOptions}/>
     );
  }
});

const ScopeSelector = React.createClass({
  mixins: [
    Reflux.connect(DateStore, 'cur_date')
  ],
  _scopeChange(name, newDate) {
    if (name === 'start') {
      ControlActions.scopeStartChange(newDate);
    } else if (name === 'end') {
      ControlActions.scopeEndChange(newDate);
    }
  },
  render() {
    return (
      <div className="scope-selector clearfix">
        <div className="start ui labeled input">
          <div className="ui basic label">
            开始日期:
          </div>
          <DatePicker className="ui input" dateFormat="MMMM/DD/YYYY" disabled={true}
              selected={this.state.cur_date.cur_scope.start}/>
        </div>
        <div className="end ui labeled input">
          <div className="ui basic label">
            结束日期:
          </div>
          <DatePicker className="ui input" dateFormat="MMMM/DD/YYYY"
            onChange={this._scopeChange.bind(this, 'end')}
            selected={this.state.cur_date.cur_scope.end}/>
        </div>
      </div>
    );
  }
});

/**
* ControlHeader
* This header itself can control both date changes and loc changes
* also triggers actions
*/
const ControlHeader = React.createClass({
  getInitialState(){
    return {
      fixed : false
    };
  },
  componentWillMount(){
    // Use header to init everything now. Used to be sidebar
    ControlActions.initDate();
    ControlActions.initGeo();
    ControlActions.initProject();
    ControlActions.initDevice();
    ControlActions.initStore();
  },
  componentWillUnmount(){
    window.removeEventListener('scroll',this._fixHeader);
  },
  componentDidMount(){
    window.addEventListener('scroll',this._fixHeader);
  },
  _fixHeader(){
    let x = window.scrollY;
    if(x >= 70){
      this.setState({
        fixed: true
      })
    }else{
      this.setState({
        fixed: false
      })
    }
  },
  setMenu(list){
    this.props.onSectionChange(list);
  },
  render() {
    let user = _CONST.defaultUser;
    let companyLogoStyle={
      width : '200px',
      background: `url(${user.brandLogo})`,
      backgroundRepeat: 'no-repeat',
      backgroundOrigin: 'content-box',
      backgroundSize: '140px',
      // 30 - 140 - 30
      backgroundPositionX: '30px',
      // As for y, can't do much
      backgroundPositionY: '0px'
    };
    let stickyClass = cx('submenu ui sticky',{
      'fixed top': this.state.fixed
    });
    return (
      <div id="mainHeader">
        <div className="ui main menu">
          <div className="item" style={companyLogoStyle}></div>
          <GeoSelector className="item"/>

          <HeaderNavItem link={'/'} text="Dashboard"/>
          <HeaderNavItem link={'/setting/project-management'} text="高级设置"/>
          <HeaderNavItem link={'/#'} text="用户管理"/>

          <div className="right floated item">
            <img className="ui avatar image" src={user.profilePic}/>
            <span>{user.name}</span>
            <i className="icon dropdown"></i>
          </div>
        </div>
        <div className={stickyClass}>
          <div className="wrapper">
            <div className="item">
              <ProjectSelector/>
            </div>
            <div className="item">
              <ScaleSelector/>
            </div>
            <div className="two item">
              <ScopeSelector/>
            </div>
          </div>
        </div>
      </div>
    )
  }
});

export default ControlHeader;
