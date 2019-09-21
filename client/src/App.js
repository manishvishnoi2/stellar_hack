import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import $ from 'jquery';
import Popper from 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import logo from './logo.svg';
import './App.css';
import CustomNavbar from './Components/CustomNavbar.Component';

class App extends Component {
  
  constructor(props){
    super(props);
    this.state = {
      data: null,
      balance: 0,
      accountId: '',
    };
    this.checkBalanceCall = this.checkBalanceCall.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleBalanceCheck = this.handleBalanceCheck.bind(this);
  }

  componentDidMount(){
    this.callBackendAPI()
    .then(res => this.setState({ data: res.express }))
    .catch(err => console.log(err))
  }

  handleBalanceCheck(event){
    this.checkBalanceCall()
    .then(res => this.setState({balance: res.balance}))
    .catch(err => console.log(err));
  }

  checkBalanceCall = async () => {
    const accountId = encodeURIComponent(this.state.accountId);
    const response = await fetch('/balance/'+accountId);
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message)
    }
    return body;
  };

  callBackendAPI = async () => {
    const response = await fetch('/hello');
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message) 
    }
    return body;
  };

  handleChange(event){
    this.setState({accountId: event.target.value})
  }

  render() {
    return (
      <div className="App">
        <CustomNavbar/>
        <h2 style={{marginTop: 200}}>Welcome to Stellar Hackathon Demo</h2>
      </div>
    );
  }
}

export default App;
