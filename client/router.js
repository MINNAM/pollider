import React from 'react';
import {Router, browserHistory, Route} from 'react-router';
/* Pollider */
import {Admin}   from './admin/';
import {Login}   from './login/';

const AppRouter = () => {
  return (
    <Router history={browserHistory}>
        <Route path="/admin" component={Admin}/>
        <Route path="/login" component={Login}/>
    </Router>
  );
};

export default AppRouter;
