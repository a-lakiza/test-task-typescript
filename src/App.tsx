import React from 'react';
import { Route, Switch } from "react-router";

import HomePage from './components/HomePage';
import FormPage from './components/formPage/FormPage';

const App: React.FC = () => {
  return (
    <Switch>
      <Route path='/' exact component={HomePage} />
      <Route path='/form' component={FormPage} />
    </Switch>
  );
}

export default App;
