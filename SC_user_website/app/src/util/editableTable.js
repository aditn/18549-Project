import React from 'react';
 ;
import BindToMixin from 'react-binding';

import Flipper from './flipper';
import ConfirmButton from './doubleConfirmButton';
import _CONST from '../constants/RedKnifeConstants';

// This line will display input fields
const EditLine = React.createClass({
  displayName: '可编辑行',
  mixins: [BindToMixin],
  propTypes: {
    onEditDone: React.PropTypes.func.isRequired,
    columns: React.PropTypes.oneOfType([
      React.PropTypes.arrayOf(React.PropTypes.string), React.PropTypes.arrayOf(React.PropTypes.shape({
        column: React.PropTypes.string.isRequired,
        val: React.PropTypes.any,
        isEditable: React.PropTypes.bool
      }))
    ]).isRequired
  },
  getInitialState() {
    return {
      isEditMode: false,
      data: {}
    }
  },
  transformData(obj) {
    let result = {}
    let myArray = [];
    let randomName = Math.random().toString(36).substring(7);
    for (let col of this.props.columns) {
      // Will match each column
      let colName = col.column || col;

      if (obj[colName] !== undefined) {
        // Has this column
        let temp = {
          column: colName,
          val: obj[colName],
          isEditable: col.isEditable
        }
        myArray.push(temp);
      } else {
        // Nope
        myArray.push({
          column: colName,
          val: '',
          isEditable: col.isEditable
        });
      }
    }
    result[randomName] = myArray;
    return result;
  },
  submit() {
    this.props.onEditDone(this.transformData(this.state.data));
    // Clear data
    this.setState({
      data: {}
    });
  },
  enterEditMode() {
    this.setState({
      isEditMode: true
    });
  },
  exitEditMode(didSave) {
    this.setState({
      isEditMode: false
    });
    if (didSave) {
      this.submit();
    }
  },
  createInputFieldsBasedOnColumns() {
    let inputs = [];
    for (let col of this.props.columns) {
      let key = col;
      if (col.column !== undefined) {
        key = col.column
      }
      inputs.push(<td key={key}>
        <div className="ui fluid input">
          <input autofocus="autofocus" placeholder={key} type='text' valueLink={this.bindToState('data', key)}/>
        </div>
      </td>);
    }
    inputs.push(<td key='modified-icon-buttons'>
      <button className="ui icon button" onClick={this.exitEditMode.bind(this, false)}>
        <i className="icon delete"></i>
      </button>
      <button className="ui icon button" onClick={this.exitEditMode.bind(this, true)}>
        <i className="icon check"></i>
      </button>
    </td>)
    return <tr>{inputs}</tr>;
  },
  render() {
    let inputFields = this.createInputFieldsBasedOnColumns();
    let back = (
        <table className="ui single line table">
          <tbody>
            {inputFields}
          </tbody>
        </table>
    );
    let front = (
        <button className="ui fluid basic button" onClick={this.enterEditMode}>
          <i className="icon plus"></i>
          添加
        </button>
    );

    return (
      <div className="ui fluid container" id={this.props._id + '-edit-line'}>
        <Flipper back={back} flipped={this.state.isEditMode} front={front} height="3rem" orientation='vertical'/>
      </div>
    );
  }
});

const EditableTd = React.createClass({
  mixins: [BindToMixin],
  render() {
    return (
      <td>
        <div className="ui input">
          <input valueLink={this.bindTo(this.props.model, 'val')}/>
        </div>
      </td>
    )
  }
});

const EditableTr = React.createClass({
  mixins: [BindToMixin],
  createTds() {
    if (this.props.model == undefined) {
      console.warn('Table row has no model data(cannot bind)');
      return;
    }
    let tds = this.props.model.items.map((pathBinding, i) => {
      let col = pathBinding.sourceObject;
      if (col == undefined) {
        // This should never happen, but it's here to prevent breaking
        return;
      }
      if (col.column) {
        // Has column
        if (col.isEditable) {
          return <EditableTd index={i} key={i} model={pathBinding}/>
        } else {
          return <td key={i}>{col.val == undefined ? ("") : col.val}</td>
        }
      } else {
        // Does not have a column field
        return <td key={i}>{col.val == undefined ? ("") : col.val}</td>
      }
    });

    if (this.props.delete) {
      // Add delete button
      tds.push(<td key={'del'}>
        <ConfirmButton className="ui icon button" confirmedFunc={this.handleDelete} initialText={ < i className = "icon delete" >
        </i>} intermediateClass="ui icon red button" intermediateText={ < i className = "icon delete" >
        </i>}/>
      </td>)
    }
    return tds;
  },
  handleDelete() {
    this.props.onDelete();
  },
  render() {
    let allTds = this.createTds();
    return (
      <tr>{allTds}</tr>
    )
  }
});

