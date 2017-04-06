// Dependencies
import React from 'react';
// Componnents
import ControlHeader from './ControlHeader';
import GlobalMessage from '../common-components/GlobalMessage';

const SMRTCHAR = React.createClass({
  getInitialState() {
    return {};
  },
  onSectionChange(menu) {
    this.setState({
      menu: menu
    });
  },
  render() {
    return (
      <div id="app">
        <ControlHeader onSectionChange={this._onSectionChange}/>
        {this.props.children || 'I just got ****** by react-router'}
      </div>
    );
  }
});

export default SMRTCHAR;
