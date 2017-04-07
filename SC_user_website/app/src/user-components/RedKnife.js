// Dependencies
import React from 'react';
// Componnents
import ControlHeader from './ControlHeader';
import GlobalMessage from '../common-components/GlobalMessage';

const RedKnife = React.createClass({
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
        <GlobalMessage/>
        <ControlHeader onSectionChange={this._onSectionChange}/>
        {this.props.children || 'I just got ****** by react-router'}
      </div>
    );
  }
});

export default RedKnife;
