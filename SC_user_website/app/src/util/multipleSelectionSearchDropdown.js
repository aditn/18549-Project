import React from 'react';

const MultipleSelectionSearchDropdown = React.createClass({
  setValue(option){
    this.props.onChange(option);
  },
  renderOption (option) {
    return (
      <div className="item" key={option.name}
        onClick={this.setValue.bind(this, option)}
        onTouchDown={this.setValue.bind(this, option)}>
        {option.label || option.name || option.id}
      </div>
    )
  },
  componentDidMount(){
    // $(React.findDOMNode(this)).dropdown({
    //   fields: this.props.fields
    // });
  },
  buildMenu () {
    let ops = [];
    for (let option in this.props.options) {
      let toBePushed = this.renderOption(this.props.options[option]);
      ops.push(toBePushed);
    }
    return ops.length ? ops : <div className='input'>No opitons found</div>;
  },
  render(){
    let items = this.buildMenu();
    return (
      <div className="ui fluid multiple search selection dropdown">
        <i className="dropdown icon"></i>
        <div className="default text">
          {this.props.defaultText}
        </div>
        <div className="menu">
          {items}
        </div>
      </div>
    )
  }
});

export default MultipleSelectionSearchDropdown;
