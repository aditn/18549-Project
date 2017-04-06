import React from 'react';
import Reflux from 'reflux';

// Load constants
import _CONST from '../constants/RedKnifeConstants';

const AdminMain = React.createClass({

  render() {
    return (
      <div id="mbody">
        <header>
          <div className="nav ui grid mh_nav">
            <div className="six wide column">
              <a href="/" className="ui large label mh_logo_label" style={{background: 'transparent'}}>
                <img className="ui right spaced image" src="http://7xl30f.com2.z0.glb.qiniucdn.com/maihoo_logo_144.png"/>麦乎 | Maihoo - AllInOne Box ｜ 系统管理中心
              </a>
            </div>
            <div className="eight wide column"></div>
            <div className="two wide column">
              <a className="ui medium label mh_font_regular" style={{background: 'transparent'}}><img className="ui right spaced avatar image" src="http://7xl30f.com2.z0.glb.qiniucdn.com/maihoo_YANN.png"/>Yann Peng</a>
            </div>
          </div>
        </header>
        <div className="ui grid">
          <div className="sidebar">

          </div>
          <div className="container"></div>
        </div>

      </div>
    )
  }
});

export default AdminMain;
