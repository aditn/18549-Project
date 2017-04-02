import React from 'react';
import 'style/styles.less';
import {
  Router,
  Route,
  IndexRoute,
}
from 'react-router';
/* This is a npm package named 'Histroy'
 * It is used for tracking of the browser history and does not
 * let the browser fire another http request when re-routing
 */
import createBrowserHistory from 'history/lib/createBrowserHistory';
const history = createBrowserHistory();

// For this app, we assume $ is defined already.
// $ is jquery library.

// User component wrapper
import SMRTCHAR from './src/user-components/SMRTCHAR';
import MainSideBar from './src/user-components/SideBar';
// A simple not found page
import NotFound from './src/common-components/NotFound';
// A TestView that is connected to /test
import TestView from './src/common-components/TestView';
// The unauthorized view
import Unauthorized from './src/common-components/Unauthorized';
// A custom empty view
import EmptyView from './src/common-components/EmptyView';

// Dashboard components
import Overview from
'./src/user-components/Dashboard/Overview/Overview';

// User settings

// System admin

/* Use this to create a general simple wrapper that
 * simply renders all children
 */
class MegaWrapper extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

class DashboardWrapperWithSidebar extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="ui grid" id="content">
        <div className="three wide column" id="sidebar">
          <MainSideBar menu={graphList}/>
        </div>
        <div className="thirteen wide column">
          {this.props.children || 'I just got ****** by react-router'}
        </div>
      </div>
    );
  }
}

// Read a page's GET URL variables and return them as an associative array.
function getUrlVars() {
  var vars = [], hash;
  var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
  for(var i = 0; i < hashes.length; i++)
  {
      hash = hashes[i].split('=');
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
  }
  return vars;
}
/*
 * useage of this function:
 * onEnter={(ns, rs) => { requireAuth(ns, rs, 'admin'/'user')
 */
function requireAuth(nextState, replaceState, roleAsStr) {
  const token = getUrlVars().token;
  if (!Auth.authenticateToken(token)) {
    // Unauthorized
    replaceState({
      nextPathname: nextState.location.pathname
    }, '/unauthorized');
  }else if (token !== undefined) {
    // Hide token
    replaceState({
      nextPathname: nextState.location.pathname
    }, '/');
  }
}

// These are the routes, the Histroy addon helps us stay away from
// trailing texts
const routes = (
    <Router history={history}>
      <Route component={MegaWrapper}>

        <Route component={AdminMain} path="/admin">
          <Route component={ApScan} path="apscan"/>
          <IndexRoute component={ApScan}/>
        </Route>

        <Route component={SMRTCHAR}>
          <Route component={DashboardWrapperWithSidebar} path="/">
            <IndexRoute component={Overview}/>
            <Route component={OverallKpi} path="overall-kpi"/>
            <Route component={StorePerformance} path="store-performance"/>
            <Route component={IndicatorRanking} path="trend"/>
          </Route>

          <Route component={SettingWrapperWithSidebar} path="setting">
            // Then the setting routes
            <Route component={ProjectManagement} path="project-management"/>
            <Route component={SingleProjectPageView} path="project-management/:projectId"/>

            <Route component={StoreManagement} path="store-management">
              <Route component={SingleStoreView} path=":storeId"/>
            </Route>


            <Route component={HardwareManagement} path="hardware-management">
              <Route component={SingleDeviceView} path=":deviceId"/>
            </Route>

            <Route component={GeoSetting} path="geosetting"/>
            <Route component={CustomerSetting} path="customersetting"/>
          </Route>
        </Route>

        <Route component={TestView} path="/test"/>
        <Route component={Unauthorized} path="/unauthorized"/>
        <Route component={NotFound} path="*"/>
      </Route>
    </Router>
);


const t0 = performance.now();
React.render(routes, document.body);
const t1 = performance.now();
console.log('Render time: ' + (t1 - t0) + ' ms');
