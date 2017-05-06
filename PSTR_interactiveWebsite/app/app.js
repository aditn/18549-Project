import React from 'react';
import 'style/styles.less';
import {
  Router,
  Route,
  IndexRoute,
}
from 'react-router';
import Basic from './src/basic';
// A custom empty view
import EmptyView from './src/common-components/EmptyView';
// A simple not found page
import NotFound from './src/common-components/NotFound';

// This history is a npm package named 'Histroy'
import createBrowserHistory from 'history/lib/createBrowserHistory';
const history = createBrowserHistory();

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

const routes = (
        <Router history={history}>
            <Route component={MegaWrapper} path="/">
                <IndexRoute component={Basic}/>
            </Route>
            <Route component={NotFound} path="*"/>
        </Router>
);

React.render(routes, document.body);
