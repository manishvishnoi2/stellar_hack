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

    render(){
        return(
            <Navbar bg="dark" variant="dark" expand="lg">
                <Navbar.Brand href="/">The React-Stellar Demo App</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link href="/balance">Balances</Nav.Link>
                        <Nav.Link href="/payment">Payments</Nav.Link>
                        <Nav.Link href="/dev">Developer</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        )
    }

}

export default CustomNavbar;