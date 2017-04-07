import React from 'react';
import Reflux from 'reflux';
import { Link } from 'react-router';
import StoresContainer from '../StoreManagement/StoresContainer';
// util views
import MultipleSelectionSearchDropdown from '../../../util/multipleSelectionSearchDropdown';
import {GeoPopOver} from '../../../util/geoSelector';
import Loader from '../../../util/loader';

import ControlActions from '../../../reflux-actions/controlActions.js';
import ProjectStore from '../../../reflux-stores/projectStore.js';
import StoreStore from '../../../reflux-stores/storeStore.js';

const ProjectDetail = React.createClass({
  propTypes: {
    project: React.PropTypes.object
  },
  mixins: [ Reflux.connect(StoreStore, 'storeList') ],
  storesToAdd: [],
  _onGeoAdded(newGeo) {
    this._applyFilter(newGeo);
  },
  _applyFilter(newGeo) {

  },
  _addStore(store) {
    this.storesToAdd.push(store);
  },
  _confirmAddStore() {
    this.storesToAdd.forEach((st)=>{
      StoreStore.addProjectToStore(st, this.props.project);
    });
    this.storesToAdd = [];
  },
  divideStoreList() {
    const ownedStores = [];
    const driftingStores = [];
    if (this.state.storeList === undefined) {
      return {
        ownedStores, driftingStores
      };
    }
    for (let i = 0; i < this.state.storeList.length; i++){
      const st = this.state.storeList[i];
      if (st.project === undefined) {
        driftingStores.push(st);
      }else {
        if (st.project.id === this.props.project.id) {
          ownedStores.push(st);
        }
      }
    }
    return {
      ownedStores, driftingStores
    };
  },
  render() {
    const { ownedStores, driftingStores} = this.divideStoreList();
    return (
      <div>
        <div className="sectionContainer">
          <GeoPopOver onGeoAdded={this._onGeoAdded} style={{width: '100%'}}/>
        </div>
        <div className="sectionHeader underline">
          <h3>门店列表</h3>
          <input className="search" placeholder="搜索..." type="text"/>
          <div className="flexSingleRow" style={{marginBottom: '10px'}}>
          <MultipleSelectionSearchDropdown
            defaultText="添加门店"
            fields = {{
              name: 'name',
              value: 'id'
            }}
            options={this.state.storeList}
            onChange={this._addStore}/>
            <button className="ui button" onClick={this._confirmAddStore}>
              确认添加
            </button>
          </div>
        </div>
        <StoresContainer className="sectionContainer" stores={ownedStores}/>
      </div>
    );
  }
});

const SingleProjectPageView = React.createClass({
  propTypes: {
    params: React.PropTypes.object
  },
  mixins: [Reflux.connect(ProjectStore, 'projects')],
  findProjectById() {
    return this.state.projects.allProjectsRaw.find((elem)=>{
      return elem.id === this.props.params.projectId;
    });
  },
  render() {
    const project = this.findProjectById();
    return (
      <div className="pageSection">
        <section className="sectionHeader">
          <h2>
          设置
          <span className="separator">/</span>
          <Link to="/setting/project-management">项目管理</Link>

          <span className="separator">/</span>
          {project === undefined ? '' : project.desc}

          </h2>
        </section>
        {project === undefined ? <Loader/> : <ProjectDetail project={project}/>}
      </div>
    );
  }
});

export default SingleProjectPageView;
