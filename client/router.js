import React from 'react';
import {Router, browserHistory, Route} from 'react-router';

import AppRoot from './app-root.js';
import Admin   from './admin.js';
import Install from './install.js';
import Login   from './login.js';
import Setting from './setting.js';

const AppRouter = () => {
  return (
    <Router history={browserHistory}>
        <Route path="/admin" component={Admin}/>
        <Route path="/install" component={Install}/>
        <Route path="/setting" component={Setting}/>
        <Route path="/login" component={Login}/>
    </Router>
  );
};

export default AppRouter;
