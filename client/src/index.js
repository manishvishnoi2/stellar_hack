import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom'
import App from './App';
import Payments from './Components/Payments.Component';
import Balance from './Components/Balance.Component';
import './index.css';
import Dev from './Components/Dev.Component'
import Employer from './Components/Emp.Component'

const routing = (
  <Router>
    <div>
      <Route exact path="/" component={App}/>
      <Route path="/dev" component={Dev} />
      <Route path="/Employers" component={Employer}/>
    </div>
  </Router>
)

ReactDOM.render(
  routing,
  document.getElementById('root')
);
