import React from 'react';
import { Link } from 'react-router';

const SingleDeviceView = React.createClass({
  propTypes: {
    device: React.PropTypes.object
  },
  render() {
    const { device } = this.props;
    return (
      <div className="pageSection">
        <div className="sectionHeader">
          <h2>
            设置
            <span className="separator">/</span>
            <Link to="/setting/hardware-management">设备管理</Link>

            <span className="separator">/</span>
            {device === undefined ? '' : device.desc}
          </h2>
        </div>
        <div className="sectionContainer">

        </div>
      </div>
    );
  }
});

export default SingleDeviceView;