const EditableTable = React.createClass({
  mixins: [BindToMixin],
  propTypes: {
    _id: React.PropTypes.string.isRequired,
    title: React.PropTypes.string.isRequired,
    onSubmit: React.PropTypes.func,
    columns: React.PropTypes.oneOfType([
      React.PropTypes.arrayOf(React.PropTypes.string), React.PropTypes.arrayOf(React.PropTypes.shape({
        column: React.PropTypes.string.isRequired,
        val: React.PropTypes.any,
        isEditable: React.PropTypes.bool
      }))
    ]).isRequired,
    data: React.PropTypes.object.isRequired,
    add: React.PropTypes.bool,
    delete: React.PropTypes.bool
  },
  _submit(event) {
    if (typeof(this.props.onSubmit) == 'function') {
      this.props.onSubmit(this.state.newData);
    } else {
      console.warn('EditableTable received non-function for onSubmit');
    }
    return;
  },
  _clear(event) {
    this.setState({
      newData: this.props.data
    });
  },
  _reset(event) {
    this.setState({
      newData: this.props.data
    });
  },
  getInitialState() {
    // Deep copy original data
    return {
      newData: $.extend(true, {}, this.props.data)
    }
  },
  buildTHead() {
    let allThs = [];
    for (let i = 0, l = this.props.columns.length; i < l; i++) {
      allThs.push(
      <th key={i}>
        {this.props.columns[i].label || this.props.columns[i]}
      </th>)
    }
    if (this.props.delete) {
      // Push another col for structure
      allThs.push(<th className="collapsing" key='matching'>操作</th>)
    }
    return (
      <tr>{allThs}</tr>
    );
  },
  buildTBody() {
    let rows = [];
    for (let rowName in this.state.newData) {
      // Each rowVal is an array of objects
      // So we bind this whole array to our state.newData[rowName]
      let singleRow = <EditableTr key={rowName} model={this.bindArrayToState("newData",rowName)} onDelete={this.delete.bind(this, rowName)} {... this.props}/>
      rows.push(singleRow);
    }
    return rows;
  },
  delete(rowName) {
    let copy = {};
    $.extend(true, copy, this.state.newData)
    delete copy[rowName];
    this.setState({
      newData: copy
    });
  },
  componentWillReceiveProps(newProp) {
    this.setState({
      newData: newProp.data
    });
  },
  onAddItemDone(data) {
    // validate(data)
    let copy = $.extend({}, data);
    $.extend(true, copy, this.state.newData);
    // animateAdd()
    this.setState({
      newData: copy
    });
  },
  render() {
    let heads = this.buildTHead();
    let bodys = this.buildTBody();
    return (
      <div id={this.props._id}>
        <center>
          <div className="ui basic segment">
            <h3>{this.props.title}</h3>
            {this.props.add ? <EditLine onEditDone={this.onAddItemDone} {... this.props}/> : null}
          </div>
          <div className="tableWrapper" style={{width:'100%',overflowX:'scroll'}}>
            <table className="ui basic table">
              <thead>
                {heads}
              </thead>
              <tbody>
                {bodys}
              </tbody>
            </table>
          </div>
        </center>
        <div className="ui padded center aligned segment">
          <button className="ui inverted green button" onClick={this._submit}>
            <i className="icon upload"></i>
            提交
          </button>
          <button className="ui inverted red button" onClick={this._clear}>
            <i className="icon trash"></i>
            清空
          </button>
          <button className="ui inverted blue button" onClick={this._reset}>
            <i className="icon erase"></i>
            初始化
          </button>
        </div>
      </div>
    );
  }
});

export
default EditableTable;
