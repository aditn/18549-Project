import React from 'react';
import { Link } from 'react-router';
import Reflux from 'reflux';
import moment from 'moment';

import ControlActions from '../../../reflux-actions/controlActions.js';
import ProjectStore from '../../../reflux-stores/projectStore.js';
import StoreStore from '../../../reflux-stores/storeStore.js';

import ConfirmButton from '../../../util/doubleConfirmButton';
// Load constants
import _CONST from '../../../constants/RedKnifeConstants.js';

const NewProjectCard = React.createClass({
  getInitialState() {
    return {
      isEditMode: false,
      id_value : "",
      name_value: "",
    }
  },
  enterEditMode() {
    this.setState({
      isEditMode: true
    });
    // Let this card be seen
    $("html, body").animate({
      scrollTop: $(document).height()
    }, 1000);
  },
  exitEditMode(shouldReset) {
    if(shouldReset){
      this.setState({
        isEditMode: false,
        id_value : "",
        name_value: "",
      });
    }else{
      this.setState({
        isEditMode: false
      });
    }
  },
  doneEditMode() {
    let formElement = React.findDOMNode(this.refs.newProjectForm);
    $(formElement).addClass('loading');
    ProjectStore.createNewProjectWithObj({
      id: this.state.id_value,
      desc: this.state.name_value
    },()=>{
      setTimeout(()=>{
        $(formElement).removeClass('loading');
        this.exitEditMode(true);
      },1000);
    });
  },
  autoGenerateId(){
    let newID = new moment().format(_CONST.dateFormat);
    newID += Math.random().toString().substring(2,8);
    this.setState({
      id_value : newID
    });
  },
  handleOnChange(type,event){
    if(type == 'id'){
      this.setState({
        id_value: event.target.value
      });
    }else{
      this.setState({
        name_value : event.target.value
      });
    }
  },
  createEditModeView() {
    let result = (
        <div className="ui form" ref="newProjectForm">
          <div className="ui field">
            <label>项目 ID</label>
            <div className="ui action input">
              <input autoFocus={true} name="id_input" type="text"
                 onChange={this.handleOnChange.bind(this,'id')} value={this.state.id_value}/>
              <button className="ui button" onClick={this.autoGenerateId}>自动生成</button>
            </div>
          </div>
          <div className="ui field">
            <label>项目名称</label>
            <div className="ui input">
              <input type="text" name="name_input"
                 onChange={this.handleOnChange.bind(this,'name')} value={this.state.name_value}/>
            </div>
          </div>
          <div className="ui basic green button" onClick={this.doneEditMode}>
            搞定
          </div>
          <div className="ui basic red button" onClick={this.exitEditMode}>
            不干了
          </div>
        </div>
    )
    return result;
  },
  render() {
    let nonEditableView = (
        <div className="empty-view">
          <button className="ui icon button" onClick={this.enterEditMode}>
            <i className="icon plus"></i>
            添加新项目
          </button>
        </div>
    );
    let editModeView = this.createEditModeView();
    return (
      <div className="ui project card">
        {this.state.isEditMode ? editModeView : nonEditableView}
      </div>
    )
  }
});

const ProjectCard = React.createClass({
  getInitialState() {
    return {
      flipped: false
    }
  },
  getStoresThatBelongToThisProject() {
    if (this.props.data == undefined) {
      return;
    }
    let ownedStores = [];
    // Data will have project, storeList will be store list
    for (let store of this.props.storesWithOwner) {
      if (store.project.id == this.props.data.id) {
        // Found it
        ownedStores.push(store);
      }

    }
    return ownedStores;
  },
  addStoreToProject(store) {
    let copy = $.extend({}, store);
    StoreStore.addProjectToStore(copy, this.props.data);
  },
  removeStoreFromProject(store) {
    let copy = $.extend({}, store);
    StoreStore.removeProjectFromStore(copy);
  },
  renderStoresAsListItem(stores, add) {
    if (typeof stores.map !== 'function' || stores.length <= 0) {
      return <div className="empty-view">
        {this.state.flipped ? "无店铺可选" : "未分配店铺"}
      </div>
    }
    return (
      <div className="ui store list">
        {stores.map((store, i) => {
          return (
              <div className="item" key={i}>
                <div className="content">
                  <div className="header">
                    {store.name}
                  </div>
                    {store.code}
                      {add ?
                        <button className="ui mini basic button"
                        onClick={this.addStoreToProject.bind(this, store)}>
                        Add
                      </button> :
                <ConfirmButton className="ui mini basic button"
                  confirmedFunc={this.removeStoreFromProject.bind(this, store)}
                  initialText="remove" intermediateClass="ui mini red button"
                  intermediateText="confirm"/>}
                  </div>
                </div>
          )
        })}</div>
    );
  },
  onClick() {
    this.setState({
      flipped: !this.state.flipped
    });
  },
  render() {
    let ownedStores = this.getStoresThatBelongToThisProject();

    let Flipper_front = this.renderStoresAsListItem(ownedStores, false);
    let numberOfStores = ownedStores.length || 0;

    let Flipper_back = this.renderStoresAsListItem(this.props.storesWithoutOnwer, true);

    return (
      <div className="ui project card">
        <div className="content">
          <div className="ui teal right ribbon label" key="numberOfStores">
            店铺数量: {numberOfStores}
          </div>
          <div className="header">
            {this.props.data.desc}
          </div>
          <div className="meta">
            <h5>项目 ID:
            </h5>
              {this.props.data.id}
          </div>
        </div>
        <div className="content">
          <div className="ui transparent fluid icon input">
            <input placeholder="筛选..." type="text"/>
            <i className="search icon"></i>
          </div>
        </div>
        <div className="content">
          <div style={{height:"10rem"}}>
            {this.state.flipped ? Flipper_back : Flipper_front}
          </div>
        </div>
          {this.state.flipped ? (
            <button className="ui bottom basic attached olive button" onClick={this.onClick}>
              <i className="icon chevron left"></i>
              返回
            </button>

        ) : (
            <button className="ui bottom basic attached teal button" onClick={this.onClick}>
              <i className="icon plus"></i>
              增加店铺
            </button>
        )}
      </div>
    )
  }
});

const ProjectManagement = React.createClass({
  mixins: [
    Reflux.connect(ProjectStore, 'projects')
  ],
  createProjectCards() {
    let allProjects = this.state.projects.allProjectsRaw;

    return allProjects.map((prj, i) =>
      <Link key={i} className="project" to={`/setting/project-management/${prj.id}`}>
        <section className="cover"></section>
        <section className="wrapper">
          <span className="title"> {prj.desc} </span>
          <span className="detail"> 商铺数量 : 0 </span>
        </section>
      </Link>
     );
  },
  render () {
    let projectCards = this.createProjectCards();
    return (
      <div className="pageSection" style={{width:'900px'}}>
        <section className="sectionHeader">
          <h2>
          设置
          <span className="separator">/</span>
          <Link to="/setting/project-management">项目管理</Link>

          </h2>
          <input className="search" placeholder="筛选..." type="text"/>
          <button className="ui button">
            NEW
          </button>
        </section>
        <section className="sectionContainer">
          {projectCards}
        </section>
      </div>
    )
  }
});

export default ProjectManagement;
