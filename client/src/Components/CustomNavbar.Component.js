import React, { Component } from 'react';
import ReactDom from 'react-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import $ from 'jquery';
import Popper from 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import logo from '../logo.svg';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

class CustomNavbar extends Component {

    constructor(props){
        super(props);
        this.state = {
            userType: this.props.userType,
            name: this.props.name,
            balance: 0,
            userType: this.props.userType,
            accountId: this.props.accountId
        }
        this.fetchBalance = this.fetchBalance.bind(this)
    }

    componentDidMount(){
        this.fetchBalance()
        .then(res => this.setState({balance: res.balance}))
        .catch(err => console.log(err));
    }

    fetchBalance  = async () =>{
        const accountId = encodeURIComponent(this.state.accountId);
        const response = await fetch('/balance/'+accountId);
        const body = await response.json();

        if (response.status !== 200) {
            throw Error(body.message)
        }
        return body;
    }

    render(){
        return(
            <Navbar bg="dark" variant="dark" expand="lg">
                <Navbar.Brand href="/">The React-Stellar Demo App</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">

                        {/* <Nav.Link href="/balance">Balances</Nav.Link>
                        <Nav.Link href="/payment">Payments</Nav.Link> */}
                        <Nav.Link href="/Employers">Employers</Nav.Link>
                        <Nav.Link href="/dev">Developers</Nav.Link>
                    </Nav>
                    <Navbar.Collapse className="justify-content-end">
                        <Navbar.Text style={{color: 'white'}}>
                        Signed in as: {this.state.userType},
                        Balance: {this.state.balance}
                        </Navbar.Text>
                    </Navbar.Collapse>
                </Navbar.Collapse>
            </Navbar>
        )
    }

}

export default CustomNavbar;
