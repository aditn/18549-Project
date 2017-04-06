import React from 'react';
import Reflux from 'reflux';
import { Link } from 'react-router';

import DeviceStore from '../../../reflux-stores/deviceStore.js';
import ApiDataUtil from '../../../api/apiDataUtil.js';
import _CONST from '../../../constants/RedKnifeConstants.js';

const HardwareManagement = React.createClass({
  mixins: [Reflux.connect(DeviceStore, 'deviceList')],
  deviceDataChanged(obj, isDelete, isAdd) {
    if (isDelete) {
      DeviceStore.deleteDevice(obj);
    }else if (isAdd) {
      DeviceStore.createDevice(obj);
    }else {
      DeviceStore.updateDevice(obj);
    }
  },
  buildStyles() {
    let idStyle = (id)=>{
      return (
        <div className="content">
          <div className="header">
            <i className="middle aligned server icon"></i>
            设备 ID : {id || '无 ID'}
          </div>
        </div>
      )
    };
    let serverIpStyle = (ip)=>{
      return (
        <div className="content">
          服务器 IP 地址 : <span style={{color:'#f6b407'}}>{ip || "木有"}</span>
        </div>
      )
    };
    let storeLocationStyle = (st)=>{
      let isDefined = (st  == undefined || st.id == undefined);
        return (
          <div className="left floated content">
            { isDefined ? (
              <i className="square outline icon"></i>
            ):(
              <i className="green checkmark box icon"></i>
            )}
            {isDefined ? "无店铺" : "有店铺"}
          </div>
        )
    };
    return {
      id: idStyle,
      serverIp: serverIpStyle,
      storeLocation: storeLocationStyle
    };
  },
  render() {
    return (
      <div className="pageSection">
        <div className="sectionHeader">
          <h2>
            设置
            <span className="separator">/</span>
            <Link to="/setting/hardware-management">设备管理</Link>

          </h2>
        </div>
        <div className="sectionContainer">

        </div>
      </div>
    );
  }
});

export default HardwareManagement;
