// Reflux!
import Reflux from 'reflux';
// The actoins
import ControlActions from '../reflux-actions/controlActions';
// Load constants
import _CONST from '../constants/RedKnifeConstants';
// api connection point
import API_wrap from '../api/apiWrapper.js';

const StoreStore = Reflux.createStore({
  listenables: [ControlActions],
  data: [],
  getInitialState(){
    return this.data;
  },
  onInitStore(){
    API_wrap.getAllStore((allStore)=>{
      if(typeof allStore == 'object' && allStore.length > 0){
        this.data = allStore;
        this.emit();
      }else{
        console.error('Fatal: No stores');
      }
    });
  },
  removeProjectFromStore(st){
    let myMsg = `把 ${st.name} 从 ${st.project.desc} 删除`;
    ControlActions.sendMessage("正在" + myMsg, _CONST.msgType.info);
    st.project = {
      id: null
    };//set it to null for deleting its belonged project
    API_wrap.updateStoreByObj(st,(resp)=>{
      if(resp == undefined || resp.code !== '1'){
        // Failed!
        ControlActions.sendMessage(myMsg + "失败!", _CONST.msgType.error);
        this.emit();
        return;
      }else{
        for(let store of this.data){
          if(store.id == st.id){
            delete store.project;
            break;
          }
        }
        ControlActions.sendMessage(myMsg + "成功!", _CONST.msgType.success);
        this.emit();
      }
    });
  },
  addProjectToStore(st,project){
    let myMsg = `添加 ${st.name} 到 ${project.desc}`;
    ControlActions.sendMessage("正在" + myMsg , _CONST.msgType.info);
    st.project = project;
    console.log(st);
    API_wrap.updateStoreByObj(st,(resp)=>{
      console.log(resp);
      if(resp == undefined || resp.code !== '1'){
        // Failed!
        ControlActions.sendMessage(myMsg + "失败!", _CONST.msgType. error);
        this.emit();
        return;
      }else{
        for(let store of this.data){
          if(store.id == st.id){
            store.project = project;
            break;
          }
        }
        ControlActions.sendMessage(myMsg + "成功!", _CONST.msgType.success);
        this.emit();
      }
    })
  },
  msgFn(store,action){
    let newMsg = `${action} 商铺 ${store.id}`;
    return ((resp)=>{
      if(resp == undefined || resp.code !== '1'){
        ControlActions.sendMessage(newMsg+"失败!", _CONST.msgType.error);
      }else{
        ControlActions.sendMessage(newMsg+"成功!", _CONST.msgType.success);
      }
      this.emit();
    });
  },
  createStore(obj){
    let myMsg = `创建 ${obj.id} `;
    ControlActions.sendMessage("正在" + myMsg, _CONST.msgType.info);
    API_wrap.createStoreByObj(obj,this.msgFn(obj,'创建'));
  },
  updateStore(obj){
    let myMsg = `更新 ${obj.id} 的数据`;
    ControlActions.sendMessage("正在" + myMsg, _CONST.msgType.info);
    API_wrap.updateStoreByObj(obj, this.msgFn(obj,'更新'));
  },
  deleteStore(obj){
    let myMsg = `删除 ${obj.id} `;
    ControlActions.sendMessage("正在" + myMsg, _CONST.msgType.info);
    API_wrap.deleteStoreById(obj.id,this.msgFn(obj,'删除'));
  },
  emit(){
    this.trigger(this.data);
  }
});

export default StoreStore;
