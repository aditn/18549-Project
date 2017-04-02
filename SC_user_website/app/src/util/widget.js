import React from 'react';

// This is a wrapper used for style only
/**
* Widget
* @param head - may have
*        name, desc, and legend (Both could be components)
* @param body - Just a component
*/
const Widget = React.createClass({
  propTypes:{
    head : React.PropTypes.shape({
      name : React.PropTypes.string.isRequired,
      desc : React.PropTypes.string,
      legend: React.PropTypes.node
    }),
    body: React.PropTypes.element.isRequired
  },
  render () {
    return (
      <div className="wrapper-container">
        <div className="header wb clearfix">
          <label>
            {this.props.head.name}
            <div className="showWhenHover">
              <i className="help icon"/>
              <span>
                {this.props.head.desc}
              </span>
            </div>
          </label>
          <div className="legend">
            {this.props.head.legend}
          </div>
        </div>
        <div className="body wb">
          {this.props.body}
        </div>
      </div>
    )
  }
});

export default Widget;
