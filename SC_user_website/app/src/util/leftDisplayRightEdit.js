import React from 'react';
 ;
import BindToMixin from 'react-binding';

import ConfirmButton from './doubleConfirmButton';
import Flipper from './flipper';

const UICard = React.createClass({
  mixins:[BindToMixin],
  getInitialState(){
    return {
      // This only stores modified data
      data : {}
    }
  },
  seperateFields(){
    let uneditables = [] , editables = [];
    for(let key in this.props.data){
      let val = this.props.data[key];
      if(typeof this.props.data[key] == 'object'){
        // damn, object? We dont wanna push this object, we want just the first thing : id, or whatever
        val = val[Object.keys(val)[0]];
      }
      let toPush = {key: key, val: val};
      if(this.props.editables.indexOf(key) !== -1){
        // Editable!
        editables.push(toPush);
      }else{
        uneditables.push(toPush);
      }
    }
    return [uneditables,editables];
  },
  handleSubmit(){
    if(this.state.data.id == undefined){
      // need to add id anyway
      this.state.data.id = this.props.data.id;
    }
    this.props.onDone(this.state.data,false,false);
  },
  handleDelete(){
    // Pass in the original props for delete
    this.props.onDone(this.props.data,true,false);
  },
  render(){
    let [uneditables,editables] = this.seperateFields();
    return (
      <div className="ui fluid card" style={{position:'fixed',maxWidth:'48rem',marginTop:'1rem'}}>
        <div className="content">
          <div className="header">
            {this.props.prefix + this.props.data.id}
          </div>
        </div>
        <div className="content">
          <div className="ui labels">
            {uneditables.map((uneditable,i)=>{
              return (
                <div key={i} className="ui horizontal label" style={{marginBottom:'0.8rem'}}>
                  {uneditable.key + ":"}
                  <div className="detail">
                    {uneditable.val}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        <div className="content">
          <div className="ui two column grid">
            {editables.map((editable,i)=>{
              return(
                <div className="column" key={i}>
                  <div className="ui labeled fluid input">
                    <div className="ui label" style={{width:'100px'}}>
                      {editable.key}
                    </div>
                    <input type="text" defaultValue={editable.val}
                      valueLink={this.bindToState('data',editable.key)}/>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className={"ui bottom attached buttons" + (this.props.delete ? " two" : "")}>
          {this.props.delete ?
            <ConfirmButton className="ui basic red button"
            confirmedFunc={this.handleDelete}
            initialText="删除此卡" intermediateClass="ui icon red button"
            intermediateText="确认删除?"/> : null}

          <button className="ui basic green button" onClick={this.handleSubmit}>
            确认修改
          </button>
        </div>

      </div>
    );
  }
});

const ItemAdd = React.createClass({
  render(){

  }
});

const LeftDisplayRightEdit = React.createClass({
  propTypes: {
    // Example : [{id:1,name:'john'},{id:2,name:'bz'},{id:3,name:'eric'}]
    left: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
    // Example : { name: func} (func returns ReactSampleComponent)
    // will only render name, and will pass name as mega to ReactSampleComponent
    // visible in ReactSampleComponent as this.props.mega
    itemStyles: React.PropTypes.object,
    // This will override the whole rendering option
    itemStyle: React.PropTypes.func,

    // Example : ['name']
    editables: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,

    onSingleChange: React.PropTypes.func,
    delete: React.PropTypes.bool,
    add: React.PropTypes.bool
  },
  getInitialState() {
    return {
      selected: null
    }
  },
  select(item) {
    this.setState({
      selected: item
    });
  },
  createUIList() {
    let result = [];
    // if (this.props.add){
    //   result.push(<ItemAdd onDone={this.props.onSingleChange}/>)
    // }
    if (typeof this.props.itemStyle == 'function') {
      // Has item style
      if(this.props.itemStyles == undefined){
        // But has no itemStyles, so we pass the whole object in
        this.props.left.forEach((cur,i)=>{
          // Cur is the element to render, the function is to help select
          // The last one can be used as key
          result.push(
            this.props.itemStyle(cur,()=>{
              this.select(cur)
            },i)
          );
        });
      }else{
        // Still has indivicual elements
        // TODO: Fill this in
        console.warn('itemStyle and itemStyles both filled. This is not supported yet');
        return [];
      }
    } else {
      // Nope, use default
      this.props.left.forEach((cur, i) => {
        let display = [];
        for (let style in this.props.itemStyles) {
          // style should match cur
          let fn = this.props.itemStyles[style];
          display.push(fn(cur[style]));
        }
        result.push(<div className="item"
        key={i} onClick={this.select.bind(this, cur)}>
          {display}
        </div>);
      });
    }
    return (result.length == 0 ? (
      <div className="empty-view">没有数据</div>
    ) : (
      <div className="ui relaxed divided selection list">{result}</div>
    ));
  },
  render() {
    let leftList = this.createUIList();
    return (
      <div className="ui grid">
        <div className="left ui four wide column">
          {leftList}
        </div>
        <div className="ui vertical divider"></div>
        <div className="right ui twelve wide column">
          {this.state.selected ?
            <UICard data={this.state.selected}
            editables={this.props.editables} prefix={this.props.cardPrefix}
            onDone={this.props.onSingleChange} delete={this.props.delete}/> :
            <div className="empty-view">
              未选
            </div>
          }
        </div>
      </div>
    )
  }
});

export default LeftDisplayRightEdit;
