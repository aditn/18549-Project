import React from 'react';

const Loader = React.createClass({
  render () {
    return (
      <div className="ui segment" style={{width:'100%',minHeight:'200px',border:'none'}}>
        <div className="ui active inverted dimmer">
          <div className="ui large text loader">Loading</div>
        </div>
      </div>
    );
  }
});

export default Loader;
