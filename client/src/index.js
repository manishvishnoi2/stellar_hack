import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom'
import App from './App';
import Payments from './Components/Payments.Component';
import Balance from './Components/Balance.Component';
import './index.css';

const routing = (
  <Router>
    <div>
      <Route exact path="/" component={App}/>
      <Route path="/balance" component={Balance}/>
      <Route path="/payment" component={Payments}/>
    </div>
  </Router>
)

ReactDOM.render(
  routing,
  document.getElementById('root')
);
