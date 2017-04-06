// Reflux!
import Reflux from 'reflux';
// The actoins
import ControlActions from '../reflux-actions/controlActions';
// Load constants
import _CONST from '../constants/RedKnifeConstants';
// api connection point
import API_wrap from '../api/apiWrapper.js';

const DeviceStore = Reflux.createStore({
  listenables: [ControlActions],
  data: [],
  getInitialState() {
    return this.data
  },
  msgFn(device,action){
    let newMsg = `${action} 设备 ${device.id}`;
    return ((resp)=>{
      if(resp == undefined || resp.code !== '1'){
        ControlActions.sendMessage(newMsg+"失败!", _CONST.msgType.error);
      }else{
        ControlActions.sendMessage(newMsg+"成功!", _CONST.msgType.success);
      }
      this.emit();
    });
  },
  onInitDevice(){
    API_wrap.getAllDevice((allDevice)=>{
      if(typeof allDevice == 'object' &&
        allDevice.length > 0){
          this.data = allDevice;
          this.emit();
      }else{
          console.error('Fatal: No device');
      }
    });
  },
  deleteDevice(obj){
    let myMsg = `删除 ${obj.id} `;
    ControlActions.sendMessage("正在" + myMsg, _CONST.msgType.info);
    API_wrap.deleteDeviceById(obj.id,this.msgFn(obj,'删除'));
  },
  createDevice(obj){
    let myMsg = `创建 ${obj.id} `;
    ControlActions.sendMessage("正在" + myMsg, _CONST.msgType.info);
    API_wrap.createDeviceByObj(obj,this.msgFn(obj,'创建'));
  },
  updateDevice(obj){
    let myMsg = `更新 ${obj.id} 的数据`;
    ControlActions.sendMessage("正在" + myMsg, _CONST.msgType.info);
    API_wrap.updateDeviceByObj(obj,this.msgFn(obj,'更新'));
  },
  emit(){
    this.trigger(this.data);
  }
});

export default DeviceStore;
