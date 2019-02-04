import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from './components/Home';
import Room from './components/Room';

const AppRouter = () => (

  <Router>
    <div>

      <Route path="/" exact component={Home}  />
      <Route path="/r/:id" component={Room}  />

    </div>
  </Router>
);

export default AppRouter;
