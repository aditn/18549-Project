import React from 'react';

const NotFound = React.createClass({
  render(){
    var _location = window.location.href;
    return(
      <div className="ui container">
        <div className="ui inverted red segment">
          <h1 className="ui inverted header">404
            <div className="sub header">Invalid URL</div>
          </h1>
        </div>
        <div className="ui divider"></div>
        <div className="ui header">
          <p>
              You have reached:
          </p>
          <p>
            {_location}
          </p>
        </div>
      </div>
    );
  }
});

export default NotFound;
