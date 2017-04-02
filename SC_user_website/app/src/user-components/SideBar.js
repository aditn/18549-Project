import React from 'react';
import {Link} from 'react-router';

const SideBarItem = React.createClass({
  propTypes: {
    url: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired
  },
  getInitialState() {
    return {};
  },
  render() {
    return (
      <Link className="item" to={this.props.url}>
        {this.props.name}
      </Link>
    );
  }
});

const FirstMenu = React.createClass({
  propTypes: {
    data: React.PropTypes.object
  },
  createSubMenu() {
    const result = [];
    for (const key in this.props.data.submenu) {
      if (this.props.data.submenu.hasOwnProperty(key)) {
        const elem = this.props.data.submenu[key];
        result.push(<SideBarItem key={key} name={elem.name} url={elem.url}/>);
      }
    }
    return result;
  },
  render() {
    if (this.props.data.submenu) {
      // Has submenu, return an div element with submenu
      const subMenu = this.createSubMenu();
      return (
        <div className="item">
          {this.props.data.name}
          <div className="menu">
            {subMenu}
          </div>
        </div>
      );
    }
    // No submenu, return an SideBarItem
    return (
      <SideBarItem name={this.props.data.name} url={this.props.data.url}/>
    );
  }
});

const MainSideBar = React.createClass({
  propTypes: {
    menu: React.PropTypes.object
  },
  createSideBar(allItems) {
    const result = [];
    for (const elem in allItems) {
      if (allItems.hasOwnProperty(elem)) {
        result.push(<FirstMenu data={allItems[elem]} key={elem}/>);
      }
    }
    return result;
  },
  render() {
    const menus = this.createSideBar(this.props.menu);
    return (
      <div className="ui vertical menu">
        {menus}
      </div>
    );
  }
});

export default MainSideBar;
