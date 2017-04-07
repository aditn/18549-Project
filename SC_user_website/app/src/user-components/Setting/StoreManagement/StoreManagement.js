import React from 'react';
import Reflux from 'reflux';
import BindToMixin from 'react-binding';

// reflux-store for data
import ControlActions from '../../../reflux-actions/controlActions.js';
import StoreStore from '../../../reflux-stores/storeStore.js';
// Use LeftDisplayRightEdit to display data
import LeftDisplayRightEdit from '../../../util/leftDisplayRightEdit';
// load constants
import _CONST from '../../../constants/RedKnifeConstants.js';

const StoreManagement = React.createClass({
  mixins:[Reflux.connect(StoreStore,'storeList')],
  storeDataChanged(obj,isDelete,isAdd){
    if(isDelete){
      StoreStore.deleteStore(obj);
    }else if(isAdd){
      StoreStore.createStore(obj);
    }else{
      StoreStore.updateStore(obj);
    }
  },
  buildStyles(){
    let idStyle = (id)=>{
      return (
        <div className="content">
          <div className="header">
            <i className="middle aligned building icon"></i>
            商铺 ID : {id || '无 ID'}
          </div>
        </div>
      )
    };
    let addressStyle = (address)=>{
      return (
        <div className="content">
          商铺地址 : <span style={{color:'#f6b407'}}>{address || '无'}</span>
        </div>
      )
    };
    return {
      address : addressStyle,
      id : idStyle
    }
  },
  render () {
    // console.log(this.state.storeList);
    let myItemStyles = this.buildStyles();
    const editables=['name','address','project'];
    return (
      <LeftDisplayRightEdit className="sixteen wide column"
        editables={editables} delete={true} add={true}
        itemStyles={myItemStyles} cardPrefix="商铺 :"
        left={this.state.storeList} onSingleChange={this.storeDataChanged}
        />
    )
  }
});

export default StoreManagement;
