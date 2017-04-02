import React from 'react';
import Reflux from 'reflux';
import ControlActions from '../../../reflux-actions/controlActions';
import _CONST from '../../../constants/RedKnifeConstants';

// Used components
import EditableTable from '../../../util/editableTable';

const CustomerSetting = React.createClass({
  getInitialState(){
    let editables = _CONST.customerSettingTableEditables;
    let cols = this.defineColumns(editables);
    let tData = this.getTableData(cols);

    return {
      columns: cols,
      data: tData
    };
  },
  getTableData(allCols){
    let cTypes = _CONST.customerType;
    let tData = {};
    // Each type is one row
    for(let type in cTypes){
      // For each row we build a structured object
      let row = [];

      allCols.forEach((cur,index,array)=>{
        if(cur.column == 'usertype'){
          row.push({
            column: 'usertype',
            val : type,
            isEditable: false
          })
        }else{
          row.push({
            column : cur.column,
            val : 0,
            isEditable: true
          })
        }
      });

      tData[type] = row;
    }
    return tData;
  },
  defineColumns(editables){
    let columns = [];
    columns.push({
      column: 'usertype',
      label : '用户类别',
      isEditable: false
    });

    editables.forEach((cur,index,array)=>{
      columns.push({
        column : cur,
        label : _CONST.translation[cur] || cur,
        isEditable: true
      })
    });
    return columns;
  },
  _onSubmit(val){
    console.log(val);
  },
  render(){
    // console.log(this.state.data);
    return(
      <div>
        <EditableTable _id='customerSettingTable'
          title="老客户设置"
          onSubmit = {this._onSubmit}
          columns  = {this.state.columns}
          data     = {this.state.data}/>
      </div>
    );
  }
});

export default CustomerSetting;
