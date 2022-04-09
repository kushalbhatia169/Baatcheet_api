import React from 'react';
import { componentsModules } from '../components/index';
import history from './history';
import { BrowserRouter, Switch, Route, HashRouter, Redirect } from 'react-router-dom';

const Router = () => {
  // const isLogin = false;
  return (<>
    <BrowserRouter history={history} forceRefresh={false}>
      <HashRouter>
        <Switch>
          <Route
            exact
            path="/"
            render={() => {
              return (
                // isLogin ?
                //   <Redirect to="/dashboard" /> :
                <Redirect to="/login" />
              );
            }}
          />
          <Route exect path="/login" component={componentsModules['Login']} />
          <Route exect path="/register" component={componentsModules['Register']} />
          <Route exect path="/contacts" component={componentsModules['Contacts']} />
          <Route exect path="/chats" component={componentsModules['Chat']} />
          <Route exect path="/chat/:id" component={componentsModules['Chat']} />
          <Route exect path="/favourites" component={componentsModules['Favourites']} />
          <Route exect path="/pinnedMessages" component={componentsModules['Pinned']} />
          <Route exect path="/status/:id" component={componentsModules['Status']} />
          {/* <Route path='login' component={componentsModules[component]} />; */}
          <Route path="*">
            <NoMatch />
          </Route>
        </Switch>
      </HashRouter>
    </BrowserRouter></>
  );
};

const NoMatch = () => {
  return (
    <Redirect to="/home" />
  );
};
export default Router;