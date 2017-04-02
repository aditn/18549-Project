// Reflux!
import Reflux from 'reflux';
// The actoins
import ControlActions from '../reflux-actions/controlActions';
import GeoStore from './geoStore.js';
// Load constants
import _CONST from '../constants/RedKnifeConstants';
// api connection point
import API_wrap from '../api/apiWrapper.js';

const ProjectStore = Reflux.createStore({
  listenables: [ControlActions],
  data: {
    cur_project: {
      label: '', // example: "麦乎系统"
      name: '', // example: 2014110322250141234
    },
    allProjects: [], // use this for dropdown render
    allProjectsRaw: []
  },
  buildAllProjectsBasedOnRaw() {
    this.data.allProjects = this.data.allProjectsRaw.map((elem)=>{
      return {
        name: elem.id, // use name to store id
        label: elem.desc
      };
    });
    // Default to select the first one
    this.data.cur_project = this.data.allProjects[0];
    this.emit();
  },
  onInitProject() {
    API_wrap.getAllProject((allPrj)=>{
      if (typeof allPrj === 'object' &&
        allPrj.length > 0) {
        this.data.allProjectsRaw = allPrj;
        this.buildAllProjectsBasedOnRaw();
      }else {
        console.error('Fatal: No projects');
      }
    });
  },
  createNewProjectWithObj(obj, onDone) {
    const myMsg = `创建 ${obj.desc}`;
    ControlActions.sendMessage('正在' + myMsg, _CONST.msgType.info);
    API_wrap.createProjectByObj(obj, (resp)=>{
      if (resp === undefined || resp.code === '1') {
        // Failed
        ControlActions.sendMessage(myMsg + '失败!', _CONST.msgType.error);
        onDone();
      }else {
        // Success
        ControlActions.sendMessage(myMsg + '成功!', _CONST.msgType.success);
        this.data.allProjectsRaw.push(obj);
        onDone();
        this.buildAllProjectsBasedOnRaw();
      }
    });
  },
  onCurProjectChange(change) {
    // TODO : change this a bit, comparing name with id is bad
    if (change.name === undefined) {
      console.error('Trying to change project to an unknown project');
    }
    if (change.name !== this.data.id) {
      this.data.cur_project = change;
    }
    this.emit();
  },
  getAllProject() {
    return this.data.allProjectsRaw;
  },
  getCurrentProject() {
    return this.data.cur_project;
  },
  getInitialState() {
    return this.data;
  },
  emit() {
    this.trigger(this.data);
  }
});

export default ProjectStore;
