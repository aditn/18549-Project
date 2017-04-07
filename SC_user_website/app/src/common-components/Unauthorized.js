import React from 'react';

const Unauthorized = React.createClass({
  // Redirect to:
  // http://console.digitwalk.com/login
  //'http://console.digitwalk.com/servicelogin?redirect=/api/oauth/authorise&client_id=ac7308da3c5648069c5ff3a9e141cacb&redirect_uri=http://api.digitwalk.com/gw/oauth/cb&state=http://yourpage'
  render() {
    let redirectUrl = 'http://console.digitwalk.com/login'
    return (
      <div className="empty-view">
        You are Unauthorized to view this webpage.
        <div className="ui divider"></div>
        <b>
          Consider register/login for
          <a href={redirectUrl}> Maihoo </a>
          services
        </b>
      </div>
    )
  }
});

export default Unauthorized
