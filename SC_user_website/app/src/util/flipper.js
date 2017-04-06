import React from 'react';

const Flipper = React.createClass({
  propTypes:{
    orientation: React.PropTypes.oneOf(['horizontal','vertical']),
    flipped : React.PropTypes.bool.isRequired,
    front : React.PropTypes.any.isRequired,
    back : React.PropTypes.any.isRequired
  },
  render() {
    return (
      <div className={"flipper-container " + this.props.orientation} style={{
          width:this.props.width || 'auto', height:this.props.height || 'auto'
        }}>
        <div className={"flipper" + (this.props.flipped ? " flipped" : "")}
          style={{height:this.props.height || '100%'}}>
          <div className="front tile">
            {this.props.front}
          </div>
          <div className="back tile">
            {this.props.back}
          </div>
        </div>
      </div>
    );
  }
});

export default Flipper
